import axie from "../tile.jpeg";
import {
    BrowserRouter as Router,
    Link,
} from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile(data) {
    const newTo = {
        pathname: "/nftPage/" + data.data.tokenId
    }

    const IPFSUrl = data.data.image;

    return (
        <Link to={newTo} className="group">
            <div className="relative border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-xl transform transition hover:scale-105">
                
                <img src={IPFSUrl} alt="" className="w-72 h-80 rounded-t-lg object-cover" />
                
                <div className="absolute bottom-0 text-white w-full p-4 bg-gradient-to-t from-black to-transparent rounded-b-lg backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition">{data.data.name}</h3>
                    <p className="text-sm overflow-ellipsis overflow-hidden h-10">{data.data.description}</p>
                </div>
            </div>
        </Link>
    )
}

export default NFTTile;

