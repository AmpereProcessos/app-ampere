"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";

import FacebookPixel from "./facebook/pixel-1";
import { useRouter } from "next/router";
import AnalyticsScripts from "./analytics";

function AppHead() {
	const router = useRouter();
	return (
		<Head>
			<title>{router.pathname.includes("publico") ? "Ampère Energias" : "Sistema Ampère Energias"}</title>
		</Head>
	);
}
export default AppHead;
