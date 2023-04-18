# localhost-contract-addresses.ts

This is a TypeScript code file that defines a class `localhostContractAddresses` which implements the `ContractAddresses` interface. The class is used to manage contract addresses for a localhost network.

## Table of Contents

- [Class Description](#class-description)
- [Examples](#examples)
- [Methods](#methods)
  - [getRelayerAddress](#getrelayeraddress)
  - [getLMServiceFeeAddress](#getlmservicefeeaddress)

## Class Description

The `localhostContractAddresses` class is responsible for managing contract addresses on a localhost network. It contains properties for various contract addresses and implements methods to retrieve specific addresses.

## Examples

```typescript
import localhostContractAddresses from "./localhost-contract-addresses";

const contractAddresses = new localhostContractAddresses();

console.log(contractAddresses.KYC_ADDRESS); // "0xA700528a2B9Bd3126c96378b76f2c99f5F0e0F76"
console.log(contractAddresses.getRelayerAddress()); // Returns the relayer address for the localhost network
```

## Methods

### getRelayerAddress

```typescript
getRelayerAddress(): string
```

Returns the relayer address for the localhost network.

#### Example

```typescript
const relayerAddress = contractAddresses.getRelayerAddress();
console.log(relayerAddress); // Returns the relayer address for the localhost network
```

### getLMServiceFeeAddress

```typescript
getLMServiceFeeAddress(): string
```

Returns the LM service fee address for the localhost network.

#### Example

```typescript
const lmServiceFeeAddress = contractAddresses.getLMServiceFeeAddress();
console.log(lmServiceFeeAddress); // Returns the LM service fee address for the localhost network
```