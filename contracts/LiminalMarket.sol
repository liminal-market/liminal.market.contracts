//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./SecurityToken.sol";
import "./aUSD.sol";
import "./KYC.sol";

contract LiminalMarket is Initializable, PausableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable  {

    aUSD public aUsdContract;
    KYC public kycContract;
    mapping(string => address) public securityTokens;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

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

    function initialize() public initializer  {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }




    function setAddresses(aUSD _aUsdContract, KYC _kycContract) public onlyRole(DEFAULT_ADMIN_ROLE) {
        aUsdContract = _aUsdContract;
        kycContract =  _kycContract;
    }

	function getSecurityToken(string memory symbol) public view returns (address) {
		return securityTokens[symbol];
	}




    function buyWithAUsd(address userAddress, address tokenAddress, uint256 amount) public whenNotPaused returns (bool) {
        uint256 ausdBalance = aUsdContract.balanceOf(userAddress);
        require(ausdBalance >= amount, "You don't have enough aUSD");

        string memory accountId = kycContract.isValid(userAddress);

        aUsdContract.setBalance(userAddress, ausdBalance - amount);
console.log("Token address:", tokenAddress);
        SecurityToken securityToken = SecurityToken(tokenAddress);
        string memory symbol = securityToken.symbol();

        emit BuyWithAUsd(
            userAddress,
            amount,
            accountId,
            symbol,
            tokenAddress
        );

        return true;

    }

    function sellSecurityToken(address recipient, address sender, string memory symbol, uint amount)  public whenNotPaused {
        require(recipient == address(aUsdContract), "V0.1 doesn't support transfer");

        string memory accountId = kycContract.isValid(sender);

        SecurityToken token = SecurityToken(msg.sender);
        token.burn(sender, amount);

        emit SellSecurityToken(accountId, recipient, sender, symbol, amount);
    }

    function grantMintAndBurnRole(address recipient) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, recipient);
    }

    function orderExecuted(address recipient, string memory symbol,
            uint qty, uint filledQty, uint filledAvgPrice, string memory side,
            uint filledAt, uint commission, uint aUsdBalance)
                            public whenNotPaused onlyRole(MINTER_ROLE) {
        require(recipient != address(0), "Address cannot be zero");

        console.log("SecurityFactory - qty:", qty);
        console.log("SecurityFactory - recipient:", recipient);
        console.log("SecurityFactory - symbol:", symbol);
        console.log("SecurityFactory - aUsdBalance:", aUsdBalance);

        if (qty != 0) {
            address tokenAddress = securityTokens[symbol];
            require(tokenAddress != address(0), "Couldn't find symbol address");
    console.log("SecurityToken address:", tokenAddress);

            SecurityToken st = SecurityToken(tokenAddress);
            st.setQuantity(recipient, qty);
        }

        aUsdContract.setBalance(recipient, aUsdBalance);
console.log("DONE, doing emit");
        emit OrderExecuted(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance);
    }



    function createToken(string memory symbol) external payable whenNotPaused returns (address) {
        require(bytes(symbol).length != 0, "Symbol cannot be empty");
        require(securityTokens[symbol] == address(0), "Security token already exists");

		bytes memory byteCode = getBytecode("Liminal.market symbol", symbol, address(this));
		uint256 salt = 7895324854327894;

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


    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
    internal
    onlyRole(UPGRADER_ROLE)
    override
    {
        _upgradeTo(newImplementation);
    }


}
