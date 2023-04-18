# ContractInfoTest.ts

This is a code file that contains tests for the `ContractInfo` class. The `ContractInfo` class is responsible for managing contract addresses for different networks. This file uses the `chai` library for assertions and follows the Mocha testing framework.

## Table of Contents

- [Examples](#examples)
- [Methods](#methods)
  - [getAllNetworksAvailable](#getallnetworksavailable)
  - [convertHardhatNetworkNameToLocalhost](#converthardhatnetworknametolocalhost)

## Examples

Here are some examples of how to use the `ContractInfoTest` class:

```javascript
import ContractInfoTest from "./path/to/ContractInfoTest";

// Instantiate the ContractInfoTest class
const contractInfoTest = new ContractInfoTest();

// Test all networks available
contractInfoTest.getAllNetworksAvailable();

// Test conversion of hardhat network name to localhost
contractInfoTest.convertHardhatNetworkNameToLocalhost();
```

## Methods

### getAllNetworksAvailable

This method tests the `getContractInfo` method of the `ContractInfo` class for all available networks. It checks if the contract addresses for AUSD, KYC, and LIMINAL_MARKET are valid by ensuring they start with '0x'.

**Parameters**: None

### convertHardhatNetworkNameToLocalhost

This method tests the `getContractInfo` method of the `ContractInfo` class for the "hardhat" network. It checks if the network name is correctly converted to "localhost".

**Parameters**: None