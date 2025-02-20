import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TRevenue } from "@/utils/schemas/revenues";
import axios from "axios";

export const CONTA_AZUL_PRODUCTS_AND_SERVICES = [
	{
		id: "75c53cc4-6149-4815-9b83-ccfbee581a42",
		label: "MÃO DE OBRA E EQUIPAMENTO",
		serviceTypeEquivalent: "SISTEMA FOTOVOLTAICO",
	},
	{
		id: "e4ee8aed-d4de-48ce-950f-3ecb9a518f71",
		label: "AUMENTO",
		serviceTypeEquivalent: "AUMENTO DE SISTEMA FOTOVOLTAICO",
	},
	{
		id: "1e53d9aa-e737-4010-8536-833796fc69b4",
		label: "MONITORAMENTO",
		serviceTypeEquivalent: "OPERAÇÃO E MANUTENÇÃO",
	},
	{
		id: "1e53d9aa-e737-4010-8536-833796fc69b4",
		label: "MONITORAMENTO",
		serviceTypeEquivalent: "MONITORAMENTO",
	},
];

function getContaAzulProductsAndServicesFromRevenueType(revenueType: string) {
	const equivalent = CONTA_AZUL_PRODUCTS_AND_SERVICES.find((p) => p.serviceTypeEquivalent === revenueType);
	return equivalent || CONTA_AZUL_PRODUCTS_AND_SERVICES[0];
}

type CreateSaleFromRevenueParams = {
	revenue: TRevenue;
	client: TClient;
	accessToken: string;
};
export async function createSaleFromRevenue({ revenue, client, accessToken }: CreateSaleFromRevenueParams) {
	try {
		const url = "https://api.contaazul.com/v1/sales";
		const newClientUrl = "https://api.contaazul.com/v1/customers";

		const headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		};

		let contaAzulCustomerId = client.idContaAzulCliente;
		if (!contaAzulCustomerId) {
			const contaAzulCustomer = {
				name: revenue.projeto.nome || client.nome,
				email: client.email,
				mobile_phone: client.telefonePrimario,
				person_type: client.cpfCnpj ? (client.cpfCnpj.length > 14 ? "LEGAL" : "NATURAL") : "NATURAL",
				document: client.cpfCnpj ? client.cpfCnpj.replaceAll(".", "").replaceAll("-", "") : undefined,
				address: {
					zip_code: client.cep || undefined,
					street: client.endereco || undefined,
					number: client.numeroOuIdentificador && client.numeroOuIdentificador.length < 10 ? client.numeroOuIdentificador.substring(0, 10) : undefined,
					neighborhood: client.bairro || undefined,
				},
			};
			const { data: clientResponse } = await axios.post(newClientUrl, contaAzulCustomer, { headers });
			console.log("CONTA AZUL CREATE CLIENT RESPONSE", clientResponse);

			contaAzulCustomerId = clientResponse.id as string;
		}
		const contaAzulProductsAndServices = getContaAzulProductsAndServicesFromRevenueType(revenue.tipo);
		const contaAzulSale = {
			emission: revenue.efetivacao.data || new Date().toISOString(),
			status: "PENDING",
			customer_id: contaAzulCustomerId,
			payment: {
				type: "TIMES",
				installments: revenue.fracionamento.map((revenueFraction, revenueFractionIndex) => ({
					number: revenueFractionIndex + 1,
					value: revenueFraction.valor || revenueFraction.porcentagem * revenue.total,
					due_date: revenueFraction.dataRecebimento || revenueFraction.dataPrevisaoRecebimento,
					status: "PENDING",
					note: revenueFraction.titulo,
					hasBillet: false,
				})),
			},
			services: contaAzulProductsAndServices
				? [
						{
							service_id: contaAzulProductsAndServices.id,
							description: contaAzulProductsAndServices.label,
							quantity: 1,
							value: Number(revenue.total.toFixed(2)),
						},
					]
				: undefined,
			notes: revenue.projeto.id ? `Venda do Projeto ${revenue.projeto.nome}, do tipo ${revenue.tipo}.` : "",
		};
		console.log("CONTA AZUL SALE TO CREATE", contaAzulSale);
		const { data } = await axios.post(url, contaAzulSale, { headers });
		console.log("CONTA AZUL CREATE SALE RESPONSE", data);
		const contaAzulSaleId = data.id as string;
		if (!contaAzulSaleId) throw new Error("Ocorreu um erro ao criar a venda no Conta Azul.");
		return { contaAzulSaleId, contaAzulCustomerId };
	} catch (error) {
		console.log("ERROR", error);
		throw error;
	}
}

type UpdateSaleInstallmentParams = {
	saleId: string;
	saleInstallmentIndex: number;
	saleInstallmentPaymentDate?: string;
	accessToken: string;
};
export async function updateSaleInstallment({ saleId, saleInstallmentIndex, saleInstallmentPaymentDate, accessToken }: UpdateSaleInstallmentParams) {
	try {
		const url = `https://api.contaazul.com/v1/sales/${saleId}/installments/${saleInstallmentIndex}`;
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		};

		const { data } = await axios.put(url, { status: saleInstallmentPaymentDate ? "ACQUITTED" : "PENDING", due_date: saleInstallmentPaymentDate }, { headers });
		console.log("CONTA AZUL UPDATE INSTALLMENT RESPONSE", data);
		return { data: "Recebimento atualizado." };
	} catch (error) {
		throw error;
	}
}
