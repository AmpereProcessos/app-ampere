import { formatDate } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { TProjectWithClientDTO } from "@/utils/schemas/projects";
import dayjs from "dayjs";
import { CheckCheck } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import DateInput from "../inputs/Date";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";
import TextareaInput from "../inputs/TextareaInput";

type InfoComissionamentoBlockProps = {
	editor: boolean;
	infoHolder: TProjectWithClientDTO;
	setInfo: Dispatch<SetStateAction<TProjectWithClientDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
};
function InfoComissionamentoBlock({ editor, infoHolder, setInfo, changes, setChanges }: InfoComissionamentoBlockProps) {
	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<CheckCheck className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">COMISSIONAMENTO PÓS-BRA</h1>
			</div>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col items-center justify-center gap-2 px-2">
					<SelectInput
						label="STATUS DO COMISSIONAMENTO"
						options={[
							{ id: 1, label: "CONCLUÍDO", value: "CONCLUÍDO" },
							{ id: 2, label: "PENDÊNCIAS", value: "PENDÊNCIAS" },
						]}
						value={infoHolder.conferencias.status}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								conferencias: { ...prev.conferencias, status: value },
							}));
							setChanges((prev) => ({ ...prev, "conferencias.status": value }));
						}}
						onReset={() => {
							setInfo((prev) => ({
								...prev,
								conferencias: { ...prev.conferencias, status: null },
							}));
							setChanges((prev) => ({ ...prev, "conferencias.status": null }));
						}}
						width="100%"
					/>

					<TextareaInput
						label="OBSERVAÇÕES SOBRE O COMISSIONAMENTO"
						placeholder="Preencha aqui detalhes, pendências e qualquer outra observação em relação ao comissionamento pós-obra do projeto."
						value={infoHolder.conferencias.observacoes || ""}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								conferencias: { ...prev.conferencias, observacoes: value },
							}));
							setChanges((prev) => ({
								...prev,
								"conferencias.observacoes": value,
							}));
						}}
					/>
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
					<div className="w-full lg:w-1/4">
						<SelectInput
							label={"DIAGNÓSTICO"}
							value={infoHolder.oem?.diagnostico ? infoHolder.oem?.diagnostico : "NÃO DEFINIDO"}
							editable={editor}
							options={[
								{
									id: 1,
									label: "MICRO/INVERSOR DESCONFIGURADO",
									value: "MICRO/INVERSOR DESCONFIGURADO",
								},
								{
									id: 2,
									label: "CLIENTE SEM INTERNET",
									value: "CLIENTE SEM INTERNET",
								},
								{
									id: 3,
									label: "TEMPO DE O&M VENCIDO",
									value: "TEMPO DE O&M VENCIDO",
								},
								{
									id: 4,
									label: "EQUIPAMENTOS PARA GARANTIA",
									value: "EQUIPAMENTOS PARA GARANTIA",
								},
								{
									id: 5,
									label: "ROTEADOR INCOMPATÍVEL",
									value: "ROTEADOR INCOMPATÍVEL",
								},
								{ id: 6, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
							]}
							onReset={() => {
								setChanges((prev) => ({ ...prev, "oem.diagnostico": null }));
								setInfo((prev) => ({
									...prev,
									oem: {
										...prev.oem,
										diagnostico: null,
									},
								}));
							}}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(value) => {
								setChanges((prev) => ({ ...prev, "oem.diagnostico": value }));
								setInfo((prev) => ({
									...prev,
									oem: {
										...prev.oem,
										diagnostico: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<DateInput
							label={"DATA DE USINA LIGADA"}
							editable={editor}
							value={formatDate(infoHolder.conferencias.usinaLigada.data)}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"conferencias.usinaLigada.data": formatDateAsLocale(value),
									"conferencias.usinaLigada.status": value ? "REALIZADO" : "NÃO REALIZADO",
								}));
								setInfo((prev) => ({
									...prev,
									conferencias: {
										...prev.conferencias,
										usinaLigada: {
											data: formatDateAsLocale(value),
											status: value ? "REALIZADO" : "NÃO REALIZADO",
										},
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<DateInput
							label={"DATA DE MONITORAMENTO FEITO"}
							editable={editor}
							value={formatDate(infoHolder.conferencias.monitoramentoFeito.data)}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"conferencias.monitoramentoFeito.data": formatDateAsLocale(value),
									"conferencias.monitoramentoFeito.status": value ? "REALIZADO" : "NÃO REALIZADO",
								}));
								setInfo((prev) => ({
									...prev,
									conferencias: {
										...prev.conferencias,
										monitoramentoFeito: {
											data: formatDateAsLocale(value),
											status: value ? "REALIZADO" : "NÃO REALIZADO",
										},
									},
								}));
							}}
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<DateInput
							label={"ENERGIA INJETADA"}
							editable={editor}
							value={formatDate(infoHolder.conferencias.energiaInjetada.data)}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"conferencias.energiaInjetada.data": formatDateAsLocale(value),
									"conferencias.energiaInjetada.status": value ? "REALIZADO" : "NÃO REALIZADO",
								}));
								setInfo((prev) => ({
									...prev,
									conferencias: {
										...prev.conferencias,
										energiaInjetada: {
											data: formatDateAsLocale(value),
											status: value ? "REALIZADO" : "NÃO REALIZADO",
										},
									},
								}));
							}}
							width="100%"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<DateInput
							label={"DATA DE CRIAÇÃO DO APP"}
							editable={editor}
							value={formatDate(infoHolder.app.data)}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"app.data": formatDateAsLocale(value),
								}));
								setInfo((prev) => ({
									...prev,
									app: { ...prev.app, data: formatDateAsLocale(value) },
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label={"LOGIN NO APP"}
							placeholder="Preencha aqui a credência de login do usuário p/ o aplicativo de monitoramento."
							value={infoHolder.app.login ? infoHolder.app.login : ""}
							editable={true}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"app.login": value,
								}));
								setInfo((prev) => ({
									...prev,
									app: {
										...prev.app,
										login: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label={"SENHA NO APP"}
							placeholder="Preencha aqui a credencial de senha do usuário p/ o aplicativo de monitoramento."
							value={infoHolder.app.senha?.toString() || ""}
							editable={true}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"app.senha": value,
								}));
								setInfo((prev) => ({
									...prev,
									app: {
										...prev.app,
										senha: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InfoComissionamentoBlock;
