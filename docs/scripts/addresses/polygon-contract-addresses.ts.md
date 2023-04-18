# polygon-contract-addresses.ts

This file defines a class `polygonContractAddresses` that implements the `ContractAddresses` interface. The class is responsible for managing contract addresses on the Polygon network. It includes properties for chain ID, network name, test network status, and various contract addresses. Additionally, it provides methods to get the relayer address and the LM service fee address.

## Table of Contents

- [Class Definition](#class-definition)
- [Properties](#properties)
- [Methods](#methods)
  - [getRelayerAddress](#getrelayeraddress)
  - [getLMServiceFeeAddress](#getlmservicefeeaddress)

## Class Definition

```typescript
export default class polygonContractAddresses implements ContractAddresses
```

The `polygonContractAddresses` class implements the `ContractAddresses` interface, which ensures that the class provides the necessary properties and methods for managing contract addresses.

## Properties

- `ChainId`: A string representing the chain ID of the Polygon network. The default value is `"137"`.
- `NetworkName`: A string representing the network name. The default value is `"polygon"`.
- `IsTestNetwork`: A boolean indicating whether the network is a test network. The default value is `false`.
- `KYC_ADDRESS`: A string representing the address of the KYC contract. The default value is `"0xc7dA98E282cc30BD4fe0a7dE38372F876DB577E4"`.
- `AUSD_ADDRESS`: A string representing the address of the AUSD contract. The default value is `"0x9B780e71C2a8492E805e17616EB878f2e3874E21"`.
- `LIMINAL_MARKET_ADDRESS`: A string representing the address of the Liminal Market contract. The default value is `"0x8B4fc0bcaED76a6569525d8Fe51E57cAd32FDd94"`.
- `MARKET_CALENDAR_ADDRESS`: A string representing the address of the Market Calendar contract. The default value is `"0x77b54CbF3e1370af13da41196B4d99cd02eBcC44"`.
- `LM_ADDRESS`: A string representing the address of the LM contract. The default value is an empty string.
- `NO_FEE_CONTRACT_ADDRESS`: A string representing the address of the No Fee contract. The default value is an empty string.
- `SERVICE_CONTRACT_ADDRESS`: A string representing the address of the Service contract. The default value is an empty string.

## Methods

### getRelayerAddress

```typescript
getRelayerAddress(): string
```

This method returns the relayer address for the Polygon network. It calls the `getRelayerAddress` method from the `FixedAddresses` class, passing the `NetworkName` property as an argument.

### getLMServiceFeeAddress

```typescript
getLMServiceFeeAddress(): string
```

This method returns the LM service fee address for the Polygon network. It calls the `getLMServiceFeeAddress` method from the `FixedAddresses` class, passing the `NetworkName` property as an argument.