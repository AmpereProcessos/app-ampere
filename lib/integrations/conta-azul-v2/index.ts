import type { TIntegration } from "@/utils/schemas/integrations";
import { ContractRequestPaymentOptions } from "@/utils/select-options";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import dayjs from "dayjs";
import { refreshContaAzulV2AccessToken } from "../conta-azul/tokens";
import {
	CreateContaAzulSaleV2OutputSchema,
	GetContaAzulNextSaleNumberV2OutputSchema,
	GetContaAzulSaleV2ByIdOutputSchema,
	type TCreateContaAzulSaleV2Input,
	type TGetContaAzulNextSaleNumberV2Output,
	type TGetContaAzulSaleV2ByIdInput,
	type TGetContaAzulSaleV2ByIdOutput,
} from "./types";

const CONTA_AZUL_V2_BASE_URL = "https://api-v2.contaazul.com/";

async function getContaAzulV2Token() {
	const db = await connectToDatabase();
	const integrationsCollection = db.collection<TIntegration>("integracoes");

	const integrationRecord = await integrationsCollection.findOne({ identificador: "CONTA_AZUL_V2" });

	if (!integrationRecord || integrationRecord.dados.tipo !== "CONTA_AZUL_V2") throw new Error("Integração Conta Azul V2 não encontrada.");

	const isExpired = dayjs().isAfter(dayjs(integrationRecord.dados.dataExpiracao));
	if (isExpired) {
		const newTokens = await refreshContaAzulV2AccessToken(integrationRecord.dados.tokenRefresh);
		await integrationsCollection.updateOne(
			{ identificador: "CONTA_AZUL_V2" },
			{
				$set: {
					dados: {
						...integrationRecord.dados,
						tokenAcesso: newTokens.access_token,
						tokenRefresh: newTokens.refresh_token,
						dataExpiracao: dayjs().add(newTokens.expires_in, "seconds").toISOString(),
					},
				},
			},
		);

		return newTokens.access_token;
	}

	return integrationRecord.dados.tokenAcesso;
}
async function getContaAzulNextSaleNumberV2(): Promise<number> {
	const accessToken = await getContaAzulV2Token();

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/venda/proximo-numero`;
	const { data } = await axios.get<TGetContaAzulNextSaleNumberV2Output>(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = GetContaAzulNextSaleNumberV2OutputSchema.parse(data);
	return parsedData.numero;
}
type CreateContaAzulSaleV2Params = {
	client: {
		contaAzulId: string;
		name: string;
		phone: string;
		email?: string;
		cpfCnpj: string;
	};
	sale: {
		valueTotal: number;
		valueGeneral: number;
		valueEnergyPA: number;
		valuePersonalizedStructure: number;
		valueInsurance: number;
		valueOeM: number;
		paymentMethod: string;
		date: string;
	};
};
async function createContaAzulSaleV2({ client, sale }: CreateContaAzulSaleV2Params) {
	const accessToken = await getContaAzulV2Token();
	const nextSaleNumber = await getContaAzulNextSaleNumberV2();

	const items: TCreateContaAzulSaleV2Input["itens"] = [];
	if (sale.valueGeneral > 0) {
		items.push({
			id: "75c53cc4-6149-4815-9b83-ccfbee581a42",
			quantidade: 1,
			valor: sale.valueGeneral,
			descricao: "VALOR PELO PROJETO (GERAL)",
		});
	}
	if (sale.valueEnergyPA > 0) {
		items.push({
			id: "88561cc0-9e97-4b9b-b45a-8038bcec906e",
			quantidade: 1,
			valor: sale.valueEnergyPA,
			descricao: "VALOR PELO PADRÃO DE ENERGIA",
		});
	}
	if (sale.valuePersonalizedStructure > 0) {
		items.push({
			id: "88561cc0-9e97-4b9b-b45a-8038bcec906e",
			quantidade: 1,
			valor: sale.valuePersonalizedStructure,
			descricao: "VALOR PELA ESTRUTURA PERSONALIZADA",
		});
	}
	if (sale.valueInsurance > 0) {
		items.push({
			id: "411a2168-851f-4a00-8ea9-a3ff8cf0779a",
			quantidade: 1,
			valor: sale.valueInsurance,
			descricao: "VALOR PELO SEGURO",
		});
	}
	if (sale.valueOeM > 0) {
		items.push({
			id: "163fbd0f-d537-4af3-9d9f-c7bf63debcbd",
			quantidade: 1,
			valor: sale.valueOeM,
			descricao: "VALOR PELO O&M",
		});
	}
	const paymentMethodConfig = ContractRequestPaymentOptions.find((s) => s.value === sale.paymentMethod);
	const newContaAzulSale: TCreateContaAzulSaleV2Input = {
		id_cliente: client.contaAzulId,
		numero: nextSaleNumber,
		situacao: "APROVADO",
		data_venda: dayjs(sale.date).format("YYYY-MM-DD"),
		itens: items,
		composicao_de_valor: {
			frete: 0,
			desconto: {
				tipo: "VALOR",
				valor: 0,
			},
		},
		condicao_pagamento: {
			tipo_pagamento: "DINHEIRO",
			opcao_condicao_pagamento: "À vista",
			parcelas: paymentMethodConfig
				? paymentMethodConfig.fractionnements?.map((p, index) => ({
						valor: (p.percentage * sale.valueTotal) / 100,
						data_vencimento: dayjs(sale.date)
							.add((index + 1) * 30, "day")
							.format("YYYY-MM-DD"),
					})) || []
				: [],
		},
		observacoes: `
        DADOS DO CLIENTE:
        Nome: ${client.name}
        CPF/CNPJ: ${client.cpfCnpj}
        Telefone: ${client.phone}
        Email: ${client.email}
        `,
		observacoes_pagamento: `
        MÉTODO DE PAGAMENTO: ${sale.paymentMethod}
        `,
	};

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/venda`;
	const response = await axios.post(url, newContaAzulSale, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = CreateContaAzulSaleV2OutputSchema.parse(response.data);
	return parsedData;
}

async function getContaAzulSaleV2ById({ id }: TGetContaAzulSaleV2ByIdInput): Promise<TGetContaAzulSaleV2ByIdOutput> {
	const accessToken = await getContaAzulV2Token();

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/venda/${id}`;
	const { data } = await axios.get<TGetContaAzulSaleV2ByIdOutput>(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = GetContaAzulSaleV2ByIdOutputSchema.parse(data);
	return parsedData;
}
