import { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import { NextApiHandler } from "next";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { Collection, Db } from "mongodb";

type GetResponse = {
	data: TProject[];
};

const getWarehouseProjects: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const db: Db = await connectToDatabase(process.env.DB_KEY, "projetos");
	const collection: Collection<TProject> = db.collection("dados");

	const projects = await collection
		.find(
			{
				"contrato.status": "ASSINADO",
				"obra.statusDaObra": { $ne: "CONCLUÍDA" },
				"material.statusSeparacao": { $ne: "SEPARADO" },
				tipoDeServico: { $ne: "OPERAÇÃO E MANUTENÇÃO" },
			},
			{ sort: { "compra.dataEntrega": 1 } },
		)
		.toArray();
	return res.status(200).json({ data: projects });
};
export default apiHandler({ GET: getWarehouseProjects });
