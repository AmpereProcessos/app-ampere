import { formatToMoney } from "@/utils/constants";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
// @ts-ignore
import numeroPorExtenso from "numero-por-extenso";
import type { TGetContractModelDataParams } from "./index";

dayjs.locale(ptBr);

/**
 * Process a template string and replace variables with actual data
 */
export function processTemplate(template: string, data: TGetContractModelDataParams): string {
	const { customer, system, additionalServices, payment } = data;

	// Helper function to format equipment lists
	const getModulesText = () => {
		const modules = system.equipments?.filter((r) => r.type === "MÓDULO") || [];
		return modules.map((r) => `- ${r.quantity} módulos ${r.model} ${r.power}W`).join("\n");
	};

	const getInvertersText = () => {
		const inverters = system.equipments?.filter((r) => r.type === "INVERSOR") || [];
		return inverters
			.map((r) => `- ${r.quantity} ${system.topology === "INVERSOR" ? "inversores" : "micro-inversores"} ${r.model} ${r.power}W`)
			.join("\n");
	};

	const getModulesWarranty = () => {
		const modules = system.equipments?.filter((r) => r.type === "MÓDULO") || [];
		return modules.reduce((acc, r) => Math.min(acc, r.warranty), Number.POSITIVE_INFINITY);
	};

	const getInvertersWarranty = () => {
		const inverters = system.equipments?.filter((r) => r.type === "INVERSOR") || [];
		return inverters.reduce((acc, r) => Math.min(acc, r.warranty), Number.POSITIVE_INFINITY);
	};

	const getMaritalStatusFormatted = () => {
		const MARITAL_STATUS_MAP = {
			"CASADO(A)": "casado(a)",
			"SOLTEIRO(A)": "solteiro(a)",
			"UNIÃO ESTÁVEL": "em união estável",
			"DIVORCIADO(A)": "divorciado(a)",
			"VIUVO(A)": "viúvo(a)",
		};
		return MARITAL_STATUS_MAP[customer.maritalStatus as keyof typeof MARITAL_STATUS_MAP] || customer.maritalStatus;
	};

	const getResourceSourceFormatted = () => {
		return payment.resourceSource === "OWN" ? "capital próprio" : "financiamento bancário";
	};

	// Create a mapping of variable IDs to their actual values
	const variableMap: Record<string, string> = {
		// Customer
		"customer.name": customer.name,
		"customer.phone": customer.phone,
		"customer.email": customer.email,
		"customer.maritalStatus": getMaritalStatusFormatted(),
		"customer.documents.cpfCnpj": customer.documents.cpfCnpj,
		"customer.documents.rg": customer.documents.rg,
		"customer.location.address": customer.location.address,
		"customer.location.number": customer.location.number,
		"customer.location.complement": customer.location.complement,
		"customer.location.neighborhood": customer.location.neighborhood,
		"customer.location.cep": customer.location.cep,
		"customer.location.city": customer.location.city,
		"customer.location.state": customer.location.state,

		// System
		"system.topology": system.topology,
		"system.totalPower": system.totalPower.toFixed(2),
		"system.installationLocation.address": system.installationLocation.address,
		"system.installationLocation.number": system.installationLocation.number,
		"system.installationLocation.complement": system.installationLocation.complement,
		"system.installationLocation.neighborhood": system.installationLocation.neighborhood,
		"system.installationLocation.cep": system.installationLocation.cep,
		"system.installationLocation.city": system.installationLocation.city,
		"system.installationLocation.state": system.installationLocation.state,
		"system.equipments.modules": getModulesText(),
		"system.equipments.inverters": getInvertersText(),
		"system.equipments.modulesWarranty": getModulesWarranty().toString(),
		"system.equipments.invertersWarranty": getInvertersWarranty().toString(),

		// Payment
		"payment.value": formatToMoney(payment.value),
		"payment.valueInWords": numeroPorExtenso.porExtenso(payment.value, numeroPorExtenso.estilo.monetario),
		"payment.resourceSource": getResourceSourceFormatted(),
		"payment.negotiation": payment.negotiation === "100%" ? "100%" : "80-20",

		// Additional Services
		"additionalServices.serviceEntranceAdequacy": additionalServices.serviceEntranceAdequacy ? "SIM" : "NÃO",
		"additionalServices.structureAdequacy": additionalServices.structureAdequacy ? "SIM" : "NÃO",
		"additionalServices.operationAndMaintenance": additionalServices.operationAndMaintenance ? "SIM" : "NÃO",

		// Company (hardcoded for now - could be moved to config)
		"company.name": "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA",
		"company.cnpj": "27.901.968/0001-45",
		"company.address": "Rua 28, n.º 1842, Centro, CEP 38300-082, Ituiutaba/MG",

		// Dates
		"contract.date": dayjs().format("DD [de] MMMM [de] YYYY"),
		"contract.currentDate": dayjs().format("DD/MM/YYYY"),
	};

	// Replace all variables in the template
	// Supports both {{variableId}} and the Tiptap node format
	let processedTemplate = template;

	// Replace Tiptap variable nodes (HTML format)
	processedTemplate = processedTemplate.replace(/<span[^>]*data-type="variable"[^>]*data-id="([^"]*)"[^>]*>.*?<\/span>/g, (match, variableId) => {
		return variableMap[variableId] || `{{${variableId}}}`;
	});

	// Replace simple {{variableId}} format
	processedTemplate = processedTemplate.replace(/\{\{([^}]+)\}\}/g, (match, variableId) => {
		const trimmedId = variableId.trim();
		return variableMap[trimmedId] || match;
	});

	return processedTemplate;
}

/**
 * Extract variables from a template
 */
export function extractVariablesFromTemplate(template: string): string[] {
	const variables = new Set<string>();

	// Extract from Tiptap variable nodes
	const nodeMatches = template.matchAll(/<span[^>]*data-type="variable"[^>]*data-id="([^"]*)"[^>]*>.*?<\/span>/g);
	for (const match of nodeMatches) {
		variables.add(match[1]);
	}

	// Extract from simple {{variableId}} format
	const simpleMatches = template.matchAll(/\{\{([^}]+)\}\}/g);
	for (const match of simpleMatches) {
		variables.add(match[1].trim());
	}

	return Array.from(variables);
}
