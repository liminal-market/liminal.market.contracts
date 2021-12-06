

export const getContractsByNetwork = function(hre : any) {

	switch (hre.network.name) {
		case 'localhost':
			return new LocalhostContractInfo();
		case 'rinkeby':
			return new RinkebyhostContractInfo();
		case 'mumbai':
			return new MumbaihostContractInfo();
		default:
			return new LocalhostContractInfo();
	}


}

class LocalhostContractInfo {
	liminalUserAdress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

	//constructor parameters
	brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';
	liminalAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
	linkTokenAddress = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
	usdcContractAddress = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b';
	liminalBackendAddress = '0x90f79bf6eb2c4f870365e785982e1f101e93b906';

	//funding addresses, to take some token values, only localhost dev, it's from rinkeby fork
	fromUSDCAddress = '0xAb6424ece567043d09DB011d7075fd83616EFd93';
	fromLINKAddress = '0xa7a82DD06901F29aB14AF63faF3358AD101724A8';

}

class RinkebyhostContractInfo {
	liminalUserAdress = '0x93DA645082493BBd7116fC057c5b9aDfd5363912';

	//constructor parameters
	brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';
	liminalAddress = '0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //'0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //rinkeby
	liminalBackendAddress = '0xa22610E72cF86f3ef1a2A1f34D89f9E5B0EFc0AA'; //'0x90f79bf6eb2c4f870365e785982e1f101e93b906'; local

	linkTokenAddress = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'; //'0xa36085F69e2889c224210F603D836748e7dC0088'; //kovan -   rinkeby
	usdcContractAddress = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b'; // '0xe22da380ee6B445bb8273C81944ADEB6E8450422'; //kovan - 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b rinkeby

	//funding addresses, funding not possible on rinkeby network
	fromUSDCAddress = ''
	fromLINKAddress = '';
}

class MumbaihostContractInfo {
	liminalUserAdress = '0x93DA645082493BBd7116fC057c5b9aDfd5363912'; //'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; hardhat local account

	//constructor parameters
	brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';//'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';- hardhat local accounts
	liminalAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; //'0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //rinkeby
	linkTokenAddress = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'; //'0xa36085F69e2889c224210F603D836748e7dC0088'; //kovan -   rinkeby
	usdcContractAddress = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b'; // '0xe22da380ee6B445bb8273C81944ADEB6E8450422'; //kovan - 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b rinkeby
	liminalBackendAddress = '0xa22610E72cF86f3ef1a2A1f34D89f9E5B0EFc0AA'; //'0x90f79bf6eb2c4f870365e785982e1f101e93b906'; local
	//funding addresses

	//fromUSDCAddress = '0x50b42514389F25E1f471C8F03f6f5954df0204b0'; //main net
	fromUSDCAddress = '0xAb6424ece567043d09DB011d7075fd83616EFd93' //rinkeby '0x99fd75645b30870071909c261a660bfe9d90b267'; //kovan
	fromLINKAddress = '0xa7a82DD06901F29aB14AF63faF3358AD101724A8';
}
