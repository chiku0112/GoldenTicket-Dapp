import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function NFTPage (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");


async function getNFTData(tokenId) {
    const ethers = require("ethers");
    
    // Initialize provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();

    // Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

    // Fetch metadata directly from the contract
    const metadata = await contract.tokenMetadata(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);

    let item = {
        price: ethers.utils.formatUnits(listedToken.price.toString(), 'ether'), // Assuming price is stored in wei
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: metadata.imageURL,
        name: metadata.name,
        description: metadata.description,
    }

    console.log(item);

    updateData(item);
    updateDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function
        let transaction = await contract.executeSale(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);
  

    console.log(data)

    return (
        <div className="bg-18392B min-h-screen py-6" style={{"min-height":"100vh"}}>
        <Navbar />
        <div className="flex items-start space-x-10 mt-20 ml-20">
            <img src={data.image} alt="" className="w-1/3 rounded-lg shadow-lg" />
            <div className="flex-none w-1/3 bg-black bg-opacity-70 p-8 rounded-lg shadow-xl space-y-6">
                    <h2 className="text-3xl text-white font-bold mb-4 border-b pb-2">{data.name}</h2>
                    <p className="text-white border-b pb-2">{data.description}</p>
                    <div className="text-white font-medium border-b pb-2">Price: {data.price + " ETH"}</div>
                    {data.category && <div className="text-white font-medium border-b pb-2">Category: {data.category}</div>}
                    {data.catalogUrl && <div className="text-white font-medium border-b pb-2">Catalog URL: <a href={data.catalogUrl} className="text-blue-400 underline">{data.catalogUrl}</a></div>}
                    <div className="text-white font-medium border-b pb-2">Owner: {data.owner}</div>
                    <div className="text-white font-medium border-b pb-2">Seller: {data.seller}</div>
                    {currAddress !== data.owner && currAddress !== data.seller ?
                    <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                    : <div className="text-emerald-700 bg-yellow-300 p-2 mt-2 rounded text-lg font-bold">You are the owner of this NFT !!</div>
                }

                <div className="text-green-400 text-center mt-3">{message}</div>
                </div>
            </div>
        </div>
    )
}