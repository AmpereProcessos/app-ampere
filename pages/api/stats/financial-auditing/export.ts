import { getFinancesByProjectId } from "@/repositories/finances-auditing/queries";
import { apiHandler } from "@/utils/api";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { TExpense } from "@/utils/schemas/expenses";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import type { TSolarSystemPropose } from "@/utils/schemas/proposes/solar-system.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { type Collection, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

type PartialTProject = Pick<
	TProjectDTO,
	| "_id"
	| "nomeDoContrato"
	| "tipoDeServico"
	| "contrato"
	| "comissoes"
	| "compra"
	| "cidade"
	| "vendedor"
	| "obra"
	| "sistema"
	| "padrao"
	| "estruturaPersonalizada"
	| "codigoSVB"
	| "idProjetoCRM"
	| "idPropostaCRM"
>;

const DatetimeStringSchema = z
	.string({ required_error: "Parâmetro de data não fornecido.", invalid_type_error: "Tipo inválido para o parâmetro de data." })
	.datetime({ message: "Formato inválido para parâmetro de data." });

const FieldStringSchema = z.string({ required_error: "Campo de filtro não fornecido.", invalid_type_error: "Tipo inválido para o campo de filtro." });

type FlatFinancialExportRow = {
	NOME: string;
	IDENTIFICADOR: string | number;
	"ID DO PROJETO CRM": string;
	"ID DA PROPOSTA CRM": string;
	"POTÊNCIA (kWp)": number;
	CIDADE: string;
	VENDEDOR: string;
	TOPOLOGIA: string;
	"QTDE MÓDULOS": number;
	"DATA ASSINATURA": string;
	"DATA CONCLUSÃO OBRA": string;
	"TOTAL RECEITAS": number;
	"TOTAL DESPESAS": number;
	RESULTADO: number;
	"MARGEM (%)": number;
	[key: string]: string | number;
};

const getExport: NextApiHandler<FlatFinancialExportRow[]> = async (req, res) => {
	const { after, before, field, projectTypes } = req.query;

	const db = await connectToDatabase();
	const crmDb = await connectToCRMDatabase();

	const projectsCollection: Collection<TProject> = db.collection("dados");
	const expensesCollection: Collection<TExpense> = db.collection("despesas");
	const proposesCollection: Collection<TSolarSystemPropose> = crmDb.collection("proposes");

	// Validate query parameters
	const validatedAfter = DatetimeStringSchema.parse(after);
	const validatedBefore = DatetimeStringSchema.parse(before);
	const validatedField = FieldStringSchema.parse(field);
	const validatedProjectTypes = z
		.string({ required_error: "Tipos de projetos não fornecidos.", invalid_type_error: "Tipo inválido para os tipos de projetos." })
		.transform((value) => value.split(","))
		.parse(projectTypes)
		.filter((type) => type.trim().length > 0);

	const periodQuery = { [validatedField]: { $gte: validatedAfter, $lte: validatedBefore } };
	const projectTypesQuery = validatedProjectTypes.length > 0 ? { tipoDeServico: { $in: validatedProjectTypes } } : {};
	const query = { ...periodQuery, ...projectTypesQuery };

	console.log("[INFO] [GET_FINANCIAL_AUDITING_EXPORT] [QUERY]", JSON.stringify(query, null, 2));

	const projects = (await projectsCollection
		.aggregate([
			{
				$match: query,
			},
			{
				$project: {
					_id: 1,
					nomeDoContrato: 1,
					codigoSVB: 1,
					idProjetoCRM: 1,
					idPropostaCRM: 1,
					tipoDeServico: 1,
					"contrato.dataAssinatura": 1,
					"obra.saida": 1,
					cidade: 1,
					"vendedor.nome": 1,
					comissoes: 1,
					"compra.valorDoKit": 1,
					"compra.valorFrete": 1,
					"sistema.valorProjeto": 1,
					"sistema.topologia": 1,
					"sistema.qtdeModulos": 1,
					"sistema.potPico": 1,
					"padrao.valor": 1,
					"estruturaPersonalizada.valor": 1,
				},
			},
			{
				$sort: {
					[validatedField]: -1,
				},
			},
		])
		.toArray()) as PartialTProject[];

	const projectIds = projects.map((project) => project._id.toString());
	const expenses = await expensesCollection.find({ "projeto.id": { $in: projectIds } }).toArray();

	const flatExportData: FlatFinancialExportRow[] = projects.map((project) => {
		// Defining project info
		const nome = project.nomeDoContrato;
		const potencia = project.sistema.potPico;
		const tipoDeServico = project.tipoDeServico;
		const dataAssinatura = project.contrato.dataAssinatura;
		const dataConclusaoObra = project.obra.saida;
		const cidade = project.cidade;
		const vendedor = project.vendedor.nome;
		const topologia = project.sistema.topologia || "NÃO DEFINIDO";
		const qtdeModulos = project.sistema.qtdeModulos || 0;
		const idProjetoCRM = project.idProjetoCRM || "";
		const idPropostaCRM = project.idPropostaCRM || "";
		const identificador = project.codigoSVB || "";

		// Formatting the project expenses
		const projectExpenses = expenses.filter((exp) => exp.projeto?.id === project._id.toString());
		const kitCost = project.compra.valorDoKit || 0;

		const expensesFormatted = projectExpenses.reduce(
			(acc: { [key: string]: number }, current) => {
				const expenseCategory = current.categoria;
				const expenseTotal = current.total;
				if (!acc[expenseCategory]) acc[expenseCategory] = expenseTotal;
				else acc[expenseCategory] += expenseTotal;
				return acc;
			},
			{ "CUSTO DO KIT GERADOR": kitCost, "CUSTO DO FRETE": project.compra.valorFrete || 0 },
		);

		// Formatting the project revenues
		const systemRevenue = project.sistema.valorProjeto;
		const energyPaRevenue = project.padrao.valor || 0;
		const structureRevenue = project.estruturaPersonalizada.valor || 0;
		const revenuesFormatted: { [key: string]: number } = {
			[tipoDeServico]: systemRevenue,
			"PADRÃO DE ENERGIA": energyPaRevenue,
			ESTRUTURA: structureRevenue,
		};

		const totalComissionCost = project.comissoes?.comissionados?.reduce((acc, current) => acc + (current.valor || 0), 0) || 0;
		expensesFormatted.COMISSÕES = totalComissionCost;

		// Calculate totals
		const totalRevenues = Object.values(revenuesFormatted).reduce((acc, current) => acc + current, 0);
		const totalExpenses = Object.values(expensesFormatted).reduce((acc, current) => acc + current, 0);
		const result = totalRevenues - totalExpenses;
		const margin = totalRevenues > 0 ? (result * 100) / totalRevenues : 0;

		// Build flat object with base fields
		const flatRow: FlatFinancialExportRow = {
			NOME: nome,
			IDENTIFICADOR: identificador,
			"ID DO PROJETO CRM": idProjetoCRM,
			"ID DA PROPOSTA CRM": idPropostaCRM,
			"POTÊNCIA (kWp)": potencia,
			CIDADE: cidade,
			VENDEDOR: vendedor,
			TOPOLOGIA: topologia,
			"QTDE MÓDULOS": qtdeModulos,
			"DATA ASSINATURA": formatDateAsLocale(dataAssinatura) || "",
			"DATA CONCLUSÃO OBRA": formatDateAsLocale(dataConclusaoObra) || "",
			"TOTAL RECEITAS": totalRevenues,
			"TOTAL DESPESAS": totalExpenses,
			RESULTADO: result,
			"MARGEM (%)": margin,
			RECEITAS: Object.entries(revenuesFormatted)
				.map(([key, value]) => `${key}: ${value}`)
				.join(", \n"),
			DESPESAS: Object.entries(expensesFormatted)
				.map(([key, value]) => `${key}: ${value}`)
				.join(", \n"),
		};

		return flatRow;
	});

	return res.json(flatExportData);
};

export default apiHandler({
	GET: getExport,
});
