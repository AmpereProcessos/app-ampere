import dayjs from "dayjs";
import React, { type Dispatch, type SetStateAction } from "react";

import { contractStatus } from "../../utils/select-options";
import type { TProjectComissionedUser, TProjectDTO } from "@/utils/schemas/projects";
import CheckboxInput from "../inputs/Checkbox";
import SelectInput from "../inputs/Select";
import DateInput from "../inputs/Date";
import { formatDate, formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import NumberInput from "../inputs/Number";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import Contract from "../identificador/registrosAlteracoesProjeto/secao/Contract";
import CheckboxWithDate from "../inputs/CheckboxWithDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { BadgeCheck, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaPercent } from "react-icons/fa";

type InfoContratoBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
	project: TProjectDTO;
	updateLogs: TProjectUpdateLogDTO[];
	showPaymentInfo?: boolean;
};
function InfoContratoBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs = [], showPaymentInfo = false }: InfoContratoBlockProps) {
	return (
		<div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
			<span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">INFORMAÇÕES DO CONTRATO</span>
			<UpdateLogsBlock logs={updateLogs} SectionElement={<Contract logs={updateLogs} />} />
			<div className="mt-2 flex w-full items-center justify-center">
				<div className="w-full lg:w-1/2">
					<SelectInput
						editable={editor}
						label="FORMA DE ASSINATURA"
						options={[
							{ id: 1, label: "FISICO", value: "FISICO" },
							{ id: 2, label: "DIGITAL", value: "DIGITAL" },
							{ id: 3, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
						]}
						value={infoHolder.contrato.formaAssinatura}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, formaAssinatura: value } }));
							setChanges((prev) => ({ ...prev, "contrato.formaAssinatura": value }));
						}}
						onReset={() => {
							setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, formaAssinatura: "NÃO DEFINIDO" } }));
							setChanges((prev) => ({ ...prev, "contrato.formaAssinatura": "NÃO DEFINIDO" }));
						}}
						width="100%"
					/>
				</div>
			</div>
			<div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
				<div className="w-full lg:w-1/4">
					<SelectInput
						editable={editor}
						label="STATUS DO CONTRATO"
						options={contractStatus}
						value={infoHolder.contrato.status}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, status: value } }));
							setChanges((prev) => ({ ...prev, "contrato.status": value }));
						}}
						onReset={() => {
							setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, status: "NÃO DEFINIDO" } }));
							setChanges((prev) => ({ ...prev, "contrato.status": "NÃO DEFINIDO" }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<DateInput
						label="DATA DE SOLICITAÇÃO"
						value={infoHolder.contrato.dataSolicitacao ? formatDate(infoHolder.contrato.dataSolicitacao) : undefined}
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, dataSolicitacao: formatDateInputChange(value, "string") } }));
							setChanges((prev) => ({ ...prev, "contrato.dataSolicitacao": formatDateInputChange(value) }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<DateInput
						label="DATA DE LIBERAÇÃO"
						value={infoHolder.contrato.dataLiberacao ? formatDate(infoHolder.contrato.dataLiberacao) : undefined}
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, dataLiberacao: formatDateInputChange(value, "string") } }));
							setChanges((prev) => ({ ...prev, "contrato.dataLiberacao": formatDateInputChange(value) }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<DateInput
						label="DATA DE ASSINATURA"
						value={infoHolder.contrato.dataAssinatura ? formatDate(infoHolder.contrato.dataAssinatura) : undefined}
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, contrato: { ...prev.contrato, dataAssinatura: formatDateInputChange(value, "string") } }));
							setChanges((prev) => ({ ...prev, "contrato.dataAssinatura": formatDateInputChange(value) }));
						}}
						width="100%"
					/>
				</div>
			</div>
			{showPaymentInfo ? (
				<div className="w-full flex flex-col gap-2 px-2 mt-2">
					<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
						<div className="w-full lg:w-1/2">
							<DateInput
								label="DATA DE REFERÊNCIA PARA COMISSÃO"
								value={infoHolder.comissoes?.dataReferencia ? formatDate(infoHolder.comissoes?.dataReferencia) : undefined}
								handleChange={(value) => {
									setInfo((prev) => ({ ...prev, comissoes: { ...(prev.comissoes || {}), dataReferencia: formatDateInputChange(value, "string") } }));
									setChanges((prev) => ({ ...prev, "comissoes.dataReferencia": formatDateInputChange(value, "string") }));
								}}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/2">
							<NumberInput
								label="VALOR COMISSIONÁVEL"
								placeholder="Preencha o valor comissionável..."
								editable={editor}
								value={infoHolder.comissoes?.valorComissionavel || null}
								handleChange={(value) => {
									setInfo((prev) => ({ ...prev, comissoes: { ...(prev.comissoes || {}), valorComissionavel: value } }));
									setChanges((prev) => ({ ...prev, "comissoes.valorComissionavel": value }));
								}}
								width="100%"
							/>
						</div>
					</div>
					<div className="w-full flex flex-col gap-2">
						<p className="text-sm font-bold leading-none tracking-tight">COMISSIONADOS</p>
						{infoHolder.comissoes?.comissionados && infoHolder.comissoes?.comissionados.length > 0 ? (
							infoHolder.comissoes?.comissionados.map((comissionedUser) => (
								<ComissionableUsersCard key={comissionedUser.idCrm} comissionedUser={comissionedUser} comissionableValue={infoHolder.comissoes?.valorComissionavel || 0} />
							))
						) : (
							<h1 className="w-full py-1 text-center text-sm italic text-gray-500">Nenhum comissionado cadastrado...</h1>
						)}
					</div>
				</div>
			) : null}

			<div className="mt-2 flex w-full items-center justify-center">
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="PROCESSO COMERCIAL CONCLUÍDO"
						labelTrue="PROCESSO COMERCIAL CONCLUÍDO"
						date={infoHolder.dataValidacaoComercial ? new Date(infoHolder.dataValidacaoComercial) : null}
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, dataValidacaoComercial: value }));
							setChanges((prev) => ({ ...prev, dataValidacaoComercial: value }));
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default InfoContratoBlock;

type ComissionableUsersCardProps = {
	comissionedUser: TProjectComissionedUser;
	comissionableValue: number;
};
function ComissionableUsersCard({ comissionedUser, comissionableValue }: ComissionableUsersCardProps) {
	return (
		<div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
			<div className="w-full flex items-center justify-between gap-2 flex-col lg:flex-row">
				<div className="flex items-center gap-2">
					<Avatar className="h-5 w-5 min-h-5 min-w-5">
						<AvatarImage src={comissionedUser.avatar_url || undefined} alt={comissionedUser.nome} />
						<AvatarFallback>{formatNameAsInitials(comissionedUser.nome || "NA")}</AvatarFallback>
					</Avatar>
					<p className="text-sm font-bold leading-none tracking-tight">{comissionedUser.nome}</p>
					<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80">
						<BadgeDollarSign className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className="font-black text-[0.57rem]">{formatToMoney(comissionedUser.valor || (comissionedUser.porcentagem * comissionableValue) / 100)}</p>
					</div>
					<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80">
						<FaPercent className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className="font-black text-[0.57rem]">{formatDecimalPlaces(comissionedUser.porcentagem)}%</p>
					</div>
					<div
						className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {
							"bg-orange-100 text-orange-700": !comissionedUser.dataEfetivacao,
							"bg-green-100 text-green-700": comissionedUser.dataEfetivacao,
						})}
					>
						<BadgeCheck className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.57rem]")}>{comissionedUser.dataEfetivacao ? "COMISSÕES EFETIVADAS" : "VALORES NÃO EFETIVADOS"}</p>
					</div>
					<div
						className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {
							"bg-orange-100 text-orange-700": !comissionedUser.dataPagamento,
							"bg-green-100 text-green-700": comissionedUser.dataPagamento,
						})}
					>
						<BadgeDollarSign className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.57rem]")}>{comissionedUser.dataPagamento ? "PAGAMENTO DE COMISSÕES REALIZADO" : "PAGAMENTO DE COMISSÕES NÃO REALIZADO"}</p>
					</div>
					<div
						className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {
							"bg-orange-100 text-orange-700": !comissionedUser.dataValidacao,
							"bg-green-100 text-green-700": comissionedUser.dataValidacao,
						})}
					>
						<BadgeCheck className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.57rem]")}>{comissionedUser.dataValidacao ? "VALIDAÇÕES RELIZADAS" : "VALIDAÇÕES PENDENTES"}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
