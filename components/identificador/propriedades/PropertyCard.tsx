import { cn } from "@/lib/utils";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import type { TGetPropertiesDefaultOutput } from "@/pages/api/propriedades";
import { Car, Code, Pencil } from "lucide-react";
import React from "react";
import { BsCalendarPlus, BsCode } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVehicleReviewAlertLevelByKmDifference } from "@/lib/property-usage";

type PropertyCardProps = {
	property: TGetPropertiesDefaultOutput[number];
	openModal: (id: string) => void;
};
function PropertyCard({ property, openModal }: PropertyCardProps) {
	const openUsages = property.usosTemporarios || [];

	const vehicleReviewAlertLevel =
		property.metadados.tipo === "VEÍCULO" ? getVehicleReviewAlertLevelByKmDifference(property.metadados.kmProximaRevisao - property.metadados.kmAcumulado) : null;
	return (
		<div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex items-center gap-2 flex-wrap">
					<p className="text-sm font-bold leading-none tracking-tight">{property.nome}</p>
					<div className={cn("flex items-center gap-1 rounded-lg bg-primary/20 px-2 py-0.5 text-center text-xs font-bold italic text-primary/80")}>
						<Code size={12} />
						<p>{property.identificador}</p>
					</div>
					{property.metadados.tipo === "VEÍCULO" ? (
						<>
							<div className={cn("flex items-center gap-1 rounded-lg bg-primary/20 px-2 py-0.5 text-center text-xs font-bold italic text-primary/80")}>
								<Car size={12} />
								<p>{property.metadados.tipo}</p>
							</div>
							{vehicleReviewAlertLevel ? (
								<div className={cn("flex items-center gap-1 rounded-lg px-2 py-0.5 text-center text-xs font-bold italic", vehicleReviewAlertLevel.color)}>
									<Car size={12} />
									<p>{vehicleReviewAlertLevel.text}</p>
								</div>
							) : null}
						</>
					) : null}
				</div>
			</div>
			{openUsages.length > 0 ? (
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<p className="text-[0.65rem] font-semibold text-primary/80">USOS EM ABERTO ({openUsages.length})</p>
					</div>
					<div className="flex flex-col gap-1">
						{openUsages.map((usage) => (
							<div key={usage._id} className="flex  items-center justify-between rounded-sm bg-primary/10 border border-primary/50 p-1">
								<div className="flex items-center gap-2">
									<span className="text-xs font-semibold uppercase text-primary/70">{usage.metadados.tipo}</span>
									{usage.metadados.tipo === "USO DE VEÍCULO" ? <span className="text-xs text-primary/80 tracking-tight">KM: {usage.metadados.kmInicial} → ...</span> : null}
								</div>

								<div className="flex fitems-center gap-2">
									{usage.responsaveis.map((resp) => (
										<div key={resp.id} className="flex items-center gap-2">
											<Avatar className="h-5 w-5">
												<AvatarImage src={resp.avatar_url ?? undefined} />
												<AvatarFallback>{formatNameAsInitials(resp.nome)}</AvatarFallback>
											</Avatar>
											<p className="text-xs font-medium text-primary/80">{resp.nome}</p>
										</div>
									))}
									<div className="flex items-center gap-1 text-primary/80">
										<BsCalendarPlus className="w-4 h-4" />
										<span className="text-xs font-medium text-primary/80">INÍCIO: {formatDateAsLocale(usage.dataInicio || usage.dataInsercao) || "N/A"}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			) : null}
			<div className="mt-4 flex w-full items-center justify-between gap-1">
				<div className="flex items-center gap-1">
					<BsCalendarPlus />
					<p className="text-xs font-medium text-gray-500">{formatDateAsLocale(property.dataInsercao) || "N/A"}</p>
				</div>
				<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"} onClick={() => openModal(property._id)}>
					<Pencil size={16} />
					<p className="text-sm font-semibold text-primary/80">EDITAR</p>
				</Button>
			</div>
		</div>
	);
}

export default PropertyCard;
