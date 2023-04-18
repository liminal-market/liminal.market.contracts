# Release.ts

This document provides an in-depth description of the `Release.ts` file, which is a TypeScript code file. The file contains a class named `Release` that is responsible for deploying or upgrading contracts and managing their addresses and roles.

## Table of Contents

- [Class: Release](#class-release)
  - [Constructor](#constructor)
  - [Methods](#methods)
    - [Execute](#execute)
    - [setValuesAndVerify](#setvaluesandverify)
    - [verifyContracts (private)](#verifycontracts-private)

## Class: Release

The `Release` class is responsible for deploying or upgrading contracts, managing their addresses, and setting roles for the contracts.

### Constructor

The constructor takes one parameter:

- `hre: HardhatRuntimeEnvironment` - The Hardhat runtime environment.

### Methods

#### Execute

This method is responsible for deploying or upgrading contracts, setting their addresses, and granting roles to the contracts. It takes no parameters and returns a Promise.

Example usage:

```typescript
const release = new Release(hre);
await release.Execute();
```

#### setValuesAndVerify

This method is responsible for setting contract addresses, granting roles, and verifying the contracts. It takes no parameters and returns a Promise.

Example usage:

```typescript
const release = new Release(hre);
await release.setValuesAndVerify();
```

#### verifyContracts (private)

This private method is responsible for verifying the contracts. It takes the following parameters:

- `kycContract: Contract` - The KYC contract.
- `aUsdContract: Contract` - The aUSD contract.
- `liminalMarketContract: Contract` - The LiminalMarket contract.
- `marketCalendarContract: Contract` - The MarketCalendar contract.
- `lmContract: Contract` - The LM contract.
- `serviceContract: Contract` - The ServiceContract contract.

This method returns a Promise.

Example usage (within the class):

```typescript
await this.verifyContracts(kycContract, aUsdContract, liminalMarketContract, marketCalendarContract, lmContract, serviceContract);
```