import type { TGetAllPosVendaCallsInput } from "@/app/api/chamados/posvenda/route";
import CheckboxInput from "@/components/inputs/Checkbox";
import DateInput from "@/components/inputs/Date";
import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { TEngineeringProjectsKanbanInput } from "@/pages/api/projects/engenharia/kanban";
import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";

import { useState } from "react";
import { useUsers } from "@/utils/methods/query/crm/users";
import { deliveryStatus } from "@/utils/select-options";
import { useTags } from "@/utils/methods/query/tags";

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }));
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }));
type EngineeringProjectsKanbanModePageFiltersProps = {
	queryParams: TEngineeringProjectsKanbanInput;
	updateQueryParams: (params: Partial<TEngineeringProjectsKanbanInput>) => void;
	closeMenu: () => void;
};
function EngineeringProjectsKanbanModePageFilters({ queryParams, updateQueryParams, closeMenu }: EngineeringProjectsKanbanModePageFiltersProps) {
	const [queryParamsHolder, setQueryParamsHolder] = useState<TEngineeringProjectsKanbanInput>(queryParams);
	const { data: crmUsers } = useUsers({ includeDeleted: true });
	const { data: tags } = useTags({ initialFilters: { applicableToProjects: "true" } });
	return (
		<Sheet open onOpenChange={closeMenu}>
			<SheetContent>
				<div className="flex h-full w-full flex-col">
					<SheetHeader>
						<SheetTitle>FILTRAR PROJETOS</SheetTitle>
						<SheetDescription>Escolha aqui parâmetros para filtrar o banco de projetos.</SheetDescription>
					</SheetHeader>
					<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-4 overflow-y-auto overscroll-y-auto p-2">
						<div className="flex w-full flex-col gap-2">
							<TextInput
								label="PESQUISA"
								value={queryParamsHolder.search || ""}
								placeholder={"Preenha aqui pelo título ou descrição do projeto para filtro."}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, search: value }))}
								width={"100%"}
							/>
							<MultipleSelectInputVirtualized
								width={"100%"}
								label={"CIDADES"}
								selected={queryParamsHolder.cities}
								options={AllCities.map((city, index) => ({ id: index + 1, label: city.label, value: city.value }))}
								selectedItemLabel={"SEM FILTRO"}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({
										...prev,
										cities: value as string[],
									}))
								}
								onReset={() =>
									setQueryParamsHolder((prev) => ({
										...prev,
										cities: [],
									}))
								}
							/>
							<MultipleSelectInputVirtualized
								width={"100%"}
								label={"ESTADOS"}
								selected={queryParamsHolder.ufs}
								options={AllStates.map((state, index) => ({ id: index + 1, label: state.label, value: state.value }))}
								selectedItemLabel={"SEM FILTRO"}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({
										...prev,
										ufs: value as string[],
									}))
								}
								onReset={() =>
									setQueryParamsHolder((prev) => ({
										...prev,
										ufs: [],
									}))
								}
							/>
							<MultipleSelectInputVirtualized
								width={"100%"}
								label={"VENDEDORES"}
								selected={queryParamsHolder.sellerNames}
								options={crmUsers?.map((user, index) => ({ id: index + 1, label: user.nome, value: user.nome })) || []}
								selectedItemLabel={"SEM FILTRO"}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({
										...prev,
										sellerNames: value as string[],
									}))
								}
								onReset={() =>
									setQueryParamsHolder((prev) => ({
										...prev,
										sellerNames: [],
									}))
								}
							/>
							<MultipleSelectInputVirtualized
								width={"100%"}
								label={"STATUS DE ENTREGA DA COMPRA"}
								selected={queryParamsHolder.deliveryStatus}
								options={deliveryStatus}
								selectedItemLabel={"SEM FILTRO"}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({
										...prev,
										deliveryStatus: value as string[],
									}))
								}
								onReset={() =>
									setQueryParamsHolder((prev) => ({
										...prev,
										deliveryStatus: [],
									}))
								}
							/>
							<MultipleSelectInputVirtualized
								width={"100%"}
								label={"ETIQUETAS"}
								selected={queryParamsHolder.tagIds}
								options={tags?.map((tag, index) => ({ id: index + 1, label: tag.titulo, value: tag._id })) || []}
								selectedItemLabel={"SEM FILTRO"}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({
										...prev,
										tagIds: value as string[],
									}))
								}
								onReset={() =>
									setQueryParamsHolder((prev) => ({
										...prev,
										tagIds: [],
									}))
								}
							/>
						</div>

						<div className="flex w-full flex-col gap-2">
							<h1 className="text-primary/80 w-full text-center text-[0.65rem] tracking-tight">FILTRO POR CONDIÇÃO</h1>
							<div className="flex w-full flex-wrap items-center justify-center gap-2">
								<div className="w-fit">
									<CheckboxInput
										labelTrue="APENAS PENDENTES DESENHO"
										labelFalse="APENAS PENDENTES DESENHO"
										checked={queryParamsHolder.pendingDrawingOnly ?? false}
										handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, pendingDrawingOnly: value }))}
									/>
								</div>
								<div className="w-fit">
									<CheckboxInput
										labelTrue="APENAS PENDENTES DIAGRAMA"
										labelFalse="APENAS PENDENTES DIAGRAMA"
										checked={queryParamsHolder.pendingDiagramOnly ?? false}
										handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, pendingDiagramOnly: value }))}
									/>
								</div>
								<div className="w-fit">
									<CheckboxInput
										labelTrue="APENAS PENDENTES VISTORIA"
										labelFalse="APENAS PENDENTES VISTORIA"
										checked={queryParamsHolder.pendingVistoryOnly ?? false}
										handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, pendingVistoryOnly: value }))}
									/>
								</div>
							</div>
						</div>
						<div className="flex w-full flex-col gap-2">
							<h1 className="text-primary/80 w-full text-center text-[0.65rem] tracking-tight">FILTRO POR PERÍODO</h1>
							<DateInput
								label="DEPOIS DE"
								value={formatDate(queryParamsHolder.period.after)}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, after: formatDateInputChange(value, "string") as string } }))
								}
								width="100%"
							/>
							<DateInput
								label="ANTES DE"
								value={formatDate(queryParamsHolder.period.before)}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, before: formatDateInputChange(value, "string") as string } }))
								}
								width="100%"
							/>
							<SelectInput
								label="PARÂMETRO"
								value={queryParamsHolder.period.field}
								options={[
									{ id: 1, label: "DATA DE ASSINATURA DO CONTRATO", value: "contrato.dataAssinatura" },
									{ id: 2, label: "DATA DE LIBERAÇÃO PARA HOMOLOGACAO", value: "homologacao.dataLiberacao" },
									{ id: 3, label: "DATA DE INICIO DA ELABORAÇÃO (DOCS)", value: "homologacao.documentacao.dataInicioElaboracao" },
									{ id: 4, label: "DATA DE CONCLUSÃO DA ELABORAÇÃO (DOCS)", value: "homologacao.documentacao.dataConclusaoElaboracao" },
									{ id: 5, label: "DATA DE LIBERAÇÃO DA PARA ASSINATURA (DOCS)", value: "homologacao.documentacao.dataLiberacao" },
									{ id: 6, label: "DATA DA ASSINATURA (DOCS)", value: "homologacao.documentacao.dataAssinatura" },
									{ id: 7, label: "DATA DE SOLICITAÇÃO DA VISTORIA", value: "homologacao.vistoria.dataSolicitacao" },
									{ id: 8, label: "DATA DE EFETIVAÇÃO DA VISTORIA", value: "homologacao.vistoria.dataEfetivacao" },
									{ id: 9, label: "DATA DE ENTREGA DA COMPRA", value: "compra.dataEntrega" },
									{ id: 10, label: "DATA DE PAGAMENTO DA COMPRA", value: "compra.dataPagamento" },
								]}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({
										...prev,
										period: { ...prev.period, field: value as TEngineeringProjectsKanbanInput["period"]["field"] },
									}))
								}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, field: undefined } }))}
								width={"100%"}
							/>
						</div>
					</div>
					<Button
						onClick={() => {
							updateQueryParams({ ...queryParamsHolder });
							closeMenu();
						}}
					>
						FILTRAR
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default EngineeringProjectsKanbanModePageFilters;
