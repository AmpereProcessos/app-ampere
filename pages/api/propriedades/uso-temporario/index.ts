import type { TAuthSession } from "@/lib/authentication/types";
import { getVehicleReviewAlertLevelByKmDifference } from "@/lib/property-usage";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import {
  PropertyTemporaryUsageSchema,
  type TProperty,
  type TPropertyTemporaryUsage,
} from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import clientPromise from "@/utils/services/mongodb/mongo-client";
import createHttpError from "http-errors";
import { type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import nodemailer from "nodemailer";
import { z } from "zod";

const VEHICLE_REVIEW_ALERT_EMAIL = "comercial@ampereenergias.com.br";

type TVehicleReviewAlertEmailPayload = {
  subject: string;
  message: string;
};

async function sendVehicleReviewAlertEmail(payload: TVehicleReviewAlertEmailPayload) {
  const msg = {
    from: "ampereprocessos@email.com",
    to: VEHICLE_REVIEW_ALERT_EMAIL,
    subject: payload.subject,
    text: payload.message,
  };
  await nodemailer
    .createTransport({
      service: "gmail",
      auth: {
        user: "ampereprocessos@gmail.com",
        pass: "ccyecqdvssayztwe",
      },
      port: 587,
      host: "smtp.gmail.com",
    })
    .sendMail(msg);
}

const PropertyTemporaryUsagesByPeriodQueryParams = z.object({
  search: z.string({ invalid_type_error: "Tipo não válido para o search." }).optional().nullable(),
  propertyIds: z
    .string({
      invalid_type_error: "Tipo não válido para o propertyIds.",
      required_error: "Property IDs não informados.",
    })
    .optional()
    .nullable()
    .transform((val) => (val ? val.split(",") : [])),
  type: z.enum(["all", "open", "closed"]),
  periodAfter: z
    .string({
      required_error: "Data de início não informada.",
      invalid_type_error: "Tipo não válido para a data de início.",
    })
    .datetime({ message: "Tipo inválido para a data de início." })
    .optional()
    .nullable(),
  periodBefore: z
    .string({
      required_error: "Data de término não informada.",
      invalid_type_error: "Tipo não válido para a data de término.",
    })
    .datetime({ message: "Tipo inválido para a data de término." })
    .optional()
    .nullable(),
  periodType: z.enum(["dataInicio", "dataFim"]).optional().nullable(),
});
export type TPropertyTemporaryUsagesByPeriodInput = z.infer<
  typeof PropertyTemporaryUsagesByPeriodQueryParams
>;

const PropertyTemporaryUsageByIdQueryParams = z.object({
  id: z.string({
    required_error: "ID da propriedade não informado.",
    invalid_type_error: "Tipo não válido para o ID da propriedade.",
  }),
});
export type TPropertyTemporaryUsageByIdInput = z.infer<
  typeof PropertyTemporaryUsageByIdQueryParams
>;

const TemporaryUsagesQueryParams = z.union([
  PropertyTemporaryUsagesByPeriodQueryParams,
  PropertyTemporaryUsageByIdQueryParams,
]);
export type TPropertyTemporaryUsagesInput = z.infer<typeof TemporaryUsagesQueryParams>;

async function getTemporaryUsagesRoute({
  params,
  session: _session,
}: {
  params: TPropertyTemporaryUsagesInput;
  session: TAuthSession;
}) {
  const db = await connectToAdministrationDatabase();
  const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>(
    "propriedades-uso-temporario",
  );

  if ("id" in params) {
    if (!ObjectId.isValid(params.id))
      throw new createHttpError.BadRequest("ID da propriedade inválido.");

    const temporaryUsageRecord = await temporaryUsagesCollection.findOne({
      _id: new ObjectId(params.id),
    });
    if (!temporaryUsageRecord) throw new createHttpError.NotFound("Uso temporário não encontrado.");

    return {
      data: {
        byId: { ...temporaryUsageRecord, _id: temporaryUsageRecord._id.toString() },
        default: undefined,
      },
    };
  }

  const { periodAfter, periodBefore, periodType, propertyIds, search } = params;

  const typeQueryMap: Record<
    TPropertyTemporaryUsagesByPeriodInput["type"],
    Filter<TPropertyTemporaryUsage>
  > = {
    all: {},
    open: {
      dataFim: null,
    },
    closed: {
      dataFim: { $ne: null },
    },
  };

  const typeQuery = typeQueryMap[params.type];
  const periodQuery: Filter<TPropertyTemporaryUsage> =
    periodAfter && periodBefore && periodType
      ? {
          [periodType]: {
            $gte: periodAfter,
            $lte: periodBefore,
          },
        }
      : {};

  const propertyIdsQuery: Filter<TPropertyTemporaryUsage> =
    propertyIds && propertyIds.length > 0
      ? {
          "propriedade.id": { $in: propertyIds },
        }
      : {};

  const searchQuery: Filter<TPropertyTemporaryUsage> =
    search && search.trim().length > 0
      ? {
          $or: [
            { "propriedade.nome": { $regex: search, $options: "i" } },
            { "responsaveis.nome": { $regex: search, $options: "i" } },
          ],
        }
      : {};

  const query = {
    ...typeQuery,
    ...periodQuery,
    ...propertyIdsQuery,
    ...searchQuery,
  };
  const temporaryUsages = await temporaryUsagesCollection
    .find(query, {
      sort: {
        _id: -1,
      },
    })
    .toArray();

  return {
    data: {
      byId: undefined,
      default: temporaryUsages.map((usage) => ({ ...usage, _id: usage._id.toString() })),
    },
  };
}
export type TGetPropertyTemporaryUsagesOutput = Awaited<ReturnType<typeof getTemporaryUsagesRoute>>;
export type TGetPropertyTemporaryUsagesDefaultOutput = Exclude<
  TGetPropertyTemporaryUsagesOutput["data"]["default"],
  undefined
>;
export type TGetPropertyTemporaryUsageByIdOutput = Exclude<
  TGetPropertyTemporaryUsagesOutput["data"]["byId"],
  undefined
>;

const getTemporaryUsagesHandler: NextApiHandler<TGetPropertyTemporaryUsagesOutput> = async (
  req,
  res,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const params = TemporaryUsagesQueryParams.parse(req.query);
  const temporaryUsages = await getTemporaryUsagesRoute({ params, session });
  res.status(200).json(temporaryUsages);
};

export type TCreateTemporaryUsageInput = TPropertyTemporaryUsage;
async function createTemporaryUsageRoute({ payload }: { payload: TPropertyTemporaryUsage }) {
  const db = await connectToAdministrationDatabase();
  const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>(
    "propriedades-uso-temporario",
  );

  const insertedTemporaryUseageResponse = await temporaryUsagesCollection.insertOne(payload);

  if (!insertedTemporaryUseageResponse.acknowledged)
    throw new createHttpError.InternalServerError("Erro ao inserir uso temporário.");

  const insertedTemporaryUsageId = insertedTemporaryUseageResponse.insertedId.toString();
  return {
    data: {
      insertedId: insertedTemporaryUsageId,
    },
    message: "Uso temporário inserido com sucesso.",
  };
}
export type TCreateTemporaryUsageOutput = Awaited<ReturnType<typeof createTemporaryUsageRoute>>;

const createTemporaryUsageHandler: NextApiHandler<TCreateTemporaryUsageOutput> = async (
  req,
  res,
) => {
  const payload = PropertyTemporaryUsageSchema.parse(req.body);
  const temporaryUsage = await createTemporaryUsageRoute({ payload });
  res.status(200).json(temporaryUsage);
};

const UpdatePropertyTemporaryUsageSchema = z.object({
  id: z.string({
    required_error: "ID da propriedade não informado.",
    invalid_type_error: "Tipo não válido para o ID da propriedade.",
  }),
  changes: PropertyTemporaryUsageSchema,
});
export type TUpdatePropertyTemporaryUsageInput = z.infer<typeof UpdatePropertyTemporaryUsageSchema>;

async function updateTemporaryUsageRoute({
  payload,
}: {
  payload: TUpdatePropertyTemporaryUsageInput;
}) {
  console.log("[INFO] [UPDATE TEMPORARY USAGE] Updating temporary usage", {
    propertyId: payload.changes.propriedade.id,
    propertyUsageType: payload.changes.metadados.tipo,
  });
  const dbClient = await clientPromise;
  const dbSession = dbClient.startSession();
  let vehicleReviewAlertEmailPayload: TVehicleReviewAlertEmailPayload | null = null;

  try {
    const transactionResult = await dbSession.withTransaction(async () => {
      console.log("[INFO] [UPDATE TEMPORARY USAGE] Starting transaction");

      const db = dbClient.db("administracao");
      const propertiesCollection = db.collection<TProperty>("propriedades");
      const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>(
        "propriedades-uso-temporario",
      );
      if (
        payload.changes.metadados.kmFinal !== null &&
        payload.changes.metadados.kmFinal !== undefined &&
        payload.changes.metadados.kmInicial > payload.changes.metadados.kmFinal
      ) {
        console.log("[ERROR] [UPDATE TEMPORARY USAGE] Kilometers inconsistency detected");
        // Checking for possible inconsistency in vehicle usage kilometers
        throw new createHttpError.BadRequest(
          "Kilometragem inicial não pode ser maior que a kilometragem final.",
        );
      }

      const updatedTemporaryUsageResponse = await temporaryUsagesCollection.updateOne(
        { _id: new ObjectId(payload.id) },
        { $set: payload.changes },
        { session: dbSession },
      );

      if (!updatedTemporaryUsageResponse.acknowledged)
        throw new createHttpError.InternalServerError("Erro ao atualizar uso temporário.");

      // Getting updated property usage
      const updatedPropertyUsage = await temporaryUsagesCollection.findOne(
        { _id: new ObjectId(payload.id) },
        { session: dbSession },
      );
      if (!updatedPropertyUsage)
        throw new createHttpError.NotFound("Uso temporário não encontrado.");

      if (
        updatedPropertyUsage.metadados.tipo === "USO DE VEÍCULO" &&
        updatedPropertyUsage.metadados.kmFinal
      ) {
        console.log("[INFO] [UPDATE TEMPORARY USAGE] Updating property cumulative kilometers");
        const initialKilometers = updatedPropertyUsage.metadados.kmInicial ?? 0;
        const finalKilometers = updatedPropertyUsage.metadados.kmFinal ?? 0;

        const differenceKilometers = (finalKilometers || 0) - initialKilometers;

        const currentProperty = await propertiesCollection.findOne(
          { _id: new ObjectId(updatedPropertyUsage.propriedade.id) },
          { session: dbSession },
        );
        if (!currentProperty) throw new createHttpError.NotFound("Propriedade não encontrada.");
        const currentAccumulatedKilometers = currentProperty.metadados.kmAcumulado;
        const expectedAccumulatedKilometers = currentAccumulatedKilometers + differenceKilometers;
        if (expectedAccumulatedKilometers !== finalKilometers) {
          console.warn(
            "[WARNING] [UPDATE TEMPORARY USAGE] Expected accumulated kilometers do not match final kilometers",
            {
              expectedAccumulatedKilometers,
              finalKilometers,
              differenceKilometers,
              currentAccumulatedKilometers,
            },
          );
        }
        if (currentProperty.metadados.tipo === "VEÍCULO") {
          const kmDifferenceUntilNextReview =
            currentProperty.metadados.kmProximaRevisao - finalKilometers;
          const vehicleReviewAlertLevel = getVehicleReviewAlertLevelByKmDifference(
            kmDifferenceUntilNextReview,
          );
          if (vehicleReviewAlertLevel) {
            vehicleReviewAlertEmailPayload = {
              subject: `[ALERTA] Revisao de veiculo ${currentProperty.identificador}`,
              message: [
                "Atenção: a kilometragem de revisão do veículo está próxima/atingida.",
                "",
                `Propriedade: ${currentProperty.nome} (${currentProperty.identificador})`,
                `Quilometragem atual: ${finalKilometers}km`,
                `Próxima revisão: ${currentProperty.metadados.kmProximaRevisao}km`,
                `Diferença para revisão: ${kmDifferenceUntilNextReview}km`,
                `Nível de alerta: ${vehicleReviewAlertLevel.text}`,
                "",
                vehicleReviewAlertLevel.call,
              ].join("\n"),
            };
          }
        }

        const updatedProperty = await propertiesCollection.updateOne(
          { _id: new ObjectId(updatedPropertyUsage.propriedade.id) },
          { $set: { "metadados.kmAcumulado": finalKilometers } }, // using final kilometers to update the property accumulated kilometers
          { session: dbSession },
        );
        if (!updatedProperty.acknowledged)
          throw new createHttpError.InternalServerError(
            "Erro ao atualizar quilometragem acumulada da propriedade.",
          );
        console.log(
          `[INFO] [UPDATE TEMPORARY USAGE] Property cumulative kilometers updated with ${differenceKilometers} kilometers`,
        );
      }
      console.log("[SUCCESS] [UPDATE TEMPORARY USAGE] Transaction completed successfully");
      return {
        data: { updatedId: updatedTemporaryUsageResponse.upsertedId?.toString() },
        message: "Uso temporário atualizado com sucesso.",
      };
    });
    if (vehicleReviewAlertEmailPayload) {
      try {
        await sendVehicleReviewAlertEmail(vehicleReviewAlertEmailPayload);
      } catch (error) {
        console.warn(
          "[WARNING] [UPDATE TEMPORARY USAGE] Failed to send vehicle review alert email",
          {
            error,
            emailTo: VEHICLE_REVIEW_ALERT_EMAIL,
            propertyId: payload.changes.propriedade.id,
          },
        );
      }
    }
    return transactionResult as { data: { updatedId: string }; message: string };
  } catch (error) {
    console.log("[ERROR] [UPDATE TEMPORARY USAGE] Transaction failed", { error });
    throw error;
  } finally {
    console.log("[INFO] [UPDATE TEMPORARY USAGE] Ending transaction");
    await dbSession.endSession();
  }
}
export type TUpdatePropertyTemporaryUsageOutput = Awaited<
  ReturnType<typeof updateTemporaryUsageRoute>
>;

const updateTemporaryUsageHandler: NextApiHandler<TUpdatePropertyTemporaryUsageOutput> = async (
  req,
  res,
) => {
  const payload = UpdatePropertyTemporaryUsageSchema.parse(req.body);
  const temporaryUsage = await updateTemporaryUsageRoute({ payload });
  res.status(200).json(temporaryUsage);
};

export default apiHandler({
  GET: getTemporaryUsagesHandler,
  POST: createTemporaryUsageHandler,
  PUT: updateTemporaryUsageHandler,
});
