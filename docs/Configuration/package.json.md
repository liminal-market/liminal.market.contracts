# Liminal.market.contracts Configuration File

This configuration file is specifically for developers working on the `liminal.market.contracts` project. If you are using `liminal.market.contracts` as a package in your project, this file is not relevant to you.

## Overview

The `liminal.market.contracts` project contains smart contracts for Liminal.market. The execution of these contracts represents a trading order going through the system, buying and selling stocks & ETFs at the broker. `aUSD` represents the dollar value at the broker, and `SecurityToken` represents each stock traded in the system.

## Repository and Issues

The project repository is hosted on GitHub at the following URL:

```
https://github.com/liminal-market/liminal.market.contracts
```

To report bugs or issues, please use the GitHub issues page:

```
https://github.com/liminal-market/liminal.market.contracts/issues
```

## Homepage

The project homepage can be found at:

```
https://liminal.market
```

## Dependencies

The configuration file lists both development dependencies and regular dependencies required for the project. These include various Hardhat plugins, TypeChain, Ethers, OpenZeppelin contracts, and more.

## Scripts

The configuration file also contains various scripts for tasks such as testing, deploying, and compiling the contracts. Some of the available scripts include:

- `test`: Run tests with coverage reporting
- `hardhat`: Start a Hardhat node
- `deploy-local`: Deploy contracts to a local network
- `deploy-mumbai`: Deploy contracts to the Mumbai network
- `deploy-fuji`: Deploy contracts to the Fuji network
- `verify-fuji`: Verify contracts on the Fuji network
- `setroles-mumbai`: Set roles on the Mumbai network
- `setaddress-mumbai`: Set addresses on the Mumbai network
- `fund`: Get aUSD on the local network
- `createToken`: Create a new token on the local network
- `cal`: Set calendar on the local network
- `executeTrade`: Execute a buy order on the local network
- `compile`: Compile the contracts
- `coverage`: Run coverage tests
- `setup-test`: Set up tests on the local network
- `set-values`: Set values on a specified network
- `remove-console`: Remove console logs from the contracts

To run any of these scripts, use the `npm run` command followed by the script name, for example:

```
npm run test
```