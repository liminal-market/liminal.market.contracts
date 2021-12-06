import { getContractsByNetwork } from "./networks";
import { writeContractAddressesToJs} from './filehelper'
import { BigNumber } from "@ethersproject/bignumber";

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

  await securityFactoryContract.grantMintAndBurnRole(contractInfo.liminalBackendAddress);
  await aUsdContract.grantRoleForBalance(securityFactoryContract.address);
  await aUsdContract.setAddresses(securityFactoryContract.address);
  await aUsdContract.setBalance("0x93DA645082493BBd7116fC057c5b9aDfd5363912", BigNumber.from("1000" + "0".repeat(18)));
  await aUsdContract.setBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", BigNumber.from("1000" + "0".repeat(18)));

  await writeContractAddressesToJs(hre, kycContract.address,
    aUsdContract.address, securityFactoryContract.address, contractInfo.usdcContractAddress);
  //await fundLink(hre, liminalContract.address);

  console.log('done:' + new Date());
}


export const grantRole = async function(hre : any) {
  console.log('granting role');

  let securityFactoryContract = await deployContract(hre, "SecurityFactory", false,
    "0x30bC5Da8636Ff5DAd4c44E624FAa2ebb61848814");
  let result = await securityFactoryContract.grantMintAndBurnRole('0xa22610E72cF86f3ef1a2A1f34D89f9E5B0EFc0AA');
  console.log(JSON.stringify(result));
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