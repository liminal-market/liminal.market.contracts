# ContractInfo.ts

This TypeScript file defines a class `ContractInfo` that provides utility methods to interact with different contract addresses and networks. The class imports various contract addresses from different networks and provides methods to get contract information and instantiate contracts using the Hardhat Runtime Environment.

## Table of Contents

- [Usage](#usage)
- [Methods](#methods)
  - [getContractInfo](#getcontractinfo)
  - [getContract](#getcontract)
- [Examples](#examples)

## Usage

To use the `ContractInfo` class, import it into your TypeScript file:

```typescript
import ContractInfo from './ContractInfo';
```

## Methods

### getContractInfo

```typescript
public static getContractInfo(networkName?: string): ContractAddresses
```

This method returns the contract addresses for the specified network. If no network name is provided, it defaults to the localhost network.

**Parameters:**

- `networkName` (optional): The name of the network for which to get the contract addresses.

**Returns:**

- `ContractAddresses`: An instance of the `ContractAddresses` class containing the contract addresses for the specified network.

### getContract

```typescript
public static async getContract<T extends BaseContract>(hre: HardhatRuntimeEnvironment, contractName: string, address: string): Promise<T>
```

This method returns an instance of the specified contract using the provided Hardhat Runtime Environment, contract name, and contract address.

**Parameters:**

- `hre`: The Hardhat Runtime Environment to use for contract instantiation.
- `contractName`: The name of the contract to instantiate.
- `address`: The address of the contract to instantiate.

**Returns:**

- `Promise<T>`: A promise that resolves to an instance of the specified contract.

## Examples

### Get Contract Addresses for a Network

```typescript
import ContractInfo from './ContractInfo';

const networkName = 'polygon';
const contractAddresses = ContractInfo.getContractInfo(networkName);
console.log(contractAddresses);
```

### Instantiate a Contract

```typescript
import {ethers} from 'hardhat';
import ContractInfo from './ContractInfo';

async function main() {
  const contractName = 'MyContract';
  const contractAddress = '0x1234...';
  const myContract = await ContractInfo.getContract(ethers, contractName, contractAddress);
  console.log(myContract);
}

main();
```