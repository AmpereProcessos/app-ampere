import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TContractRequest } from "@/utils/schemas/contract-requests";
import { TOpportunity } from "@/utils/schemas/crm-project";
import { THomologation } from "@/utils/schemas/partial/homologation";
import { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectoToRequestsData from "@/utils/services/mongodb/requests";
import { Collection, Db, ObjectId } from "mongodb";
import { NextApiHandler } from "next";

const SegmentEquivalents = {
	COMERCIAL: "COMERCIAL",
	"-": "RESIDENCIAL",
	RESIDENCIAL: "RESIDENCIAL",
	INDUSTRIAL: "INDUSTRIAL",
	RURAL: "RURAL",
};
const EnergyDistributorEquivalent = {
	MG: "CEMIG D",
	GO: "EQUATORIAL GO",
	MS: "ENERGISA MS",
	SP: "ELEKTRO",
	MT: "ENERGISA MT",
	DF: "ELEKTRO",
};

const HomologationStatusEquivalents = {
	"PARECER DE ACESSO APROVADO": "APROVADO",
	"NÃO DEFINIDO": undefined,
	"PARECER APROVADO - NOTURNO": "APROVADO NOTURNO",
	CANCELADO: "CANCELADO",
	"PARECER DE ACESSO COM OBRAS": "APROVADO COM OBRAS",
	"AGUARDANDO RESPOSTA DA CONCESSIONARIA": "AGUARDANDO RESPOSTA", // // adição de registro de atualizacao com texto de "AGUARDANDO RESPOSTA DA CONCESSIONÁRIA"
	"PENDÊNCIAS - DÉBITOS": "AGUARDANDO PENDÊNCIAS", // adição de registro de atualizacao com texto de "AGUARDANDO PAGAMENTO DE DÉBITOS"
	"PARECER DE ACESSO SUSPENSO": "SUSPENSO",
	"AGUARDANDO CORREÇÃO DE EQUIPAMENTO": "AGUARDANDO PENDÊNCIAS", // adição de registro de atualizacao com texto de "AGUARDANDO CORREÇÃO DOS EQUIPAMENTOS"
	PENDENCIAS: "AGUARDANDO PENDÊNCIAS",
	"AGUARDANDO TROCA DE TITULARIDADE": "AGUARDANDO PENDÊNCIAS", // adição de registro de atualizacao com texto de "AGUARDANDO TROCA DE TITULARIDADE"
	"AGUARDANDO ASSINATURA": "AGUARDANDO ASSINATURA",
};
function getUpdates({
	status,
	vistory,
	access,
	solicitationDate,
}: {
	status: string;
	vistory: TProject["vistoria"];
	access: TProject["parecer"];
	solicitationDate: string | undefined | null;
}) {
	var updates: THomologation["atualizacoes"] = [];
	if (status == "AGUARDANDO RESPOSTA DA CONCESSIONARIA") {
		updates.push({
			descricao: "AGUARDANDO RESPOSTA DA CONCESSIONÁRIA",
			data: solicitationDate || new Date().toISOString(),
			autor: { id: "", nome: "PROJETISTA", avatar_url: null },
		});
	}
	if (status == "PENDÊNCIAS - DÉBITOS") {
		updates.push({
			descricao: "AGUARDANDO PENDÊNCIA DE DÉBITOS",
			data: solicitationDate || new Date().toISOString(),
			autor: { id: "", nome: "PROJETISTA", avatar_url: null },
		});
	}
	if (status == "AGUARDANDO CORREÇÃO DE EQUIPAMENTO") {
		updates.push({
			descricao: "AGUARDANDO CORREÇÃO DE EQUIPAMENTOS",
			data: solicitationDate || new Date().toISOString(),
			autor: { id: "", nome: "PROJETISTA", avatar_url: null },
		});
	}
	if (status == "AGUARDANDO TROCA DE TITULARIDADE") {
		updates.push({
			descricao: "AGUARDANDO TROCA DE TITULARIDADE",
			data: solicitationDate || new Date().toISOString(),
			autor: { id: "", nome: "PROJETISTA", avatar_url: null },
		});
	}
	if (vistory.vistoriaReprovada == "SIM") {
		const reason = vistory.motivoReprova || "";
		const qty = vistory.qtdeReprovas || 0;
		updates.push({
			descricao: `VISTORIA FOI REPROVADA ${qty} VEZES POR MOTIVOS DE: ${reason}.`,
			data: vistory.dataPedido || new Date().toISOString(),
			autor: { id: "", nome: "PROJETISTA", avatar_url: null },
		});
	}
	if (access.parecerReprovado == "SIM") {
		const reason = access.motivoReprova || "";
		const qty = access.qtdeReprovas || 0;
		updates.push({
			descricao: `PARECER FOI REPROPOVA ${qty} VEZES POR MOTIVOS DE: ${reason}.`,
			data: solicitationDate || new Date().toISOString(),
			autor: { id: "", nome: "PROJETISTA", avatar_url: null },
		});
	}
	if (!!access.qtdeDiasObraDeRede && access.qtdeDiasObraDeRede > 0) {
		const qty = access.qtdeDiasObraDeRede || 0;
		updates.push({
			descricao: `FORAM REQUISITADOS ${qty} DIAS DE OBRA DE REDE.`,
			data: vistory.dataPedido || new Date().toISOString(),
			autor: { id: "", nome: "PROJETISTA", avatar_url: null },
		});
	}

	return updates;
}

const handleHomologationsMigration: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const crmDb: Db = await connectToCRMDatabase(process.env.DB_KEY);
	const requestsDb: Db = await connectoToRequestsData(process.env.DB_KEY);
	const projectsCollection: Collection<TProject> = db.collection("dados");
	const requestsCollection: Collection<TContractRequest> = requestsDb.collection("contrato");
	const opportunitiesCollection: Collection<TOpportunity> = crmDb.collection("opportunities");

	const projects = await projectsCollection.find({}).toArray();
	const requests = await requestsCollection.find({}).toArray();
	const opportunities = await opportunitiesCollection.find({}, { projection: { _id: 1, nome: 1 } }).toArray();
	const bulkwriteArr = projects.map((project) => {
		const equivalentRequest = requests.find((r) => r._id.toString() == project.idSolicitacaoContrato);
		const equivalentOpportunity = opportunities.find((o) => o._id.toString() == project.idProjetoCRM);
		const homologationEffectivationDate =
			project.projeto.projetoConcluido == "SIM"
				? project.medidor.data || project.vistoria.dataPedido || project.obra.saida || project.parecer.dataParecerDeAcesso || null
				: null;
		const homologation: THomologation = {
			homologar: !!project.projeto.realizarHomologacao,
			status:
				(HomologationStatusEquivalents[
					project.parecer.statusDoParecerDeAcesso as keyof typeof HomologationStatusEquivalents
				] as THomologation["status"]) || "PENDENTE",
			potencia: project.sistema.potPico || 0,
			distribuidora: EnergyDistributorEquivalent[project.uf as keyof typeof EnergyDistributorEquivalent] || "CEMIG D",
			pendencias: {
				desenhos: project.projeto?.desenhoTelhado == "OK" ? project.projeto.dataLiberacaoDocumentacao || new Date().toISOString() : null,
				diagramas: project.projeto?.diagramaUnifilar == "Ok" ? project.projeto.dataLiberacaoDocumentacao || new Date().toISOString() : null,
				formularios: project.projeto.dataLiberacaoDocumentacao || new Date().toISOString(),
				mapasDeMicro:
					project.projeto?.mapaDeMicro == "OK" || project.projeto?.mapaDeMicro == "-"
						? project.projeto.dataLiberacaoDocumentacao || new Date().toISOString()
						: null,
				distribuicoes: null,
			},
			oportunidade: {
				id: project.idProjetoCRM || "",
				nome: equivalentOpportunity?.nome || "",
			},
			titular: {
				nome: project.dadosCemig.titularProjeto || "",
				contato: project.telefone || "",
				identificador: "",
			},
			equipamentos: [],
			localizacao: {
				uf: project.uf,
				cidade: project.cidade,
			},
			instalacao: {
				grupo: (SegmentEquivalents[project.segmento as keyof typeof SegmentEquivalents] as THomologation["instalacao"]["grupo"]) || "RESIDENCIAL",
				numeroCliente: "",
				numeroInstalacao: project.dadosCemig.numeroInstalacao?.toString() || "",
				dependentes: equivalentRequest
					? equivalentRequest?.distribuicoes?.map((d) => ({ numeroInstalacao: d.numInstalacao, recebimentoPercentual: d.excedente || 0 }))
					: project.dadosCemig.distCreditos == "SIM"
						? [{ numeroInstalacao: "DEFINIR", recebimentoPercentual: 0 }]
						: [],
			},
			documentacao: {
				formaAssinatura: project.projeto.formaAssDocumentacao == "DIGITAL" ? "DIGITAL" : "FÍSICA",
				dataInicioElaboracao: project.contrato.dataAssinatura,
				dataConclusaoElaboracao: project.projeto.dataLiberacaoDocumentacao,
				dataLiberacao: project.projeto.dataLiberacaoDocumentacao,
				dataAssinatura: project.projeto.dataAssDocumentacao,
			},
			acesso: {
				codigo: "",
				dataSolicitacao: project.projeto.dataSolicitacaoAcesso,
				dataResposta: project.parecer.dataParecerDeAcesso,
			},
			atualizacoes: getUpdates({
				status: project.parecer.statusDoParecerDeAcesso || "",
				vistory: project.vistoria,
				access: project.parecer,
				solicitationDate: project.projeto.dataSolicitacaoAcesso,
			}),
			vistoria: {
				dataSolicitacao: project.vistoria.dataPedido,
				dataEfetivacao: project.medidor.data,
			},
			dataEfetivacao: homologationEffectivationDate,
			dataLiberacao: project.projeto.iniciar == "SIM" ? project.contrato.dataAssinatura : null,
		};
		return {
			updateOne: {
				filter: { _id: new ObjectId(project._id) },
				update: {
					$set: {
						homologacao: homologation,
						"padrao.aumentoCarga.aplicavel": project.projeto.aumentoDeCarga == "SIM", // CORRIGINDO CAMPOS DE AUMENTO DE CARGA
						"padrao.aumentoCarga.dataEfetivacao":
							project.projeto.aumentoDeCarga == "SIM"
								? project.projeto.fechamentoAC || (project.projeto.acStatus == "REALIZADO" ? project.parecer.dataParecerDeAcesso || project.obra.saida : null)
								: null, // CORRIGINDO CAMPOS DE AUMENTO DE CARGA
					},
				},
			},
		};
	});

	const bulkwriteUpdate = await projectsCollection.bulkWrite(bulkwriteArr);
	return res.status(200).json(bulkwriteUpdate);
};

export default apiHandler({ GET: handleHomologationsMigration });
