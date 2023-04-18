# ServiceContractTest.ts

This is a test file for the `ServiceContract` smart contract. The tests are written using the Chai testing framework, Hardhat, and other related libraries. The purpose of these tests is to ensure the correct functionality of the `ServiceContract` and its methods.

## Table of Contents

- [Setup](#setup)
- [Test Cases](#test-cases)
  - [Initialize](#initialize)
  - [Set Address](#set-address)
  - [Set LM Service Fee Address](#set-lm-service-fee-address)
  - [Set LM Service Fee](#set-lm-service-fee)
  - [Create Contract](#create-contract)
  - [Update Contract](#update-contract)

## Setup

Before running the tests, the following dependencies are imported:

- `chai`
- `hardhat`
- `chai-as-promised`
- `ethereum-waffle`
- `smock`
- `ethers`
- `ServiceContract`
- `TestHelper`

The `describe` block contains the test cases for the `ServiceContract`. The `before` and `beforeEach` hooks are used to set up the environment and redeploy the contracts for each test case.

## Test Cases

### Initialize

This test case checks if the `initialize` function can be called and if it should be rejected.

### Set Address

This test case checks the following scenarios:

- Setting a zero address should fail.
- Updating the LiminalMarket contract address should succeed.
- Updating the LiminalMarket address without the required role should be rejected.

### Set LM Service Fee Address

This test case checks the following scenarios:

- Setting a zero address for the LM service fee should fail.
- Updating the Liminal serviceFee address should succeed.
- Updating the Liminal serviceFee address without the required role should be rejected.

### Set LM Service Fee

This test case checks the following scenarios:

- Checking the default serviceFee and updating the Liminal serviceFee to 500 points.
- Trying to change the LM service fee without the required role should be rejected.

### Create Contract

This test case checks the following scenarios:

- Creating a contract with a zero spenderAddress should create a new smart contract.
- Creating a contract with a zero serviceFeeAddress should be rejected.
- Creating a contract with a DeFi service should succeed.
- Creating another contract with the same service address should be rejected.

### Update Contract

This test case checks the following scenarios:

- Updating a contract with a zero contract address should fail.
- Updating a contract with a DeFi service should succeed.