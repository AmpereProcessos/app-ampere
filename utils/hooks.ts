import type { TAuthSession } from "@/lib/authentication/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRef } from "react";

export function useKey(key: string, cb: () => void) {
	const callbackRef = useRef(cb);
	useEffect(() => {
		callbackRef.current = cb;
	}, [cb]);
	useEffect(() => {
		function handle(event: any) {
			if (event.code === key) {
				// @ts-ignore
				callbackRef.current(event);
			}
		}
		document.addEventListener("keydown", handle);
		return () => document.removeEventListener("keypress", handle);
	}, [key]);
}
export function useClickOutside(ref: React.MutableRefObject<any>, cb: () => void) {
	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				cb();
			}
		};
		document.addEventListener("click", (e) => handleClickOutside(e), true);
		return () => {
			document.removeEventListener("click", (e) => handleClickOutside(e), true);
		};
	}, [cb]);
}

type UseUnauthorizedRedirectProps = {
	session: TAuthSession | null;
	routes: string[];
};
export function useUnauthorizedRedirect({ session, routes }: UseUnauthorizedRedirectProps) {
	const router = useRouter();

	useEffect(() => {
		if (session) {
			const userRoutes = session?.user.permissoes.rotas;
			if (!userRoutes?.some((r) => routes.includes(r))) router.push("/");
		}
	}, [session, router]);
}
