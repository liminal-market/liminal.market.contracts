# ContractAddress.libraries.handlebars

This is a Handlebars template file that generates a class for a specific network with default contract addresses. The generated class extends a base class containing default network settings.

## Template Variables

The following variables are used in the template file:

- `{{upperFirst NetworkName}}`: The name of the network with the first letter capitalized.
- `{{KYC_ADDRESS}}`: The address of the KYC contract.
- `{{AUSD_ADDRESS}}`: The address of the AUSD contract.
- `{{LIMINAL_MARKET_ADDRESS}}`: The address of the Liminal Market contract.
- `{{MARKET_CALENDAR_ADDRESS}}`: The address of the Market Calendar contract.
- `{{LM_ADDRESS}}`: The address of the LM contract.
- `{{SERVICE_CONTRACT_ADDRESS}}`: The address of the Service Contract.
- `{{NO_FEE_CONTRACT_ADDRESS}}`: The address of the No Fee Contract.

## Template File

```handlebars
import {{upperFirst NetworkName}}NetworkDefaults from "./{{upperFirst NetworkName}}NetworkDefaults";

export default class {{upperFirst NetworkName}}Network extends {{upperFirst NetworkName}}NetworkDefaults {
    constructor() {
        super();
    }

    override KYC_ADDRESS = "{{KYC_ADDRESS}}";
    override AUSD_ADDRESS = "{{AUSD_ADDRESS}}";
    override LIMINAL_MARKET_ADDRESS = "{{LIMINAL_MARKET_ADDRESS}}";
    override MARKET_CALENDAR_ADDRESS = "{{MARKET_CALENDAR_ADDRESS}}";
    override LM_ADDRESS = "{{LM_ADDRESS}}";
    override SERVICE_CONTRACT_ADDRESS = "{{SERVICE_CONTRACT_ADDRESS}}";
    override NO_FEE_SERVICE_CONTRACT_ADDRESS = "{{NO_FEE_CONTRACT_ADDRESS}}";
}
```

## Description

The generated class extends the `{{upperFirst NetworkName}}NetworkDefaults` class, which contains default settings for the specified network. The constructor calls the `super()` method to initialize the base class.

The class overrides the following contract addresses with the values provided in the template:

- `KYC_ADDRESS`
- `AUSD_ADDRESS`
- `LIMINAL_MARKET_ADDRESS`
- `MARKET_CALENDAR_ADDRESS`
- `LM_ADDRESS`
- `SERVICE_CONTRACT_ADDRESS`
- `NO_FEE_SERVICE_CONTRACT_ADDRESS`

These addresses are used to interact with the corresponding contracts on the specified network.