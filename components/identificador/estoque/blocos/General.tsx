import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TagsInput from "@/components/inputs/TagsInput";
import TextInput from "@/components/inputs/Text";
import type { TMaterial } from "@/utils/schemas/materials";
import { units } from "@/utils/select-options";
import { Layout } from "lucide-react";

type MaterialGeneralBlockProps = {
	infoHolder: TMaterial;
	updateInfoHolder: (changes: Partial<TMaterial>) => void;
};

function MaterialGeneralBlock({ infoHolder, updateInfoHolder }: MaterialGeneralBlockProps) {
	return (
		<div className="w-full flex flex-col gap-3">
			<div className="w-fit flex items-center justify-start gap-2 rounded-lg bg-primary/20 px-4 py-1.5">
				<Layout className="w-4 h-4 min-w-4 min-h-4" />
				<h1 className="w-full text-start text-xs font-medium leading-none tracking-tight">INFORMAÇÕES GERAIS</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label={"NOME DO MATERIAL"}
						value={infoHolder.nome}
						handleChange={(value) => updateInfoHolder({ nome: value })}
						placeholder="Preencha o nome do material..."
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label={"SKU DO MATERIAL"}
						value={infoHolder.sku || ""}
						handleChange={(value) => updateInfoHolder({ sku: value })}
						placeholder="Preencha o sku do material..."
						width="100%"
					/>
				</div>
			</div>
			<TextInput
				label={"NOME TÉCNICO DO MATERIAL"}
				value={infoHolder.nomeTecnico || ""}
				handleChange={(value) => updateInfoHolder({ nomeTecnico: value })}
				placeholder="Preencha o nome técnico do material..."
				width="100%"
			/>

			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label={"PREÇO UNITÁRIO DO ITEM"}
						value={infoHolder.preco}
						handleChange={(value) => updateInfoHolder({ preco: value })}
						placeholder="Preencha o preço unitário do material..."
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label={"QUANTIDADE DO ITEM"}
						value={infoHolder.qtde}
						handleChange={(value) => updateInfoHolder({ qtde: value })}
						placeholder="Preencha o preço unitário do material..."
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"GRANDEZA"}
						value={infoHolder.grandeza}
						options={units}
						handleChange={(value) => updateInfoHolder({ grandeza: value })}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => updateInfoHolder({ grandeza: null })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label={"LOCALIZAÇÃO DO MATERIAL"}
						value={infoHolder.localizacao || ""}
						handleChange={(value) => updateInfoHolder({ localizacao: value })}
						placeholder="Preencha a localização do material..."
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default MaterialGeneralBlock;
