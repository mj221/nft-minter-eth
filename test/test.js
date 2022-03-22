const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFtminter", function () {
  it("Nftminter deployed", async function () {
    const NftMinter = await ethers.getContractFactory("NFTminter");
    const nftminter = await NftMinter.deploy();
    await nftminter.deployed();
    console.log("Contract Deployed")
  });
});
