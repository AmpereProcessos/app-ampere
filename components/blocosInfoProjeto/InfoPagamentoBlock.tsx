import type React from "react";
import { formatDate } from "../../utils/constants";

import { formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import { useCreditors } from "@/utils/methods/query/crm/utils";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import dayjs from "dayjs";
import { CreditCard } from "lucide-react";
import { MdVisibility } from "react-icons/md";
import { ContractRequestPaymentOptions, billableCompanies } from "../../utils/select-options";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import Payment from "../identificador/registrosAlteracoesProjeto/secao/Payment";
import CheckboxInput from "../inputs/Checkbox";
import DateInput from "../inputs/Date";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";
import TextareaInput from "../inputs/TextareaInput";

type InfoPagamentoBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
	updateLogs: TProjectUpdateLogDTO[];
	showADMOnly: boolean;
};
function InfoPagamentoBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs = [], showADMOnly = false }: InfoPagamentoBlockProps) {
	const { data: creditors } = useCreditors();

	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<CreditCard className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE PAGAMENTO</h1>
			</div>
			<UpdateLogsBlock logs={updateLogs} SectionElement={<Payment logs={updateLogs} />} />
			<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"FORMA DE PAGAMENTO"}
						value={infoHolder.pagamento?.forma}
						selectedItemLabel="NÃO DEFINIDO"
						editable={editor}
						options={[
							{ id: 1, label: "CAPITAL PRÓPRIO", value: "CAPITAL PRÓPRIO" },
							{ id: 2, label: "FINANCIAMENTO", value: "FINANCIAMENTO" },
							{ id: 3, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
						]}
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"pagamento.forma": value,
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									forma: value,
								},
							}));
						}}
						onReset={() => {
							setChanges((prev) => ({
								...prev,
								"pagamento.forma": undefined,
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									forma: undefined,
								},
							}));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"MÉTODO DE PAGAMENTO"}
						value={infoHolder.pagamento?.metodo}
						selectedItemLabel="NÃO DEFINIDO"
						editable={editor}
						options={ContractRequestPaymentOptions}
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"pagamento.metodo": value,
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									metodo: value,
								},
							}));
						}}
						onReset={() => {
							setChanges((prev) => ({
								...prev,
								"pagamento.metodo": undefined,
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									metodo: undefined,
								},
							}));
						}}
						width="100%"
					/>
				</div>
			</div>
			{infoHolder.pagamento?.forma === "FINANCIAMENTO" ? (
				<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<SelectInput
							label={"CREDOR"}
							value={infoHolder.pagamento.credor}
							selectedItemLabel="NÃO DEFINIDO"
							editable={editor}
							options={
								creditors?.map((credor, index) => ({
									id: credor._id,
									label: credor.valor,
									value: credor.valor,
								})) || []
							}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"pagamento.credor": value,
								}));
								setInfo((prev) => ({
									...prev,
									pagamento: {
										...prev.pagamento,
										credor: value,
									},
								}));
							}}
							onReset={() => {
								setChanges((prev) => ({
									...prev,
									"pagamento.credor": undefined,
								}));
								setInfo((prev) => ({
									...prev,
									pagamento: {
										...prev.pagamento,
										credor: undefined,
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label={"NOME DO GERENTE"}
							editable={editor}
							value={infoHolder.pagamento?.credorNomeGerente || ""}
							placeholder="Preencha o nome do gerente..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"pagamento.credorNomeGerente": formatToPhone(value),
								}));
								setInfo((prev) => ({
									...prev,
									pagamento: {
										...prev.pagamento,
										credorNomeGerente: formatToPhone(value),
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label={"CONTATO DO GERENTE"}
							editable={editor}
							value={infoHolder.pagamento?.credorContatoGerente || ""}
							placeholder="Preencha o contato do gerente..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"pagamento.credorContatoGerente": formatToPhone(value),
								}));
								setInfo((prev) => ({
									...prev,
									pagamento: {
										...prev.pagamento,
										credorContatoGerente: formatToPhone(value),
									},
								}));
							}}
							width="100%"
						/>
					</div>
				</div>
			) : null}
			<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label={"NOME DO PAGADOR"}
						editable={editor}
						value={infoHolder.pagamento?.pagador || ""}
						placeholder="Preencha o nome do pagador..."
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"pagamento.pagador": value,
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									pagador: value,
								},
							}));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label={"CONTATO DO PAGADOR"}
						editable={editor}
						value={infoHolder.pagamento?.contatoPagador || ""}
						placeholder="Preencha o contato do pagador..."
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"pagamento.contatoPagador": value,
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									contatoPagador: value,
								},
							}));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label={"CPF/CNPJ DO PAGADOR"}
						editable={editor}
						value={infoHolder.pagamento?.cpf_cnpjPagador || ""}
						placeholder="Preencha o contato do pagador..."
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"pagamento.cpf_cnpjPagador": formatToCPForCNPJ(value),
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									cpf_cnpjPagador: formatToCPForCNPJ(value),
								},
							}));
						}}
						width="100%"
					/>
				</div>
			</div>
			<div className="mt-2 w-full px-2">
				<TextareaInput
					label="DESCRIÇÃO DA NEGOCIAÇÃO"
					placeholder="Preencha aqui observações e detalhes relevantes sobre a negociação..."
					value={infoHolder.pagamento.negociacao || ""}
					handleChange={(value) => {
						setInfo((prev) => ({
							...prev,
							pagamento: { ...prev.pagamento, negociacao: value },
						}));
						setChanges((prev) => ({ ...prev, "pagamento.negociacao": value }));
					}}
				/>
			</div>

			<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
				{showADMOnly ? (
					<div className="flex w-full items-center justify-center lg:w-1/2">
						<CheckboxInput
							labelFalse="PAGAMENTO CONCLUÍDO"
							labelTrue="PAGAMENTO CONCLUÍDO"
							checked={!!infoHolder.pagamento.cobrancaFeita}
							handleChange={(value) => {
								setInfo((prev) => ({
									...prev,
									pagamento: {
										...prev.pagamento,
										cobrancaFeita: value,
									},
								}));
								setChanges((prev) => ({
									...prev,
									"pagamento.cobrancaFeita": value,
								}));
							}}
							justify="justify-center"
						/>
					</div>
				) : null}
				<div className="w-full lg:w-1/2">
					<DateInput
						label={"DATA DE RECEBIMENTO"}
						editable={true}
						value={infoHolder.pagamento?.dataRecebimento ? formatDate(infoHolder.pagamento?.dataRecebimento) : undefined}
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"pagamento.dataRecebimento": formatDateInputChange(value, "string"),
							}));
							setInfo((prev) => ({
								...prev,
								pagamento: {
									...prev.pagamento,
									dataRecebimento: formatDateInputChange(value, "string"),
								},
							}));
						}}
						width="100%"
					/>
				</div>
			</div>
			<h1 className="mt-2 w-full text-center font-black text-[#fead41]">FATURAMENTO</h1>
			<div className="mt-2 flex w-full flex-wrap items-center justify-center gap-2 px-2">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="NECESSÁRIO NF ADIANTADA"
						labelTrue="NECESSÁRIO NF ADIANTADA"
						checked={!!infoHolder.faturamento.necessarioNotaFiscalAdiantada}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								faturamento: {
									...prev.faturamento,
									necessarioNotaFiscalAdiantada: value,
								},
							}));
							setChanges((prev) => ({
								...prev,
								"faturamento.necessarioNotaFiscalAdiantada": value,
							}));
						}}
						justify="justify-center"
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="NECESSÁRIO INSCRIÇÃO RURAL"
						labelTrue="NECESSÁRIO INSCRIÇÃO RURAL"
						checked={!!infoHolder.faturamento.necessarioInscricaoRural}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								faturamento: {
									...prev.faturamento,
									necessarioInscricaoRural: value,
								},
							}));
							setChanges((prev) => ({
								...prev,
								"faturamento.necessarioInscricaoRural": value,
							}));
						}}
						justify="justify-center"
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="NECESSÁRIO CÓDIGO FINAME"
						labelTrue="NECESSÁRIO CÓDIGO FINAME"
						checked={!!infoHolder.faturamento.necessarioCodigoFiname}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								faturamento: {
									...prev.faturamento,
									necessarioCodigoFiname: value,
								},
							}));
							setChanges((prev) => ({
								...prev,
								"faturamento.necessarioCodigoFiname": value,
							}));
						}}
						justify="justify-center"
					/>
				</div>
			</div>
			<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"EMPRESA A FATURAR"}
						value={infoHolder.faturamento?.empresaFaturamento}
						selectedItemLabel="NÃO DEFINIDO"
						editable={editor}
						options={billableCompanies}
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"faturamento.empresaFaturamento": value,
							}));
							setInfo((prev) => ({
								...prev,
								faturamento: {
									...prev.faturamento,
									empresaFaturamento: value,
								},
							}));
						}}
						onReset={() => {
							setChanges((prev) => ({
								...prev,
								"faturamento.empresaFaturamento": undefined,
							}));
							setInfo((prev) => ({
								...prev,
								faturamento: {
									...prev.faturamento,
									empresaFaturamento: undefined,
								},
							}));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label={"CNPJ PARA FATURAMENTO"}
						editable={editor}
						value={infoHolder.faturamento?.cnpjFaturamento?.toString()}
						placeholder="Preencha o CNPJ para faturamento..."
						handleChange={(value) => {
							setChanges({
								...changes,
								"faturamento.cnpjFaturamento": formatToCPForCNPJ(value),
							});
							setInfo({
								...infoHolder,
								faturamento: {
									...infoHolder.faturamento,
									cnpjFaturamento: formatToCPForCNPJ(value),
								},
							});
						}}
						width="100%"
					/>
				</div>
			</div>
			{showADMOnly ? (
				<div className="my-2 flex w-full items-center justify-center self-center">
					<CheckboxInput
						labelFalse="FATURAMENTO CONCLUÍDO"
						labelTrue="FATURAMENTO CONCLUÍDO"
						checked={!!infoHolder.faturamento.concluido}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								faturamento: {
									...prev.faturamento,
									concluido: value,
								},
							}));
							setChanges((prev) => ({
								...prev,
								"faturamento.concluido": value,
							}));
						}}
						justify="justify-center"
					/>
				</div>
			) : null}
		</div>
	);
}

export default InfoPagamentoBlock;
