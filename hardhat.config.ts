
import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { DAI_ADDRESS, DAI_ABI, USDC_ADDRESS, USDC_ABI } from "./scripts/constants"
import * as fs from 'fs';

const result = dotenv.config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const liminalUserAdress = '0x93DA645082493BBd7116fC057c5b9aDfd5363912'; //'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; hardhat local account

//constructor parameters
const brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';//'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';- hardhat local accounts
const liminalAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; //'0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //rinkeby
const linkTokenAddress = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'; //'0xa36085F69e2889c224210F603D836748e7dC0088'; //kovan -   rinkeby
const usdcContractAddress = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b'; // '0xe22da380ee6B445bb8273C81944ADEB6E8450422'; //kovan - 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b rinkeby
const liminalBackendAddress = '0xa22610E72cF86f3ef1a2A1f34D89f9E5B0EFc0AA'; //'0x90f79bf6eb2c4f870365e785982e1f101e93b906'; local
//funding addresses
const fromDAIAddress = '0x38720D56899d46cAD253d08f7cD6CC89d2c83190';
//const fromUSDCAddress = '0x50b42514389F25E1f471C8F03f6f5954df0204b0'; //main net
const fromUSDCAddress = '0xAb6424ece567043d09DB011d7075fd83616EFd93' //rinkeby '0x99fd75645b30870071909c261a660bfe9d90b267'; //kovan
const fromAddress = fromDAIAddress;
const CONTRACT_ADDRESS = DAI_ADDRESS;
const CONTRACT_ABI = DAI_ABI;

const deployContract = async function (href: any, contractName: string, regen: boolean, preexistingAddress: string, conArgs?: any[]) {

  const Contract = await href.ethers.getContractFactory(contractName);
  if (!regen) {
    return Contract.attach(preexistingAddress);
  }
  let contract;


  if (conArgs != null) {
    let [...args] = Array.prototype.slice.call(conArgs);
    contract = await Contract.deploy(...args);
  } else {
    contract = await Contract.deploy();
  }
  await contract.deployed();
  console.log(contractName + " deployed:", contract.address);

  return contract;
}

task('dep-oracle', 'deploy oracle contract', async (taskArgs, href) => {
  const oracleContract = await deployContract(href, "Oracle", true,
    "0x27017F7cadE8Dd55575963eD019376a5144DE6BF", [linkTokenAddress]);

})

task('dep-rinkeby', 'deploy oracle contract', async (taskArgs, href) => {
  await href.run('compile');

  const redeployOracle = false;
  const redeployKYC = false;
  const redeployAUSD = false;
  const redeploySecurityFactory = true;
  const redeploySecurityToken = true;

  const oracleContract = await deployContract(href, "Oracle", redeployOracle,
    "0x9ea436040D8CAB1c37A54ea3d2DEa1E5c01DfC52", [linkTokenAddress]);

  const kycContract = await deployContract(href, "KYC", redeployKYC,
    "0x18e85b5391aF80569537C8c3cb5abEa655E13402");
  const aUsdContract = await deployContract(href, "aUSD", redeployAUSD,
    "0x514e1a0f56a92E35943c0f69B2D528436c26b42B");
  const securityFactoryContract = await deployContract(href, "SecurityFactory", redeploySecurityFactory,
    "0x85845Ea649EA23765612053754dccb15671c41CD", [aUsdContract.address, kycContract.address]);
  /*const securityTokenContract = await deployContract(href, "SecurityToken", redeploySecurityToken,
    "0xB8f0D7f45200EF1161110B9BA77FB393453aD864",
    ["Apple Computers Inc.", "AAPL", kycContract.address, aUsdContract.address, securityFactoryContract.address]);
  */

  const liminalContract = await deployContract(href, "LiminalExchange", true, "0xb30e80eA8Fe20cBD8bb5fc8c1A949A796BE6dB3c",
    [securityFactoryContract.address, oracleContract.address, kycContract.address, aUsdContract.address,
      liminalAddress, brokerAddress, linkTokenAddress, usdcContractAddress]);

  await securityFactoryContract.grantMintAndBurnRole(liminalBackendAddress);
  await aUsdContract.grantRoleForBalance(securityFactoryContract.address);
  await aUsdContract.setAddresses(liminalContract.address);


  await writeContractAddressesToJs(href, liminalContract.address, kycContract.address,
    aUsdContract.address, securityFactoryContract.address, usdcContractAddress);

  console.log('done:' + new Date());

});

task('giveaccess', async(taskArgs, href) => {


  const redeployOracle = false;
  const redeployKYC = false;
  const redeployAUSD = false;
  const redeploySecurityFactory = false;
  const redeploySecurityToken = false;

  const oracleContract = await deployContract(href, "Oracle", redeployOracle,
    "0x9ea436040D8CAB1c37A54ea3d2DEa1E5c01DfC52", [linkTokenAddress]);

  const kycContract = await deployContract(href, "KYC", redeployKYC,
    "0x18e85b5391aF80569537C8c3cb5abEa655E13402");
  const aUsdContract = await deployContract(href, "aUSD", redeployAUSD,
    "0x514e1a0f56a92E35943c0f69B2D528436c26b42B");
  const securityFactoryContract = await deployContract(href, "SecurityFactory", redeploySecurityFactory,
    "0x85845Ea649EA23765612053754dccb15671c41CD", [aUsdContract.address, kycContract.address]);
  const securityTokenContract = await deployContract(href, "SecurityToken", redeploySecurityToken,
    "0xB8f0D7f45200EF1161110B9BA77FB393453aD864",
    ["Apple Computers Inc.", "AAPL", kycContract.address, aUsdContract.address, securityFactoryContract.address]);


  const liminalContract = await deployContract(href, "LiminalExchange", false, "0x3D7CD28EfD08FfE9Ce8cA329EC2e67822C756526",
    [securityFactoryContract.address, oracleContract.address, kycContract.address, aUsdContract.address,
      liminalAddress, brokerAddress, linkTokenAddress, usdcContractAddress]);

  await securityFactoryContract.grantMintAndBurnRole(liminalBackendAddress);

})

task('oracle-allow', 'allow link to work with oracle', async (taskArgs, href) => {
  const oracleContract = await deployContract(href, "Oracle", false,
    "0x27017F7cadE8Dd55575963eD019376a5144DE6BF", [linkTokenAddress]);

  oracleContract.setFulfillmentPermission('0xF5dF3EF33B1F0061e3876294c4d7f69CEF7F01b0', true);

})

task('cd', 'compiles and deploys', async (taskArgs, href) => {

  await href.run('compile');

  const redeployOracle = true;
  const redeployKYC = true;
  const redeployAUSD = true;
  const redeploySecurityFactory = true;
  const redeploySecurityToken = true;

  const oracleContract = await deployContract(href, "Oracle", redeployOracle,
    "0xd1d50299505DE6C56e564E15eeF88CcA3b168832", [linkTokenAddress]);

  const kycContract = await deployContract(href, "KYC", redeployKYC,
    "0xD5f071F2D8BF6E7d6BC25A1D89e9b1430AC78A58");
  const aUsdContract = await deployContract(href, "aUSD", redeployAUSD,
    "0x6854DC0e58Ef1029aA42Ba61ca1160527bBeC01E");
  const securityFactoryContract = await deployContract(href, "SecurityFactory", redeploySecurityFactory,
    "0x0c8Cd13ff68D41263E6937224B9e5c7fF54d72f9", [aUsdContract.address, kycContract.address]);
  const securityTokenContract = await deployContract(href, "SecurityToken", redeploySecurityToken,
    "0x87C9ae76E787D263E768BFBc8C23032240315751",
    ["Apple Computers Inc.", "AAPL", kycContract.address, securityFactoryContract.address]);

  const liminalContract = await deployContract(href, "LiminalExchange", true, "",
    [securityFactoryContract.address, oracleContract.address, kycContract.address, aUsdContract.address,
      liminalAddress, brokerAddress, linkTokenAddress, usdcContractAddress]);

  await securityFactoryContract.grantMintAndBurnRole(liminalBackendAddress);
  await aUsdContract.grantRoleForBalance(securityFactoryContract.address);
  await aUsdContract.setAddresses(liminalContract.address);


  await writeContractAddressesToJs(href, liminalContract.address, kycContract.address,
    aUsdContract.address, securityFactoryContract.address, usdcContractAddress);
  //await fundLink(href, liminalContract.address);

  console.log('done:' + new Date());
});

const writeContractAddressesToJs = async function (href: any, liminalAddress: string, kycAddress: string,
  aUsdAddress: string, securityFactoryAddress: string, usdcContractAddress: string) {
  let constantFile = '';

  constantFile += 'export const KYC_ADDRESS = "' + kycAddress + '";\n';
  constantFile += 'export const LIMINAL_ADDRESS = "' + liminalAddress + '";\n';
  constantFile += 'export const AUSD_ADDRESS = "' + aUsdAddress + '";\n';
  constantFile += 'export const SECURITY_FACTORY_ADDRESS = "' + securityFactoryAddress + '";\n';
  constantFile += 'export const SECURITY_TOKEN_OWNER = "' + securityFactoryAddress + '";\n';
  constantFile += 'export const USDC_ADDRESS = "' + usdcContractAddress + '";\n';

  await fs.writeFileSync('../liminal.market.web/app/js/modules/contract-addresses.js', constantFile, 'utf-8');
  await fs.writeFileSync('../liminal.market.web/src/cloud-functions/contract-addresses.js', constantFile.replace(/export /g, ''), 'utf-8');
  copyAbiFile('LiminalExchange');
  copyAbiFile('SecurityFactory');
  copyAbiFile('aUSD');
  copyAbiFile('SecurityToken');
  copyAbiFile('KYC');

  await copyAbiFileForWeb('SecurityFactory', securityFactoryAddress);
  //console.log('constantFile', constantFile);
}

task('fundlink', 'fund link', async function(taskArgs, href) {
  fundLink(href, "0x3D7CD28EfD08FfE9Ce8cA329EC2e67822C756526");
});

const fundLink = async function (href: any, address: string) {

  const fromLINKAddress = '0xa7a82DD06901F29aB14AF63faF3358AD101724A8';

  await href.network.provider.send("hardhat_impersonateAccount", [fromLINKAddress])
  const impersonatedSigner = await href.ethers.getSigner(fromLINKAddress)

  // create the token instance
  const contract = await href.ethers.getContractAt("ERC20", linkTokenAddress)
  //const contract = new hre.ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
  // connect it to the impersonated signer and send it to your signer
  console.log('funding LINK to smart contract', address)
  var result = await contract.connect(impersonatedSigner).transfer(address, 2 * 10 ** 8)

}

async function copyAbiFileForWeb(name: string, address : string) {
  let abiFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
  let abiTo = '../liminal.web.bridge/' + name + '.json';
  fs.copyFile(abiFrom, abiTo, (err: any) => {
    if (err) throw err;
    console.log(abiFrom + ' was copied to ' + abiTo);
  });

   await fs.writeFileSync('../liminal.web.bridge/securityToken.txt', address, 'utf-8');

}
function copyAbiFile(name: string) {
  let abiFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
  let abiTo = '../liminal.market.web/app/js/abi/' + name + '.json';
  fs.copyFile(abiFrom, abiTo, (err: any) => {
    if (err) throw err;
    console.log(abiFrom + ' was copied to ' + abiTo);
  });

  let jsonFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
  let jsonTo = '../liminal.market.web/src/cloud-functions/abi/' + name + '.json';
  fs.copyFile(jsonFrom, jsonTo, (err: any) => {
    if (err) throw err;
    console.log(jsonFrom + ' was copied to ' + jsonTo);
  });
}

task('getusdc', 'gets USDC token', async (taskArgs, hre) => {
  const [signer] = await hre.ethers.getSigners()

  // impersonate account; replace with an address that actually has your token
  await hre.network.provider.send("hardhat_impersonateAccount", [fromUSDCAddress])
  const impersonatedSigner = await hre.ethers.getSigner(fromUSDCAddress)

  // create the token instance
  const contract = await hre.ethers.getContractAt("ERC20", USDC_ADDRESS)
  //const contract = new hre.ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
  // connect it to the impersonated signer and send it to your signer
  var result = await contract.connect(impersonatedSigner).transfer(liminalUserAdress, 2000 * 10 ** 6)
  console.log('result', result);
});


task('getlink', 'gets LINK token', async (taskArgs, hre) => {
  const [signer] = await hre.ethers.getSigners()
  const LIMINAL_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const LINK_ADDRESS = '0xa36085F69e2889c224210F603D836748e7dC0088';
  const fromLINKAddress = '0xceE04594D1eD3A4CC2BEE19f28afb8DB0040403A';
  // impersonate account; replace with an address that actually has your token
  await hre.network.provider.send("hardhat_impersonateAccount", [fromLINKAddress])
  const impersonatedSigner = await hre.ethers.getSigner(fromLINKAddress)

  // create the token instance
  const contract = await hre.ethers.getContractAt("ERC20", LINK_ADDRESS)
  //const contract = new hre.ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
  // connect it to the impersonated signer and send it to your signer
  var result = await contract.connect(impersonatedSigner).transfer(LIMINAL_ADDRESS, 85 * 10 ** 8)
  console.log('result', result);
});



task("getdai", "get some dai", async (taskArgs, hre) => {

  await hre.network.provider.send("hardhat_impersonateAccount", [fromAddress])
  const signer = await hre.ethers.getSigner(fromAddress);
  const contract = new hre.ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  let balance = await contract.balanceOf(fromAddress);
  console.log('balance:', hre.ethers.utils.formatUnits(balance, 18));

  const result = await contract.connect(signer).transfer(liminalUserAdress, balance)
    .then(async (transaction: any) => {
      console.log("Transaction:", transaction);

    }).finally((ble: any) => {
      //console.log('finally', ble);
    });

  const accountBalance = await contract.balanceOf(liminalUserAdress)
  var ble = process.env.PRIVATE_KEY;
  console.log("funded account balance", accountBalance / 1e6)
  const whaleBalanceAfter = await contract.balanceOf(fromAddress);

  console.log("whale balance after", whaleBalanceAfter / 1e6)

  const stopImpersinateResult = await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [fromAddress],
  });
  console.log(6, stopImpersinateResult);

});

const getPrivateKey = function () {
  return process.env.PRIVATE_KEY;
}

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
    polygon: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/juxV3zTRKJYvfYHqWP6p1vaEY0Xn2Pp4',
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
