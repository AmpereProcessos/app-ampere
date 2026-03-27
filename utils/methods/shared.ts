import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { orientacoes } from "../constants";
import genFactors from "../jsons/fatores-geracao.json";

export async function getCEPInfo(cep) {
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
    console.log(data.erro);
    if (data.erro) throw new Error("Erro");
    return data;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar informações à partir do CEP.");
    return null;
  }
}

export function isEmpty(value) {
  return value == null || (typeof value === "string" && value.trim().length === 0);
}

export function formatDateInputChange<T extends "date" | "string" | undefined>(
  value: any,
  returnType?: T,
  normalizeHours = true,
): T extends "date" ? Date : string | null {
  if (value === null) return null as any;
  if (Number.isNaN(new Date(value).getMilliseconds())) return null as any;
  if (!returnType || returnType === "string") {
    if (!normalizeHours) return new Date(value).toISOString() as any;
    return dayjs(new Date(value)).add(3, "hours").toISOString() as any;
  }
  if (!normalizeHours) return new Date(value) as any;
  return dayjs(new Date(value)).add(3, "hours").toDate() as any;
}
export function formatDateForInputValue(
  value: Date | string | null | undefined,
  type: "default" | "datetime" = "default",
): string | undefined {
  if (value === "" || value === undefined || value === null) return undefined;
  const date = dayjs(value);
  const yearValue = date.year();
  const monthValue = date.month();
  const dayValue = date.date();

  const year = yearValue.toString().padStart(4, "0");
  const month = (monthValue + 1).toString().padStart(2, "0");
  const day = dayValue.toString().padStart(2, "0");

  if (type === "datetime") {
    const hourValue = date.hour();
    const minuteValue = date.minute();
    const hour = hourValue.toString().padStart(2, "0");
    const minute = minuteValue.toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  return `${year}-${month}-${day}`;
}

export function formatDateOnInputChange<T extends "string" | "date" = "string">(
  value: string | undefined,
  returnType: T = "string" as T,
  type: "natural" | "start" | "end" = "natural",
): T extends "string" ? string | null : Date | null {
  // The value coming from input change can be either string or undefined
  // First, checking if the value is either empty or undefined
  if (value === "" || value === undefined || value === null) return null;

  const isFullISO = value.includes("T") && value.includes("Z");
  const isDateTimeOnly = value.includes("T") && !value.includes("Z");

  // Then, since we know it's not empty, we can define the default date we will be working with
  // If the value includes "T", we can assume it comes with datetime definition, we only complement it with "00.000Z" to make a valid ISO string
  // If not, we define 12:00:00.000Z as "midday" for the coming input date (which already is YYYY-MM-DD)
  const defaultDateStringAsISO = isFullISO
    ? value
    : isDateTimeOnly
      ? new Date(value).toISOString()
      : `${value}T12:00:00.000Z`;

  const isValid = dayjs(defaultDateStringAsISO).isValid();
  if (!isValid) return null;

  if (type === "natural") {
    // If type is natural, we return the default date without any further treatment
    if (returnType === "string")
      return defaultDateStringAsISO as T extends "string" ? string | null : Date | null;
    if (returnType === "date")
      return dayjs(defaultDateStringAsISO).toDate() as T extends "string"
        ? string | null
        : Date | null;
  }

  if (type === "start") {
    if (returnType === "string")
      return dayjs(defaultDateStringAsISO).startOf("day").toISOString() as T extends "string"
        ? string | null
        : Date | null;
    if (returnType === "date")
      return dayjs(defaultDateStringAsISO).startOf("day").toDate() as T extends "string"
        ? string | null
        : Date | null;
  }

  if (type === "end") {
    if (returnType === "string")
      return dayjs(defaultDateStringAsISO).endOf("day").toISOString() as T extends "string"
        ? string | null
        : Date | null;
    if (returnType === "date")
      return dayjs(defaultDateStringAsISO).endOf("day").toDate() as T extends "string"
        ? string | null
        : Date | null;
  }

  return null;
}

export function pushToAuthPage(router) {
  router.push("/auth/signin");
}
export function getGenFactorByOrientation({ city, uf, orientation }) {
  if (!city || !uf) return 127;
  var cityFactor = genFactors.find((genFactor) => genFactor.CIDADE == city && genFactor.UF == uf);
  if (!cityFactor) return 127;

  // Checking for existing orientations
  if (orientation && orientacoes.includes(orientation)) return cityFactor[orientation];
  // In case no orientation or invalid orientation is provided, returning annual generation factor
  else return cityFactor.ANUAL;
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1);
}
export function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0);
}

export type TMutationCallbacks = {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};
