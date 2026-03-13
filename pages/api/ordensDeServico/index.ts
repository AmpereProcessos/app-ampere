import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatLocation } from "@/utils/methods/formatting";
import type { TCalendar } from "@/utils/schemas/calendars";
import type { TProject } from "@/utils/schemas/projects";
import {
  ServiceOrderSchema,
  ServiceOrderSimplifiedProjection,
  type TServiceOrder,
  type TServiceOrderSimplified,
  type TServiceOrderWithProjectDTO,
} from "@/utils/schemas/service-order";
import { getConfiguredGoogleOAuth2Client } from "@/utils/services/google/oauth";
import { type calendar_v3, google as googleApis } from "googleapis";
import createHttpError from "http-errors";
import { type Collection, type Db, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import connectToAuxiliariesDatabase from "../../../utils/services/mongodb/auxiliaries";
import connectToDatabase from "../../../utils/services/mongodb/projects";

type PostResponse = {
  data: { insertedId: string };
  message: string;
};
const createServiceOrderRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);
  if (!session.user.permissoes.ordensDeServico.criar)
    throw new createHttpError.Unauthorized(
      "Usuário não possui permissão para criar ordens de serviço.",
    );
  const db: Db = await connectToDatabase();
  const auxiliariesDb: Db = await connectToAuxiliariesDatabase(process.env.DB_KEY);

  const collection: Collection<TServiceOrder> = db.collection("ordensDeServico");
  const callendarsCollection: Collection<TCalendar> = auxiliariesDb.collection("calendarios");
  const serviceOrder = ServiceOrderSchema.parse(req.body);

  if (!serviceOrder) throw new createHttpError.BadRequest("Nenhuma informações provida.");

  let googleCalendarEventId: string | null = null;
  if (
    serviceOrder.calendarioId &&
    ((serviceOrder.agendamento?.inicio && serviceOrder.agendamento?.fim) ||
      (serviceOrder.periodo.inicio && serviceOrder.periodo.fim))
  ) {
    // In case the service order has a calendar and a period defined, we need to integrate with the calendar
    const calendar = await callendarsCollection.findOne({
      _id: new ObjectId(serviceOrder.calendarioId),
    });
    if (!calendar) throw new createHttpError.NotFound("Calendário não encontrado.");

    const googleOAuth2Client = getConfiguredGoogleOAuth2Client(calendar.googleRefreshToken);
    const googleCalendar = googleApis.calendar({ version: "v3", auth: googleOAuth2Client });

    const googleCalendarEventResponsiblesStr = serviceOrder.responsavel.nome;

    const googleCalendarEventInstructionsStr =
      serviceOrder.observacoes.length > 0
        ? serviceOrder.observacoes.map((i) => `- (${i.topico}) ${i.descricao}`).join("\n")
        : "Sem instruções";

    const googleCalendarEventLocationStr = formatLocation({
      location: {
        cep: serviceOrder.localizacao.cep,
        uf: serviceOrder.localizacao.uf || "",
        cidade: serviceOrder.localizacao.cidade || "",
        bairro: serviceOrder.localizacao.bairro || "",
        endereco: serviceOrder.localizacao.endereco || "",
        numeroOuIdentificador: serviceOrder.localizacao.numeroOuIdentificador || "",
        complemento: serviceOrder.localizacao.complemento || "",
        latitude: serviceOrder.localizacao.latitude,
        longitude: serviceOrder.localizacao.longitude,
      },
      includeCEP: true,
      includeCity: true,
      includeUf: true,
    });
    const googleCalendarEventDescription = `Responsáveis: ${googleCalendarEventResponsiblesStr} \n Instruções: \n ${googleCalendarEventInstructionsStr} \n Localização: ${googleCalendarEventLocationStr}`;

    const eventStart = serviceOrder.periodo.inicio || serviceOrder.agendamento?.inicio;
    const eventEnd = serviceOrder.periodo.fim || serviceOrder.agendamento?.fim;
    const eventParams: calendar_v3.Params$Resource$Events$Insert = {
      calendarId: calendar.googleCalendarId,
      requestBody: {
        summary: `${serviceOrder.descricao} - ${serviceOrder.favorecido.nome}`,
        description: googleCalendarEventDescription,
        start: {
          dateTime: eventStart || "",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: eventEnd || "",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    };
    const googleCalendarEvent = await googleCalendar.events.insert(eventParams);
    googleCalendarEventId = googleCalendarEvent.data.id || null;
  }
  // CREATE GOOGLE CALENDAR INTEGRATION
  const dbResponse = await insertServiceOrder({
    collection,
    info: { ...serviceOrder, googleCalendarEventId },
  });
  if (!dbResponse.acknowledged)
    throw new createHttpError.BadRequest(
      "Oops, houve um erro desconhecido ao criar ordem de serviço.",
    );
  const insertedId = dbResponse.insertedId.toString();
  res.status(201).json({ data: { insertedId }, message: "Ordem de serviço criada com sucesso !" });
};

type GetResponse = {
  data: TServiceOrderWithProjectDTO | TServiceOrderSimplified[];
};

const getServiceOrdersRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);
  const db = await connectToDatabase();
  const collection = db.collection<TServiceOrder>("ordensDeServico");

  const { id, projectId, technicalAnalysisId, responsibleName, queryTags, queryPendingConclusion } =
    req.query;

  if (id) {
    if (typeof id !== "string" || !ObjectId.isValid(id))
      throw new createHttpError.BadRequest("ID inválido.");
    const order = await getServiceOrderById({ collection, id });
    return res.json({ data: order as TServiceOrderWithProjectDTO });
  }
  if (projectId) {
    if (typeof projectId !== "string" || !ObjectId.isValid(projectId))
      throw new createHttpError.BadRequest("ID do projeto inválido.");
    const orders = await getServiceOrdersByProject({ collection, projectId });
    return res.json({ data: orders });
  }

  if (technicalAnalysisId) {
    if (typeof technicalAnalysisId !== "string" || !ObjectId.isValid(technicalAnalysisId))
      throw new createHttpError.BadRequest("ID da análise técnica inválido.");
    const orders = await getServiceOrdersByTechnicalAnalysis({ collection, technicalAnalysisId });
    return res.json({ data: orders });
  }
  const queryTagsIds =
    typeof queryTags === "string" ? queryTags.split(",").filter((q) => !!ObjectId.isValid(q)) : [];
  const queryPendingConclusionValue = queryPendingConclusion === "true";

  const queryTagsQuery: Filter<TServiceOrder> =
    queryTagsIds.length > 0 ? { "etiquetas.id": { $in: queryTagsIds } } : {};
  const queryPendingConclusionQuery: Filter<TServiceOrder> = queryPendingConclusionValue
    ? { dataEfetivacao: null }
    : {};

  if (responsibleName) {
    if (typeof responsibleName !== "string")
      throw new createHttpError.BadRequest("Nome do responsável inválido.");

    const orders = await getServiceOrdersByResponsibleName({ collection, responsibleName });
    return res.json({ data: orders });
  }

  // Else, we need to get all service orders with the given tags and pending conclusion status

  const serviceOrders = await collection
    .find(
      { ...queryTagsQuery, ...queryPendingConclusionQuery },
      { projection: ServiceOrderSimplifiedProjection },
    )
    .toArray();

  return res.json({ data: serviceOrders as TServiceOrderSimplified[] });
};

type PutResponse = any;
const editServiceOrderRoute: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);

  const db: Db = await connectToDatabase();
  const collection: Collection<TServiceOrder> = db.collection("ordensDeServico");
  const auxiliariesDb: Db = await connectToAuxiliariesDatabase(process.env.DB_KEY);
  const callendarsCollection: Collection<TCalendar> = auxiliariesDb.collection("calendarios");
  const projectsCollection: Collection<TProject> = db.collection("dados");

  const { id } = req.query;
  const changes = req.body;
  console.log("[INFO] [SERVICE ORDER UPDATE] Updating service order:", {
    id,
    user: session?.user.nome,
  });

  delete changes._id;
  // Validating the request
  if (!id || typeof id !== "string")
    throw new createHttpError.BadRequest("ID não fornecido ou inválido.");
  if (!changes) throw new createHttpError.BadRequest("Mudanças não fornecidas.");

  // Updating the service order
  const updateResponse = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...changes } },
  );
  if (!updateResponse.acknowledged)
    throw new createHttpError.BadRequest(
      "Oops, houve um erro desconhecido ao atualizar ordem de serviço.",
    );

  // In case the service order has no calendar, we can return the response
  const updatedServiceOrder = await collection.findOne({ _id: new ObjectId(id) });
  // Else, we gotta handle the integration with Google Calendar
  if (
    updatedServiceOrder?.googleCalendarEventId &&
    updatedServiceOrder?.googleCalendarId &&
    updatedServiceOrder?.calendarioId
  ) {
    const calendar = await callendarsCollection.findOne({
      _id: new ObjectId(updatedServiceOrder.calendarioId),
    });
    if (!calendar) throw new createHttpError.NotFound("Calendário não encontrado.");
    const googleOAuth2Client = getConfiguredGoogleOAuth2Client(calendar.googleRefreshToken);
    const googleCalendar = googleApis.calendar({ version: "v3", auth: googleOAuth2Client });

    const eventStart =
      updatedServiceOrder.agendamento?.inicio || updatedServiceOrder.periodo.inicio;
    const eventEnd = updatedServiceOrder.agendamento?.fim || updatedServiceOrder.periodo.fim;
    if (eventStart && eventEnd) {
      // In case the service order has a calendar and calendar event defined, we need to update the event with the new information

      const googleCalendarEventResponsiblesStr =
        updatedServiceOrder.responsavel.nome.length > 0
          ? updatedServiceOrder.responsavel.nome
          : "Sem responsáveis";
      const googleCalendarEventInstructionsStr =
        updatedServiceOrder.observacoes.length > 0
          ? updatedServiceOrder.observacoes.map((i) => `- (${i.topico}) ${i.descricao}`).join("\n")
          : "Sem instruções";
      const googleCalendarEventLocationStr = formatLocation({
        location: {
          cep: updatedServiceOrder.localizacao.cep,
          uf: updatedServiceOrder.localizacao.uf || "",
          cidade: updatedServiceOrder.localizacao.cidade || "",
          bairro: updatedServiceOrder.localizacao.bairro || "",
          endereco: updatedServiceOrder.localizacao.endereco || "",
          numeroOuIdentificador: updatedServiceOrder.localizacao.numeroOuIdentificador || "",
          complemento: updatedServiceOrder.localizacao.complemento || "",
          latitude: updatedServiceOrder.localizacao.latitude,
          longitude: updatedServiceOrder.localizacao.longitude,
        },
        includeCEP: true,
        includeCity: true,
        includeUf: true,
      });
      const googleCalendarEventDescription = `Responsáveis: ${googleCalendarEventResponsiblesStr} \n Instruções: \n ${googleCalendarEventInstructionsStr} \n Localização: ${googleCalendarEventLocationStr}`;

      const googleCalendarEventParams: calendar_v3.Params$Resource$Events$Update = {
        calendarId: calendar.googleCalendarId,
        eventId: updatedServiceOrder.googleCalendarEventId,
        requestBody: {
          summary: `${updatedServiceOrder.descricao} - ${updatedServiceOrder.favorecido.nome}`,
          description: googleCalendarEventDescription,
          start: {
            dateTime: eventStart,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: eventEnd,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      };
      await googleCalendar.events.update(googleCalendarEventParams);
    } else {
      // In case the service order has a calendar but no calendar event defined, we need to delete the event
      await googleCalendar.events.delete({
        calendarId: updatedServiceOrder.googleCalendarId,
        eventId: updatedServiceOrder.googleCalendarEventId,
      });
    }
  } else {
    if (
      updatedServiceOrder?.googleCalendarId &&
      ((updatedServiceOrder.agendamento?.inicio && updatedServiceOrder.agendamento?.fim) ||
        (updatedServiceOrder.periodo.inicio && updatedServiceOrder.periodo.fim)) &&
      updatedServiceOrder?.calendarioId
    ) {
      // In case the service order has a defined calendar id and a period defined but calendar event is not defined, we need to create the event
      const calendar = await callendarsCollection.findOne({
        _id: new ObjectId(updatedServiceOrder.calendarioId),
      });
      if (!calendar) throw new createHttpError.NotFound("Calendário não encontrado.");
      const googleOAuth2Client = getConfiguredGoogleOAuth2Client(calendar.googleRefreshToken);
      const googleCalendar = googleApis.calendar({ version: "v3", auth: googleOAuth2Client });

      const eventStart =
        updatedServiceOrder.agendamento?.inicio || updatedServiceOrder.periodo.inicio;
      const eventEnd = updatedServiceOrder.agendamento?.fim || updatedServiceOrder.periodo.fim;

      const googleCalendarEventResponsiblesStr =
        updatedServiceOrder.responsavel.nome.length > 0
          ? updatedServiceOrder.responsavel.nome
          : "Sem responsáveis";
      const googleCalendarEventInstructionsStr =
        updatedServiceOrder.observacoes.length > 0
          ? updatedServiceOrder.observacoes.map((i) => `- (${i.topico}) ${i.descricao}`).join("\n")
          : "Sem instruções";
      const googleCalendarEventLocationStr = formatLocation({
        location: {
          cep: updatedServiceOrder.localizacao.cep,
          uf: updatedServiceOrder.localizacao.uf || "",
          cidade: updatedServiceOrder.localizacao.cidade || "",
          bairro: updatedServiceOrder.localizacao.bairro || "",
          endereco: updatedServiceOrder.localizacao.endereco || "",
          numeroOuIdentificador: updatedServiceOrder.localizacao.numeroOuIdentificador || "",
          complemento: updatedServiceOrder.localizacao.complemento || "",
          latitude: updatedServiceOrder.localizacao.latitude,
          longitude: updatedServiceOrder.localizacao.longitude,
        },
        includeCEP: true,
        includeCity: true,
        includeUf: true,
      });
      const googleCalendarEventDescription = `Responsáveis: ${googleCalendarEventResponsiblesStr} \n Instruções: \n ${googleCalendarEventInstructionsStr} \n Localização: ${googleCalendarEventLocationStr}`;
      const eventParams: calendar_v3.Params$Resource$Events$Insert = {
        calendarId: calendar.googleCalendarId,
        requestBody: {
          summary: `${updatedServiceOrder.descricao} - ${updatedServiceOrder.favorecido.nome}`,
          description: googleCalendarEventDescription,
          start: {
            dateTime: eventStart,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: eventEnd,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      };
      const googleCalendarEvent = await googleCalendar.events.insert(eventParams);

      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { googleCalendarEventId: googleCalendarEvent.data.id } },
      );
    }
  }
  console.log("[INFO] [SERVICE ORDER UPDATE] Handling project automations...");
  // Searching for service order project linked project
  const project = await projectsCollection.findOne({ idOrdemServico: id });

  if (project) {
    console.log("[INFO] [SERVICE ORDER UPDATE] Project found: ", {
      id: project._id.toString(),
      nome: project.nomeDoContrato,
      qtde: project.qtde,
    });
    // If project found, updating its execution related data with the most recent service order update

    const updatedServiceOrder = await collection.findOne({ _id: new ObjectId(id) });
    if (!updatedServiceOrder)
      throw new createHttpError.InternalServerError("Ordem de serviço não encontrada.");

    await projectsCollection.updateOne(
      { _id: new ObjectId(project._id) },
      {
        $set: {
          "obra.entrada": updatedServiceOrder.periodo.inicio,
          "obra.saida": updatedServiceOrder.periodo.fim,
          "obra.statusDaObra": updatedServiceOrder.status,
          "obra.equipeResp": updatedServiceOrder.responsavel.nome,
          "obra.observacoes": updatedServiceOrder.observacoes
            .map((p) => `(${p.topico}):${p.descricao}`)
            .join("/"),
        },
      },
    );
  }
  if (!updatedServiceOrder) throw new createHttpError.NotFound("Ordem de serviço não encontrada.");

  return res.status(201).json(updatedServiceOrder);
};

type DeleteResponse = {
  data: string;
  message: string;
};

const deleteServiceOrderRoute: NextApiHandler<DeleteResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);
  if (!session.user.permissoes.ordensDeServico.editar)
    throw new createHttpError.Unauthorized("Permissão insuficiente.");
  const { id } = req.query;
  if (!id || typeof id !== "string" || !ObjectId.isValid(id))
    throw new createHttpError.BadRequest("ID inválido.");

  const db = await connectToDatabase();
  const collection: Collection<TServiceOrder> = db.collection("ordensDeServico");

  const deleteResponse = await collection.deleteOne({ _id: new ObjectId(id) });
  if (!deleteResponse.acknowledged)
    throw new createHttpError.BadRequest(
      "Oops, houve um erro desconhecido ao excluir ordem de serviço.",
    );

  return res.status(201).json({
    data: "Ordem de serviço excluída com sucesso !",
    message: "Ordem de serviço excluída com sucesso !",
  });
};

export default apiHandler({
  GET: getServiceOrdersRoute,
  POST: createServiceOrderRoute,
  PUT: editServiceOrderRoute,
  DELETE: deleteServiceOrderRoute,
});

type GetServiceOrdersByProjectParams = {
  collection: Collection<TServiceOrder>;
  projectId: string;
};
async function getServiceOrdersByProject({
  collection,
  projectId,
}: GetServiceOrdersByProjectParams) {
  const orders = await collection
    .find({ "projeto.id": projectId }, { projection: ServiceOrderSimplifiedProjection })
    .toArray();
  return orders as TServiceOrderSimplified[];
}

type GetServiceOrdersByTechnicalAnalysisParams = {
  collection: Collection<TServiceOrder>;
  technicalAnalysisId: string;
};
export async function getServiceOrdersByTechnicalAnalysis({
  collection,
  technicalAnalysisId,
}: GetServiceOrdersByTechnicalAnalysisParams) {
  const orders = await collection
    .find(
      { idAnaliseTecnica: technicalAnalysisId },
      { projection: ServiceOrderSimplifiedProjection },
    )
    .toArray();
  return orders as TServiceOrderSimplified[];
}

type GetServiceOrdersByResponsibleNameParams = {
  collection: Collection<TServiceOrder>;
  responsibleName: string;
};
async function getServiceOrdersByResponsibleName({
  collection,
  responsibleName,
}: GetServiceOrdersByResponsibleNameParams) {
  const orders = await collection
    .find(
      { "responsavel.nome": responsibleName, dataEfetivacao: null },
      { projection: ServiceOrderSimplifiedProjection },
    )
    .toArray();
  return orders as TServiceOrderSimplified[];
}

type GetServiceOrderByIdParams = {
  collection: Collection<TServiceOrder>;
  id: string;
};
async function getServiceOrderById({ collection, id }: GetServiceOrderByIdParams) {
  const addFields = { projectIdAsObjectId: { $toObjectId: "$projeto.id" } };
  const lookup = {
    from: "dados",
    localField: "projectIdAsObjectId",
    foreignField: "_id",
    as: "projetoDados",
  };
  const serviceOrderArr = await collection
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $addFields: addFields },
      { $lookup: lookup },
      {
        $project: {
          descricao: 1,
          categoria: 1,
          status: 1,
          pendencias: 1,
          favorecido: 1,
          idAnaliseTecnica: 1,
          projeto: 1,
          etiquetas: 1,
          localizacao: 1,
          responsavel: 1,
          responsaveis: 1,
          urgencia: 1,
          anotacoes: 1,
          detalhes: 1,
          autor: 1,
          cobranca: 1,
          pagamento: 1,
          observacoes: 1,
          equipamentos: 1,
          agendamento: 1,
          periodo: 1,
          calendarioId: 1,
          googleCalendarId: 1,
          googleCalendarEventId: 1,
          dataPrevisaoLiberacao: 1,
          dataLiberacao: 1,
          dataEfetivacao: 1,
          dataInsercao: 1,
          "projetoDados._id": 1,
          "projetoDados.qtde": 1,
          "projetoDados.nomeDoContrato": 1,
          "projetoDados.cpf_cnpj": 1,
          "projetoDados.tipoDeServico": 1,
          "projetoDados.vendedor": 1,
          "projetoDados.cep": 1,
          "projetoDados.uf": 1,
          "projetoDados.cidade": 1,
          "projetoDados.bairro": 1,
          "projetoDados.logradouro": 1,
          "projetoDados.numeroResidencia": 1,
          "projetoDados.produtos": 1,
          "projetoDados.servicos": 1,
          "projetoDados.compra.kitInfo": 1,
          "projetoDados.compra.dataPagamento": 1,
          "projetoDados.compra.previsaoEntrega": 1,
          "projetoDados.compra.dataEntrega": 1,
          "projetoDados.homologacao.acesso.dataResposta": 1,
          "projetoDados.homologacao.vistoria.dataEfetivacao": 1,
          "projetoDados.material.materialFaltante": 1,
          "projetoDados.obra.entrada": 1,
          "projetoDados.obra.saida": 1,
          "projetoDados.obra.statusDaObra": 1,
          "projetoDados.obra.equipeResp": 1,
          "projetoDados.obra.observacoes": 1,
          "projetoDados.obra.pendencias": 1,
          "projetoDados.idVisitaTecnica": 1,
          "projetoDados.alocacoes": 1,
        },
      },
    ])
    .toArray();
  const serviceOrder = serviceOrderArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0];
  if (!serviceOrder) throw new createHttpError.NotFound("Ordem de serviço não encontrada.");

  return serviceOrder as TServiceOrderWithProjectDTO;
}

type InsertServiceOrderParams = {
  collection: Collection<TServiceOrder>;
  info: TServiceOrder;
};
async function insertServiceOrder({ collection, info }: InsertServiceOrderParams) {
  const dbResponse = await collection.insertOne({
    ...info,
    dataInsercao: new Date().toISOString(),
  });
  return dbResponse;
}
