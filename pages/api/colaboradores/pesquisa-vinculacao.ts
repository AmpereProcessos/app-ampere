import { apiHandler } from "@/utils/api";
import { formatToCPForCNPJ } from "@/utils/methods/formatting";
import type { TEmployee } from "@/utils/schemas/users";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import type { Collection } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

const EmployeeSearchQueryParams = z.object({
	cpf: z.string({ required_error: "O CPF é obrigatório." }),
	email: z.string({ required_error: "O email é obrigatório." }),
});

export type TEmployeeSearchInput = z.infer<typeof EmployeeSearchQueryParams>;

async function getEmployeeBySearch({ input }: { input: TEmployeeSearchInput }) {
	const { cpf, email } = input;

	const formattedCpf = formatToCPForCNPJ(cpf);

	console.log("CPF SIZE", formattedCpf?.trim().length);
	if (formattedCpf?.trim().length !== 14 && email.trim().length === 0) throw new createHttpError.BadRequest("CPF ou email inválidos.");

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TEmployee> = db.collection("colaboradores");

	if (formattedCpf && email) {
		console.log(`[INFO] [GET EMPLOYEE BY SEARCH] Searching by CPF ${formattedCpf} and email ${email}`);
		const user = await usersCollection.findOne({ cpf: formattedCpf, email });
		if (!user) throw new createHttpError.NotFound("Colaborador não encontrado.");
		return {
			data: {
				id: user._id.toString(),
				nome: user.nome,
				email: user.email,
				avatar_url: user.avatar_url,
				telefone: user.telefone,
				cpf: user.cpf,
			},
		};
	}

	if (formattedCpf) {
		console.log(`[INFO] [GET EMPLOYEE BY SEARCH] Searching by CPF ${formattedCpf}`);
		const user = await usersCollection.findOne({ cpf: formattedCpf });
		if (!user) throw new createHttpError.NotFound("Colaborador não encontrado.");
		return {
			data: {
				id: user._id.toString(),
				nome: user.nome,
				email: user.email,
				avatar_url: user.avatar_url,
				telefone: user.telefone,
				cpf: user.cpf,
			},
		};
	}

	if (email) {
		console.log(`[INFO] [GET EMPLOYEE BY SEARCH] Searching by email ${email}`);
		const user = await usersCollection.findOne({ email });
		if (!user) throw new createHttpError.NotFound("Colaborador não encontrado.");
		return {
			data: {
				id: user._id.toString(),
				nome: user.nome,
				email: user.email,
				avatar_url: user.avatar_url,
				telefone: user.telefone,
				cpf: user.cpf,
			},
		};
	}

	throw new createHttpError.NotFound("Colaborador não encontrado.");
}

export type TEmployeeSearchOutput = Awaited<ReturnType<typeof getEmployeeBySearch>>;

const getEmployeeSearchRoute: NextApiHandler<TEmployeeSearchOutput> = async (req, res) => {
	const input = EmployeeSearchQueryParams.parse(req.query);
	const employee = await getEmployeeBySearch({ input });
	return res.status(200).json(employee);
};

export default apiHandler({
	GET: getEmployeeSearchRoute,
});
