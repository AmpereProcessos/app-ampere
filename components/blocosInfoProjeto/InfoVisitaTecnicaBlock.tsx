import type { TAuthSession } from "@/lib/authentication/types";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { ClipboardList } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import CheckboxInput from "../inputs/Checkbox";
import TextInput from "../inputs/Text";
import TechnicalAnalysis from "./Utils/TechnicalAnalysis";

type InfoVisitaTecnicaBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
	analysisId: string;
	session: TAuthSession;
};
function InfoVisitaTecnicaBlock({ editor, infoHolder, setInfo, changes, setChanges, analysisId, session }: InfoVisitaTecnicaBlockProps) {
	// Return for technical analysis previous to system
	if (!analysisId)
		return (
			<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
				<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
					<ClipboardList className="h-4 w-4 min-h-4 min-w-4" />
					<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE A VISITA TÉCNICA</h1>
				</div>
				<div className="flex w-full flex-col gap-2">
					<div className="w-fit self-center">
						<CheckboxInput
							labelFalse="REALIZADA"
							labelTrue="REALIZADA"
							checked={infoHolder.visitaTecnica?.status === "REALIZADA"}
							handleChange={(value) => {
								setChanges({
									...changes,
									"visitaTecnica.status": value ? "REALIZADA" : "PENDÊNCIA",
								});
								setInfo({
									...infoHolder,
									visitaTecnica: {
										...infoHolder.visitaTecnica,
										status: value ? "REALIZADA" : "PENDÊNCIA",
									},
								});
							}}
						/>
					</div>
					<div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
						<div className="w-full lg:w-1/2">
							<TextInput
								label={"TÉCNICO RESPONSÁVEL"}
								editable={editor}
								value={infoHolder.visitaTecnica?.tecnico ? infoHolder.visitaTecnica?.tecnico : ""}
								placeholder="Preencha o nome do técnico responsável."
								handleChange={(value) => {
									setChanges({
										...changes,
										"visitaTecnica.tecnico": value,
									});
									setInfo({
										...infoHolder,
										visitaTecnica: {
											...infoHolder.visitaTecnica,
											tecnico: value,
										},
									});
								}}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/2">
							<TextInput
								label={"TIPO DA TELHA"}
								editable={editor}
								value={infoHolder.visitaTecnica?.tipoDaTelha ? infoHolder.visitaTecnica?.tipoDaTelha : ""}
								placeholder="Preencha o tipo da telha..."
								handleChange={(value) => {
									setChanges({
										...changes,
										"visitaTecnica.tipoDaTelha": value,
									});
									setInfo({
										...infoHolder,
										visitaTecnica: {
											...infoHolder.visitaTecnica,
											tipoDaTelha: value,
										},
									});
								}}
								width="100%"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	return (
		<TechnicalAnalysis analysisId={analysisId} session={session} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
	);
}

export default InfoVisitaTecnicaBlock;
