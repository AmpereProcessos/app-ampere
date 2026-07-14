"use client";

import { useSession } from "@/components/providers/SessionProvider";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const EXECUTION_ROUTE = "/ordens-de-servico/roteiro";

function isPublicRoute(pathname: string) {
  return pathname === "/publico" || pathname.startsWith("/publico/");
}

export default function ExecutionRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, status } = useSession();

  const shouldRedirect =
    !!pathname &&
    status === "authenticated" &&
    session.user.visualizacao.tipo === "EXECUÇÃO" &&
    pathname !== EXECUTION_ROUTE &&
    !isPublicRoute(pathname);

  useEffect(() => {
    if (shouldRedirect) window.location.replace(EXECUTION_ROUTE);
  }, [shouldRedirect]);

  if (shouldRedirect) return null;
  return children;
}
