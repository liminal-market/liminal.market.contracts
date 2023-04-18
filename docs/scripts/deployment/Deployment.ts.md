# Deployment.ts

This is a TypeScript code file that contains the `Deployment` class. The class is responsible for deploying and upgrading smart contracts on the Ethereum blockchain using the Hardhat framework and Ethers.js library.

## Table of Contents

- [Class: Deployment](#class-deployment)
  - [Constructor](#constructor)
  - [Methods](#methods)
    - [deployContract](#deploycontract)
    - [deployOrUpgradeContract](#deployorupgradecontract)
    - [contractExistsOnChain](#contractexistsonchain)
    - [setAddresses](#setaddresses)

## Class: Deployment

### Constructor

The constructor takes a single parameter:

- `hre: HardhatRuntimeEnvironment` - The Hardhat runtime environment.

### Methods

#### deployContract

This method deploys a new smart contract.

- Parameters:
  - `contractName: string` - The name of the contract to be deployed.
  - `constrArgs: any` - The constructor arguments for the contract.
- Returns: `Promise<Contract>` - A promise that resolves to the deployed contract instance.

#### deployOrUpgradeContract

This method deploys a new smart contract or upgrades an existing one.

- Parameters:
  - `contractName: string` - The name of the contract to be deployed or upgraded.
  - `preexistingAddress: string` - The address of the existing contract to be upgraded (if any).
- Returns: `Promise<[Contract, string]>` - A promise that resolves to a tuple containing the deployed or upgraded contract instance and a string indicating the deployment status ('deployed' or 'upgraded').

#### contractExistsOnChain

This method checks if a contract exists on the blockchain.

- Parameters:
  - `contractName: string` - The name of the contract to check.
  - `address: string` - The address of the contract to check.
- Returns: `Promise<boolean>` - A promise that resolves to a boolean indicating whether the contract exists on the blockchain.

#### setAddresses

This method sets the addresses for various contracts in the system.

- Parameters:
  - `contractInfo: ContractAddresses` - An object containing the addresses of various contracts.
  - `liminalMarketContract: LiminalMarket | FakeContract<LiminalMarket>` - The LiminalMarket contract instance.
  - `aUsdContract: AUSD | FakeContract<AUSD>` - The AUSD contract instance.
  - `LMContract: LM | FakeContract<LM>` - The LM contract instance.
  - `ServiceContract: ServiceContract | FakeContract<ServiceContract>` - The ServiceContract instance.
- Returns: `Promise<void>` - A promise that resolves when the addresses have been set.

## Example Usage

```typescript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import Deployment from "./Deployment";

async function main() {
  const hre: HardhatRuntimeEnvironment = ...; // Initialize the Hardhat runtime environment
  const deployment = new Deployment(hre);

  // Deploy a new contract
  const contractName = "MyContract";
  const constrArgs = ["arg1", "arg2"];
  const deployedContract = await deployment.deployContract(contractName, constrArgs);
  console.log("Deployed contract address:", deployedContract.address);

  // Deploy or upgrade a contract
  const preexistingAddress = "0x1234...";
  const [upgradedContract, status] = await deployment.deployOrUpgradeContract(contractName, preexistingAddress);
  console.log("Upgraded contract address:", upgradedContract.address, "Status:", status);
}
```