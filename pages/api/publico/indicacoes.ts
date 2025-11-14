import { apiHandler } from "@/utils/api";
import { TCRMClient } from "@/utils/schemas/crm/clients.schema";
import { TCRMProject } from "@/utils/schemas/crm/projects.schema";
import { TCRMUser } from "@/utils/schemas/crm/users.schema";
import { TNotification } from "@/utils/schemas/notifications";
import { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { Collection, Db, ObjectId, WithId } from "mongodb";
import { NextApiHandler } from "next";
import { z } from "zod";

export type TIndicationProject = Pick<TCRMProject, "nome" | "funis" | "solicitacaoContrato" | "contrato"> & { _id: string };

type GetResponse = {
	data: TIndicationProject[];
};

const getIndications: NextApiHandler<GetResponse> = async (req, res) => {
	const { projectId } = req.query;

	if (!projectId || typeof projectId != "string" || !ObjectId.isValid(projectId))
		throw new createHttpError.BadRequest("ID do projeto não encontrado.");
	const crmDb = await connectToCRMDatabase(process.env.CRM_KEY);
	const crmProjectsCollection: Collection<TCRMProject> = crmDb.collection("projects");

	const findResponse = await crmProjectsCollection.find({ idIndicacao: projectId }).toArray();
	const indications: TIndicationProject[] = findResponse.map((f) => {
		return {
			_id: f._id.toString(),
			nome: f.nome,
			funis: f.funis,
			solicitacaoContrato: f.solicitacaoContrato,
			contrato: f.contrato,
		};
	});
	return res.status(200).json({ data: indications });
};

const IndicationSchema = z.object({
	nome: z.string({ required_error: "Nome do indicado não informado.", invalid_type_error: "Tipo não válido para o nome do indicado." }),
	telefone: z.string({ required_error: "Telefone do indicado não informado.", invalid_type_error: "Tipo não válido para o telefone do indicado." }),
	idIndicacao: z.string({
		required_error: "ID de referência do indicador não informado.",
		invalid_type_error: "Tipo não válido para o ID de referência do indicador.",
	}),
});
export type TIndicationBody = z.infer<typeof IndicationSchema>;
type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};
const createProjectFromIndication: NextApiHandler<PostResponse> = async (req, res) => {
	const indication = IndicationSchema.parse(req.body);
	console.log(indication);
	const db: Db = await connectToDatabase(process.env.DB_KEY, "projetos");
	const projectsCollection: Collection<TProject> = db.collection("dados");
	const indicator = await projectsCollection.findOne(
		{ _id: new ObjectId(indication.idIndicacao) },
		{ projection: { nomeDoContrato: 1, vendedor: 1 } },
	);

	const crmDb = await connectToCRMDatabase(process.env.CRM_KEY);
	const crmProjectsCollection: Collection<TCRMProject> = crmDb.collection("projects");
	const usersCollection: Collection<TCRMUser> = crmDb.collection("users");
	const clientsCollection: Collection<TCRMClient> = crmDb.collection("clients");

	const receivers = await usersCollection.find({ "permissoes.projetos.serRecebedor": true }).toArray();
	const newReceiver = await getNewReceiver({ collection: crmProjectsCollection, receivers });
	const insider = { id: newReceiver.id, nome: newReceiver.nome, avatar_url: newReceiver.avatar_url };

	const insertClientObject: TCRMClient = {
		nome: indication.nome,
		representante: insider,
		idOportunidade: null,
		idIndicacao: indication.idIndicacao,
		cpfCnpj: "",
		telefonePrimario: indication.telefone,
		telefoneSecundario: "",
		indicador: indicator?.nomeDoContrato,
		email: "",
		cep: "",
		bairro: "",
		endereco: "",
		numeroOuIdentificador: "",
		complemento: "",
		uf: "",
		cidade: "",
		dataInsercao: new Date().toISOString(),
	};
	const insertedClientResponse = await clientsCollection.insertOne(insertClientObject);
	const insertedClientId = insertedClientResponse.insertedId.toString();
	const identifier = await getNewProjectIdentifier({ collection: crmProjectsCollection });

	const insertProjectObj: TCRMProject = {
		nome: insertClientObject.nome,
		identificador: identifier,
		tipoProjeto: "SISTEMA FOTOVOLTAICO",
		idIndicacao: indication.idIndicacao,
		responsavel: insider,
		representante: insider,
		clienteId: insertedClientId,
		descricao: `Cliente obtido por indicação do(a) ${indicator?.nomeDoContrato}. O vendedor do projeto do indicador foi: ${indicator?.vendedor.nome}.`,
		localizacao: {
			cep: "",
			uf: insertClientObject.uf || "",
			cidade: insertClientObject.cidade || "",
			bairro: "",
			endereco: "",
			numeroOuIdentificador: "",
			complemento: "",
		},
		funis: [
			{
				id: 2,
				etapaId: 1,
			},
		],
		idOportunidade: null,

		dataInsercao: new Date().toISOString(),
	};
	const insertedProjectResponse = await crmProjectsCollection.insertOne(insertProjectObj);
	const insertedProjectId = insertedProjectResponse.insertedId.toString();

	console.log("PROJETO", insertedProjectId);
	return res.status(201).json({ data: { insertedId: insertedProjectId }, message: "Indicação criada com sucesso !" });
};

export default apiHandler({ GET: getIndications, POST: createProjectFromIndication });

type GetNewReceiverParams = {
	collection: Collection<TCRMProject>;
	receivers: WithId<TCRMUser>[];
};
async function getNewReceiver({ collection, receivers }: GetNewReceiverParams) {
	try {
		const lastClientFromLeadAsArr = await collection
			.find({ idOportunidade: { $ne: null } })
			.sort({ dataInsercao: -1 })
			.limit(1)
			.toArray();
		const lastClientFromLead = lastClientFromLeadAsArr[0];
		const lastOpportunityReceiverId = lastClientFromLead?.representante?.id;
		console.log("LAST RECEIVER", lastClientFromLead.nome, lastClientFromLead._id, lastClientFromLead.representante);
		const lastReceiverIndex = receivers.findIndex((r) => r._id.toString() == lastOpportunityReceiverId) || 0;
		const newReceiverIndex = lastReceiverIndex + 1 == receivers.length ? 0 : lastReceiverIndex + 1;
		const newReceiver = receivers[newReceiverIndex];
		console.log("NEW RECEIVER", newReceiver);
		return { id: newReceiver._id.toString(), nome: newReceiver.nome, avatar_url: newReceiver.avatar_url };
	} catch (error) {
		throw error;
	}
}
type GetNewProjectIdentifierParams = {
	collection: Collection<TCRMProject>;
};
async function getNewProjectIdentifier({ collection }: GetNewProjectIdentifierParams) {
	try {
		const lastInsertedIdentificator = await collection
			.aggregate([
				{
					$project: {
						identificador: 1,
					},
				},
				{
					$sort: {
						_id: -1,
					},
				},
				{
					$limit: 1,
				},
			])
			.toArray();
		const lastIdentifierNumber = lastInsertedIdentificator[0] ? Number(lastInsertedIdentificator[0].identificador.split("-")[1]) : 0;
		const newIdentifierNumber = lastIdentifierNumber + 1;
		const identifier = `CRM-${newIdentifierNumber}`;
		return identifier;
	} catch (error) {
		throw error;
	}
}
