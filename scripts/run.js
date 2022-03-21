

async function main() {

  const Nftminter = await hre.ethers.getContractFactory("NFTminter");
  const nftMinter = await Nftminter.deploy();

  await nftMinter.deployed();

  console.log("Contract deployed to:", nftMinter.address);

  let txn = await nftMinter.awardNFT()
  await txn.wait()
  console.log("NFT MINT 1")

  txn = await nftMinter.awardNFT()
  await txn.wait()
  console.log("NFT MINT 2")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
