import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProperty } from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { NextApiHandler } from "next";
import { z } from "zod";

const SimplifiedPropertiesQueryParamsSchema = z.object({
  search: z
    .string({ invalid_type_error: "Tipo não válido para o search." })
    .optional()
    .nullable(),
});
export type TSimplifiedPropertiesQueryParamsInput = z.infer<
  typeof SimplifiedPropertiesQueryParamsSchema
>;

export type TSimplifiedProperty = {
  _id: string;
  nome: string;
  identificador: string;
  imagemUrl: string | null | undefined;
};

async function getSimplifiedProperties({
  queryParams,
}: {
  queryParams: TSimplifiedPropertiesQueryParamsInput;
}) {
  const db = await connectToAdministrationDatabase();
  const propertiesCollection = db.collection<TProperty>("propriedades");

  const query =
    queryParams.search && queryParams.search.trim().length > 0
      ? {
          $or: [
            { nome: { $regex: queryParams.search, $options: "i" } },
            { identificador: { $regex: queryParams.search, $options: "i" } },
          ],
        }
      : {};

  const properties = await propertiesCollection
    .find(query, {
      projection: { nome: 1, identificador: 1, imagemUrl: 1 },
      sort: { nome: 1 },
    })
    .toArray();

  return {
    data: properties.map((property) => ({
      _id: property._id.toString(),
      nome: property.nome,
      identificador: property.identificador,
      imagemUrl: property.imagemUrl,
    })),
  };
}

export type TGetSimplifiedPropertiesOutput = Awaited<ReturnType<typeof getSimplifiedProperties>>;

const getSimplifiedPropertiesHandler: NextApiHandler<TGetSimplifiedPropertiesOutput> = async (
  req,
  res,
) => {
  await validateAuthenticationWithSession(req, res);
  const queryParams = SimplifiedPropertiesQueryParamsSchema.parse(req.query);
  const properties = await getSimplifiedProperties({ queryParams });
  return res.status(200).json(properties);
};

export default apiHandler({
  GET: getSimplifiedPropertiesHandler,
});
