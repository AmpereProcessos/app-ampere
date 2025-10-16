import dayjs from "dayjs";
import type { TProductItem } from "../schemas/crm/kits.schema";
import { TProjectDTO } from "../schemas/projects";
import type { TLocation } from "../schemas/useful";
import { getAgeFromBirthdayDate } from "./dates";
import { isValidNumber } from "./validating";

export function formatDateTimeForInput(value: any) {
	if (!value) return undefined;
	if (Number.isNaN(new Date(value).getMilliseconds())) return undefined;
	return dayjs(value).format("YYYY-MM-DDTHH:mm");
}

export function formatTimeDurationUnit({ value, unit, upperCase }: { value: number; unit: string; upperCase?: boolean }) {
	let returnStr = "";
	if (unit === "DIAS") returnStr = `${value} dia${value > 1 ? "s" : ""}`;
	if (unit === "SEMANAS") returnStr = `${value} semana${value > 1 ? "s" : ""}`;
	if (unit === "MESES") returnStr = `${value} ${value > 1 ? "meses" : "mês"}`;
	if (unit === "ANOS") returnStr = `${value} ano${value > 1 ? "s" : ""}`;
	if (upperCase) return returnStr.toUpperCase();
	return returnStr;
}
export function formatNameAsInitials(name: string) {
	const splittedName = name.replace("-", "").split(" ");
	const firstLetter = splittedName[0][0];
	let secondLetter: string | undefined;
	if (["DE", "DA", "DO", "DOS", "DAS"].includes(splittedName[1])) secondLetter = splittedName[2] ? splittedName[2][0] : "";
	else secondLetter = splittedName[1] ? splittedName[1][0] : "";
	return firstLetter + secondLetter;
}
export function formatDateAsLocale(date: string | Date | null | undefined, showHours = false) {
	if (!date) return null;
	if (showHours) return dayjs(date).format("DD/MM/YYYY HH:mm");
	return dayjs(date).add(3, "hour").format("DD/MM/YYYY");
}
export function formatDateBirthdayAsLocale(date?: string | Date | null, showAge = false) {
	if (!date) return null;
	if (showAge) return `${formatDateAsLocale(date)} (${getAgeFromBirthdayDate(date)} anos)`;
	return formatDateAsLocale(date);
}

export function formatDateTime(value: any) {
	if (!value) return undefined;
	if (Number.isNaN(new Date(value).getMilliseconds())) return undefined;
	return dayjs(value).format("YYYY-MM-DDTHH:mm");
}
export function formatToCEP(value: string) {
	const cep = value
		.replace(/\D/g, "")
		.replace(/(\d{5})(\d)/, "$1-$2")
		.replace(/(-\d{3})\d+?$/, "$1");

	return cep;
}
export function formatToCPForCNPJ(value: string) {
	const cnpjCpf = value.replace(/\D/g, "");

	if (cnpjCpf.length === 11) {
		return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
	}

	return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
}
export function formatToPhone(value: string) {
	if (!value) return "";
	value = value.replace(/\D/g, "");
	value = value.replace(/(\d{2})(\d)/, "($1) $2");
	value = value.replace(/(\d)(\d{4})$/, "$1-$2");
	return value;
}

export function formatStringAsOnlyDigits(s: string) {
	return s.replace(/[^0-9]/g, "");
}
// Retorna sempre a “base” comparável: DDD (2) + últimos 8 dígitos
export function formatPhoneAsBase(phone: string) {
	const d = formatStringAsOnlyDigits(phone);
	if (d.length < 10) return ""; // inválido
	// Se 11 dígitos e tiver '9' logo após o DDD, remove esse '9'
	if (d.length === 11 && d[2] === "9") {
		return d.slice(0, 2) + d.slice(3); // remove o 3º dígito
	}
	// Se 10 dígitos (fixo/antigo), já é a base
	if (d.length === 10) return d;
	// Outros comprimentos: tente usar DDD + últimos 8
	return d.slice(0, 2) + d.slice(-8);
}

export function formatWithoutDiacritics(string: string, useUpperCase?: boolean) {
	if (!useUpperCase) return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return string
		.toUpperCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}
export function formatAsSlug(string: string) {
	return string
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "");
}
export function getProjectNestedFieldValue(project: Record<string, any>, path: string) {
	// @ts-ignore
	return path.split(".").reduce((acc, part) => (acc || acc[part as keyof Record<string, any>]) ?? null, project);
}

export function formatAsNumber(value: unknown) {
	if (isValidNumber(Number(value))) return Number(value) as number;
	return 0;
}

export function formatLocation({
	location,
	includeUf,
	includeCity,
	includeCEP,
}: {
	location: TLocation;
	includeUf?: boolean;
	includeCity?: boolean;
	includeCEP?: boolean;
}) {
	let addressStr = "";
	if (includeCity && location.cidade) addressStr = addressStr + `${location.cidade}`;
	if (includeUf && location.uf) addressStr = location.endereco ? addressStr + ` (${location.uf}), ` : addressStr + ` (${location.uf})`;
	if (!location.endereco && !includeUf && !includeCity) return "";
	if (location.endereco) addressStr = addressStr + location.endereco;
	if (location.numeroOuIdentificador) addressStr = addressStr + `, Nº ${location.numeroOuIdentificador}`;
	if (location.bairro) addressStr = addressStr + `, ${location.bairro}`;
	if (location.latitude) addressStr = addressStr + `, LAT ${location.latitude}`;
	if (location.longitude) addressStr = addressStr + `, LONG ${location.longitude}`;
	if (includeCEP && location.cep) addressStr = addressStr + `, CEP:${location.cep}`;

	addressStr += ".";
	return addressStr.toUpperCase();
}

export function formatProductStr(product: TProductItem, showModel?: boolean) {
	if (showModel) return `${product.qtde}x ${product.modelo} (${product.fabricante})`;
	return `${product.qtde}x ${product.fabricante} ${product.potencia}W`;
}
export function getProductsStr(products: TProductItem[]) {
	let str = "";
	for (let i = 0; i < products.length; i++) {
		if (i < products.length - 1) {
			str = str + `${products[i].qtde}x ${products[i].modelo} (${products[i].potencia}W) & `; // `${products[i].qtde}x PAINÉIS PROMOCIONAIS DE ${products[i].potencia}W & `
		} else {
			str = str + `${products[i].qtde}x ${products[i].modelo} (${products[i].potencia}W)`; //  `${products[i].qtde}x PAINÉIS PROMOCIONAIS DE ${products[i].potencia}W`
		}
	}
	return str;
}
