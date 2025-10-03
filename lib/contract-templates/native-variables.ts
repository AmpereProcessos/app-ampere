const NATIVE_VARIABLES = [
	{
		id: "68debe9ee3a025351eb1df77",
		title: "NOME DO CLIENTE",
		identifier: "nome-do-cliente" as const,
	},
	{
		id: "68debe9ee3a025351eb1df78",
		title: "TELEFONE DO CLIENTE",
		identifier: "telefone-do-cliente" as const,
	},
	{
		id: "68debe9ee3a025351eb1df79",
		title: "EMAIL DO CLIENTE",
		identifier: "email-do-cliente" as const,
	},
	{
		id: "68debe9ee3a025351eb1df7a",
		title: "ESTADO CIVIL",
		identifier: "estado-civil" as const,
	},
	{
		id: "68debe9ee3a025351eb1df7b",
		title: "CPF/CNPJ",
		identifier: "cpfcnpj" as const,
	},
	{
		id: "68debe9ee3a025351eb1df7c",
		title: "RG",
		identifier: "rg" as const,
	},
	{
		id: "68debe9ee3a025351eb1df7d",
		title: "ENDEREÇO",
		identifier: "endereco" as const,
	},
	{
		id: "68debe9ee3a025351eb1df7e",
		title: "NÚMERO DO ENDEREÇO",
		identifier: "numero-do-endereco" as const,
	},
	{
		id: "68debe9ee3a025351eb1df7f",
		title: "COMPLEMENTO",
		identifier: "complemento" as const,
	},
	{
		id: "68debe9ee3a025351eb1df80",
		title: "BAIRRO",
		identifier: "bairro" as const,
	},
	{
		id: "68debe9ee3a025351eb1df81",
		title: "CEP",
		identifier: "cep" as const,
	},
	{
		id: "68debe9ee3a025351eb1df82",
		title: "CIDADE",
		identifier: "cidade" as const,
	},
	{
		id: "68debe9ee3a025351eb1df83",
		title: "ESTADO",
		identifier: "estado" as const,
	},
	{
		id: "68debe9ee3a025351eb1df84",
		title: "TOPOLOGIA DO SISTEMA",
		identifier: "topologia-do-sistema" as const,
	},
	{
		id: "68debe9ee3a025351eb1df85",
		title: "POTÊNCIA TOTAL",
		identifier: "potencia-total" as const,
	},
	{
		id: "68debe9ee3a025351eb1df86",
		title: "ENDEREÇO DE INSTALAÇÃO",
		identifier: "endereco-de-instalacao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df87",
		title: "NÚMERO (INSTALAÇÃO)",
		identifier: "numero-instalacao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df88",
		title: "BAIRRO (INSTALAÇÃO)",
		identifier: "bairro-instalacao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df89",
		title: "CEP (INSTALAÇÃO)",
		identifier: "cep-instalacao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df8a",
		title: "CIDADE (INSTALAÇÃO)",
		identifier: "cidade-instalacao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df8b",
		title: "ESTADO (INSTALAÇÃO)",
		identifier: "estado-instalacao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df8c",
		title: "LISTA DE MÓDULOS",
		identifier: "lista-de-modulos" as const,
	},
	{
		id: "68debe9ee3a025351eb1df8d",
		title: "LISTA DE INVERSORES",
		identifier: "lista-de-inversores" as const,
	},
	{
		id: "68debe9ee3a025351eb1df8e",
		title: "GARANTIA DOS MÓDULOS",
		identifier: "garantia-dos-modulos" as const,
	},
	{
		id: "68debe9ee3a025351eb1df8f",
		title: "GARANTIA DOS INVERSORES",
		identifier: "garantia-dos-inversores" as const,
	},
	{
		id: "68debe9ee3a025351eb1df90",
		title: "VALOR TOTAL",
		identifier: "valor-total" as const,
	},
	{
		id: "68debe9ee3a025351eb1df91",
		title: "VALOR POR EXTENSO",
		identifier: "valor-por-extenso" as const,
	},
	{
		id: "68debe9ee3a025351eb1df92",
		title: "ORIGEM DO RECURSO",
		identifier: "origem-do-recurso" as const,
	},
	{
		id: "68debe9ee3a025351eb1df93",
		title: "FORMA DE NEGOCIAÇÃO",
		identifier: "forma-de-negociacao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df94",
		title: "ADEQUAÇÃO DE PADRÃO",
		identifier: "adequacao-de-padrao" as const,
	},
	{
		id: "68debe9ee3a025351eb1df95",
		title: "ADEQUAÇÃO DE ESTRUTURA",
		identifier: "adequacao-de-estrutura" as const,
	},
	{
		id: "68debe9ee3a025351eb1df97",
		title: "NOME DA EMPRESA",
		identifier: "nome-da-empresa" as const,
	},
	{
		id: "68debe9ee3a025351eb1df98",
		title: "CNPJ DA EMPRESA",
		identifier: "cnpj-da-empresa" as const,
	},
	{
		id: "68debe9ee3a025351eb1df99",
		title: "ENDEREÇO DA EMPRESA",
		identifier: "endereco-da-empresa" as const,
	},
	{
		id: "68debe9ee3a025351eb1df9a",
		title: "DATA DO CONTRATO",
		identifier: "data-do-contrato" as const,
	},
	{
		id: "68debe9ee3a025351eb1df9b",
		title: "DATA ATUAL",
		identifier: "data-atual" as const,
	},
];
export type TNativeVariable = (typeof NATIVE_VARIABLES)[number];

export function getNativeVariableByIdentifier(identifier: TNativeVariable["identifier"]): TNativeVariable["id"] {
	const nativeVariable = NATIVE_VARIABLES.find((variable) => variable.identifier === identifier);
	if (!nativeVariable) throw new Error(`Native variable not found for identifier: ${identifier}`);
	return nativeVariable.id;
}
