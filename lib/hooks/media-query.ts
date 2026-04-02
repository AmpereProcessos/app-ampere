import * as React from "react";

/** `matchMedia` síncrono no cliente (evita 1º render falso com `useEffect`). */
export function useMediaQuery(query: string) {
	return React.useSyncExternalStore(
		React.useCallback(
			(onStoreChange) => {
				const mq = matchMedia(query);
				mq.addEventListener("change", onStoreChange);
				return () => mq.removeEventListener("change", onStoreChange);
			},
				[query],
		),
		() => matchMedia(query).matches,
		() => false,
	);
}
