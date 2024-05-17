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

    address: "0x424982C7e5b95922694d6e14E3e03108609FDb68",
    chain: "Base sepolia",
    // bet: "",
    // priceTarget: "", 
    // token: "",
    // deadline: "",
  });
  const [status, setStatus] = useState<any>();

  console.log('-----loggging status for sake---', status);


  const create = async () => {
    const col = { owner: user?.wallet?.address, ...bet }

    let data = await storeDataInFirebase(col);

    console.log('here is res after storing data--------', data);


    if (data === undefined) {
      setStatus({
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

            {/* <Input
              type="text"
              placeholder="Unix Millisecond Timestamp"
              onChange={(e) => setBet({ ...bet, deadline: e.target.value })}
              value={bet.deadline}
            /> */}
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
                  : `${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/api/${status._id.stringValue}`}</div></>
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
