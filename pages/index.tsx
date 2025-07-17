import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AreaChart, Area, LineChart, Legend, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis, BarChart, Bar } from "recharts";

import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { useSession } from "next-auth/react";
import LoadingPage from "../components/utils/LoadingPage";
import { formatDecimalPlaces, sellerPhotos } from "../utils/constants";

import { useDashboardStats, useSalesGraphStats } from "@/utils/methods/query/stats";
import ErrorComponent from "@/components/utils/ErrorComponent";
import ClientsBirthdays from "@/components/identificador/dashboard/ClientsBirthdays";
import { getArrOfYearsBetweenYears } from "@/utils/methods/dates";
import ComercialCompanyGoalsTracking from "@/components/identificador/resultados/ComercialCompanyGoalsTracking";
import { FaRankingStar } from "react-icons/fa6";

const months = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

function renderAvatarBySeller(sellerName: string) {
	if (!sellerName) {
		return (
			<div className="flex h-[30px] max-h-[50px] w-[30px] max-w-[50px] items-center justify-center self-center rounded-full bg-gray-700 lg:h-[50px] lg:w-[50px]">
				<p className="text-center text-xs font-bold text-white lg:text-lg">V</p>
			</div>
		);
	}
	const existingSellerWithPhoto = sellerPhotos.find((x) => x.nome === sellerName);
	if (!existingSellerWithPhoto) {
		const splittedName = sellerName.split(" ");
		const firstLetter = splittedName[0][0];
		let secondLetter = "";
		if (["DE", "DA", "DO", "DOS", "DAS"].includes(splittedName[1])) secondLetter = splittedName[2] ? splittedName[2][0] : "";
		else secondLetter = splittedName[1] ? splittedName[1][0] : "";

		return (
			<div className="flex h-[30px] max-h-[50px] w-[30px] max-w-[50px] items-center justify-center self-center rounded-full bg-gray-700 lg:h-[50px] lg:w-[50px]">
				<p className="text-center text-xs font-bold uppercase text-white lg:text-lg">
					{firstLetter}
					{secondLetter}
				</p>
			</div>
		);
	}
	return (
		<div className="relative h-[30px] max-h-[50px] w-[30px] max-w-[50px] self-center lg:h-[50px] lg:w-[50px]">
			<Image fill={true} src={existingSellerWithPhoto.avatar_url} alt={existingSellerWithPhoto.nome} style={{ borderRadius: "100%" }} />
		</div>
	);
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

function Home() {
	const ref = useRef();
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
	});
	const [year, setYear] = useState<number>(currentYear);
	const { data: stats, isLoading, isSuccess, isError } = useDashboardStats();
	const { data: salesGraph } = useSalesGraphStats({ year });

	function validateStatsMonth(identifier: string) {
		const currentMonth = new Date().getMonth() + 1;
		const splited = identifier.split("/");
		const month = Number(splited[0]);
		const year = Number(splited[1]);
		if (month >= currentMonth) return null;
		if (month >= 10) return <p className="text-xs font-semibold text-[#fead61]">{`${month}/${year}`}</p>;
		return <p className="text-xs font-semibold text-[#fead61]">{`0${month}/${year}`}</p>;
	}
	console.log(session);
	if (status === "loading") return <LoadingPage />;
	if (status === "authenticated") {
		if (session.user?.visualizacao.tipo === "EXECUÇÃO") {
			router.push("/ordens-de-servico/designadas");
			return <></>;
		}

		if (isLoading) return <DashboardSkeleton />;
		if (isError) return <ErrorComponent msg={"Oops, houve um erro ao carregar o dashboard geral."} />;
		if (isSuccess)
			return (
				<div className="relative grow bg-[#fafafa] p-6">
					<div className="flex w-full flex-col">
						{/* <ComercialCompanyGoalsTracking results={stats.meta} />
						 */}
						<div className="flex w-full flex-col gap-2">
							<div className="flex w-full items-center justify-center gap-2">
								<FaRankingStar />
								<h1 className="text-base font-bold uppercase">RANKING DO MÊS</h1>
							</div>
							<div className="flex w-full justify-center gap-2">
								<div className="flex w-full items-center justify-center lg:w-[70%]">
									<div className="flex w-full items-center justify-center">
										<div className="mb-2 flex w-full flex-col items-center">
											<div className="flex h-fit w-full items-end justify-center gap-4 p-0 lg:h-[425px] lg:w-[1200px] lg:gap-10 lg:p-6">
												<div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
													{renderAvatarBySeller(stats?.ranking.quarto.nome || "N/A")}
													<h1 className="text-center text-sm font-bold text-gray-500">{stats?.ranking.quarto.nome}</h1>
													<div className="flex h-[30%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">4º</div>
												</div>
												<div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
													{renderAvatarBySeller(stats?.ranking.segundo.nome || "N/A")}
													<h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{stats?.ranking.segundo.nome || "N/A"}</h1>
													<div className="flex h-[60%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">2º</div>
												</div>
												<div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
													{renderAvatarBySeller(stats?.ranking.primeiro.nome || "N/A")}
													<h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{stats?.ranking.primeiro.nome || "N/A"}</h1>
													<div className="flex w-full grow items-center justify-center bg-[#fead41] text-3xl font-bold text-white">1º</div>
												</div>
												<div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
													{renderAvatarBySeller(stats?.ranking?.terceiro.nome || "N/A")}
													<h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{stats?.ranking?.terceiro.nome || "N/A"}</h1>
													<div className="flex h-[40%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">3º</div>
												</div>
												<div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
													{renderAvatarBySeller(stats?.ranking.quinto.nome || "N/A")}
													<h1 className="text-center text-sm font-bold text-gray-500">{stats?.ranking.quinto.nome || "N/A"}</h1>
													<div className="flex h-[15%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">5º</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="grid-rows-10 mt-2 grid w-full grid-cols-1 gap-y-2 lg:grid-cols-10  lg:grid-rows-1 lg:gap-x-3">
							<div className="col-span-2 flex h-[250px] flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl">
								<div className="flex justify-between">
									<h1 className="text-center uppercase tracking-tight text-gray-600">Obras finalizadas no mês</h1>
									{validateStatsMonth(stats.instalacao.atual.identificador)}
								</div>
								<p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">{stats.instalacao.atual.contagem} obras</p>
								<p className="text-center text-xs text-gray-600">
									Último mês: <strong>{stats.instalacao.anterior.contagem || "N/A"}</strong>
								</p>
							</div>
							<div className="col-span-2 flex h-[250px] flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl">
								<div className="flex justify-between">
									<h1 className="text-center uppercase tracking-tight text-gray-600">Potência Pico instalada no mês</h1>
									{validateStatsMonth(stats.instalacao.atual.identificador)}
								</div>
								<p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{formatDecimalPlaces(stats.instalacao.atual.valor)} kWp</p>
								<p className="text-center text-xs text-gray-600">
									Último mês: <strong>{formatDecimalPlaces(stats.instalacao.anterior.valor)} kWp</strong>
								</p>
							</div>
							<div className="col-span-2 flex h-[250px] flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl">
								<div className="flex justify-between">
									<h1 className="text-center uppercase tracking-tight text-gray-600">Potência Pico homologada no mês</h1>
									{validateStatsMonth(stats.homologacao.atual.identificador)}
								</div>
								<p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{formatDecimalPlaces(stats.homologacao.atual.potencia)} kWp</p>
								<p className="text-center text-xs text-gray-600">
									Último mês: <strong>{formatDecimalPlaces(stats.homologacao.anterior.potencia)} kWp</strong>
								</p>
							</div>
							<div className="col-span-2 flex h-[250px] flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl">
								<div className="flex justify-between">
									<h1 className="text-center uppercase tracking-tight text-gray-600">TEMPO MÉDIO PARA COMPRA</h1>
									{validateStatsMonth(stats.suprimentos.atual.identificador)}
								</div>
								<p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{formatDecimalPlaces(stats.suprimentos.atual.tempoMedio, 0)} dias</p>
								<p className="text-center text-xs text-gray-600">
									Último mês: <strong>{formatDecimalPlaces(stats.suprimentos.anterior.tempoMedio, 0)} dias</strong>
								</p>
							</div>
							<div className="col-span-2 flex h-[250px] flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl">
								<div className="flex justify-between">
									<h1 className="text-center uppercase tracking-tight text-gray-600">TEMPO MÉDIO DE APROVAÇÃO</h1>
									{validateStatsMonth(stats.homologacao.atual.identificador)}
								</div>
								<p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{formatDecimalPlaces(stats.homologacao.atual.tempoMedio, 0)} dias</p>
								<p className="text-center text-xs text-gray-600">
									Último mês: <strong>{formatDecimalPlaces(stats.homologacao.anterior.tempoMedio, 0)} dias</strong>
								</p>
							</div>
						</div>
						<div className="mt-4 grid grid-cols-1 grid-rows-2 gap-y-2 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
							<div className="col-span-2 flex h-[425px] flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl">
								<h1 className="text-center text-xl text-gray-600">NPS</h1>
								<div className="flex grow items-center justify-center">
									<div className="h-[150px] w-[150px]">
										<CircularProgressbar
											styles={buildStyles({
												// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
												strokeLinecap: "butt",
												// Text size
												textSize: "16px",
												// How long animation takes to go from one percentage to another, in seconds
												pathTransitionDuration: 0.5,

												// Can specify path transition in more detail, or remove it entirely
												// pathTransition: 'none',

												// Colors
												pathColor: `#fead61`,
												textColor: "#15599a",
												trailColor: "#d6d6d6",
												backgroundColor: "#3e98c7",
											})}
											value={stats.nps}
											text={`${formatDecimalPlaces(stats.nps)}%`}
											strokeWidth={6}
										/>
									</div>
								</div>
							</div>
							<div className="col-span-8 flex h-[600px] flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl lg:h-[425px]">
								<div className="flex w-full flex-wrap items-center gap-2 py-2">
									<h1 className="text-center text-xl uppercase text-gray-600">Potência pico vendida</h1>
									<div className="flex grow flex-wrap items-center justify-end gap-x-2">
										{getArrOfYearsBetweenYears({ initialYear: 2020, endYear: currentYear }).map((yearValue, index) => (
											<p
												key={index}
												onClick={() => {
													setYear(yearValue);
												}}
												className={`cursor-pointer border border-gray-300 duration-500 ease-in-out hover:scale-105 ${
													year == yearValue ? "bg-blue-200 hover:bg-transparent" : "bg-transparent hover:bg-blue-200"
												} p-2 text-xs text-gray-600`}
											>
												{yearValue}
											</p>
										))}
									</div>
								</div>
								<ResponsiveContainer width="100%">
									<AreaChart width={550} height={300} data={salesGraph || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
										<defs>
											<linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#15599a" stopOpacity={0.8} />
												<stop offset="95%" stopColor="#15599a" stopOpacity={0} />
											</linearGradient>
										</defs>
										<XAxis dataKey="IDENTIFICADOR" />
										<YAxis
											dataKey={"VALOR"}
											domain={[
												0,
												salesGraph
													? Math.max.apply(
															null,
															salesGraph.map((s) => s.VALOR),
														)
													: 2000,
											]}
										/>

										<CartesianGrid strokeDasharray="3 3" />
										<Tooltip />
										<Area type="monotone" dataKey="VALOR" stroke="#15599a" fillOpacity={1} fill="url(#colorTotal)" />
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>
						<ClientsBirthdays />
					</div>
				</div>
			);
	}
}

export default Home;
