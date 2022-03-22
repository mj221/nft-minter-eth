require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const privateKey = process.env.PRIVATE_KEY || "";
const privateKeyArray = privateKey.split(',')
const infuraProjectId = process.env.INFURA_PROJECT_ID;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  settings: {
    optimizer: {
        enabled: true,
        runs: 1000000,
    },
  },
  mocha: {
    // timeout: 90000
  },
  paths:{
    artifacts: "./app/src/build",
    sources: "./contracts",
    tests: "./test",
    cache: "./cache"
  },
  defaultNetwork: "hardhat",
  networks:{
    // ropsten:{
    //   url: `https://ropsten.infura.io/v3/${infuraProjectId}`,
    //   accounts: privateKeyArray,
    // }
    hardhat:{
      chainId: 1337,
      gas: 2100000,
      gasPrice: 8000000000
    },
    rinkeby:{
      url: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      accounts: privateKeyArray,
    }
  }
};
