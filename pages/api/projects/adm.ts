import { NextApiHandler } from "next";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { Collection, Db } from "mongodb";
import { TProject, TProjectDTO } from "@/utils/schemas/projects";
import { TRevenue } from "@/utils/schemas/revenues";

export type TProjectADMSimplifiedWithRevenue = TProjectDTO & {
	receita?: { total: TRevenue["total"]; metodo: TRevenue["metodo"]; fracionamento: TRevenue["fracionamento"] };
};
const getADMProjectsRoute: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const db: Db = await connectToDatabase(process.env.DB_KEY, "projetos");
	const collection: Collection<TProject> = db.collection("dados");

	const match = {
		"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
		$and: [
			{
				$or: [
					{
						tipoDeServico: {
							$nin: ["OPERAÇÃO E MANUTENÇÃO", "MONTAGEM E DESMONTAGEM"],
						},
						"obra.statusDaObra": "CONCLUÍDA",
					},
					{
						tipoDeServico: {
							$in: ["OPERAÇÃO E MANUTENÇÃO", "MONTAGEM E DESMONTAGEM", "SEGURO DE SISTEMA FOTOVOLTAICO"],
						},
						"contrato.status": "ASSINADO",
					},
				],
			},
			{
				$or: [{ "pagamento.cobrancaFeita": { $ne: true } }, { "faturamento.concluido": { $ne: true } }],
			},
		],
	};
	const addFields = { idAsString: { $toString: "$_id" } };
	const lookup = { from: "receitas", localField: "idAsString", foreignField: "projeto.id", as: "receitas" };
	const projection = {
		_id: 1,
		qtde: 1,
		nomeDoContrato: 1,
		tipoDeServico: 1,
		"vendedor.nome": 1,
		"pagamento.forma": 1,
		"pagamento.status": 1,
		"pagamento.cobrancaFeita": 1,
		"faturamento.concluido": 1,
		"faturamento.empresaFaturamento": 1,
		"contrato.status": 1,
		"contrato.dataAssinatura": 1,
		"compra.statusLiberacao": 1,
		"obra.equipeResp": 1,
		"obra.saida": 1,
		"medidor.data": 1,
		"vistoria.status": 1,
		"receitas.total": 1,
		"receitas.metodo": 1,
		"receitas.fracionamento": 1,
	};
	const sort = { qtde: -1 };
	const projects = await collection.aggregate([{ $match: match }, { $addFields: addFields }, { $lookup: lookup }, { $project: projection }, { $sort: sort }]).toArray();

	const formattedProjects = projects.map((project) => ({ ...project, receita: project.receitas[0] })) as TProjectADMSimplifiedWithRevenue[];

	return res.status(200).json(formattedProjects);
};

export default apiHandler({
	GET: getADMProjectsRoute,
});
// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('dados')
//     let adm = await collection
//       .aggregate([
//         {
//           $match: {
//             'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
//             $or: [
//               {
//                 tipoDeServico: {
//                   $nin: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM'],
//                 },
//                 'obra.statusDaObra': 'CONCLUÍDA',
//               },
//               {
//                 tipoDeServico: {
//                   $in: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM', 'SEGURO DE SISTEMA FOTOVOLTAICO'],
//                 },
//                 'contrato.status': 'ASSINADO',
//               },
//             ],
//             $or: [{ 'pagamento.cobrancaFeita': { $ne: true } }, { 'faturamento.concluido': { $ne: true } }],
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             qtde: 1,
//             nomeDoContrato: 1,
//             tipoDeServico: 1,
//             'vendedor.nome': 1,
//             'pagamento.forma': 1,
//             'pagamento.status': 1,
//             'pagamento.cobrancaFeita': 1,
//             'faturamento.concluido': 1,
//             'faturamento.empresaFaturamento': 1,
//             'contrato.status': 1,
//             'contrato.dataAssinatura': 1,
//             'compra.statusLiberacao': 1,
//             'obra.equipeResp': 1,
//             'obra.saida': 1,
//             'medidor.data': 1,
//             'vistoria.status': 1,
//           },
//         },
//         {
//           $sort: {
//             qtde: -1,
//           },
//         },
//       ])
//       .toArray()
//     res.json(adm)
//   }
// }
