import { getPartnerUsers, getUserById } from "@/repositories/crm-users/queries";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TUser } from "@/utils/schemas/crm/users.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import createHttpError from "http-errors";
import type { Collection } from "mongodb";
import type { NextApiHandler } from "next";

// GET RESPONSE
type GetResponse = {
	data: TUser[] | TUser;
};
const getUsers: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const db = await connectToCRMDatabase();
	const usersCollection: Collection<TUser> = db.collection("users");

	const { id, includeDeleted } = req.query;

	if (id && typeof id === "string") {
		const user = await getUserById({ collection: usersCollection, id: id, query: {} });
		if (!user) throw new createHttpError.NotFound("Nenhum usuário encontrado com o ID fornecido.");
		return res.status(200).json({ data: user });
	}

	const includeDeletedQuery = includeDeleted && includeDeleted === "true" ? {} : { dataExclusao: null };
	const query: Partial<TUser> = { ...includeDeletedQuery };
	const users = await getPartnerUsers({ collection: usersCollection, query: query });
	return res.status(200).json({ data: users });
};

export default apiHandler({
	GET: getUsers,
});
