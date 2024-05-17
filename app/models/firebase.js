// 'use server'
import Error from "next/error";
import { baseSepolia } from 'viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { abi } from "./abi.js"
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, getDoc, query, where, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";


const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
})

const firebaseConfig = {
    apiKey: "AIzaSyCrcYaHTPHpSg0eg4p0q4Syt8Teysj7bro",
    authDomain: "pfps-frame-dynamic.firebaseapp.com",
    projectId: "pfps-frame-dynamic",
    storageBucket: "pfps-frame-dynamic.appspot.com",
    messagingSenderId: "230922425330",
    appId: "1:230922425330:web:93b8472af4ed518971d16b"
};



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const collectionRef = collection(db, "Collection");


async function storeDataInFirebase(metadata) {
    if (metadata) {
        let readSupply = await publicClient.readContract({
            abi: abi,
            address: metadata.address,
            functionName: 'totalSupply'
        });
        let uris = [];
        for (let i = 0; i < readSupply; i++) {
            let uri = await returnURI(i, metadata.address);
            let getUri = await fetch(uri).then(response => response.json())
                .then(data => {
                    uris.push(data);
                })
        }

        try {
            if (uris) {
                const newCol = await addDoc(collectionRef, {});
                metadata.id = newCol.id;
                metadata.uris = uris;

                const storedDocRef = doc(collectionRef, newCol.id);
                await setDoc(storedDocRef, metadata);

                const storedDoc = await getDoc(storedDocRef);

                if (storedDoc.exists()) {
                    return storedDoc._document.data.value.mapValue.fields;
                } else {
                    return new Error('some thing went wrong!')
                }
            }
        } catch (error) {
            console.log('logginggggg error', error);
        }
    }
}

export async function getCollectionForFrame(id) {
    console.log('function clledd....');
    try {
        console.log('id it self', id);
        const storedDocRef = doc(collectionRef, id);
        const storedDoc = await getDoc(storedDocRef);
        console.log('success fully get col-=-=-=-=-', storedDoc);
        return storedDoc;
    } catch (error) {
        console.log('thos os ot error', error);
    }
}
// getCollectionForFrame();

const returnURI = async (id, address) => {
    let uri = await publicClient.readContract({
        abi: abi,
        address: address,
        functionName: 'tokenURI',
        args: [id]
    })
    return uri;
}


export default storeDataInFirebase;