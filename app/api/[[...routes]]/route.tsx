/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
// import { collectionRef } from '@/app/models/firebase'
// import { collectionRef } from '@/app/models/firebase'

// import { neynar } from 'frog/hubs'

import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { doc, getDoc } from 'firebase/firestore'
import { collectionRef, db, getCollectionForFrame } from '@/app/models/firebase'

const app = new Frog({
  basePath: '/api',
})



app.frame("/:id", async (c) => {
  // console.log('-----check context', c);

  const { id } = c.req.param();

  console.log('---=======-- here is id-=-=-=-=-', id);
  if (id) {
    let col = await getCollectionForFrame(id);

    console.log('-=-=- it is id-=-=', col);
    // const docRef = doc(db, 'Collection', id);
    // console.log('---doc ref---', docRef);


  }


  return c.res({
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
          {/* {bet.bet} */}
          PFPs of Animes by xyz, get your self one!
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
            Price : $ 5
          </h2>{" "}
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
            Collection size: 10
          </h2>
        </div>{" "}

      </div>
    ),
    intents: [
      // eslint-disable-next-line react/jsx-key
      <Button value='explore' action='/next'>Explore PFPs</Button>,
      // <Button.Transaction
      //   target={`/bet/yes/${id}`}
      //   action={`/success/yes/${id}`}
      // >
      //   Bet Yes $5
      // </Button.Transaction>,
      // // eslint-disable-next-line react/jsx-key
      // <Button.Transaction target={`/bet/no/${id}`} action={`/success/no/${id}`}>
      //   Bet No $5
      // </Button.Transaction>,
    ],
  });
});





devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
