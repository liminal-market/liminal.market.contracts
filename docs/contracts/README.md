# Documentation

This documentation provides an in-depth overview of the content of the folder, which is responsible for implementing various smart contracts in the system. The folder contains several Solidity files, each implementing a specific functionality. The documentation is divided into sections with clear headings and subheadings, providing high-level information about each file and folder.

## Table of Contents

- [aUSD.sol](#ausdsol)
- [KYC.sol](#kycsol)
- [LiminalMarket.sol](#liminalmarketsol)
- [LiminalMarketExternalService.sol](#liminalmarketexternalservicesol)
- [LM.sol](#lmsol)
- [MarketCalendar.sol](#marketcalendarsol)
- [MyDeFiService.sol](#mydefiservicesol)
- [SecurityToken.sol](#securitytokensol)
- [ServiceContract.sol](#servicecontractsol)

### aUSD.sol

The `aUSD.sol` file is a Solidity smart contract that implements a token called "aUSD" which represents USD at a broker. The contract is built using OpenZeppelin's upgradeable contracts and includes features such as pausing, access control, and upgradability. The contract also interacts with another contract called `LiminalMarket`.

[Read the full documentation for aUSD.sol](aUSD.sol)

### KYC.sol

KYC.sol is a Solidity contract that provides Know Your Customer (KYC) functionality for validating and managing user accounts. The contract uses OpenZeppelin's upgradeable contracts for security, access control, and proxy management.

[Read the full documentation for KYC.sol](KYC.sol)

### LiminalMarket.sol

LiminalMarket.sol is a Solidity smart contract that provides a decentralized marketplace for trading security tokens. It leverages the OpenZeppelin upgradeable contracts and custom contracts for handling aUSD (a stablecoin), KYC (Know Your Customer) checks, market calendar, and LM (Liminal) tokens.

[Read the full documentation for LiminalMarket.sol](LiminalMarket.sol)

### LiminalMarketExternalService.sol

This is a Solidity code file for the `LiminalMarketExternalService` contract. The contract interacts with the `LiminalMarket` contract to perform operations such as buying and selling security tokens. This documentation will provide a detailed description of the contract, its methods, and usage examples.

[Read the full documentation for LiminalMarketExternalService.sol](LiminalMarketExternalService.sol)

### LM.sol

LM.sol is a Solidity smart contract that implements a custom ERC20 token with additional features such as service fee management, access control, and upgradability. The contract is built using OpenZeppelin's upgradeable contracts and utilizes a separate ServiceContract for managing service fees.

[Read the full documentation for LM.sol](LM.sol)

### MarketCalendar.sol

`MarketCalendar.sol` is a Solidity smart contract that manages a market calendar, allowing users to set and query the market's open and close times. The contract utilizes OpenZeppelin's upgradeable contracts for access control, pausing, and UUPS proxy upgrades.

[Read the full documentation for MarketCalendar.sol](MarketCalendar.sol)

### MyDeFiService.sol

[Read the full documentation for MyDeFiService.sol](MyDeFiService.sol)

### SecurityToken.sol

The `SecurityToken.sol` file is a Solidity smart contract that extends the functionality of the ERC20 token standard and the Ownable contract from the OpenZeppelin library. It also integrates with the LiminalMarket contract to handle token transfers and balance updates.

[Read the full documentation for SecurityToken.sol](SecurityToken.sol)

### ServiceContract.sol

ServiceContract.sol is a Solidity smart contract that manages external services for the Liminal Market platform. It allows users to create, update, and manage service contracts, as well as set and retrieve service fee information. The contract uses OpenZeppelin's upgradeable contracts for security and access control.

[Read the full documentation for ServiceContract.sol](ServiceContract.sol)

---

[Link to the repository](/contracts)