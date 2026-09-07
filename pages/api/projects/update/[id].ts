import { ObjectId } from "mongodb";
import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { runProjectUpdateAutomations } from "@/lib/projects/update-automations";

const handleProjectUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await validateAuthenticationWithSession(req, res);
  const db = await connectToDatabase();
  const projectsCollection = db.collection<TProject>("dados");
  const serviceOrdersCollection = db.collection<TServiceOrder>("ordensDeServico");
  const logCollection = db.collection("logAlteracoes");
  delete req.body._id;

  const { id } = req.query;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id))
    throw new createHttpError.BadRequest("ID do projeto inválido");
  const updateKeys = Object.keys(req.body);

  if (updateKeys.length === 0)
    throw new createHttpError.BadRequest("Nenhuma alteração foi realizada");

  const previousProjectData = await projectsCollection.findOne({ _id: new ObjectId(id) });
  if (!previousProjectData) throw new createHttpError.NotFound("Projeto não encontrado");

  // Now, handling the project update
  const updateProjectResponse = await projectsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...req.body } },
  );
  if (!updateProjectResponse.acknowledged)
    // Checking for possible update errors
    throw new createHttpError.InternalServerError(
      "Oops, houve um erro desconhecido ao atualizar projeto",
    );
  if (updateProjectResponse.matchedCount === 0)
    throw new createHttpError.NotFound("Projeto não encontrado");
  // Inserting the log for the changes in the log collections
  const logObject = {
    autor: {
      id: session?.user?.id,
      nome: session?.user.nome,
      avatar_url: session?.user.avatar_url,
    },
    idProjetoAlterado: req.query.id,
    alteracoes: req.body,
    dataAlteracao: new Date().toISOString(),
    dataAlteracaoFormatada: new Date().toLocaleString("pt-br"),
  };
  await logCollection.insertOne(logObject);

  const updatedProjectData = await projectsCollection.findOne({ _id: new ObjectId(id) });
  if (!updatedProjectData) throw new createHttpError.NotFound("Projeto não encontrado");

  await runProjectUpdateAutomations({
    previous: previousProjectData,
    project: updatedProjectData,
    updateKeys,
    projectsCollection,
    serviceOrdersCollection,
    author: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  });

  return res.json({
    data: {
      updatedId: id,
    },
    message: "Projeto atualizado com sucesso !",
  });
};
const handleProjectUpdatePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();
  const collection = db.collection<TProject>("dados");
  const id = req.query.id;
  if (!id || typeof id !== "string" || !ObjectId.isValid(id))
    throw new createHttpError.BadRequest("ID do projeto inválido");
  const operation = req.body.operation;
  console.log(operation);
  const newObj = await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    { ...operation },
  );
  return res.json(newObj);
};
export default apiHandler({
  POST: handleProjectUpdate,
  PUT: handleProjectUpdatePut,
});
