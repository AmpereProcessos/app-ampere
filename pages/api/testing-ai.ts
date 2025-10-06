import { contractVariables } from "@/lib/contract-generation/variables";
import { formatAsSlug, formatDateAsLocale } from "@/utils/methods/formatting";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const crmDb = await connectToCRMDatabase();
	const fileReferencesCollection = crmDb.collection<TFileReference>("file-references");
	const projectsDb = await connectToDatabase();
	const projectsCollection = projectsDb.collection<TProject>("dados");

	const projects = await projectsCollection.find({}).toArray();

	const projectsFromInadeuquateFastTracks = projects
		.filter(
			(p) =>
				!p.homologacao.fastTrack &&
				p.obra.observacoes &&
				(p.obra.observacoes.includes("1ª MONTAGEM") || p.obra.observacoes.includes("1ªMONTAGEM") || p.obra.observacoes.includes("PARCIAL")),
		)
		.map((p) => ({
			ID: p._id,
			QTDE: p.qtde,
			NOME: p.nomeDoContrato,
			CIDADE: p.cidade,
			UF: p.uf,
			"DATA DE SOLICITAÇÃO DO PARECER": formatDateAsLocale(p.homologacao.acesso.dataSolicitacao),
			"DATA DE RESPOSTA DO PARECER": formatDateAsLocale(p.homologacao.acesso.dataResposta),
			OBSERVAÇÕES: p.obra.observacoes,
		}));

	console.log("PROJECTS FROM INADEUQUATE FAST TRACKS", projectsFromInadeuquateFastTracks.length);
	return res.json(projectsFromInadeuquateFastTracks);

	const serviceOrdersCollection = projectsDb.collection<TServiceOrder>("ordensDeServico");

	const serviceOrders = await serviceOrdersCollection.find({ categoria: "MONTAGEM" }).toArray();

	const serviceOrdersFromInadeuquateFastTracks = serviceOrders
		.map((s) => ({
			ID: s._id,
			DESCRICAO: s.descricao,
			"NOME DO PROJETO": s.projeto.nome,
			"ID DO PROJETO": s.projeto.id,
			"INDEX DO PROJETO": s.projeto.identificador,
			OBSERVAÇÕES: s.observacoes.map((o) => `${o.topico}: ${o.descricao}`.toUpperCase()).join("\n"),
		}))
		.filter((s) => s.OBSERVAÇÕES.includes("1ª MONTAGEM") || s.OBSERVAÇÕES.includes("1ªMONTAGEM") || s.OBSERVAÇÕES.includes("PARCIAL"));

	console.log("SERVICE ORDERS FROM INADEUQUATE FAST TRACKS", serviceOrdersFromInadeuquateFastTracks.length);
	return res.json(serviceOrdersFromInadeuquateFastTracks);
	// const projects = await projectsCollection.find({}).toArray();
	// const projectIdsAsStrings = projects.map((p) => p._id.toString());
	// const fileReferences = await fileReferencesCollection.find({ idProjeto: { $in: projectIdsAsStrings } }).toArray();
	// const possibleInadequateFastTracks = projects
	// 	.filter((p) => {
	// 		if (p.homologacao.fastTrack) return false;
	// 		if (p.homologacao.potencia && p.sistema.potPico > p.homologacao.potencia) return true;
	// 		return false;
	// 	})
	// 	.map((p) => {
	// 		const projectFileReference = fileReferences.filter((f) => f.idProjeto === p._id.toString() && f.categorias?.includes("PROJETOS"));
	// 		const accessResponseFileReference = fileReferences.find((f) => f.idProjeto === p._id.toString() && f.titulo?.includes("PARECER"));
	// 		return {
	// 			"ID DO PROJETO": p._id,
	// 			QTDE: p.qtde,
	// 			"NOME DO CONTRATO": p.nomeDoContrato,
	// 			"POTÊNCIA DE HOMOLOGAÇÃO": p.homologacao.potencia,
	// 			"POTÊNCIA DO SISTEMA": p.sistema.potPico,
	// 			"FLAG DE FAST TRACK": p.homologacao.fastTrack,
	// 			"DATA DE SOLICITAÇÃO DO PARECER": formatDateAsLocale(p.homologacao.acesso.dataSolicitacao),
	// 			"DATA DE RESPOSTA DO PARECER": formatDateAsLocale(p.homologacao.acesso.dataResposta),
	// 			"URL ARQUIVO PARECER": accessResponseFileReference?.url ?? "N/A",
	// 		};
	// 	});

	// console.log("PROJETOS FAST TRACK INADEQUADOS", possibleInadequateFastTracks.length);
	// return res.json(possibleInadequateFastTracks);
}
