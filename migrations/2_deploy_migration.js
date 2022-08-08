var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");
var KeyContract = artifacts.require("./KycContract.sol");

require("dotenv").config({ path: "../.env" });
// console.log(process.env);

module.exports = async function (deployer) {
    let addr = await web3.eth.getAccounts();

    await deployer.deploy(KeyContract);

    // await deployer.deploy(MyToken, process.env.INITIAL_SUPLY);
    await deployer.deploy(MyToken);
    await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, KeyContract.address);

    let myTokenInstance = await MyToken.deployed();
    myTokenInstance.addMinter(MyTokenSale.address);

    // await myTokenInstance.transfer(MyTokenSale.address, process.env.INITIAL_SUPLY);        
}