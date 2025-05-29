import { TContractRequest } from "@/utils/schemas/contract-requests";
import axios from "axios";
import { formatWithoutDiacritics } from "../formatting";

export async function editContractRequest({ id, changes }: { id: string; changes: Partial<TContractRequest> }) {
	try {
		const { data } = await axios.put(`/api/solicitacoes/contrato?id=${id}`, { ...changes });
		return "Formulário atualizado com sucesso !";
	} catch (error) {
		throw error;
	}
}

export async function generateContract({ requestId, contractName }: { requestId: string; contractName: string }) {
	try {
		const response = await fetch(`/api/integracao/contrato?contractRequestId=${requestId}`, {
			method: "GET",
		});
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `CONTRATO ${formatWithoutDiacritics(contractName)}.pdf`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);

		return "Contrato gerado com sucesso !";
	} catch (error) {
		console.log(error);
		throw error;
	}
}
