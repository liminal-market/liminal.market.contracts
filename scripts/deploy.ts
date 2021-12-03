import { getContractsByNetwork } from "./networks";
import { writeContractAddressesToJs} from './filehelper'

export const compileAndDeploy = async function(hre : any) {
  await hre.run('compile');

  const contractInfo = getContractsByNetwork(hre);

  const redeployOracle = true;
  const redeployKYC = true;
  const redeployAUSD = true;
  const redeploySecurityFactory = true;

  const oracleContract = await deployContract(hre, "Oracle", redeployOracle,
    "0xd1d50299505DE6C56e564E15eeF88CcA3b168832", [contractInfo.linkTokenAddress]);

  const kycContract = await deployContract(hre, "KYC", redeployKYC,
    "0xD5f071F2D8BF6E7d6BC25A1D89e9b1430AC78A58");
  const aUsdContract = await deployContract(hre, "aUSD", redeployAUSD,
    "0x6854DC0e58Ef1029aA42Ba61ca1160527bBeC01E");
  const securityFactoryContract = await deployContract(hre, "SecurityFactory", redeploySecurityFactory,
    "0x0c8Cd13ff68D41263E6937224B9e5c7fF54d72f9", [aUsdContract.address, kycContract.address]);

  const liminalContract = await deployContract(hre, "LiminalExchange", true, "",
    [securityFactoryContract.address, oracleContract.address, kycContract.address, aUsdContract.address,
      contractInfo.liminalAddress, contractInfo.brokerAddress, contractInfo.linkTokenAddress, contractInfo.usdcContractAddress]);

  await securityFactoryContract.grantMintAndBurnRole(contractInfo.liminalBackendAddress);
  await aUsdContract.grantRoleForBalance(securityFactoryContract.address);
  await aUsdContract.setAddresses(liminalContract.address);


  await writeContractAddressesToJs(hre, liminalContract.address, kycContract.address,
    aUsdContract.address, securityFactoryContract.address, contractInfo.usdcContractAddress);
  //await fundLink(hre, liminalContract.address);

  console.log('done:' + new Date());
}


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