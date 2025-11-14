import PurchaseControlsCardModePage from "@/components/identificador/controles-compras/CardModePage";
import PurchaseControlsGroupedModePage from "@/components/identificador/controles-compras/GroupedModePage";
import PurchaseControlsKanbanModePage from "@/components/identificador/controles-compras/KanbanModePage";
import { useSession } from "@/components/providers/SessionProvider";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { handleSetCookie } from "@/utils/methods/cookies";
import { getTextBetweenParentheses } from "@/utils/methods/extracting";
import { formatWithoutDiacritics } from "@/utils/methods/formatting";
import type { GetServerSidePropsContext } from "next";
import nookies, { setCookie, parseCookies } from "nookies";
import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

export type TPurchasesControlPageModes = "card" | "kanban" | "grouped";
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
	if (mode === "kanban")
		return (
			<PurchaseControlsKanbanModePage
				initialKanbanListExpandedModeOptions={kanbanListExpandedModeOptions}
				session={session}
				handleSetMode={handleSetMode}
			/>
		);

	if (mode === "card") return <PurchaseControlsCardModePage session={session} handleSetMode={handleSetMode} />;
	return (
		<PurchaseControlsGroupedModePage initialListExpandedModeOptions={kanbanListExpandedModeOptions} session={session} handleSetMode={handleSetMode} />
	);
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
