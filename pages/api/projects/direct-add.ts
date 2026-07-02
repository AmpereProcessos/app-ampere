import { getContractValue } from "@/utils/methods/util/projects";
import type { TProject, TProjectComissionedUser } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TCRMUser } from "@/utils/schemas/crm/users.schema";
import createHttpError from "http-errors";
import type { Collection } from "mongodb";
import type { NextApiHandler } from "next";

export type TDirectAddProjectOutput = {
  data: {
    insertedId: string;
    qtde: number;
  };
  message: string;
};

function validateDirectProject(project: TProject) {
  if (!project.nomeDoContrato?.trim())
    throw new createHttpError.BadRequest("Informe o nome do contrato.");
  if (!project.tipoDeServico?.trim())
    throw new createHttpError.BadRequest("Informe o tipo de serviço.");
  if (!project.vendedor?.nome?.trim() || project.vendedor.nome === "NAO DEFINIDO")
    throw new createHttpError.BadRequest("Informe o vendedor.");
  if (!project.cidade?.trim()) throw new createHttpError.BadRequest("Informe a cidade do projeto.");
  if (!project.uf?.trim()) throw new createHttpError.BadRequest("Informe a UF do projeto.");
  if (!project.telefone?.trim() && !String(project.cpf_cnpj || "").trim())
    throw new createHttpError.BadRequest("Informe telefone ou CPF/CNPJ do cliente.");
}

function buildDirectComissions(project: TProject): NonNullable<TProject["comissoes"]> {
  const saleValue = getContractValue({
    projectValue: project.sistema.valorProjeto,
    structureValue: project.estruturaPersonalizada.valor || 0,
    paValue: project.padrao?.valor || 0,
    oemValue: project.oem?.valor || 0,
    insuranceValue: project.seguro?.valor || 0,
  });

  const comissioned: TProjectComissionedUser[] = project.vendedor?.nome
    ? [
        {
          nome: project.vendedor.nome,
          papel: "VENDEDOR",
          porcentagem: 0,
          valor: 0,
          avatar_url: project.vendedor.avatar,
          dataEfetivacao: null,
          idCrm: project.vendedor.idCRM,
          dataPagamento: null,
          dataValidacao: null,
        },
      ]
    : [];

  return {
    comissionados: comissioned,
    valorComissionavel: saleValue,
    itensComissionaveis: [
      "SISTEMA",
      "PADRÃO",
      "ESTRUTURA PERSONALIZADA",
      "OEM",
      "SEGURO",
    ] as NonNullable<TProject["comissoes"]>["itensComissionaveis"],
  };
}

const createDirectProjectRoute: NextApiHandler<TDirectAddProjectOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);
  if (!session.user.permissoes.comercial.editar)
    throw new createHttpError.Forbidden("Você não tem permissão para criar projetos diretamente.");

  const project: TProject = req.body;
  validateDirectProject(project);

  const [appDb, crmDb] = await Promise.all([connectToDatabase(), connectToCRMDatabase()]);
  const projectsCollection: Collection<TProject> = appDb.collection("dados");
  const crmUsersCollection: Collection<TCRMUser> = crmDb.collection("users");

  const latestInserted = await projectsCollection
    .aggregate<{ qtde?: number }>([
      { $sort: { qtde: -1 } },
      { $limit: 1 },
      { $project: { qtde: 1 } },
    ])
    .toArray();

  const newIndexer = Number(latestInserted[0]?.qtde || 0) + 1;
  const sellerInCrm = await crmUsersCollection.findOne({ nome: project.vendedor.nome });
  const seller: TProject["vendedor"] = sellerInCrm
    ? {
        nome: sellerInCrm.nome,
        idCRM: sellerInCrm._id.toString(),
        avatar: sellerInCrm.avatar_url,
        codigo: project.vendedor.codigo,
      }
    : project.vendedor;

  const insertResponse = await projectsCollection.insertOne({
    ...project,
    qtde: newIndexer,
    nomeDoContrato: project.nomeDoContrato.toUpperCase(),
    nomeDoProjeto: project.nomeDoProjeto?.toUpperCase() || project.nomeDoContrato.toUpperCase(),
    vendedor: seller,
    comissoes: buildDirectComissions({ ...project, vendedor: seller }),
    alocacoes: project.alocacoes || [],
    idProjetoCRM: project.idProjetoCRM || null,
    idSolicitacaoContrato: project.idSolicitacaoContrato || null,
  });

  if (!insertResponse.acknowledged)
    throw new createHttpError.InternalServerError(
      "Oops, houve um erro desconhecido na criação do projeto.",
    );

  return res.status(201).json({
    data: {
      insertedId: insertResponse.insertedId.toString(),
      qtde: newIndexer,
    },
    message: "Projeto criado com sucesso!",
  });
};

export default apiHandler({ POST: createDirectProjectRoute });
