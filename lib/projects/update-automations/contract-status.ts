import { type Collection, type WithId, ObjectId } from "mongodb";
import type { TProject } from "@/utils/schemas/projects";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import resend from "@/lib/integrations/resend";
import { getContractValue } from "@/utils/methods/util/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import dayjs from "dayjs";
import type { ProjectUpdateAutomationContext } from "./types";

/** Date corrections are independent of signing notifications and coverage initialization. */
export async function syncProjectOpportunityWinDate({
  project,
  previous,
  updateKeys,
}: ProjectUpdateAutomationContext) {
  if (
    !project.idProjetoCRM ||
    project.contrato.status !== "ASSINADO" ||
    previous.contrato.status !== "ASSINADO"
  ) return;
  const signatureWasSubmitted =
    updateKeys.includes("contrato.dataAssinatura") || updateKeys.includes("contrato");
  if (!signatureWasSubmitted) return;

  const crmDb = await connectToCRMDatabase();
  const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");
  // Update the leaf only, preserving proposal, project, request and loss metadata.
  // Repeated saves also retry synchronization after a partial failure.
  const response = await opportunitiesCollection.updateOne(
    { _id: new ObjectId(project.idProjetoCRM) },
    { $set: { "ganho.data": project.contrato.dataAssinatura || null } },
  );
  if (!response.acknowledged || response.matchedCount === 0) {
    throw new Error("Não foi possível sincronizar a data de ganho da oportunidade CRM vinculada.");
  }
}

type HandleProjectSigningAutomationParams = {
  project: WithId<TProject>;
  previous: WithId<TProject>;
  projectsCollection: Collection<TProject>;
};
export async function handleProjectSigningAutomation({
  project,
  previous,
  projectsCollection,
}: HandleProjectSigningAutomationParams) {
  const notifyEmails = ["financeiro@ampereenergias.com.br", "contasareceber@ampereenergias.com.br"];

  const newContractStatus = project.contrato.status;
  const previousContractStatus = previous.contrato.status;

  const isBeingSigned =
    previousContractStatus !== newContractStatus && newContractStatus === "ASSINADO";
  if (!isBeingSigned) return;

  const resendResponse = await resend.emails.send({
    from: "Notificações Internas <notifications@ampereenergias.com.br>",
    to: notifyEmails,
    subject: "NOVO CONTRATO ASSINADO",
    text: `
	Olá, passando para avisar que o projeto ${project.nomeDoContrato} foi atualizado como ASSINADO.
	Dados do projeto:
	ID: ${project._id}
	CÓDIGO: ${project.qtde}
	TIPO DE SERVIÇO: ${project.tipoDeServico}
	NOME DO CONTRATO: ${project.nomeDoContrato}
	DATA DE ASSINATURA: ${project.contrato.dataAssinatura}
	EMAIL DO CLIENTE: ${project.email}
	CPF/CNPJ DO CLIENTE: ${project.cpf_cnpj}
	TELEFONE DO CLIENTE: ${project.telefone}
	CEP DO CLIENTE: ${project.cep}
	UF DO CLIENTE: ${project.uf}
	CIDADE DO CLIENTE: ${project.cidade}
	BAIRRO DO CLIENTE: ${project.bairro}
	LOGRADOURO DO CLIENTE: ${project.logradouro}
	NUMERO RESIDENCIAL DO CLIENTE: ${project.numeroResidencia}
	VALOR DO CONTRATO: ${getContractValue({
    projectValue: project.sistema?.valorProjeto,
    paValue: project.padrao?.valor,
    structureValue: project.estruturaPersonalizada?.valor,
    oemValue: project.oem?.valor,
    insuranceValue: project.seguro?.valor,
  })}
    FORMA DE PAGAMENTO: ${project.pagamento.forma}
	VENDEDOR: ${project.vendedor.nome}
	`,
  });
  console.log("[HANDLE PROJECT SIGNING AUTOMATION] RESEND RESPONSE", resendResponse);

  if (project.idProjetoCRM) {
    const crmDb = await connectToCRMDatabase();
    const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");

    await opportunitiesCollection.updateOne(
      { _id: new ObjectId(project.idProjetoCRM) },
      {
        $set: {
          ganho: {
            idProjeto: project._id.toString(),
            idProposta: project.idPropostaCRM,
            data: project.contrato.dataAssinatura,
            idSolicitacao: project.idSolicitacaoContrato,
            dataSolicitacao: project.contrato.dataSolicitacao,
          },
          perda: {
            data: null,
            descricaoMotivo: null,
          },
        },
      },
    );
  }
  if (project.tipoDeServico === "SEGURO DE SISTEMA FOTOVOLTAICO") {
    await projectsCollection.updateOne(
      { _id: new ObjectId(project._id) },
      {
        $set: {
          "seguro.dataInicio": project.contrato.dataAssinatura,
          "seguro.dataFim": dayjs(project.contrato.dataAssinatura).add(365, "days").toISOString(),
        },
      },
    );
  }
  if (
    project.tipoDeServico === "OPERAÇÃO E MANUTENÇÃO" ||
    project.tipoDeServico === "MONITORAMENTO"
  ) {
    await projectsCollection.updateOne(
      { _id: new ObjectId(project._id) },
      {
        $set: {
          "oem.dataInicio": project.contrato.dataAssinatura,
          "oem.dataFim": dayjs(project.contrato.dataAssinatura).add(365, "days").toISOString(),
        },
      },
    );
  }
}

type HandleProjectRescissionAutomationParams = {
  project: WithId<TProject>;
  previous: WithId<TProject>;
};
export async function handleProjectRescissionAutomation({
  project,
  previous,
}: HandleProjectRescissionAutomationParams) {
  const newContractStatus = project.contrato.status;
  const previousContractStatus = previous.contrato.status;

  const isBeingRescinded =
    previousContractStatus !== newContractStatus && newContractStatus === "RESCISÃO DE CONTRATO";
  if (!isBeingRescinded) return;

  const notifyEmails = ["financeiro@ampereenergias.com.br", "contasareceber@ampereenergias.com.br"];

  const resendResponse = await resend.emails.send({
    from: "Notificações Internas <notifications@ampereenergias.com.br>",
    to: notifyEmails,
    subject: "RESCISÃO DE CONTRATO",
    text: `
	Olá, passando para avisar que o projeto ${project.nomeDoContrato} foi atualizado como RECISÃO DE CONTRATO.
	Dados do projeto:
	ID: ${project._id}
	CÓDIGO: ${project.qtde}
	TIPO DE SERVIÇO: ${project.tipoDeServico}
	`,
  });
  console.log("[HANDLE PROJECT RESCINDING AUTOMATION] RESEND RESPONSE", resendResponse);

  if (project.idProjetoCRM) {
    const crmDb = await connectToCRMDatabase();
    const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");
    await opportunitiesCollection.updateOne(
      { _id: new ObjectId(project.idProjetoCRM) },
      {
        $set: {
          ganho: { data: null },
          perda: { data: new Date().toISOString(), descricaoMotivo: "RESCISÃO CONTRATUAL" },
        },
      },
    );
  }
}

type HandleProjectUnsigningAutomationParams = {
  project: WithId<TProject>;
  previous: WithId<TProject>;
};
export async function handleProjectUnsigningAutomation({
  project,
  previous,
}: HandleProjectUnsigningAutomationParams) {
  // No email notification on this automation
  const newContractStatus = project.contrato.status;
  const previousContractStatus = previous.contrato.status;

  const isBeingUnsigned =
    previousContractStatus !== newContractStatus &&
    previousContractStatus === "ASSINADO" &&
    newContractStatus !== "RESCISÃO DE CONTRATO";

  if (!isBeingUnsigned) return;
  if (project.idProjetoCRM) {
    const crmDb = await connectToCRMDatabase();
    const opportunitiesCollection = crmDb.collection<TOpportunity>("opportunities");
    await opportunitiesCollection.updateOne(
      { _id: new ObjectId(project.idProjetoCRM) },
      { $set: { ganho: { data: null }, perda: { data: null, descricaoMotivo: null } } },
    );
  }
}
