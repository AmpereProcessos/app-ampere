import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { Route } from "lucide-react";
import Link from "next/link";
import React, { type SetStateAction, type Dispatch } from "react";
import CheckboxInput from "../inputs/Checkbox";

type InfoJornadaBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
	updateLogs: TProjectUpdateLogDTO[];
};
function InfoJornadaBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs = [] }: InfoJornadaBlockProps) {
	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<Route className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">JORNADA DO CLIENTE</h1>
			</div>
			<div className="flex w-full px-2">
				<div className="flex w-full flex-wrap items-center justify-around gap-3 rounded border border-cyan-500 p-2">
					<div className="flex w-full items-center justify-between gap-2">
						<h1 className="text-start text-xs font-bold leading-none tracking-tight text-cyan-500">JORNADA DO CLIENTE</h1>
						<div className="flex items-center gap-1 rounded-full border border-blue-500 px-2 py-1 text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white">
							<Link href={`/publico/jornada-do-cliente/${infoHolder._id}`}>
								<div className="text-[0.65rem] font-bold">LINK DA JORNADA</div>
							</Link>
						</div>
					</div>
					<CheckboxInput
						labelFalse={"BOAS VINDAS"}
						labelTrue={"BOAS VINDAS"}
						checked={!!infoHolder.jornada.boasVindas}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, boasVindas: value },
							}));
							setChanges((prev) => ({ ...prev, "jornada.boasVindas": value }));
						}}
					/>
					<CheckboxInput
						labelFalse={"ASSINATURA DAS DOCUMENTAÇÕES"}
						labelTrue={"ASSINATURA DAS DOCUMENTAÇÕES"}
						checked={!!infoHolder.jornada.assDocumentacoes}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, assDocumentacoes: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.assDocumentacoes": value,
							}));
						}}
					/>
					<CheckboxInput
						labelFalse={"COMPRA DO KIT"}
						labelTrue={"COMPRA DO KIT"}
						checked={!!infoHolder.jornada.compraDoKit}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, compraDoKit: value },
							}));
							setChanges((prev) => ({ ...prev, "jornada.compraDoKit": value }));
						}}
					/>
					<CheckboxInput
						labelFalse={"NF FATURADA"}
						labelTrue={"NF FATURADA"}
						checked={!!infoHolder.jornada.nfFaturada}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, nfFaturada: value },
							}));
							setChanges((prev) => ({ ...prev, "jornada.nfFaturada": value }));
						}}
					/>
					<CheckboxInput
						labelFalse={"PREVISÃO DE ENTREGA"}
						labelTrue={"PREVISÃO DE ENTREGA"}
						checked={!!infoHolder.jornada.prevChegada}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, prevChegada: value },
							}));
							setChanges((prev) => ({ ...prev, "jornada.prevChegada": value }));
						}}
					/>
					<CheckboxInput
						labelFalse={"RESPOSTA DA CONCESSIONÁRIA"}
						labelTrue={"RESPOSTA DA CONCESSIONÁRIA"}
						checked={!!infoHolder.jornada.respConcessionaria}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, respConcessionaria: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.respConcessionaria": value,
							}));
						}}
					/>
					<CheckboxInput
						labelFalse={"KIT ENTREGUE"}
						labelTrue={"KIT ENTREGUE"}
						checked={!!infoHolder.jornada.entregaDoKit}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, entregaDoKit: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.entregaDoKit": value,
							}));
						}}
					/>
					<CheckboxInput
						labelFalse={"INSTALAÇÃO AGENDADA"}
						labelTrue={"INSTALAÇÃO AGENDADA"}
						checked={!!infoHolder.jornada.instalacaoAgendada}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, instalacaoAgendada: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.instalacaoAgendada": value,
							}));
						}}
					/>
					<CheckboxInput
						labelFalse={"INSTALAÇÃO REALIZADA"}
						labelTrue={"INSTALAÇÃO REALIZADA"}
						checked={!!infoHolder.jornada.instalacaoRealizada}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, instalacaoRealizada: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.instalacaoRealizada": value,
							}));
						}}
					/>
					<CheckboxInput
						labelFalse={"VISTORIA DA CONCESSIONÁRIA"}
						labelTrue={"VISTORIA DA CONCESSIONÁRIA"}
						checked={!!infoHolder.jornada.vistoriaConcessionaria}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, vistoriaConcessionaria: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.vistoriaConcessionaria": value,
							}));
						}}
					/>
					<CheckboxInput
						labelFalse={"SISTEMA LIGADO"}
						labelTrue={"SISTEMA LIGADO"}
						checked={!!infoHolder.jornada.sistemaLigado}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, sistemaLigado: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.sistemaLigado": value,
							}));
						}}
					/>
					<CheckboxInput
						labelFalse={"JORNADA CONCLUIDA"}
						labelTrue={"JORNADA CONCLUIDA"}
						checked={!!infoHolder.jornada.jornadaConcluida}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								jornada: { ...prev.jornada, jornadaConcluida: value },
							}));
							setChanges((prev) => ({
								...prev,
								"jornada.jornadaConcluida": value,
							}));
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default InfoJornadaBlock;
