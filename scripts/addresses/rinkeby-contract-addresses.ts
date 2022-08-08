import ContractAddresses from "./ContractAddresses";

export default class rinkebyContractAddresses implements ContractAddresses{
	ChainId = "4";
	NetworkName = "rinkeby"
	KYC_ADDRESS = "0x1d8AeaC4cEaBe985e1AD73B8F09ae57284834Fd7";
	AUSD_ADDRESS = "0x4925f35Db2b3fB7FF2A5F0525Da29CB4F5F12cAc";
	LIMINAL_MARKET_ADDRESS = "0xFBaAb9F394F1aA80182dD6FFb5187E48cAFB9922";
	MARKET_CALENDAR_ADDRESS = "";
	getRelayerAddress(): string {
		return "";
	}


}