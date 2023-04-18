# aUsdTests.ts

This is a test file for the `aUSD` contract. The tests are written using the Chai testing framework, Hardhat, and smock library. The file contains tests for various functionalities of the `aUSD` contract, such as setting the LiminalMarket address, granting and revoking roles for balance, and transferring tokens.

## Table of Contents

- [Test Setup](#test-setup)
- [Test Cases](#test-cases)
  - [Initialize](#initialize)
  - [Set LiminalMarket Address](#set-liminalmarket-address)
  - [Grant and Revoke Role for Balance](#grant-and-revoke-role-for-balance)
  - [Transfer Tokens](#transfer-tokens)

## Test Setup

Before running each test, the contracts are compiled and wallets are created. The `beforeEach` hook is used to redeploy the contracts for each test case.

The following contracts are deployed and initialized:

- `AUSD`
- `KYC`
- `LiminalMarket`
- `LM`
- `MarketCalendar`
- `ServiceContract`

## Test Cases

### Initialize

This test case checks if the `initialize` function is called and should be rejected.

```javascript
it('should call initialize, should be rejected', async () => {
    await TestHelper.initializeRejected(ownerContract);
})
```

### Set LiminalMarket Address

This test case checks if the `setLiminalMarketAddress` function is called without the required role, and should be rejected.

```javascript
it('should try to setLiminalMarket address, does not have role, should be rejected', async () => {
    await expect(contract.setLiminalMarketAddress(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
})
```

### Grant and Revoke Role for Balance

These test cases check if the `grantRoleForBalance` and `revokeRoleForBalance` functions are called without the required role, and should be rejected.

```javascript
it('should try to grantRoleForBalance, does not have role, should be rejected', async () => {
    await expect(contract.grantRoleForBalance(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
})

it('should try to revokeRoleForBalance, does not have role, should be rejected', async () => {
    await expect(contract.revokeRoleForBalance(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
})
```

### Transfer Tokens

This test case checks if the `transfer` function is called when the user does not have enough LM tokens to pay for the service fee, and should revert.

```javascript
it('Call transfer, user does not have LM token to pay for service fee, should revert', async () => {
    let fund = 150 * 10**5;
    let amount = 12 * 10**5;

    let fundResult = await fundAccount(fund);
    expect(fundResult).emit(ownerContract, 'BalanceSet').withArgs(wallet2.address, fund, Fund);

    await expect(contract.transfer(tokenAddress, amount))
        .rejectedWith(await lmContract.NOT_ENOUGH_FOR_SERVICE_FEE())
})
```

This test case checks if the `transfer` function is called and should call the `buyWithAUsd` function on the `LiminalMarket` contract.

```javascript
it('Call transfer method, should call buyWithAUsd on LiminalMarket contract', async () => {
    let fund = 150 * 10**5;
    let amount = 12 * 10**5;

    let fundResult = await fundAccount(fund);

    expect(fundResult).emit(ownerContract, 'BalanceSet').withArgs(wallet2.address, fund, Fund);

    await mintLMToWallet(100 * 10**5);

    let result = await contract.transfer(tokenAddress, amount);
    let balance = await contract.balanceOf(wallet2.address);

    expect(balance).eq(fund - amount)
    expect(result).emit(contract, 'Transfer').withArgs(wallet2.address, tokenAddress, amount);
})
```