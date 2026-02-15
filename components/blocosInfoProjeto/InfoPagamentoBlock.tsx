import type React from "react";
import { formatDate, formatToMoney } from "../../utils/constants";

import type { TAuthSession } from "@/lib/authentication/types";
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from "@/utils/estados_cidades";
import { formatDateAsLocale, formatToCEP, formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { handleProjectTaxesExpenseTrigger } from "@/utils/methods/mutation/triggers";
import { useCreditors } from "@/utils/methods/query/crm/utils";
import { useProjectExpenses } from "@/utils/methods/query/expenses";
import { formatDateInputChange, getCEPInfo } from "@/utils/methods/shared";
import type { TExpenseDTO } from "@/utils/schemas/expenses";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CreditCard, DollarSign, LayoutGrid, MapPin, Pencil, Plus, Receipt, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCalendar } from "react-icons/bs";
import { MdVisibility } from "react-icons/md";
import { ContractRequestPaymentOptions, billableCompanies } from "../../utils/select-options";
import EditExpense from "../identificador/despesas/modals/EditExpense";
import NewExpense from "../identificador/despesas/modals/NewExpense";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import Payment from "../identificador/registrosAlteracoesProjeto/secao/Payment";
import CheckboxInput from "../inputs/Checkbox";
import DateInput from "../inputs/Date";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";
import TextareaInput from "../inputs/TextareaInput";
import { Button } from "../ui/button";
import { LoadingButton } from "../utils/Buttons/LoadingButton";
import ErrorComponent from "../utils/ErrorComponent";
import ResponsiveDialogDrawerSection from "../utils/ResponsiveDialogDrawerSection";
import { InfoBlockSection } from "./Utils/SectionBlock";

type InfoPagamentoBlockProps = {
	sessionUser: TAuthSession;
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
	updateLogs: TProjectUpdateLogDTO[];
	showADMOnly: boolean;
};
function InfoPagamentoBlock({
	sessionUser,
	editor,
	infoHolder,
	setInfo,
	changes,
	setChanges,
	updateLogs = [],
	showADMOnly = false,
}: InfoPagamentoBlockProps) {
	const { data: creditors } = useCreditors();
	async function setAddressDataByCEP(cep: string) {
		const addressInfo = await getCEPInfo(cep);
		const toastID = toast.loading("Buscando informações sobre o CEP...", {
			duration: 2000,
		});
		setTimeout(() => {
			if (addressInfo) {
				toast.dismiss(toastID);
				toast.success("Dados do CEP buscados com sucesso.", {
					duration: 1000,
				});
				setChanges((prev) => ({
					...prev,
					"pagamento.pagador.localizacao.endereco": addressInfo.logradouro,
					"pagamento.pagador.localizacao.bairro": addressInfo.bairro,
					"pagamento.pagador.localizacao.uf": addressInfo.uf,
					"pagamento.pagador.localizacao.cidade": addressInfo.localidade.toUpperCase(),
				}));
				setInfo((prev) => ({
					...prev,
					pagamento: {
						...prev.pagamento,
						pagador: {
							...prev.pagamento.pagador,
							localizacao: {
								...prev.pagamento.pagador.localizacao,
								endereco: addressInfo.logradouro,
								bairro: addressInfo.bairro,
								uf: addressInfo.uf,
								cidade: addressInfo.localidade.toUpperCase(),
							},
						},
					},
				}));
			}
		}, 1000);
	}
	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<CreditCard className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE PAGAMENTO</h1>
			</div>
			<div className="w-full flex flex-col gap-2 px-2">
				<UpdateLogsBlock logs={updateLogs} SectionElement={<Payment logs={updateLogs} />} />
				<CostsInformation
					sessionUser={sessionUser}
					projectName={infoHolder.nomeDoContrato}
					projectId={infoHolder._id}
					projectIdentifier={infoHolder.qtde.toString()}
				/>
				<InfoBlockSection headerTitle="DETALHES" headerIcon={<LayoutGrid className="h-4 w-4 min-h-4 min-w-4" />}>
					<div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
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
						<div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
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
										"pagamento.credorNomeGerente": value,
										}));
										setInfo((prev) => ({
											...prev,
											pagamento: {
												...prev.pagamento,
											credorNomeGerente: value,
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
				</InfoBlockSection>
				<InfoBlockSection headerTitle="PAGADOR" headerIcon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}>
					<div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
						<div className="w-full lg:w-1/2">
							<TextInput
								label={"NOME DO PAGADOR"}
								editable={editor}
								value={infoHolder.pagamento?.pagador?.nome || ""}
								placeholder="Preencha o nome do pagador..."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.nome": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												nome: value,
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>

						<div className="w-full lg:w-1/2">
							<TextInput
								label={"CPF/CNPJ DO PAGADOR"}
								editable={editor}
								value={infoHolder.pagamento?.pagador?.cpfCnpj || ""}
								placeholder="Preencha o contato do pagador..."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.cpfCnpj": formatToCPForCNPJ(value),
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												cpfCnpj: formatToCPForCNPJ(value),
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
					</div>
					<div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
						<div className="w-full lg:w-1/2">
							<TextInput
								label={"EMAIL DO PAGADOR"}
								editable={editor}
								value={infoHolder.pagamento?.pagador?.email || ""}
								placeholder="Preencha o email do pagador..."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.email": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												email: value,
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/2">
							<TextInput
								label={"CONTATO DO PAGADOR"}
								editable={editor}
								value={infoHolder.pagamento?.pagador?.telefone || ""}
								placeholder="Preencha o contato do pagador..."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.telefone": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												telefone: value,
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
					</div>
				</InfoBlockSection>
				<InfoBlockSection headerTitle="LOCALIZAÇÃO DO PAGADOR" headerIcon={<MapPin className="w-4 h-4 min-w-4 min-h-4" />}>
					<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
						<div className="w-full lg:w-1/3">
							<TextInput
								label="CEP"
								value={infoHolder.pagamento?.pagador?.localizacao?.cep || ""}
								placeholder="Preencha aqui o CEP do pagador."
								handleChange={(value) => {
									if (value.length === 9) {
										setAddressDataByCEP(value);
									}
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.cep": formatToCEP(value),
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, cep: formatToCEP(value) },
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/3">
							<SelectInput
								label="ESTADO"
								value={infoHolder.pagamento?.pagador?.localizacao?.uf || ""}
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.uf": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, uf: value },
											},
										},
									}));
								}}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.uf": "",
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, uf: "" },
											},
										},
									}));
								}}
								options={BrazilianStatesOptions}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/3">
							<SelectInput
								label="CIDADE"
								value={infoHolder.pagamento?.pagador?.localizacao?.cidade || ""}
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.cidade": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, cidade: value },
											},
										},
									}));
								}}
								options={BrazilianCitiesOptionsFromUF(infoHolder.pagamento?.pagador?.localizacao?.uf || "")}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.cidade": "",
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, cidade: "" },
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
					</div>
					<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
						<div className="w-full lg:w-1/2">
							<TextInput
								label="BAIRRO"
								value={infoHolder.pagamento?.pagador?.localizacao.bairro || ""}
								placeholder="Preencha aqui o bairro do cliente."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.bairro": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, bairro: value },
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/2">
							<TextInput
								label="LOGRADOURO/RUA"
								value={infoHolder.pagamento?.pagador?.localizacao.endereco || ""}
								placeholder="Preencha aqui o logradouro do cliente."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.endereco": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, endereco: value },
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
					</div>
					<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
						<div className="w-full lg:w-1/2">
							<TextInput
								label="NÚMERO/IDENTIFICADOR"
								value={infoHolder.pagamento?.pagador?.localizacao.numeroOuIdentificador || ""}
								placeholder="Preencha aqui o número ou identificador da residência do cliente."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.numeroOuIdentificador": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, numeroOuIdentificador: value },
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/2">
							<TextInput
								label="COMPLEMENTO"
								value={infoHolder.pagamento?.pagador?.localizacao.complemento || ""}
								placeholder="Preencha aqui algum complemento do endereço."
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"pagamento.pagador.localizacao.complemento": value,
									}));
									setInfo((prev) => ({
										...prev,
										pagamento: {
											...prev.pagamento,
											pagador: {
												...prev.pagamento.pagador,
												localizacao: { ...prev.pagamento.pagador.localizacao, complemento: value },
											},
										},
									}));
								}}
								width="100%"
							/>
						</div>
					</div>
				</InfoBlockSection>
				<InfoBlockSection headerTitle="RECEBIMENTO" headerIcon={<CreditCard className="h-4 w-4 min-h-4 min-w-4" />}>
					<div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
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
				</InfoBlockSection>
				<InfoBlockSection headerTitle="FATURAMENTO" headerIcon={<Receipt className="h-4 w-4 min-h-4 min-w-4" />}>
					<div className="flex w-full flex-wrap items-center justify-center gap-2">
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
					<div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
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
									setChanges((prev) => ({
										...prev,
										"faturamento.cnpjFaturamento": formatToCPForCNPJ(value),
									}));
									setInfo((prev) => ({
										...prev,
										faturamento: {
											...prev.faturamento,
											cnpjFaturamento: formatToCPForCNPJ(value),
										},
									}));
								}}
								width="100%"
							/>
						</div>
					</div>
					{showADMOnly ? (
						<div className="flex w-full items-center justify-center self-center">
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
				</InfoBlockSection>
			</div>
		</div>
	);
}

export default InfoPagamentoBlock;

function CostsInformation({
	sessionUser,
	projectName,
	projectId,
	projectIdentifier,
}: { sessionUser: TAuthSession; projectName: string; projectId: string; projectIdentifier: string }) {
	const [newExpenseMenuIsOpen, setNewExpenseMenuIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const {
		data: expenses,
		queryKey,
		isLoading,
		isSuccess,
		isFetching,
		isError,
		error,
	} = useProjectExpenses({ projectId, enabled: true, identifier: "CUSTOS-FINANCEIROS" });

	const { mutate: handleCreateProjectTaxesExpenseTrigger, isPending } = useMutation({
		mutationKey: ["create-project-taxes-expense"],
		mutationFn: handleProjectTaxesExpenseTrigger,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });
		},
		onSuccess: async (data) => {
			return toast.success(data);
		},
		onError: async (error) => {
			return toast.error(getErrorMessage(error));
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey });
		},
	});

	const isMissingARTCost = isSuccess && !expenses.some((expense) => expense.rateio === "IMPOSTOS");

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="CUSTOS" sectionTitleIcon={<DollarSign size={15} />}>
			<div className="w-full flex items-center justify-end gap-2">
				{isMissingARTCost ? (
					<LoadingButton
						variant="ghost"
						className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
						size="fit"
						loading={isPending}
						onClick={() => handleCreateProjectTaxesExpenseTrigger({ projectId })}
					>
						GERAR CUSTO DE IMPOSTOS
					</LoadingButton>
				) : null}

				<Button variant="ghost" className="flex items-center gap-1.5 px-2 py-1 rounded-lg" size="fit" onClick={() => setNewExpenseMenuIsOpen(true)}>
					<Plus className="w-4 h-4 min-w-4 min-h-4" />
					NOVO CUSTO
				</Button>
			</div>
			{isLoading ? <p className="w-full text-center text-sm font-medium text-primary/80 animate-pulse">Carregando custos...</p> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				expenses.length > 0 ? (
					expenses.map((expense) => <ExpenseItemCard key={expense._id} expense={expense} session={sessionUser} />)
				) : (
					<p className="w-full text-center text-sm font-medium text-primary/80">Nenhum custo encontrado.</p>
				)
			) : null}
			{newExpenseMenuIsOpen ? (
				<NewExpense
					session={sessionUser}
					initialState={{ identificador: "CUSTOS-FINANCEIROS", projeto: { id: projectId, nome: projectName, identificador: projectIdentifier } }}
					closeModal={() => setNewExpenseMenuIsOpen(false)}
				/>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

function ExpenseItemCard({ expense, session }: { expense: TExpenseDTO; session: TAuthSession }) {
	const [editExpenseMenuIsOpen, setEditExpenseMenuIsOpen] = useState(false);
	return (
		<div className="border-primary/20 flex w-full flex-col items-center gap-1 border p-3 shadow-xs rounded">
			<div className="w-full flex items-center justify-between gap-2">
				<h1 className="text-sm font-bold">
					{expense.rateio} - {expense.categoria}
				</h1>
				<h1 className="text-sm font-bold px-2 py-1 rounded-lg bg-primary/20">{formatToMoney(expense.total)} </h1>
			</div>
			<div className="w-full flex items-center justify-between gap-2 flex-col lg:flex-row">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5">
						<BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium">{formatDateAsLocale(expense.efetivacao.data, true)}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						onClick={() => setEditExpenseMenuIsOpen(true)}
						size={"fit"}
						variant={"ghost"}
						className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs"
					>
						<Pencil className="w-4 h-4 min-w-4 min-h-4" />
						EDITAR
					</Button>
				</div>
			</div>
			{editExpenseMenuIsOpen ? <EditExpense expenseId={expense._id} session={session} closeModal={() => setEditExpenseMenuIsOpen(false)} /> : null}
		</div>
	);
}
