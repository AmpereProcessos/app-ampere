import type { TExpense } from "@/utils/schemas/expenses";
import axios from "axios";
import { centrosDeCusto } from "../../constants";

export async function insertExpensesFromMaterials({
	warehouseFormId,
	description,
	user,
	projectId,
	projectQtde,
	projectName,
	projectType,
	materialList,
}) {
	try {
		const formattedItems = materialList.map((material) => {
			const qtyTaken = material.qtdeSaida ? material.qtdeSaida : 0;
			const qtyReturned = material.qtdeDevolucao ? material.qtdeDevolucao : 0;
			const qtyDiff = qtyTaken - qtyReturned;
			console.log(material.nome, qtyDiff);
			return {
				idMaterial: material.id, // id do material, se item estocável
				descricao: material.nome, // nome ou descrição do item de custo
				unidade: material.grandeza, // unidade do item
				preco: material.precoUnit, // preco unitário do item
				qtde: qtyDiff, // quantidade de fato utilizada na execução do serviço
			};
		});
		const totalExpend = materialList.reduce((cummulative, current) => {
			const qtyTaken = current.qtdeSaida ? current.qtdeSaida : 0;
			const qtyReturned = current.qtdeDevolucao ? current.qtdeDevolucao : 0;
			const price = current.precoUnit ? current.precoUnit : 0;
			const toSum = price * (qtyTaken - qtyReturned);
			return cummulative + toSum;
		}, 0);
		const costObj = {
			rateio: "CUSTOS DIRETOS",
			categoria: "INSUMOS DE ALMOXARIFADO",
			descricao: description,
			projeto: {
				id: projectId, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
				nome: projectName, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
				identificador: projectQtde, // identificador QTDE do projeto no banco de projetos
				tipo: projectType, // tipo de projeto (ou tipo de serviço) dentro do banco de projetos
			},
			idFormularioAlmoxarifado: warehouseFormId,
			autor: {
				id: user.id, // id do usuário que criou o referente registro de custos
				nome: user.name, // nome do usuário que criou o referente registro de custos
			},
			itens: formattedItems,
			total: totalExpend, // somatória final do objeto de custo
			efetivacao: {
				efetivado: true,
				data: new Date().toISOString(),
			},
			criterioCompetencia: true,
			criterioReferencia: true,
			pagamentos: [],
			dataInsercao: new Date().toISOString(), // data de inserção do documento
		};
		await axios.post("/api/despesas", { data: costObj });

		return "Despesa adicionada com sucesso !";
	} catch (error) {
		return {
			status: "error",
			statusCode: 500,
			message: "Erro ao retornar materiais.",
		};
	}
}
export async function insertExpensesFromPurchaseRequests({
	category,
	user,
	projectId,
	projectQtde,
	projectName,
	projectType,
	competenceCriteria,
	referenceCriteria,
	materialList,
}) {
	// Getting cost apportionment given cost category provided
	const costApportionment = centrosDeCusto.find((x) =>
		x.categorias.some((cat) => {
			return cat.value == category;
		}),
	);
	// Getting material list formatted in expense items format
	const formattedItems = materialList.map((material) => {
		console.log(material);
		return {
			idMaterial: material.id, // id do material, se item estocável
			descricao: material.descricao, // nome ou descrição do item de custo
			unidade: material.grandeza, // unidade do item
			preco: material.preco, // preco unitário do item
			qtde: material.qtde, // quantidade de fato utilizada na execução do serviço
		};
	});
	const totalExpend = materialList.reduce((acc, current) => {
		const qtde = current.qtde ? Number(current.qtde) : 0;
		const price = current.preco ? Number(current.preco) : 0;
		const toSum = qtde * price;
		return acc + toSum;
	}, 0);

	const costObj = {
		rateio: costApportionment?.nome,
		categoria: category,
		descricao: "",
		projeto: {
			id: projectId, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
			nome: projectName, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
			identificador: projectQtde, // identificador QTDE do projeto no banco de projetos
			tipo: projectType, // tipo de projeto (ou tipo de serviço) dentro do banco de projetos
		},

		idFormularioAlmoxarifado: null,
		autor: {
			id: user.id, // id do usuário que criou o referente registro de custos
			nome: user.name, // nome do usuário que criou o referente registro de custos
		},
		itens: formattedItems,
		total: totalExpend, // somatória final do objeto de custo
		efetivacao: {
			efetivado: true,
			data: new Date().toISOString(),
		},
		pagamentos: [],
		criterioCompetencia: competenceCriteria,
		criterioReferencia: referenceCriteria,
		dataInsercao: new Date().toISOString(), // data de inserção do documento
	};
	await axios.post("/api/despesas", { data: costObj });
	return "Despesa gerada com sucesso!";
}
export async function createExpense(info: TExpense) {
	await axios.post("/api/despesas", { data: info });
	return "Despesa adicionada com sucesso !";
}
export async function updateExpense({ id, changes }: { id: string; changes: Partial<TExpense> }) {
	const response = await axios.put(`/api/despesas?id=${id}`, {
		changes,
	});

	return "Objeto de gastos atualizado com sucesso!";
}
