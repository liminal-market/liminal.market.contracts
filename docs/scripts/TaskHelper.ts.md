# TaskHelper.ts

This file contains a TypeScript class named `TaskHelper` that provides utility methods for interacting with various smart contracts in a Hardhat environment. The class is designed to be used with the Hardhat Runtime Environment (HRE) and includes methods for funding aUSD tokens, setting market calendar as open, executing trades, creating tokens, and creating service contracts.

## Usage

To use the `TaskHelper` class, you need to import it and create an instance by passing the Hardhat Runtime Environment (HRE) to the constructor:

```typescript
import TaskHelper from './TaskHelper';

const taskHelper = new TaskHelper(hre);
```

## Methods

### constructor(hre: HardhatRuntimeEnvironment)

The constructor initializes a new instance of the `TaskHelper` class with the provided Hardhat Runtime Environment (HRE).

### async fundAUSD(contractAddress: string, amount?: string, userWallet?: string)

This method funds the specified amount of aUSD tokens to the user wallet. The default amount is "1000000000000000000000" and the default user wallet is "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".

### async setMarketCalendarAsOpen(contractAddress: string)

This method sets the market calendar as open by providing an array of open and close dates to the `MarketCalendar` contract.

### static GetSigner(hre: HardhatRuntimeEnvironment)

This static method returns the signer for the provided Hardhat Runtime Environment (HRE). It currently returns the default signer, but it can be modified to return a `LedgerSigner` if needed.

### async executeTrade(contractAddress: ContractAddresses)

This method executes a trade on the LiminalMarket contract by transferring aUSD tokens to the security token address and querying the BuyWithAUsd event logs.

### async createToken(contractInfo: ContractAddresses)

This method creates a new token on the LiminalMarket contract with the provided symbol (e.g., 'MSFT').

### async createServiceContract(contractInfo: ContractAddresses)

This method creates a new service contract on the ServiceContract contract with the provided contract addresses and other parameters.

## Technical Concepts

### Hardhat Runtime Environment (HRE)

The Hardhat Runtime Environment (HRE) is an object that contains all the functionality provided by Hardhat and its plugins. It is used to interact with the Ethereum network, compile and deploy smart contracts, and run tests and scripts.

### LedgerSigner

`LedgerSigner` is a class from the `@anders-t/ethers-ledger` package that allows you to use a Ledger hardware wallet as a signer with the Ethers.js library. This can be useful for signing transactions and messages with a more secure hardware wallet instead of a software-based wallet.

### BigNumber

`BigNumber` is a class from the `ethers` package that provides arbitrary-precision arithmetic for working with large numbers in JavaScript. It is used in this file to represent large amounts of aUSD tokens.

### ContractAddresses

`ContractAddresses` is a custom type that represents a collection of contract addresses for various smart contracts used in this file. It includes properties for the aUSD, LiminalMarket, MarketCalendar, and ServiceContract addresses.