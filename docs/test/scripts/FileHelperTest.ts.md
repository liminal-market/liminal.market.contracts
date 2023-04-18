# FileHelperTest.ts

This is a test file for the `FileHelper` class, which is responsible for handling file operations related to contract addresses and ABIs. The test suite uses the `mocha` testing framework, `chai` for assertions, and `mock-fs` for mocking the file system.

## Table of Contents

- [Test Suite Setup](#test-suite-setup)
- [Test Cases](#test-cases)
  - [test write contract files](#test-write-contract-files)

## Test Suite Setup

The test suite imports necessary dependencies and sets up the testing environment:

```typescript
import mock from 'mock-fs'
import FileHelper from "../../scripts/FileHelper";
import chai from "chai";
import hre from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import ContractInfo from "../../scripts/addresses/ContractInfo";
import spies from 'chai-spies';
```

Chai plugins are used to extend the functionality of the testing framework:

- `chai-as-promised`: Allows testing of promises.
- `solidity`: Adds support for testing Solidity smart contracts.
- `chai-spies`: Adds support for spying on functions.

## Test Cases

### test write contract files

This test case checks if the `FileHelper` class can correctly write contract files.

```typescript
it("test write contract files", async () => {
    // Mock file system setup
    mock({
        './scripts/templates/': {
            'ContractAddress.contracts.handlebars': '',
            'ContractAddress.cloud.handlebars' : '',
            'Abis.libraries.core.handlebars' : ''
        },
        '../liminal.market.app/src/contracts/': {
            'localhost-contract-addresses.ts' : ''
        },
        '../liminal.market.libraries/javascript/core/src/networks/': {
            'LocalhostNetwork.ts' : ''
        },
        '../liminal.market.app/src/networks/localhost.ts' : '',
        '../liminal.market.cloud/src/networks/localhostContractAddresses.ts' : '',
        './scripts/addresses/' : {},
        './artifacts/contracts/LiminalMarket.sol/' : {
            'LiminalMarket.json' : '{...}'
        },
    });

    // Test logic and assertions
});
```

The test case starts by setting up a mock file system with the necessary directory structure and files. The `LiminalMarket.json` file contains a sample ABI for the LiminalMarket contract.

The test logic and assertions should be added within the test case to verify the correct behavior of the `FileHelper` class when writing contract files.