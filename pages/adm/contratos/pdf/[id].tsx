import ContractPDFPage from "@/components/identificador/solicitacoesContrato/ContractPDFPage";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { useRouter } from "next/router";
import React from "react";

function ContractPage() {
	const { session, status } = useSession();
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	const { query } = useRouter();
	const { id } = query;
	if (!id) return <ErrorComponent msg={"ID inválido ou não fornecido."} />;
	return <ContractPDFPage id={id as string} />;
}

export default ContractPage;
