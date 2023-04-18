# ContractAddress.contracts.handlebars

This is a Handlebars template file that generates a TypeScript class for managing contract addresses on a specific blockchain network. The generated class will implement the `ContractAddresses` interface and use the `FixedAddresses` class for some of its methods.

## Template Variables

The following variables are used in the template file:

- `{{NetworkName}}`: The name of the blockchain network.
- `{{ChainId}}`: The chain ID of the blockchain network.
- `{{IsTestNetwork}}`: A boolean value indicating whether the network is a test network or not.
- `{{KYC_ADDRESS}}`: The address of the KYC contract on the network.
- `{{AUSD_ADDRESS}}`: The address of the AUSD contract on the network.
- `{{LIMINAL_MARKET_ADDRESS}}`: The address of the Liminal Market contract on the network.
- `{{MARKET_CALENDAR_ADDRESS}}`: The address of the Market Calendar contract on the network.
- `{{LM_ADDRESS}}`: The address of the LM contract on the network.
- `{{SERVICE_CONTRACT_ADDRESS}}`: The address of the Service Contract on the network.
- `{{NO_FEE_CONTRACT_ADDRESS}}`: The address of the No Fee Contract on the network.

## Template File

```handlebars
import ContractAddresses from "./ContractAddresses";
import FixedAddresses from "./FixedAddresses";

export default class {{NetworkName}}ContractAddresses implements ContractAddresses {
    ChainId = "{{ChainId}}";
    NetworkName = "{{NetworkName}}";
    IsTestNetwork = {{IsTestNetwork}};

    KYC_ADDRESS = "{{KYC_ADDRESS}}";
    AUSD_ADDRESS = "{{AUSD_ADDRESS}}";
    LIMINAL_MARKET_ADDRESS = "{{LIMINAL_MARKET_ADDRESS}}";
    MARKET_CALENDAR_ADDRESS = "{{MARKET_CALENDAR_ADDRESS}}";
    LM_ADDRESS = "{{LM_ADDRESS}}";
    SERVICE_CONTRACT_ADDRESS = "{{SERVICE_CONTRACT_ADDRESS}}";
    NO_FEE_CONTRACT_ADDRESS = "{{NO_FEE_CONTRACT_ADDRESS}}";

    getRelayerAddress(): string {
        return FixedAddresses.getRelayerAddress(this.NetworkName);
    }
    getLMServiceFeeAddress(): string {
        return FixedAddresses.getLMServiceFeeAddress(this.NetworkName);
    }
}
```

## Generated Class Description

The generated class will have the following properties and methods:

### Properties

- `ChainId`: The chain ID of the blockchain network.
- `NetworkName`: The name of the blockchain network.
- `IsTestNetwork`: A boolean value indicating whether the network is a test network or not.
- `KYC_ADDRESS`: The address of the KYC contract on the network.
- `AUSD_ADDRESS`: The address of the AUSD contract on the network.
- `LIMINAL_MARKET_ADDRESS`: The address of the Liminal Market contract on the network.
- `MARKET_CALENDAR_ADDRESS`: The address of the Market Calendar contract on the network.
- `LM_ADDRESS`: The address of the LM contract on the network.
- `SERVICE_CONTRACT_ADDRESS`: The address of the Service Contract on the network.
- `NO_FEE_CONTRACT_ADDRESS`: The address of the No Fee Contract on the network.

### Methods

- `getRelayerAddress(): string`: Returns the relayer address for the given network name.
- `getLMServiceFeeAddress(): string`: Returns the LM service fee address for the given network name.