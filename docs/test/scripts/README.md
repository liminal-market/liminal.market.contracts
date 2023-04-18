# Documentation: Content of the Folder

This folder is responsible for testing various aspects of the system, including file operations, contract addresses, relayer addresses, and deployment of smart contracts. The tests are organized into separate files and folders, each focusing on a specific functionality.

## Table of Contents

- [FileHelperTest.ts](#filehelpertestts)
- [FundingTest.ts](#fundingtestts)
- [addresses](#addresses)
- [deployment](#deployment)
- [Repository Link](#repository-link)

## FileHelperTest.ts

This is a test file for the `FileHelper` class, which is responsible for handling file operations related to contract addresses and ABIs. The test suite uses the `mocha` testing framework, `chai` for assertions, and `mock-fs` for mocking the file system.

[FileHelperTest.ts Documentation](FileHelperTest.ts)

## FundingTest.ts

This file contains tests for the funding functionality of the system, ensuring that the funding process works as expected and adheres to the necessary requirements.

[FundingTest.ts Documentation](FundingTest.ts)

## addresses

This folder contains files responsible for testing the management of contract addresses and relayer addresses for different networks in the system.

[addresses Documentation](addresses)

## deployment

This folder contains test scripts for the deployment of various smart contracts using the Hardhat framework. The test files are responsible for testing the deployment and upgrade of contracts such as KYC, aUSD, LiminalMarket, MarketCalendar, LM, and ServiceContract, as well as managing and validating roles in a DeFi project.

[deployment Documentation](deployment)

## Repository Link

[/test/scripts](/test/scripts)