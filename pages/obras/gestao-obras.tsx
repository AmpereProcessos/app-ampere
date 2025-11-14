import { useSession } from "@/components/providers/SessionProvider";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { formatDecimalPlaces } from "@/utils/constants";
import { useExecutionStats } from "@/utils/methods/query/stats";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsCalendarEvent, BsPatchCheck, BsTruck } from "react-icons/bs";
import { FaHourglassStart, FaPiggyBank } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { MdElectricMeter, MdRoofing } from "react-icons/md";
import { VscDebugStart } from "react-icons/vsc";
import LoadingPage from "../../components/utils/LoadingPage";

function GestaoDeObras() {
	const router = useRouter();
	const { session, status } = useSession();
	const isAuthorized = session?.user.permissoes.execucao.visualizar;

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <GestaoDeObrasContent session={session} />;
}

export default GestaoDeObras;

function GestaoDeObrasContent({ session }: { session: TAuthSession }) {
	const { data: stats, isLoading, isError, isSuccess } = useExecutionStats();

	return (
		<div className="flex w-full grow flex-col p-6">
			<div className="flex flex-col">
				<div className="flex w-full items-center justify-center rounded bg-[#15599a] p-2">
					<h1 className="font-bold text-white">DADOS DO PERÍODO</h1>
				</div>
				<div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-6 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">OBRAS INICIADAS</h1>
							<VscDebugStart />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats?.periodo?.iniciados || 0}</div>
							<div className="flex items-center gap-1">
								<FaHourglassStart />
								<p className="text-primary/80 text-xs font-medium uppercase">
									{formatDecimalPlaces((stats?.periodo.tempoMedioPlanejamento || 0) / 24)} dias em média de planejamento
								</p>
							</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-6 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">OBRAS CONCLUÍDAS</h1>
							<BsPatchCheck />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats?.periodo?.executados || 0}</div>
							<div className="flex items-center gap-1">
								<FaHourglassStart />
								<p className="text-primary/80 text-xs font-medium uppercase">
									{formatDecimalPlaces((stats?.periodo.tempoMedioExecucao || 0) / 24)} dias em média de execução
								</p>
							</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-6 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">ENTREGAS</h1>
							<BsTruck />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats?.periodo?.entregasEfetivadas || 0}</div>
							<div className="flex items-center gap-1">
								<BsCalendarEvent />
								<p className="text-primary/80 text-xs font-medium uppercase">
									{formatDecimalPlaces(stats?.periodo.entregasPrevistas || 0)} previstas em 30 dias
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-4 flex w-full items-center justify-center rounded bg-[#15599a] p-2">
					<h1 className="font-bold text-white">PENDÊNCIAS DE ADEQUAÇÃO</h1>
				</div>
				<div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-6 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PADRÕES</h1>
							<MdElectricMeter />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats?.adequacoesPadrao?.total || 0}</div>
							<div className="flex items-center gap-1">
								<FaPiggyBank />
								<p className="text-primary/80 text-xs font-medium uppercase">{stats?.adequacoesPadrao.pagos} pagos</p>
							</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-6 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">ESTRUTURAS</h1>
							<MdRoofing />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{stats?.adequacoesEstrutura?.total || 0}</div>
							<div className="flex items-center gap-1">
								<FaPiggyBank />
								<p className="text-primary/80 text-xs font-medium uppercase">{stats?.adequacoesEstrutura.pagos} pagos</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-4 flex w-full items-center justify-center rounded bg-[#fead41] p-2">
				<h1 className="font-bold text-white">ÁREAS DE CONTROLE</h1>
			</div>
			<div className="mt-5 flex w-full flex-wrap justify-center gap-4">
				<Link href="/obras/controle-padroes">
					<div className="border-primary/20 dark:hover:bg-primary/10 flex w-full cursor-pointer flex-col gap-2 rounded-md border p-3 shadow-xs duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[500px]">
						<h1 className="text-center leading-none font-bold tracking-tight">CONTROLE DE PADRÕES</h1>
						<div className="flex w-full items-center justify-center p-2">
							<MdElectricMeter style={{ color: "#15599a", fontSize: "45px" }} />
						</div>
						<p className="text-primary/60 text-center font-light">Área de gestão e controle de adequações de padrões pendentes.</p>
					</div>
				</Link>
				<Link href="/obras/controle-estruturas">
					<div className="border-primary/20 dark:hover:bg-primary/10 flex w-full cursor-pointer flex-col gap-2 rounded-md border p-3 shadow-xs duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[500px]">
						<h1 className="text-center leading-none font-bold tracking-tight">CONTROLE DE ESTRUTURAS</h1>
						<div className="flex w-full items-center justify-center p-2">
							<MdRoofing style={{ color: "#15599a", fontSize: "45px" }} />
						</div>
						<p className="text-primary/60 text-center font-light">Área de gestão e controle de adequações de estruturas pendentes.</p>
					</div>
				</Link>
				<Link href="/obras/conferenciaMaterial">
					<div className="border-primary/20 dark:hover:bg-primary/10 flex w-full cursor-pointer flex-col gap-2 rounded-md border p-3 shadow-xs duration-300 ease-in-out hover:border-blue-300 hover:bg-blue-100 lg:w-[500px]">
						<h1 className="text-center leading-none font-bold tracking-tight">ENTREGAS PARA CONFERÊNCIA</h1>
						<div className="flex w-full items-center justify-center p-2">
							<FaListCheck style={{ color: "#15599a", fontSize: "45px" }} />
						</div>
						<p className="text-primary/60 text-center font-light">Área de controle e conferência de materiais.</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
