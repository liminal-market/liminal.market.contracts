# ContractAddresses.ts

This TypeScript file defines an interface called `ContractAddresses`. The interface contains properties and methods related to contract addresses on a blockchain network.

## Interface Description

The `ContractAddresses` interface contains properties that store information about the blockchain network and contract addresses. It also includes methods to retrieve specific contract addresses.

### Properties

- `ChainId`: A string representing the chain ID of the blockchain network.
- `NetworkName`: A string representing the name of the blockchain network.
- `IsTestNetwork`: A boolean indicating whether the network is a test network or not.
- `KYC_ADDRESS`: A string representing the address of the KYC (Know Your Customer) contract.
- `AUSD_ADDRESS`: A string representing the address of the AUSD (Asset-Backed Stablecoin) contract.
- `LIMINAL_MARKET_ADDRESS`: A string representing the address of the Liminal Market contract.
- `MARKET_CALENDAR_ADDRESS`: A string representing the address of the Market Calendar contract.
- `LM_ADDRESS`: A string representing the address of the LM (Liquidity Mining) contract.
- `SERVICE_CONTRACT_ADDRESS`: A string representing the address of the Service Contract.
- `NO_FEE_CONTRACT_ADDRESS`: A string representing the address of the No Fee Contract.

### Methods

- `getRelayerAddress()`: Returns a string representing the address of the relayer contract.
- `getLMServiceFeeAddress()`: Returns a string representing the address of the LM (Liquidity Mining) service fee contract.

## Usage Examples

To use the `ContractAddresses` interface, you can create a class that implements the interface and define the properties and methods accordingly.

```typescript
class MyContractAddresses implements ContractAddresses {
  ChainId = "1";
  NetworkName = "Ethereum";
  IsTestNetwork = false;
  KYC_ADDRESS = "0x*****";
  AUSD_ADDRESS = "0x*****";
  LIMINAL_MARKET_ADDRESS = "0x*****";
  MARKET_CALENDAR_ADDRESS = "0x*****";
  LM_ADDRESS = "0x*****";
  SERVICE_CONTRACT_ADDRESS = "0x*****";
  NO_FEE_CONTRACT_ADDRESS = "0x*****";

  getRelayerAddress(): string {
    return "0x*****";
  }

  getLMServiceFeeAddress(): string {
    return "0x*****";
  }
}
```

You can then create an instance of the class and access its properties and methods:

```typescript
const contractAddresses = new MyContractAddresses();
console.log(contractAddresses.ChainId); // Output: "1"
console.log(contractAddresses.getRelayerAddress()); // Output: "0x*****"
```

## Technical Concepts

- **Interface**: In TypeScript, an interface is a way to define a contract for a class to follow. It specifies the shape of an object, including its properties and methods, without providing an implementation. Classes that implement an interface must define all the properties and methods specified in the interface.

- **Blockchain Network**: A blockchain network is a decentralized, distributed ledger that records transactions across multiple nodes. It consists of a chain of blocks, each containing a list of transactions. Examples of blockchain networks include Ethereum, Binance Smart Chain, and Polygon.

- **Contract Address**: A contract address is a unique identifier for a smart contract deployed on a blockchain network. It is used to interact with the smart contract, such as calling its functions or sending transactions.