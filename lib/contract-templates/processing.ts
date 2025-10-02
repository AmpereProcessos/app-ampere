export const CONTRACT_TEMPLATE_VARIABLES_PREVIEW = [
	{ id: "68debe9ee3a025351eb1df77", value: "João da Silva" },
	{ id: "68debe9ee3a025351eb1df78", value: "(34) 99999-9999" },
	{ id: "68debe9ee3a025351eb1df79", value: "joao@example.com" },
	{ id: "68debe9ee3a025351eb1df7a", value: "CASADO(A)" },
	{ id: "68debe9ee3a025351eb1df7b", value: "123.456.789-00" },
	{ id: "68debe9ee3a025351eb1df7c", value: "MG-12.345.678" },
	{ id: "68debe9ee3a025351eb1df7d", value: "Rua das Flores" },
	{ id: "68debe9ee3a025351eb1df7e", value: "123" },
	{ id: "68debe9ee3a025351eb1df7f", value: "Apto 45" },
	{ id: "68debe9ee3a025351eb1df80", value: "Centro" },
	{ id: "68debe9ee3a025351eb1df81", value: "38300-000" },
	{ id: "68debe9ee3a025351eb1df82", value: "Ituiutaba" },
	{ id: "68debe9ee3a025351eb1df83", value: "MG" },
	{ id: "68debe9ee3a025351eb1df84", value: "INVERSOR" },
	{ id: "68debe9ee3a025351eb1df85", value: "5.4" },
	{ id: "68debe9ee3a025351eb1df86", value: "Rua das Flores" },
	{ id: "68debe9ee3a025351eb1df87", value: "123" },
	{ id: "68debe9ee3a025351eb1df88", value: "Centro" },
	{ id: "68debe9ee3a025351eb1df89", value: "38300-000" },
	{ id: "68debe9ee3a025351eb1df8a", value: "Ituiutaba" },
	{ id: "68debe9ee3a025351eb1df8b", value: "MG" },
	{ id: "68debe9ee3a025351eb1df8c", value: "- 12 módulos Canadian Solar 450W" },
	{ id: "68debe9ee3a025351eb1df8d", value: "- 1 inversor Growatt 5000W" },
	{ id: "68debe9ee3a025351eb1df8e", value: "25 anos" },
	{ id: "68debe9ee3a025351eb1df8f", value: "10 anos" },
	{ id: "68debe9ee3a025351eb1df90", value: "R$ 28.000,00" },
	{ id: "68debe9ee3a025351eb1df91", value: "vinte e oito mil reais" },
	{ id: "68debe9ee3a025351eb1df92", value: "Recursos próprios" },
	{ id: "68debe9ee3a025351eb1df93", value: "80-20" },
	{ id: "68debe9ee3a025351eb1df94", value: "Sim" },
	{ id: "68debe9ee3a025351eb1df95", value: "Não" },
	{ id: "68debe9ee3a025351eb1df97", value: "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA" },
	{ id: "68debe9ee3a025351eb1df98", value: "27.901.968/0001-45" },
	{ id: "68debe9ee3a025351eb1df99", value: "Rua 28, nº 1842, Centro, Ituiutaba/MG" },
	{ id: "68debe9ee3a025351eb1df9a", value: "01/01/2024" },
	{ id: "68debe9ee3a025351eb1df9b", value: "10/06/2024" },
	{ id: "68dec6c5e3a025351eb1df9c", value: "" },
	{ id: "68dec748e3a025351eb1df9d", value: "" },
];

type TGetTemplateProcessedParams = {
	templateContent: string;
	variables: {
		id: string;
		value: string;
	}[];
};
export function getTemplateProcessed({ templateContent, variables }: TGetTemplateProcessedParams) {
	let processedTemplate = templateContent;

	// Replace Tiptap variable nodes (HTML format)
	processedTemplate = processedTemplate.replace(/<span[^>]*data-type="variable"[^>]*data-id="([^"]*)"[^>]*>.*?<\/span>/g, (match, variableId) => {
		const variableData = variables.find((v) => v.id === variableId);
		return variableData?.value || "";
	});

	// Replace simple {{variableId}} format
	processedTemplate = processedTemplate.replace(/\{\{([^}]+)\}\}/g, (match, variableId) => {
		const variableData = variables.find((v) => v.id === variableId);
		return variableData?.value || "";
	});

	// Return the processed template
	return processedTemplate;
}
