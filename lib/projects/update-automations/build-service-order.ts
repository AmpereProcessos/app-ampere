import type { TServiceOrder } from "@/utils/schemas/service-order";
import {
  getServiceObservationsFromObras,
  getServiceOrderInverterMetadataFromProject,
  getServiceOrderModulesMetadataFromProject,
  getServiceOrderTagsFromProject,
} from "@/utils/methods/util/service-order";
import type { ProjectUpdateAutomationContext } from "./types";

export function buildProjectServiceOrder({
  project,
  author,
}: Pick<ProjectUpdateAutomationContext, "project" | "author">): TServiceOrder {
  return {
    categoria: "MONTAGEM",
    etiquetas: getServiceOrderTagsFromProject(project),
    favorecido: {
      nome: project.nomeDoContrato || "",
      contato: project.telefone || "",
    },
    idAnaliseTecnica: project.idVisitaTecnica,
    anotacoes: "",
    projeto: {
      id: project._id.toString() || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
      nome: project.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
      identificador: project.qtde || null, // identificador QTDE do projeto no banco de projetos
      tipo: project.tipoDeServico || null, // tipo do projeto
      vendedorNome: project.vendedor?.nome || null,
      contratoDataAssinatura: project.contrato?.dataAssinatura,
      compraEntregaDataPrevisao: project.compra?.previsaoEntrega,
      compraEntregaDataEfetivacao: project.compra?.dataEntrega,
      homologacaoAcessoDataResposta: project.homologacao?.acesso.dataResposta,
      homologacaoVistoriaDataEfetivacao: project.homologacao?.vistoria.dataEfetivacao,
    },
    descricao: `SERVIÇO DO PROJETO ${project.nomeDoContrato}`, // servico executado
    localizacao: {
      cep: project.cep?.toString() || "",
      uf: project.uf,
      cidade: project.cidade,
      bairro: project.bairro,
      endereco: project.logradouro,
      numeroOuIdentificador: project.numeroResidencia?.toString() || "",
    },
    responsavel: {
      nome: project.obra?.equipeResp || "",
      tipo: project.obra?.equipeResp ? "INTERNO" : "EXTERNO",
    },
    responsaveis: [],
    // configurar: false,
    urgencia: "POUCO URGENTE",
    periodo: {
      inicio: null,
      fim: null,
    },
    pagamento: {
      recebedor: null,
      valor: null,
    },
    cobranca: {
      pagador: null,
      valor: null,
    },
    autor: author,
    equipamentos: {
      modulos: getServiceOrderModulesMetadataFromProject(project),
      inversor: getServiceOrderInverterMetadataFromProject(project),
      disponivel: null,
      retirada: null,
    },
    detalhes: {
      pontoAgua: "",
      senhaWifi: "",
      configuracaoMonitoramento: false,
      possuiTrafo: false,
      tipoEstrutura: project.estruturaPersonalizada?.tipo || null,
      tipoTelha: project.visitaTecnica?.tipoDaTelha || null,
      tipoPadrao: project.padrao?.tipo || null,
      tipoSaidaPadrao: project.visitaTecnica?.saidaDoCliente || null,
      amperagemPadrao: project.visitaTecnica?.amperagem || null,
      responsabilidadePadrao: project.padrao?.respInstalacao,
      topologia: project.sistema?.topologia,
    },
    observacoes: getServiceObservationsFromObras(project.obra?.observacoes || ""),
    dataPrevisaoLiberacao: project.compra.previsaoEntrega,
    dataLiberacao: project.compra.dataEntrega || new Date().toISOString(),
    dataInsercao: new Date().toISOString(),
  };
}
