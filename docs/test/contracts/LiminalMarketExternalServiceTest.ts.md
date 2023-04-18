# LiminalMarketExternalServiceTest.ts

This is a test file for the `LiminalMarketExternalService` smart contract. The file uses the Chai testing framework, Waffle, and Smock to test the functionality of the contract. The tests are written in TypeScript.

## Table of Contents

- [Setup](#setup)
- [Test Cases](#test-cases)
  - [Buy](#buy)
  - [Sell](#sell)

## Setup

The test file imports necessary libraries and sets up the testing environment. It also compiles the smart contracts before running the tests.

```typescript
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {FakeContract, smock} from "@defi-wonderland/smock";
import {Wallet} from "ethers";
import {LiminalMarket, LiminalMarketExternalService} from "../../typechain-types";
```

The `describe` block contains the test cases for the `ServiceContract`:

```typescript
describe('ServiceContract tests', () => {
```

## Test Cases

### Buy

This test case checks if the `buySecurityToken` function of the `LiminalMarketExternalService` contract is called correctly.

```typescript
it('should test buy', async () => {
    await contract.buySecurityToken(wallet3.address, 'AAPL', 100);
    expect(liminalMarketContract.buySecurityToken).to.be.callCount(1);
})
```

### Sell

This test case checks if the `sellSecurityToken` function of the `LiminalMarketExternalService` contract is called correctly.

```typescript
it('should test sell', async () => {
    await contract.sellSecurityToken(wallet3.address, 'AAPL', 32);
    expect(liminalMarketContract.sellSecurityToken).to.be.callCount(1);
})
```

The test cases are run using the `before` and `beforeEach` hooks to set up the environment and redeploy the contracts for each test.

```typescript
before("before running each test", async () => {
    await hre.run('compile');

    [owner, wallet2, wallet3] = waffle.provider.getWallets();
})

beforeEach(async () => {
    await redeployContracts()
})
```

The `redeployContracts` function is responsible for deploying the `LiminalMarketExternalService` contract and connecting it to a fake `LiminalMarket` contract using Smock.

```typescript
const redeployContracts = async () => {
    liminalMarketContract =  await smock.fake<LiminalMarket>('LiminalMarket');

    const contractFactory = await hre.ethers.getContractFactory('LiminalMarketExternalService');
    ownerContract = await contractFactory.deploy(liminalMarketContract.address)

    //since owner will not normally interact with contract,
    // we switch to wallet2 to simplify testing
    contract = ownerContract.connect(wallet2);
}
```