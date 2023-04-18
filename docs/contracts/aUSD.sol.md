# aUSD.sol

The `aUSD.sol` file is a Solidity smart contract that implements a token called "aUSD" which represents USD at a broker. The contract is built using OpenZeppelin's upgradeable contracts and includes features such as pausing, access control, and upgradability. The contract also interacts with another contract called `LiminalMarket`.

## Table of Contents

- [Overview](#overview)
- [Roles and Permissions](#roles-and-permissions)
- [Methods](#methods)
  - [initialize](#initialize)
  - [setLiminalMarketAddress](#setliminalmarketaddress)
  - [grantRoleForBalance](#grantroleforbalance)
  - [revokeRoleForBalance](#revokeroleforbalance)
  - [setBalance](#setbalance)
  - [transfer](#transfer)
  - [transferFrom](#transferfrom)
  - [pause](#pause)
  - [unpause](#unpause)
  - [_authorizeUpgrade](#_authorizeupgrade)
- [Events](#events)
  - [BalanceSet](#balanceset)

## Overview

The `aUSD` contract inherits from the following OpenZeppelin contracts:

- `Initializable`: Ensures that the contract can only be initialized once.
- `ERC20Upgradeable`: Provides the basic functionality of an ERC20 token.
- `PausableUpgradeable`: Allows the contract to be paused and unpaused.
- `AccessControlUpgradeable`: Provides role-based access control.
- `UUPSUpgradeable`: Enables the contract to be upgraded using the UUPS (Universal Upgradeable Proxy Standard) pattern.

The contract also imports and interacts with the `LiminalMarket` contract.

## Roles and Permissions

The contract defines the following roles:

- `SET_BALANCE`: Allows setting the balance of an address.
- `PAUSER_ROLE`: Allows pausing and unpausing the contract.
- `UPGRADER_ROLE`: Allows upgrading the contract.

## Methods

### initialize

Initializes the contract, setting the token name, symbol, and granting the necessary roles to the contract deployer.

```solidity
function initialize() initializer public
```

### setLiminalMarketAddress

Sets the address of the `LiminalMarket` contract.

```solidity
function setLiminalMarketAddress(address liminalMarketAddress) external onlyRole(DEFAULT_ADMIN_ROLE)
```

### grantRoleForBalance

Grants the `SET_BALANCE` role to the specified address.

```solidity
function grantRoleForBalance(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE)
```

### revokeRoleForBalance

Revokes the `SET_BALANCE` role from the specified address.

```solidity
function revokeRoleForBalance(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE)
```

### setBalance

Sets the balance of the specified address to the given amount. This method can only be called by an address with the `SET_BALANCE` role and when the contract is not paused.

```solidity
function setBalance(address recipient, uint256 balance, LiminalMarket.Action action) external onlyRole(SET_BALANCE) whenNotPaused
```

### transfer

Transfers the specified amount of tokens from the sender to the recipient. This method can only be called when the contract is not paused.

```solidity
function transfer(address to, uint256 amount) public virtual whenNotPaused override returns (bool)
```

### transferFrom

Transfers the specified amount of tokens from one address to another, using the allowance mechanism. This method can only be called when the contract is not paused.

```solidity
function transferFrom(address from, address to, uint256 amount) public virtual override whenNotPaused returns (bool)
```

### pause

Pauses the contract. This method can only be called by an address with the `PAUSER_ROLE`.

```solidity
function pause() external onlyRole(PAUSER_ROLE)
```

### unpause

Unpauses the contract. This method can only be called by an address with the `PAUSER_ROLE`.

```solidity
function unpause() external onlyRole(PAUSER_ROLE)
```

### _authorizeUpgrade

Authorizes an upgrade to a new implementation. This method can only be called by an address with the `UPGRADER_ROLE`.

```solidity
function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) onlyProxy override
```

## Events

### BalanceSet

Emitted when the balance of an address is set.

```solidity
event BalanceSet(address recipient, uint256 balance, LiminalMarket.Action action);
```