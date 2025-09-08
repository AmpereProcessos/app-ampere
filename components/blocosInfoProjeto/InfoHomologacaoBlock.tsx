import type { TAuthSession } from "@/lib/authentication/types";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { GitBranchPlus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import AccessInformation from "../Homologations/AccessInformation";
import DocumentationInformation from "../Homologations/DocumentationInformation";
import EquipmentsComposition from "../Homologations/EquipmentsComposition";
import HolderInformation from "../Homologations/HolderInformation";
import InstallationInformation from "../Homologations/InstallationInformation";
import LocationInformation from "../Homologations/LocationInformation";
import PendenciesInformation from "../Homologations/PendenciesInformation";
import StatusInformation from "../Homologations/StatusInformation";
import UpdatesInformation from "../Homologations/UpdatesInformation";
import VistoryInformation from "../Homologations/VistoryInformation";
import CheckboxInput from "../inputs/Checkbox";
import CheckboxWithDate from "../inputs/CheckboxWithDate";
import TextareaInput from "../inputs/TextareaInput";

type InfoHomologacaoBlockProps = {
	session: TAuthSession;
	infoHolder: TProjectDTOWithHomologation;
	setInfo: Dispatch<SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
};
function InfoHomologacaoBlock({ session, infoHolder, setInfo, changes, setChanges }: InfoHomologacaoBlockProps) {
	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<GitBranchPlus className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">HOMOLOGAÇÃO E PROJETO</h1>
			</div>
			<div className="flex w-full flex-col gap-2 px-2">
				<PendenciesInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
				<div className="my-4 flex w-full items-center justify-center">
					<div className="w-fit">
						<CheckboxInput
							labelFalse="REALIZAR HOMOLOGAÇÃO"
							labelTrue="REALIZAR HOMOLOGAÇÃO"
							checked={infoHolder.homologacao.homologar}
							handleChange={(value) => {
								setInfo((prev) => ({ ...prev, homologacao: { ...prev.homologacao, homologar: value } }));
								setChanges((prev) => ({ ...prev, "homologacao.homologar": value }));
							}}
						/>
					</div>
					<div className="w-fit">
						<CheckboxWithDate
							labelFalse="INICIAR PROJETO"
							labelTrue="INICIAR PROJETO"
							date={infoHolder.homologacao.dataLiberacao ? new Date(infoHolder.homologacao.dataLiberacao) : null}
							handleChange={(value) => {
								setInfo((prev) => ({ ...prev, homologacao: { ...prev.homologacao, dataLiberacao: value } }));
								setChanges((prev) => ({ ...prev, "homologacao.dataLiberacao": value }));
							}}
						/>
					</div>
				</div>
				{infoHolder.homologacao.homologar ? (
					<>
						<TextareaInput
							label="OBSERVAÇÕES SOBRE A HOMOLOGAÇÃO"
							placeholder="Preencha aqui informações relevantes sobre a homologação."
							value={infoHolder.homologacao.observacoes || ""}
							handleChange={(value) => {
								setInfo((prev) => ({ ...prev, homologacao: { ...prev.homologacao, observacoes: value } }));
								setChanges((prev) => ({ ...prev, "homologacao.observacoes": value }));
							}}
						/>

						{/* <ActivitiesInformation session={session} homologation={homologation} opportunity={homologation.oportunidade} /> */}
						<UpdatesInformation session={session} infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />

						<StatusInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
						{/* <ApplicantBlock infoHolder={infoHolder} setInfoHolder={setInfo } /> */}
						<HolderInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
						{/* <HomologationFiles session={session} homologationId={homologationId} /> */}
						<InstallationInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
						<LocationInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
						<EquipmentsComposition infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
						<DocumentationInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
						<AccessInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
						<VistoryInformation infoHolder={infoHolder} setInfoHolder={setInfo} changes={changes} setChanges={setChanges} />
					</>
				) : null}
				<div className="my-4 flex w-full items-center justify-center">
					<div className="w-fit">
						<CheckboxInput
							labelFalse="PROJETO/HOMOLOGAÇÃO CONCLUÍDOS"
							labelTrue="PROJETO/HOMOLOGAÇÃO CONCLUÍDOS"
							checked={!!infoHolder.homologacao.dataEfetivacao}
							handleChange={(value) => {
								setInfo((prev) => ({ ...prev, homologacao: { ...prev.homologacao, dataEfetivacao: value ? new Date().toISOString() : null } }));
								setChanges((prev) => ({ ...prev, "homologacao.dataEfetivacao": value ? new Date().toISOString() : null }));
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InfoHomologacaoBlock;
