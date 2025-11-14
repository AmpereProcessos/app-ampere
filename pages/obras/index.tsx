import React, { useEffect, useState } from "react";

import { useSession } from "@/components/providers/SessionProvider";
import LoadingPage from "../../components/utils/LoadingPage";

import ExecutionPage from "@/components/identificador/obras/ExecutionPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";

export default function Obras() {
	const { session, status } = useSession();
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	return <ExecutionPage session={session} />;
}
