# DeploymentTest.ts

This is a test file for the deployment of various smart contracts using the Hardhat framework. The file imports necessary libraries and modules, and tests the deployment and upgrade of contracts such as KYC, aUSD, LiminalMarket, MarketCalendar, LM, and ServiceContract.

## Table of Contents

- [Test Deployment Script](#test-deployment-script)
- [KYC - Deploy and Update Contract](#kyc---deploy-and-update-contract)
- [aUSD - Deploy and Update Contract](#ausd---deploy-and-update-contract)
- [LiminalMarket - Deploy and Update Contract](#liminalmarket---deploy-and-update-contract)
- [MarketCalendar - Deploy and Update Contract](#marketcalendar---deploy-and-update-contract)
- [LM - Deploy and Update Contract](#lm---deploy-and-update-contract)
- [ServiceContract - Deploy and Update Contract](#servicecontract---deploy-and-update-contract)
- [Check if Contract Exists on Chain](#check-if-contract-exists-on-chain)

## Test Deployment Script

This section tests the deployment script by deploying the KYC contract and checking its deployment status.

```javascript
it("Deployment contract", async () => {
    let deployment = new Deployment(hre);
    let [, status] = await deployment.deployOrUpgradeContract("KYC", "");
    expect(status).to.be.equal(Deployment.Deployed);
})
```

## KYC - Deploy and Update Contract

This section tests the deployment and update of the KYC contract. It deploys the contract, sets some data, and then modifies the contract, builds, and validates it.

```javascript
it("KYC - Deploy and update contract", async () => {
    // ...
});
```

## aUSD - Deploy and Update Contract

This section tests the deployment and update of the aUSD contract. It deploys the contract, sets some data, and then modifies the contract, builds, and validates it.

```javascript
it("aUSD - Deploy and update contract", async () => {
    // ...
});
```

## LiminalMarket - Deploy and Update Contract

This section tests the deployment and update of the LiminalMarket contract. It deploys the contract, sets some data, and then modifies the contract, builds, and validates it.

```javascript
it("LiminalMarket - Deploy and update contract", async () => {
    // ...
});
```

## MarketCalendar - Deploy and Update Contract

This section tests the deployment and update of the MarketCalendar contract. It deploys the contract, sets some data, and then modifies the contract, builds, and validates it.

```javascript
it("MarketCalendar - Deploy and update contract", async () => {
    // ...
});
```

## LM - Deploy and Update Contract

This section tests the deployment and update of the LM contract. It deploys the contract, sets some data, and then modifies the contract, builds, and validates it.

```javascript
it("LM - Deploy and update contract", async () => {
    // ...
});
```

## ServiceContract - Deploy and Update Contract

This section tests the deployment and update of the ServiceContract. It deploys the contract, sets some data, and then modifies the contract, builds, and validates it.

```javascript
it("ServiceContract - Deploy and update contract", async () => {
    // ...
});
```

## Check if Contract Exists on Chain

This section tests if a deployed contract exists on the blockchain. It first deploys the contract and then checks if it exists on the chain.

```javascript
it("Check if contract exists on chain, first deploy then check, should be on chain", async () => {
    // ...
});
```