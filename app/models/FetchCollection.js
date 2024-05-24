'use client'
import { baseSepolia } from 'viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { usePrivy } from "@privy-io/react-auth";
import { abi } from "./abi.js"
// const { user } = usePrivy();

export const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
})

// export const walletClient = createWalletClient({
//     account: { address: user?.wallet?.address },
//     chain: baseSepolia,
//     transport: http('https://base-sepolia.g.alchemy.com/v2/5D113o1keOcRf_BH2eRgM6AYuOK_euUo'),
// })

async function getNFTCollection(metadata, address) {

    let balance = await publicClient.readContract({
        abi: abi,
        address: metadata.address,
        functionName: 'balanceOf',
        args: [address]
    })

    const nftDataPromises = [];
    for (let i = 0; i < Number(balance); i++) {
        let tokenIdPromise = await publicClient.readContract({
            abi: abi,
            address: metadata.address,
            functionName: 'tokenOfOwnerByIndex',
            args: [address, i]
        })
        nftDataPromises.push(Number(tokenIdPromise));
    }
    const tokenIds = await Promise.all(nftDataPromises);

    const tokenURIPromises = tokenIds.map(tokenId => publicClient.readContract({
        abi: abi,
        address: metadata.address,
        functionName: 'tokenURI',
        args: [tokenId],
    }));
    const tokenURIs = await Promise.all(tokenURIPromises);

    const metadataPromises = tokenURIs.map(async (uri, index) => {
        const metadata = await fetch(uri).then(res => res.json());
        metadata.tokenId = tokenIds[index];
        return metadata;
    });

    const uris = await Promise.all(metadataPromises);
    return uris;
}

export default getNFTCollection;