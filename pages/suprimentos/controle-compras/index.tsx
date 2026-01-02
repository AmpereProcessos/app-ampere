import PurchaseControlsCardModePage from "@/components/identificador/controles-compras/CardModePage";
import PurchaseControlsGroupedModePage from "@/components/identificador/controles-compras/GroupedModePage";
import PurchaseControlsKanbanModePage from "@/components/identificador/controles-compras/KanbanModePage";
import TransportControlsView from "@/components/identificador/controles-transportes/TransportControlsView";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { handleSetCookie } from "@/utils/methods/cookies";
import { getTextBetweenParentheses } from "@/utils/methods/extracting";
import { formatWithoutDiacritics } from "@/utils/methods/formatting";
import { DiamondIcon, KanbanIcon, ListIcon, Truck } from "lucide-react";
import type { GetServerSidePropsContext } from "next";
import nookies, { setCookie, parseCookies } from "nookies";
import React, { useMemo, useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

export type TPurchasesControlPageModes = "card" | "kanban" | "grouped" | "transport-controls";
export type TPurchaseControlKanbanListExpandedModes = {
	[key: string]: "active" | "inactive" | null;
};
type PurchasesControlProps = {
	initialMode: TPurchasesControlPageModes | null | undefined;
	kanbanListExpandedModeOptions: TPurchaseControlKanbanListExpandedModes;
};
function PurchasesControl({ initialMode, kanbanListExpandedModeOptions }: PurchasesControlProps) {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	return <PurchasesControlContent session={session} initialMode={initialMode} kanbanListExpandedModeOptions={kanbanListExpandedModeOptions} />;
}

export default PurchasesControl;

type PurchasesControlContentProps = {
	session: TAuthSession;
	initialMode: TPurchasesControlPageModes | null | undefined;
	kanbanListExpandedModeOptions: TPurchaseControlKanbanListExpandedModes;
};
function PurchasesControlContent({ session, initialMode, kanbanListExpandedModeOptions }: PurchasesControlContentProps) {
	const [mode, setMode] = useState<TPurchasesControlPageModes>(initialMode || "kanban");
	function handleSetMode(selected: TPurchasesControlPageModes) {
		// Setting selected mode in a cookie for futher preference use
		handleSetCookie({
			ctx: null,
			key: "purchases-control-page-mode",
			value: selected,
			path: "/suprimentos/controle-compras",
		});
		setMode(selected);
	}

	const title = useMemo(() => {
		switch (mode) {
			case "transport-controls":
				return "TRANSPORTES";
			case "kanban":
				return "KANBAN DE COMPRAS";
			case "card":
				return "LISTA DE COMPRAS";
			case "grouped":
				return "COMPRAS POR STATUS";
		}
	}, [mode]);
	return (
		<div className="w-full flex flex-col gap-2 p-6 grow">
			<div className="w-full flex items-center justify-between flex-col lg:flex-row gap-2">
				<h1 className="text-2xl font-black text-[#15599a]">{title}</h1>
				<div className="flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-lg">
					<button
						type="button"
						onClick={() => handleSetMode("kanban")}
						className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
							"bg-transparent": mode !== "kanban",
							"bg-primary text-primary-foreground": mode === "kanban",
						})}
					>
						<KanbanIcon className="w-3 h-3 min-w-3 min-h-3" />
						KANBAN
					</button>
					<button
						type="button"
						onClick={() => handleSetMode("card")}
						className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
							"bg-transparent": mode !== "card",
							"bg-primary text-primary-foreground": mode === "card",
						})}
					>
						<ListIcon className="w-3 h-3 min-w-3 min-h-3" />
						LISTA
					</button>
					<button
						type="button"
						onClick={() => handleSetMode("grouped")}
						className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
							"bg-transparent": mode !== "grouped",
							"bg-primary text-primary-foreground": mode === "grouped",
						})}
					>
						<DiamondIcon className="w-3 h-3 min-w-3 min-h-3" />
						POR STATUS
					</button>
					<button
						type="button"
						onClick={() => handleSetMode("transport-controls")}
						className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", {
							"bg-transparent": mode !== "transport-controls",
							"bg-primary text-primary-foreground": mode === "transport-controls",
						})}
					>
						<Truck className="w-3 h-3 min-w-3 min-h-3" />
						TRANSPORTES
					</button>
				</div>
			</div>
			{mode === "kanban" ? (
				<PurchaseControlsKanbanModePage
					initialKanbanListExpandedModeOptions={kanbanListExpandedModeOptions}
					session={session}
					handleSetMode={handleSetMode}
				/>
			) : null}
			{mode === "card" ? <PurchaseControlsCardModePage session={session} handleSetMode={handleSetMode} /> : null}
			{mode === "grouped" ? (
				<PurchaseControlsGroupedModePage initialListExpandedModeOptions={kanbanListExpandedModeOptions} session={session} handleSetMode={handleSetMode} />
			) : null}
			{mode === "transport-controls" ? <TransportControlsView session={session} handleSetMode={handleSetMode} /> : null}
		</div>
	);
	// if (mode === "kanban")
	// 	return (
	// 		<PurchaseControlsKanbanModePage
	// 			initialKanbanListExpandedModeOptions={kanbanListExpandedModeOptions}
	// 			session={session}
	// 			handleSetMode={handleSetMode}
	// 		/>
	// 	);

	// if (mode === "card") return <PurchaseControlsCardModePage session={session} handleSetMode={handleSetMode} />;
	// return (
	// 	<PurchaseControlsGroupedModePage initialListExpandedModeOptions={kanbanListExpandedModeOptions} session={session} handleSetMode={handleSetMode} />
	// );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const cookies = nookies.get(context);
	console.log(cookies);
	const initialMode = cookies["purchases-control-page-mode"] || null;
	const kanbanListExpandedMode = cookies["puchases-control-kanban-list-expanded"] || null;
	const cookiesEntries = Object.entries(cookies);

	function getCookieDefinitionByListTitle({ cookiesEntries, title }: { cookiesEntries: [string, string][]; title: string }) {
		const entry = cookiesEntries.find((entry) => getTextBetweenParentheses(entry[0]) === formatWithoutDiacritics(title));
		return entry ? (entry[1] as "active" | "inactive") : null;
	}
	const kanbanListExpandedModeOptions = {
		PENDENTE: getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "PENDENTE",
		}),
		"EM COTAÇÃO": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "EM COTAÇÃO",
		}),
		"AGUARDANDO APROVAÇÃO": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "AGUARDANDO APROVAÇÃO",
		}),
		"AGUARDANDO NOTA FUTURA": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "AGUARDANDO NOTA FUTURA",
		}),
		"AGUARDANDO PAGAMENTO": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "AGUARDANDO PAGAMENTO",
		}),
		"AGUARDANDO COMPRA": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "AGUARDANDO COMPRA",
		}),
		"AGUARDANDO FATURAMENTO": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "AGUARDANDO FATURAMENTO",
		}),
		"AGUARDANDO DESPACHE": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "AGUARDANDO DESPACHE",
		}),
		"AGUARDANDO ENTREGA": getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "AGUARDANDO ENTREGA",
		}),
		CONCLUÍDA: getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "CONCLUÍDA",
		}),
		PENDÊNCIAS: getCookieDefinitionByListTitle({
			cookiesEntries,
			title: "PENDÊNCIAS",
		}),
	};

	return {
		props: {
			initialMode,
			kanbanListExpandedModeOptions,
		},
	};
}
