import {HardhatRuntimeEnvironment} from "hardhat/types";
import {AUSD, LiminalMarket, MarketCalendar, ServiceSettings} from "../typechain-types";
import {LedgerSigner} from "@anders-t/ethers-ledger";
import ethProvider from "eth-provider";
import ContractInfo from "./addresses/ContractInfo";

export default class TaskHelper {
    hre: HardhatRuntimeEnvironment;

    constructor(hre: HardhatRuntimeEnvironment) {
        this.hre = hre;
        console.log('network:', hre.network.name);
    }

    public static async getLiminalMarket(hre: any) {
        const contractInfo = ContractInfo.getContractInfo(hre.network.name);

        let liminalMarketFactory = await hre.ethers.getContractFactory('LiminalMarket');
        return liminalMarketFactory.attach(contractInfo.LIMINAL_MARKET_ADDRESS) as LiminalMarket;
    }

    public static async getServiceSettings(hre: any) {
        const contractInfo = ContractInfo.getContractInfo(hre.network.name);

        let serviceSettingsFactory = await hre.ethers.getContractFactory('ServiceSettings');
        return serviceSettingsFactory.attach(contractInfo.SERVICE_SETTINGS_ADDRESS) as ServiceSettings;
    }

    public async fundAUSD(contractAddress: string, amount = "1000000000000000000000", userWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {
        console.log('aUSD address:' + contractAddress);
        const contract = await this.hre.ethers.getContractAt("aUSD", contractAddress) as AUSD;
        await contract.setBalance(userWallet, amount, 1);
        console.log('Funded ' + amount + ' to wallet ' + userWallet);
        let balance = await contract.balanceOf(userWallet);
        console.log('retrieved balance:' + balance)
    }

    public async setMarketCalendarAsOpen(contractAddress: string) {
        let opens = [new Date(((new Date().getTime() - (10 * 24 * 60 * 60 * 1000)) / 1000)).getTime(), new Date('Mar-20-2022').getTime()];
        let closes = [new Date(((new Date().getTime() + (10 * 24 * 60 * 60 * 1000)) / 1000)).getTime(), new Date('May-30-2022').getTime()];
        console.log('opens:' + new Date(opens[0]).getTime());
        console.log('closes:' + new Date(closes[0]).getTime());
        const contract = await this.hre.ethers.getContractAt("MarketCalendar", contractAddress) as MarketCalendar;
        await contract.setCalendar(opens, closes);
    }

    static GetSigner(hre: HardhatRuntimeEnvironment) {
        if (hre.network.name == 'localhost' || hre.network.name == 'hardhat'
            || hre.network.name == 'fuji' || hre.network.name == 'mumbai') return hre.ethers.provider.getSigner();

        return hre.ethers.provider.getSigner();
        let signer = new LedgerSigner(hre.ethers.provider);
        console.log(signer.path);
        return signer;

    }
}