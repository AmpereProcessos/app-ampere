import CheckboxInput from "@/components/inputs/Checkbox";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import TextInput from "@/components/inputs/Text";
import type { TEnergyPAExecutionWithFiltersInput } from "@/pages/api/gestao-obras/padroes";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import React, { useState } from "react";
import DateInput from "@/components/inputs/Date";
import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import SelectInput from "@/components/inputs/Select";
import { Button } from "@/components/ui/button";
import { HomologationControlStatus } from "@/utils/select-options";

type PAAdequationsFilterMenuProps = {
	queryParams: TEnergyPAExecutionWithFiltersInput;
	updateQueryParams: (params: Partial<TEnergyPAExecutionWithFiltersInput>) => void;
	closeMenu: () => void;
};
function PAAdequationsFilterMenu({ queryParams, updateQueryParams, closeMenu }: PAAdequationsFilterMenuProps) {
	const [queryParamsHolder, setQueryParamsHolder] = useState<TEnergyPAExecutionWithFiltersInput>(queryParams);
	return (
		<Sheet open onOpenChange={closeMenu}>
			<SheetContent>
				<div className="flex h-full w-full flex-col">
					<SheetHeader>
						<SheetTitle>FILTRAR CLIENTES</SheetTitle>
						<SheetDescription>Escolha aqui parâmetros para filtrar o banco de clientes.</SheetDescription>
					</SheetHeader>
					<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-4 overflow-y-auto overscroll-y-auto p-2">
						<div className="flex w-full flex-col gap-2">
							<TextInput
								label="PESQUISA"
								value={queryParamsHolder.search || ""}
								placeholder={"Preenha aqui pelo título ou descrição do chamado para filtro."}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, search: value }))}
								width={"100%"}
							/>

							<MultipleSelectInput
								label="CATEGORIA"
								labelClassName="text-xs font-medium tracking-tight text-black"
								selected={queryParamsHolder.segments}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, segments: value as string[] }))}
								options={[
									{ id: 1, value: "COMERCIAL", label: "COMERCIAL" },
									{ id: 2, value: "INDUSTRIAL", label: "INDUSTRIAL" },
									{ id: 3, value: "RESIDENCIAL", label: "RESIDENCIAL" },
									{ id: 4, value: "RURAL", label: "RURAL" },
								]}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => setQueryParamsHolder((prev) => ({ ...prev, segments: [] }))}
								width={"100%"}
							/>

							<MultipleSelectInput
								label="TIPO DE RESPONSABILIDADE"
								labelClassName="text-xs font-medium tracking-tight text-black"
								selected={queryParamsHolder.responsabilityTypes}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, responsabilityTypes: value as string[] }))}
								options={[
									{ id: 1, label: "AMPERE", value: "AMPERE" },
									{ id: 2, label: "CLIENTE", value: "CLIENTE" },
									{ id: 3, label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
								]}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => setQueryParamsHolder((prev) => ({ ...prev, responsabilityTypes: [] }))}
								width={"100%"}
							/>
							<MultipleSelectInput
								label="STATUS DO PARECER DE ACESSO"
								labelClassName="text-xs font-medium tracking-tight text-black"
								selected={queryParamsHolder.homologationStatus}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, homologationStatus: value as string[] }))}
								options={HomologationControlStatus}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => setQueryParamsHolder((prev) => ({ ...prev, homologationStatus: [] }))}
								width={"100%"}
							/>
						</div>

						<div className="flex w-full flex-col gap-2">
							<h1 className="text-primary/80 w-full text-center text-[0.65rem] tracking-tight">FILTRO POR CONDIÇÃO</h1>
							<div className="flex w-full flex-wrap items-center justify-center gap-2">
								<div className="w-fit">
									<CheckboxInput
										labelTrue="APENAS NÃO EXECUTADOS"
										labelFalse="APENAS NÃO EXECUTADOS"
										checked={queryParamsHolder.pendingExecutionOnly}
										handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, pendingExecutionOnly: value }))}
									/>
								</div>
								<div className="w-fit">
									<CheckboxInput
										labelTrue="APENAS PAGOS"
										labelFalse="APENAS PAGOS"
										checked={queryParamsHolder.paidOnly}
										handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, paidOnly: value }))}
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
									{ id: 1, label: "DATA DE CONCLUSÃO DA ELABORAÇÃO DA DOCUMENTAÇÃO", value: "homologacao.documentacao.dataConclusaoElaboracao" },
									{ id: 2, label: "DATA DE ASSINATURA DA DOCUMENTAÇÃO", value: "homologacao.documentacao.dataAssinatura" },
									{ id: 3, label: "DATA DE RESPOSTA DA SOLICITAÇÃO DE ACESSO", value: "homologacao.acesso.dataResposta" },
									{ id: 4, label: "DATA DE EFETIVAÇÃO DA VISTORIA", value: "homologacao.vistoria.dataEfetivacao" },
									{ id: 5, label: "DATA DE EFETIVAÇÃO DO AUMENTO DE CARGA", value: "padrao.aumentoCarga.dataEfetivacao" },
								]}
								handleChange={(value) =>
									setQueryParamsHolder((prev) => ({
										...prev,
										period: { ...prev.period, field: value as TEnergyPAExecutionWithFiltersInput["period"]["field"] },
									}))
								}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => setQueryParamsHolder((prev) => ({ ...prev, period: { ...prev.period, field: null } }))}
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

export default PAAdequationsFilterMenu;
