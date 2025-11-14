import { TTotemSimulation } from "@/utils/schemas/totem-simulation";
import React from "react";
import NumberInput from "@/components/inputs/Number";

type FirstStageProps = {
	infoHolder: TTotemSimulation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TTotemSimulation>>;
};
function FirstStage({ infoHolder, setInfoHolder }: FirstStageProps) {
	return (
		<div className="flex w-full flex-col items-center gap-10 text-center">
			{/** SECTION TITLE */}
			<div className="flex w-full flex-col gap-0.5 self-center">
				<p className="text-primary text-center text-lg font-medium">Simule o investimento e o retorno que você terá obtendo nossos serviços de</p>
				<p className="text-xl font-black text-[#15599a] dark:text-[#fead41]">Operação & Manutenção !</p>
			</div>
			{/** SECTION INPUTS */}
			<div className="flex w-full flex-col gap-3">
				<NumberInput
					label="QUANTOS PAINÉIS FOTOVOLTAICOS VOCÊ POSSUI?"
					labelClassName="text-primary text-start tracking-tighter text-xs"
					placeholder="Preencha o número de módulos..."
					holderClassName="border-primary/30"
					value={infoHolder.premissas.numModulos || null}
					handleChange={(value) => {
						setInfoHolder((prev) => ({
							...prev,
							premissas: {
								...prev.premissas,
								numModulos: Number(value),
							},
						}));
					}}
					width="100%"
				/>
				<NumberInput
					label="LEMBRA QUAL A POTÊNCIA PICO DO SEU SISTEMA? (OPCIONAL)"
					labelClassName="text-primary text-start tracking-tighter text-xs"
					placeholder="Preencha a potência pico se souber..."
					holderClassName="border-primary/30"
					value={infoHolder.premissas.potenciaPico || null}
					handleChange={(value) => {
						setInfoHolder((prev) => ({
							...prev,
							premissas: {
								...prev.premissas,
								potenciaPico: Number(value),
							},
						}));
					}}
					width="100%"
				/>
			</div>
		</div>
	);
}

export default FirstStage;
