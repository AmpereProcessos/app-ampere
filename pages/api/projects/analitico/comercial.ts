import connectToDatabase from "../../../../utils/services/mongodb/projects";
import connectToCRMDatabase from "../../../../utils/services/mongodb/crm/main";
import type { NextApiHandler } from "next";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { Collection, Db, WithId } from "mongodb";
import { z } from "zod";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import type { TProposal } from "@/utils/schemas/crm/proposal.schema";
import { getContractValue } from "@/utils/methods/util/projects";

export type TComercialAnalyticalItem = {
	id: TProjectDTO["_id"];
	nome: TProjectDTO["nomeDoContrato"];
	idProjetoCRM: TProjectDTO["idProjetoCRM"];
	idSolicitacaoContrato: TProjectDTO["idSolicitacaoContrato"];
	vendedor: TProjectDTO["vendedor"]["nome"];
	tipoServico: TProjectDTO["tipoDeServico"];
	identificador: TProjectDTO["qtde"];
	identificadorCRM: TProjectDTO["codigoSVB"];
	cidade: TProjectDTO["cidade"];
	cpfCnpj: TProjectDTO["cpf_cnpj"];
	bairro: TProjectDTO["bairro"];
	logradouro: TProjectDTO["logradouro"];
	numeroOuIdentificador: TProjectDTO["numeroResidencia"];
	potenciaPico: TProjectDTO["sistema"]["potPico"];
	dataAssinatura: TProjectDTO["contrato"]["dataAssinatura"];
	dataSolicitacao: TProjectDTO["contrato"]["dataSolicitacao"];
	valorProjeto: TProjectDTO["sistema"]["valorProjeto"];
	valorPadrao: TProjectDTO["padrao"]["valor"];
	valorEstrutura: TProjectDTO["estruturaPersonalizada"]["valor"];
	valorContrato: number;
	proposta: {
		id: string | null;
		nome: string | null;
		valor: number | null;
		potenciaPico: number | null | undefined;
		url: string | null | undefined;
	};
	links: TProjectDTO["links"];
};

const QuerySchema = z.object({
	after: z.string({ required_error: "Parâmetro de data não informado.", invalid_type_error: "Tipo não válido para parâmetro de data." }),
	before: z.string({ required_error: "Parâmetro de data não informado.", invalid_type_error: "Tipo não válido para parâmetro de data." }),
	field: z.string({ required_error: "Campo de filtro não informado.", invalid_type_error: "Tipo não válido para o campo de filtro." }),
});
type GetResponse = {
	data: TComercialAnalyticalItem[];
};

const getComercialAnalyticalData: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const appDb: Db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();

	const appProjectsCollection: Collection<TProject> = appDb.collection("dados");
	const crmOpportunitiesCollection: Collection<TOpportunity> = crmDb.collection("opportunities");

	const { after, before, field } = QuerySchema.parse(req.query);

	const appProjects = await getProjects({ collection: appProjectsCollection, after, before, field });
	const crmOpportunities = await getOpportunities({ collection: crmOpportunitiesCollection, after, before });

	const analytical = appProjects.map((project) => {
		const equivalentOpportunity = crmOpportunities.find((o) => o.id === project.idProjetoCRM);
		return {
			id: project._id.toString(),
			nome: project.nomeDoContrato,
			idProjetoCRM: project.idProjetoCRM,
			idSolicitacaoContrato: project.idSolicitacaoContrato,
			vendedor: project.vendedor.nome,
			tipoServico: project.tipoDeServico,
			identificador: project.qtde,
			identificadorCRM: project.codigoSVB,
			cidade: project.cidade,
			cpfCnpj: project.cpf_cnpj,
			bairro: project.bairro,
			logradouro: project.logradouro,
			numeroOuIdentificador: project.numeroResidencia,
			potenciaPico: project.sistema?.potPico,
			dataAssinatura: project.contrato.dataAssinatura,
			dataSolicitacao: project.contrato.dataSolicitacao,
			valorProjeto: project.sistema?.valorProjeto,
			valorPadrao: project.padrao?.valor,
			valorEstrutura: project.estruturaPersonalizada?.valor,
			valorContrato: getContractValue({
				projectValue: project.sistema?.valorProjeto ?? 0,
				paValue: project.padrao?.valor ?? 0,
				structureValue: project.estruturaPersonalizada?.valor ?? 0,
				oemValue: project.oem?.valor ?? 0,
				insuranceValue: project.seguro?.valor ?? 0,
			}),
			proposta: {
				id: equivalentOpportunity?.id || null,
				nome: equivalentOpportunity?.nomeProposta || null,
				valor: equivalentOpportunity?.valorProposta || null,
				potenciaPico: equivalentOpportunity?.potenciaProposta || null,
				url: equivalentOpportunity?.urlArquivoProposta || null,
			},
			links: project.links,
		};
	});

	return res.status(200).json({ data: analytical });
};

export default apiHandler({ GET: getComercialAnalyticalData });

type GetProjectsProps = {
	collection: Collection<TProject>;
	after: string;
	before: string;
	field: string;
};
async function getProjects({ collection, after, before, field }: GetProjectsProps) {
	try {
		const projects = await collection
			.aggregate([
				{
					$match: {
						"contrato.status": "ASSINADO",
						$and: [{ [field]: { $gte: after } }, { [field]: { $lte: before } }],
					},
				},
				{
					$sort: {
						qtde: 1,
					},
				},
			])
			.toArray();
		return projects as WithId<TProject>[];
	} catch (error) {
		throw error;
	}
}

type TOverallResultsProject = {
	id: string;
	idMarketing: TOpportunity["idMarketing"];
	responsaveis: TOpportunity["responsaveis"];
	ganho: TOpportunity["ganho"];
	nomeProposta: TProposal["nome"];
	valorProposta: TProposal["valor"];
	potenciaProposta: TProposal["potenciaPico"];
	urlArquivoProposta: TProposal["urlArquivo"];
	motivoPerda: TOpportunity["perda"]["descricaoMotivo"];
	dataPerda: TOpportunity["perda"]["data"];
	dataInsercao: TOpportunity["dataInsercao"];
};
type GetOpportunitiesProps = {
	collection: Collection<TOpportunity>;
	after: string;
	before: string;
};
async function getOpportunities({ collection, after, before }: GetOpportunitiesProps) {
	try {
		const match = { $and: [{ "ganho.data": { $gte: after } }, { "ganho.data": { $lte: before } }] };
		const addFields = { wonProposeObjectId: { $toObjectId: "$ganho.idProposta" } };
		const lookup = { from: "proposals", localField: "wonProposeObjectId", foreignField: "_id", as: "proposta" };

		const projection = {
			idMarketing: 1,
			responsaveis: 1,
			ganho: 1,
			"proposta.nome": 1,
			"proposta.valor": 1,
			"proposta.potenciaPico": 1,
			"proposta.urlArquivo": 1,
			perda: 1,
			dataInsercao: 1,
		};
		const result = await collection
			.aggregate([
				{
					$match: match,
				},
				{
					$addFields: addFields,
				},
				{
					$lookup: lookup,
				},
				{ $project: projection },
			])
			.toArray();

		const projects = result.map((r: any) => ({
			id: r._id.toString(),
			idMarketing: r.idMarketing,
			responsaveis: r.responsaveis,
			ganho: r.ganho,
			nomeProposta: r.proposta[0] ? r.proposta[0].nome : 0,
			valorProposta: r.proposta[0] ? r.proposta[0].valor : 0,
			potenciaProposta: r.proposta[0] ? r.proposta[0].potenciaPico : 0,
			urlArquivoProposta: r.proposta[0] ? r.proposta[0].urlArquivo : 0,
			dataPerda: r.perda.data,
			motivoPerda: r.perda.descricaoMotivo,
			dataInsercao: r.dataInsercao,
		})) as TOverallResultsProject[];
		return projects;
	} catch (error) {
		throw error;
	}
}
// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)

//     const collection = db.collection('dados')
//     const crmProjectsCollection = crmDb.collection('projects')
//     const { after, before, field } = req.query
//     const appProjects = await collection
//       .aggregate([
//         {
//           $match: {
//             $and: [{ [field]: { $gte: after } }, { [field]: { $lte: before } }],
//           },
//         },
//         {
//           $sort: {
//             qtde: 1,
//           },
//         },
//       ])
//       .toArray()
//     const crmProjects = await crmProjectsCollection
//       .aggregate([
//         {
//           $match: { $and: [{ ['contrato.dataAssinatura']: { $gte: after } }, { ['contrato.dataAssinatura']: { $lte: before } }] },
//         },
//         {
//           $addFields: {
//             propostaObjectId: { $toObjectId: '$contrato.idProposta' },
//           },
//         },
//         {
//           $lookup: {
//             from: 'proposes',
//             localField: 'propostaObjectId',
//             foreignField: '_id',
//             as: 'proposta',
//           },
//         },
//         {
//           $project: {
//             'proposta.template': 0,
//             'proposta.projeto': 0,
//             'proposta.premissas': 0,
//             'proposta.kit': 0,
//             'proposta.precificacao': 0,
//             'proposta.linkArquivo': 0,
//             'proposta.autor': 0,
//           },
//         },
//       ])
//       .toArray()

//     const responseFormatted = appProjects.map((project) => {
//       const equivalentCRMProject = crmProjects.find((p) => project.idProjetoCRM == p._id)
//       const propose = equivalentCRMProject?.proposta[0] ? equivalentCRMProject?.proposta[0] : null
//       const proposeValue = propose?.valorProposta || null
//       return {
//         id: project._id,
//         nome: project.nomeDoContrato,
//         idProjetoCRM: project.idProjetoCRM,
//         vendedor: project.vendedor.nome,
//         tipoServico: project.tipoDeServico,
//         identificador: project.qtde,
//         identificadorCRM: project.codigoSVB,
//         cidade: project.cidade,
//         cpfCnpj: project.cpf_cnpj,
//         bairro: project.bairro,
//         logradouro: project.logradouro,
//         numeroOuIdentificador: project.numeroResidencia,
//         potenciaPico: project.sistema?.potPico,
//         dataAssinatura: project.contrato.dataAssinatura,
//         dataSolicitacao: project.contrato.dataSolicitacao,
//         valorProjeto: project.sistema?.valorProjeto,
//         valorPadrao: project.padrao?.valor,
//         valorEstrutura: project.estruturaPersonalizada?.valor,
//         valorContrato: getContractValue(project.sistema?.valorProjeto, project.padrao?.valor, project.estruturaPersonalizada?.valor),
//         proposta: {
//           id: propose?._id || null,
//           nome: propose?.nome || null,
//           valor: proposeValue || null,
//           potenciaPico: propose?.potenciaPico || null,
//           url: propose?.linkArquivo || null,
//         },
//         links: project.links,
//       }
//     })
//     res.json(responseFormatted)
//   }
// }
