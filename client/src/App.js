import React, { Component } from "react";
import MyTokenContract from "./contracts/MyToken.json";
import MyTokenSaleContract from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAccount: "Write your account address here", tokenSaleAddress: null, tokenAddress: null, userTokens: 0, totalSuply: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.instanceMyTokenContract = new this.web3.eth.Contract(
        MyTokenContract.abi,
        MyTokenContract.networks[this.networkId] && MyTokenContract.networks[this.networkId].address,
      );

      this.instanceMyTokenSaleContract = new this.web3.eth.Contract(
        MyTokenSaleContract.abi,
        MyTokenSaleContract.networks[this.networkId] && MyTokenSaleContract.networks[this.networkId].address,
      );

      this.instanceKycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      this.listenToTokenTransfer();
      this.updateTotalSuply();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true, tokenSaleAddress: MyTokenSaleContract.networks[this.networkId].address, tokenAddress: MyTokenContract.networks[this.networkId].address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.instanceMyTokenContract.methods.balanceOf(this.accounts[0]).call();
    this.setState({ userTokens: userTokens });
  }

  updateTotalSuply = async () => {
    let totalSuply = await this.instanceMyTokenContract.methods.totalSupply().call();
    this.setState({ totalSuply: totalSuply });
  }

  listenToTokenTransfer = () => {
    this.instanceMyTokenContract.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens);
    this.instanceMyTokenContract.events.Transfer({ to: this.accounts[0] }).on("data", this.updateTotalSuply);
  }

  handleInputChange = (event) => {
    let target = event.target;
    let value = event.target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleBtnWhiteList = async () => {
    await this.instanceKycContract.methods.setKycCompleted(this.state.kycAccount).send({ from: this.accounts[0] });
    alert("The account " + this.state.kycAccount + " was white listed.");
  };

  handleBuyTokens = async () => {
    await this.instanceMyTokenSaleContract.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: this.web3.utils.toWei("1", "wei") });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Super Rentable Ariel Token Sale</h1>
        <p>Wanna be rich???</p>
        <p>Get your super rentable Ariel tokens now!! ;)</p>
        <div className="MainDiv">
          <h2>1st step</h2>
          <label>Whitelist your account</label><br></br>
          <input type="text" name="kycAccount" value={this.state.kycAccount} onChange={this.handleInputChange}></input>
          <button type="button" name="btnwhiteListAccount" onClick={this.handleBtnWhiteList}><b>Whitelist now</b></button>
          <h2>2nd step</h2>
          <button type="button" onClick={this.handleBuyTokens}>Just click here!</button>
          <p>You currently have: <b>{this.state.userTokens}</b> Super Rentable Ariel Tokens</p>
          <h2>3rd step</h2>
          Enjoy your tokens! ;)
          <p className="pextra">Extra Information</p>
          <div className="ExtraInfo">
            <p>Current Total Supply: <b>{this.state.totalSuply}</b></p>
            <p>MyTokenSale Contract Address: <b>{this.state.tokenSaleAddress}</b> <label>You can buy tokens, sending Wei to this address:</label></p>
            <p>MyToken Contract Address: <b>{this.state.tokenAddress}</b></p>
            <p> </p>
          </div>
          <br />
          Note: <label>This web page is configured to work with the Ropsten Test Network</label>
        </div>
      </div>
    );
  }
}

export default App;
