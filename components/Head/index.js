import React, { useEffect, useState } from "react";
import Head from "next/head";

import FacebookPixel from "./facebook/pixel-1";
import { useRouter } from "next/router";

function AppHead({ name }) {
  const router = useRouter();
  return (
    <Head>
      <title>
        {router.pathname.includes("publico")
          ? "Ampère Energias"
          : "Sistema Ampère Energias"}
      </title>
      <FacebookPixel />
    </Head>
  );
}
export default AppHead;
