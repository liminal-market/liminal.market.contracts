import * as dotenv from "dotenv";
import {HardhatUserConfig, task} from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-log-remover';
import "hardhat-gas-reporter"

import Release from "./scripts/deployment/Release";
import Verify from "./scripts/deployment/Verify";
import ContractInfo from "./scripts/addresses/ContractInfo";
import TaskHelper from "./scripts/TaskHelper";
import Roles from "./scripts/deployment/Roles";
import {AUSD, KYC, LiminalMarket, LM, MarketCalendar, ServiceContract} from "./typechain-types";
import Deployment from "./scripts/deployment/Deployment";


dotenv.config();


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    console.log(hre.network)
    for (const account of accounts) {
        console.log(account.address);
    }
});

task('verifyContracts', 'verifies', async (taskArgs, hre) => {
    //how to find implementation address of contract. lookup contract address from web/src/contracts/*-address.ts
    //on block explorer. Click Contract, click More options. Click Is this proxy, click verify
    const contractInfo = ContractInfo.getContractInfo(hre.network.name);

    let verify = new Verify(hre);
    await verify.verifyContract(contractInfo.KYC_ADDRESS);
    await verify.verifyContract(contractInfo.AUSD_ADDRESS);
    await verify.verifyContract(contractInfo.LIMINAL_MARKET_ADDRESS);
    await verify.verifyContract(contractInfo.MARKET_CALENDAR_ADDRESS);

    await verify.verifyContract(contractInfo.LM_ADDRESS);
    await verify.verifyContract(contractInfo.SERVICE_CONTRACT_ADDRESS);


});

task('c', 'compiles', async (taskArgs, hre) => {
    await hre.run('compile');
});

task('forceImport', async (taskArgs, hre) => {
    try {
        /**/
        let liminalMarketContractFactory = await hre.ethers.getContractFactory('LiminalMarket');
        await hre.upgrades.forceImport('0x6e9C29e416dc9F7A6A03ffebaB3f02Ef62a1baE4', liminalMarketContractFactory)

        let aUsdContractFactory = await hre.ethers.getContractFactory('aUSD');
        await hre.upgrades.forceImport('0x38F2B1E9F11937dD276D64521535b15280A7F137', aUsdContractFactory)

        let kycContractFactory = await hre.ethers.getContractFactory('KYC');
        await hre.upgrades.forceImport('0x9e2B28D9F841300bE3B64e505dEcA36c35250609', kycContractFactory)

        let marketCalContractFactory = await hre.ethers.getContractFactory('MarketCalendar');
        await hre.upgrades.forceImport('0xc6B29dfd4FD756EF94b3A3FF7a531F4467BDDA75', marketCalContractFactory)


    } catch (e: any) {
        console.log(e);
        console.log(e.message);
        console.log(e.data);
    }
})
task('release', 'compiles, deploys & create release data', async (taskArgs, hre) => {
    console.log('Running release on network ' + hre.network.name);
    try {
        let release = new Release(hre);
        await release.Execute();
    } catch (e: any) {
        console.log(e);
        console.log(e.message);
        console.log(e.data);
    }

});
task('setAddresses', async (taskArgs, hre) => {
    try {
        const contractInfo = ContractInfo.getContractInfo(hre.network.name);

        let liminalMarketFactory = await hre.ethers.getContractFactory('LiminalMarket');
        let liminalMarket = liminalMarketFactory.attach(contractInfo.LIMINAL_MARKET_ADDRESS) as LiminalMarket;

        let aUSDFactory = await hre.ethers.getContractFactory('aUSD');
        let aUsd = aUSDFactory.attach(contractInfo.AUSD_ADDRESS) as AUSD;

        let lmFactory = await hre.ethers.getContractFactory('LM');
        let lm = lmFactory.attach(contractInfo.LM_ADDRESS) as LM;

        let serviceContractFactory = await hre.ethers.getContractFactory('ServiceContract');
        let serviceContract = serviceContractFactory.attach(contractInfo.SERVICE_CONTRACT_ADDRESS) as ServiceContract;

        let deployment = new Deployment(hre);
        await deployment.setAddresses(contractInfo, liminalMarket, aUsd, lm, serviceContract);
    } catch (e : any) {
        console.log(e.message);
        console.log(e.data);
    }

})
task('setRoles', 'compiles, deploys & create release data', async (taskArgs, hre) => {
    console.log('Running setRoles on network ' + hre.network.name);

    const contractInfo = ContractInfo.getContractInfo(hre.network.name);

    let liminalMarketFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalMarket = liminalMarketFactory.attach(contractInfo.LIMINAL_MARKET_ADDRESS) as LiminalMarket;

    let aUSDFactory = await hre.ethers.getContractFactory('aUSD');
    let aUsd = aUSDFactory.attach(contractInfo.AUSD_ADDRESS) as AUSD;

    let kycFactory = await hre.ethers.getContractFactory('KYC');
    let kyc = kycFactory.attach(contractInfo.KYC_ADDRESS) as KYC;

    let marketCalendarFactory = await hre.ethers.getContractFactory('MarketCalendar');
    let marketCalendar = marketCalendarFactory.attach(contractInfo.MARKET_CALENDAR_ADDRESS) as MarketCalendar;

    let lmFactory = await hre.ethers.getContractFactory('LM');
    let lm = lmFactory.attach(contractInfo.LM_ADDRESS) as LM;

    let serviceContractFactory = await hre.ethers.getContractFactory('ServiceContract');
    let serviceContract = serviceContractFactory.attach(contractInfo.SERVICE_CONTRACT_ADDRESS) as ServiceContract;

    let roles = new Roles(liminalMarket, aUsd, kyc, marketCalendar, lm, serviceContract);
    await roles.tempGrantRole(hre, contractInfo);
});
task('setValues', 'compiles, deploys & create release data', async (taskArgs, hre) => {
    console.log('Running release on network ' + hre.network.name);
    let release = new Release(hre);
    await release.setValuesAndVerify();
});
task('getAusd', 'gets aUSD token', async (taskArgs, hre) => {
    let taskHelper = new TaskHelper(hre);
    let contractInfo = ContractInfo.getContractInfo(hre.network.name);
    let randomAmount = parseInt((Math.random() * 10000).toString()) + '0'.repeat(18);
    await taskHelper.fundAUSD(contractInfo.AUSD_ADDRESS, randomAmount);
});
task('setCalendar', 'gets aUSD token', async (taskArgs, hre) => {
    let taskHelper = new TaskHelper(hre);
    let contractInfo = ContractInfo.getContractInfo(hre.network.name);
    await taskHelper.setMarketCalendarAsOpen(contractInfo.MARKET_CALENDAR_ADDRESS);
});

task('executeBuy', async (taskArgs, hre) => {
    let taskHelper = new TaskHelper(hre);
    let contractInfo = ContractInfo.getContractInfo(hre.network.name);
    await taskHelper.executeTrade(contractInfo);
});

task('createToken', async (taskArgs, hre) => {
    let taskHelper = new TaskHelper(hre);
    let contractInfo = ContractInfo.getContractInfo(hre.network.name);
    await taskHelper.createToken(contractInfo);
});

task('setupTest', 'give default values for dev environment', async (taskArgs, hre) => {
    await hre.run('release');
    await hre.run('getAusd');
    await hre.run('setCalendar');
});

const config: HardhatUserConfig = {
    paths: {
        sources: './contracts/',
        tests: './test/contracts/'
    },
    solidity: {
        compilers: [
            {
                version: "0.8.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 2000,
                    },
                    outputSelection: {
                        "*": {
                            "*": ["storageLayout"]
                        }
                    }
                }
            }
        ]
    },
    defaultNetwork: "hardhat",
    networks: {

        hardhat: {

            forking: {
                url: process.env.mumbaiUrl ?? '',
                blockNumber: 18565457
            }

        },
        rinkeby: {
            url: process.env.rinkebyUrl ?? '',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        mumbai: {
            url: process.env.mumbaiUrl ?? '',
            chainId: 80001,
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        fuji: {
            url: process.env.fujiUrl ?? '',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        bsctest: {
            url: process.env.bsctest ?? '',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "ISK",
        coinmarketcap: process.env.coinmarketcap_key,
        gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
        token: 'MATIC',
    },
    etherscan: {
        apiKey: {
            rinkeby: process.env.ETHERSCAN_API_KEY ?? '',
            polygonMumbai: process.env.MUMBAI_API_KEY ?? '',
            avalancheFujiTestnet: process.env.AvalancheFujiTestnet ?? '',
            bscTestnet: process.env.bsc_api_key ?? '',
        }

    }
};

export default config;