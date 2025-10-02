// Define all available contract variables
export type ContractVariable = {
	id: string;
	label: string;
	category: string;
	description?: string;
};

export const contractVariables: ContractVariable[] = [
	// Customer Information
	{
		id: "customer.name",
		label: "NOME DO CLIENTE",
		category: "Cliente",
		description: "Nome completo do cliente/contratante",
	},
	{
		id: "customer.phone",
		label: "TELEFONE DO CLIENTE",
		category: "Cliente",
		description: "Número de telefone do cliente",
	},
	{
		id: "customer.email",
		label: "EMAIL DO CLIENTE",
		category: "Cliente",
		description: "Endereço de email do cliente",
	},
	{
		id: "customer.maritalStatus",
		label: "ESTADO CIVIL",
		category: "Cliente",
		description: "Estado civil do cliente",
	},
	{
		id: "customer.documents.cpfCnpj",
		label: "CPF/CNPJ",
		category: "Cliente",
		description: "CPF ou CNPJ do cliente",
	},
	{
		id: "customer.documents.rg",
		label: "RG",
		category: "Cliente",
		description: "RG do cliente",
	},
	{
		id: "customer.location.address",
		label: "ENDEREÇO",
		category: "Cliente",
		description: "Endereço de cobrança do cliente",
	},
	{
		id: "customer.location.number",
		label: "NÚMERO DO ENDEREÇO",
		category: "Cliente",
	},
	{
		id: "customer.location.complement",
		label: "COMPLEMENTO",
		category: "Cliente",
	},
	{
		id: "customer.location.neighborhood",
		label: "BAIRRO",
		category: "Cliente",
	},
	{
		id: "customer.location.cep",
		label: "CEP",
		category: "Cliente",
	},
	{
		id: "customer.location.city",
		label: "CIDADE",
		category: "Cliente",
	},
	{
		id: "customer.location.state",
		label: "ESTADO",
		category: "Cliente",
	},

	// System Information
	{
		id: "system.topology",
		label: "TOPOLOGIA DO SISTEMA",
		category: "Sistema",
		description: "Tipo de inversor (INVERSOR ou MICRO-INVERSOR)",
	},
	{
		id: "system.totalPower",
		label: "POTÊNCIA TOTAL",
		category: "Sistema",
		description: "Potência total instalada em kWp",
	},
	{
		id: "system.installationLocation.address",
		label: "ENDEREÇO DE INSTALAÇÃO",
		category: "Sistema",
	},
	{
		id: "system.installationLocation.number",
		label: "NÚMERO (INSTALAÇÃO)",
		category: "Sistema",
	},
	{
		id: "system.installationLocation.neighborhood",
		label: "BAIRRO (INSTALAÇÃO)",
		category: "Sistema",
	},
	{
		id: "system.installationLocation.cep",
		label: "CEP (INSTALAÇÃO)",
		category: "Sistema",
	},
	{
		id: "system.installationLocation.city",
		label: "CIDADE (INSTALAÇÃO)",
		category: "Sistema",
	},
	{
		id: "system.installationLocation.state",
		label: "ESTADO (INSTALAÇÃO)",
		category: "Sistema",
	},
	{
		id: "system.equipments.modules",
		label: "LISTA DE MÓDULOS",
		category: "Sistema",
		description: "Lista formatada dos módulos fotovoltaicos",
	},
	{
		id: "system.equipments.inverters",
		label: "LISTA DE INVERSORES",
		category: "Sistema",
		description: "Lista formatada dos inversores",
	},
	{
		id: "system.equipments.modulesWarranty",
		label: "GARANTIA DOS MÓDULOS",
		category: "Sistema",
		description: "Garantia mínima dos módulos em anos",
	},
	{
		id: "system.equipments.invertersWarranty",
		label: "GARANTIA DOS INVERSORES",
		category: "Sistema",
		description: "Garantia mínima dos inversores em anos",
	},

	// Payment Information
	{
		id: "payment.value",
		label: "VALOR TOTAL",
		category: "Pagamento",
		description: "Valor total do contrato",
	},
	{
		id: "payment.valueInWords",
		label: "VALOR POR EXTENSO",
		category: "Pagamento",
		description: "Valor total do contrato escrito por extenso",
	},
	{
		id: "payment.resourceSource",
		label: "ORIGEM DO RECURSO",
		category: "Pagamento",
		description: "Forma de pagamento (capital próprio ou financiamento)",
	},
	{
		id: "payment.negotiation",
		label: "FORMA DE NEGOCIAÇÃO",
		category: "Pagamento",
		description: "100% ou 80-20",
	},

	// Additional Services
	{
		id: "additionalServices.serviceEntranceAdequacy",
		label: "ADEQUAÇÃO DE ENTRADA",
		category: "Serviços Adicionais",
	},
	{
		id: "additionalServices.structureAdequacy",
		label: "ADEQUAÇÃO DE ESTRUTURA",
		category: "Serviços Adicionais",
	},
	{
		id: "additionalServices.operationAndMaintenance",
		label: "OPERAÇÃO E MANUTENÇÃO",
		category: "Serviços Adicionais",
	},

	// Company Information
	{
		id: "company.name",
		label: "NOME DA EMPRESA",
		category: "Empresa",
	},
	{
		id: "company.cnpj",
		label: "CNPJ DA EMPRESA",
		category: "Empresa",
	},
	{
		id: "company.address",
		label: "ENDEREÇO DA EMPRESA",
		category: "Empresa",
	},

	// Date
	{
		id: "contract.date",
		label: "DATA DO CONTRATO",
		category: "Contrato",
		description: "Data de geração do contrato",
	},
	{
		id: "contract.currentDate",
		label: "DATA ATUAL",
		category: "Contrato",
	},
];

// Group variables by category
export const getVariablesByCategory = () => {
	const grouped: Record<string, ContractVariable[]> = {};

	contractVariables.forEach((variable) => {
		if (!grouped[variable.category]) {
			grouped[variable.category] = [];
		}
		grouped[variable.category].push(variable);
	});

	return grouped;
};

// Get variable by id
export const getVariableById = (id: string) => {
	return contractVariables.find((v) => v.id === id);
};
