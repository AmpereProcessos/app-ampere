import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TUseCertificationState } from "@/utils/state/certification";
import { LayoutGrid } from "lucide-react";

type CertificationGeneralProps = {
	certification: TUseCertificationState["state"]["certification"];
	updateCertification: TUseCertificationState["updateCertification"];
};
export default function CertificationGeneral({ certification, updateCertification }: CertificationGeneralProps) {
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="INFORMAÇÕES GERAIS" sectionTitleIcon={<LayoutGrid size={15} />}>
			<TextInput
				label="TÍTULO"
				placeholder="Preencha o título da certificação"
				value={certification.titulo}
				handleChange={(value) => updateCertification({ titulo: value })}
				width="100%"
			/>
			<TextareaInput
				label="DESCRIÇÃO"
				placeholder="Preencha a descrição da certificação"
				value={certification.descricao}
				handleChange={(value) => updateCertification({ descricao: value })}
			/>
		</ResponsiveDialogDrawerSection>
	);
}
