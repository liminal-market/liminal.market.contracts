# ContractAddress.cloud.handlebars

This is a template file for generating a JavaScript class that extends the `Network` class and contains contract addresses for a specific network. The template uses Handlebars syntax to replace variables with actual values.

## Variables

The following variables are used in the template file:

- `{{NetworkName}}`: The name of the network for which the contract addresses are being defined.
- `{{LIMINAL_MARKET_ADDRESS}}`: The address of the Liminal Market contract.
- `{{KYC_ADDRESS}}`: The address of the KYC contract.
- `{{AUSD_ADDRESS}}`: The address of the AUSD contract.
- `{{MARKET_CALENDAR_ADDRESS}}`: The address of the Market Calendar contract.
- `{{LM_ADDRESS}}`: The address of the LM contract.
- `{{SERVICE_CONTRACT_ADDRESS}}`: The address of the Service Contract.

## Template File

```handlebars
import Network from "./Network";

export default class {{NetworkName}}ContractAddresses extends Network {

    constructor() {
        super();

        this.liminalMarketAddress = "{{LIMINAL_MARKET_ADDRESS}}";
        this.kycAddress = "{{KYC_ADDRESS}}";
        this.aUsdAddress = "{{AUSD_ADDRESS}}";
        this.calendarAddress = "{{MARKET_CALENDAR_ADDRESS}}";
        this.lmAddress = "{{LM_ADDRESS}}"
        this.serviceContractAddress = "{{SERVICE_CONTRACT_ADDRESS}}"

    }
}
```

## Description

The generated class will extend the `Network` class and define the contract addresses for a specific network. The constructor of the class initializes the contract addresses using the provided values in the template.

### Example

Assuming the following values for the template variables:

- `NetworkName`: Mainnet
- `LIMINAL_MARKET_ADDRESS`: 0x1234...
- `KYC_ADDRESS`: 0x5678...
- `AUSD_ADDRESS`: 0x9abc...
- `MARKET_CALENDAR_ADDRESS`: 0xdef0...
- `LM_ADDRESS`: 0x1112...
- `SERVICE_CONTRACT_ADDRESS`: 0x3334...

The generated class would look like this:

```javascript
import Network from "./Network";

export default class MainnetContractAddresses extends Network {

    constructor() {
        super();

        this.liminalMarketAddress = "0x1234...";
        this.kycAddress = "0x5678...";
        this.aUsdAddress = "0x9abc...";
        this.calendarAddress = "0xdef0...";
        this.lmAddress = "0x1112..."
        this.serviceContractAddress = "0x3334..."

    }
}
```