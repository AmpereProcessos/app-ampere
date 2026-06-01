import { useSession } from "@/components/providers/SessionProvider";
import OemProjectsFilters from "@/components/identificador/oem/OemProjectsFilters";
import ProjectCardsTags from "@/components/utils/ProjectCardsTags";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { getDifferenceBetweenDates } from "@/utils/methods/dates";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useOeMProjects } from "@/utils/methods/query/oem";
import type { TProjectDTO } from "@/utils/schemas/projects";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { FaList, FaSolarPanel } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import ModalOeM from "../../components/ModalOeM";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import LoadingPage from "../../components/utils/LoadingPage";
import { formatDecimalPlaces } from "../../utils/constants";

function OemPage() {
	const { session, status } = useSession();
	const isAuthorized = session?.user.permissoes.suporte.visualizar;
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <OemContent session={session} />;
}

export default OemPage;

function OemContent({ session: _session }: { session: TAuthSession }) {
	const { data: projects, filters, setFilters } = useOeMProjects();
	const [modalProject, setModalProject] = useState<{ id: string | null; isOpen: boolean }>({
		id: null,
		isOpen: false,
	});

	function checkOeMEnding(
		dataMedidor: string | null | undefined,
		tipoDeServico: string,
		dataAssinatura: string | null | undefined,
	) {
		if (tipoDeServico === "OPERAÇÃO E MANUTENÇÃO") {
			if (dayjs().diff(dayjs(dataAssinatura), "days") > 15) {
				return { text: "O&M VENCIDO", color: "text-red-500" };
			}
			return { text: "O&M EM ANDAMENTO", color: "text-red-500" };
		}
		if (dataMedidor) {
			if (dayjs().diff(dayjs(dataMedidor), "days") > 365) {
				return { text: "O&M VENCIDO", color: "text-red-500" };
			}
			if (dayjs().diff(dayjs(dataMedidor), "days") > 350) {
				return { text: "O&M EM VENCIMENTO", color: "text-orange-500" };
			}
			return { text: "O&M EM ANDAMENTO", color: "text-green-500" };
		}
		return { text: "O&M EM ANDAMENTO", color: "text-green-500" };
	}

	function getStats({ info }: { info?: TProjectDTO[] }) {
		if (!info) {
			return {
				projetos: 0,
				potencia: 0,
				modulos: 0,
				manutencoesPendentes: 0,
				manutencoesAtrasadas: 0,
			};
		}

		const projectsQty = info.length;
		const totalPower = info.reduce((acc, current) => acc + (current.sistema?.potPico || 0), 0);
		const modulesQty = info.reduce((acc, current) => acc + (current.sistema.qtdeModulos || 0), 0);
		const pendingMaintenance = info.reduce((acc, current) => {
			const isPending = current.manutencoes.some((m) => !m.dataEfetivacao);
			if (isPending) acc += 1;
			return acc;
		}, 0);
		const overdueMaintenance = info.reduce((acc, current) => {
			const referenceDate = current.medidor.data ? current.medidor.data : current.contrato.dataAssinatura;
			const isOverDue = current.manutencoes.some(
				(m, index) =>
					!m.dataEfetivacao &&
					referenceDate &&
					getDifferenceBetweenDates({ start: new Date(referenceDate), end: new Date() }) >
						(index + 1) * 365,
			);
			if (isOverDue) acc += 1;
			return acc;
		}, 0);

		return {
			projetos: projectsQty,
			potencia: totalPower,
			modulos: modulesQty,
			manutencoesPendentes: pendingMaintenance,
			manutencoesAtrasadas: overdueMaintenance,
		};
	}

	return (
		<div className="grow p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
				<div className="flex w-full items-center justify-center lg:justify-start">
					<p className="text-center text-2xl font-black text-[#15599a] uppercase">
						PROJETOS NOS ESTAGIO DE O&M
					</p>
				</div>
				<div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
							<VscDiffAdded />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
							<p className="text-primary/60 text-xs">
								{formatDecimalPlaces(getStats({ info: projects }).potencia)} kWp
							</p>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">QUANTIDADE DE MÓDULOS</h1>
							<FaSolarPanel />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).modulos}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">MANUTENÇÕES PENDENTES</h1>
							<FaList />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">
								{getStats({ info: projects }).manutencoesPendentes}{" "}
							</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">MANUTENÇÕES ATRASADAS</h1>
							<MdError />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">
								{getStats({ info: projects }).manutencoesAtrasadas}{" "}
							</div>
						</div>
					</div>
				</div>
				<OemProjectsFilters filters={filters} setFilters={setFilters} />
			</div>
			<div className="mt-4 flex flex-wrap justify-around gap-3 overflow-y-auto overscroll-y-auto">
				{projects ? (
					projects.map((project) => (
						<div
							onClick={() => {
								setModalProject({ id: project._id, isOpen: true });
							}}
							key={project._id}
							className="border-primary/20 dark:hover:bg-primary/10 w-full cursor-pointer border hover:bg-blue-100 md:w-[350px] lg:w-[450px]"
						>
							<TagTipoDeServico tipoDeServico={project.tipoDeServico} />
							<div className="flex flex-col p-2 pb-3">
								<div className="flex items-center justify-between">
									<p className="text-primary/70 text-xs font-bold">{project.nomeDoContrato}</p>
									<p className="text-xs font-bold text-[#15599a]">#{project.qtde}</p>
								</div>
								<ProjectCardsTags projectTags={project.etiquetas} />

								<div className="mt-2 flex items-center justify-between">
									<div className="flex flex-col items-start">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">CIDADE</span>
										<p className="text-xs font-medium tracking-tight">{project.cidade}</p>
									</div>
									<div className="flex flex-col items-end">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">TOPOLOGIA</span>
										<p className="text-xs font-medium tracking-tight">{project.sistema.topologia}</p>
									</div>
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="flex flex-col items-start">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">
											STATUS DO O&M
										</span>
										<p
											className={`text-xs font-medium tracking-tight ${checkOeMEnding(project.medidor.data, project.tipoDeServico, project.contrato.dataAssinatura).color}`}
										>
											{
												checkOeMEnding(
													project.medidor.data,
													project.tipoDeServico,
													project.contrato.dataAssinatura,
												).text
											}
										</p>
									</div>
									<div className="flex flex-col items-end">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">
											NÚMERO DE MÓDULOS
										</span>
										<p className="text-xs font-medium tracking-tight">{project.sistema.qtdeModulos}</p>
									</div>
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="flex flex-col items-start">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">
											EQUIPE TÉCNICA
										</span>
										<p className="text-xs font-medium tracking-tight">
											{project.obra.equipeResp || "NÃO DEFINIDO"}
										</p>
									</div>
									<div className="flex flex-col items-end">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">
											SAÍDA DE OBRA
										</span>
										<p className="text-xs font-medium tracking-tight">
											{formatDateAsLocale(project.obra.saida)}
										</p>
									</div>
								</div>
								<div className="mt-2 flex items-center justify-center">
									<div className="flex flex-col items-center">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">
											PLANO DE O&M
										</span>
										<p className="text-center text-xs font-medium tracking-tight text-cyan-500">
											{project.oem?.plano || "NÃO DEFINIDO"}
										</p>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<LoadingPage />
				)}
			</div>
			<Link href="/oem/baixaPerformance">
				<div className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
					<p className="text-sm font-bold uppercase">ACOMPANHAMENTO DE PERFORMANCE</p>
				</div>
			</Link>
			{modalProject.id && modalProject.isOpen ? (
				<ModalOeM
					closeModal={() => setModalProject({ id: null, isOpen: false })}
					modalIsOpen={modalProject.isOpen}
					projectId={modalProject.id}
				/>
			) : null}
		</div>
	);
}
