'use client'
import React, { useState } from 'react';
import storeDataInFirebase from './firebase';
import approveAndListNFTs from './ApproveAndList';
import { usePFPContext } from '../context/StatusContext';
import { toast } from 'react-toastify';
const NFTCollection = ({ nfts, metadata, userAddress }) => {
    const { updateUserInfo } = usePFPContext();
    const [selectedNFTs, setSelectedNFTs] = useState({});
    const [prices, setPrices] = useState({});

    const handleSelectNFT = (index) => {
        setSelectedNFTs((prevSelected) => ({
            ...prevSelected,
            [index]: !prevSelected[index],
        }));
    };

    const handlePriceChange = (index, price) => {
        setPrices((prevPrices) => ({
            ...prevPrices,
            [index]: price.toString(),
        }));
    };


    const handleSubmit = async () => {
        const selected = Object.keys(selectedNFTs).filter(index => selectedNFTs[index]);
        const uris = selected.map(index => ({
            description: nfts[index].description,
            image: nfts[index].image,
            name: nfts[index].name,
            tokenId: nfts[index].tokenId,
            price: Number(prices[index]),
            sold: false,
        }));

        const saleData = {
            address: metadata.address,
            chain: metadata.chain,
            id: '',
            owner: userAddress,
            title: metadata.title,
            uris
        };

        const nftDetails = selected.map(index => ({
            tokenId: nfts[index].tokenId,
            price: prices[index]
        }));
        const success = await approveAndListNFTs(metadata.address, nftDetails);

        console.log('is approval is succeed? ', success);

        let data = await storeDataInFirebase(saleData);

        if (data) {
            updateUserInfo({ status: true, id: data?.id });
            toast.success('PFPs are listed for sale!!', {});
        }

        console.log('here is stored data on firebase:', data);
    }

    return (
        <div>
            <h2>Select NFTs to Put on Sale</h2>
            {nfts.length === 0 ? (
                <p>No NFTs found</p>
            ) : (
                <ul>
                    {nfts.map((nft, index) => (
                        <li key={index}>
                            <h3>{nft.name}</h3>
                            <p>{nft.description}</p>
                            <img src={nft.image} alt={nft.name} width="200" />
                            <div>
                                <input
                                    type="checkbox"
                                    id={`select-${index}`}
                                    onChange={() => handleSelectNFT(index)}
                                    checked={!!selectedNFTs[index]}
                                />
                                <label htmlFor={`select-${index}`}>Select</label>
                            </div>
                            {selectedNFTs[index] && (
                                <div>
                                    <label htmlFor={`price-${index}`}>Price (ETH):</label>
                                    <input
                                        type="number"
                                        id={`price-${index}`}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        value={prices[index] || ''}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={handleSubmit}>Submit Selected NFTs</button>
        </div>
    );
};

export default NFTCollection;
