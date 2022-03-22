import './styles/App.css'
import twitterLogo from './assets/twitter-logo.svg'
import {SolarSystemLoading} from 'react-loadingg'

import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import NFTminter from './build/contracts/NFTminter.sol/NFTminter.json'

// Constants
const TWITTER_HANDLE = 'mjkid221'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const TOTAL_MINT_COUNT = 50
const CONTRACT_ADDRESS = "0xb76fa3D109aF35c64990C19d9881a1A3e036DB69" // rinkeby

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("")
  const [loading, setLoadingStatus] = useState(false)
  const [openSeaLink, setOpenSeaLink] = useState("")
  const [minted, setMintStatus] = useState(false)

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window

    if(!ethereum){
      console.log("MetaMask needs to be installed.")
      return
    }else{
      console.log("MetaMask loaded.")
    }

    const accounts = await ethereum.request({method: 'eth_accounts'})
    if (accounts.length !== 0){
      const account = accounts[0]
      console.log("Account: ", account)
      setCurrentAccount(account)
      setupEventListener()
    }else{
      console.log("Account not found")
    }
  }
  const connectWallet = async () =>{
    try{
      const { ethereum } = window
      if(!ethereum){
        alert("Requires MetaMask installation.")
        return
      }
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      
      setCurrentAccount(accounts[0])
      setupEventListener()
    }catch(err){
      console.log(err)
    }
  }
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  )
  const setupEventListener = async () =>{
    
    try{
      const { ethereum } = window
      let NFTMinter
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        NFTMinter = new ethers.Contract(CONTRACT_ADDRESS, NFTminter.abi, signer)

        provider.once("block", () =>{
          NFTMinter.on("NewNFTMinted", (from, tokenId) => {
            setLoadingStatus(false)
            console.log(from, tokenId.toNumber())

            setOpenSeaLink(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
            // alert("NFT Minted!")
          })
        })
        
        ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
      }
    }catch(err){
      console.log(err)
      setLoadingStatus(false)
    }
  }
  const mintNFT = async () =>{
    setMintStatus(false)
    setOpenSeaLink("")
    setLoadingStatus(true)
    try{
      const {ethereum} = window

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const NFTMinter = new ethers.Contract(CONTRACT_ADDRESS, NFTminter.abi, signer)

        let nftTxn = await NFTMinter.awardNFT({gasLimit: 3000000})
        

        console.log("Minting...")
        await nftTxn.wait()

        console.log(`Minted at: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
        setMintStatus(true)
      }else{
        console.log("Ethereum object does not exist.")
      }
    }catch(err){
      console.log(err)
      setLoadingStatus(false)
      setMintStatus(false)
      alert("Could not mint NFT. Please try again.")
    }
  }

  useEffect(() =>{
    checkIfWalletIsConnected()

    async function checkChainId(){
      let chainId = await window.ethereum.request({method: 'eth_chainId'})
      const rinkebyChainId = "0x4"
      if (chainId !== rinkebyChainId){
        alert("NFT Mint contract not deployed on the current network. Please switch to Rinkeby.")
      }
    }
    checkChainId()
    
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Master NFT Collection</p>
          <p className="sub-text">
            Mint NFTs that contain a unique combination of snazzy titles just for you.
          </p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : (<button onClick={mintNFT} className="cta-button connect-wallet-button">Mint NFT</button>)
          }
        </div>
        <div>
          {loading?
          <SolarSystemLoading/>
          : <div></div>
          }
          {openSeaLink && minted
            ?
              <div>
                <button 
                  className="cta-button opensea-button"
                  rel="noreferrer"
                  onClick = {() => {
                    window.open(openSeaLink, "_blank")
                  }}
                >
                  {openSeaLink}
                </button>
                <button 
                  className="cta-button connect-wallet-button"
                  rel="noreferrer"
                  style={{marginLeft: "5px"}}
                  onClick = {() => {
                    window.open(openSeaLink, "_blank")
                  }}
                >
                  CLAIM
              </button>
              </div>
            :<div></div>
          }
          
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
