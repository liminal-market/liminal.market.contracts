import * as dotenv from "dotenv";
import {HardhatUserConfig, task} from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';

import Funding from './scripts/Funding';
import Release from "./scripts/deployment/Release";
import Verify from "./scripts/deployment/Verify";
import ContractInfo from "./scripts/addresses/ContractInfo";

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
    await verify.verifyContract(contractInfo.AUSD_ADDRESS);
    await verify.verifyContract(contractInfo.LIMINAL_MARKET_ADDRESS);
    await verify.verifyContract(contractInfo.MARKET_CALENDAR_ADDRESS);

});

task('c', 'compiles', async (taskArgs, hre) => {
    await hre.run('compile');
});

task('release', 'compiles, deploys & create release data', async (taskArgs, hre) => {
    let release = new Release(hre);
    await release.Execute();
});

task('getAusd', 'gets aUSD token', async (taskArgs, hre) => {
    let funding = new Funding(hre);
    let contractInfo = ContractInfo.getContractInfo(hre.network.name);
    await funding.fundAUSD(contractInfo.AUSD_ADDRESS);
});

const config: HardhatUserConfig = {
    paths : {
      sources:'./contracts/'
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
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
                blockNumber: 26529265
            }
        },
        rinkeby: {
            url: process.env.rinkebyUrl ?? '',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        mumbai: {
            url: process.env.mumbaiUrl ?? '',
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
        currency: "USD",
    },
    etherscan: {
        apiKey: {
            rinkeby: process.env.ETHERSCAN_API_KEY,
            polygonMumbai: process.env.POLYGON_API_KEY,
            avalancheFujiTestnet: process.env.AvalancheFujiTestnet,
            bscTestnet: process.env.bsc_api_key
        }

    }
};

export default config;