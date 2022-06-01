import ContractInfo from "../../../scripts/addresses/ContractInfo";
import {expect} from "chai";

describe("Tests ContractInfo class", () => {

    it("get all networks available", async ()=>{
        let networks = ["localhost", "rinkeby", "mumbai", "fuji"];
        for (let i=0;i<networks.length;i++) {
            let contractAddress = ContractInfo.getContractInfo(networks[i]);
            expect(contractAddress.AUSD_ADDRESS).to.contain('0x');
            expect(contractAddress.KYC_ADDRESS).to.contain('0x');
            expect(contractAddress.LIMINAL_MARKET_ADDRESS).to.contain('0x');
        }
    })
})