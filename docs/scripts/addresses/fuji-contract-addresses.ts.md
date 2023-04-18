# fuji-contract-addresses.ts

This is a TypeScript code file that defines a class `fujiContractAddresses` which implements the `ContractAddresses` interface. The class is responsible for managing contract addresses on the Fuji test network. It also imports two other classes, `ContractAddresses` and `FixedAddresses`, which are used to define the structure of the class and provide utility methods for retrieving specific addresses.

## Usage

To use the `fujiContractAddresses` class, you need to import it and create an instance of the class. Here's an example:

```typescript
import fujiContractAddresses from './fuji-contract-addresses';

const fujiAddresses = new fujiContractAddresses();
```

## Class Properties

The `fujiContractAddresses` class has the following properties:

- `ChainId`: The chain ID of the Fuji network (string).
- `NetworkName`: The name of the network (string).
- `IsTestNetwork`: A boolean flag indicating if the network is a test network.
- `KYC_ADDRESS`: The address of the KYC contract (string).
- `AUSD_ADDRESS`: The address of the AUSD contract (string).
- `LIMINAL_MARKET_ADDRESS`: The address of the Liminal Market contract (string).
- `MARKET_CALENDAR_ADDRESS`: The address of the Market Calendar contract (string).
- `LM_ADDRESS`: The address of the LM contract (string).
- `NO_FEE_CONTRACT_ADDRESS`: The address of the No Fee contract (string).
- `SERVICE_CONTRACT_ADDRESS`: The address of the Service contract (string).

## Class Methods

The `fujiContractAddresses` class has the following methods:

### getRelayerAddress(): string

This method returns the relayer address for the Fuji network. It uses the `FixedAddresses.getRelayerAddress()` method with the `NetworkName` property as a parameter.

### getLMServiceFeeAddress(): string

This method returns the LM service fee address for the Fuji network. It uses the `FixedAddresses.getLMServiceFeeAddress()` method with the `NetworkName` property as a parameter.

## Example

Here's an example of how to use the `fujiContractAddresses` class to retrieve contract addresses:

```typescript
import fujiContractAddresses from './fuji-contract-addresses';

const fujiAddresses = new fujiContractAddresses();

console.log('KYC Address:', fujiAddresses.KYC_ADDRESS);
console.log('AUSD Address:', fujiAddresses.AUSD_ADDRESS);
console.log('Relayer Address:', fujiAddresses.getRelayerAddress());
console.log('LM Service Fee Address:', fujiAddresses.getLMServiceFeeAddress());
```

This will output the following:

```
KYC Address: 0x0594D04FDB5C98Fb7F777a799139424Ae2414AaD
AUSD Address: 0xbAc482aE0b0d652854df377be566445984A021ED
Relayer Address: *****
LM Service Fee Address: *****
```

**Note**: The actual addresses for `Relayer Address` and `LM Service Fee Address` have been replaced with `*****` to protect sensitive information.