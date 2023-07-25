import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";

export default function SellNFT () {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();
    const [category, setCategory] = useState(true);

    async function disableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = true
        listButton.style.backgroundColor = "grey";
        listButton.style.opacity = 0.3;
    }

    async function enableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = false
        listButton.style.backgroundColor = "#A500FF";
        listButton.style.opacity = 1;
    }

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            disableButton();
            updateMessage("Uploading image.. please dont click anything!")
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                enableButton();
                updateMessage("")
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL("https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn-images.farfetch-contents.com%2F12%2F96%2F03%2F49%2F12960349_13486594_1000.jpg&tbnid=k39JfD6DOujfaM&vet=12ahUKEwijlJbE56eAAxWwm2MGHbH_C7IQ94IIKA16BQgBEI8C..i&imgrefurl=https%3A%2F%2Fwww.farfetch.com%2Fin%2Fshopping%2Fmen%2Fjordan-air-jordan-1-retro-high-og-black-toe-sneakers-item-12960349.aspx&docid=MjIx_KVZMNOXRM&w=1000&h=1334&q=nike%20jordan&safe=active&ved=2ahUKEwijlJbE56eAAxWwm2MGHbH_C7IQ94IIKA16BQgBEI8C");
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }

    async function listNFT(e) {
        e.preventDefault();
    
        const { name, description, price, imageURL } = formParams;
        
        // Validate the data
        if (!name || !description || !price || !imageURL) {
            updateMessage("Please fill all the fields!");
            return;
        }
    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        disableButton();
        updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!");
    
        let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
    
        const etherPrice = ethers.utils.parseUnits(price, 'ether');
        let listingPrice = await contract.getListPrice();
        listingPrice = listingPrice.toString();
    
        let transaction = await contract.createToken(name, description, imageURL, etherPrice, { value: listingPrice });
        await transaction.wait();
    
        alert("Successfully listed your NFT!");
        enableButton();
        updateMessage("");
        updateFormParams({ name: '', description: '', price: '', imageURL: '' });
        window.location.replace("/");
    }
    

    console.log("Working", process.env);
    return (
        <div className="bg-18392B min-h-screen py-6">
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-xl w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
            <h3 className="text-center font-bold text-green-custom mb-6 text-2xl">Upload your NFT</h3>
                
                <div className="mb-4">
                    <label className="block text-green-custom font-semibold mb-2" htmlFor="category">Category</label>
                    <select className="focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-3" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="Pre Book Luxurious Items">Pre Book Luxurious Items</option>
                        <option value="Pre Book Tickets">Pre Book Tickets</option>
                        <option value="Others">Others</option>
                    </select>
        
                </div>

                { 
                <div className="mb-4">
                    <label className="block text-green-custom font-semibold mb-2" htmlFor="catalogUrl">Catalog URL</label>
                    <input className="focus:border-green-custom focus:ring-1 focus:ring-green-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-3" id="catalogUrl" type="text" placeholder="Catalog link" onChange={e => updateFormParams({...formParams, catalogUrl: e.target.value})} value={formParams.catalogUrl}></input>
                </div>
                }

                <div className="mb-4">
                    <label className="block text-green-custom font-semibold mb-2" htmlFor="name">NFT Name</label>
                    <input className="focus:border-green-custom focus:ring-1 focus:ring-green-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-3" id="name" type="text" placeholder="Sneaker" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>

                <div className="mb-4">
                    <label className="block text-green-custom font-semibold mb-2" htmlFor="description">Description</label>
                    <textarea className="focus:border-green-custom focus:ring-1 focus:ring-green-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-3" cols="40" rows="5" id="description" placeholder="Pre Book Sneaker Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-green-custom font-semibold mb-2" htmlFor="price">Price (ETH)</label>
                    <input className="focus:border-green-custom focus:ring-1 focus:ring-green-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-3" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div>

                <div className="mb-4">
                    <label className="block text-green-custom font-semibold mb-2" htmlFor="name">Image URL</label>
                    <input className="focus:border-green-custom focus:ring-1 focus:ring-green-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-3" id="imageUrl" type="text" placeholder="Image link" onChange={e => updateFormParams({...formParams, imageURL: e.target.value})} value={formParams.imageURL}></input>
                </div>

                <div className="mb-6">
                    <label className="block text-green-custom font-semibold mb-2" htmlFor="image">Upload Image (&lt;500 KB)</label>
                    <div className="relative">
                        <button className="px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Choose File</button>
                        <input type={"file"} onChange={OnChangeFile} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                </div>

                <div className="text-red-custom text-center mb-4">{message}</div>
                
                <button onClick={listNFT} className="font-bold w-full green-custom rounded-lg p-2 shadow-md focus:outline-none green-custom-hover" id="list-button">
                    List NFT
                </button>
            </form>
        </div>
        </div>
    )
}