import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/services/mongodb/auxiliaries";
import createHttpError from "http-errors";
import { errorHandler } from "../../../utils/methods/handlers";
export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const { id } = req.query;
			const db = await connectToDatabase(process.env.DB_KEY);
			const apportionmentsCollection = db.collection("centrosDeCusto");
			if (id) {
				if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

				const apportionment = await getSingleApportionment({
					id: id,
					collection: apportionmentsCollection,
				});

				if (!apportionment) throw new createHttpError.NotFound("Nenhum centro de custo encontrado para esse ID.");

				res.status(200).json(apportionment);
			} else {
				const apportionments = await getAllApportionments({
					collection: apportionmentsCollection,
				});
				res.status(200).json(apportionments);
			}
		} catch (error) {
			errorHandler(error, res);
		}
	}
	if (req.method === "POST") {
		try {
			const { data } = req.body;
			if (!data) throw new createHttpError.BadRequest("Informações para inserção de centro de custo não fornecidas.");
			const db = await connectToDatabase(process.env.DB_KEY);
			const apportionmentsCollection = db.collection("centrosDeCusto");
			const insertResponse = await insertApportionment({ collection: apportionmentsCollection, data: data });
			res.status(201).json("Centro de custo criado com sucesso.");
		} catch (error) {
			errorHandler(error, res);
		}
	}
	if (req.method === "PUT") {
		try {
			const { id } = req.query;
			if (!id) throw new createHttpError.BadRequest("ID inválido ou não fornecido.");
			const { data } = req.body;
			if (!data) throw new createHttpError.BadRequest("Informações para atualização do centro de custo não fornecidas.");
			const db = await connectToDatabase(process.env.DB_KEY);
			const apportionmentsCollection = db.collection("centrosDeCusto");
			var updateObj = { ...data };
			delete updateObj._id;
			const updateResponse = await updateApportionment({ id: id, collection: apportionmentsCollection, data: updateObj });
			console.log(updateResponse);
			res.status(201).json("Centro de custo atualizado com sucesso.");
		} catch (error) {
			errorHandler(error, res);
		}
	}
}

async function getSingleApportionment({ id, collection }) {
	try {
		return await collection.findOne({
			_id: ObjectId(id),
		});
	} catch (error) {
		throw error;
	}
}
async function getAllApportionments({ collection }) {
	try {
		return await collection
			.aggregate([
				{
					$sort: {
						nome: 1,
					},
				},
			])
			.toArray();
	} catch (error) {
		throw error;
	}
}
async function insertApportionment({ collection, data }) {
	const { nome, categorias, orcamentos } = data;
	try {
		const insertResponse = await collection.insertOne({ nome, categorias, orcamentos });
		return insertResponse;
	} catch (error) {
		throw error;
	}
}
async function updateApportionment({ id, collection, data }) {
	try {
		const updateResponse = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...data } });
		return updateResponse;
	} catch (error) {
		throw error;
	}
}
