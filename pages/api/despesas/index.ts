import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TExpense, TExpenseWithProjectDTO } from "@/utils/schemas/expenses";
import createHttpError from "http-errors";
import { type Collection, type Db, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { errorHandler } from "../../../utils/methods/handlers";
import connectToDatabase from "../../../utils/services/mongodb/projects";

type GetResponse = {
	data: TExpense | TExpense[];
};
const getExpenses: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id, projectId, identifier } = req.query;

	const db: Db = await connectToDatabase();
	const collection: Collection<TExpense> = db.collection("despesas");

	// Query for specific expense
	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const addFields = { projectIdAsObjectId: { $toObjectId: "$projeto.id" } };
		const lookup = { from: "dados", localField: "projectIdAsObjectId", foreignField: "_id", as: "projetoDados" };

		const expenseArr = await collection
			.aggregate([
				{ $match: { _id: new ObjectId(id) } },
				{ $addFields: addFields },
				{ $lookup: lookup },
				{
					$project: {
						rateio: 1,
						categoria: 1,
						descricao: 1,
						projeto: 1,
						idFormularioAlmoxarifado: 1,
						itens: 1,
						total: 1,
						efetivacao: 1,
						criterioReferencia: 1,
						criterioCompetencia: 1,
						pagamentos: 1,
						autor: 1,
						dataInsercao: 1,
						"projetoDados._id": 1,
						"projetoDados.nomeDoContrato": 1,
						"projetoDados.cpf_cnpj": 1,
						"projetoDados.inscricaoRural": 1,
						"projetoDados.tipoDeServico": 1,
						"projetoDados.telefone": 1,
						"projetoDados.email": 1,
						"projetoDados.cep": 1,
						"projetoDados.uf": 1,
						"projetoDados.cidade": 1,
						"projetoDados.bairro": 1,
						"projetoDados.logradouro": 1,
						"projetoDados.numeroResidencia": 1,
						"projetoDados.pagamento.pagador": 1,
						"projetoDados.pagamento.contatoPagador": 1,
						"projetoDados.pagamento.cpf_cnpjPagador": 1,
						"projetoDados.pagamento.forma": 1,
						"projetoDados.pagamento.metodo": 1,
						"projetoDados.pagamento.credor": 1,
						"projetoDados.pagamento.credorNomeGerente": 1,
						"projetoDados.pagamento.credorContatoGerente": 1,
						"projetoDados.pagamento.negociacao": 1,
						"projetoDados.produtos": 1,
						"projetoDados.servicos": 1,
					},
				},
			])
			.toArray();
		const expense = expenseArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0];

		if (!expense) throw new createHttpError.NotFound("Despesa não encontrada.");
		return res.status(200).json({ data: expense as TExpenseWithProjectDTO });
	}

	// Query for a given project expenses
	if (projectId) {
		if (typeof projectId !== "string") throw new createHttpError.BadRequest("ID de projeto inválido.");

		const byIdentifier = identifier ? { identificador: identifier } : {};
		const query: Filter<TExpense> = { "projeto.id": projectId, ...byIdentifier };
		const expenses = await collection.find(query, { sort: { _id: -1 } }).toArray();
		return res.status(200).json({ data: expenses });
	}

	const expenses = await collection.find({}, { sort: { _id: -1 } }).toArray();
	return res.status(200).json({ data: expenses });
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};
const createExpense: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const info = req.body.data;
	if (!info) throw new createHttpError.BadRequest("Informações para criação da despesas não fornecidas.");

	const db: Db = await connectToDatabase();
	const collection: Collection<TExpense> = db.collection("despesas");

	const insertResponse = await collection.insertOne({ ...info, dataInsercao: new Date().toISOString() });

	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro na criação da receita.");

	return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: "Receita criada com sucesso !" });
};
type PutResponse = {
	data: string;
	message: string;
};

const editExpense: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { changes } = req.body;
	const { id } = req.query;
	if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	delete changes._id;
	const db: Db = await connectToDatabase();
	const collection: Collection<TExpense> = db.collection("despesas");

	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } });

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar receita.");

	return res.status(201).json({ data: "Despesa atualizada com sucesso!", message: "Despesa atualizada com sucesso!" });
};

export default apiHandler({
	GET: getExpenses,
	POST: createExpense,
	PUT: editExpense,
});
// export default async function handler(req, res) {
//   if (req.method == 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('despesas')
//     const { projectId } = req.query
//     try {
//       if (projectId && typeof projectId == 'string') {
//         // Project related expenses
//         const expenses = await collection
//           .aggregate([
//             {
//               $match: {
//                 'projeto.id': projectId,
//               },
//             },
//           ])
//           .toArray()
//         res.status(200).json(expenses)
//       } else {
//         // All expenses
//         const expenses = await collection.aggregate([{ $sort: { dataInsercao: -1 } }]).toArray()
//         res.status(200).json(expenses)
//       }
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
//   if (req.method == 'POST') {
//     try {
//       const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//       const collection = db.collection('despesas')
//       const info = req.body.data
//       let dbRes = await collection.insertOne(info)
//       res.json(dbRes)
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
//   if (req.method == 'PUT') {
//     try {
//       const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//       const collection = db.collection('despesas')
//       const { changes } = req.body
//       const { id } = req.query
//       if (!changes) throw new createHttpError.BadRequest('Objeto de mudanças não fornecido.')
//       if (!id || typeof id != 'string') throw new createHttpError.BadRequest('ID inválido.')

//       const dbResponse = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...changes } })
//       res.json(dbResponse)
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
// }
