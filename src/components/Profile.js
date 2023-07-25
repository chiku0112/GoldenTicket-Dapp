import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";

export default function Profile () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
    
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        let transaction = await contract.getMyNFTs();
    
        const items = await Promise.all(transaction.map(async i => {
            // Fetch metadata directly from the contract
            const metadata = await contract.tokenMetadata(i.tokenId);
            
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: metadata.imageURL, // Use the on-chain imageURL
                name: metadata.name,
                description: metadata.description,
            }
            sumPrice += Number(price);
            return item;
        }));
    
        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
    }
    

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

        return (
            <div className="bg-18392B min-h-screen py-6">
                <Navbar />
    
                <div className="container mx-auto mt-10 px-6 md:px-0">
    
                    {/* Profile Details */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
                        <h2 className="font-semibold text-2xl mb-6 text-gray-800 border-b pb-2">Profile Details</h2>
    
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <div className="text-center">
                                <label className="block font-semibold mb-2">Wallet Address:</label>
                                <span className="text-gray-600 break-all">{address}</span>
                            </div>
    
                            <div className="text-center">
                                <label className="block font-semibold mb-2">No. of NFTs:</label>
                                <span className="text-gray-600">{data.length}</span>
                            </div>
    
                            <div className="text-center">
                                <label className="block font-semibold mb-2">Total Value:</label>
                                <span className="text-gray-600">{totalPrice} ETH</span>
                            </div>
                        </div>
                    </div>
    
                    {/* NFT Listing */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-white">Your NFTs</h2>
    
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.map((value, index) => {
                                return <NFTTile data={value} key={index} />;
                            })}
                        </div>
    
                        <div className="mt-10 text-xl text-white">
                            {data.length === 0 ? "Oops, No NFT data to display (Are you logged in?)" : ""}
                        </div>
                    </div>
                </div>
            </div>
        )
};