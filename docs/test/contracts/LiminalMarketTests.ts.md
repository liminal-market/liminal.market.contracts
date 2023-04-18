# LiminalMarketTests.ts

This is a test file for the LiminalMarket smart contract. The tests are written using the Chai testing framework, along with the Chai-as-promised, Ethereum Waffle, and Smock libraries. The purpose of these tests is to ensure the correct functionality of the LiminalMarket contract and its associated methods.

## Setup

The test file begins by importing the necessary libraries and contracts. It then sets up the Chai testing framework with the appropriate plugins.

```javascript
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from "ethereum-waffle";
import {FakeContract, smock} from '@defi-wonderland/smock';
import hre, {upgrades} from "hardhat";
import TestHelper from "../TestHelper";
```

## Test Suite

The test suite is defined using the `describe` function, which takes two arguments: a string describing the test suite and a function containing the tests.

```javascript
describe("LiminalMarket", function () {
    // Test setup and individual tests go here
});
```

### Test Setup

Before each test, the LiminalMarket contract is redeployed, and the necessary contracts are mocked using the Smock library. This ensures a clean testing environment for each test.

```javascript
beforeEach(async () => {
    await redeployContract();
})
```

### Test Cases

The test cases are defined using the `it` function, which takes two arguments: a string describing the test case and a function containing the test logic.

#### Example: Test for setAddresses

This test case checks if calling the `setAddresses` method without the appropriate role results in a rejection.

```javascript
it('should call setAddresses, does not have role, should be rejected', async () => {
    await expect(contract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address, lmContract.address))
        .rejectedWith(TestHelper.AccessControlErrorMessage);
})
```

#### Example: Test for createToken

This test case checks if creating a new token with an empty symbol results in a revert.

```javascript
it("creates new token, symbol is empty, should revert", async () => {
    let symbol = "";
    await expect(contract.createToken(symbol)).rejectedWith("Symbol cannot be empty");
})
```

## Conclusion

The LiminalMarketTests.ts file contains a comprehensive test suite for the LiminalMarket smart contract. It ensures that the contract functions as expected and handles edge cases appropriately. By following the structure and examples provided in this file, you can create your own test cases for other smart contracts.