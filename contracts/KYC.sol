//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.7;

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

 	function initialize() external initializer {
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

    function grantRoleForKyc(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SET_KYC, recipient);
    }

    function revokeRoleForKyc(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SET_KYC, recipient);
    }

    function invalidateAccount(address userAddress)
    external
        onlyRole(SET_KYC)
    {
        delete kycAccount[userAddress];

        emit AccountInvalidated(userAddress);
    }

    function validateAccount(string memory accountId, address userAddress)
    external
        onlyRole(SET_KYC)
        returns (bool)
    {
        bytes memory byteAccountId = bytes(accountId);
        require(byteAccountId.length == 36, INVALID_ACCOUNT_ID);
        require(userAddress != address(0), "Address cannot be zero");

        kycAccount[userAddress] = AccountValidation(accountId, block.timestamp);

        emit AccountValidated(accountId);

        return true;
    }

    function isValid(address userAddress) external view returns (string memory) {
        //TODO: Remove this, this is hardhat test wallet #1
        if (userAddress == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
            return "aee548b2-b250-449c-8d0b-937b0b87ccef";

        AccountValidation memory account = kycAccount[userAddress];

        bytes memory emptyAccountId = bytes(account.accountId);
        require(
            emptyAccountId.length != 0,
            ADDRESS_NOT_VALID
        );

        return account.accountId;
    }

    function getAccountId(address userAddress)
    external
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
    onlyProxy
    override
    {
        _upgradeTo(newImplementation);
    }
}