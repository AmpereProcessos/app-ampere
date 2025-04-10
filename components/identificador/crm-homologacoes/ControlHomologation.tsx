import React, { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { Session } from "next-auth";

import { MdCode } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";

import EquipmentsComposition from "./EquipmentsComposition";
import HolderInformation from "./HolderInformation";
import InstallationInformation from "./InstallationInformation";
import LocationInformation from "./LocationInformation";

import ErrorComponent from "@/components/utils/ErrorComponent";

import Link from "next/link";
import { useHomologationById } from "@/utils/methods/query/crm/homologations";
import { useQueryClient } from "@tanstack/react-query";

import LoadingPage from "@/components/utils/LoadingPage";
import type { THomologation, THomologationDTO } from "@/utils/schemas/crm/homologation.schema";
import { editHomologation } from "@/utils/methods/mutation/crm/homologations";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import ActivitiesInformation from "./ActivitiesInformation";
import UpdatesInformation from "./UpdatesInformation";
import StatusInformation from "./StatusInformation";
import ApplicantBlock from "./ApplicantBlock";
import HomologationFiles from "./Files";
import DocumentationInformation from "./DocumentationInformation";
import AccessInformation from "./AccessInformation";
import VistoryInformation from "./VistoryInformation";
import PendenciesInformation from "./PendenciesInformation";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

type ControlHomologationProps = {
	homologationId: string;
	session: Session;
	closeModal: () => void;
};
function ControlHomologation({ homologationId, session, closeModal }: ControlHomologationProps) {
	const queryClient = useQueryClient();
	const { data: homologation, isLoading, isError, isSuccess } = useHomologationById({ id: homologationId });
	const [infoHolder, setInfoHolder] = useState<THomologationDTO>({
		_id: "id-holder",
		status: "PENDENTE",
		distribuidora: "",
		idParceiro: "",
		oportunidade: {
			id: "",
			nome: "",
		},
		pendencias: {},
		requerente: {
			id: session.user.id,
			nome: session.user.nome,
			apelido: session.user.nome,
			contato: session.user.telefone || "",
			avatar_url: session.user.avatar_url,
		},
		titular: {
			nome: "",
			identificador: "",
			contato: "",
		},
		equipamentos: [],
		localizacao: {
			cep: null,
			uf: "",
			cidade: "",
			bairro: null,
			endereco: null,
			numeroOuIdentificador: null,
			complemento: null,
			// distancia: z.number().optional().nullable(),
		},
		instalacao: {
			numeroInstalacao: "",
			numeroCliente: "",
			grupo: "RESIDENCIAL",
			dependentes: [],
		},
		documentacao: {
			formaAssinatura: "FÍSICA",
			dataLiberacao: null,
			dataAssinatura: null,
		},
		acesso: {
			codigo: "",
			dataSolicitacao: null,
			dataResposta: null,
		},
		atualizacoes: [],
		vistoria: {
			dataSolicitacao: null,
			dataEfetivacao: null,
		},
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});

	const { mutate: handleUpdateHomologation, isPending: mutationLoading } = useMutationWithFeedback({
		mutationKey: ["edit-homologation", homologationId],
		mutationFn: editHomologation,
		queryClient: queryClient,
		affectedQueryKey: ["homologations"],
	});
	useEffect(() => {
		if (homologation) setInfoHolder(homologation);
	}, [homologation]);
	return (
		<div id="new-technical-analysis" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<div className="relative left-[50%] top-[50%] z-[100] h-[80%] max-h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-md bg-[#fff] p-[10px] lg:w-[80%]">
				<div className="flex h-full w-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
						<div className="flex flex-col">
							<h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR HOMOLOGAÇÃO</h3>
							<h3 className="text-[0.65rem] font-bold text-gray-500 dark:text-white ">#{homologationId}</h3>
						</div>

						<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg="Oops, houve um erro ao buscar a homologação." /> : null}
					{isSuccess ? (
						<>
							<div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
								<div className="my-2 flex flex-col items-center justify-center">
									<h1 className="font-bold">OPORTUNIDADE</h1>
									{infoHolder.oportunidade.id ? (
										<Link href={`https://crm.ampereenergias.com.br/comercial/oportunidades/id/${infoHolder.oportunidade.id}`}>
											<div className="flex items-center gap-1 rounded-lg bg-cyan-500 px-2 py-1 text-white">
												<MdCode />
												<p className="text-sm font-bold tracking-tight">{infoHolder.oportunidade.nome}</p>
											</div>
										</Link>
									) : (
										<p className="text-sm font-bold tracking-tight">SEM OPORTUNIDADE DEFINIDA</p>
									)}
								</div>

								<ActivitiesInformation session={session} homologation={homologation} opportunity={homologation.oportunidade} />
								<UpdatesInformation session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
								<PendenciesInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder as Dispatch<SetStateAction<THomologation>>} />

								<StatusInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder as Dispatch<SetStateAction<THomologation>>} />

								<ApplicantBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as Dispatch<SetStateAction<THomologation>>} />

								<HolderInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder as Dispatch<SetStateAction<THomologation>>} />

								<HomologationFiles session={session} homologationId={homologationId} />
								<InstallationInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder as Dispatch<SetStateAction<THomologation>>} />

								<LocationInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder as Dispatch<SetStateAction<THomologation>>} />

								<EquipmentsComposition infoHolder={infoHolder} setInfoHolder={setInfoHolder as Dispatch<SetStateAction<THomologation>>} />

								<DocumentationInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
								<AccessInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
								<VistoryInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
								{/* <AttachFiles opportunityId={homologation.oportunidade.id} files={files} setFiles={setFiles} /> */}
							</div>
							<div className="flex w-full items-center justify-end p-2">
								<LoadingButton loading={mutationLoading} onClick={() => handleUpdateHomologation({ id: homologationId, changes: infoHolder })}>
									ATUALIZAR HOMOLOGAÇÃO
								</LoadingButton>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default ControlHomologation;
