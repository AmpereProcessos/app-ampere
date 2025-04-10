import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
import TextInput from "@/components/inputs/Text";
import { Sheet, SheetTitle, SheetDescription, SheetContent, SheetHeader } from "@/components/ui/sheet";
import type { TPersonalizedServiceOrderFilter } from "@/utils/schemas/service-order";
import { useState } from "react";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { formatDate, serviceOrdersCategories, serviceOrderUrgencyOptions } from "@/utils/constants";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import { useTechnicalAnalysts } from "@/utils/methods/query/crm/users";
import { useUsers } from "@/utils/methods/query/users";
import SelectInput from "@/components/inputs/Select";
import DateInput from "@/components/inputs/Date";
import { formatDateInputChange } from "@/utils/methods/shared";
import CheckboxInput from "@/components/inputs/Checkbox";
import { Button } from "@/components/ui/button";
import { roofTiles, SystemTopologiesTypes } from "@/utils/select-options";
import { ArrowDownNarrowWide } from "lucide-react";
import { ArrowUpNarrowWide } from "lucide-react";
import { cn } from "@/lib/utils";

const AllStates = StatesAndCities.map((s) => s.sigla).map((c, index) => ({ id: index + 1, value: c, label: c }));
const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, value: c, label: c }));

type ExecutionPageFiltersProps = {
	filters: TPersonalizedServiceOrderFilter;
	updateFilters: (filters: Partial<TPersonalizedServiceOrderFilter>) => void;
	closeMenu: () => void;
};
export default function ExecutionPageFilters({ filters, updateFilters, closeMenu }: ExecutionPageFiltersProps) {
	const [queryParamsHolder, setQueryParamsHolder] = useState<TPersonalizedServiceOrderFilter>(filters);
	const { data: users } = useUsers();
	const PeriodRelatedField = [
		{
			id: 1,
			label: "DATA DE INSERÇÃO",
			value: "dataInsercao",
		},
		{
			id: 2,
			label: "DATA DE PREVISÃO DE LIBERAÇÃO",
			value: "dataPrevisaoLiberacao",
		},
		{
			id: 3,
			label: "DATA DE LIBERAÇÃO",
			value: "dataLiberacao",
		},
		{
			id: 4,
			label: "DATA DE EFETIVAÇÃO",
			value: "dataEfetivacao",
		},
		{
			id: 5,
			label: "DATA DE ASSINATURA DO CONTRATO",
			value: "projeto.contratoDataAssinatura",
		},
		{
			id: 6,
			label: "DATA DE PREVISÃO DE ENTREGA DA COMPRA",
			value: "projeto.compraEntregaDataPrevisao",
		},
		{
			id: 7,
			label: "DATA DE EFETIVAÇÃO DA ENTREGA DA COMPRA",
			value: "projeto.compraEntregaDataEfetivacao",
		},
		{
			id: 8,
			label: "DATA DE RESPOSTA DA HOMOLOGACAO DE ACESSO",
			value: "projeto.homologacaoAcessoDataResposta",
		},
		{
			id: 9,
			label: "DATA DE EFETIVAÇÃO DA VISTORIA",
			value: "projeto.homologacaoVistoriaDataEfetivacao",
		},
	];
	return (
		<Sheet open onOpenChange={closeMenu}>
			<SheetContent>
				<div className="flex h-full w-full flex-col">
					<SheetHeader>
						<SheetTitle>FILTRAR ORDENS DE SERVIÇO</SheetTitle>
						<SheetDescription>Escolha aqui parâmetros para filtrar as ordens de serviço.</SheetDescription>
					</SheetHeader>
					<div className="flex h-full flex-col gap-y-4 overflow-y-auto overscroll-y-auto p-2 scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
						<TextInput
							label="NOME DO FAVORECIDO"
							value={queryParamsHolder.name}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, name: value })}
							placeholder="Preencha aqui o nome do favorecido.."
							width={"100%"}
						/>
						<TextInput
							label="NOME DO RESPONSÁVEL"
							value={queryParamsHolder.responsible}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, responsible: value })}
							placeholder="Preencha aqui o nome do responsável.."
							width={"100%"}
						/>
						<MultipleSelectInputVirtualized
							label="CIDADE"
							selected={queryParamsHolder.city}
							selectedItemLabel={"NÃO DEFINIDO"}
							options={AllCities}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, city: value as string[] })}
							onReset={() => setQueryParamsHolder({ ...queryParamsHolder, city: [] })}
							width={"100%"}
						/>
						<MultipleSelectInputVirtualized
							label="UF"
							selected={queryParamsHolder.state}
							selectedItemLabel={"NÃO DEFINIDO"}
							options={AllStates}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, state: value as string[] })}
							onReset={() => setQueryParamsHolder({ ...queryParamsHolder, state: [] })}
							width={"100%"}
						/>
						<MultipleSelectInputVirtualized
							label="CATEGORIA"
							selected={queryParamsHolder.category}
							selectedItemLabel={"NÃO DEFINIDO"}
							options={serviceOrdersCategories}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, category: value as string[] })}
							onReset={() => setQueryParamsHolder({ ...queryParamsHolder, category: [] })}
							width={"100%"}
						/>
						<MultipleSelectInputVirtualized
							label="URGENCIA"
							selected={queryParamsHolder.urgency}
							selectedItemLabel={"NÃO DEFINIDO"}
							options={serviceOrderUrgencyOptions}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, urgency: value as string[] })}
							onReset={() => setQueryParamsHolder({ ...queryParamsHolder, urgency: [] })}
							width={"100%"}
						/>
						<MultipleSelectInput
							label="AUTOR"
							selected={queryParamsHolder.authors}
							selectedItemLabel={"NÃO DEFINIDO"}
							options={
								users?.map((u) => ({
									id: u._id,
									value: u._id,
									label: u.nome,
								})) || []
							}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, authors: value as string[] })}
							onReset={() => setQueryParamsHolder({ ...queryParamsHolder, authors: [] })}
							width={"100%"}
						/>
						<MultipleSelectInputVirtualized
							label="TOPOLOGIA"
							selected={queryParamsHolder.topologies}
							selectedItemLabel={"NÃO DEFINIDO"}
							options={SystemTopologiesTypes}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, topologies: value as string[] })}
							onReset={() => setQueryParamsHolder({ ...queryParamsHolder, topologies: [] })}
							width={"100%"}
						/>
						<MultipleSelectInputVirtualized
							label="TIPOS DE TELHA"
							selected={queryParamsHolder.roofTypes}
							selectedItemLabel={"NÃO DEFINIDO"}
							options={roofTiles}
							handleChange={(value) => setQueryParamsHolder({ ...queryParamsHolder, roofTypes: value as string[] })}
							onReset={() => setQueryParamsHolder({ ...queryParamsHolder, roofTypes: [] })}
							width={"100%"}
						/>
						<div className="flex w-full flex-col gap-2">
							<h1 className="w-full text-center text-[0.65rem] tracking-tight text-primary/80">ORDENAÇÃO</h1>
							<div className="flex items-center gap-2 justify-center flex-wrap">
								<button
									type="button"
									onClick={() => setQueryParamsHolder((prev) => ({ ...prev, orderBy: { ...prev.orderBy, direction: "asc" } }))}
									className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
										"bg-primary/50  text-primary-foreground hover:bg-primary/40": queryParamsHolder.orderBy.direction === "asc",
										"bg-transparent text-primary hover:bg-primary/20": queryParamsHolder.orderBy.direction !== "asc",
									})}
								>
									<ArrowUpNarrowWide size={12} />
									<h1 className="text-xs font-medium tracking-tight">ORDEM CRESCENTE</h1>
								</button>
								<button
									type="button"
									onClick={() => setQueryParamsHolder((prev) => ({ ...prev, orderBy: { ...prev.orderBy, direction: "desc" } }))}
									className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
										"bg-primary/50  text-primary-foreground hover:bg-primary/40": queryParamsHolder.orderBy.direction === "desc",
										"bg-transparent text-primary hover:bg-primary/20": queryParamsHolder.orderBy.direction !== "desc",
									})}
								>
									<ArrowDownNarrowWide size={12} />
									<h1 className="text-xs font-medium tracking-tight">ORDEM DECRESCENTE</h1>
								</button>
							</div>
							{PeriodRelatedField.map((option) => (
								<button
									key={option.value}
									type="button"
									className={cn("w-full flex items-center text-xs tracking-tight px-2 py-1 rounded-lg", {
										"bg-primary/50  text-primary-foreground hover:bg-primary/40": queryParamsHolder.orderBy.field === option.value,
										"bg-transparent text-primary hover:bg-primary/20": queryParamsHolder.orderBy.field !== option.value,
									})}
									onClick={() => setQueryParamsHolder((prev) => ({ ...prev, orderBy: { ...prev.orderBy, field: option.value as TPersonalizedServiceOrderFilter["orderBy"]["field"] } }))}
								>
									<h1>{option.label}</h1>
								</button>
							))}
						</div>
						<div className="flex w-full flex-col gap-2">
							<h1 className="w-full text-center text-[0.65rem] tracking-tight text-primary/80">FILTRO POR PERÍODO</h1>
							<DateInput
								label="DEPOIS DE"
								value={formatDate(queryParamsHolder.period.after)}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, after: formatDateInputChange(value) as string } }))}
								width="100%"
							/>
							<DateInput
								label="ANTES DE"
								value={formatDate(queryParamsHolder.period.before)}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, before: formatDateInputChange(value) as string } }))}
								width="100%"
							/>
							<SelectInput
								label="PARÂMETRO"
								value={queryParamsHolder.period.field}
								options={PeriodRelatedField}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, field: value as TPersonalizedServiceOrderFilter["period"]["field"] } }))}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, field: null } }))}
								width={"100%"}
							/>
						</div>
						<div className="flex w-full flex-col gap-2">
							<h1 className="w-full text-center text-[0.65rem] tracking-tight text-primary/80">FILTRO POR PENDÊNCIAS</h1>
							<div className="w-fit self-center">
								<CheckboxInput
									labelTrue="SOMENTE NÃO CONCLUÍDAS"
									labelFalse="SOMENTE NÃO CONCLUÍDAS"
									checked={queryParamsHolder.pending}
									handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, pending: value }))}
								/>
							</div>
							<div className="w-fit self-center">
								<CheckboxInput
									labelTrue="SOMENTE LIBERADAS"
									labelFalse="SOMENTE LIBERADAS"
									checked={queryParamsHolder.released}
									handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, released: value }))}
								/>
							</div>
							<div className="w-fit self-center">
								<CheckboxInput
									labelTrue="EQUIPAMENTOS ENTREGUES"
									labelFalse="EQUIPAMENTOS ENTREGUES"
									checked={queryParamsHolder.projectEquipmentDelivered}
									handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, projectEquipmentDelivered: value }))}
								/>
							</div>
							<div className="w-fit self-center">
								<CheckboxInput
									labelTrue="EQUIPAMENTOS NÃO ENTREGUES"
									labelFalse="EQUIPAMENTOS NÃO ENTREGUES"
									checked={queryParamsHolder.projectEquipmentNotDelivered}
									handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, projectEquipmentNotDelivered: value }))}
								/>
							</div>
						</div>
						<Button
							onClick={() => {
								updateFilters({ ...queryParamsHolder, page: 1 });
								closeMenu();
							}}
						>
							FILTRAR
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
