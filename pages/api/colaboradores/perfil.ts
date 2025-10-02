import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertUserSchema, type TEmployee } from "@/utils/schemas/users";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import type z from "zod";

async function getProfile({ session }: { session: TAuthSession }) {
	const db = await connectToAdministrationDatabase();
	const colaboradoresCollection = db.collection<TEmployee>("colaboradores");

	const user = await colaboradoresCollection.findOne({ _id: new ObjectId(session.user.id) });
	if (!user) throw new createHttpError.NotFound("Usuário não encontrado.");
	return {
		data: {
			_id: user._id.toString(),
			usuario: user.usuario,
			nome: user.nome,
			cpf: user.cpf,
			email: user.email,
			telefone: user.telefone,
			avatar_url: user.avatar_url,
			dataNascimento: user.dataNascimento,
			localNascimento: user.localNascimento,
			nacionalidade: user.nacionalidade,
			estadoCivil: user.estadoCivil,
			carteiraTrabalho: user.carteiraTrabalho,
			rg: user.rg,
		},
		message: "Perfil obtido com sucesso !",
	};
}
export type TGetProfileOutput = Awaited<ReturnType<typeof getProfile>>;

const getProfileRoute: NextApiHandler<TGetProfileOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const data = await getProfile({ session });
	return res.status(200).json(data);
};

const UpdateProfileInputSchema = InsertUserSchema.pick({
	usuario: true,
	nome: true,
	cpf: true,
	telefone: true,
	avatar_url: true,
	dataNascimento: true,
	localNascimento: true,
	nacionalidade: true,
	estadoCivil: true,
	rg: true,
});
export type TUpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

async function updateProfile({ session, input }: { session: TAuthSession; input: TUpdateProfileInput }) {
	const db = await connectToAdministrationDatabase();
	const colaboradoresCollection = db.collection<TEmployee>("colaboradores");

	const user = await colaboradoresCollection.findOne({ _id: new ObjectId(session.user.id) });
	if (!user) throw new createHttpError.NotFound("Usuário não encontrado.");

	const updateResponse = await colaboradoresCollection.updateOne({ _id: new ObjectId(session.user.id) }, { $set: { ...input } });
	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar perfil.");
	return {
		data: {
			updatedId: session.user.id,
		},
		message: "Perfil atualizado com sucesso !",
	};
}
export type TUpdateProfileOutput = Awaited<ReturnType<typeof updateProfile>>;

const updateProfileRoute: NextApiHandler<TUpdateProfileOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const input = UpdateProfileInputSchema.parse(req.body);
	const data = await updateProfile({ session, input });
	return res.status(200).json(data);
};

export default apiHandler({
	GET: getProfileRoute,
	PUT: updateProfileRoute,
});
