# Documentation

This folder contains various TypeScript files that define classes and interfaces for managing contract addresses on different blockchain networks. The files are organized into sections, each with a brief description and a link to its own documentation.

## Table of Contents

1. [bsctest-contract-addresses.ts](#bsctest-contract-addresses.ts)
2. [ContractAddresses.ts](#ContractAddresses.ts)
3. [ContractInfo.ts](#ContractInfo.ts)
4. [FixedAddresses.ts](#FixedAddresses.ts)
5. [fuji-contract-addresses.ts](#fuji-contract-addresses.ts)
6. [localhost-contract-addresses.ts](#localhost-contract-addresses.ts)
7. [mumbai-contract-addresses.ts](#mumbai-contract-addresses.ts)
8. [polygon-contract-addresses.ts](#polygon-contract-addresses.ts)

### bsctest-contract-addresses.ts

This is a TypeScript code file that defines a class `bsctestContractAddresses` which implements the `ContractAddresses` interface. The class is used to store and manage contract addresses for the Binance Smart Chain Test Network (bsctest). It also provides methods to get the relayer address and the LM service fee address.

[Read more about bsctest-contract-addresses.ts](bsctest-contract-addresses.ts)

### ContractAddresses.ts

This TypeScript file defines an interface called `ContractAddresses`. The interface contains properties and methods related to contract addresses on a blockchain network.

[Read more about ContractAddresses.ts](ContractAddresses.ts)

### ContractInfo.ts

This TypeScript file defines a class `ContractInfo` that provides utility methods to interact with different contract addresses and networks. The class imports various contract addresses from different networks and provides methods to get contract information and instantiate contracts using the Hardhat Runtime Environment.

[Read more about ContractInfo.ts](ContractInfo.ts)

### FixedAddresses.ts

`FixedAddresses.ts` is a TypeScript code file that exports a class called `FixedAddresses`. This class contains two static methods, `getRelayerAddress` and `getLMServiceFeeAddress`, which return specific addresses based on the input network string.

[Read more about FixedAddresses.ts](FixedAddresses.ts)

### fuji-contract-addresses.ts

This is a TypeScript code file that defines a class `fujiContractAddresses` which implements the `ContractAddresses` interface. The class is responsible for managing contract addresses on the Fuji test network. It also imports two other classes, `ContractAddresses` and `FixedAddresses`, which are used to define the structure of the class and provide utility methods for retrieving specific addresses.

[Read more about fuji-contract-addresses.ts](fuji-contract-addresses.ts)

### localhost-contract-addresses.ts

This is a TypeScript code file that defines a class `localhostContractAddresses` which implements the `ContractAddresses` interface. The class is used to manage contract addresses for a localhost network.

[Read more about localhost-contract-addresses.ts](localhost-contract-addresses.ts)

### mumbai-contract-addresses.ts

This is a TypeScript code file that defines the `mumbaiContractAddresses` class, which implements the `ContractAddresses` interface. This class is responsible for managing contract addresses on the Mumbai test network.

[Read more about mumbai-contract-addresses.ts](mumbai-contract-addresses.ts)

### polygon-contract-addresses.ts

This file defines a class `polygonContractAddresses` that implements the `ContractAddresses` interface. The class is responsible for managing contract addresses on the Polygon network. It includes properties for chain ID, network name, test network status, and various contract addresses. Additionally, it provides methods to get the relayer address and the LM service fee address.

[Read more about polygon-contract-addresses.ts](polygon-contract-addresses.ts)

## Repository Link

[View the repository here](/scripts/addresses)