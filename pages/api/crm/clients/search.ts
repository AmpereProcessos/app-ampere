import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatPhoneAsBase, formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import type { Filter } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

const GetClientsSearchInputSchema = z.object({
	page: z.string({ invalid_type_error: "Tipo não válido para páginação." }).transform((val) => Number(val)),
	search: z.string({ invalid_type_error: "Tipo não válido para filtro de pesquisa." }).optional().nullable(),
	onlyValidPhones: z
		.string({ invalid_type_error: "Tipo não válido para filtro de telefones válidos." })
		.optional()
		.nullable()
		.transform((val) => val === "true"),
});

export type TGetClientsSearchInput = z.infer<typeof GetClientsSearchInputSchema>;

async function getClientsSearch({ input }: { input: TGetClientsSearchInput; session: TAuthSession }) {
	const PAGE_SIZE = 50;
	const { page, search, onlyValidPhones } = input;

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>("clients");

	const searchQuery: Filter<TClient> =
		search && search.trim().length > 0
			? {
					$or: [
						{ nome: { $regex: search, $options: "i" } },
						{ nome: search },
						{ cpfCnpj: { $regex: formatToCPForCNPJ(search), $options: "i" } },
						{ cpfCnpj: formatToCPForCNPJ(search) },
						{ email: { $regex: search, $options: "i" } },
						{ email: search },
						{ telefonePrimarioBase: { $regex: formatPhoneAsBase(search), $options: "i" } },
						{ telefonePrimarioBase: formatPhoneAsBase(search) },
					],
				}
			: {};

	const onlyValidPhonesQuery: Filter<TClient> = onlyValidPhones ? { telefonePrimario: { $nin: ["", null, undefined] } } : {};

	const query: Filter<TClient> = { ...searchQuery, ...onlyValidPhonesQuery };

	console.log("QUERY", JSON.stringify(query, null, 2));
	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;
	const projection: Partial<Record<keyof TClient, 1>> = {
		nome: 1,
		telefonePrimario: 1,
		email: 1,
		cpfCnpj: 1,
		cep: 1,
		uf: 1,
		cidade: 1,
		bairro: 1,
		endereco: 1,
		numeroOuIdentificador: 1,
		complemento: 1,
		autor: 1,
		dataInsercao: 1,
	};
	const clientsMatched = await clientsCollection.countDocuments({ ...query });
	const clients = await clientsCollection
		.find(query, {
			projection: projection,
		})
		.skip(skip)
		.limit(limit)
		.toArray();
	const totalPages = Math.ceil(clientsMatched / PAGE_SIZE);

	return {
		data: {
			clients: clients.map((client) => ({
				_id: client._id.toString(),
				nome: client.nome,
				telefonePrimario: client.telefonePrimario,
				email: client.email,
				cpfCnpj: client.cpfCnpj,
				cep: client.cep,
				uf: client.uf,
				cidade: client.cidade,
				bairro: client.bairro,
				endereco: client.endereco,
				numeroOuIdentificador: client.numeroOuIdentificador,
				complemento: client.complemento,
				autor: client.autor,
				dataInsercao: client.dataInsercao,
			})),
			clientsMatched,
			totalPages,
		},
	};
}
export type TGetClientsSearchOutput = Awaited<ReturnType<typeof getClientsSearch>>;
const getClientsSearchHandler: NextApiHandler<TGetClientsSearchOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = GetClientsSearchInputSchema.parse(req.query);
	const data = await getClientsSearch({ input, session });
	return res.status(200).json(data);
};
export default apiHandler({ GET: getClientsSearchHandler });
