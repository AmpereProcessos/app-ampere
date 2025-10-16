import { useRouter } from "next/router";
import { useCallback } from "react";

/**
 * Custom hook to manage state via URL query parameters
 * @param key - The query parameter key
 * @param defaultValue - Default value if query param is not present
 * @returns [currentValue, setValue] - Similar to useState
 */
export function useQueryState<T extends string>(key: string, defaultValue: T): [T, (value: T) => void] {
	const router = useRouter();

	// Get the current value from query params, or use default
	const currentValue = (router.query[key] as T) || defaultValue;

	// Create a setter function that updates the URL
	const setValue = useCallback(
		(value: T) => {
			// Update the URL without replacing history
			router.push(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						[key]: value,
					},
				},
				undefined,
				{ shallow: true },
			);
		},
		[router, key],
	);

	return [currentValue, setValue] as const;
}
