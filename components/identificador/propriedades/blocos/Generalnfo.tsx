import TextInput from "@/components/inputs/Text";
import type { TProperty } from "@/utils/schemas/properties";
import { LayoutGrid } from "lucide-react";

type GeneralInfoProps = {
	infoHolder: TProperty;
	updateInfoHolder: (info: Partial<TProperty>) => void;
};
export default function GeneralInfo({ infoHolder, updateInfoHolder }: GeneralInfoProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<LayoutGrid size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DA PROPRIEDADE</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="NOME DA PROPRIEDADE"
						placeholder="Preencha o nome da propriedade..."
						value={infoHolder.nome}
						handleChange={(value) => updateInfoHolder({ nome: value })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label="IDENTIFICADOR DA PROPRIEDADE"
						placeholder="Preencha o identificador da propriedade..."
						value={infoHolder.identificador}
						handleChange={(value) => updateInfoHolder({ identificador: value })}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}
