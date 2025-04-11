import ProjectActivityCard from "@/components/identificador/atividades/ProjectActivityCard";
import ModalDB from "@/components/ModalDB";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useMonitoringProjects } from "@/utils/methods/query/oem";
import type { TMonitoringProjectDTOSimplified } from "@/utils/schemas/projects";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaExpandArrowsAlt, FaPhone, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail, MdOutlineCheckBox } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import { type QueryClient, useQueryClient } from "@tanstack/react-query";

function Monitoring() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session, status } = useSession({ required: true });
	const { data: projects, isLoading, isError, isSuccess, error } = useMonitoringProjects();
	const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });
	useEffect(() => {
		if (session) {
			const userRoutes = session?.user.permissoes.rotas;
			const technicalSupportViewPermission = session.user.permissoes.suporte.editar;
			if (!userRoutes.includes("O&M") && !technicalSupportViewPermission) {
				router.push("/");
			}
		}
	}, [session]);
	if (status !== "authenticated") return <LoadingPage />;
	return (
		<div className="grow p-6">
			<div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
				<div className="GAP-2 flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS DE MONITORAMENTO</p>
					</div>
				</div>
			</div>
			<div className="mt-4 flex flex-wrap justify-around gap-3 overflow-y-auto overscroll-y-auto">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					projects.length > 0 ? (
						projects.map((project) => <MonitoringProjectCard key={project._id} project={project} handleClick={(id) => setEditModal({ id, isOpen: true })} queryClient={queryClient} />)
					) : (
						<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum projeto de monitoramento encontrado.</div>
					)
				) : null}
			</div>
			{editModal.id && editModal.isOpen ? (
				<ModalDB session={session} projectId={editModal.id} closeModal={() => setEditModal({ id: null, isOpen: false })} modalIsOpen={editModal.isOpen} />
			) : null}
		</div>
	);
}

export default Monitoring;

type MonitoringProjectCardProps = {
	project: TMonitoringProjectDTOSimplified;
	handleClick: (id: string) => void;
	queryClient: QueryClient;
};
function MonitoringProjectCard({ project, handleClick, queryClient }: MonitoringProjectCardProps) {
	const [activitiesMenuIsOpen, setActivitiesMenuIsOpen] = useState<boolean>(false);

	const openActivitiesCount = project.atividades ? project.atividades.filter((a) => !a.dataConclusao).length : 0;

	return (
		<div className="flex w-full flex-col gap-2 rounded-md border border-gray-500 p-3 shadow-sm">
			<div className="flex w-full flex-col items-start justify-between lg:flex-row lg:items-center">
				<h1 className="font-bold leading-none tracking-tight">
					<strong className="text-[#fead41]">#{project.qtde}</strong> {project.nomeDoContrato}
				</h1>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
					<div className="flex items-center gap-1">
						<FaUser width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.vendedor.nome}</h1>
					</div>
					<div className="flex items-center gap-1">
						<FaPhone width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.telefone || "N/A"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<MdEmail width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.email || "N/A"}</h1>
					</div>
				</div>
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-1">
						<FaLocationDot width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LOCALIZAÇÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
							{formatLocation({
								location: {
									uf: project.uf,
									cidade: project.cidade,
									cep: project.cep?.toString() || "",
									bairro: project.bairro,
									endereco: project.logradouro,
									numeroOuIdentificador: project.numeroResidencia?.toString() || "",
								},
								includeCity: true,
								includeUf: true,
							})}
						</h1>
					</div>
				</div>
			</div>
			<div className="mt-1 flex w-full items-center justify-between">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => handleClick(project._id)}
						className="flex items-center gap-1 rounded border border-[#fead41] py-1 px-4 text-xs font-medium text-[#fead41] duration-300 ease-in-out hover:bg-[#fead41] hover:text-white"
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
							} flex items-center gap-1 rounded border py-1 px-4 text-xs font-medium duration-300 ease-in-out hover:text-white`}
						>
							<p>ATIVIDADES</p>
							<MdOutlineCheckBox size={18} />
						</button>
					</div>
				</div>
				{/* <button
            disabled={isLoading}
            onClick={() => {
              // @ts-ignore
              handleUpdateProject({ id: projectId, changes: { 'jornada.obsJornada': infoHolder.jornada.obsJornada } })
            }}
            className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
           >
            SALVAR ANOTAÇÕES
           </button> */}
			</div>
			{activitiesMenuIsOpen ? (
				project.atividades && project.atividades.length > 0 ? (
					<div className="mt-1 flex w-full flex-col gap-1">
						{project.atividades.map((activity) => (
							<ProjectActivityCard
								key={activity._id}
								activity={activity}
								projectId={project._id}
								mutateCallback={() => queryClient.invalidateQueries({ queryKey: ["monitoring-projects"] })}
							/>
						))}
					</div>
				) : (
					<h1 className="w-full py-1 text-center text-sm italic text-gray-500">Nenhuma atividade cadastrada...</h1>
				)
			) : null}
		</div>
	);
}
