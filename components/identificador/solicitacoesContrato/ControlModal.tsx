import SelectInput from "@/components/inputs/Select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { cn } from "@/lib/utils";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateProject } from "@/utils/methods/mutation/clients";
import { editContractRequest, generateContract } from "@/utils/methods/mutation/contract-requests";
import { createManyFileReferences } from "@/utils/methods/mutation/crm/file-references";
import { updateOpportunity } from "@/utils/methods/mutation/crm/opportunities";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useContractRequestById } from "@/utils/methods/query/contract-requests";
import { useContractTemplates } from "@/utils/methods/query/contract-templates";
import {
	getProjectHomologationInformation,
	getProjectInformationFromRequest,
	handleSendEmailToCobrancas,
	handleSendNotificationToCobrancas,
} from "@/utils/methods/util/contract-requests";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import type { TFileReference } from "@/utils/schemas/file-reference.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsCalendarCheck, BsCode, BsPatchCheck } from "react-icons/bs";
import { FaFile } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import ContactInformationBlock from "./blocos/ContactInformationBlock";
import ElectricalInstallationDependentsInformationBlock from "./blocos/ElectricalInstallationDependentsInformationBlock";
import ElectricalInstallationInformationBlock from "./blocos/ElectricalInstallationInformationBlock";
import EnergyPAInformationBlock from "./blocos/EnergyPAInformationBlock";
import FilesBlock from "./blocos/FilesBlock";
import GeneralInformationBlock from "./blocos/GeneralInformationBlock";
import InsuranceInformationBlock from "./blocos/InsuranceInformationBlock";
import OeMInformationBlock from "./blocos/OeMInformationBlock";
import PaymentInformationBlock from "./blocos/PaymentInformationBlock";
import StructureInformationBlock from "./blocos/StructureInformationBlock";
import SystemInformationBlock from "./blocos/SystemInformationBlock";
import TechnicalAnalysisBlock from "./blocos/TechnicalAnalysisBlock";

type ContractRequestControlModalProps = {
	requestId: string;
	session: TAuthSession;
	closeModal: () => void;
};
function ContractRequestControlModal({ requestId, session, closeModal }: ContractRequestControlModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const queryClient = useQueryClient();
	const userHasEditPermission = session.user.permissoes.comercial.editar;
	const { data: request, isLoading, isError, isSuccess, error } = useContractRequestById({ id: requestId });
	const [generateContractMenuIsOpen, setGenerateContractMenuIsOpen] = useState(false);
	const [infoHolder, setInfoHolder] = useState<TContractRequestDTO>({
		_id: "",
		nomeVendedor: "",
		nomeDoProjeto: "",
		idParceiro: "",
		telefoneVendedor: "",
		tipoDeServico: "SISTEMA FOTOVOLTAICO",
		nomeDoContrato: "",
		telefone: "",
		cpf_cnpj: "",
		rg: "",
		dataDeNascimento: null,
		cep: "",
		cidade: "",
		uf: "",
		enderecoCobranca: "",
		numeroResCobranca: "",
		bairro: "",
		pontoDeReferencia: "",
		segmento: undefined,
		formaAssinatura: "FISICO",
		codigoSVB: "",
		estadoCivil: "",
		email: "",
		profissao: "",
		ondeTrabalha: "",
		possuiDeficiencia: "NÃO",
		qualDeficiencia: "",
		canalVenda: "",
		nomeIndicador: "",
		telefoneIndicador: "",
		comoChegouAoCliente: "",
		nomeContatoJornadaUm: "",
		telefoneContatoUm: "",
		nomeContatoJornadaDois: "",
		telefoneContatoDois: "",
		cuidadosContatoJornada: "",
		nomeTitularProjeto: "",
		tipoDoTitular: null,
		tipoDaLigacao: null,
		tipoDaInstalacao: "URBANO",
		cepInstalacao: "",
		enderecoInstalacao: "",
		numeroResInstalacao: "",
		numeroInstalacao: "",
		bairroInstalacao: "",
		cidadeInstalacao: "",
		ufInstalacao: "",
		pontoDeReferenciaInstalacao: "",
		loginCemigAtende: "",
		senhaCemigAtende: "",
		latitude: "",
		longitude: "",
		potPico: 0,
		geracaoPrevista: 0,
		topologia: null,
		marcaInversor: "",
		qtdeInversor: "",
		potInversor: "",
		marcaModulos: "",
		qtdeModulos: "",
		potModulos: "",
		tipoEstrutura: "",
		materialEstrutura: null,
		estruturaAmpere: "NÃO",
		responsavelEstrutura: "NÃO SE APLICA",
		formaPagamentoEstrutura: null,
		valorEstrutura: 0,
		possuiOeM: "NÃO",
		planoOeM: "NÃO SE APLICA",
		clienteSegurado: "NÃO",
		valorSeguro: 0,
		tempoSegurado: "NÃO SE APLICA",
		formaPagamentoOeMOuSeguro: "NÃO SE APLICA",
		valorOeMOuSeguro: null,
		aumentoDeCarga: "NÃO",
		caixaConjugada: "NÃO",
		tipoDePadrao: null,
		aumentoDisjuntor: null,
		respTrocaPadrao: null,
		formaPagamentoPadrao: null,
		valorPadrao: 0,
		nomePagador: "",
		contatoPagador: "",
		necessidaInscricaoRural: null,
		inscriçãoRural: "",
		cpf_cnpjNF: "",
		localEntrega: null,
		entregaIgualCobranca: null,
		restricoesEntrega: null,
		valorContrato: 0,
		origemRecurso: null,
		numParcelas: 0,
		valorParcela: 0,
		credor: null,
		nomeGerente: "",
		contatoGerente: "",
		necessidadeNFAdiantada: null,
		necessidadeCodigoFiname: null,
		formaDePagamento: null,
		descricaoNegociacao: "",
		possuiDistribuicao: null,
		realizarHomologacao: true,
		distribuicoes: [],
		dataSolicitacao: new Date().toISOString(),
	});
	async function approveFormulary(info: TContractRequestDTO) {
		// Adding a new operational projecy
		let insertObject = getProjectInformationFromRequest({ request: info });

		// Getting homologation information in case idHomologacao is defined
		if (info.idHomologacao) {
			const { projectHomologation, projectHomologationFiles } = await getProjectHomologationInformation({
				homologationId: info.idHomologacao,
			});
			insertObject = {
				...insertObject,
				homologacao: projectHomologation,
				links: { ...insertObject.links, projetos: projectHomologationFiles },
			};
		}
		const { data } = await axios.post("/api/projects/add", insertObject);
		const insertedProjectId = data.data.insertedId;

		const fileReferences: TFileReference[] =
			insertObject.links.documentos?.map((file) => ({
				titulo: file.title,
				url: file.link,
				formato: file.format,
				idProjeto: insertedProjectId,
				categorias: ["DOCUMENTOS"],
				autor: { id: "holder", nome: "MIGRAÇÃO" },
				dataInsercao: new Date().toISOString(),
			})) || [];
		if (fileReferences.length > 0) await createManyFileReferences({ info: fileReferences });
		// Updating the contract request instance
		await editContractRequest({
			id: requestId,
			changes: {
				...info,
				idProjetoApp: insertedProjectId,
				aprovacao: true,
				dataAprovacao: new Date().toISOString(),
			},
		});
		// Notifying and emailing cobrancas sector
		if (info.tipoDeServico !== "CONSÓRCIO DE ENERGIA")
			await handleSendEmailToCobrancas({
				requestId: requestId,
				contractName: info?.nomeDoContrato,
			});
		await handleSendNotificationToCobrancas({
			contractName: info.nomeDoContrato,
		});
		return "Novo projeto adicionado com sucesso !";
	}
	async function rejectFormulary(info: TContractRequestDTO) {
		const formularyId = info._id;
		const formularyOpportunityId = info.idProjetoCRM;

		if (formularyOpportunityId)
			await updateOpportunity({
				id: formularyOpportunityId,
				changes: {
					"ganho.idSolicitacao": null,
					"ganho.dataSolicitacao": null,
				},
			});
		await editContractRequest({
			id: formularyId,
			changes: { aprovacao: false },
		});

		return "Formulário de contrato atualizado com sucesso !";
	}
	const { mutate: handleApproveRequest, isPending: approvalLoading } = useMutationWithFeedback({
		mutationKey: ["add-new-project", requestId],
		mutationFn: approveFormulary,
		queryClient: queryClient,
		affectedQueryKey: ["contract-requests"],
		callbackFn: async () =>
			await queryClient.invalidateQueries({
				queryKey: ["contract-request-by-id", requestId],
			}),
	});
	const { mutate: handleRejectRequest, isPending: rejectLoading } = useMutationWithFeedback({
		mutationKey: ["reject-contract-request", requestId],
		mutationFn: rejectFormulary,
		queryClient: queryClient,
		affectedQueryKey: ["contract-requests"],
	});
	const { mutate: handleRequestUpdate, isPending: updateLoading } = useMutationWithFeedback({
		mutationKey: ["update-contract-request", requestId],
		mutationFn: editContractRequest,
		queryClient: queryClient,
		affectedQueryKey: ["contract-requests"],
		callbackFn: async () =>
			await queryClient.invalidateQueries({
				queryKey: ["contract-request-by-id", requestId],
			}),
	});

	useEffect(() => {
		if (request) setInfoHolder(request);
	}, [request]);

	const TITLE = "GERAR CONTRATO";
	const DESCRIPTION = "Gere o contrato do formulário de contrato.";
	const CTA_BUTTON_TEXT = "GERAR CONTRATO";
	const CANCEL_BUTTON_TEXT = "FECHAR";

	return isDesktop ? (
		<Dialog onOpenChange={(v) => (v ? null : closeModal())} open>
			<DialogContent className={"h-[90%] min-h-[90%] max-h-[90%] lg:max-h-[90%] w-[80%] min-w-[80%] max-w-[80%] lg:max-w-[80%]"}>
				<DialogHeader>
					<DialogTitle>GERAR CONTRATO</DialogTitle>
					<DialogDescription>Gere o contrato do formulário de contrato.</DialogDescription>
				</DialogHeader>
				{isLoading ? (
					<LoadingComponent />
				) : isError ? (
					<ErrorComponent msg={getErrorMessage(error)} />
				) : (
					<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-3 overflow-auto px-4 py-2 lg:px-0">
						<div className="flex w-full items-center justify-end gap-2">
							<Link href={`/comercial/pdfProcuracao/${requestId}`}>
								<button
									type="button"
									className="border-primary/80 text-primary/80 flex items-center gap-2 rounded border px-4 py-2 duration-300 ease-in-out hover:border-gray-400 hover:text-gray-400"
								>
									<FaFile />
									<p className="text-xs font-bold tracking-tight">PROCURAÇÃO EM PDF</p>
								</button>
							</Link>
							<Link href={`/comercial/publicoFormulario/${requestId}`}>
								<button
									type="button"
									className="flex items-center gap-2 rounded border border-orange-600 px-4 py-2 text-orange-600 duration-300 ease-in-out hover:border-orange-400 hover:text-orange-400"
								>
									<FaFile />
									<p className="text-xs font-bold tracking-tight">FORMULÁRIO EM PDF</p>
								</button>
							</Link>
						</div>
						<GeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<ContactInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<ElectricalInstallationInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<SystemInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<StructureInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<EnergyPAInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<OeMInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<InsuranceInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<PaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<ElectricalInstallationDependentsInformationBlock
							infoHolder={infoHolder}
							setInfoHolder={setInfoHolder}
							userHasEditPermission={userHasEditPermission}
						/>

						<TechnicalAnalysisBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<FilesBlock
							files={infoHolder.links}
							tag={`${infoHolder.nomeDoContrato}`}
							vinculateFiles={(newLinks) =>
								//@ts-ignore
								handleRequestUpdate({
									id: requestId,
									changes: { links: newLinks },
								})
							}
							vinculationPending={updateLoading}
						/>
						<div className="flex w-full flex-wrap items-center justify-center gap-2">
							<Button onClick={() => setGenerateContractMenuIsOpen(true)}>GERAR CONTRATO</Button>
						</div>
					</div>
				)}
				<DialogFooter>
					<div className="flex items-center gap-2">
						{infoHolder.aprovacao ? (
							<>
								<div className="flex items-center gap-1">
									<BsCalendarCheck color="rgb(34,197,94)" />
									<h1 className="text-primary/60 text-sm font-medium tracking-tight">APROVADO EM: {formatDateAsLocale(infoHolder.dataAprovacao, true)}</h1>
								</div>
								{infoHolder.confeccionado ? (
									<div className="flex items-center gap-1">
										<BsPatchCheck color="rgb(34,197,94)" />
										<h1 className="text-primary/60 text-sm font-medium tracking-tight">CONFECCIONADO</h1>
									</div>
								) : (
									<button
										type="button"
										disabled={updateLoading}
										onClick={async () => {
											// @ts-ignore
											handleRequestUpdate({
												id: requestId,
												changes: { confeccionado: true },
											});

											if (infoHolder.idProjetoApp)
												await updateProject({
													id: infoHolder.idProjetoApp,
													changes: {
														"contrato.dataLiberacao": new Date().toISOString(),
													},
												});
										}}
										className="disabled:bg-primary/60 flex h-9 items-center gap-1 rounded bg-cyan-800 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-cyan-600 enabled:hover:text-white disabled:text-white"
									>
										<BsPatchCheck />
										<p className="">VALIDAR CONFECÇÃO</p>
									</button>
								)}
							</>
						) : (
							<>
								<button
									type="button"
									disabled={approvalLoading || updateLoading || rejectLoading}
									onClick={() => {
										// @ts-ignore
										handleApproveRequest(infoHolder);
									}}
									className="disabled:bg-primary/60 h-9 rounded bg-green-800 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-green-800 enabled:hover:text-white disabled:text-white"
								>
									APROVAR FORMULÁRIO
								</button>
								<button
									type="button"
									disabled={rejectLoading || approvalLoading || updateLoading}
									onClick={() => {
										// @ts-ignore
										handleRejectRequest(infoHolder);
									}}
									className="disabled:bg-primary/60 h-9 rounded bg-red-800 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-red-800 enabled:hover:text-white disabled:text-white"
								>
									REPROVAR FORMULÁRIO
								</button>
							</>
						)}
						{infoHolder.tipoDeServico === "OPERAÇÃO E MANUTENÇÃO" ? (
							<Link href={`/adm/contratos/pdf/${requestId}`}>
								<button
									type="button"
									className="flex items-center gap-2 rounded border border-orange-600 px-4 py-2 text-orange-600 duration-300 ease-in-out hover:border-orange-400 hover:text-orange-400"
								>
									<FaFile />
									<p className="text-xs font-bold tracking-tight">TEMPLATE DE CONTRATO</p>
								</button>
							</Link>
						) : null}
					</div>

					<button
						type="button"
						disabled={updateLoading || approvalLoading || rejectLoading}
						onClick={() => {
							// @ts-ignore
							handleRequestUpdate({
								id: requestId,
								changes: { ...infoHolder },
							});
						}}
						className="disabled:bg-primary/60 h-9 rounded bg-blue-800 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-blue-800 enabled:hover:text-white disabled:text-white"
					>
						ATUALIZAR FORMULÁRIO
					</button>
				</DialogFooter>
				{generateContractMenuIsOpen && (
					<GenerateContractMenu
						requestContractName={infoHolder.nomeDoContrato}
						requestId={requestId}
						closeMenu={() => setGenerateContractMenuIsOpen(false)}
					/>
				)}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer onOpenChange={(v) => (v ? null : closeModal())} open>
			<DrawerContent className={"h-fit max-h-[80vh] flex flex-col"}>
				<DrawerHeader className="text-left">
					<DrawerTitle>{TITLE}</DrawerTitle>
					<DrawerDescription>{DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				{isLoading ? (
					<LoadingComponent />
				) : isError ? (
					<ErrorComponent msg={getErrorMessage(error)} />
				) : (
					<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-3 overflow-auto px-4 py-2 lg:px-0">
						<div className="flex w-full items-center justify-end gap-2">
							<Link href={`/comercial/pdfProcuracao/${requestId}`}>
								<button
									type="button"
									className="border-primary/80 text-primary/80 flex items-center gap-2 rounded border px-4 py-2 duration-300 ease-in-out hover:border-gray-400 hover:text-gray-400"
								>
									<FaFile />
									<p className="text-xs font-bold tracking-tight">PROCURAÇÃO EM PDF</p>
								</button>
							</Link>
							<Link href={`/comercial/publicoFormulario/${requestId}`}>
								<button
									type="button"
									className="flex items-center gap-2 rounded border border-orange-600 px-4 py-2 text-orange-600 duration-300 ease-in-out hover:border-orange-400 hover:text-orange-400"
								>
									<FaFile />
									<p className="text-xs font-bold tracking-tight">FORMULÁRIO EM PDF</p>
								</button>
							</Link>
						</div>
						<GeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<ContactInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<ElectricalInstallationInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<SystemInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<StructureInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<EnergyPAInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<OeMInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<InsuranceInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<PaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<ElectricalInstallationDependentsInformationBlock
							infoHolder={infoHolder}
							setInfoHolder={setInfoHolder}
							userHasEditPermission={userHasEditPermission}
						/>

						<TechnicalAnalysisBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={userHasEditPermission} />

						<FilesBlock
							files={infoHolder.links}
							tag={`${infoHolder.nomeDoContrato}`}
							vinculateFiles={(newLinks) =>
								//@ts-ignore
								handleRequestUpdate({
									id: requestId,
									changes: { links: newLinks },
								})
							}
							vinculationPending={updateLoading}
						/>
						<div className="flex w-full flex-wrap items-center justify-center gap-2">
							<Button onClick={() => setGenerateContractMenuIsOpen(true)}>GERAR CONTRATO</Button>
						</div>
					</div>
				)}
				<DrawerFooter>
					<div className="flex items-center gap-2">
						{infoHolder.aprovacao ? (
							<>
								<div className="flex items-center gap-1">
									<BsCalendarCheck color="rgb(34,197,94)" />
									<h1 className="text-primary/60 text-sm font-medium tracking-tight">APROVADO EM: {formatDateAsLocale(infoHolder.dataAprovacao, true)}</h1>
								</div>
								{infoHolder.confeccionado ? (
									<div className="flex items-center gap-1">
										<BsPatchCheck color="rgb(34,197,94)" />
										<h1 className="text-primary/60 text-sm font-medium tracking-tight">CONFECCIONADO</h1>
									</div>
								) : (
									<Button
										type="button"
										disabled={updateLoading}
										onClick={async () => {
											// @ts-ignore
											handleRequestUpdate({
												id: requestId,
												changes: { confeccionado: true },
											});

											if (infoHolder.idProjetoApp)
												await updateProject({
													id: infoHolder.idProjetoApp,
													changes: {
														"contrato.dataLiberacao": new Date().toISOString(),
													},
												});
										}}
										className="flex items-center gap-2"
									>
										<BsPatchCheck className="h-4 w-4 min-w-4 min-h-4" />
										<p className="">VALIDAR CONFECÇÃO</p>
									</Button>
								)}
							</>
						) : (
							<>
								<LoadingButton
									type="button"
									disabled={approvalLoading || updateLoading || rejectLoading}
									onClick={() => {
										// @ts-ignore
										handleApproveRequest(infoHolder);
									}}
									className="flex items-center gap-2 bg-green-800 hover:bg-green-600"
								>
									APROVAR FORMULÁRIO
								</LoadingButton>
								<LoadingButton
									type="button"
									disabled={rejectLoading || approvalLoading || updateLoading}
									onClick={() => {
										// @ts-ignore
										handleRejectRequest(infoHolder);
									}}
									className="flex items-center gap-2 bg-red-800 hover:bg-red-600"
								>
									REPROVAR FORMULÁRIO
								</LoadingButton>
							</>
						)}
						{infoHolder.tipoDeServico === "OPERAÇÃO E MANUTENÇÃO" ? (
							<Link href={`/adm/contratos/pdf/${requestId}`}>
								<Button
									type="button"
									className="flex items-center gap-2 rounded border border-orange-600 px-4 py-2 text-orange-600 duration-300 ease-in-out hover:border-orange-400 hover:text-orange-400"
								>
									<FaFile />
									<p className="text-xs font-bold tracking-tight">TEMPLATE DE CONTRATO</p>
								</Button>
							</Link>
						) : null}
					</div>

					<LoadingButton
						type="button"
						disabled={updateLoading || approvalLoading || rejectLoading}
						onClick={() => {
							// @ts-ignore
							handleRequestUpdate({
								id: requestId,
								changes: { ...infoHolder },
							});
						}}
						className="disabled:bg-primary/60 h-9 rounded bg-blue-800 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-blue-800 enabled:hover:text-white disabled:text-white"
					>
						ATUALIZAR FORMULÁRIO
					</LoadingButton>
				</DrawerFooter>
				{generateContractMenuIsOpen && (
					<GenerateContractMenu
						requestContractName={infoHolder.nomeDoContrato}
						requestId={requestId}
						closeMenu={() => setGenerateContractMenuIsOpen(false)}
					/>
				)}
			</DrawerContent>
		</Drawer>
	);
}

export default ContractRequestControlModal;

function GenerateContractMenu({
	requestContractName,
	requestId,
	closeMenu,
}: { requestContractName: string; requestId: string; closeMenu: () => void }) {
	const [infoHolder, setInfoHolder] = useState<{
		templateId: string | null;
		format: "pdf" | "docx";
	}>({
		templateId: null,
		format: "pdf",
	});
	const { data: contractTemplates } = useContractTemplates();
	const { mutate: handleGetContractDcoument, isPending: isGeneratingContractDocument } = useMutation({
		mutationKey: ["generate-contract-pdf", requestId],
		mutationFn: generateContract,
		onSuccess: (data) => {
			toast.success(data);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});

	return (
		<ResponsiveDialogDrawer
			menuTitle="GERAR CONTRATO"
			menuDescription="Selecione um template de contrato para gerar o contrato."
			menuActionButtonText="GERAR CONTRATO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => {
				if (!infoHolder.templateId) return toast.error("Selecione um template de contrato para gerar o contrato.");
				handleGetContractDcoument({
					requestId: requestId,
					contractName: requestContractName,
					contractFormat: infoHolder.format,
					templateId: infoHolder.templateId,
				});
			}}
			actionIsPending={isGeneratingContractDocument}
			stateIsLoading={false}
			stateError={null}
			closeMenu={closeMenu}
		>
			<SelectInput
				label="TEMPLATE DE CONTRATO"
				value={infoHolder.templateId}
				options={contractTemplates?.map((template) => ({ id: template._id, label: template.titulo, value: template._id })) ?? []}
				selectedItemLabel="NÃO DEFINIDO"
				handleChange={(value) => setInfoHolder({ ...infoHolder, templateId: value })}
				onReset={() => setInfoHolder({ ...infoHolder, templateId: null })}
				width="100%"
			/>
			<div className="w-full flex items-center justify-center gap-2">
				<Button variant={infoHolder.format === "pdf" ? "default" : "ghost"} onClick={() => setInfoHolder({ ...infoHolder, format: "pdf" })}>
					PDF
				</Button>
				<Button variant={infoHolder.format === "docx" ? "default" : "ghost"} onClick={() => setInfoHolder({ ...infoHolder, format: "docx" })}>
					DOCX
				</Button>
			</div>
		</ResponsiveDialogDrawer>
	);
}
