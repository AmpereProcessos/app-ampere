import { apiHandler } from "@/utils/api";
import { GeneralTotemSimulationSchema, TTotemSimulation } from "@/utils/schemas/totem-simulation";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { Collection, Db } from "mongodb";
import { NextApiHandler } from "next";

type PostResponse = {
	data: { insertedId: string };
	message: string;
};

const createSimulationRegistry: NextApiHandler<PostResponse> = async (req, res) => {
	const simulation = GeneralTotemSimulationSchema.parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY, "projetos");
	const collection: Collection<TTotemSimulation> = db.collection("totem-simulacoes");

	const insertResponse = await collection.insertOne({ ...simulation });

	if (!insertResponse.acknowledged) throw new createHttpError.BadRequest("Oops, houve um erro desconhecido ao registrar simulação.");

	const insertedId = insertResponse.insertedId.toString();
	return res.status(201).json({ data: { insertedId }, message: "Simulação concluída com sucesso !" });
};

export default apiHandler({ POST: createSimulationRegistry });
