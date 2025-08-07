import NumberInput from "@/components/inputs/Number";
import type { TProperty } from "@/utils/schemas/properties";
import { Car } from "lucide-react";

type VehiclePropertiesProps = {
	infoHolder: TProperty;
	updateInfoHolder: (info: Partial<TProperty>) => void;
};
function VehicleProperties({ infoHolder, updateInfoHolder }: VehiclePropertiesProps) {
	if (infoHolder.metadados?.tipo !== "VEÍCULO") return null;
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Car size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DO VEÍCULO</h1>
			</div>
			<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="KILOMETRAGEM INICIAL"
						placeholder="Preencha a kilometragem inicial..."
						value={infoHolder.metadados?.kmInicial}
						handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmInicial: value } })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="KILOMETRAGEM ACUMULADA"
						placeholder="Preencha a kilometragem acumulada..."
						value={infoHolder.metadados?.kmAcumulado}
						handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmAcumulado: value } })}
						editable={false}
						width="100%"
					/>
				</div>
			</div>
			<div className="w-full flex flex-col gap-2">
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">Informações da revisão do veículo.</h1>
				<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
					<div className="w-full lg:w-1/2">
						<NumberInput
							label="KILOMETRAGEM DO INTERVALO DE REVISÃO"
							placeholder="Preencha a kilometragem do intervalo de revisão..."
							value={infoHolder.metadados?.kmIntervaloRevisao}
							handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmIntervaloRevisao: value } })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<NumberInput
							label="KILOMETRAGEM DA PRÓXIMA REVISÃO"
							placeholder="Preencha a kilometragem da próxima revisão..."
							value={infoHolder.metadados?.kmProximaRevisao}
							handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmProximaRevisao: value } })}
							width="100%"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VehicleProperties;
