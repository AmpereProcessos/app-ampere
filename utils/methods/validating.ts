import toast from "react-hot-toast";

export function isNumber(value: unknown) {
	if (value == null) return false;
	const isNaNCheck = Number.isNaN(value);
	if (isNaNCheck) return false;
	return true;
}
export function isValidNumber(value: unknown) {
	return typeof value === "number" && !Number.isNaN(value) && value !== null && value !== undefined;
}
