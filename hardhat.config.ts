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
import {AUSD, KYC, LiminalMarket, MarketCalendar, ServiceSettings, StakingPool} from "./typechain-types";
import Deployment from "./scripts/deployment/Deployment";
import {BigNumber} from "ethers";


dotenv.config();


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    console.log(hre.network)
    for (const account of accounts) {
        console.log(account.address);
    }
});

task('verifyContract', 'verifies', async (taskArgs, hre) => {
    //how to find implementation address of contract. lookup contract address from web/src/contracts/*-address.ts
    //on block explorer. Click Contract, click More options. Click Is this proxy, click verify
    const contractInfo = ContractInfo.getContractInfo(hre.network.name);

    let verify = new Verify(hre);
    await verify.verifyContract(contractInfo.KYC_ADDRESS);
    //await verify.verifyContract(contractInfo.AUSD_ADDRESS);
    await verify.verifyContract(contractInfo.LIMINAL_MARKET_ADDRESS);
    await verify.verifyContract(contractInfo.MARKET_CALENDAR_ADDRESS);

});

task('c', 'compiles', async (taskArgs, hre) => {
    await hre.run('compile');
});

task('release', 'compiles, deploys & create release data', async (taskArgs, hre) => {
    console.log('Running release on network ' + hre.network.name);
    let release = new Release(hre);
    await release.Execute();
});
task('setAddresses', async (taskArgs, hre) => {

    const contractInfo = ContractInfo.getContractInfo(hre.network.name);


    let liminalMarketFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalMarket = liminalMarketFactory.attach(contractInfo.LIMINAL_MARKET_ADDRESS) as LiminalMarket;

    let aUSDFactory = await hre.ethers.getContractFactory('aUSD');
    let aUsd = aUSDFactory.attach(contractInfo.AUSD_ADDRESS) as AUSD;

    let serviceSettingsFactory = await hre.ethers.getContractFactory('ServiceSettings');
    let serviceSettings = serviceSettingsFactory.attach(contractInfo.SERVICE_SETTINGS_ADDRESS) as ServiceSettings;

    let stakingPoolFactory = await hre.ethers.getContractFactory('StakingPool');
    let stakingPool = stakingPoolFactory.attach(contractInfo.STAKING_POOL_ADDRESS) as StakingPool;

    let deployment = new Deployment(hre);
    await deployment.setAddresses(contractInfo, liminalMarket, aUsd, serviceSettings, stakingPool);

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

    let serviceSettingsFactory = await hre.ethers.getContractFactory('ServiceSettings');
    let serviceSettings = serviceSettingsFactory.attach(contractInfo.SERVICE_SETTINGS_ADDRESS) as ServiceSettings;

    let stakingPoolFactory = await hre.ethers.getContractFactory('StakingPool');
    let stakingPool = stakingPoolFactory.attach(contractInfo.STAKING_POOL_ADDRESS) as StakingPool;

    let roles = new Roles(liminalMarket, aUsd, kyc, marketCalendar, serviceSettings, stakingPool);
    await roles.grantRoles(hre, contractInfo);
});
task('setValues', 'compiles, deploys & create release data', async (taskArgs, hre) => {
    console.log('Running release on network ' + hre.network.name);
    let release = new Release(hre);
    await release.setValuesAndVerify();
});
task('getAusd', 'gets aUSD token', async (taskArgs, hre) => {
    let taskHelper = new TaskHelper(hre);
    let contractInfo = ContractInfo.getContractInfo(hre.network.name);
    await taskHelper.fundAUSD(contractInfo.AUSD_ADDRESS);
});
task('setCalendar', 'gets aUSD token', async (taskArgs, hre) => {
    let taskHelper = new TaskHelper(hre);
    let contractInfo = ContractInfo.getContractInfo(hre.network.name);
    await taskHelper.setMarketCalendarAsOpen(contractInfo.MARKET_CALENDAR_ADDRESS);
});

task('stakingTestSetup', 'create tokens for staking test', async (task, hre) => {

    let liminalMarket = await TaskHelper.getLiminalMarket(hre);
    await liminalMarket.orderExecuted('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'MSFT',
        BigNumber.from('236870862844000000000'), BigNumber.from('236870862844000000000'), BigNumber.from('123'), 'buy',
        BigNumber.from(123), BigNumber.from('0'), BigNumber.from('600000000000000'), '0x19d5ABE7854b01960D4911e6536b26F8A38C3a18')

    await liminalMarket.orderExecuted('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'AAPL',
        BigNumber.from('2131872530000000000'), BigNumber.from('2131872530000000000'), BigNumber.from('123'), 'buy',
        BigNumber.from(123), BigNumber.from('0'), BigNumber.from('600000000000000'), '0x19d5ABE7854b01960D4911e6536b26F8A38C3a18')
})

task('getTokens', '', async (task, hre) => {
    let liminalMarket = await TaskHelper.getLiminalMarket(hre);
    console.log('MSFT', await liminalMarket.getSecurityToken('MSFT'))
    console.log('AAPL', await liminalMarket.getSecurityToken('AAPL'))
})

task('setServiceContract', '', async (task, hre) => {
    let serviceSettings = await TaskHelper.getServiceSettings(hre);
    await serviceSettings.createContract('0x120baBBf81cBB9E6768B8356eEB073AB35e2Dc8e', 'Liquitys', 'liq.com');
})
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
        polygon: {
            url: process.env.polygonUrl ?? '',
            chainId: 137,
            accounts: [process.env.pk ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        fuji: {
            url: process.env.fujiUrl ?? '',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        bsctest: {
            url: process.env.bsctest ?? '',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        truffle: {
            url: "http://localhost:24012/rpc"
        }
    },
    gasReporter: {
        enabled: false,
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
            polygon: process.env.polygon_main_api_key ?? ''
        }

    }

};

export default config;