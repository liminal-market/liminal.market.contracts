# Documentation: Content of the Folder

This folder contains files responsible for testing the management of contract addresses and relayer addresses for different networks in the system.

## Table of Contents

- [ContractInfoTest.ts](#contractinfotestts)
- [RelayerAddressTest.ts](#relayeraddresstestts)

## ContractInfoTest.ts

This is a code file that contains tests for the `ContractInfo` class. The `ContractInfo` class is responsible for managing contract addresses for different networks. This file uses the `chai` library for assertions and follows the Mocha testing framework.

[Read more about ContractInfoTest.ts](ContractInfoTest.ts)

## RelayerAddressTest.ts

This is a code file that contains a test suite for the `RelayerAddress` class. The test suite ensures that the correct relayer addresses are returned for different networks. The file imports the `FixedAddresses` class from the `scripts/addresses/FixedAddresses` module and uses the `expect` function from the `chai` library for assertions.

[Read more about RelayerAddressTest.ts](RelayerAddressTest.ts)

---

[Link to the repository](/test/scripts/addresses)