import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TMonitoringProjectDTOSimplified, TProject, TProjectDTODBSimplified } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { Collection, Db } from "mongodb";
import { NextApiHandler } from "next";

type GetResponse = {
	data: TMonitoringProjectDTOSimplified[];
};
const getMonitoringProjectsRoute: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const db: Db = await connectToDatabase(process.env.DB_KEY, "projetos");
	const collection: Collection<TProject> = db.collection("dados");

	const MonitoringProjectProjection = {
		_id: 1,
		nomeDoContrato: 1,
		tipoDeServico: 1,
		"contrato.status": 1,
		oem: 1,
		qtde: 1,
		vendedor: 1,
		telefone: 1,
		email: 1,
		codigoSVB: 1,
		uf: 1,
		cidade: 1,
		bairro: 1,
		logradouro: 1,
		numeroResidencia: 1,
		atividades: 1,
	};
	const projects = await collection
		.aggregate([
			{
				$match: {
					"contrato.status": "ASSINADO",
					tipoDeServico: "MONITORAMENTO",
					"oem.oemConcluido": { $ne: true },
				},
			},
			{
				$addFields: {
					idString: { $toString: "$_id" },
				},
			},
			{
				$lookup: {
					from: "atividades",
					localField: "idString",
					foreignField: "projeto.id",
					as: "atividades",
				},
			},
			{ $project: MonitoringProjectProjection },
		])
		.toArray();

	const projectsFormatted = projects.map((p) => ({ ...p, _id: p._id.toString() })) as TMonitoringProjectDTOSimplified[];
	return res.status(200).json({ data: projectsFormatted });
};

export default apiHandler({ GET: getMonitoringProjectsRoute });
