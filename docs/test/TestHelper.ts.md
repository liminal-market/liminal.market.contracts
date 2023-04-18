# TestHelper.ts

This is a TypeScript code file that provides a utility class `TestHelper` for testing Ethereum smart contracts using the Ethers.js library and Chai assertion library. The class contains helper methods for common tasks such as pausing and unpausing contracts, checking for error messages, and extracting event arguments from transaction receipts.

## Usage Examples

```typescript
import TestHelper from './TestHelper';

// Pause a contract
await TestHelper.pauseContract(contractInstance, accountAddress);

// Unpause a contract
await TestHelper.unPauseContract(contractInstance, accountAddress);

// Check if pausing a contract is rejected
await TestHelper.pauseContractReject(contractInstance);

// Check if unpausing a contract is rejected
await TestHelper.unPauseContractReject(contractInstance);

// Check if initializing a contract is rejected
await TestHelper.initializeRejected(contractInstance);

// Get an argument value from an event in a transaction receipt
const argValue = TestHelper.getArgValueFromEvent(txReceipt, eventName, argName);
```

## Methods

### pauseContract(contract: any, account: string)

Pauses the given contract and checks if the 'Paused' event is emitted with the provided account address.

- `contract`: The contract instance to pause.
- `account`: The account address that should be associated with the 'Paused' event.

### unPauseContract(contract: any, account: string)

Unpauses the given contract and checks if the 'Unpaused' event is emitted with the provided account address.

- `contract`: The contract instance to unpause.
- `account`: The account address that should be associated with the 'Unpaused' event.

### pauseContractReject(contract: any)

Checks if pausing the given contract is rejected with the 'AccessControl: account' error message.

- `contract`: The contract instance to check for pause rejection.

### unPauseContractReject(contract: any)

Checks if unpausing the given contract is rejected with the 'AccessControl: account' error message.

- `contract`: The contract instance to check for unpause rejection.

### initializeRejected(contract: any)

Checks if initializing the given contract is rejected with the 'Initializable: contract is already initialized' error message.

- `contract`: The contract instance to check for initialization rejection.

### getArgValueFromEvent(tx: ContractReceipt, eventName: string, argName: string)

Extracts the value of a specific argument from a specific event in a given transaction receipt.

- `tx`: The transaction receipt containing the event.
- `eventName`: The name of the event to extract the argument from.
- `argName`: The name of the argument to extract the value of.

## Constants

- `LMServiceFeeAddress`: The address of the LM Service Fee (0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199).
- `AccessControlErrorMessage`: The error message for access control issues ('AccessControl: account').
- `OwnableErrorMessage`: The error message for ownable issues ('Ownable: caller is not the owner').
- `PausedErrorMessage`: The error message for paused issues ('Pausable: paused').
- `AddressZero`: The zero address (0x0000000000000000000000000000000000000000).