# ServiceContract.sol

ServiceContract.sol is a Solidity smart contract that manages external services for the Liminal Market platform. It allows users to create, update, and manage service contracts, as well as set and retrieve service fee information. The contract uses OpenZeppelin's upgradeable contracts for security and access control.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Contract Initialization](#contract-initialization)
- [Setting Addresses](#setting-addresses)
- [Service Fee Management](#service-fee-management)
- [Contract Management](#contract-management)
- [Examples](#examples)

## Prerequisites

Before using this contract, make sure you have the following dependencies installed:

- OpenZeppelin Contracts Upgradeable: `@openzeppelin/contracts-upgradeable`
- LiminalMarketExternalService.sol

## Contract Initialization

The `ServiceContract` is initialized using the `initialize()` function, which sets up the necessary roles and initializes the contract with a default service fee of 0.2%.

```solidity
function initialize() initializer public {
    ...
}
```

## Setting Addresses

The contract allows setting the Liminal Market address and the Liminal Market service fee address using the following functions:

```solidity
function setAddress(address liminalMarketAddress) onlyRole(DEFAULT_ADMIN_ROLE) public { ... }

function setLMServiceFeeAddress(address lmAddress) onlyRole(DEFAULT_ADMIN_ROLE) public { ... }
```

## Service Fee Management

The contract allows setting and retrieving the service fee points for the Liminal Market platform. The service fee points are represented as a percentage, with 200 points equal to 0.2% and 5 points equal to 0.005%.

```solidity
function setLMServiceFee(uint points) onlyRole(DEFAULT_ADMIN_ROLE) public { ... }

function getLMServiceFee(uint amount) public view returns (uint) { ... }
```

## Contract Management

The contract provides functions for creating, updating, and managing service contracts. Users can create a new contract, update an existing contract, and set a new owner for a service contract.

```solidity
function createContract(address contractAddress, address serviceFeeAddress, uint serviceFeePoints, string memory name, string memory url)
public whenNotPaused returns (address) { ... }

function updateContract(address contractAddress, address serviceFeeAddress, uint serviceFeePoints, string memory name, string memory url)
public whenNotPaused { ... }

function setServiceContractOwner(address newOwner, address contractAddress) public { ... }
```

## Examples

### Creating a Service Contract

```solidity
address contractAddress = address(0);
address serviceFeeAddress = 0x1234567890123456789012345678901234567890;
uint serviceFeePoints = 100;
string memory name = "Example Service";
string memory url = "https://example.com";

address createdContract = serviceContractInstance.createContract(contractAddress, serviceFeeAddress, serviceFeePoints, name, url);
```

### Updating a Service Contract

```solidity
address contractAddress = 0x1234567890123456789012345678901234567890;
address serviceFeeAddress = 0x0987654321098765432109876543210987654321;
uint serviceFeePoints = 50;
string memory name = "Updated Service";
string memory url = "https://updated.example.com";

serviceContractInstance.updateContract(contractAddress, serviceFeeAddress, serviceFeePoints, name, url);
```

### Setting a New Owner for a Service Contract

```solidity
address newOwner = 0x1234567890123456789012345678901234567890;
address contractAddress = 0x0987654321098765432109876543210987654321;

serviceContractInstance.setServiceContractOwner(newOwner, contractAddress);
```

## Conclusion

ServiceContract.sol is a powerful and flexible smart contract for managing external services on the Liminal Market platform. By leveraging OpenZeppelin's upgradeable contracts, it provides a secure and robust solution for service contract management.