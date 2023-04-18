# Documentation

This documentation provides an in-depth overview of the content of the folder. The folder is responsible for storing template files that are used to generate various classes and configurations related to smart contracts on the Ethereum blockchain.

## Sections

- [Abis.libraries.core.handlebars](#abislibrariescorehandlebars)
- [ContractAddress.cloud.handlebars](#contractaddresscloudhandlebars)
- [ContractAddress.contracts.handlebars](#contractaddresscontractshandlebars)
- [ContractAddress.libraries.handlebars](#contractaddresslibrarieshandlebars)

### Abis.libraries.core.handlebars

This is a template file that exports a class named `Abis`. The class contains static properties that store ABI (Application Binary Interface) data for various smart contracts. ABI is an essential part of interacting with smart contracts on the Ethereum blockchain, as it defines the contract's functions and events.

#### Template Variables

### ContractAddress.cloud.handlebars

This is a template file for generating a JavaScript class that extends the `Network` class and contains contract addresses for a specific network. The template uses Handlebars syntax to replace variables with actual values.

#### Variables

### ContractAddress.contracts.handlebars

This is a Handlebars template file that generates a TypeScript class for managing contract addresses on a specific blockchain network. The generated class will implement the `ContractAddresses` interface and use the `FixedAddresses` class for some of its methods.

#### Template Variables

### ContractAddress.libraries.handlebars

This is a Handlebars template file that generates a class for a specific network with default contract addresses. The generated class extends a base class containing default network settings.

#### Template Variables

## Repository Link

[scripts/templates](/scripts/templates)