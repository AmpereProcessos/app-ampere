import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, type Dispatch, type SetStateAction } from "react";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useClientById } from "../utils/methods/query/clients";
import NotificationCreationBlock from "./NotificationCreationBlock";
import InfoAnexosBlock from "./blocosInfoProjeto/InfoAnexosBlock";
import InfoAtividadesBlock from "./blocosInfoProjeto/InfoAtividadesBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoContratoBlock from "./blocosInfoProjeto/InfoContratoBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoHomologacaoBlock from "./blocosInfoProjeto/InfoHomologacaoBlock";
import InfoMaterialBlock from "./blocosInfoProjeto/InfoMaterialBlock";
import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoPagamentoBlock from "./blocosInfoProjeto/InfoPagamentoBlock";
import InfoReceitasBlock from "./blocosInfoProjeto/InfoReceitasBlock";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoVendaBlock from "./blocosInfoProjeto/InfoVendaBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import ErrorPage from "./utils/ErrorPage";

import type { TAuthSession } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/media-query";
import type { TProjectDTO } from "@/utils/schemas/projects";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/methods/handlers";
import { handleComercialUpdate } from "../utils/methods/mutation/comercial";
import { handleUpdateClientPersonalized } from "../utils/methods/mutation/crm/clients";
import { useProjectUpdateLogs } from "../utils/methods/query/project-update-logs";
import InfoEtiquetasBlock from "./blocosInfoProjeto/InfoEtiquetasBlock";
import { Button } from "./ui/button";
import { LoadingButton } from "./utils/Buttons/LoadingButton";
import LoadingComponent from "./utils/LoadingComponent";

type ModalComercialProps = {
	session: TAuthSession;
	projectId: string;
	closeModal: () => void;
};
function ModalComercial({ session, projectId, closeModal }: ModalComercialProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const queryClient = useQueryClient();

	const { data: project, isLoading, isSuccess, isError, error } = useClientById({ id: projectId, enabled: !!projectId });
	const [infoHolder, setInfo] = useState(project);
	const [changes, setChanges] = useState<Record<string, any>>({});
	const [clientChanges, setClientChanges] = useState<Record<string, any>>({});

	async function handleProjectUpdate({
		previousData,
		newData,
		changes,
		queryClient,
	}: {
		previousData: TProjectDTO;
		newData: TProjectDTO;
		changes: Record<string, any>;
		queryClient: QueryClient;
	}) {
		await handleComercialUpdate({
			previousData,
			newData,
			changes,
			queryClient,
		});
		if (previousData.idClienteCRM) await handleUpdateClientPersonalized({ id: previousData.idClienteCRM, changes: clientChanges });
		return "Atualizações feitas com sucesso !";
	}
	const { mutate: handleProjectUpdateMutation, isPending } = useMutation({
		mutationKey: ["update-project"],
		mutationFn: handleProjectUpdate,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["project-by-id", projectId] });
		},
		onSuccess: (data) => {
			toast.success(data);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["project-by-id", projectId] });
		},
	});

	const MENU_TITLE = project ? `${project?.qtde} - ${project?.nomeDoContrato}` : "Carregando informações...";
	const MENU_DESCRIPTION = "Gerencie as informações do projeto.";
	const BUTTON_TEXT = "SALVAR ALTERAÇÕES";
	useEffect(() => {
		if (project) setInfo(project);
	}, [project]);

	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="dark:bg-background flex max-h-[80vh] min-h-[80vh] min-w-[80vw] flex-col">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorPage msg={getErrorMessage(error)} /> : null}
				{isSuccess && infoHolder ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
							<ModalComercialContent
								session={session}
								projectId={projectId}
								project={project}
								infoHolder={infoHolder}
								// @ts-expect-error
								setInfoHolder={setInfo}
								changes={changes}
								setChanges={setChanges}
								clientChanges={clientChanges}
								setClientChanges={setClientChanges}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton
								onClick={() => handleProjectUpdateMutation({ previousData: project, newData: infoHolder, changes: changes, queryClient: queryClient })}
								loading={isPending}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="flex h-fit max-h-[70vh] flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorPage msg={getErrorMessage(error)} /> : null}
				{isSuccess && infoHolder ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
							<ModalComercialContent
								session={session}
								projectId={projectId}
								project={project}
								infoHolder={infoHolder}
								// @ts-expect-error
								setInfoHolder={setInfo}
								changes={changes}
								setChanges={setChanges}
								clientChanges={clientChanges}
								setClientChanges={setClientChanges}
							/>
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton
								onClick={() => handleProjectUpdateMutation({ previousData: project, newData: infoHolder, changes: changes, queryClient: queryClient })}
								loading={isPending}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

export default ModalComercial;

type ModalComercialContentProps = {
	session: TAuthSession;
	projectId: string;
	project: TProjectDTO;
	infoHolder: TProjectDTO;
	setInfoHolder: Dispatch<SetStateAction<TProjectDTO>>;
	changes: Record<string, any>;
	setChanges: Dispatch<SetStateAction<Record<string, any>>>;
	clientChanges: Record<string, any>;
	setClientChanges: Dispatch<SetStateAction<Record<string, any>>>;
};

function ModalComercialContent({
	session,
	projectId,
	project,
	infoHolder,
	setInfoHolder,
	changes,
	setChanges,
	clientChanges,
	setClientChanges,
}: ModalComercialContentProps) {
	const { data: updateLogs } = useProjectUpdateLogs({ projectId });

	return (
		<div className="flex h-full w-full flex-col gap-6 px-4 lg:px-0">
			<NotificationCreationBlock session={session} nomeDoProjeto={infoHolder.nomeDoContrato} codProjeto={infoHolder.qtde.toString()} />
			<InfoAtividadesBlock projectId={projectId} projectName={infoHolder.nomeDoContrato} projectIdentifier={infoHolder.qtde} session={session} />
			<InfoClienteBlock
				editable={true}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				clientChanges={clientChanges}
				setClientChanges={setClientChanges}
			/>
			<InfoVendaBlock
				editor={true}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				project={project}
			/>
			<InfoEtiquetasBlock session={session} infoHolder={infoHolder} setInfo={setInfoHolder} changes={changes} setChanges={setChanges} />
			<InfoVisitaTecnicaBlock
				editor={false}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				analysisId={project.idVisitaTecnica || ""}
				session={session}
			/>
			<InfoContratoBlock
				editor={true}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				showPaymentInfo={true}
				project={project}
			/>
			{!["OPERAÇÃO E MANUTENÇÃO", "BOMBA SOLAR", "SISTEMA FOTOVOLTAICO (OFF GRID)"].includes(infoHolder.tipoDeServico) && (
				<InfoPadraoBlock
					comercialEdition={true}
					technicalEdition={true}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					updateLogs={updateLogs || []}
					showPaymentOnly={false}
					showPaymentInfo={true}
				/>
			)}
			{!["OPERAÇÃO E MANUTENÇÃO", "TROCA DE PADRÃO", "REFORMA DE PADRÃO", "SUBESTAÇÃO DE ENERGIA"].includes(infoHolder.tipoDeServico) && (
				<InfoEstruturaBlock
					comercialEdition={true}
					technicalEdition={true}
					project={project}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					updateLogs={updateLogs || []}
					showPaymentInfo={true}
				/>
			)}
			<InfoReceitasBlock
				session={session}
				project={infoHolder}
				projectId={projectId}
				projectName={infoHolder.nomeDoContrato}
				projectIdentificator={project.qtde.toString()}
			/>
			<InfoPagamentoBlock
				editor={true}
				sessionUser={session}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
				showADMOnly={false}
			/>
			{!["MONTAGEM E DESMONTAGEM", "OPERAÇÃO E MANUTENÇÃO"].includes(infoHolder.tipoDeServico) && (
				<InfoCompraBlock
					editor={true}
					session={session}
					project={project}
					comercialEditionOnly={true}
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
					editor={true}
					infoHolder={infoHolder}
					setInfo={setInfoHolder}
					changes={changes}
					setChanges={setChanges}
					showPaymentInfo={true}
					updateLogs={updateLogs || []}
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
				editor={true}
				infoHolder={infoHolder}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				project={project}
				updateLogs={updateLogs || []}
				showDeliveryInfo={false}
				showMaterialInfo={false}
			/>
			<InfoMaterialBlock
				editor={true}
				infoHolder={infoHolder}
				project={project}
				circuitBreakerAddition={true}
				showCircuitBreakers={true}
				setInfo={setInfoHolder}
				changes={changes}
				setChanges={setChanges}
				updateLogs={updateLogs || []}
			/>
			<InfoAnexosBlock projectId={projectId} project={infoHolder} session={session} />
		</div>
	);
}
