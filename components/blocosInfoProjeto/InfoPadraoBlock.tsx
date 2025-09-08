import type React from "react";

import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { Cable } from "lucide-react";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import EnergyPA from "../identificador/registrosAlteracoesProjeto/secao/EnergyPA";
import CheckboxInput from "../inputs/Checkbox";
import DateInput from "../inputs/Date";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";

type InfoPadraoBlockProps = {
	comercialEdition: boolean;
	technicalEdition: boolean;
	infoHolder: TProjectDTO;
	setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
	updateLogs: TProjectUpdateLogDTO[];
	showPaymentInfo: boolean;
	showPaymentOnly: boolean;
};
function InfoPadraoBlock({
	comercialEdition,
	technicalEdition,
	infoHolder,
	setInfo,
	changes,
	setChanges,
	updateLogs = [],
	showPaymentInfo = true,
	showPaymentOnly = false,
}: InfoPadraoBlockProps) {
	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<Cable className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE PADRÃO DE ENERGIA</h1>
			</div>
			<UpdateLogsBlock logs={updateLogs} SectionElement={<EnergyPA logs={updateLogs} />} />
			<div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
				<div className="w-full lg:w-1/4">
					<TextInput
						label={"AMPERAGEM"}
						placeholder="Preencha a amperagem do padrão..."
						editable={technicalEdition}
						value={infoHolder.visitaTecnica?.amperagem ? infoHolder.visitaTecnica.amperagem : ""}
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"visitaTecnica.amperagem": value,
							}));
							setInfo((prev) => ({
								...prev,
								visitaTecnica: {
									...prev.visitaTecnica,
									amperagem: value,
								},
							}));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<SelectInput
						label={"TIPO DO PADRÃO"}
						editable={technicalEdition}
						value={infoHolder.padrao.tipo ? infoHolder.padrao.tipo : "NÃO DEFINIDO"}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "CONTRA A REDE", value: "CONTRA A REDE" },
							{ id: 2, label: "A FAVOR DA REDE", value: "A FAVOR DA REDE" },
							{ id: 3, label: "CONSTRUIR", value: "CONSTRUIR" },
							{ id: 4, label: "SUBESTAÇÃO", value: "SUBESTAÇÃO" },
							{ id: 5, label: "REFORMA DE PADRÃO", value: "REFORMA DE PADRÃO" },
							{ id: 6, label: "N/A", value: "N/A" },
							{ id: 7, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
						]}
						handleChange={(value) => {
							setChanges((prev) => ({ ...prev, "padrao.tipo": value }));
							setInfo((prev) => ({
								...prev,
								padrao: { ...infoHolder.padrao, tipo: value },
							}));
						}}
						onReset={() => {
							setChanges((prev) => ({
								...prev,
								"padrao.tipo": "NÃO DEFINIDO",
							}));
							setInfo((prev) => ({
								...prev,
								padrao: { ...infoHolder.padrao, tipo: "NÃO DEFINIDO" },
							}));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<SelectInput
						label={"TIPO DE ENTRADA"}
						value={infoHolder.padrao.tipoEntrada ? infoHolder.padrao.tipoEntrada : "NÃO DEFINIDO"}
						selectedItemLabel="NÃO DEFINIDO"
						editable={technicalEdition}
						options={[
							{ id: 1, label: "AÉREA", value: "AÉREA" },
							{ id: 2, label: "SUBTERRÂNEO", value: "SUBTERRÂNEO" },
						]}
						handleChange={(value) => {
							setChanges((prev) => ({ ...prev, "padrao.tipoEntrada": value }));
							setInfo((prev) => ({
								...prev,
								padrao: {
									...prev.padrao,
									tipoEntrada: value as TProjectDTO["padrao"]["tipoEntrada"],
								},
							}));
						}}
						onReset={() => {
							setChanges((prev) => ({
								...prev,
								"padrao.tipoEntrada": undefined,
							}));
							setInfo((prev) => ({
								...prev,
								padrao: {
									...prev.padrao,
									tipoEntrada: undefined,
								},
							}));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<SelectInput
						label={"TIPO DE SAÍDA"}
						editable={technicalEdition}
						value={infoHolder.visitaTecnica.saidaDoCliente ? infoHolder.visitaTecnica.saidaDoCliente : "N/A"}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "SUBTERRANEO", value: "SUBTERRANEO" },
							{ id: 2, label: "AEREO", value: "AEREO" },
							{ id: 3, label: "N/A", value: "N/A" },
						]}
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"visitaTecnica.saidaDoCliente": value,
							}));
							setInfo((prev) => ({
								...prev,
								visitaTecnica: {
									...prev.visitaTecnica,
									saidaDoCliente: value as TProjectDTO["visitaTecnica"]["saidaDoCliente"],
								},
							}));
						}}
						onReset={() => {
							setChanges((prev) => ({
								...prev,
								"visitaTecnica.saidaDoCliente": undefined,
							}));
							setInfo((prev) => ({
								...prev,
								visitaTecnica: {
									...prev.visitaTecnica,
									saidaDoCliente: undefined,
								},
							}));
						}}
						width="100%"
					/>
				</div>
			</div>
			<div className="my-4 flex w-full items-center justify-center self-center">
				<CheckboxInput
					labelFalse="NECESSÁRIO AUMENTO DE CARGA"
					labelTrue="NECESSÁRIO AUMENTO DE CARGA"
					checked={!!infoHolder.padrao.aumentoCarga.aplicavel}
					handleChange={(value) => {
						setInfo((prev) => ({
							...prev,
							padrao: {
								...prev.padrao,
								aumentoCarga: { ...prev.padrao.aumentoCarga, aplicavel: value },
							},
						}));
						setChanges((prev) => ({
							...prev,
							"padrao.aumentoCarga.aplicavel": value,
						}));
					}}
				/>
			</div>
			{infoHolder.padrao.aumentoCarga.aplicavel ? (
				<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
					<div className="w-full lg:w-1/4">
						<DateInput
							label="DATA DE REALIZAÇÃO DO AUMENTO DE CARGA"
							value={formatDate(infoHolder.padrao.aumentoCarga.dataEfetivacao)}
							handleChange={(value) => {
								setInfo((prev) => ({
									...prev,
									padrao: {
										...prev.padrao,
										aumentoCarga: {
											...prev.padrao.aumentoCarga,
											dataEfetivacao: formatDateInputChange(value, "string"),
										},
									},
								}));
								setChanges((prev) => ({
									...prev,
									"padrao.aumentoCarga.dataEfetivacao": formatDateInputChange(value),
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<SelectInput
							label={"PAGAMENTO DO PADRÃO"}
							editable={comercialEdition}
							value={infoHolder.padrao?.respPagamento}
							selectedItemLabel="NÃO DEFINIDO"
							options={[
								{
									id: 1,
									label: "CLIENTE IRÁ COMPRAR EM SEPARADO",
									value: "CLIENTE IRÁ COMPRAR EM SEPARADO",
								},
								{
									id: 2,
									label: "CLIENTE PAGAR POR FORA",
									value: "CLIENTE PAGAR POR FORA",
								},
								{
									id: 3,
									label: "INCLUSO NO CONTRATO",
									value: "INCLUSO NO CONTRATO",
								},
								{
									id: 4,
									label: "NÃO HAVERA TROCA PADRÃO",
									value: "NÃO HAVERA TROCA PADRÃO",
								},
							]}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"padrao.respPagamento": value,
								}));
								setInfo((prev) => ({
									...prev,
									padrao: { ...prev.padrao, respPagamento: value },
								}));
							}}
							onReset={() => {
								setChanges((prev) => ({
									...prev,
									"padrao.respPagamento": null,
								}));
								setInfo((prev) => ({
									...prev,
									padrao: { ...prev.padrao, respPagamento: null },
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<SelectInput
							label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
							editable={comercialEdition || technicalEdition}
							value={infoHolder.padrao?.respInstalacao ? infoHolder.padrao?.respInstalacao : "NÃO SE APLICA"}
							selectedItemLabel="NÃO DEFINIDO"
							options={[
								{ id: 1, label: "AMPERE", value: "AMPERE" },
								{ id: 2, label: "CLIENTE", value: "CLIENTE" },
								{ id: 3, label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
							]}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"padrao.respInstalacao": value,
								}));
								setInfo((prev) => ({
									...prev,
									padrao: { ...prev.padrao, respInstalacao: value },
								}));
							}}
							onReset={() => {
								setChanges((prev) => ({
									...prev,
									"padrao.respInstalacao": null,
								}));
								setInfo((prev) => ({
									...prev,
									padrao: { ...prev.padrao, respInstalacao: null },
								}));
							}}
							width="100%"
						/>
					</div>
					{showPaymentInfo ? (
						<div className="w-full lg:w-1/4">
							<NumberInput
								label={"VALOR DO PADRÃO"}
								placeholder="Preencha o valor do padrão..."
								editable={comercialEdition}
								value={infoHolder.padrao.valor || null}
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"padrao.valor": value,
									}));
									setInfo((prev) => ({
										...prev,
										padrao: { ...prev.padrao, valor: value },
									}));
								}}
								width="100%"
							/>
						</div>
					) : null}

					{showPaymentInfo ? <></> : null}
				</div>
			) : null}
			<div className="my-4 flex w-full items-center justify-center self-center">
				<CheckboxInput
					labelFalse="POSSUI CAIXA CONJUGADA"
					labelTrue="POSSUI CAIXA CONJUGADA"
					checked={infoHolder.padrao.caixaConjugada === "SIM"}
					handleChange={(value) => {
						setInfo((prev) => ({
							...prev,
							padrao: {
								...prev.padrao,
								caixaConjugada: value ? "SIM" : "NÃO",
							},
						}));
						setChanges((prev) => ({
							...prev,
							"padrao.caixaConjugada": value ? "SIM" : "NÃO",
						}));
					}}
				/>
			</div>
		</div>
	);
}

export default InfoPadraoBlock;
