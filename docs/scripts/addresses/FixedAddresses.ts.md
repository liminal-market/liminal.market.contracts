# FixedAddresses.ts

`FixedAddresses.ts` is a TypeScript code file that exports a class called `FixedAddresses`. This class contains two static methods, `getRelayerAddress` and `getLMServiceFeeAddress`, which return specific addresses based on the input network string.

## Usage

To use the `FixedAddresses` class, you can import it and call its static methods as shown in the examples below:

```typescript
import FixedAddresses from './FixedAddresses';

const relayerAddress = FixedAddresses.getRelayerAddress('mumbai');
console.log(relayerAddress); // Output: 0x7aced305382ac47a901bfda45b9ee6935765708d

const lmServiceFeeAddress = FixedAddresses.getLMServiceFeeAddress('localhost');
console.log(lmServiceFeeAddress); // Output: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
```

## Methods

### getRelayerAddress

This method returns the relayer address for the specified network.

#### Parameters

- `network` (string): The network for which the relayer address is required. Supported networks are 'mumbai', 'fuji', 'bsctest', and 'localhost'.

#### Returns

- (string): The relayer address for the specified network.

### getLMServiceFeeAddress

This method returns the LM service fee address for the specified network.

#### Parameters

- `network` (string): The network for which the LM service fee address is required. Supported networks are 'mumbai', 'fuji', 'bsctest', and 'localhost'.

#### Returns

- (string): The LM service fee address for the specified network.

## Errors

Both methods throw an error if the specified network is not found:

```typescript
throw new Error("Could not find network:" + network);
```

## Supported Networks

The supported networks and their corresponding addresses are as follows:

- Mumbai
  - Relayer Address: 0x7aced305382ac47a901bfda45b9ee6935765708d
  - LM Service Fee Address: 0x56341C4c90B11De4d26971BcaEf3B4D8c3bC0240
- Fuji
  - Relayer Address: 0x54577aff26c37383f33577753501c11c326f2d6f
  - LM Service Fee Address: (empty string)
- BSC Test
  - Relayer Address: 0xfbccca4821b953a29471b743837f6dd48a919d49
  - LM Service Fee Address: (empty string)
- Localhost
  - Relayer Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  - LM Service Fee Address: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199