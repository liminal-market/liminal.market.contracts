import * as dotenv from "dotenv";
import {HardhatUserConfig, task} from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';

import {
    compileAndDeploy,
    compileAndUpgradeLiminalMarket,
    compileAndUpgradeKYC,
    compileAndUpgradeAUSD,
    compileAndUpgradeAll,
    verifyContract, grantRoles, compile
} from './scripts/deploy';
import {fundAUSD} from './scripts/funding';
import {getContractsByNetwork} from "./scripts/networks";

dotenv.config();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    console.log(hre.network)
    for (const account of accounts) {
        console.log(account.address);
    }
});

task("d", "", async (taskArgs, hre) => {

    console.log(hre.network.name)

});
task('grantRoles', 'verifies', async (taskArgs, hre) => {
    //how to find implementation address of contract. lookup contract address from web/src/contracts/*-address.ts
    //on block explorer. Click Contract, click More options. Click Is this proxy, click verify

    const contractInfo = getContractsByNetwork(hre);

    await grantRoles(hre, contractInfo);

});
task('verifyContract', 'verifies', async (taskArgs, hre) => {
    //how to find implementation address of contract. lookup contract address from web/src/contracts/*-address.ts
    //on block explorer. Click Contract, click More options. Click Is this proxy, click verify
    const contractInfo = getContractsByNetwork(hre);

    await verifyContract(hre, contractInfo.KYC_ADDRESS);
    await verifyContract(hre, contractInfo.AUSD_ADDRESS);
    await verifyContract(hre, contractInfo.LIMINAL_MARKET_ADDRESS);

});
task('c', 'compiles', async (taskArgs, hre) => {
    await compile(hre);
});
task('cd', 'compiles and deploys', async (taskArgs, hre) => {
    await compileAndDeploy(hre);
});
task('cu-liminal', 'compiles and upgrade Liminal.market contract', async (taskArgs, hre) => {
    await compileAndUpgradeLiminalMarket(hre);
});
task('cu-kyc', 'compiles and upgrade KYC contract', async (taskArgs, hre) => {
    await compileAndUpgradeKYC(hre);
});
task('cu-ausd', 'compiles and upgrade aUSD contract', async (taskArgs, hre) => {
    await compileAndUpgradeAUSD(hre);
});
task('cu-all', 'compiles and upgrade all contract', async (taskArgs, hre) => {
    await compileAndUpgradeAll(hre);
});
task('getausd', 'gets USDC token', async (taskArgs, hre) => {
    await fundAUSD(hre)
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more


const config: HardhatUserConfig = {
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
            }/*,
            {
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                    },
                    outputSelection: {
                        "*": {
                            "*": ["storageLayout"]
                        }
                    }
                }
            },*/
        ]
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            forking: {
                url: "https://polygon-mumbai.g.alchemy.com/v2/sCmg1qtO8dGxcgTZxjvcFazjkqUyHI6r",
                blockNumber: 26529265
            }
        },
        rinkeby: {
            url: 'https://eth-rinkeby.alchemyapi.io/v2/bxdMzB7jGUwlLyPQP_ftyikfBD5PIdkJ',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        mumbai: {
            url: 'https://polygon-mumbai.g.alchemy.com/v2/sCmg1qtO8dGxcgTZxjvcFazjkqUyHI6r',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        fuji: {
            url: 'https://api.avax-test.network/ext/bc/C/rpc',
            accounts: [process.env.PRIVATE_KEY ?? '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a']
        },
        bsctest: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
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