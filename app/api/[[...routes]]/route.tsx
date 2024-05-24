
/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
import { MarketplaceAbi } from '@/app/models/abi'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';

const app = new Frog({
  basePath: '/api',
})

const firebaseConfig = {
  apiKey: "AIzaSyCrcYaHTPHpSg0eg4p0q4Syt8Teysj7bro",
  authDomain: "pfps-frame-dynamic.firebaseapp.com",
  projectId: "pfps-frame-dynamic",
  storageBucket: "pfps-frame-dynamic.appspot.com",
  messagingSenderId: "230922425330",
  appId: "1:230922425330:web:93b8472af4ed518971d16b"
};



const fireapp = initializeApp(firebaseConfig);
const firedb = getFirestore(fireapp);
const firecollectionRef = collection(firedb, "Collection");
let collectionUri: any;



app.frame("/:id", async (c) => {

  const { id } = c.req.param();
  console.log('---=======-- here is id-=-=-=-=-', id);

  const storedDocRef = doc(firecollectionRef, id);
  const storedDoc = await getDoc(storedDocRef);
  collectionUri = storedDoc.data();
  console.log('success fully get col-=-=-=-=-', collectionUri);


  return c.res({
    action: '/:id/explore',
    image: (
      <div
        style={{
          alignItems: "center",

          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100vh",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          background: "#8d67e7db",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "4rem",
            fontWeight: "bold",
            padding: "20px 40px",
            background: "#9369f3",
            borderRadius: "40px",
            marginBottom: "20px",
          }}
        >
          {/* PFPs of Animes by xyz, get your self one!sdc */}
          {collectionUri?.title}
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "2rem",
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              background: "#9369f3",
              padding: "10px 20px",
              borderRadius: "20px",
              lineHeight: 1.4,
              marginBottom: "30px",
              textShadow: "1px 1px 2px #000000",
              fontWeight: "900",
            }}
          >
            Collection size: {collectionUri?.uris?.length}
          </h2>
        </div>{" "}

      </div>
    ),
    intents: [
      <Button value="explore" action={`/${id}/explore`} >Explore PFPs</Button>,
    ],
  });
});




app.frame('/:id/explore', async (c) => {
  const { id } = c.req.param();

  let currentIndex = 0;

  console.log('check uri-=-=-=-', collectionUri?.uris?.length);


  if (c.buttonValue && c.buttonValue.startsWith('nextPFP')) {
    const parts = c.buttonValue.split('_');

    if (parts.length > 1) {
      currentIndex = parseInt(parts[1], 10) + 1;
      console.log('current image should be-=-=-=-=-', collectionUri?.uris[currentIndex]);

    }
  }

  // const col = await getCollection('gaming');

  if (currentIndex >= collectionUri?.uris?.length) {
    currentIndex = 0;
    console.log('current image should be-=-=-=-=-', collectionUri?.uris[currentIndex]);

  }

  const { status } = c;

  return c.res({
    // image: "https://maroon-annoyed-dinosaur-120.mypinata.cloud/ipfs/QmRuwByPWCtVtjEBjpx1BJAtWAEqaTZE4ExpjsvFgbb3r5",
    image: collectionUri.uris[currentIndex].image,
    intents: [
      <Button value={`nextPFP_${currentIndex}`} action={`/${id}/explore`}>Next PFP</Button>,
      <Button.Transaction target={`/mint/${collectionUri?.uris[currentIndex].tokenId}/${collectionUri?.uris[currentIndex].price}`}>Mint PFP</Button.Transaction>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})


app.transaction(
  '/mint/:tokenId/:price',
  (c) => {
    const { tokenId, price } = c.req.param();

    return c.contract({
      abi: MarketplaceAbi,
      chainId: 'eip155:84532',
      functionName: "buyPFP",
      to: '0x2191B2055B305f2b3081d0233b4125614afD14Be',
      args: [collectionUri?.address, tokenId],
      value: parseEther(price)
    })
  }
)


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
