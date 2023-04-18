# LiminalMarketExternalService.sol

This is a Solidity code file for the `LiminalMarketExternalService` contract. The contract interacts with the `LiminalMarket` contract to perform operations such as buying and selling security tokens. This documentation will provide a detailed description of the contract, its methods, and usage examples.

## Table of Contents

- [Overview](#overview)
- [Constructor](#constructor)
- [Methods](#methods)
  - [buySecurityToken](#buysecuritytoken)
  - [sellSecurityToken](#sellsecuritytoken)

## Overview

The `LiminalMarketExternalService` contract is designed to interact with the `LiminalMarket` contract. It provides an interface for external services to buy and sell security tokens through the `LiminalMarket` contract.

## Constructor

The constructor of the `LiminalMarketExternalService` contract takes one parameter:

- `address liminalMarketAddress`: The address of the `LiminalMarket` contract.

When the contract is deployed, it initializes an immutable instance of the `LiminalMarket` contract using the provided address.

```solidity
constructor(address liminalMarketAddress) {
    liminalMarket = LiminalMarket(liminalMarketAddress);
}
```

## Methods

### buySecurityToken

The `buySecurityToken` method allows an external service to buy security tokens on behalf of a wallet address. It takes the following parameters:

- `address walletAddress`: The address of the wallet that will receive the security tokens.
- `string memory symbol`: The symbol of the security token to be purchased.
- `uint256 amount`: The amount of security tokens to be purchased.

This method calls the `buySecurityToken` method of the `LiminalMarket` contract with the provided parameters and the address of the `LiminalMarketExternalService` contract.

```solidity
function buySecurityToken(address walletAddress, string memory symbol, uint256 amount) public {
    liminalMarket.buySecurityToken(walletAddress, symbol, amount, address(this));
}
```

### sellSecurityToken

The `sellSecurityToken` method allows an external service to sell security tokens on behalf of a wallet address. It takes the following parameters:

- `address walletAddress`: The address of the wallet that will sell the security tokens.
- `string memory symbol`: The symbol of the security token to be sold.
- `uint quantity`: The quantity of security tokens to be sold.

This method calls the `sellSecurityToken` method of the `LiminalMarket` contract with the provided parameters, the address of the `LiminalMarket.aUsdContract()` and the address of the `LiminalMarketExternalService` contract.

```solidity
function sellSecurityToken(address walletAddress, string memory symbol, uint quantity) public {
    liminalMarket.sellSecurityToken(walletAddress, address(liminalMarket.aUsdContract()), symbol, quantity, address(this));
}
```

## Usage Examples

To use the `LiminalMarketExternalService` contract, you need to deploy it by providing the address of the `LiminalMarket` contract:

```solidity
LiminalMarketExternalService externalService = new LiminalMarketExternalService(liminalMarketAddress);
```

To buy security tokens on behalf of a wallet address:

```solidity
externalService.buySecurityToken(walletAddress, "TOKEN", 100);
```

To sell security tokens on behalf of a wallet address:

```solidity
externalService.sellSecurityToken(walletAddress, "TOKEN", 50);
```