# SecurityToken.sol

The `SecurityToken.sol` file is a Solidity smart contract that extends the functionality of the ERC20 token standard and the Ownable contract from the OpenZeppelin library. It also integrates with the LiminalMarket contract to handle token transfers and balance updates.

## Table of Contents

- [Overview](#overview)
- [Constructor](#constructor)
- [Methods](#methods)
  - [setBalance](#setbalance)
  - [transfer](#transfer)
  - [transferFrom](#transferfrom)
- [Events](#events)
  - [BalanceSet](#balanceset)

## Overview

The `SecurityToken` contract inherits from the `ERC20` and `Ownable` contracts, which provide the basic functionality of an ERC20 token and ownership management, respectively. The contract also has a reference to a `LiminalMarket` contract, which is used to handle token transfers and balance updates.

## Constructor

The constructor takes two parameters:

- `string memory tokenName`: The name of the token.
- `string memory tokenSymbol`: The symbol of the token.

It initializes the `ERC20` contract with the provided token name and symbol and sets the `liminalMarketContract` to the `LiminalMarket` contract deployed by the contract creator (msg.sender).

```solidity
constructor(
    string memory tokenName,
    string memory tokenSymbol
) ERC20(tokenName, tokenSymbol) {
    liminalMarketContract = LiminalMarket(msg.sender);
}
```

## Methods

### setBalance

The `setBalance` method allows the contract owner to set the balance of a specific address. It takes three parameters:

- `address recipient`: The address whose balance will be set.
- `uint256 qty`: The new balance of the recipient.
- `LiminalMarket.Action action`: The action that triggered the balance update.

This method is only callable by the contract owner. It checks if the new balance is different from the current balance and updates it accordingly by minting or burning tokens. It then emits a `BalanceSet` event.

```solidity
function setBalance(address recipient, uint256 qty, LiminalMarket.Action action) external onlyOwner {
    uint256 balance = balanceOf(recipient);
    if (qty == balance) return;

    if (qty > balance) {
        _mint(recipient, qty - balance);
    } else {
        _burn(recipient, balance - qty);
    }

    emit BalanceSet(recipient, qty, action);
}
```

### transfer

The `transfer` method is an override of the `ERC20` transfer method. It takes two parameters:

- `address to`: The recipient address.
- `uint256 amount`: The amount of tokens to transfer.

This method calls the `sellSecurityToken` method of the `liminalMarketContract` to handle the token transfer and returns `true` on success.

```solidity
function transfer(address to, uint256 amount) public virtual override returns (bool) {
    liminalMarketContract.sellSecurityToken(msg.sender, to, symbol(), amount, address(0));
    return true;
}
```

### transferFrom

The `transferFrom` method is an override of the `ERC20` transferFrom method. It takes three parameters:

- `address from`: The address from which the tokens will be transferred.
- `address to`: The recipient address.
- `uint256 amount`: The amount of tokens to transfer.

This method first updates the allowance of the spender and then calls the `sellSecurityToken` method of the `liminalMarketContract` to handle the token transfer. It returns `true` on success.

```solidity
function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
    address spender = _msgSender();
    _spendAllowance(from, spender, amount);

    liminalMarketContract.sellSecurityToken(from, to, symbol(), amount, spender);
    return true;
}
```

## Events

### BalanceSet

The `BalanceSet` event is emitted when the balance of an address is updated using the `setBalance` method. It contains the following parameters:

- `address recipient`: The address whose balance was updated.
- `uint256 amount`: The new balance of the recipient.
- `LiminalMarket.Action action`: The action that triggered the balance update.

```solidity
event BalanceSet(address recipient, uint256 amount, LiminalMarket.Action action);
```