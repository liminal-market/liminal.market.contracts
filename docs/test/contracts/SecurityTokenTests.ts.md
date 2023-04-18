# SecurityTokenTests.ts

This document provides an in-depth explanation of the `SecurityTokenTests.ts` file, which is a test suite for the `SecurityToken` smart contract. The test suite is written using the Chai assertion library, Waffle, and smock for mocking contracts.

## Table of Contents

- [Setup](#setup)
- [Tests](#tests)
  - [Correct Symbol and Name](#correct-symbol-and-name)
  - [Set Balance Rejection](#set-balance-rejection)
  - [Get and Set Balance](#get-and-set-balance)
  - [Decrease Balance](#decrease-balance)
  - [No Change in Balance](#no-change-in-balance)
  - [Create Order](#create-order)

## Setup

The test suite begins by importing necessary libraries and contracts, and setting up the Chai assertion library with the required plugins. It also initializes variables for wallets and contracts that will be used throughout the tests.

```typescript
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from "ethereum-waffle";
import {Wallet} from 'ethers';
import {FakeContract, smock} from '@defi-wonderland/smock';
import hre, {upgrades} from "hardhat";
import {AUSD, KYC, LiminalMarket, LM, MarketCalendar, SecurityToken} from "../../typechain-types";
import TestHelper from "../TestHelper";
```

## Tests

### Correct Symbol and Name

This test checks if the deployed `SecurityToken` contract has the correct symbol and name.

```typescript
it("should have correct symbol and name after deployment", async () => {
    expect(await contract.symbol()).equal(symbol);
    expect(await contract.name()).equal(name);
});
```

### Set Balance Rejection

This test verifies that a user without the appropriate role cannot set the balance of an account.

```typescript
it('should try to set balance, but doesnt have role, should be rejected', async () => {
    await expect(contract.setBalance(wallet2.address, 100, 1)).rejectedWith(TestHelper.OwnableErrorMessage);
})
```

### Get and Set Balance

This test checks if the balance of an account can be retrieved and set correctly.

```typescript
it("should get balance, should be 0, then setBalance and verify it", async () => {
    let balance = await contract.balanceOf(userAddress);
    expect(balance).equal(0);
    let qty = 100;
    let orderExecutedTx = await liminalContract.orderExecuted('123', userAddress, symbol, qty, 0, 1, 'buy', 2, 10, AddressZero);

    expect(orderExecutedTx)
        .to.emit(ownerContract, "BalanceSet")
        .withArgs(userAddress, qty, OrderExecuted);

    balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty);
})
```

### Decrease Balance

This test verifies that the balance of an account can be decreased correctly.

```typescript
it("should set the balance, to decrease the balance of the account", async () => {
    let qty = 1000000;
    let orderExecutedTx = await liminalContract.orderExecuted('123', userAddress, symbol, qty, 0, 1, 'buy', 2, 10, AddressZero);

    expect(orderExecutedTx)
        .to.emit(ownerContract, "BalanceSet")
        .withArgs(userAddress, qty, OrderExecuted);
    expect(orderExecutedTx).emit(ownerContract, 'Transfer').withArgs(AddressZero, userAddress, qty);

    let balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty);

    let qty2 = 233430;
    let orderExecutedTx2 = await liminalContract.orderExecuted('12355', userAddress, symbol, qty2, 0, 1, 'buy', 2, 10, AddressZero);

    expect(orderExecutedTx2)
        .to.emit(ownerContract, "BalanceSet")
        .withArgs(userAddress, qty2, OrderExecuted);
    expect(orderExecutedTx2).emit(ownerContract, 'Transfer').withArgs(userAddress, AddressZero, qty - qty2);

    balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty2);
});
```

### No Change in Balance

This test checks if no events are emitted when the balance remains unchanged.

```typescript
it("should set the balance what it already is, nothing should happen", async () => {
    let qty = 1000000;
    let orderExecutedTx = await liminalContract.orderExecuted('12323', userAddress, symbol, qty, 0, 1, 'buy', 2, 10, AddressZero);

    expect(orderExecutedTx)
        .to.emit(ownerContract, "BalanceSet")
        .withArgs(userAddress, qty, OrderExecuted);

    let balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty);

    let orderExecutedTx2 = await liminalContract.orderExecuted('123', userAddress, symbol, qty, 0, 1, 'buy', 2, 10, AddressZero);
    expect(orderExecutedTx2)
        .not.to.emit(ownerContract, "BalanceSet");
    expect(orderExecutedTx2)
        .not.to.emit(ownerContract, "Transfer");
});
```

### Create Order

This test verifies that an order can be created for a user address.

```typescript
it("should create order for user address", async () => {
    let tsl = 100;
    let [liminalContract, aUsdContract] = await setupLiminalContract(tsl);

    let order = await liminalContract.createOrder(wallet2.address, symbol, tsl, 10, 10, "buy", 122, 1200, AddressZero);

    expect(order)
        .to.emit(liminalContract, "OrderCreated")
        .withArgs(wallet2.address, symbol, tsl, 10, 10, "buy", 122, 1200, AddressZero);
});
```

This concludes the documentation for the `SecurityTokenTests.ts` file.