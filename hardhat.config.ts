
import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';

import { compileAndDeploy, compileAndUpgradeLiminalMarket, compileAndUpgradeKYC, compileAndUpgradeAUSD, compileAndUpgradeAll } from './scripts/deploy';
import {fundAUSD } from './scripts/funding';

const result = dotenv.config();




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


task('cd', 'compiles and deploys', async (taskArgs, hre) => {
    await compileAndDeploy(hre);
});
task('cu-liminal', 'compiles and upgrade Liminal.market contract', async (taskArgs, hre) => {
    await compileAndUpgradeLiminalMarket(hre);
});
task('cu-kyc', 'compiles and upgrade KYC contract', async (taskArgs, hre) => {
    await compileAndUpgradeKYC(hre);
});
task('cu-kyc', 'compiles and upgrade aUSD contract', async (taskArgs, hre) => {
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
                version: "0.8.9",
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
            },
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
            },
        ]
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {

            forking: {
                url: "https://polygon-mumbai.g.alchemy.com/v2/sCmg1qtO8dGxcgTZxjvcFazjkqUyHI6r",
                //blockNumber: 9693973
            }
        },
        rinkeby: {
            url: 'https://eth-rinkeby.alchemyapi.io/v2/bxdMzB7jGUwlLyPQP_ftyikfBD5PIdkJ',
            accounts: [process.env.PRIVATE_KEY ?? 'ble']
        },
        mumbai: {
            url: 'https://polygon-mumbai.g.alchemy.com/v2/sCmg1qtO8dGxcgTZxjvcFazjkqUyHI6r',
            accounts: [process.env.PRIVATE_KEY ?? 'bla']
        },
        fuji: {
            url: 'https://api.avax-test.network/ext/bc/C/rpc',
            accounts: [process.env.PRIVATE_KEY ?? 'bla']
        }
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    }
};

export default config;