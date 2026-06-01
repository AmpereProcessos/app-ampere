import CommissioningProjectsFilters from "@/components/identificador/oem/CommissioningProjectsFilters";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useExecutionCommissioningProjects } from "@/utils/methods/query/oem";
import type { TProjectDTO } from "@/utils/schemas/projects";
import Link from "next/link";
import { TbAlertHexagonFilled } from "react-icons/tb";
import { VscDiffAdded } from "react-icons/vsc";
import ComissionamentoPosObraCard from "../../components/ComissionamentoPosObraCard";
import LoadingPage from "../../components/utils/LoadingPage";

function Comissionamento() {
	const { session, status } = useSession();

	const isAuthorized =
		session?.user.permissoes.suporte.visualizar || session?.user.permissoes.posVenda.visualizar;

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <ComissionamentoContent session={session} />;
}

export default Comissionamento;

function ComissionamentoContent({ session: _session }: { session: TAuthSession }) {
	const { data: projects, isLoading, isError, isSuccess, error, filters, setFilters } =
		useExecutionCommissioningProjects();
	const errorMsg = getErrorMessage(error);

	function getStats({ info }: { info?: TProjectDTO[] }) {
		if (!info)
			return {
				projetos: 0,
				pendenteUsinaLigada: 0,
				pendenteEnergiaInjetada: 0,
				pendenteConfiguracaoApp: 0,
				pendenteMonitoramento: 0,
			};

		const pendeningPlantPoweredCheck = info.reduce(
			(acc, current) => (!current.conferencias.usinaLigada.data ? acc + 1 : acc),
			0,
		);
		const pendeningEnergyInjectionCheck = info.reduce(
			(acc, current) => (!current.conferencias.energiaInjetada.data ? acc + 1 : acc),
			0,
		);
		const pendeningAppConfig = info.reduce((acc, current) => (!current.app.data ? acc + 1 : acc), 0);
		const pendeningMonitoring = info.reduce(
			(acc, current) => (!current.conferencias.monitoramentoFeito.data ? acc + 1 : acc),
			0,
		);

		return {
			projetos: info.length,
			pendenteUsinaLigada: pendeningPlantPoweredCheck,
			pendenteEnergiaInjetada: pendeningEnergyInjectionCheck,
			pendenteConfiguracaoApp: pendeningAppConfig,
			pendenteMonitoramento: pendeningMonitoring,
		};
	}

	return (
		<div className="flex grow flex-col p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
				<div className="flex w-full items-center justify-center lg:justify-start">
					<p className="text-center text-2xl font-black text-[#15599a] uppercase">
						PROJETOS PARA COMISSIONAMENTO PÓS-OBRA
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
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE USINA LIGADA</h1>
							<TbAlertHexagonFilled />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">
								{getStats({ info: projects }).pendenteUsinaLigada}{" "}
							</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE ENERGIA INJETADA</h1>
							<TbAlertHexagonFilled />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">
								{getStats({ info: projects }).pendenteEnergiaInjetada}
							</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE CONFIGURAÇÃO DO APP</h1>
							<TbAlertHexagonFilled />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">
								{getStats({ info: projects }).pendenteConfiguracaoApp}
							</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PENDENTE MONITORAMENTO</h1>
							<TbAlertHexagonFilled />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">
								{getStats({ info: projects }).pendenteMonitoramento}
							</div>
						</div>
					</div>
				</div>
				<CommissioningProjectsFilters filters={filters} setFilters={setFilters} />
			</div>

			<div className="mt-2 flex flex-col gap-2">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={errorMsg} /> : null}
				{isSuccess ? (
					projects && projects.length > 0 ? (
						projects.map((project, index) => (
							<ComissionamentoPosObraCard key={project._id} project={project} index={index} />
						))
					) : (
						<p className="text-primary/60 w-full text-center font-medium">Nenhum projeto foi encontrado.</p>
					)
				) : null}
			</div>
			<Link href="/vendas/entregaTecnica">
				<div className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
					<p className="text-sm font-bold uppercase">ENTREGAS TÉCNICAS PRESENCIAIS</p>
				</div>
			</Link>
		</div>
	);
}
