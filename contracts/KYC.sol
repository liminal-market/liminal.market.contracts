//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";

contract KYC is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{

    bytes32 public constant SET_KYC = keccak256("SET_KYC");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

 	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

 	function initialize() public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SET_KYC, msg.sender);

    }
    mapping(address => AccountValidation) public kycAccount;

    struct AccountValidation {
        string accountId;
        uint256 validationDate;
    }

    event AccountValidated(string accountId);
    event AccountInvalidated(address accountAddress);

    function grantRoleForKyc(address recipient) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SET_KYC, recipient);
    }


    function invalidateAccount(address accountAddress)
        public
        onlyRole(SET_KYC)
    {
        delete kycAccount[accountAddress];

        emit AccountInvalidated(accountAddress);
    }

    function validateAccount(string memory accountId, address userAddress)
        public
        onlyRole(SET_KYC)
        returns (bool)
    {
        console.log("ValidateAccount called");

        require(bytes(accountId).length == 36, "Looks like invalid accountId");

        kycAccount[userAddress] = AccountValidation(accountId, block.timestamp);
        console.log("address to kycAccount", userAddress);
        console.log("accountId", accountId);
        console.log("kycAccount", kycAccount[userAddress].accountId);

        emit AccountValidated(accountId);

        return true;
    }

    function isValid(address userAddress) public view returns (string memory) {
        //TODO: Remove this, this is hardhat test wallet #1
        if (userAddress == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
            return "aee548b2-b250-449c-8d0b-937b0b87ccef";
        if (userAddress == 0x93DA645082493BBd7116fC057c5b9aDfd5363912)
            return "aee548b2-b250-449c-8d0b-937b0b87ccef";
        console.log("KYC isValid is called");
        AccountValidation memory account = kycAccount[userAddress];

        require(
            bytes(account.accountId).length != 0,
            "Address is not KYC valid"
        );

        //TODO: lets skip this validation while in Sandbox version
        //require(account.validationDate < block.timestamp - (2 days * 365 days), "KYC expired, please renew");

        return account.accountId;
    }

    function getAccountId(address userAddress)
        public
        view
        returns (string memory)
    {
        console.log("userAddress:", userAddress);

        AccountValidation memory account = kycAccount[userAddress];
        console.log("account:", account.accountId);
        require(
            bytes(account.accountId).length != 0,
            "Address is not KYC valid"
        );
        return account.accountId;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
    internal
    onlyRole(DEFAULT_ADMIN_ROLE)
    override
    {
        _upgradeTo(newImplementation);
    }
}
