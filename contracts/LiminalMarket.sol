//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "./SecurityToken.sol";
import "./aUSD.sol";
import "./KYC.sol";
import "./MarketCalendar.sol";

contract LiminalMarket is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable  {

    aUSD public aUsdContract;
    KYC public kycContract;
    mapping(string => address) public securityTokens;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    string public constant MARKET_CLOSED = "Market is closed";
    string public constant NOT_ENOUGH_AUSD = "You don't have enough aUSD";
    string public constant ONLY_SEND_TO_AUSD = "You can only send to aUSD token";
    string public constant NOT_VALID_TOKEN_ADDRESS = "This is not valid token address";
    string public constant QUANTITY_MORE_THEN_BALANCE = "Quantity cannot be larger then balance";
    string public constant ADDRESS_CANNOT_BE_ZERO = "Address cannot be zero";
    string public constant ONLY_AUSD_CAN_CALL_ME = "Only aUSD contract can call me";

    MarketCalendar public marketCalendarContract;

    event TokenCreated( address tokenAddress, string symbol);
    event BuyWithAUsd(address userAddress, uint amount, string accountId,
            string symbol, address tokenAddress);
    event SellSecurityToken(string accountId, address recipient,
            address sender, string symbol, uint amount);
    event OrderExecuted(address recipient, string symbol, uint qty,
            uint filledQty, uint filledAvgPrice, string side, uint filledAt,
            uint commission, uint aUsdBalance);
    event Deployed(address addr, uint salt);

 	/// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() external initializer  {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function setAddresses(aUSD _aUsdContract, KYC _kycContract, MarketCalendar _marketCalendarContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        aUsdContract = _aUsdContract;
        kycContract =  _kycContract;
        marketCalendarContract = _marketCalendarContract;
    }

	function getSecurityToken(string memory symbol) public view returns (address) {
		return securityTokens[symbol];
	}

    function buyWithAUsd(address userAddress, address tokenAddress, uint256 amount) external whenNotPaused returns (bool) {
        require(msg.sender == address(aUsdContract), ONLY_AUSD_CAN_CALL_ME);
        require(marketCalendarContract.isMarketOpen(), MARKET_CLOSED);

        uint256 ausdBalance = aUsdContract.balanceOf(userAddress);
        require(ausdBalance >= amount, NOT_ENOUGH_AUSD);

        string memory accountId = kycContract.isValid(userAddress);


        SecurityToken securityToken = SecurityToken(tokenAddress);
        require(securityToken.owner() == address(this), "This is not valid token address");

        string memory symbol = securityToken.symbol();

        aUsdContract.setBalance(userAddress, ausdBalance - amount);

        emit BuyWithAUsd(
            userAddress,
            amount,
            accountId,
            symbol,
            tokenAddress
        );

        return true;

    }

    function sellSecurityToken(address aUsdAddress, address userAddress, string memory symbol, uint quantity)  external whenNotPaused {
        require(aUsdAddress == address(aUsdContract), ONLY_SEND_TO_AUSD);
        require(marketCalendarContract.isMarketOpen(), MARKET_CLOSED);
        require(getSecurityToken(symbol) == msg.sender, NOT_VALID_TOKEN_ADDRESS);

        string memory accountId = kycContract.isValid(userAddress);

        SecurityToken token = SecurityToken(msg.sender);
        uint balance = token.balanceOf(userAddress);
        require(balance >= quantity, QUANTITY_MORE_THEN_BALANCE);

        token.setQuantity(userAddress, balance - quantity);
        emit SellSecurityToken(accountId, aUsdAddress, userAddress, symbol, quantity);
    }

    function grantMintAndBurnRole(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, recipient);
    }

    function revokeMintAndBurnRole(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, recipient);
    }

    function orderExecuted(address recipient, string memory symbol,
            uint qty, uint filledQty, uint filledAvgPrice, string memory side,
            uint filledAt, uint commission, uint aUsdBalance)
                            public whenNotPaused onlyRole(MINTER_ROLE) {
        require(recipient != address(0), ADDRESS_CANNOT_BE_ZERO);

        address tokenAddress = securityTokens[symbol];
        require(tokenAddress != address(0), ADDRESS_CANNOT_BE_ZERO);

        SecurityToken st = SecurityToken(tokenAddress);
        st.setQuantity(recipient, qty);

        aUsdContract.setBalance(recipient, aUsdBalance);
        emit OrderExecuted(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance);
    }

    function createToken(string memory symbol, uint salt) external payable whenNotPaused returns (address) {
        require(bytes(symbol).length != 0, "Symbol cannot be empty");
        require(securityTokens[symbol] == address(0), "Security token already exists");

		bytes memory byteCode = getBytecode("Liminal.market symbol", symbol, address(this));

        address token = getAddress(byteCode, salt);
		deploy(byteCode, salt);
        securityTokens[symbol] = token;

        emit TokenCreated(token, symbol);

		return token;
    }

    // 1. Get bytecode of contract to be deployed
    // NOTE: _owner and _foo are arguments of the TestContract's constructor
    function getBytecode(string memory name, string memory symbol, address factoryAddress)
                private pure returns (bytes memory) {
        bytes memory bytecode = type(SecurityToken).creationCode;

        return abi.encodePacked(bytecode, abi.encode(name, symbol, factoryAddress));
    }

    // 2. Compute the address of the contract to be deployed
    // NOTE: _salt is a random number used to create an address
    function getAddress(bytes memory bytecode, uint _salt)
        private
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );

        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint(hash)));
    }

    // 3. Deploy the contract
    // NOTE:
    // Check the event log Deployed which contains the address of the deployed TestContract.
    // The address in the log should equal the address computed from above.
    function deploy(bytes memory bytecode, uint _salt) private {
        address addr;

        /*
        NOTE: How to call create2

        create2(v, p, n, s)
        create new contract with code at memory p to p + n
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = big-endian 256-bit value
        */
        assembly {
            addr := create2(
                callvalue(), // wei sent with current call
                // Actual code starts after skipping the first 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Load the size of code contained in the first 32 bytes
                _salt // Salt from function arguments
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        emit Deployed(addr, _salt);
    }


    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
    internal
    onlyRole(UPGRADER_ROLE)
    onlyProxy
    override
    {
        _upgradeTo(newImplementation);
    }


}
