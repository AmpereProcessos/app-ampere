import type { TAuthSession } from "@/lib/authentication/types";
import {
  WhatsappIntegrationDataSchema,
  type TIntegration,
  type TWhatsappIntegrationData,
} from "@/utils/schemas/integrations";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";

export async function saveWhatsappIntegration(connection: TWhatsappIntegrationData, session: TAuthSession) {
  if (!session?.user) throw new createHttpError.Unauthorized("Usuário não autenticado.");
  const dados = WhatsappIntegrationDataSchema.parse(connection);
  const db = await connectToDatabase();
  await db.collection<TIntegration>("integracoes").updateOne(
    { identificador: "WHATSAPP" },
    {
      $set: { dados },
      $setOnInsert: {
        identificador: "WHATSAPP",
        autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
        dataInsercao: new Date().toISOString(),
      },
    },
    { upsert: true },
  );
}
