import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import type { NextApiHandler } from "next";
import connectToDatabase from "../../../utils/services/mongodb/projects";

export const CommercialProjectProjection = {
	_id: 1,
	qtde: 1,
	nomeDoContrato: 1,
	codigoSVB: 1,
	contrato: 1,
	vendedor: 1,
	pagamento: 1,
	tipoDeServico: 1,
	etiquetas: 1,
	"sistema.valorProjeto": 1,
	"padrao.valor": 1,
	"estruturaPersonalizada.valor": 1,
	"sistema.potPico": 1,
	"compra.liberacao": 1,
	"compra.dataLiberacao": 1,
	"compra.status": 1,
	"compra.dataPagamento": 1,
	"homologacao.status": 1,
	"homologacao.acesso.dataResposta": 1,
	"oem.valor": 1,
	"seguro.valor": 1,
	idProjetoCRM: 1,
	idVisitaTecnica: 1,
	insider: 1,
};

export type TCommercialProjectDTO = Pick<
	TProjectDTO,
	| "_id"
	| "qtde"
	| "nomeDoContrato"
	| "codigoSVB"
	| "contrato"
	| "vendedor"
	| "pagamento"
	| "tipoDeServico"
	| "etiquetas"
	| "idProjetoCRM"
	| "idVisitaTecnica"
	| "insider"
> & {
	sistema: {
		valorProjeto: TProjectDTO["sistema"]["valorProjeto"];
		potPico: TProjectDTO["sistema"]["potPico"];
	};
	padrao: {
		valor: TProjectDTO["padrao"]["valor"];
	};
	estruturaPersonalizada: {
		valor: TProjectDTO["estruturaPersonalizada"]["valor"];
	};
	compra: {
		liberacao: TProjectDTO["compra"]["liberacao"];
		dataLiberacao: TProjectDTO["compra"]["dataLiberacao"];
		status: TProjectDTO["compra"]["status"];
		dataPagamento: TProjectDTO["compra"]["dataPagamento"];
	};
	homologacao: {
		status: TProjectDTO["homologacao"]["status"];
		acesso: {
			dataResposta: TProjectDTO["homologacao"]["acesso"]["dataResposta"];
		};
	};
	oem: {
		valor: TProjectDTO["oem"]["valor"];
	};
	seguro: {
		valor: TProjectDTO["seguro"]["valor"];
	};
};

async function getComercialProjects({ session }: { session: TAuthSession }) {
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const commercialProjects = await projectsCollection
		.find(
			{
				"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
				dataValidacaoComercial: null,
			},
			{
				projection: CommercialProjectProjection,
				sort: {
					qtde: 1,
				},
			},
		)
		.toArray();

	return commercialProjects.map((project) => ({ ...project, _id: project._id.toString() })) as TCommercialProjectDTO[];
}

type TGetComercialProjectsOutput = Awaited<ReturnType<typeof getComercialProjects>>;

const getComercialProjectsHandler: NextApiHandler<TGetComercialProjectsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const commercialProjects = await getComercialProjects({ session });
	return res.status(200).json(commercialProjects);
};

export default apiHandler({ GET: getComercialProjectsHandler });
