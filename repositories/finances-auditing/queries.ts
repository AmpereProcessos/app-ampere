import type { ExpenseRevenueList, TProjectFinances } from "@/pages/api/stats/financial-auditing";
import type { TExpense } from "@/utils/schemas/expenses";
import { type TProject, TProjectDTO, TProjectEntity } from "@/utils/schemas/projects";
import { TMonitoringPropose } from "@/utils/schemas/proposes/monitoring.schema";
import type { TSolarSystemPropose } from "@/utils/schemas/proposes/solar-system.schema";
import createHttpError from "http-errors";
import { type Collection, ObjectId, type WithId } from "mongodb";

const PriceDescription = {
	kit: "KIT FOTOVOLTAICO",
	instalacao: "INSTALAÇÃO",
	maoDeObra: "MÃO DE OBRA",
	projeto: "CUSTOS DE PROJETO",
	venda: "CUSTOS DE VENDA",
	padrao: "ADEQUAÇÕES DE PADRÃO",
	estrutura: "ADEQUAÇÕES DE ESTRUTURA",
	extra: "OUTROS SERVIÇOS",
};
type GetFinancesByProjectIdParams = {
	projectId: string;
	projectsCollection: Collection<TProject>;
	expensesCollection: Collection<TExpense>;
	proposesCollection: Collection<TSolarSystemPropose>;
};
const projection = {
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
	"sistema.valorProjeto": 1,
	"sistema.topologia": 1,
	"sistema.qtdeModulos": 1,
	"sistema.potPico": 1,
	"padrao.valor": 1,
	"estruturaPersonalizada.valor": 1,
};
export async function getFinancesByProjectId({
	projectId,
	projectsCollection,
	expensesCollection,
	proposesCollection,
}: GetFinancesByProjectIdParams) {
	const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) }, { projection: projection });
	if (!project) throw createHttpError.NotFound("Projeto não encontrado.");
	const projectExpenses = await expensesCollection.find({ "projeto.id": projectId }).toArray();
	let propose: WithId<TSolarSystemPropose> | null = null;
	if (project.idPropostaCRM) propose = await proposesCollection.findOne({ _id: new ObjectId(project.idPropostaCRM) });

	// Defining project info]
	const _id = project._id.toString();
	const nome = project.nomeDoContrato;
	const potencia = project.sistema.potPico;
	const tipoDeServico = project.tipoDeServico;
	const cidade = project.cidade;
	const vendedor = project.vendedor.nome;
	const dataAssinatura = project.contrato.dataAssinatura;
	const dataConclusaoObra = project.obra.saida;
	const topologia = project.sistema.topologia || "";
	const qtdeModulos = project.sistema.qtdeModulos || 0;
	const idProjetoCRM = project.idProjetoCRM || "";
	const idPropostaCRM = project.idPropostaCRM || "";
	const identificador = project.codigoSVB || "";

	const systemRevenue = project.sistema.valorProjeto;
	const energyPaRevenue = project.padrao.valor || 0;
	const structureRevenue = project.estruturaPersonalizada.valor || 0;
	const saleTotal = systemRevenue + energyPaRevenue + structureRevenue;

	const sellerComission = project.comissoes?.porcentagemVendedor || 0;
	const insiderComission = project.comissoes?.porcentagemInsider || 0;
	const totalComissionPercentage = sellerComission + insiderComission + 0.75; // 0.75 for managers
	// Formatting project expenses
	const expenses: ExpenseRevenueList = projectExpenses.map((expense) => {
		return {
			id: expense._id.toString(),
			categoria: expense.categoria,
			itens: expense.itens,
			total: expense.total,
			autor: {
				id: expense.autor.id,
				nome: expense.autor.nome,
				avatar_url: expense.autor.avatar_url,
			},
			dataInsercao: expense.dataInsercao,
		};
	});

	// Getting expenses prevision
	const pricingPreview = project.tipoDeServico === "SISTEMA FOTOVOLTAICO" ? propose?.precificacao || undefined : undefined;
	// Pushing cost of the kit generator, if it exists
	const kitCost = project.compra.valorDoKit || 0;
	const transportationCost = project.compra.valorFrete || 0;
	if (kitCost)
		expenses.push({
			id: undefined,
			categoria: "CUSTO DO KIT GERADOR",
			itens: [],
			total: kitCost,
			autor: { id: "N/A", nome: "AUTOMÁTICO", avatar_url: null },
			dataInsercao: "",
		});
	if (transportationCost)
		expenses.push({
			id: undefined,
			categoria: "CUSTO DO FRETE",
			itens: [],
			total: transportationCost,
			autor: { id: "N/A", nome: "AUTOMÁTICO", avatar_url: null },
			dataInsercao: "",
		});

	// Pushing comission costs, if they exist
	const totalComissionCost = project.comissoes?.comissionados?.reduce((acc, current) => acc + (current.valor || 0), 0) || 0;
	if (totalComissionCost)
		expenses.push({
			id: undefined,
			categoria: "COMISSÕES",
			itens: [],
			total: totalComissionCost,
			autor: { id: "N/A", nome: "AUTOMÁTICO", avatar_url: null },
			dataInsercao: "",
		});

	// Formatting project revenues
	const revenues: ExpenseRevenueList = [];
	if (systemRevenue)
		revenues.push({
			categoria: tipoDeServico,
			itens: [],
			total: systemRevenue,
			autor: { id: "N/A", nome: "AUTOMÁTICO", avatar_url: null },
			dataInsercao: "",
		});
	if (energyPaRevenue)
		revenues.push({
			categoria: "PADRÃO DE ENERGIA",
			itens: [],
			total: energyPaRevenue,
			autor: { id: "N/A", nome: "AUTOMÁTICO", avatar_url: null },
			dataInsercao: "",
		});
	if (structureRevenue)
		revenues.push({
			categoria: "ESTRUTURA",
			itens: [],
			total: structureRevenue,
			autor: { id: "N/A", nome: "AUTOMÁTICO", avatar_url: null },
			dataInsercao: "",
		});

	const projectFinances: TProjectFinances = {
		_id,
		nome,
		potencia,
		identificador,
		idProjetoCRM,
		idPropostaCRM,
		cidade,
		vendedor,
		topologia,
		qtdeModulos,
		dataAssinatura,
		dataConclusaoObra,
		previsaoDespesas: pricingPreview,
		despesas: {},
		despesasLista: expenses,
		receitas: {},
		receitasLista: revenues,
	};
	return projectFinances;
}
