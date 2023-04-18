# LiminalMarket.sol

LiminalMarket.sol is a Solidity smart contract that provides a decentralized marketplace for trading security tokens. It leverages the OpenZeppelin upgradeable contracts and custom contracts for handling aUSD (a stablecoin), KYC (Know Your Customer) checks, market calendar, and LM (Liminal) tokens.

## Table of Contents

- [Overview](#overview)
- [Roles](#roles)
- [Methods](#methods)
  - [initialize](#initialize)
  - [setAddresses](#setaddresses)
  - [getSecurityToken](#getsecuritytoken)
  - [buySecurityToken](#buysecuritytoken)
  - [buyWithAUsd](#buywithausd)
  - [sellSecurityToken](#sellsecuritytoken)
- [Events](#events)
- [Error Messages](#error-messages)

## Overview

The LiminalMarket contract allows users to buy and sell security tokens using aUSD stablecoin. It also handles the creation of new security tokens and manages the roles and permissions for pausing, minting, and upgrading the contract.

## Roles

The contract defines the following roles:

- `PAUSER_ROLE`: Allows pausing and unpausing the contract.
- `MINTER_ROLE`: Allows minting new tokens.
- `UPGRADER_ROLE`: Allows upgrading the contract using UUPS (Universal Upgradeable Proxy Standard).

## Methods

### initialize

```solidity
function initialize() initializer public
```

Initializes the contract, setting up the roles and permissions.

### setAddresses

```solidity
function setAddresses(aUSD aUsdAddress, KYC kycAddress, MarketCalendar marketCalendarAddress, LM lmTokenAddress) external onlyRole(DEFAULT_ADMIN_ROLE)
```

Sets the addresses for the aUSD, KYC, MarketCalendar, and LM contracts.

- `aUsdAddress`: The address of the aUSD contract.
- `kycAddress`: The address of the KYC contract.
- `marketCalendarAddress`: The address of the MarketCalendar contract.
- `lmTokenAddress`: The address of the LM token contract.

### getSecurityToken

```solidity
function getSecurityToken(string memory symbol) public view returns (address)
```

Returns the address of the security token with the given symbol.

- `symbol`: The symbol of the security token.

### buySecurityToken

```solidity
function buySecurityToken(address walletAddress, string memory symbol, uint256 amount, address spender) external whenNotPaused
```

Buys the security token with the given symbol using aUSD. If the security token does not exist, it creates a new one.

- `walletAddress`: The address of the buyer's wallet.
- `symbol`: The symbol of the security token.
- `amount`: The amount of aUSD to spend.
- `spender`: The address of the spender (optional).

### buyWithAUsd

```solidity
function buyWithAUsd(address walletAddress, address tokenAddress, uint256 amount, address spender) public whenNotPaused
```

Buys the security token with the given token address using aUSD.

- `walletAddress`: The address of the buyer's wallet.
- `tokenAddress`: The address of the security token.
- `amount`: The amount of aUSD to spend.
- `spender`: The address of the spender (optional).

### sellSecurityToken

```solidity
function sellSecurityToken(address walletAddress, address aUsdAddress, string memory symbol, uint quantity, address spender) public whenNotPaused
```

Sells the security token with the given symbol for aUSD.

- `walletAddress`: The address of the seller's wallet.
- `aUsdAddress`: The address of the aUSD contract.
- `symbol`: The symbol of the security token.
- `quantity`: The quantity of security tokens to sell.
- `spender`: The address of the spender (optional).

## Events

- `TokenCreated`: Emitted when a new security token is created.
- `BuyWithAUsd`: Emitted when a security token is bought with aUSD.
- `SellSecurityToken`: Emitted when a security token is sold for aUSD.
- `OrderExecuted`: Emitted when an order is executed.
- `OrderFailed`: Emitted when an order fails.

## Error Messages

- `MARKET_CLOSED`: The market is closed.
- `NOT_ENOUGH_AUSD`: The buyer does not have enough aUSD.
- `ONLY_SEND_TO_AUSD`: The recipient must be the aUSD contract.
- `NOT_VALID_TOKEN_ADDRESS`: The token address is not valid.
- `QUANTITY_MORE_THEN_BALANCE`: The quantity cannot be larger than the balance.
- `ADDRESS_CANNOT_BE_ZERO`: The address cannot be zero.
- `ONLY_AUSD_CAN_CALL_ME`: Only the aUSD contract can call this method.
- `SYMBOL_CANNOT_BE_EMPTY`: The symbol cannot be empty.
- `TOKEN_ALREADY_EXISTS`: The security token already exists.
- `TOKEN_NAME`: The name of the Liminal.market symbol.