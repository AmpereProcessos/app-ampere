import type { TExpenseQueryFilters } from "@/utils/schemas/expenses";
import React, { useState } from "react";

import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CostApportionments } from "@/utils/select-options";

type ExpensesFilterMenuProps = {
	queryParams: TExpenseQueryFilters & { page: number };
	updateQueryParams: (params: Partial<TExpenseQueryFilters & { page: number }>) => void;
	closeMenu: () => void;
};
function ExpensesFilterMenu({ queryParams, updateQueryParams, closeMenu }: ExpensesFilterMenuProps) {
	const [queryParamsHolder, setQueryParamsHolder] = useState<TExpenseQueryFilters & { page: number }>(queryParams);

	return (
		<Sheet open onOpenChange={closeMenu}>
			<SheetContent>
				<div className="flex h-full w-full flex-col">
					<SheetHeader>
						<SheetTitle>FILTRAR DESPESAS</SheetTitle>
						<SheetDescription>Escolha aqui parâmetros para filtrar as despesas.</SheetDescription>
					</SheetHeader>

					<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-4 overflow-y-auto overscroll-y-auto p-2">
						<div className="flex w-full flex-col gap-2">
							<MultipleSelectInputVirtualized
								label={"STATUS"}
								selected={queryParamsHolder.status}
								options={[
									{ id: 1, label: "PAGO", value: "PAGO" },
									{ id: 2, label: "PAGO PARCIAL", value: "PAGO PARCIAL" },
									{ id: 3, label: "PENDENTE", value: "PENDENTE" },
								]}
								handleChange={(value) => setQueryParamsHolder((prev) => ({ ...prev, status: value as any[] }))}
								selectedItemLabel={"NÃO DEFINIDO"}
								onReset={() => setQueryParamsHolder((prev) => ({ ...prev, status: [] }))}
								width="100%"
							/>

							<MultipleSelectInput
								label="RATEIOS"
								selected={queryParamsHolder.apportionments}
								handleChange={(value) => {
									setQueryParamsHolder((prev) => ({ ...prev, apportionments: value as string[] }));
									localStorage.setItem("expenses-apportionments-filter", JSON.stringify(value));
								}}
								options={CostApportionments.map((c, index) => ({ id: index + 1, label: c.nome, value: c.nome }))}
								onReset={() => {
									setQueryParamsHolder((prev) => ({ ...prev, apportionments: [] }));
									localStorage.setItem("expenses-apportionments-filter", JSON.stringify([]));
								}}
								selectedItemLabel="NÃO DEFINIDO"
								width="100%"
							/>

							<MultipleSelectInput
								label="CATEGORIAS"
								selected={queryParamsHolder.categories}
								handleChange={(value) => {
									setQueryParamsHolder((prev) => ({ ...prev, categories: value as string[] }));
									localStorage.setItem("expenses-categories-filter", JSON.stringify(value));
								}}
								options={CostApportionments.flatMap((c) => c.categorias).map((c, index) => ({ id: index + 1, label: c.label, value: c.value }))}
								onReset={() => {
									setQueryParamsHolder((prev) => ({ ...prev, categories: [] }));
									localStorage.setItem("expenses-categories-filter", JSON.stringify([]));
								}}
								selectedItemLabel="NÃO DEFINIDO"
								width="100%"
							/>
						</div>
					</div>
					<Button
						onClick={() => {
							updateQueryParams({ ...queryParamsHolder, page: 1 });
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

export default ExpensesFilterMenu;
