import DateInput from "@/components/inputs/Date";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import Avatar from "@/components/utils/Avatar";
import { cn } from "@/lib/utils";
import { equipesTecnicas, formatDate, serviceOrdersCategories, serviceOrderUrgencyOptions } from "@/utils/constants";
import { formatDateAsLocale, formatToPhone } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import { ServiceOrderStatus } from "@/utils/select-options";
import React from "react";
import toast from "react-hot-toast";
import { BsCalendarPlus } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { TbUrgent } from "react-icons/tb";

type ServiceOrderGeneralInformationBlockProps = {
	predefinedCategories?: { id: number; label: string; value: string }[];
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
	project?: TServiceOrderProject;
};
function ServiceOrderGeneralInformationBlock({ infoHolder, updateInfoHolder, predefinedCategories, project }: ServiceOrderGeneralInformationBlockProps) {
	function handleEffectivationUpdate(newValue: TServiceOrder["status"], previousData: TServiceOrder) {
		if (newValue === "CONCLUÍDA") {
			if (previousData.status !== "CONCLUÍDA") return new Date().toISOString();
			return previousData.dataEfetivacao;
		}
		if (previousData.status === "CONCLUÍDA") return null;
		return previousData.dataEfetivacao;
	}
	function handleUseProjectInformation(project: TServiceOrderProject | undefined) {
		if (!project) return toast.error("Dados do projeto não encontrados.");
		updateInfoHolder({
			descricao: `${project?.tipoDeServico} DO(A) ${project?.nomeDoContrato}`,
			favorecido: {
				nome: project?.nomeDoContrato,
				contato: project?.telefone?.toString() || "",
			},
			responsavel: {
				nome: project?.obra?.equipeResp || "",
				tipo: project?.obra?.equipeResp ? "INTERNO" : "EXTERNO",
			},
		});
	}
	const isServiceOrderInformationEqualToProject = Object.values({
		description: project ? infoHolder.descricao === `${project?.tipoDeServico} DO(A) ${project?.nomeDoContrato}` : false,
		favoredName: project ? infoHolder.favorecido?.nome === project?.nomeDoContrato : false,
		favoredPhone: project ? infoHolder.favorecido?.contato === project?.telefone : false,
		responsibleName: project ? infoHolder.responsavel?.nome === project?.obra?.equipeResp : false,
	}).every((r) => r);
	return (
		<div className="flex w-full flex-col items-center gap-4">
			<div className="flex w-full flex-wrap items-center justify-center gap-2">
				<div className="flex items-center gap-2">
					<p className="text-xs font-medium text-gray-500">CRIADO POR:</p>
					<Avatar fallback={"U"} height={25} width={25} url={infoHolder?.autor?.avatar_url} />
					<p className="text-xs font-medium text-gray-500">{infoHolder?.autor?.nome || "Autor não identificado"}</p>
				</div>
				<div className="flex items-center gap-2">
					<BsCalendarPlus />
					<p className="text-xs font-medium text-gray-500">{formatDateAsLocale(infoHolder?.dataInsercao, true)}</p>
				</div>
			</div>
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES GERAIS</h1>
			<div className="flex w-full items-center justify-end">
				{project && !isServiceOrderInformationEqualToProject ? (
					<button
						type="button"
						onClick={() => handleUseProjectInformation(project)}
						className={cn("flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400")}
					>
						<MdContentCopy size={12} />
						<h1 className="text-[0.65rem] font-medium tracking-tight">UTILIZAR DADOS DO PROJETO</h1>
					</button>
				) : null}
			</div>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="DESCRIÇÃO DO SERVIÇO"
							placeholder="Preencha a descrição do serviço..."
							value={infoHolder.descricao}
							handleChange={(value) => updateInfoHolder({ descricao: value })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="CATEGORIA DO SERVIÇO"
							value={infoHolder.categoria}
							options={serviceOrdersCategories}
							handleChange={(value) => updateInfoHolder({ categoria: value })}
							width="100%"
							selectedItemLabel="NÃO DEFINIDO"
							onReset={() => updateInfoHolder({ categoria: serviceOrdersCategories[0].value as TServiceOrder["categoria"] })}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="STATUS DO SERVIÇO"
							value={infoHolder.status}
							options={ServiceOrderStatus}
							handleChange={(value) => updateInfoHolder({ status: value, dataEfetivacao: handleEffectivationUpdate(value, infoHolder) })}
							width="100%"
							selectedItemLabel="NÃO DEFINIDO"
							onReset={() => updateInfoHolder({ status: "PENDENTE" })}
						/>
					</div>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="NOME DO FAVORECIDO"
							placeholder="Preencha o nome do favorecido..."
							value={infoHolder.favorecido?.nome}
							handleChange={(value) => updateInfoHolder({ favorecido: { ...infoHolder.favorecido, nome: value } })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<TextInput
							label="CONTATO DO FAVORECIDO"
							placeholder="Preencha o contato do favorecido..."
							value={infoHolder.favorecido?.contato}
							handleChange={(value) => updateInfoHolder({ favorecido: { ...infoHolder.favorecido, contato: formatToPhone(value) } })}
							width="100%"
						/>
					</div>
				</div>
				<h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">RESPONSÁVEIS</h1>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<SelectInput
							label={"TIPO DE RESPONSÁVEL"}
							value={infoHolder.responsavel.tipo}
							options={[
								{ id: 1, label: "INTERNO", value: "INTERNO" },
								{ id: 2, label: "EXTERNO", value: "EXTERNO" },
							]}
							selectedItemLabel={"NÃO DEFINIDO"}
							handleChange={(value) => updateInfoHolder({ responsavel: { ...infoHolder.responsavel, tipo: value } })}
							onReset={() => updateInfoHolder({ responsavel: { ...infoHolder.responsavel, tipo: "EXTERNO" } })}
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/2">
						{infoHolder.responsavel.tipo === "EXTERNO" ? (
							<TextInput
								label={"NOME DO RESPONSÁVEL"}
								placeholder={"Preencha o nome do responsável pela execução..."}
								value={infoHolder.responsavel.nome || ""}
								handleChange={(value) => updateInfoHolder({ responsavel: { ...infoHolder.responsavel, nome: value } })}
								width={"100%"}
							/>
						) : (
							<SelectInput
								label={"EQUIPE RESPONSÁVEL"}
								value={infoHolder.responsavel.nome}
								options={equipesTecnicas.map((team, index) => ({ ...team, id: index + 1 }))}
								selectedItemLabel={"NÃO DEFINIDO"}
								handleChange={(value) => updateInfoHolder({ responsavel: { ...infoHolder.responsavel, nome: value } })}
								onReset={() => updateInfoHolder({ responsavel: { ...infoHolder.responsavel, nome: "" } })}
								width={"100%"}
							/>
						)}
					</div>
				</div>

				<h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">LIBERAÇÃO DA ORDEM DE SERVIÇO</h1>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<DateInput
							label="DATA DE PREVISÃO P/ LIBERAÇÃO"
							value={formatDate(infoHolder.dataPrevisaoLiberacao)}
							handleChange={(value) =>
								updateInfoHolder({
									dataPrevisaoLiberacao: formatDateInputChange(value, "string") as string,
								})
							}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<DateInput
							label="DATA DE LIBERAÇÃO"
							value={formatDate(infoHolder.dataLiberacao)}
							handleChange={(value) =>
								updateInfoHolder({
									dataLiberacao: formatDateInputChange(value, "string") as string,
								})
							}
							width="100%"
						/>
					</div>
				</div>
				<h1 className="text-sm font-medium tracking-tight text-primary/80">URGÊNCIA DA ORDEM DE SERVIÇO</h1>
				<div className="flex w-full flex-wrap items-center justify-around gap-4">
					{serviceOrderUrgencyOptions.map((urgency) => (
						<button
							type="button"
							key={urgency.value}
							onClick={() =>
								updateInfoHolder({
									urgencia: infoHolder.urgencia !== urgency.value ? (urgency.value as TServiceOrder["urgencia"]) : "POUCO URGENTE",
								})
							}
							className={cn(
								"flex items-center gap-2 rounded border px-4 py-2 duration-300 ease-in-out",
								urgency.textColor,
								urgency.backgroundColor,
								urgency.value === infoHolder.urgencia ? "opacity-100 hover:opacity-80" : "opacity-40 hover:opacity-70",
								urgency.value === infoHolder.urgencia ? urgency.borderColor : "border-transparent",
							)}
						>
							<TbUrgent size={16} />
							<h1 className="text-xs font-bold tracking-tighter">{urgency.label}</h1>
						</button>
					))}
				</div>
				<TextareaInput
					label="ANOTAÇÕES"
					placeholder="Preencha as anotações do serviço..."
					value={infoHolder.anotacoes || ""}
					handleChange={(value) => updateInfoHolder({ anotacoes: value })}
				/>
			</div>
		</div>
	);
}

export default ServiceOrderGeneralInformationBlock;
