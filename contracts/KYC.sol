//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";

contract KYC is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{

    bytes32 public constant SET_KYC = keccak256("SET_KYC");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    string public constant ADDRESS_NOT_VALID = "Address is not KYC valid";
    string public constant INVALID_ACCOUNT_ID = "Looks like invalid accountId";

 	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

 	function initialize() public initializer {
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

    function revokeRoleForKyc(address recipient) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SET_KYC, recipient);
    }

    function invalidateAccount(address userAddress)
        public
        onlyRole(SET_KYC)
    {
        delete kycAccount[userAddress];

        emit AccountInvalidated(userAddress);
    }

    function validateAccount(string memory accountId, address userAddress)
        public
        onlyRole(SET_KYC)
        returns (bool)
    {
        require(bytes(accountId).length == 36, INVALID_ACCOUNT_ID);
        require(userAddress != address(0), "Address cannot be zero");

        kycAccount[userAddress] = AccountValidation(accountId, block.timestamp);

        emit AccountValidated(accountId);

        return true;
    }

    function isValid(address userAddress) public view returns (string memory) {
        //TODO: Remove this, this is hardhat test wallet #1
        if (userAddress == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
            return "aee548b2-b250-449c-8d0b-937b0b87ccef";

        AccountValidation memory account = kycAccount[userAddress];

        require(
            bytes(account.accountId).length != 0,
            ADDRESS_NOT_VALID
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
        AccountValidation memory account = kycAccount[userAddress];
        require(
            bytes(account.accountId).length != 0,
            ADDRESS_NOT_VALID
        );
        return account.accountId;
    }

    function _authorizeUpgrade(address newImplementation)
    internal
    onlyRole(DEFAULT_ADMIN_ROLE)
    override
    {
        _upgradeTo(newImplementation);
    }
}
