// 'use server'
import Error from "next/error";
import { baseSepolia } from 'viem/chains'
import { createPublicClient, createWalletClient, http } from 'viem'
import { abi } from "./abi.js"
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, getDoc, query, where, doc, updateDoc } from "firebase/firestore";

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
    try {
        const newCol = await addDoc(collectionRef, {});
        metadata.id = newCol.id;

        const storedDocRef = doc(collectionRef, newCol.id);
        await setDoc(storedDocRef, metadata);

        const storedDoc = await getDoc(storedDocRef);

        if (storedDoc.exists()) {
            return storedDoc.data();
        } else {
            return new Error('some thing went wrong!')
        }
    } catch (error) {
        console.log('logginggggg error', error);
    }
}

export default storeDataInFirebase;