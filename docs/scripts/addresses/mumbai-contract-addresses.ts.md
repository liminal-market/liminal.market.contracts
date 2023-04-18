# mumbai-contract-addresses.ts

This is a TypeScript code file that defines the `mumbaiContractAddresses` class, which implements the `ContractAddresses` interface. This class is responsible for managing contract addresses on the Mumbai test network.

## Table of Contents

- [Class Description](#class-description)
- [Examples](#examples)
- [Methods](#methods)
  - [getRelayerAddress](#getrelayeraddress)
  - [getLMServiceFeeAddress](#getlmservicefeeaddress)

## Class Description

The `mumbaiContractAddresses` class contains properties and methods related to contract addresses on the Mumbai test network. It implements the `ContractAddresses` interface, ensuring that it provides the necessary functionality for managing contract addresses.

The class has the following properties:

- `ChainId`: The chain ID of the Mumbai test network.
- `NetworkName`: The name of the Mumbai test network.
- `IsTestNetwork`: A boolean value indicating whether this is a test network or not.
- `KYC_ADDRESS`: The address of the KYC contract.
- `AUSD_ADDRESS`: The address of the AUSD contract.
- `LIMINAL_MARKET_ADDRESS`: The address of the Liminal Market contract.
- `MARKET_CALENDAR_ADDRESS`: The address of the Market Calendar contract.
- `LM_ADDRESS`: The address of the LM contract.
- `SERVICE_CONTRACT_ADDRESS`: The address of the Service Contract.
- `NO_FEE_CONTRACT_ADDRESS`: The address of the No Fee Contract.

## Examples

```typescript
import mumbaiContractAddresses from "./mumbai-contract-addresses";

const mumbaiAddresses = new mumbaiContractAddresses();

console.log(mumbaiAddresses.KYC_ADDRESS); // Output: 0xA5C844558a93590A32D1110D7031531A0bBf0773
console.log(mumbaiAddresses.getRelayerAddress()); // Output: Relayer address based on the network name
```

## Methods

### getRelayerAddress

```typescript
getRelayerAddress(): string
```

This method returns the relayer address for the Mumbai test network. It does not take any parameters.

**Example:**

```typescript
const relayerAddress = mumbaiAddresses.getRelayerAddress();
console.log(relayerAddress); // Output: Relayer address based on the network name
```

### getLMServiceFeeAddress

```typescript
getLMServiceFeeAddress(): string
```

This method returns the LM service fee address for the Mumbai test network. It does not take any parameters.

**Example:**

```typescript
const lmServiceFeeAddress = mumbaiAddresses.getLMServiceFeeAddress();
console.log(lmServiceFeeAddress); // Output: LM service fee address based on the network name
```