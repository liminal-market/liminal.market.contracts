
import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";


import {compileAndDeploy} from './scripts/deploy';
import {fundLink, fundUSDC} from './scripts/funding';

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


task('fundlink', 'fund link', async function(taskArgs, href) {
  await fundLink(href, "0x3D7CD28EfD08FfE9Ce8cA329EC2e67822C756526");
});


task('getusdc', 'gets USDC token', async (taskArgs, hre) => {
  await fundUSDC(hre)
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
        url: "https://eth-rinkeby.alchemyapi.io/v2/bxdMzB7jGUwlLyPQP_ftyikfBD5PIdkJ",
        blockNumber: 9693973
      }
    },
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/bxdMzB7jGUwlLyPQP_ftyikfBD5PIdkJ',
      accounts: [process.env.PRIVATE_KEY ?? 'ble']
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/sCmg1qtO8dGxcgTZxjvcFazjkqUyHI6r',
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
