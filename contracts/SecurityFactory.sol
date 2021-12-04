//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./SecurityToken.sol";
import "./ISecurityToken.sol";

contract SecurityFactory is Ownable, AccessControl {

    address public aUsdAddress;
    address public kycAddress;
    mapping(string => address) public securityTokens;

   bytes32 public constant MINT_AND_BURN_ROLE = keccak256("BURN");

	constructor(address _aUsdAddress, address _kycAddress) Ownable() {
        aUsdAddress = _aUsdAddress;
        kycAddress = _kycAddress;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINT_AND_BURN_ROLE, msg.sender);
	}

    event TokenCreated(address tokenAddress, string symbol);

    event SellSecurityToken(string accountId, address recipient,
                            address sender, string symbol, uint amount);

    event BoughtSecurityToken(string symbol, address recipient, uint amount, uint aUsdBalance);

	function getSecurityToken(string memory symbol) public view returns (address) {
		return securityTokens[symbol];
	}


    function sellSecurityToken(string memory accountId, address recipient, address sender, string memory symbol, uint amount) public {
        emit SellSecurityToken(accountId, recipient, sender, symbol, amount);
    }

    function grantMintAndBurnRole(address recipient) public {
        require(msg.sender == owner(), "Only owner can grant roles");
        grantRole(MINT_AND_BURN_ROLE, recipient);
    }

    function mintSecurityTokenAndSetAUsdBalance(string memory symbol, address recipient, uint amount, uint aUsdBalance) public {
        require(hasRole(MINT_AND_BURN_ROLE, msg.sender), "You dont have permission to mint");
        console.log("SecurityFactory - amount:", amount);
        console.log("SecurityFactory - recipient:", recipient);
        console.log("SecurityFactory - symbol:", symbol);
        console.log("SecurityFactory - aUsdBalance:", aUsdBalance);

        if (amount != 0) {
            address tokenAddress = securityTokens[symbol];
            require(tokenAddress != address(0), "Couldn't find symbol address");
    console.log("SecurityToken address:", tokenAddress);

            SecurityToken st = SecurityToken(tokenAddress);
            st.mint(recipient, amount);
    console.log("init aUSD address:", aUsdAddress);
        }
        aUSD ausd = aUSD(aUsdAddress);
        ausd.setBalance(recipient, aUsdBalance);
console.log("DONE, doing emit");
        emit BoughtSecurityToken(symbol, recipient, amount, aUsdBalance);
    }

    function burnSecurityTokenAndSetAUsdBalance(string memory symbol, address recipient, uint amount, uint aUsdBalance) public {
        require(hasRole(MINT_AND_BURN_ROLE, msg.sender), "You dont have permission to mint");

        address tokenAddress = securityTokens[symbol];
        require(tokenAddress != address(0), "Couldn't find symbol address");

        SecurityToken st = SecurityToken(tokenAddress);
        st.burn(recipient, amount);

        aUSD ausd = aUSD(aUsdAddress);
        ausd.setBalance(recipient, aUsdBalance);
    }

    function createToken(string memory name, string memory symbol) external payable returns (address) {
        require(bytes(symbol).length != 0, "Symbol cannot be empty");
        require(securityTokens[symbol] == address(0), "Security token already exists");

		bytes memory byteCode = getBytecode(name, symbol, address(this));
		uint256 salt = 7895324854327894;

        address token = getAddress(byteCode, salt);
		deploy(byteCode, salt);
        securityTokens[symbol] = token;

        emit TokenCreated(token, symbol);

		return token;
    }

	event Deployed(address addr, uint salt);

    // 1. Get bytecode of contract to be deployed
    // NOTE: _owner and _foo are arguments of the TestContract's constructor
    function getBytecode(string memory name, string memory symbol, address factoryAddress)
                private view returns (bytes memory) {
        bytes memory bytecode = type(SecurityToken).creationCode;

        return abi.encodePacked(bytecode, abi.encode(name, symbol, kycAddress, factoryAddress));
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




}
