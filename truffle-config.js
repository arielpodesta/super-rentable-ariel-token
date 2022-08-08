require("dotenv").config({
  path: "./.env"
});
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;
module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: { //GanacheVS
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ganache_desktop: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7546", AccountIndex);
      },
      network_id: 5778
    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/6cd6a9fd66634694b4f24354d936640f", AccountIndex);
      },
      network_id: 3
    },
    dashboard: {
    }
  },
  compilers: {
    solc: {
      version: "^0.6.0",
    }
  },
  db: {
    enabled: false,
    host: "127.0.0.1",
  }
};
