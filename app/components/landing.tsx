"use client";
import { Button } from "../api/components/ui/button";
import { Input } from "../api/components/ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
// import { SUPPORTED_TOKENS } from "./constants";
import storeDataInFirebase from "../models/firebase.js"
import getNFTCollection from "../models/fetchCollection.js"
import NFTCollection from "../models/DisplayNftCollection.js"
import { Terminal } from "lucide-react";
import { usePFPContext } from "../context/StatusContext";

function LandingPage() {

    const { isListed, setIsListed } = usePFPContext();

    const { authenticated, user, login, ready, logout } = usePrivy();
    const [bet, setBet] = useState({
        title: "22 May this is a test title",
        address: "0xf1784AFa93603d4f0adAAA1aA5f68712E70c4784",
        chain: "Base sepolia",
    });
    const [nftData, setNftData] = useState([]);

    const create = async () => {

        const col = { owner: user?.wallet?.address, ...bet }
        const uris = await getNFTCollection(col, user?.wallet?.address)

        console.log('------here is all uris======', uris);
        setNftData(uris);


        // let data = await storeDataInFirebase(col, user?.wallet?.address);
        // console.log('here is res after storing data--------', data);


        //   if (data === undefined) {
        //     setStatus({
        //       title: "",
        //       _id: "",
        //       address: "",
        //       chain: "",
        //       error: true,
        //     });
        //   } else
        //     setStatus({
        //       title: data.title,
        //       _id: data.id,
        //       address: data.address,
        //       chain: data.chain,
        //       uris: data.uris,
        //       error: false,
        //     });
    };
    return (
        <>
            {authenticated ? (
                <main className="flex flex-col justify-center items-center gap-2 mt-[100px]">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        post you PFP collection on sell
                    </h2>
                    <div className="flex flex-col gap-2 w-[400px]">
                        <Input
                            type="text"
                            placeholder="paste your collection address here.."
                            onChange={(e) => setBet({ ...bet, address: e.target.value })}
                            value={bet.address}
                        />
                        <Input
                            type="text"
                            placeholder="title"
                            onChange={(e) => setBet({ ...bet, title: e.target.value })}
                            value={bet.title}
                        />
                    </div>

                    <Button className="w-40" onClick={create}>
                        Create
                    </Button>
                    <Button onClick={logout} className="w-40"
                    // disabled={!ready}
                    >
                        Logout
                    </Button>

                    <div>
                        {isListed.status === true ?
                            <><a
                                href={`https://warpcast.com/~/compose?text=Hey%2C%20I%20just%20created%20my%20PFPs%20collection%20on%20SFS%21!&embeds[]=https://dynamic-pfps-base-frame.vercel.app/api/${isListed.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Post on Warpcast
                            </a>
                                <p>{`http://localhost:3000/api/${isListed.id}`}</p></>
                            :
                            "try again!!"
                        }
                        {/* {isListed.status === false
                            ? "try again"
                            :
                            <><a
                                href={`https://warpcast.com/~/compose?text=Hey%2C%20I%20just%20created%20my%20PFPs%20collection%20on%20SFS%21!&embeds[]=https://dynamic-pfps-base-frame.vercel.app/api/${isListed.id.stringValue}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Post on Warpcast
                            </a>
                                <p>{`http://localhost:3000/api/${isListed.id.stringValue}`}</p></>
                        } */}
                    </div>
                </main>
            ) : (

                <main className="flex flex-col justify-center items-center gap-2 mt-[100px]">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Welcome to PFP Frames
                    </h2>

                    <Button onClick={login} className="w-40"
                    // disabled={!ready}
                    >
                        Login
                    </Button>
                </main>
            )}

            <NFTCollection nfts={nftData}
                metadata={bet}
                userAddress={user?.wallet?.address}
            />

        </>
    );
}


export default LandingPage;