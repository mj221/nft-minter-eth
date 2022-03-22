

const main = async() => {

  const Nftminter = await hre.ethers.getContractFactory("NFTminter");
  const nftMinter = await Nftminter.deploy();

  await nftMinter.deployed();

  console.log("Contract deployed to:", nftMinter.address);

  // let txn = await nftMinter.awardNFT()
  // await txn.wait()
  // console.log("MINTED NFT #1")

  // txn = await nftMinter.awardNFT()
  // await txn.wait()
  // console.log("MINTED NFT #2")
}

const runMain = async()=>{
  try{
    await main()
    process.exit(0)
  }catch(err){
    console.log(err)
    process.exit(1)
  }
}
runMain()
