import { ethers, parseEther } from 'ethers'
import { ERC721ABI, MarketplaceAbi } from './abi';

const approveAndListNFTs = async (nftContractAddress, nftDetails) => {

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const marketplaceAddress = '0x2191B2055B305f2b3081d0233b4125614afD14Be';
    const nftContract = new ethers.Contract(nftContractAddress, ERC721ABI, signer);
    const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketplaceAbi, signer);

    try {
        for (const { tokenId, price } of nftDetails) {
            console.log('Token ID and Price:', tokenId, price);
            const approveTx = await nftContract.approve(marketplaceAddress, tokenId);
            const receipt = await approveTx.wait();
            console.log('Transaction receipt:', receipt);

            const listTx = await marketplaceContract.listPFP(nftContractAddress, tokenId, ethers.parseEther(price.toString()));
            await listTx.wait();
            console.log('Transaction receipt:', receipt);

        }
        return true;

    } catch (error) {
        console.error('Error approving and listing NFTs:', error);
        return false;
    }
};

export default approveAndListNFTs;