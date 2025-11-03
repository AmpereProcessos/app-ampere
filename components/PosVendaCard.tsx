import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import { updateProject } from "@/utils/methods/mutation/clients";
import type { TProjectDTO } from "@/utils/schemas/projects";
import ModalDatabase from "./ModalDatabase";

import { formatDateAsLocale } from "@/utils/methods/formatting";
import CheckboxInput from "./inputs/Checkbox";

import type { TAuthSession } from "@/lib/authentication/types";
import { getDifferenceBetweenDates } from "@/utils/methods/dates";
import { getErrorMessage } from "@/utils/methods/handlers";
import { handleOpportunityOnJourneyEndTrigger } from "@/utils/methods/mutation/triggers";
import dayjs from "dayjs";
import { Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { BsCalendarFill, BsCheckAll, BsUnlockFill } from "react-icons/bs";
import { FaExpandArrowsAlt, FaSignature, FaSolarPanel, FaStore } from "react-icons/fa";
import { MdOutlineCheckBox } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import ProjectActivityCard from "./identificador/atividades/ProjectActivityCard";
import { Button } from "./ui/button";
import { LoadingButton } from "./utils/Buttons/LoadingButton";
import ProjectCardsTags from "./utils/ProjectCardsTags";
import ResponsiveDialogDrawer from "./utils/ResponsiveDialogDrawer";

function getBarColor(lastContact: string | undefined | null) {
	if (!lastContact) return "bg-red-500";
	const sinceLastContact = dayjs().diff(lastContact, "day");
	if (sinceLastContact >= 7) return "bg-red-500";
	return "bg-blue-500";
}

function DeliveryInfo({ expectedAt, deliveredAt }: { expectedAt?: string | null; deliveredAt?: string | null }) {
	if (deliveredAt)
		return (
			<h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">
				ENTREGUE EM: <strong className="text-cyan-500">{formatDateAsLocale(deliveredAt)}</strong> (HÁ{" "}
				<strong className="text-cyan-500">{getDifferenceBetweenDates({ start: deliveredAt, end: new Date() })} DIAS</strong> )
			</h1>
		);

	if (expectedAt)
		return (
			<h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">
				PREVISTO PARA: {formatDateAsLocale(expectedAt)} (EM{" "}
				<strong className="text-cyan-500">{getDifferenceBetweenDates({ start: expectedAt, end: new Date() })} DIAS</strong> )
			</h1>
		);

	return <h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">ENTREGA INDEFINIDA</h1>;
}

function AccessInfo({ approvedAt }: { approvedAt?: string | null }) {
	if (approvedAt)
		return (
			<h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">
				PARECER APROVADO EM: <strong className="text-cyan-500">{formatDateAsLocale(approvedAt)}</strong> (HÁ{" "}
				<strong className="text-cyan-500">{getDifferenceBetweenDates({ start: approvedAt, end: new Date() })} DIAS</strong> )
			</h1>
		);

	return <h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">PARECER NÃO APROVADO</h1>;
}

type JourneyStage = { ordem: number; titulo: string; concluido?: boolean | null; dataConclusao?: string | null };

function JourneySection({
	stages,
	isPending,
	onUpdateStages,
}: {
	stages: JourneyStage[];
	isPending: boolean;
	onUpdateStages: (updated: JourneyStage[]) => void;
}) {
	return (
		<div className="flex w-full flex-wrap justify-around gap-3">
			{stages.map((stage, index) => (
				<div key={`${stage.ordem}-${stage.titulo}`} className="w-fit">
					<CheckboxInput
						editable={!isPending}
						labelFalse={stage.titulo}
						labelTrue={stage.titulo}
						checked={!!stage.concluido}
						handleChange={(value) => {
							const updatedStages = stages.map((s, i) =>
								i === index ? { ...s, concluido: value, dataConclusao: value ? new Date().toISOString() : null } : s,
							);
							onUpdateStages(updatedStages);
						}}
					/>
				</div>
			))}
		</div>
	);
}

type PosVendaCardProps = {
	session: TAuthSession;
	projectId: string;
	project: TProjectDTO;
	mode: "CARD" | "SIMPLIFIED";
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
		onError?: () => void;
	};
};
function PosVendaCard({ session, projectId, project, mode, callbacks }: PosVendaCardProps) {
	const [infoHolder, setInfo] = useState(project);

	const [activitiesMenuIsOpen, setActivitiesMenuIsOpen] = useState<boolean>(false);
	const [modalProjectIsOpen, setModalProjectIsOpen] = useState<boolean>(false);
	const [conclusionMenuIsOpen, setConclusionMenuIsOpen] = useState<boolean>(false);
	const stages = "estagios" in project.jornada ? project.jornada.estagios : [];
	type ProjectPatch = Record<string, unknown>;
	const { mutate: handleUpdateProject, isPending } = useMutation({
		mutationKey: ["update-after-sales-project"],
		mutationFn: async ({ id, changes }: { id: string; changes: ProjectPatch }) => {
			await updateProject({ id, changes });
			if (changes["jornada.dataEfetivacao"]) await handleOpportunityOnJourneyEndTrigger({ projectId: id });
			return "Projeto atualizado com sucesso !";
		},
		onMutate: () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			toast.success("Projeto atualizado com sucesso !");
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError();
			toast.error(getErrorMessage(error));
		},
		onSettled: () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
	});
	const openActivitiesCount = project.atividades ? project.atividades.filter((a) => !a.dataConclusao).length : 0;

	if (mode === "CARD")
		return (
			<div className="font border-primary/20 flex w-full gap-2 rounded-md border shadow-xs">
				<div className={`h-full w-[7px] ${getBarColor(project.jornada.dataUltimaInteracao)} rounded-tl-md rounded-bl-md`} />
				<div className="flex w-full grow flex-col p-3">
					<div className="flex w-full flex-col items-start justify-between lg:flex-row lg:items-center">
						<div className="flex min-w-fit flex-wrap items-center gap-2">
							<h1 className="leading-none font-bold tracking-tight">
								<strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
							</h1>
							<div className="w-fit">
								<ProjectCardsTags projectTags={project.etiquetas} />
							</div>
						</div>

						<div className="mt-2 flex w-full items-center justify-center gap-2 lg:mt-0 lg:w-fit lg:justify-end">
							<div className="text-primary/60 flex items-center gap-2">
								<BsCalendarFill />
								<p className="text-xs font-medium">
									{project.jornada.dataUltimaInteracao ? formatDateAsLocale(project.jornada.dataUltimaInteracao) : "SEM CONTATO"}
								</p>
							</div>
							<button
								type="button"
								onClick={() => {
									handleUpdateProject({ id: projectId, changes: { "jornada.dataUltimaInteracao": new Date().toISOString() } });
									setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, dataUltimaInteracao: new Date().toISOString() } }));
								}}
								className="hover:bg-primary/70 flex items-center gap-1 rounded bg-black px-4 py-2 text-xs font-medium text-white duration-300 ease-in-out"
							>
								<p>CONTATO RECENTE</p>
								<BsCheckAll size={18} />
							</button>
						</div>
					</div>
					<div className="flex w-full flex-col gap-2">
						<h1 className="w-full text-start text-xs leading-none font-bold tracking-tight text-cyan-500">INFORMAÇÕES GERAIS</h1>
						<div className="flex w-full flex-col flex-wrap items-center justify-between gap-2 md:flex-row">
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">TELEFONE</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.telefone}</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">VENDEDOR</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.vendedor.nome}</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">TIPO DE SERVIÇO</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.tipoDeServico}</h1>
							</div>
							{project.seguro?.aplicavel ? (
								<div className="flex flex-col items-center rounded bg-green-100 p-1 lg:items-start">
									<h1 className="text-[0.6rem] leading-none tracking-tight text-green-500">POSSUI SEGURO ?</h1>
									<h1 className="text-center text-[0.65rem] font-medium text-green-600 lg:text-sm">SIM</h1>
								</div>
							) : null}

							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">Nº DE MÓDULOS</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.sistema.qtdeModulos}</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">STATUS DO PARECER</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.homologacao.status || "NÃO DEFINIDO"}</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">LIBERAÇÃO DA DOCUMENTAÇÃO</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.homologacao.documentacao.dataLiberacao ? formatDateAsLocale(project.homologacao.documentacao.dataLiberacao) : "NÃO DEFINIDO"}
								</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">ASSINATURA DA DOCUMENTAÇÃO</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.homologacao.documentacao.dataAssinatura ? formatDateAsLocale(project.homologacao.documentacao.dataAssinatura) : "NÃO DEFINIDO"}
								</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">STATUS DE SUPLEMENTAÇÃO</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.compra.status || "NÃO DEFINIDO"}</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">COBRANÇA DO KIT</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.compra.dataRequisicaoPagamento ? formatDateAsLocale(project.compra.dataRequisicaoPagamento) : "NÃO DEFINIDO"}
								</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">PAGAMENTO DO KIT (CLIENTE)</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.compra.dataPagamento ? formatDateAsLocale(project.compra.dataPagamento) : "NÃO DEFINIDO"}
								</h1>
							</div>

							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">PREVISÃO DE ENTREGA</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.compra.previsaoEntrega ? formatDateAsLocale(project.compra.previsaoEntrega) : "NÃO DEFINIDO"}
								</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">DATA DE ENTREGA</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.compra.dataEntrega ? formatDateAsLocale(project.compra.dataEntrega) : "NÃO DEFINIDO"}
								</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">STATUS DE ENTREGA</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.compra.statusEntrega ? project.compra.statusEntrega : "NÃO DEFINIDO"}
								</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">FORNECEDOR</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.compra.fornecedor || "NÃO DEFINIDO"}</h1>
							</div>
							<div className="flex flex-col items-center rounded p-1 lg:items-start">
								<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">DATA DE FATURAMENTO</h1>
								<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">
									{project.faturamento?.dataFaturamento ? formatDateAsLocale(project.faturamento.dataFaturamento) : "NÃO DEFINIDO"}
								</h1>
							</div>
						</div>
						<div className="flex w-full flex-wrap items-center justify-around">
							{project.possuiDeficiencia === "SIM" ? (
								<>
									<div className="flex flex-col items-center lg:items-start">
										<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">PESSOA COM DEFICIÊNCIA</h1>
										<h1 className="text-center text-[0.65rem] font-medium lg:text-sm">{project.qualDeficiencia}</h1>
									</div>
								</>
							) : null}
						</div>
						<div className="flex w-full flex-col items-center justify-around gap-3 border border-cyan-500 p-2">
							<div className="flex w-full items-center justify-between gap-2">
								<h1 className="text-start text-xs leading-none font-bold tracking-tight text-cyan-500">JORNADA DO CLIENTE</h1>
								<div className="flex items-center gap-2">
									<Button size="xs" variant={"ghost"} onClick={() => setConclusionMenuIsOpen((prev) => !prev)} className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<p className="text-xs font-medium">CONCLUIR JORNADA</p>
									</Button>
									<Button asChild size="xs" variant={"ghost"}>
										<Link href={`/publico/jornada-do-cliente/${project._id}`}>
											<div className="text-xs font-medium">LINK DA JORNADA</div>
										</Link>
									</Button>
								</div>
							</div>
							<JourneySection
								stages={stages}
								isPending={isPending}
								onUpdateStages={(updated) => handleUpdateProject({ id: projectId, changes: { "jornada.estagios": updated } })}
							/>
						</div>
						<div className="flex w-full flex-col items-center justify-around gap-3 border border-primary/20 p-2">
							<h1 className="w-full text-start text-xs leading-none font-bold tracking-tight text-primary/80">ANOTAÇÕES</h1>
							<textarea
								value={infoHolder.jornada.anotacoes || ""}
								placeholder="Preencha aqui anotações da jornada do cliente..."
								onChange={(e) => {
									setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, anotacoes: e.target.value } }));
								}}
								className="field-sizing-content border-primary/20 bg-primary/20 text-primary/80 mt-2 min-h-[50px] w-full resize-none rounded border p-3 text-center text-sm shadow-xs outline-hidden"
							/>
						</div>

						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => setModalProjectIsOpen(true)}
									className="flex items-center gap-1 rounded border border-[#fead41] px-4 py-1 text-xs font-medium text-[#fead41] duration-300 ease-in-out hover:bg-[#fead41] hover:text-white"
								>
									<p>EXPANDIR</p>
									<FaExpandArrowsAlt />
								</button>
								<div className="relative">
									{openActivitiesCount > 0 ? (
										<div className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1">
											<p className="text-xxs font-medium text-white">{openActivitiesCount}</p>
										</div>
									) : null}
									<button
										type="button"
										onClick={() => setActivitiesMenuIsOpen((prev) => !prev)}
										className={`${
											openActivitiesCount > 0 ? "border-red-500 text-red-500 hover:bg-red-500" : "border-blue-500 text-blue-500 hover:bg-blue-500"
										} flex items-center gap-1 rounded border px-4 py-1 text-xs font-medium duration-300 ease-in-out hover:text-white`}
									>
										<p>ATIVIDADES</p>
										<MdOutlineCheckBox size={18} />
									</button>
								</div>
							</div>
							<LoadingButton
								size="sm"
								loading={isPending}
								onClick={() => {
									handleUpdateProject({ id: projectId, changes: { "jornada.anotacoes": infoHolder.jornada.anotacoes } });
								}}
							>
								SALVAR ANOTAÇÕES
							</LoadingButton>
						</div>
						{activitiesMenuIsOpen ? (
							project.atividades && project.atividades.length > 0 ? (
								<div className="mt-1 flex w-full flex-col gap-1">
									{project.atividades.map((activity) => (
										<ProjectActivityCard
											key={activity._id}
											activity={activity}
											projectId={projectId}
											mutateCallback={() => {
												callbacks?.onSettled?.();
											}}
										/>
									))}
								</div>
							) : (
								<h1 className="text-primary/60 w-full py-1 text-center text-sm italic">Nenhuma atividade cadastrada...</h1>
							)
						) : null}
					</div>
				</div>
				{modalProjectIsOpen ? <ModalDatabase session={session} projectId={projectId} closeModal={() => setModalProjectIsOpen(false)} /> : null}
				{conclusionMenuIsOpen ? (
					<ConclusionMenu projectId={projectId} project={project} callbacks={callbacks} closeMenu={() => setConclusionMenuIsOpen(false)} />
				) : null}
			</div>
		);

	if (mode === "SIMPLIFIED")
		return (
			<div className="font border-primary/20 flex w-full gap-2 rounded-md border shadow-xs">
				<div className={`h-full w-[7px] ${getBarColor(project.jornada.dataUltimaInteracao)} rounded-tl-md rounded-bl-md`} />
				<div className="flex w-full grow flex-col p-3">
					<div className="flex w-full items-center justify-between gap-2">
						<div className="flex flex-wrap items-center gap-2">
							<h1 className="leading-none font-bold tracking-tight">
								<strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
							</h1>
							<div className="w-fit">
								<ProjectCardsTags projectTags={project.etiquetas} />
							</div>
						</div>

						<div className="mt-2 flex items-center gap-3 lg:mt-0">
							<div className="text-primary/60 flex items-center gap-2">
								<BsCalendarFill />
								<p className="text-sm font-medium">
									{project.jornada.dataUltimaInteracao
										? `ÚLTIMO CONTATO EM: ${formatDateAsLocale(project.jornada.dataUltimaInteracao)}`
										: "SEM REGISTRO DE CONTATO"}
								</p>
							</div>
						</div>
					</div>
					<div className="mt-2 flex w-full flex-wrap items-center justify-start gap-4">
						<div className="flex items-center gap-1">
							<FaSignature />
							<h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">
								ASSINADO EM: <strong className="text-cyan-500">{formatDateAsLocale(project.contrato.dataAssinatura)}</strong> (HÁ{" "}
								<strong className="text-cyan-500">{getDifferenceBetweenDates({ start: project.contrato.dataAssinatura, end: new Date() })} DIAS</strong>)
							</h1>
						</div>
						{project.compra.dataPedido ? (
							<div className="flex items-center gap-1">
								<FaStore />
								<h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">
									COMPRO COM: <strong className="text-cyan-500">{project.compra?.fornecedor}</strong>
								</h1>
							</div>
						) : null}

						<div className="flex items-center gap-1">
							<TbTruckDelivery />
							<DeliveryInfo deliveredAt={project.compra.dataEntrega} expectedAt={project.compra.previsaoEntrega} />
						</div>
						<div className="flex items-center gap-1">
							<BsUnlockFill />
							<AccessInfo approvedAt={project.homologacao.acesso.dataResposta} />
						</div>
						<div className="flex items-center gap-1">
							<FaSolarPanel />
							<h1 className="text-primary/60 text-center text-[0.65rem] leading-none tracking-tight lg:text-xs">
								<strong className="text-cyan-500">{project.sistema?.qtdeModulos} MÓDULOS</strong>
							</h1>
						</div>
					</div>
				</div>
			</div>
		);
}

export default PosVendaCard;

type ConclusionMenuProps = {
	projectId: string;
	project: TProjectDTO;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
		onError?: () => void;
	};
	closeMenu: () => void;
};
function ConclusionMenu({ projectId, project, callbacks, closeMenu }: ConclusionMenuProps) {
	const { mutate, isPending } = useMutation({
		mutationKey: ["update-after-sales-project"],
		mutationFn: async () => {
			const updatedStages = project.jornada.estagios.map((stage) => ({
				...stage,
				concluido: true,
				dataConclusao: stage.dataConclusao || new Date().toISOString(),
			}));
			await updateProject({ id: projectId, changes: { "jornada.estagios": updatedStages, "jornada.dataEfetivacao": new Date().toISOString() } });
			return "Projeto atualizado com sucesso !";
		},
		onMutate: () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			toast.success(data);
			return closeMenu();
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError();
			toast.error(getErrorMessage(error));
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="CONCLUSÃO DA JORNADA"
			menuDescription="Selecione as etapas que foram concluídas para concluir a jornada do cliente."
			menuActionButtonText="CONCLUIR JORNADA"
			menuCancelButtonText="CANCELAR"
			closeMenu={closeMenu}
			actionFunction={() => mutate()}
			actionIsPending={isPending}
			stateIsLoading={false}
			stateError={null}
		>
			<p>Você está prestes a concluir a jornada do cliente. Essa ação é irreversível e não poderá ser desfeita.</p>
			<p>As etapas pendentes serão marcadas como concluídas e a jornada será concluída.</p>
		</ResponsiveDialogDrawer>
	);
}
