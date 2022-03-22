//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";

contract NFTminter is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // basic svg starter code
    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["Fantastic", "Awesome", "Great", "Amazing", "Cool", "Good"];
    string[] secondWords = ["Horrifying", "Terrifying", "Cruel", "Crude", "Bad", "Evil"];
    string[] thirdWords = ["Web3Developer", "CryptoTrader", "NFTCollector", "EarlyInvestor", "Hodler", "DeFiDegen"];

    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green", "orange", "purple"];

    event NewNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721 ("MasterNFT", "MNFT"){
        console.log("NFT contract deployed");
    }

    function random(string memory input) internal pure returns (uint256){
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId), Strings.toString(block.timestamp), Strings.toString(block.difficulty) )));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId), Strings.toString(block.timestamp), Strings.toString(block.difficulty) )));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId), Strings.toString(block.timestamp), Strings.toString(block.difficulty) )));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }

    function awardNFT() public{
        uint256 newItemId = _tokenIds.current();

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        string memory randomColor = pickRandomColor(newItemId);
        string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        combinedWord,
                        '", "description": "An NFT from a highly acclaimed collection of Master NFTs',
                        '", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        console.log("\n----------------------");
        console.log(finalTokenUri);
        console.log("----------------------\n");
        

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);

        _tokenIds.increment();
        console.log("An NFT w/ID %s has been minted to %s", newItemId, msg.sender);
        
        emit NewNFTMinted(msg.sender, newItemId);
    }

}
