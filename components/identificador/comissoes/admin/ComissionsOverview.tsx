import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { ChevronDown, Wrench } from "lucide-react";
import { FaSolarPanel } from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";
import { MdElectricMeter, MdOutlineRoofing } from "react-icons/md";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import type { TComissionStats } from "./utils";

const ITEMS = [
	{ key: "SISTEMA", label: "Projeto", icon: FaSolarPanel },
	{ key: "PADRÃO", label: "Padrão", icon: MdElectricMeter },
	{ key: "ESTRUTURA PERSONALIZADA", label: "Estrutura personalizada", icon: MdOutlineRoofing },
	{ key: "OEM", label: "O&M", icon: Wrench },
	{ key: "SEGURO", label: "Seguro", icon: FaShieldHalved },
] as const;

type ComissionsOverviewProps = {
	stats: TComissionStats;
	selectedUserIds: string[];
	onUserClick: (userId: string) => void;
};
export default function ComissionsOverview({ stats, selectedUserIds, onUserClick }: ComissionsOverviewProps) {
	const [showDetails, setShowDetails] = useState(false);

	const comissionPercentage = stats.totalVendido > 0 ? (stats.comissaoTotal * 100) / stats.totalVendido : 0;
	const pricePerKwp = stats.potenciaVendida > 0 ? stats.totalVendido / stats.potenciaVendida : 0;
	const users = Object.values(stats.porUsuario).sort((a, b) => b.comissaoTotal - a.comissaoTotal);

	return (
		<section className="bg-card border-border rounded-lg border" aria-label="Resumo das comissões">
			<div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-6">
				<Metric
					label="Total vendido"
					value={formatToMoney(stats.totalVendido)}
					hint={`${formatDecimalPlaces(stats.potenciaVendida)} kWp · ${formatToMoney(pricePerKwp)}/kWp`}
				/>
				<div className="bg-border hidden h-10 w-px sm:block" />
				<Metric label="Comissão total" value={formatToMoney(stats.comissaoTotal)} hint={`${formatDecimalPlaces(comissionPercentage)}% do vendido`} />
				<div className="bg-border hidden h-10 w-px sm:block" />
				<Metric
					label="Por time"
					value={formatToMoney(stats.porTime.vendas)}
					hint={`Vendas · ${formatToMoney(stats.porTime.sdr)} SDR${stats.porTime.outros > 0 ? ` · ${formatToMoney(stats.porTime.outros)} outros` : ""}`}
				/>
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground self-start sm:ml-auto sm:self-center"
					aria-expanded={showDetails}
					aria-controls="comissions-overview-details"
					onClick={() => setShowDetails((prev) => !prev)}
				>
					{showDetails ? "OCULTAR DETALHAMENTO" : "VER DETALHAMENTO"}
					<ChevronDown
						className={cn("ml-1 h-4 w-4 transition-transform motion-reduce:transition-none", {
							"rotate-180": showDetails,
						})}
					/>
				</Button>
			</div>
			{showDetails ? (
				<div id="comissions-overview-details" className="border-border grid grid-cols-1 gap-4 border-t p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
					<div className="flex flex-col gap-2">
						<h2 className="text-muted-foreground text-xs font-medium uppercase">Comissão por item</h2>
						<ul className="flex flex-col gap-1">
							{ITEMS.map((item) => (
								<li key={item.key} className="flex items-center justify-between gap-2 text-sm">
									<span className="flex items-center gap-2">
										<item.icon className="text-muted-foreground h-4 w-4" aria-hidden />
										{item.label}
									</span>
									<span className="font-medium tabular-nums">{formatToMoney(stats.porItem[item.key])}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex items-baseline justify-between gap-2">
							<h2 className="text-muted-foreground text-xs font-medium uppercase">Comissão por usuário</h2>
							<p className="text-muted-foreground text-xs">Clique para filtrar</p>
						</div>
						<ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-3">
							{users.map((user) => {
								const isFilterable = !user.id.startsWith("sem-id:");
								const isSelected = selectedUserIds.includes(user.id);
								return (
									<li key={user.id}>
										<button
											type="button"
											disabled={!isFilterable}
											aria-pressed={isSelected}
											onClick={() => onUserClick(user.id)}
											className={cn(
												"hover:bg-secondary flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors disabled:cursor-default disabled:hover:bg-transparent",
												{ "bg-primary/10 ring-primary ring-1": isSelected },
											)}
										>
											<span className="flex min-w-0 items-center gap-2">
												<Avatar className="h-5 w-5">
													<AvatarImage src={user.avatar_url || undefined} alt="" />
													<AvatarFallback className="text-[0.6rem]">{formatNameAsInitials(user.nome || "NA")}</AvatarFallback>
												</Avatar>
												<span className="truncate">{user.nome}</span>
											</span>
											<span className="font-medium tabular-nums">{formatToMoney(user.comissaoTotal)}</span>
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			) : null}
		</section>
	);
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
	return (
		<div className="flex min-w-0 flex-col">
			<p className="text-muted-foreground text-xs font-medium uppercase">{label}</p>
			<p className="text-primary text-xl font-bold tabular-nums">{value}</p>
			<p className="text-muted-foreground truncate text-xs">{hint}</p>
		</div>
	);
}
