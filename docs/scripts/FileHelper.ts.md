# FileHelper.ts

This is a TypeScript code file that provides a utility class `FileHelper` to handle file operations related to contract addresses and ABI files. The class uses the `fs` and `Handlebars` libraries to read and write files, and manipulate templates.

## Usage

To use the `FileHelper` class, you need to import it and create an instance by passing a `HardhatRuntimeEnvironment` object to the constructor.

```typescript
import FileHelper from './FileHelper';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const hre: HardhatRuntimeEnvironment = ...;
const fileHelper = new FileHelper(hre);
```

## Methods

### constructor(hre: HardhatRuntimeEnvironment)

The constructor initializes a new instance of the `FileHelper` class with the given `HardhatRuntimeEnvironment` object.

### writeContractAddressesToJs(addresses: ContractAddresses): Promise<void>

This method writes the contract addresses to JavaScript files. It takes an instance of `ContractAddresses` as a parameter and writes the addresses to different files based on the network name.

### writeAbiFiles(): Promise<void>

This method writes the ABI files for the `LiminalMarket` and `LiminalMarketExternalService` contracts. It reads the ABI from the contract JSON files and writes them to a single file in the `liminal.market.libraries/javascript/core/src` directory.

### getConstantFile(name: string, addresses: ContractAddresses): string

This method reads a Handlebars template file with the given name and compiles it using the provided `ContractAddresses` object. It returns the compiled template as a string.

### getAbi(contractName: string): any

This method reads the ABI from the contract JSON file with the given contract name. It returns the ABI as a parsed JSON object.

### UpperFirstLetter(NetworkName: string): string

This private method takes a string as input and returns the same string with the first letter capitalized.

## Example

```typescript
import FileHelper from './FileHelper';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import ContractAddresses from './addresses/ContractAddresses';

const hre: HardhatRuntimeEnvironment = ...;
const fileHelper = new FileHelper(hre);

const addresses = new ContractAddresses(...);
await fileHelper.writeContractAddressesToJs(addresses);
await fileHelper.writeAbiFiles();
```

## Notes

- The `FileHelper` class uses the `fs` library for file operations and the `Handlebars` library for template manipulation.
- The `writeContractAddressesToJs` and `writeAbiFiles` methods are asynchronous and return a `Promise<void>`.
- The `getConstantFile` and `getAbi` methods read files from the `./scripts/templates` and `./artifacts/contracts` directories, respectively.
- The `UpperFirstLetter` method is a private utility method used internally by the class.