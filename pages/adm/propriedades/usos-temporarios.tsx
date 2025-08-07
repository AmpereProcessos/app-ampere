import DateInput from "@/components/inputs/Date";
import TextInput from "@/components/inputs/Text";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getVehicleReviewAlertLevelByKmDifference } from "@/lib/property-usage";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { usePropertyTemporaryUsages } from "@/utils/methods/query/properties";
import type { TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import { Car, Code, Timer, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

function TemporaryUsages() {
	const { data: session, status } = useSession({ required: true });
	if (status !== "authenticated") return <LoadingPage />;
	return <TemporaryUsagesContent session={session} />;
}

export default TemporaryUsages;

type TemporaryUsagesContentProps = {
	session: Session;
};
function TemporaryUsagesContent({ session }: TemporaryUsagesContentProps) {
	const { data, isLoading, isError, isSuccess, queryParams, updateQueryParams } = usePropertyTemporaryUsages({});
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false);
	const [search, setSearch] = useState<string>("");
	const [typeFilter, setTypeFilter] = useState<TPropertyTemporaryUsage["metadados"]["tipo"] | "TODOS">("TODOS");

	const filteredData = useMemo(() => {
		const usages = data || [];
		return usages.filter((usage) => {
			const matchesType = typeFilter === "TODOS" ? true : usage.metadados.tipo === typeFilter;
			const matchesSearch =
				search.trim().length === 0
					? true
					: [usage.propriedade.nome, usage.propriedade.identificador]
							.filter(Boolean)
							.map((v) => v.toLowerCase())
							.some((v) => v.includes(search.toLowerCase()));
			return matchesType && matchesSearch;
		});
	}, [data, search, typeFilter]);

	return (
		<div className="grow p-6">
			<div className="flex h-full grow flex-col">
				<div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col">
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">USOS TEMPORÁRIOS DE PROPRIEDADES</p>
							<p className="text-sm tracking-tight text-gray-500">{filteredData?.length || "..."} registros encontrados</p>
						</div>
						{dropdownMenuVisible ? (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
							</div>
						) : (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
							</div>
						)}
					</div>
					<AnimatePresence>
						{dropdownMenuVisible ? (
							<motion.div initial={{ scale: 0.95, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
								<div className="flex flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
									<TextInput label={"BUSCA (NOME OU IDENTIFICADOR)"} value={search} placeholder={"Digite para filtrar..."} handleChange={(value) => setSearch(value)} />
									<div className="w-full lg:w-[220px]">
										<label htmlFor="tipo_select" className="text-sm font-medium tracking-tight text-primary/80">
											TIPO
										</label>
										<select
											id="tipo_select"
											value={typeFilter}
											onChange={(e) => setTypeFilter(e.target.value as any)}
											className="w-full rounded-md border border-primary/20 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out"
										>
											<option value="TODOS">TODOS</option>
											<option value="USO DE VEÍCULO">USO DE VEÍCULO</option>
										</select>
									</div>
									<div className="w-full lg:w-[220px]">
										<label htmlFor="period_type_select" className="text-sm font-medium tracking-tight text-primary/80">
											TIPO DO PERÍODO
										</label>
										<select
											id="period_type_select"
											value={queryParams.periodType}
											onChange={(e) => updateQueryParams({ periodType: e.target.value as "dataInicio" | "dataFim" })}
											className="w-full rounded-md border border-primary/20 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out"
										>
											<option value="dataInicio">DATA DE INÍCIO</option>
											<option value="dataFim">DATA DE FIM</option>
										</select>
									</div>
									<DateInput
										label="DATA INICIAL"
										value={queryParams.periodAfter?.slice(0, 10)}
										handleChange={(value) => updateQueryParams({ periodAfter: value ? new Date(value).toISOString() : queryParams.periodAfter })}
										width="220px"
									/>
									<DateInput
										label="DATA FINAL"
										value={queryParams.periodBefore?.slice(0, 10)}
										handleChange={(value) => updateQueryParams({ periodBefore: value ? new Date(value).toISOString() : queryParams.periodBefore })}
										width="220px"
									/>
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>

				<div className="w-full flex flex-col gap-2">
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg="Erro ao buscar usos temporários..." /> : null}
					{isSuccess ? (
						filteredData.length > 0 ? (
							filteredData.map((usage) => <TemporaryUsageCard key={usage._id as any} usage={usage as any} />)
						) : (
							<p className="w-full text-center font-medium italic text-gray-500">Nenhum uso temporário encontrado.</p>
						)
					) : null}
				</div>
			</div>
		</div>
	);
}

function TemporaryUsageCard({ usage }: { usage: TPropertyTemporaryUsage & { _id?: string } }) {
	const isOpen = !usage.dataFim;
	const statusBadge = isOpen ? (
		<div className="flex items-center gap-1 rounded bg-yellow-200 px-2 py-0.5 text-[0.65rem] font-bold text-yellow-800">
			<Timer className="w-3 h-3" /> EM ABERTO
		</div>
	) : (
		<div className="flex items-center gap-1 rounded bg-green-200 px-2 py-0.5 text-[0.65rem] font-bold text-green-800">
			<CheckCircle2 className="w-3 h-3" /> FINALIZADO
		</div>
	);

	const vehicleInfo =
		usage.metadados.tipo === "USO DE VEÍCULO" ? (
			<div className="flex items-center gap-2 flex-wrap">
				<div className="flex items-center gap-1 rounded bg-primary/20 px-2 py-0.5 text-[0.65rem] font-bold italic text-primary/80">
					<Car className="w-3 h-3" /> VEÍCULO
				</div>
				<div className="text-[0.7rem] text-primary/80">
					KM: {usage.metadados.kmInicial}
					{usage.metadados.kmFinal ? ` → ${usage.metadados.kmFinal}` : " → ..."}
				</div>
			</div>
		) : null;

	return (
		<div className="flex w-full flex-col gap-2 rounded border border-primary bg-[#fff] p-3 shadow-sm dark:bg-[#121212]">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex items-center gap-2 flex-wrap">
					<p className="text-sm font-bold leading-none tracking-tight">{usage.propriedade.nome}</p>
					<div className="flex items-center gap-1 rounded bg-primary/20 px-2 py-0.5 text-[0.65rem] font-bold italic text-primary/80">
						<Code className="w-3 h-3" />
						<p>{usage.propriedade.identificador}</p>
					</div>
					{vehicleInfo}
				</div>
				{statusBadge}
			</div>

			<div className="flex w-full items-center justify-between gap-2 flex-wrap">
				<div className="flex items-center gap-2 flex-wrap">
					{usage.responsaveis.map((resp) => (
						<div key={resp.id} className="flex items-center gap-1">
							<Avatar className="h-6 w-6">
								<AvatarImage src={resp.avatar_url ?? undefined} />
								<AvatarFallback>{formatNameAsInitials(resp.nome)}</AvatarFallback>
							</Avatar>
							<p className="text-xs font-medium text-primary/80">{resp.nome}</p>
						</div>
					))}
				</div>
				<div className="flex items-center gap-2 text-xs text-primary/80">
					<span>INÍCIO: {formatDateAsLocale(usage.dataInicio || usage.dataInsercao) || "N/A"}</span>
					{usage.dataFim ? <span>• FIM: {formatDateAsLocale(usage.dataFim) || "N/A"}</span> : null}
				</div>
			</div>

			<div className="flex w-full items-center justify-end">
				<a href={`/publico/uso-temporario-propriedade/${usage.propriedade.id}`} target="_blank" rel="noreferrer">
					<Button variant="ghost" size="sm">
						ABRIR FORMULÁRIO
					</Button>
				</a>
			</div>
		</div>
	);
}
