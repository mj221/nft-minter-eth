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

  const mintNFT = async () =>{
    const CONTRACT_ADDRESS = "0xA9CA026b4f897B578BF6d610fdF0a657AD39f100"

    try{
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, NFTminter.abi, signer)

        let nftTxn = await connectedContract.awardNFT()
        console.log(`Mined at: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() =>{
    checkIfWalletIsConnected()
  }, [])
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : (<button onClick={mintNFT} className="cta-button connect-wallet-button">Mint NFT</button>)
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
