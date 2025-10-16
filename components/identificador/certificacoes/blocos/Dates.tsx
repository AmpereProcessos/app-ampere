import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TUseCertificationState } from "@/utils/state/certification";
import { Calendar } from "lucide-react";

type CertificationDatesProps = {
	certification: TUseCertificationState["state"]["certification"];
	updateCertification: TUseCertificationState["updateCertification"];
};
export default function CertificationDates({ certification, updateCertification }: CertificationDatesProps) {
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="VALIDADE" sectionTitleIcon={<Calendar size={15} />}>
			<div className="w-full flex items-center flex-col lg:flex-row gap-2">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="MEDIDA"
						value={certification.validade.medida}
						handleChange={(value) => updateCertification({ validade: { ...certification.validade, medida: value } })}
						onReset={() => updateCertification({ validade: { ...certification.validade, medida: "DIAS" } })}
						options={[
							{ id: "DIAS", label: "DIAS", value: "DIAS" },
							{ id: "SEMANAS", label: "SEMANAS", value: "SEMANAS" },
							{ id: "MESES", label: "MESES", value: "MESES" },
							{ id: "ANOS", label: "ANOS", value: "ANOS" },
						]}
						selectedItemLabel="NÃO DEFINIDO"
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="VALOR"
						value={certification.validade.valor}
						handleChange={(value) => updateCertification({ validade: { ...certification.validade, valor: value } })}
						placeholder="Preencha o valor da validade"
						width="100%"
					/>
				</div>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}
