import NumberInput from "@/components/inputs/Number";
import type { TProperty } from "@/utils/schemas/properties";

type VehiclePropertiesProps = {
	infoHolder: TProperty;
	updateInfoHolder: (info: Partial<TProperty>) => void;
};
function VehicleProperties({ infoHolder, updateInfoHolder }: VehiclePropertiesProps) {
	return (
		<div className="w-full flex flex-col gap-2">
			<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="KILOMETRAGEM INICIAL"
						placeholder="Preencha a kilometragem inicial..."
						value={infoHolder.metadados.kmInicial}
						handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmInicial: value } })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="KILOMETRAGEM ACUMULADA"
						placeholder="Preencha a kilometragem acumulada..."
						value={infoHolder.metadados.kmAcumulado}
						handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmAcumulado: value } })}
						editable={false}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default VehicleProperties;
