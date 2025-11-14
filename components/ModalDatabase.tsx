import React, { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useMediaQuery } from "@/lib/hooks/media-query";

import { useClientById } from "../utils/methods/query/clients";
import { useProjectUpdateLogs } from "@/utils/methods/query/project-update-logs";
import { updateProject } from "@/utils/methods/mutation/clients";
import { handleUpdateClientPersonalized } from "@/utils/methods/mutation/crm/clients";
import { getErrorMessage } from "@/utils/methods/handlers";

import NotificationCreationBlock from "./NotificationCreationBlock";
import InfoAtividadesBlock from "./blocosInfoProjeto/InfoAtividadesBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoVendaBlock from "./blocosInfoProjeto/InfoVendaBlock";
import InfoEtiquetasBlock from "./blocosInfoProjeto/InfoEtiquetasBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoContratoBlock from "./blocosInfoProjeto/InfoContratoBlock";
import InfoJornadaBlock from "./blocosInfoProjeto/InfoJornadaBlock";
import InfoPagamentoBlock from "./blocosInfoProjeto/InfoPagamentoBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoHomologacaoBlock from "./blocosInfoProjeto/InfoHomologacaoBlock";
import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";
import InfoMaterialBlock from "./blocosInfoProjeto/InfoMaterialBlock";
import InfoAnexosBlock from "./blocosInfoProjeto/InfoAnexosBlock";
import RestrictionBlock from "./blocosInfoProjeto/RestrictionBlock";
import ProjectServiceOrders from "./identificador/ordensDeServico/ProjectServiceOrders";
import InfoOeMBlock from "./blocosInfoProjeto/InfoOeMBlock";

import type { TProjectDTO } from "@/utils/schemas/projects";
import ErrorPage from "./utils/ErrorPage";
import toast from "react-hot-toast";
import InfoComissionamentoBlock from "./blocosInfoProjeto/InfoComissionamentoBlock";
import { Loader2 } from "lucide-react";
import type { TAuthSession } from "@/lib/authentication/types";

type ModalDatabaseProps = {
	session: TAuthSession;
	projectId: string;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: () => void;
		onSettled?: () => void;
	};
};

export default function ModalDatabase({ session, projectId, closeModal, callbacks }: ModalDatabaseProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const queryClient = useQueryClient();

	const { data: project, isLoading, isSuccess, isError, error } = useClientById({ id: projectId, enabled: !!projectId });
	const [infoHolder, setInfo] = useState<TProjectDTO | null>(null);
	const [changes, setChanges] = useState<Record<string, any>>({});
	const [clientChanges, setClientChanges] = useState<Record<string, any>>({});

	const permissions = useMemo(() => (session?.user as any)?.permissoes || {}, [session]);
	const userHasOverallAccess = useMemo(
		() =>
			["Projetos", "Obras", "Suprimentos", "O&M", "Marketing", "Vendas", "Pós-Venda", "PPS", "InsideSales", "Financeiro", "ADM", "RH"].every((el) =>
				permissions?.rotas?.includes(el),
			),
		[permissions],
	);
	const userHasOeMAccess = !!permissions?.suporte?.visualizar;
	const userHasRestrictionPermission = !!permissions?.gestao?.restringirProjetos;
	const userHasComissionValuesAccess = useMemo(
		() => ["PPS", "Financeiro", "ADM", "RH"].every((el) => permissions?.rotas?.includes(el)),
		[permissions],
	);

	useEffect(() => {
		if (project) setInfo(project);
	}, [project]);

	async function handleProjectUpdate({
		projectId,
		changes,
		clientChanges,
		project,
	}: {
		projectId: string;
		changes: Record<string, any>;
		clientChanges: Record<string, any>;
		project: TProjectDTO;
	}) {
		await updateProject({ id: projectId, changes });
		if (project.idClienteCRM) await handleUpdateClientPersonalized({ id: project.idClienteCRM, changes: clientChanges });
		return "Atualizações feitas com sucesso !";
	}

	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey: ["project-by-id", projectId] });
		callbacks?.onMutate?.();
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: ["project-by-id", projectId] });
		callbacks?.onSettled?.();
	};
	const { mutate: handleProjectUpdateMutation, isPending } = useMutation({
		mutationKey: ["update-project"],
		mutationFn: handleProjectUpdate,
		onMutate: handleOnMutate,
		onSuccess: (data) => {
			toast.success(data);
			callbacks?.onSuccess?.();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err));
			callbacks?.onError?.();
		},
		onSettled: handleOnSettled,
	});

	const MENU_TITLE = project ? `${project.qtde} - ${project.nomeDoContrato}` : "Carregando informações...";
	const MENU_DESCRIPTION = "Gerencie as informações completas do projeto.";
	const BUTTON_TEXT = "SALVAR ALTERAÇÕES";

	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="dark:bg-background flex max-h-[80vh] min-h-[80vh] min-w-[80vw] flex-col">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Loader2 className="h-10 w-10 animate-spin" />
						<h1>Carregando informações do projeto...</h1>
					</div>
				) : null}
				{isError ? <ErrorPage msg={getErrorMessage(error)} /> : null}
				{isSuccess && infoHolder ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
							<ModalDatabaseContent
								session={session}
								projectId={projectId}
								project={project}
								infoHolder={infoHolder}
								setInfoHolder={createNonNullableSetter(setInfo)}
								changes={changes}
								setChanges={setChanges}
								clientChanges={clientChanges}
								setClientChanges={setClientChanges}
								userHasOverallAccess={userHasOverallAccess}
								userHasOeMAccess={userHasOeMAccess}
								userHasRestrictionPermission={userHasRestrictionPermission}
								userHasComissionValuesAccess={userHasComissionValuesAccess}
								callbacks={{
									onMutate: handleOnMutate,
									onSettled: handleOnSettled,
									onSuccess: callbacks?.onSuccess,
									onError: callbacks?.onError,
								}}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton onClick={() => handleProjectUpdateMutation({ projectId, changes, clientChanges, project })} loading={isPending}>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="flex h-fit max-h-[80vh] flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Loader2 className="h-10 w-10 animate-spin" />
						<h1>Carregando informações do projeto...</h1>
					</div>
				) : null}
				{isError ? <ErrorPage msg={getErrorMessage(error)} /> : null}
				{isSuccess && infoHolder ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
							<ModalDatabaseContent
								session={session}
								projectId={projectId}
								project={project}
								infoHolder={infoHolder}
								setInfoHolder={createNonNullableSetter(setInfo)}
								changes={changes}
								setChanges={setChanges}
								clientChanges={clientChanges}
								setClientChanges={setClientChanges}
								userHasOverallAccess={userHasOverallAccess}
								userHasOeMAccess={userHasOeMAccess}
								userHasRestrictionPermission={userHasRestrictionPermission}
								userHasComissionValuesAccess={userHasComissionValuesAccess}
								callbacks={{
									onMutate: handleOnMutate,
									onSettled: handleOnSettled,
									onSuccess: callbacks?.onSuccess,
									onError: callbacks?.onError,
								}}
							/>
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton onClick={() => handleProjectUpdateMutation({ projectId, changes, clientChanges, project })} loading={isPending}>
								{BUTTON_TEXT}
							</LoadingButton>
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

function createNonNullableSetter(setter: Dispatch<SetStateAction<TProjectDTO | null>>): Dispatch<SetStateAction<TProjectDTO>> {
	return (update) => {
		if (typeof update === "function") {
			setter((prev) => (update as (prevState: TProjectDTO) => TProjectDTO)(prev as unknown as TProjectDTO));
		} else {
			setter(update);
		}
	};
}

type ModalDatabaseContentProps = {
	session: TAuthSession;
	projectId: string;
	project: TProjectDTO;
	infoHolder: TProjectDTO;
	setInfoHolder: Dispatch<SetStateAction<TProjectDTO>>;
	changes: Record<string, any>;
	setChanges: Dispatch<SetStateAction<Record<string, any>>>;
	clientChanges: Record<string, any>;
	setClientChanges: Dispatch<SetStateAction<Record<string, any>>>;
	userHasOverallAccess: boolean;
	userHasOeMAccess: boolean;
	userHasRestrictionPermission: boolean;
	userHasComissionValuesAccess: boolean;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: () => void;
		onSettled?: () => void;
	};
};

function ModalDatabaseContent({
	session,
	projectId,
	project,
	infoHolder,
	setInfoHolder,
	changes,
	setChanges,
	clientChanges,
	setClientChanges,
	userHasOverallAccess,
	userHasOeMAccess,
	userHasRestrictionPermission,
	userHasComissionValuesAccess,
	callbacks,
}: ModalDatabaseContentProps) {
	const { data: updateLogs } = useProjectUpdateLogs({ projectId });

	return (
		<div className="flex h-full w-full flex-col gap-6 px-4 lg:px-0">
			<NotificationCreationBlock session={session} nomeDoProjeto={infoHolder.nomeDoContrato} codProjeto={infoHolder.qtde.toString()} />
			<InfoAtividadesBlock projectId={projectId} projectName={infoHolder.nomeDoContrato} projectIdentifier={infoHolder.qtde} session={session} />
			<InfoClienteBlock
				editable={userHasOverallAccess}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				clientChanges={clientChanges}
				setClientChanges={setClientChanges}
			/>
			<InfoVendaBlock
				editor={userHasOverallAccess}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				project={project}
			/>
			<InfoEtiquetasBlock session={session} infoHolder={infoHolder} setInfo={setInfoHolder} changes={changes} setChanges={setChanges} />
			<InfoVisitaTecnicaBlock
				editor={userHasOverallAccess}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				analysisId={project.idVisitaTecnica || ""}
				session={session}
			/>

			{!["OPERAÇÃO E MANUTENÇÃO", "BOMBA SOLAR", "SISTEMA FOTOVOLTAICO (OFF GRID)"].includes(infoHolder.tipoDeServico) && (
				<InfoPadraoBlock
					comercialEdition={userHasOverallAccess}
					technicalEdition={userHasOverallAccess}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					updateLogs={updateLogs || []}
					showPaymentInfo={userHasOverallAccess}
					showPaymentOnly={false}
				/>
			)}

			{!["OPERAÇÃO E MANUTENÇÃO", "TROCA DE PADRÃO", "REFORMA DE PADRÃO", "SUBESTAÇÃO DE ENERGIA"].includes(infoHolder.tipoDeServico) && (
				<InfoEstruturaBlock
					comercialEdition={userHasOverallAccess}
					technicalEdition={userHasOverallAccess}
					project={project}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					updateLogs={updateLogs || []}
					showPaymentInfo={userHasOverallAccess}
				/>
			)}

			<InfoContratoBlock
				editor={userHasOverallAccess}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				showPaymentInfo={userHasComissionValuesAccess}
				project={project}
			/>

			<InfoJornadaBlock
				editor={userHasOverallAccess}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
			/>

			<InfoPagamentoBlock
				editor={userHasOverallAccess}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				showADMOnly={false}
			/>

			{!["MONTAGEM E DESMONTAGEM", "OPERAÇÃO E MANUTENÇÃO"].includes(infoHolder.tipoDeServico) && (
				<InfoCompraBlock
					editor={userHasOverallAccess}
					session={session}
					project={project}
					comercialEditionOnly={false}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					updateLogs={updateLogs || []}
					showDeliveryInfoOnly={false}
					showMonetaryValues={false}
				/>
			)}

			{!["TROCA DE PADRÃO", "REFORMA DE PADRÃO", "SUBESTAÇÃO DE ENERGIA"].includes(infoHolder.tipoDeServico) && (
				<InfoSistemaBlock
					editor={userHasOverallAccess}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					updateLogs={updateLogs || []}
					showPaymentInfo={userHasOverallAccess}
				/>
			)}

			{!["BOMBA SOLAR", "SISTEMA FOTOVOLTAICO (OFF GRID)", "OPERAÇÃO E MANUTENÇÃO"].includes(infoHolder.tipoDeServico) ? (
				<InfoHomologacaoBlock
					session={session}
					infoHolder={infoHolder}
					// @ts-expect-error
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
				/>
			) : null}

			<InfoObrasBlock
				editor={userHasOverallAccess}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				project={project}
				showDeliveryInfo={false}
				showMaterialInfo={false}
			/>

			<ProjectServiceOrders projectId={project._id} session={session} projectMainServiceOrderId={project.idOrdemServico} />

			<InfoComissionamentoBlock editor={userHasOeMAccess} infoHolder={infoHolder} setInfo={setInfoHolder} changes={changes} setChanges={setChanges} />

			<InfoOeMBlock editor={userHasOeMAccess} infoHolder={infoHolder} setInfo={setInfoHolder} changes={changes} setChanges={setChanges} />

			<InfoMaterialBlock
				editor={userHasOverallAccess}
				infoHolder={infoHolder}
				project={project}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				showCircuitBreakers={false}
				circuitBreakerAddition={false}
			/>

			<InfoAnexosBlock projectId={projectId} project={infoHolder} session={session} />

			{userHasRestrictionPermission ? (
				<RestrictionBlock
					projectId={projectId}
					session={session}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					callbacks={callbacks}
				/>
			) : null}
		</div>
	);
}
