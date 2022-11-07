import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getImplementationAddress} from "@openzeppelin/upgrades-core";

export default class Verify {

    private hre : HardhatRuntimeEnvironment;
    constructor(hre : HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    public async verifyContract(proxyAddress : string) {
        try {
            console.log(this.hre.network.name);

            const address = await getImplementationAddress(this.hre.network.provider, proxyAddress);

            console.log('verify address:' + address);
            await this.hre.run("verify:verify", {
                    address: address,
                }
            );
        } catch (e : any) {
            if (e.toString().indexOf('source code already verified') == -1) {
                throw e;
            }
        }
    }

}