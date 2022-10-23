//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract KYC is Initializable, AccessControlUpgradeable, UUPSUpgradeable {

    mapping(address => AccountValidation) public kycAccount;

    bytes32 public constant SET_KYC = keccak256("SET_KYC");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    string public constant ADDRESS_NOT_VALID = "Address is not KYC valid";
    string public constant INVALID_ACCOUNT_ID = "Looks like invalid accountId";
    string public constant ADDRESS_CANNOT_BE_ZERO = "Address cannot be zero";

    struct AccountValidation {
        string accountId;
        uint256 validationDate;
    }

    event AccountValidated(string accountId, address userAddress);
    event AccountInvalidated(address userAddress);

    modifier validAddress(address userAddress) {
        require(userAddress != address(0), ADDRESS_CANNOT_BE_ZERO);
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() external initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SET_KYC, msg.sender);

    }

    function grantRoleForKyc(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SET_KYC, recipient);
    }

    function revokeRoleForKyc(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SET_KYC, recipient);
    }

    function invalidateAccount(address userAddress) external onlyRole(SET_KYC) validAddress(userAddress) {
        delete kycAccount[userAddress];
        emit AccountInvalidated(userAddress);
    }

    function validateAccount(string memory accountId, address userAddress) external onlyRole(SET_KYC) validAddress(userAddress) returns (bool)
    {
        bytes memory byteAccountId = bytes(accountId);
        require(byteAccountId.length == 36, INVALID_ACCOUNT_ID);

        kycAccount[userAddress] = AccountValidation(accountId, block.timestamp);

        emit AccountValidated(accountId, userAddress);

        return true;
    }

    function isValid(address userAddress) external view validAddress(userAddress) returns (string memory) {
        AccountValidation memory account = kycAccount[userAddress];

        bytes memory emptyAccountId = bytes(account.accountId);
        require(emptyAccountId.length != 0, ADDRESS_NOT_VALID);

        return account.accountId;
    }

    function getAccountId(address userAddress) external view validAddress(userAddress) returns (string memory) {
        AccountValidation memory account = kycAccount[userAddress];
        require(bytes(account.accountId).length != 0, ADDRESS_NOT_VALID);

        return account.accountId;
    }

    function _authorizeUpgrade(address newImplementation) internal onlyRole(DEFAULT_ADMIN_ROLE) onlyProxy override {
        _upgradeTo(newImplementation);
    }
}