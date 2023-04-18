# Roles.ts

Roles.ts is a TypeScript code file that defines a `Roles` class. This class is responsible for managing roles and permissions for various contracts in a DeFi application. The class interacts with multiple smart contracts, such as LiminalMarket, AUSD, KYC, MarketCalendar, LM, and ServiceContract.

## Class: Roles

The `Roles` class contains the following properties:

- `liminalMarket`: LiminalMarket or FakeContract<LiminalMarket>
- `aUSD`: AUSD or FakeContract<AUSD>
- `kyc`: KYC or FakeContract<KYC>
- `marketCalendar`: MarketCalendar or FakeContract<MarketCalendar>
- `lm`: LM or FakeContract<LM>
- `serviceContract`: ServiceContract or FakeContract<ServiceContract>

### Constructor

The constructor takes the following parameters:

- `liminalMarket`: LiminalMarket or FakeContract<LiminalMarket>
- `aUSD`: AUSD or FakeContract<AUSD>
- `kyc`: KYC or FakeContract<KYC>
- `marketCalendar`: MarketCalendar or FakeContract<MarketCalendar>
- `lm`: LM or FakeContract<LM>
- `serviceContract`: ServiceContract or FakeContract<ServiceContract>

It initializes the class properties with the provided values.

### Method: tempGrantRole

This method takes the following parameters:

- `hre`: HardhatRuntimeEnvironment
- `contractInfo`: ContractAddresses

It grants a temporary MintAndBurnRole to a specific address for the LiminalMarket contract.

### Method: grantRoles

This method takes the following parameters:

- `hre`: HardhatRuntimeEnvironment
- `contractInfo`: ContractAddresses

It grants various roles and permissions to the relayer address and other contract addresses. The roles granted include:

- MintAndBurnRole for LiminalMarket
- RoleForBalance for aUSD
- RoleForKyc for KYC
- CalendarRole for MarketCalendar
- ServiceFeeRole for LM

## Example Usage

```typescript
import Roles from "./Roles";
import ContractAddresses from "../addresses/ContractAddresses";
import { LiminalMarket, AUSD, KYC, MarketCalendar, LM, ServiceContract } from "../../typechain-types";
import { FakeContract } from "@defi-wonderland/smock";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const liminalMarket: LiminalMarket | FakeContract<LiminalMarket> = // ...;
const aUSD: AUSD | FakeContract<AUSD> = // ...;
const kyc: KYC | FakeContract<KYC> = // ...;
const marketCalendar: MarketCalendar | FakeContract<MarketCalendar> = // ...;
const lm: LM | FakeContract<LM> = // ...;
const serviceContract: ServiceContract | FakeContract<ServiceContract> = // ...;

const roles = new Roles(liminalMarket, aUSD, kyc, marketCalendar, lm, serviceContract);

const hre: HardhatRuntimeEnvironment = // ...;
const contractInfo: ContractAddresses = // ...;

roles.tempGrantRole(hre, contractInfo);
roles.grantRoles(hre, contractInfo);
```

This example demonstrates how to create an instance of the `Roles` class and use its methods to grant roles and permissions to various contract addresses.