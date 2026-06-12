import React, { useState } from "react";

import Link from "next/link";
import ModalADM from "../../components/ModalADM";

import ADMProjectCard from "@/components/identificador/adm/ADMProjectCard";
import ADMProjectsFilters from "@/components/identificador/adm/ADMProjectsFilters";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import { useADMProjects } from "@/utils/methods/query/adm";
import { useTags } from "@/utils/methods/query/tags";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdPaid } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import LoadingPage from "../../components/utils/LoadingPage";
import type { TAuthSession } from "@/lib/authentication/types";

function Administracao() {
	const { session, status } = useSession();

	const isAuthorized = session?.user.permissoes.administrativo.visualizar;
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <AdministracaoContent session={session} />;
}

export default Administracao;

function AdministracaoContent({ session: _session }: { session: TAuthSession }) {
	const { data: projectsResult, filters, setFilters, isLoading, isSuccess, isError } = useADMProjects();
	const { data: tags } = useTags({ initialFilters: { applicableToProjects: "true" } });
	const projects = projectsResult?.projects ?? [];
	const projectsMatched = projectsResult?.projectsMatched ?? 0;
	const projectsShowing = projects.length;
	const totalPages = projectsResult?.totalPages ?? 0;

	const [modalProject, setModalProject] = useState<{ isOpen: boolean; projectId: string | null }>({ isOpen: false, projectId: null });

	function getStats({ info, matched }: { info: TProjectDTO[] | undefined; matched: number }) {
		if (!info) return { projetos: 0, cobrancasPendentes: 0, faturamentosPendentes: 0 };
		const projectsQty = matched;
		const pendingCharges = info.reduce((acc, current) => {
			const toCharge = !current.pagamento.cobrancaFeita;
			if (toCharge) return acc + 1;
			return acc;
		}, 0);
		const pendingBilling = info.reduce((acc, current) => {
			const toBill = !current.faturamento.concluido;
			if (toBill) return acc + 1;
			return acc;
		}, 0);
		return { projetos: projectsQty, cobrancasPendentes: pendingCharges, faturamentosPendentes: pendingBilling };
	}

	const stats = getStats({ info: projects, matched: projectsMatched });

	function handleOpenModal(id: string) {
		return setModalProject({ isOpen: true, projectId: id });
	}

	return (
		<div className="flex grow flex-col gap-6 p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
				<div className="flex w-full items-center justify-center lg:justify-start">
					<p className="text-center text-2xl font-black text-[#15599a] uppercase">Projetos no estágio de cobrança/faturamento</p>
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
							<VscDiffAdded />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.projetos}</div>
						</div>
					</div>

					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">COBRANÇAS PENDENTES</h1>
							<MdPaid />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.cobrancasPendentes}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">FATURAMENTOS PENDENTES</h1>
							<IoDocumentTextOutline />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats.faturamentosPendentes}</div>
						</div>
					</div>
				</div>
				<ADMProjectsFilters
					filters={filters}
					setFilters={setFilters}
					tagOptions={tags?.map((t) => ({ id: t._id, value: t._id, label: t.titulo })) ?? []}
				/>
			</div>
			<GeneralPaginationComponent
				activePage={filters.page}
				queryLoading={isLoading}
				selectPage={(page) => setFilters({ page })}
				totalPages={totalPages}
				itemsMatchedText={`Foram encontrados ${projectsMatched} projetos.`}
				itemsShowingText={`Mostrando ${projectsShowing} projetos.`}
			/>
			<div className="mt-4 flex flex-wrap justify-around gap-3">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar projetos."} /> : null}
				{isSuccess && projects.length > 0
					? projects.map((project, index) => (
							<ADMProjectCard key={project._id} project={project} index={index} handleClick={(id) => handleOpenModal(id)} />
						))
					: null}
				{isSuccess && projects.length === 0 ? (
					<p className="text-primary/60 w-full text-center font-medium">Nenhum projeto foi encontrado...</p>
				) : null}
			</div>
			<Link href={"/comercial/solicitacoes-contrato"}>
				<div className="fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
					<p className="text-sm font-bold uppercase">SOLICITAÇÕES DE CONTRATO</p>
				</div>
			</Link>
			{modalProject.isOpen && modalProject.projectId ? (
				<ModalADM
					projectId={modalProject.projectId}
					modalIsOpen={modalProject.isOpen}
					closeModal={() => setModalProject({ isOpen: false, projectId: null })}
				/>
			) : null}
		</div>
	);
}
