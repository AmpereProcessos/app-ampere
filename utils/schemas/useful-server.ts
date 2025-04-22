import { ObjectId } from "mongodb";
import { z } from "zod";

export const MongoDbIdSchema = z
	.string({ required_error: "ID inválido ou não fornecido.", invalid_type_error: "ID inválido ou não fornecido." })
	.refine((v) => ObjectId.isValid(v), { message: "ID inválido ou não fornecido." })
	.transform((v) => new ObjectId(v));
