# KYC.sol

KYC.sol is a Solidity contract that provides Know Your Customer (KYC) functionality for validating and managing user accounts. The contract uses OpenZeppelin's upgradeable contracts for security, access control, and proxy management.

## Table of Contents

- [Overview](#overview)
- [Initialization](#initialization)
- [Account Validation](#account-validation)
- [Role Management](#role-management)
- [Upgrading the Contract](#upgrading-the-contract)

## Overview

The KYC contract stores account validation information in a mapping called `kycAccount`, which maps wallet addresses to `AccountValidation` structs. The `AccountValidation` struct contains an `accountId` and a `validationDate`.

The contract defines several roles for access control:

- `SET_KYC`: Allows the user to validate and invalidate accounts.
- `UPGRADER_ROLE`: Allows the user to upgrade the contract.
- `DEFAULT_ADMIN_ROLE`: Allows the user to manage roles and upgrade the contract.

## Initialization

The `initialize` function initializes the contract and sets up the necessary roles. The contract creator is granted the `DEFAULT_ADMIN_ROLE` and `SET_KYC` roles.

```solidity
function initialize() initializer public {
    __AccessControl_init();
    __UUPSUpgradeable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(SET_KYC, msg.sender);
}
```

## Account Validation

The contract provides functions for validating and invalidating accounts:

- `validateAccount`: Validates an account by setting its `accountId` and `validationDate` in the `kycAccount` mapping. Emits an `AccountValidated` event.

```solidity
function validateAccount(string memory accountId, address walletAddress) external onlyRole(SET_KYC) validAddress(walletAddress) returns (bool)
```

- `invalidateAccount`: Invalidates an account by deleting its entry in the `kycAccount` mapping. Emits an `AccountInvalidated` event.

```solidity
function invalidateAccount(address walletAddress) external onlyRole(SET_KYC) validAddress(walletAddress)
```

- `isValid`: Checks if an account is valid by verifying that its `accountId` is not empty.

```solidity
function isValid(address walletAddress) external view validAddress(walletAddress) returns (string memory)
```

- `getAccountId`: Returns the `accountId` of a valid account.

```solidity
function getAccountId(address walletAddress) external view validAddress(walletAddress) returns (string memory)
```

## Role Management

The contract provides functions for managing the `SET_KYC` role:

- `grantRoleForKyc`: Grants the `SET_KYC` role to a recipient.

```solidity
function grantRoleForKyc(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE)
```

- `revokeRoleForKyc`: Revokes the `SET_KYC` role from a recipient.

```solidity
function revokeRoleForKyc(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE)
```

## Upgrading the Contract

The contract uses OpenZeppelin's UUPS (Universal Upgradeable Proxy Standard) for upgrading. The `_authorizeUpgrade` function is used to authorize an upgrade to a new implementation.

```solidity
function _authorizeUpgrade(address newImplementation) internal onlyRole(DEFAULT_ADMIN_ROLE) onlyProxy override {
    _upgradeTo(newImplementation);
}
```