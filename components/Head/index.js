import React, { useEffect } from "react";
import Head from "next/head";

import FacebookPixel from "./facebook/pixel-1";

function AppHead({ name }) {
  return (
    <Head>
      <title>Sistema Ampère Energias</title>
      <FacebookPixel />
    </Head>
  );
}
export default AppHead;
