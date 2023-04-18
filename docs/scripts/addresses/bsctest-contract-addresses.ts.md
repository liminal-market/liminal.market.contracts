# bsctest-contract-addresses.ts

This is a TypeScript code file that defines a class `bsctestContractAddresses` which implements the `ContractAddresses` interface. The class is used to store and manage contract addresses for the Binance Smart Chain Test Network (bsctest). It also provides methods to get the relayer address and the LM service fee address.

## Table of Contents

- [Class Definition](#class-definition)
- [Properties](#properties)
- [Methods](#methods)
  - [getRelayerAddress](#getrelayeraddress)
  - [getLMServiceFeeAddress](#getlmservicefeeaddress)

## Class Definition

```typescript
export default class bsctestContractAddresses implements ContractAddresses
```

The `bsctestContractAddresses` class implements the `ContractAddresses` interface, which ensures that the class has the required properties and methods.

## Properties

The class has the following properties:

- `ChainId`: A string representing the chain ID of the Binance Smart Chain Test Network (bsctest). The value is set to "97".
- `NetworkName`: A string representing the name of the network. The value is set to "bsctest".
- `IsTestNetwork`: A boolean indicating whether the network is a test network. The value is set to `true`.
- `KYC_ADDRESS`: A string representing the address of the KYC contract. The value is set to "0x0B263ab693FAB0CaA06EbbF33395eD90b6b0bCec".
- `AUSD_ADDRESS`: A string representing the address of the AUSD contract. The value is set to "0xD1FCCdC474a3708B44C2F4F5C7De8C34328cD203".
- `LIMINAL_MARKET_ADDRESS`: A string representing the address of the Liminal Market contract. The value is set to "0xcD5FD1e5A49F474d26c535962C0eb2a680250904".
- `MARKET_CALENDAR_ADDRESS`: A string representing the address of the Market Calendar contract. The value is set to an empty string.
- `LM_ADDRESS`: A string representing the address of the LM contract. The value is set to an empty string.
- `NO_FEE_CONTRACT_ADDRESS`: A string representing the address of the No Fee contract. The value is set to an empty string.
- `SERVICE_CONTRACT_ADDRESS`: A string representing the address of the Service contract. The value is set to an empty string.

## Methods

### getRelayerAddress

```typescript
public getRelayerAddress(): string
```

This method returns the relayer address for the Binance Smart Chain Test Network (bsctest). It calls the `getRelayerAddress` method from the `FixedAddresses` class with the `NetworkName` property as a parameter.

### getLMServiceFeeAddress

```typescript
getLMServiceFeeAddress(): string
```

This method returns the LM service fee address for the Binance Smart Chain Test Network (bsctest). It calls the `getLMServiceFeeAddress` method from the `FixedAddresses` class with the `NetworkName` property as a parameter.