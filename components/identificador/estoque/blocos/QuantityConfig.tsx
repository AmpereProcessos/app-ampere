import NumberInput from "@/components/inputs/Number";
import type { TMaterial } from "@/utils/schemas/materials";
import { Box } from "lucide-react";

type QuantityConfigBlockProps = {
	infoHolder: TMaterial;
	updateInfoHolder: (changes: Partial<TMaterial>) => void;
};

function QuantityConfigBlock({ infoHolder, updateInfoHolder }: QuantityConfigBlockProps) {
	return (
		<div className="w-full flex flex-col gap-3">
			<div className="w-fit flex items-center justify-start gap-2 rounded-lg bg-primary/20 px-4 py-1.5">
				<Box className="w-4 h-4 min-w-4 min-h-4" />
				<h1 className="w-full text-start text-xs font-medium leading-none tracking-tight">INFORMAÇÕES DE CONTROLE DE QUANTIDADE</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label={"QUANTIDADE MÁXIMA"}
						value={infoHolder.qtdeMaxima || null}
						handleChange={(value) => updateInfoHolder({ qtdeMaxima: value })}
						placeholder="Preencha a quantidade máxima do material..."
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label={"QUANTIDADE MÍNIMA"}
						value={infoHolder.qtdeMinima || null}
						handleChange={(value) => updateInfoHolder({ qtdeMinima: value })}
						placeholder="Preencha a quantidade mínima do material..."
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default QuantityConfigBlock;
