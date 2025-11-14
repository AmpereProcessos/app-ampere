import CheckboxInput from "@/components/inputs/Checkbox";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import TextInput from "@/components/inputs/Text";
import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { UseInstallationStructureExecutionProjectsFilters, UsePAExecutionProjectsFilters } from "@/utils/methods/query/execution";
import { HomologationControlStatus } from "@/utils/select-options";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type StructuresAdequationsFilterMenuProps = {
	filterMenuIsOpen: boolean;
	filters: UseInstallationStructureExecutionProjectsFilters;
	setFilters: React.Dispatch<React.SetStateAction<UseInstallationStructureExecutionProjectsFilters>>;
};
function StructuresAdequationsFilterMenu({ filterMenuIsOpen, filters, setFilters }: StructuresAdequationsFilterMenuProps) {
	return (
		<AnimatePresence>
			{filterMenuIsOpen ? (
				<motion.div
					key={"editor"}
					variants={GeneralVisibleHiddenExitMotionVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="bg-background border-primary/20 mt-2 flex w-full flex-col gap-2 rounded-md border p-2"
				>
					<h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
					<div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
						<TextInput
							label="NOME DO PROJETO"
							placeholder="Preencha aqui o nome do projeto..."
							value={filters.search}
							handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
							width="100%"
						/>

						<MultipleSelectInput
							label="CATEGORIA"
							labelClassName="text-xs font-medium tracking-tight text-black"
							selected={filters.segments}
							handleChange={(value) => setFilters((prev) => ({ ...prev, segments: value as string[] }))}
							options={[
								{ id: 1, value: "COMERCIAL", label: "COMERCIAL" },
								{ id: 2, value: "INDUSTRIAL", label: "INDUSTRIAL" },
								{ id: 3, value: "RESIDENCIAL", label: "RESIDENCIAL" },
								{ id: 4, value: "RURAL", label: "RURAL" },
							]}
							selectedItemLabel="NÃO DEFINIDO"
							onReset={() => setFilters((prev) => ({ ...prev, segments: [] }))}
						/>
					</div>
					<div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
						<div className="w-fit">
							<CheckboxInput
								labelFalse="PENDÊNCIAS DE PAGAMENTO"
								labelTrue="PENDÊNCIAS DE PAGAMENTO"
								checked={filters.pendingPaid}
								handleChange={(value) => setFilters((prev) => ({ ...prev, pendingPaid: value }))}
							/>
						</div>
						<div className="w-fit">
							<CheckboxInput
								labelFalse="PENDÊNCIAS DE ENTREGA"
								labelTrue="PENDÊNCIAS DE ENTREGA"
								checked={filters.pendingDelivery}
								handleChange={(value) => setFilters((prev) => ({ ...prev, pendingDelivery: value }))}
							/>
						</div>
						<div className="w-fit">
							<CheckboxInput
								labelFalse="PENDÊNCIAS APTAS PARA EXECUÇÃO"
								labelTrue="PENDÊNCIAS APTAS PARA EXECUÇÃO"
								checked={filters.pendingReady}
								handleChange={(value) => setFilters((prev) => ({ ...prev, pendingReady: value }))}
							/>
						</div>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}

export default StructuresAdequationsFilterMenu;
