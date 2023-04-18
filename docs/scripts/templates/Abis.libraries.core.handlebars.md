# Abis.libraries.core.handlebars

This is a template file that exports a class named `Abis`. The class contains static properties that store ABI (Application Binary Interface) data for various smart contracts. ABI is an essential part of interacting with smart contracts on the Ethereum blockchain, as it defines the contract's functions and events.

## Template Variables

The template file uses the following variables:

- `liminalMarketExternalServiceAbi`
- `liminalMarketAbi`
- `balanceOfAbi`

These variables should be replaced with the respective ABI data before using the class.

## Template File

Here is the content of the template file with the variables:

```javascript
export default class Abis {

    static LiminalMarketExternalServiceAbi = [{{{liminalMarketExternalServiceAbi}}}]
    static LiminalMarketAbi = [{{{liminalMarketAbi}}}]
    
    static BalanceOfAbi = [{{{balanceOfAbi}}}]
}
```

## Usage

To use the `Abis` class, first replace the template variables with the appropriate ABI data. Then, import the class and access the static properties to interact with the smart contracts.

Example:

```javascript
import Abis from './Abis.libraries.core.handlebars';

// Replace the template variables with the actual ABI data
Abis.LiminalMarketExternalServiceAbi = [...];
Abis.LiminalMarketAbi = [...];
Abis.BalanceOfAbi = [...];

// Use the ABI data to interact with smart contracts
const liminalMarketExternalServiceContract = new web3.eth.Contract(Abis.LiminalMarketExternalServiceAbi, contractAddress);
const liminalMarketContract = new web3.eth.Contract(Abis.LiminalMarketAbi, contractAddress);
const balanceOfContract = new web3.eth.Contract(Abis.BalanceOfAbi, contractAddress);
```

Remember to replace the `contractAddress` with the actual address of the respective smart contracts on the Ethereum blockchain.