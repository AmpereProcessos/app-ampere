import React, { useEffect } from "react";
import Head from "next/head";

import FACEBOOK_PIXEL_1 from "./facebook/pixel-1";

function Pixel({ name }) {
  useEffect(() => {
    console.log("HEY");
  }, []);
  console.log(name == "FACEBOOK_PIXEL_1");
  return (
    <Head>
      <meta
        name="facebook-domain-verification"
        content="0hufc7839y66urgaxa8ahifp1xpos2"
      />
      {name === "FACEBOOK_PIXEL_1" && <FACEBOOK_PIXEL_1 />}
    </Head>
  );
}
export default Pixel;
