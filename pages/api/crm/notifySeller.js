import createHttpError from "http-errors";
import connectToDatabase from "../../../utils/crmDb";
import { errorHandler } from "../../../utils/methods/handlers";
import { calculateStringSimilarity } from "../../../utils/constants";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { sellerName, idCRMProject } = req.query;
      const { message } = req.body;
      if (!sellerName || typeof sellerName != "string")
        throw new createHttpError.BadRequest("Nome do vendedor não informado.");
      if (!idCRMProject || typeof idCRMProject != "string")
        throw new createHttpError.BadRequest("Nome do vendedor não informado.");
      if (!message || typeof message != "string" || message.trim().length < 5)
        throw new createHttpError.BadRequest("Mensagem inválida. ");

      const crmDb = await connectToDatabase(process.env.CRM_KEY);
      const usersCollection = crmDb.collection("users");
      const projectsCollection = crmDb.collection("projects");
      const notificationsCollection = crmDb.collection("notifications");
      // Finding the equivalent user in the CRM users DB
      // and extracting its name, email and avatar_url for the notification create
      const allUsersInCRM = await usersCollection
        .aggregate([
          {
            $project: {
              nome: 1,
              email: 1,
              avatar_url: 1,
            },
          },
        ])
        .toArray();

      const sellerInfo = allUsersInCRM.find((user) => {
        const similarityPercentage = calculateStringSimilarity(
          sellerName.toUpperCase(),
          user.nome.toUpperCase()
        );
        console.log(sellerName, user.nome, similarityPercentage);
        if (similarityPercentage > 80) return true;
      });
      if (!sellerInfo)
        throw new createHttpError.NotFound("Vendedor não encontrado.");

      console.log(idCRMProject);
      const crmProjectInfo = await projectsCollection
        .aggregate([
          { $match: { _id: new ObjectId(idCRMProject) } },

          { $project: { nome: 1, identificador: 1, email: 1 } },
        ])
        .toArray();

      if (!crmProjectInfo[0])
        throw new createHttpError.NotFound("Projeto no CRM não encontrado.");

      const notificationObj = {
        remetente: "SISTEMA",
        destinatario: {
          id: new ObjectId(sellerInfo._id).toString(),
          nome: sellerInfo.nome,
          email: sellerInfo.email,
        },
        projetoReferencia: {
          id: crmProjectInfo[0]._id.toString(),
          nome: crmProjectInfo[0].nome,
          identificador: crmProjectInfo[0].identificador,
        },
        mensagem: message,
        dataInsercao: new Date().toISOString(),
      };
      const insertNotificationResponse =
        await notificationsCollection.insertOne(notificationObj);
      if (insertNotificationResponse.insertedId)
        res.status(200).json({ data: "Notificação criado com sucesso!" });
      else
        throw new createHttpError.InternalServerError(
          "Houve um erro na criação da notificação."
        );
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
