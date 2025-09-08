import type { TAuthSession } from "@/lib/authentication/types";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { ClipboardList } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
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
				<div className="flex flex-wrap justify-around gap-2">
					<div className="flex w-[350px] items-center justify-center">
						<input
							checked={infoHolder.visitaTecnica?.status === "REALIZADA"}
							onChange={(e) => {
								setChanges({
									...changes,
									"visitaTecnica.status": e.target.checked ? "REALIZADA" : "PENDÊNCIA",
								});
								setInfo({
									...infoHolder,
									visitaTecnica: {
										...infoHolder.visitaTecnica,
										status: e.target.checked ? "REALIZADA" : "PENDÊNCIA",
									},
								});
							}}
							type="checkbox"
							name="visitaTecnica"
							id="visitaTecnica"
						/>

						<label className="ml-2" htmlFor="visitaTecnica">
							REALIZADA ?
						</label>
					</div>
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
					/>

					<TextInput
						label={"Tipo da telha"}
						editable={editor}
						value={infoHolder.visitaTecnica?.tipoDaTelha ? infoHolder.visitaTecnica?.tipoDaTelha : ""}
						placeholder="Preencha o tipo da telha."
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
					/>
				</div>
			</div>
		);
	return (
		<TechnicalAnalysis analysisId={analysisId} session={session} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} />
	);
}

export default InfoVisitaTecnicaBlock;
