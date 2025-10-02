import dayjs, { type ManipulateType } from "dayjs";
import { formatDecimalPlaces } from "../constants";
import type { TTimeUnitEnum } from "../schemas/crm/enum.schema";

export function getAgeFromBirthdayDate(date: string | Date) {
	const age = dayjs().diff(date, "years");
	return age;
}

export function getFirstDayOfYearString({ year, resetHour = true }: { year?: number; resetHour?: boolean }) {
	let currentDate = dayjs();
	if (year) currentDate = currentDate.set("year", year);
	let firstDay = currentDate.startOf("year");
	if (resetHour) firstDay = firstDay.subtract(3, "hour");
	return firstDay.toISOString();
}
export function getFirstDayOfMonth({ year, month, resetHour = true }: { year?: number; month?: number; resetHour?: boolean }) {
	let currentDate = dayjs();
	if (year) currentDate = currentDate.set("year", year);
	if (month) currentDate = currentDate.set("month", month - 1);
	let firstDay = currentDate.startOf("month");
	if (resetHour) firstDay = firstDay.subtract(3, "hour");
	return firstDay.toISOString();
}
export function getLastDayOfMonth({ year, month, resetHour = true }: { year?: number; month?: number; resetHour?: boolean }) {
	let currentDate = dayjs();
	if (year) currentDate = currentDate.set("year", year);
	if (month) currentDate = currentDate.set("month", month - 1);
	let firstDay = currentDate.endOf("month");
	if (resetHour) firstDay = firstDay.subtract(3, "hour");
	return firstDay.toISOString();
}

export function getArrOfYearsBetweenYears({ initialYear, endYear }: { initialYear: number; endYear: number }) {
	const arr = Array.from({ length: endYear - initialYear + 1 }, (_, index) => initialYear + index);
	return arr;
}

export function formatDateQuery(date: string, type: "start" | "end") {
	if (type === "start") return dayjs(date).startOf("day").subtract(3, "hour").toISOString();
	if (type === "end") return dayjs(date).endOf("day").subtract(3, "hour").toISOString();
	return dayjs(date).startOf("day").subtract(3, "hour").toISOString();
}

export function getHoursDiff({ start, finish }: { start: string | Date; finish: string | Date }) {
	const hourDiff = dayjs(finish).diff(dayjs(start), "hour");
	return hourDiff;
}

export function getDifferenceBetweenTimes(timeOne: string, timeTwo: string) {
	// Parse time strings into hours and minutes
	const time1Parts = timeOne.split(":");
	const time2Parts = timeTwo.split(":");

	const time1Hours = Number.parseInt(time1Parts[0]);
	const time1Minutes = Number.parseInt(time1Parts[1]);

	const time2Hours = Number.parseInt(time2Parts[0]);
	const time2Minutes = Number.parseInt(time2Parts[1]);

	// Calculate total minutes for each time
	const totalMinutesTime1 = time1Hours * 60 + time1Minutes;
	const totalMinutesTime2 = time2Hours * 60 + time2Minutes;

	// Find the absolute difference in minutes between the two times
	const differenceInMinutes = Math.abs(totalMinutesTime1 - totalMinutesTime2);

	// Convert the difference back into hours and minutes format
	const differenceHoursTotal = differenceInMinutes / 60;
	const differenceHours = Math.floor(differenceInMinutes / 60);
	const differenceMinutes = differenceInMinutes % 60;
	return { hoursTotal: differenceHoursTotal, minutesTotal: differenceInMinutes, hoursFixed: differenceHours, minutesFixed: differenceMinutes };
}

export function getDayStringsBetweenDates({ initialDate, endDate, format }: { initialDate: string; endDate: string; format?: string }) {
	const strings = [];
	let iteratingDate = dayjs(initialDate);
	const goalDate = dayjs(endDate);

	while (iteratingDate.isBefore(goalDate) || iteratingDate.isSame(goalDate, "day")) {
		const dayStr = iteratingDate.format(format || "DD/MM");
		strings.push(dayStr);
		iteratingDate = iteratingDate.add(1, "day");
	}

	return strings;
}

export function getDifferenceBetweenDates({ start, end }: { start?: string | Date | null; end?: string | Date | null }) {
	const startDate = dayjs(start);
	const endDate = dayjs(end);
	const diff = startDate.diff(endDate, "days");
	return Math.abs(diff);
}
type GetPeriodDateParamsByReferenceDateParams = {
	reference: string | Date;
	type?: "month" | "year";
	resetStart?: boolean;
	resetEnd?: boolean;
};
export function getPeriodDateParamsByReferenceDate({ reference, type = "month", resetStart, resetEnd }: GetPeriodDateParamsByReferenceDateParams) {
	if (type === "month") {
		let start = dayjs(reference).startOf("month");
		let end = dayjs(reference).endOf("month");
		if (resetStart) start = start.subtract(3, "hour");
		if (resetEnd) end = end.startOf("day").subtract(3, "hour");
		return { start: start.toDate(), end: end.toDate() };
	}
	if (type === "year") {
		let start = dayjs(reference).startOf("year");
		let end = dayjs(reference).endOf("year");
		if (resetStart) start = start.subtract(3, "hour");
		if (resetEnd) end = end.startOf("day").subtract(3, "hour");
		return { start: start.toDate(), end: end.toDate() };
	}

	// Default for month
	let start = dayjs(reference).startOf("month");
	let end = dayjs(reference).endOf("month");
	if (resetStart) start = start.subtract(3, "hour");
	if (resetEnd) end = end.startOf("day").subtract(3, "hour");
	return { start: start.toDate(), end: end.toDate() };
}

export function getMetadataFromHoursAmount(hours: number, reference: "months" | "days" | "hours" | "auto") {
	if (reference === "months") {
		const totalDays = Math.floor(hours / 24);
		const months = Math.floor(totalDays / 30); // Using 30 as average month length
		const remainingDays = totalDays % 30;
		return {
			complete: months,
			remaining: remainingDays,
			unit: "months" as const,
			remainingUnit: "days" as const,
		};
	}

	if (reference === "days") {
		const days = Math.floor(hours / 24);
		const remainingHours = hours % 24;
		return {
			complete: days,
			remaining: remainingHours,
			unit: "days" as const,
			remainingUnit: "hours" as const,
		};
	}

	if (reference === "hours") {
		const completeHours = Math.floor(hours);
		const remainingMinutes = Math.round((hours - completeHours) * 60);
		return {
			complete: completeHours,
			remaining: remainingMinutes,
			unit: "hours" as const,
			remainingUnit: "minutes" as const,
		};
	}

	// reference === 'auto'
	const completeHours = Math.floor(hours);
	if (completeHours > 720) return getMetadataFromHoursAmount(hours, "months");
	if (completeHours > 24) return getMetadataFromHoursAmount(hours, "days");
	return getMetadataFromHoursAmount(hours, "hours");
}

export function getFormattedTextFromHoursAmount({
	hours,
	reference,
	onlyComplete,
}: {
	hours: number;
	reference: "months" | "days" | "hours" | "auto";
	onlyComplete: boolean;
}) {
	const metadata = getMetadataFromHoursAmount(hours, reference);
	const referenceMap = {
		months: {
			singular: "mês",
			plural: "meses",
		},
		days: {
			singular: "dia",
			plural: "dias",
		},
		hours: {
			singular: "hora",
			plural: "horas",
		},
		minutes: {
			singular: "minuto",
			plural: "minutos",
		},
	};

	const completeUnitFormatted = referenceMap[metadata.unit];
	const remainingUnitFormatted = referenceMap[metadata.remainingUnit];

	if (onlyComplete) return `${metadata.complete} ${metadata.complete > 1 ? completeUnitFormatted.plural : completeUnitFormatted.singular}`;
	return `${metadata.complete} ${metadata.complete > 1 ? completeUnitFormatted.plural : completeUnitFormatted.singular} e ${formatDecimalPlaces(
		metadata.remaining,
	)} ${metadata.remaining > 1 ? remainingUnitFormatted.plural : remainingUnitFormatted.singular}`;
}

export function getDayJsTimeUnitEquivalent({ unit }: { unit: TTimeUnitEnum }) {
	const timeUnitsMap: Record<TTimeUnitEnum, ManipulateType> = {
		DIAS: "day",
		SEMANAS: "week",
		MESES: "month",
		ANOS: "year",
	};
	return timeUnitsMap[unit] || ("day" as ManipulateType);
}

export function getEvenlySpacedDates({ startDate, endDate, points = 7 }: { startDate: Date; endDate: Date; points?: number }): Date[] {
	const start = dayjs(startDate);
	const end = dayjs(endDate);

	// Calculate the total duration in milliseconds
	const totalDuration = end.diff(start);
	// Calculate the interval between each date (divide by 6 to get 7 points total)
	const interval = totalDuration / (points - 1);

	// Generate the 7 dates
	return Array.from({ length: points }, (_, index) => {
		return start.add(interval * index).toDate();
	});
}

export function getDatePeriodMetadata({ startDate, endDate }: { startDate: Date; endDate: Date }) {
	const seconds = dayjs(endDate).diff(dayjs(startDate), "second");
	const minutes = dayjs(endDate).diff(dayjs(startDate), "minute");
	const hours = dayjs(endDate).diff(dayjs(startDate), "hour");
	const days = dayjs(endDate).diff(dayjs(startDate), "day");
	const months = dayjs(endDate).diff(dayjs(startDate), "month");
	const years = dayjs(endDate).diff(dayjs(startDate), "year");
	return { seconds, minutes, hours, days, months, years };
}

export function getBestNumberOfPointsBetweenDates({ startDate, endDate }: { startDate: Date; endDate: Date }): {
	groupingFormat: string;
	points: number;
} {
	const metadata = getDatePeriodMetadata({ startDate, endDate });

	// Casos específicos para períodos comuns

	// Caso: Aproximadamente 1 dia (20-28 horas)
	if (metadata.hours >= 20 && metadata.hours <= 28) {
		return {
			groupingFormat: "HH:mm",
			points: 24,
		}; // Um ponto por hora
	}

	// Caso: Aproximadamente 1 mês (28-31 dias)
	if (metadata.days >= 28 && metadata.days <= 31) {
		return {
			groupingFormat: "DD/MM",
			points: metadata.days,
		}; // Um ponto por dia
	}

	// Caso: Aproximadamente 1 ano
	if (metadata.days >= 360 && metadata.days <= 366) {
		return {
			groupingFormat: "DD/MM",
			points: metadata.days,
		}; // Um ponto por dia do ano
	}

	// Para outros casos, usar uma lógica adaptativa
	if (metadata.days < 1) {
		// Menos de um dia: dividir por horas
		return {
			groupingFormat: "HH:mm",
			points: Math.max(12, metadata.hours),
		};
	}
	if (metadata.days < 7) {
		// Menos de uma semana: 4 pontos por dia
		return {
			groupingFormat: "DD/MM HH:mm",
			points: metadata.days * 4,
		};
	}
	if (metadata.days < 30) {
		// Menos de um mês: 1 ponto por dia
		return {
			groupingFormat: "DD/MM",
			points: metadata.days,
		};
	}
	if (metadata.days < 90) {
		// Menos de 3 meses: 1 ponto a cada 2 dias
		return {
			groupingFormat: "DD/MM",
			points: Math.ceil(metadata.days / 2),
		};
	}
	if (metadata.days < 365) {
		// Menos de um ano: 1 ponto a cada semana
		return {
			groupingFormat: "DD/MM",
			points: Math.ceil(metadata.days / 7),
		};
	}
	// Mais de um ano: 1 ponto a cada mês
	return {
		groupingFormat: "MM/YYYY",
		points: Math.max(metadata.months, 12),
	};
}
export function getDateBuckets(dates: Date[]) {
	const buckets = dates.map((date, index, arr) => {
		const nextDate = arr[index + 1];
		const start = date;
		const end = nextDate || date; // último bucket usa a mesma data
		const key = date.toISOString();

		return {
			key,
			start: start.getTime(),
			end: end.getTime(),
		};
	});

	return buckets;
}

export function getPeriodUtils({ startDate, endDate }: { startDate: Date; endDate: Date }) {
	const { points: bestNumberOfPoints, groupingFormat } = getBestNumberOfPointsBetweenDates({
		startDate,
		endDate,
	});
	const evenlySpacedDates = getEvenlySpacedDates({
		startDate,
		endDate,
		points: bestNumberOfPoints,
	});
	const dateBuckets = getDateBuckets(evenlySpacedDates);

	const periodDatesStrs = getDayStringsBetweenDates({
		initialDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	});

	return {
		format: groupingFormat,
		numberOfPoints: bestNumberOfPoints,
		spacedDates: evenlySpacedDates,
		buckets: dateBuckets,
		datesStrs: periodDatesStrs,
	};
}
