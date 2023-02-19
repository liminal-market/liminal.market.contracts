//SPDX-License-Identifier: Business Source License 1.1
pragma solidity ^0.8.16;

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

    event AccountValidated(string accountId, address walletAddress);
    event AccountInvalidated(address walletAddress);

    modifier validAddress(address walletAddress) {
        require(walletAddress != address(0), ADDRESS_CANNOT_BE_ZERO);
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
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

    function invalidateAccount(address walletAddress) external onlyRole(SET_KYC) validAddress(walletAddress) {
        AccountValidation memory account = kycAccount[walletAddress];

        bytes memory emptyAccountId = bytes(account.accountId);
        require(emptyAccountId.length != 0, ADDRESS_NOT_VALID);

        delete kycAccount[walletAddress];
        emit AccountInvalidated(walletAddress);
    }

    function validateAccount(string memory accountId, address walletAddress) external onlyRole(SET_KYC) validAddress(walletAddress) returns (bool)
    {
        bytes memory byteAccountId = bytes(accountId);
        require(byteAccountId.length == 36, INVALID_ACCOUNT_ID);

        kycAccount[walletAddress] = AccountValidation(accountId, block.timestamp);

        emit AccountValidated(accountId, walletAddress);

        return true;
    }

    function isValid(address walletAddress) external view validAddress(walletAddress) returns (string memory) {
        AccountValidation memory account = kycAccount[walletAddress];

        bytes memory emptyAccountId = bytes(account.accountId);
        require(emptyAccountId.length != 0, ADDRESS_NOT_VALID);

        return account.accountId;
    }

    function getAccountId(address walletAddress) external view validAddress(walletAddress) returns (string memory) {
        AccountValidation memory account = kycAccount[walletAddress];
        require(bytes(account.accountId).length != 0, ADDRESS_NOT_VALID);

        return account.accountId;
    }

    function _authorizeUpgrade(address newImplementation) internal onlyRole(DEFAULT_ADMIN_ROLE) onlyProxy override {
        _upgradeTo(newImplementation);
    }
}