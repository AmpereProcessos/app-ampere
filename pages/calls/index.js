import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function Calls() {
	const router = useRouter();
	const { data: session, status } = useSession({ required: true });
	if (status != "authenticated") return <LoadingPage />;

	return (
		<div className="flex w-full grow flex-col bg-gray-100 p-6">
			<div className="flex w-full items-center justify-around border border-gray-300 bg-[#fff] p-4 shadow-xl">
				<h1 className="text-center font-['Roboto'] text-xl font-bold uppercase text-[#15599a]">Tipos de chamados</h1>
			</div>

			<div className="mt-5 flex w-full flex-wrap gap-4">
				{session?.user?.permissoes.rotas.includes("PPS") ? (
					<Link href="/calls/chamadosPPS">
						<div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-300 bg-[#fff] p-4 shadow-xl lg:w-[600px]">
							<h1 className="text-center font-raleway uppercase">Chamados Suporte PPS</h1>
						</div>
					</Link>
				) : (
					false
				)}
				{session?.user?.permissoes.rotas?.includes("O&M") || session?.user?.permissoes.rotas?.includes("Pós-Venda") ? (
					<Link href="/calls/chamadosSuporte">
						<div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-300 bg-[#fff] p-4 shadow-xl lg:w-[600px]">
							<h1 className="text-center font-raleway uppercase">Chamados Suporte</h1>
						</div>
					</Link>
				) : (
					false
				)}
				{session?.user?.permissoes.rotas.includes("Projetos") ? (
					<Link href="/calls/chamadosProjetos">
						<div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-300 bg-[#fff] p-4 shadow-xl lg:w-[600px]">
							<h1 className="text-center font-raleway uppercase">Chamados Projetos</h1>
						</div>
					</Link>
				) : (
					false
				)}
				{session?.user?.permissoes.rotas.includes("ADM") ? (
					<Link href="/calls/chamadosADM">
						<div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-300 bg-[#fff] p-4 shadow-xl lg:w-[600px]">
							<h1 className="text-center font-raleway uppercase">Chamados ADM</h1>
						</div>
					</Link>
				) : (
					false
				)}
				{session?.user?.permissoes.rotas.includes("Suprimentos") ? (
					<Link href="/calls/chamadosSuprimentos">
						<div className="flex h-[250px] w-full grow cursor-pointer flex-col justify-center border border-gray-300 bg-[#fff] p-4 shadow-xl lg:w-[600px]">
							<h1 className="text-center font-raleway uppercase">Chamados Suprimentos</h1>
						</div>
					</Link>
				) : (
					false
				)}
			</div>
		</div>
	);
}

export default Calls;
