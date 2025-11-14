import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import type { Filter, Sort, WithId } from "mongodb";
import type { NextApiHandler } from "next";

export const EngineeringProjectProjection = {
	_id: 1,
	qtde: 1,
	nomeDoContrato: 1,
	cidade: 1,
	tipoDeServico: 1,
	etiquetas: 1,
	"vendedor.nome": 1,
	homologacao: 1,
	"obra.statusDaObra": 1,
	"compra.statusEntrega": 1,
	"compra.dataEntrega": 1,
	"compra.previsaoEntrega": 1,
	"compra.dataPagamento": 1,
	"contrato.dataAssinatura": 1,
	"sistema.potPico": 1,
	"material.disjuntores": 1,
};
export type TEngineeringProject = Pick<TProject, "qtde" | "nomeDoContrato" | "cidade" | "tipoDeServico" | "etiquetas" | "homologacao"> & {
	vendedor: {
		nome: TProjectDTO["vendedor"]["nome"];
	};
	obra: {
		statusDaObra: TProjectDTO["obra"]["statusDaObra"];
	};
	compra: {
		statusEntrega: TProjectDTO["compra"]["statusEntrega"];
		dataEntrega: TProjectDTO["compra"]["dataEntrega"];
		previsaoEntrega: TProjectDTO["compra"]["previsaoEntrega"];
		dataPagamento: TProjectDTO["compra"]["dataPagamento"];
	};
	contrato: {
		dataAssinatura: TProjectDTO["contrato"]["dataAssinatura"];
	};
	sistema: {
		potPico: TProjectDTO["sistema"]["potPico"];
	};
	material: {
		disjuntores: TProjectDTO["material"]["disjuntores"];
	};
};
export type TEngineeringProjectDTO = TEngineeringProject & { _id: string };
export type TGetEngineeringProjectsOutput = {
	data: TEngineeringProjectDTO[];
};
const getEngineeringProjectsHandler: NextApiHandler<TGetEngineeringProjectsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const isAuthorized = session.user.permissoes.engenharia.visualizar;

	if (!isAuthorized) throw new createHttpError.Unauthorized("Você não tem permissão para acessar este recurso");

	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const EngineeringMatchQuery: Filter<TProject> = {
		"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
		"homologacao.dataEfetivacao": null,
		$or: [{ "compra.statusLiberacao": "PAGO" }, { "homologacao.dataLiberacao": { $ne: null } }],
	};

	const EngineeringProjectSort: Sort = { qtde: 1 };
	const engineeringProjects = (await projectsCollection
		.find(EngineeringMatchQuery)
		.project(EngineeringProjectProjection)
		.sort(EngineeringProjectSort)
		.toArray()) as WithId<TEngineeringProject>[];

	res.status(200).json({ data: engineeringProjects.map((project) => ({ ...project, _id: project._id.toString() })) });
};

export default apiHandler({
	GET: getEngineeringProjectsHandler,
});
