"use client";
import { Button } from "./api/components/ui/button";
import { Input } from "./api/components/ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
// import { SUPPORTED_TOKENS } from "./constants";
import storeDataInFirebase from "./models/firebase.js"
import { Terminal } from "lucide-react";

export default function Home() {
  const { authenticated, user, login, ready, logout } = usePrivy();
  const [bet, setBet] = useState({
    title: "",
    address: "0x424982C7e5b95922694d6e14E3e03108609FDb68",
    chain: "Base sepolia",
    // bet: "",
    // priceTarget: "", 
    // token: "",
    // deadline: "",
  });
  const [status, setStatus] = useState<any>();

  // console.log('-----loggging status for sake---', status);


  const create = async () => {
    const col = { owner: user?.wallet?.address, ...bet }

    let data = await storeDataInFirebase(col);

    console.log('here is res after storing data--------', data);


    if (data === undefined) {
      setStatus({
        title: "",
        _id: "",
        address: "",
        chain: "",
        // bet: "",
        // priceTarget: "",
        // token: "",
        // deadline: "",
        error: true,
      });
    } else
      setStatus({
        title: data.title,
        _id: data.id,
        // bet: data.bet.bet,
        address: data.address,
        chain: data.chain,
        uris: data.uris,
        // priceTarget: data.bet.priceTarget,
        // token: data.bet.token,
        // deadline: data.bet.deadline,
        error: false,
      });
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
            {/* <Input
              type="text"
              placeholder="0.05"
              onChange={(e) => setBet({ ...bet, priceTarget: e.target.value })}
              value={bet.priceTarget}
            /> */}

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

          {status && (
            <>
              <div>    {status?.error
                ? "Something went wrong, try again"
                : "Successfully created"}</div>
              <div>
                {status?.error
                  ? "try again"
                  // : `${process.env.NEXT_PUBLIC_BASE_URL}api/${status._id.stringValue}` || `http://localhost:3000/api/${status._id.stringValue}`
                  :
                  <a
                    href={`https://warpcast.com/~/compose?text=Hey%2C%20I%20just%20created%20my%20PFPs%20collection%20on%20SFS%21!&embeds[]=https://dynamic-pfps-base-frame.vercel.app/api/${status._id.stringValue}`}
                    // href={`${process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/${status._id.stringValue}` : `http://localhost:3000/api/${status._id.stringValue}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Post on Warpcast
                  </a>
                  // https://warpcast.com/~/compose?text=Hey%2C%20I%20just%20created%20my%20PFPs%20collection%20on%20SFS%21!&embeds[]=https://dynamic-pfps-base-frame.vercel.app/api/30S3YcCxYahofKHQLrCa

                  // `${process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/${status._id.stringValue}` : `http://localhost:3000/api/${status._id.stringValue}`}`
                }
              </div></>
          )}
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


        // <main className="flex flex-col justify-center items-center gap-2 mt-[100px]">
        //   <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        //     Welcome to Degen Bets
        //   </h2>

        //   <Button onClick={login} className="w-40" disabled={!ready}>
        //     Login
        //   </Button>
        // </main>
      )}
    </>
  );
}
