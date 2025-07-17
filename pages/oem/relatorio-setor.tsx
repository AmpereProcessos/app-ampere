import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "../../components/utils/LoadingPage";
import { useOeMReportData } from "../../utils/methods/query/oem";
import { cidadesAtendidas, formatDate, formatDecimalPlaces, formatToMoney, validateAuthorization } from "../../utils/constants";
import { FaSolarPanel, FaHome, FaUserAlt } from "react-icons/fa";
import dayjs from "dayjs";
// @ts-ignore
import dayjsBusinessDays from "dayjs-business-days";
import DateFloatingInput from "../../components/DateFloatingInput";
import { AnimatePresence, motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Select from "react-select";
import DateInput from "../../components/inputs/Date";
import NumberFloatingInput from "../../components/NumberFloatingInput";
import SelectInput from "../../components/inputs/Select";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TProjectDTO } from "@/utils/schemas/projects";
import { formatDateAsLocale } from "@/utils/methods/formatting";

import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
import AllCities from "../../utils/jsons/cidades.json";
import { BsCalendar, BsCalendarX } from "react-icons/bs";
dayjs.extend(dayjsBusinessDays);

const initialFirstScenario = {
	dueDate: "2022-12-31T20:00:00.000Z",
	dilutionDate: "2024-04-15T20:00:00.000Z",
	showClients: false,
};
const initialSecondScenario = {
	dueDate: "2023-12-31T20:00:00.000Z",
	dilutionDate: "2024-12-31T20:00:00.000Z",
	showClients: false,
};

type TotalsResults = { general: { plants: number; modules: number } };

function formatAsNumber(x: any) {
	const result = isNaN(x) ? 0 : Number(x);
	return result;
}
function getCorrespondentDateInPreviousYear(date: string) {
	const previousYear = new Date(date).getFullYear() - 1;
	const month = new Date(date).getMonth();
	const day = new Date(date).getDate();
	return new Date(previousYear, month, day);
}

function getDayDiff(d1: string | Date, d2: string | Date) {
	const timeDiff = Math.abs(new Date(d2).getTime() - new Date(d1).getTime());
	const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
	return dayDiff;
}
function getBusinessDayDiff(d1: string | Date, d2: string | Date) {
	// @ts-ignore
	const diff = dayjs(d2).businessDiff(dayjs(d1));
	return Math.abs(diff) as number;
}
function getFilteredData(data: TProjectDTO[], dueDate: string) {
	if (!data) return [];
	return data.filter((p) => p.medidor.data && new Date(p.medidor.data) < getCorrespondentDateInPreviousYear(dueDate));
}

function RelatorioSetor() {
	const router = useRouter();
	const { data: session } = useSession({ required: true });
	const [showClientsNames, setShowClientsNames] = useState(false);
	const [scenarios, setScenarios] = useState({
		first: initialFirstScenario,
		second: initialSecondScenario,
	});

	// Getting data and instances of filtered date based on date filter params
	const { data, isFetching, isSuccess, filters, setFilters } = useOeMReportData();
	const firstScenarioData = getFilteredData(data || [], scenarios.first.dueDate);
	const secondScenarioData = getFilteredData(data || [], scenarios.second.dueDate);
	function getTotals(data: TProjectDTO[], dueDate: string, dilutionDate: string | null): TotalsResults {
		if (!data) return { general: { plants: 0, modules: 0 } };
		const modules = data.reduce((acc, current) => acc + formatAsNumber(current.sistema?.qtdeModulos), 0);
		const plants = data.length;

		return { general: { plants: plants, modules: modules } };
	}
	function getTotalsByCity(data: TProjectDTO[], dueDate: string, dilutionDate: string | null) {
		const totals = data.reduce((acc: { [key: string]: TotalsResults }, current) => {
			const modules = formatAsNumber(current.sistema?.qtdeModulos);
			const city = current.cidade;
			if (!acc[city]) acc[city] = { general: { plants: 0, modules: 0 } };
			acc[city].general.modules += modules;
			acc[city].general.plants += 1;
			return acc;
		}, {});
		return totals;
	}
	function renderStatsByCity(data: TProjectDTO[], dueDate: string, dilutionDate: string | null) {
		return Object.entries(getTotalsByCity(data, dueDate, dilutionDate)).map(([key, value], index) => (
			<div key={index} className="flex w-full items-center gap-2 border-b border-gray-300 py-1">
				<h1 className="w-1/3 text-center text-xs font-medium tracking-tight text-gray-500 lg:text-sm">{key}</h1>
				<div className="flex w-1/3 flex-col items-center">
					<h1 className="w-1/3 text-center text-xs font-medium tracking-tight text-gray-500 lg:text-sm">{formatDecimalPlaces(value.general.plants, 0, 0)}</h1>
				</div>
				<div className="flex w-1/3 flex-col items-center">
					<h1 className="w-1/3 text-center text-xs font-medium tracking-tight text-gray-500 lg:text-sm">{formatDecimalPlaces(value.general.modules, 0, 0)}</h1>
				</div>
			</div>
		));
	}
	function renderClients(data: TProjectDTO[]) {
		return data.map((project) => (
			<div className="flex w-full flex-col gap-1">
				<div className="flex w-full items-center justify-between gap-2">
					<h1 className="tracking-tightlg:text-sm text-xs font-black leading-none">{project.nomeDoContrato}</h1>
					<div className="flex min-w-fit items-center gap-1 rounded-full bg-gray-800 px-2 py-1 text-white">
						<h1 className="text-[0.65rem] font-medium lg:text-xs">{project.sistema.qtdeModulos}</h1>
						<FaSolarPanel size={15} />
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex items-center gap-1">
						<BsCalendar />
						<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">TROCA DO MEDIDOR EM: {formatDateAsLocale(project.medidor.data)}</p>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendarX color="#ed174c" />
						<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
							VENCIDO EM: {dayjs(project.medidor.data).add(1, "year").format("DD/MM/YYYY")}
						</p>
					</div>
				</div>
			</div>
		));
	}
	return (
		<div className="grow p-6">
			<div className="flex flex-col gap-1 border-b border-gray-300 p-1">
				<p className="text-2xl font-black uppercase text-[#15599a]">RELATÓRIO DE OPERAÇÃO E MANUTENÇÃO</p>
				<div className="flex w-full items-center justify-end">
					<MultipleSelectInputVirtualized
						label={"CIDADE"}
						selected={filters.city as string[]}
						selectedItemLabel="NÃO DEFINIDO"
						options={AllCities.map((city, index) => ({ id: index + 1, label: city, value: city }))}
						handleChange={(value) => {
							// @ts-ignore
							setFilters((prev) => ({ ...prev, city: value as string[] }));
						}}
						onReset={() => {
							setFilters((prev) => ({ ...prev, city: [] }));
						}}
					/>
				</div>
			</div>
			<div className="flex w-full grow flex-col p-3">
				{isFetching ? <LoadingPage /> : null}
				{isSuccess ? (
					<div className="flex w-full flex-col gap-4">
						{/* <div className="flex w-full items-center justify-center py-2">
            <button onClick={() => setShowClientsNames((prev) => !prev)} className={`jgap-2 flex items-center rounded p-1 font-medium`}>
              <p>MOSTRAR CLIENTES</p>
              {showClientsNames ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
            </div>
            <AnimatePresence>
            {showClientsNames ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="overscroll-y flex h-fit max-h-[400px] w-full flex-col self-center overflow-y-auto border border-gray-300 p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:w-[50%] gap-4"
              >
                {filteredDataByMaxDateParamSecondScenario.map((client, index) => (
                  <div key={index} className="flex w-full items-center justify-between gap-2 py-1 font-medium">
                    <div className="flex items-center gap-2">
                      <FaUserAlt style={{ color: '#15599a' }} />
                      <h1>{client.nomeDoContrato}</h1>
                    </div>
                    <h1>
                      VENCIDO EM <strong className="text-red-500">{dayjs(client.medidor.data).add(1, 'year').format('DD/MM/YYYY')}</strong>
                    </h1>
                  </div>
                ))}
              </motion.div>
            ) : null}
            </AnimatePresence> */}
						{/** FIRST SCENARIO*/}
						<div className="flex w-full flex-col gap-4">
							<div className="flex flex-col items-center  justify-center bg-[#15599a] p-2">
								<p className="text-3xl font-bold text-white">CENÁRIO PRIMÁRIO</p>
								<p className="text-center text-sm font-medium italic text-white">
									Considerando vencimento até: {formatDateAsLocale(scenarios.first.dueDate)}
									{scenarios.first.dilutionDate ? `, com diluição até ${formatDateAsLocale(scenarios.first.dilutionDate)}` : null}
								</p>
							</div>
							{/** FIRST SCENARIO FILTERS*/}
							<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
								<div className="w-full lg:w-1/3">
									<DateInput
										label="VENCIMENTO"
										value={formatDate(scenarios.first.dueDate)}
										handleChange={(value) => setScenarios((prev) => ({ ...prev, first: { ...prev.first, dueDate: formatDateInputChange(value) } }))}
										width="100%"
									/>
								</div>
								<div className="w-full lg:w-1/3">
									<DateInput
										label="PRAZO DE EXECUÇÃO"
										value={scenarios.first.dilutionDate ? formatDate(scenarios.first.dilutionDate) : undefined}
										handleChange={(value) => setScenarios((prev) => ({ ...prev, first: { ...prev.first, dilutionDate: formatDateInputChange(value) } }))}
										width="100%"
									/>
								</div>
								<div className="w-full lg:w-1/3">
									<div className={`flex w-full flex-col gap-1`}>
										<h1 className={"font-sans font-bold text-[#353432]"}>DIAS ÚTEIS ATÉ O FIM DO PRAZO</h1>
										<h1 className="h-[47px] w-full rounded-md border border-gray-300 p-3 text-sm outline-none placeholder:italic">
											{/** @ts-ignore */}
											{scenarios.first.dilutionDate ? getBusinessDayDiff(scenarios.first.dilutionDate, new Date()) : "N/A"}
											{/* {scenarios.first.dilutionDate ? dayjs(scenarios.first.dilutionDate).businessDiff(dayjs()) : 'N/A'} */}
										</h1>
									</div>
								</div>
							</div>
							<div className="flex w-full items-center justify-center py-2">
								<button
									onClick={() => setScenarios((prev) => ({ ...prev, first: { ...prev.first, showClients: !prev.first.showClients } }))}
									className={`jgap-2 flex items-center rounded p-1 font-medium`}
								>
									<p>MOSTRAR CLIENTES</p>
									{scenarios.first.showClients ? <AiFillEye /> : <AiFillEyeInvisible />}
								</button>
							</div>
							<AnimatePresence>
								{scenarios.first.showClients ? (
									<motion.div
										initial={{ scale: 0.8, opacity: 0.6 }}
										animate={{ scale: 1, opacity: 1 }}
										className="overscroll-y flex h-fit max-h-[400px] w-full flex-col gap-4 self-center overflow-y-auto border border-gray-300 p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:w-[50%]"
									>
										{renderClients(firstScenarioData)}
									</motion.div>
								) : null}
							</AnimatePresence>
							<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
								<div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
									<h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE USINAS A SEREM LIMPAS</h1>
									<div className="flex w-full items-center justify-center gap-2">
										<FaHome color="#fead41" size={"40px"} />
										<p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
											{getTotals(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate || null).general.plants}
											{/* {getOverallTotalQty(filteredDataByMaxDateParam).plants} */}
										</p>
									</div>
								</div>
								<div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
									<h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS A SEREM LIMPOS</h1>
									<div className="flex w-full items-center justify-center gap-2">
										<FaHome color="#fead41" size={"40px"} />
										<p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
											{getTotals(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate || null).general.modules}
											{/* {getOverallTotalQty(filteredDataByMaxDateParam).modules} */}
										</p>
									</div>
								</div>
								<div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
									<h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS POR DIA</h1>
									<div className="flex w-full items-center justify-center gap-2">
										<FaSolarPanel color="#fead41" size={"40px"} />
										<p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
											{formatDecimalPlaces(
												getTotals(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate || null).general.modules /
													getBusinessDayDiff(scenarios.first.dilutionDate, new Date()),
												0,
												0,
											)}
											{/* {(getOverallTotalQty(filteredDataByMaxDateParam).modules / businessDays.central).toFixed(0)} */}
										</p>
									</div>
								</div>
							</div>
							<div className="flex w-full flex-col rounded border border-gray-300 shadow-lg">
								<div className="flex w-full items-center gap-2 bg-[#15599a] p-2">
									<h1 className="w-1/3 text-center font-medium text-white">CIDADE</h1>
									<h1 className="w-1/3 text-center font-medium text-white">Nº DE USINAS</h1>
									<h1 className="w-1/3 text-center font-medium text-white">Nº DE MÓDULOS</h1>
								</div>
								{renderStatsByCity(firstScenarioData, scenarios.first.dueDate, scenarios.first.dilutionDate)}
							</div>
						</div>
						{/** SECOND SCENARIO*/}
						<div className="flex w-full flex-col gap-4">
							<div className="flex flex-col items-center  justify-center bg-[#fead41] p-2">
								<p className="text-3xl font-bold text-white">CENÁRIO SECUNDÁRIO</p>
								<p className="text-center text-sm font-medium italic text-white">
									Considerando vencimento até: {formatDateAsLocale(scenarios.second.dueDate)}
									{scenarios.second.dilutionDate ? `, com diluição até ${formatDateAsLocale(scenarios.second.dilutionDate)}` : null}
								</p>
							</div>
							{/** SECOND SCENARIO FILTERS*/}
							<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
								<div className="w-full lg:w-1/3">
									<DateInput
										label="VENCIMENTO"
										value={formatDate(scenarios.second.dueDate)}
										handleChange={(value) => setScenarios((prev) => ({ ...prev, second: { ...prev.second, dueDate: formatDateInputChange(value) } }))}
										width="100%"
									/>
								</div>
								<div className="w-full lg:w-1/3">
									<DateInput
										label="PRAZO DE EXECUÇÃO"
										value={scenarios.second.dilutionDate ? formatDate(scenarios.second.dilutionDate) : undefined}
										handleChange={(value) => setScenarios((prev) => ({ ...prev, second: { ...prev.second, dilutionDate: formatDateInputChange(value) } }))}
										width="100%"
									/>
								</div>
								<div className="w-full lg:w-1/3">
									<div className={`flex w-full flex-col gap-1`}>
										<h1 className={"font-sans font-bold text-[#353432]"}>DIAS ÚTEIS ATÉ O FIM DO PRAZO</h1>
										<h1 className="h-[47px] w-full rounded-md border border-gray-300 p-3 text-sm outline-none placeholder:italic">
											{/** @ts-ignore */}
											{scenarios.second.dilutionDate ? getBusinessDayDiff(scenarios.second.dilutionDate, new Date()) : "N/A"}
											{/* {scenarios.first.dilutionDate ? dayjs(scenarios.first.dilutionDate).businessDiff(dayjs()) : 'N/A'} */}
										</h1>
									</div>
								</div>
							</div>
							<div className="flex w-full items-center justify-center py-2">
								<button
									onClick={() => setScenarios((prev) => ({ ...prev, second: { ...prev.second, showClients: !prev.second.showClients } }))}
									className={`jgap-2 flex items-center rounded p-1 font-medium`}
								>
									<p>MOSTRAR CLIENTES</p>
									{scenarios.second.showClients ? <AiFillEye /> : <AiFillEyeInvisible />}
								</button>
							</div>
							<AnimatePresence>
								{scenarios.second.showClients ? (
									<motion.div
										initial={{ scale: 0.8, opacity: 0.6 }}
										animate={{ scale: 1, opacity: 1 }}
										className="overscroll-y flex h-fit max-h-[400px] w-full flex-col gap-4 self-center overflow-y-auto border border-gray-300 p-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 lg:w-[50%]"
									>
										{renderClients(secondScenarioData)}
									</motion.div>
								) : null}
							</AnimatePresence>
							<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
								<div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
									<h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE USINAS A SEREM LIMPAS</h1>
									<div className="flex w-full items-center justify-center gap-2">
										<FaHome color="#fead41" size={"40px"} />
										<p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
											{getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).general.plants}
											{/* {getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).plants} */}
										</p>
									</div>
								</div>
								<div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
									<h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS À SEREM LIMPOS</h1>
									<div className="flex w-full items-center justify-center gap-2">
										<FaSolarPanel color="#fead41" size={"40px"} />
										<p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
											{getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).general.modules}
											{/* {getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).plants} */}
										</p>
									</div>
								</div>
								<div className="flex w-full flex-col items-center rounded border border-gray-300 p-3 shadow-lg lg:w-1/3">
									<h1 className="text-center font-Poppins text-lg font-medium text-[#15599a]">Nº DE MÓDULOS POR DIA</h1>
									<div className="flex w-full items-center justify-center gap-2">
										<FaSolarPanel color="#fead41" size={"40px"} />
										<p className="text-center font-Poppins text-2xl font-black text-[#fead41]">
											{formatDecimalPlaces(
												getTotals(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate || null).general.modules /
													getBusinessDayDiff(scenarios.second.dilutionDate, new Date()),
												0,
												0,
											)}
											{/* {(getOverallTotalQty(filteredDataByMaxDateParamSecondScenario).modules / businessDays.dilution).toFixed(0)} */}
										</p>
									</div>
								</div>
							</div>
							<div className="flex w-full flex-col rounded border border-gray-300 shadow-lg">
								<div className="flex w-full items-center gap-2 bg-[#15599a] p-2">
									<h1 className="w-1/3 text-center font-medium text-white">CIDADE</h1>
									<h1 className="w-1/3 text-center font-medium text-white">Nº DE USINAS</h1>
									<h1 className="w-1/3 text-center font-medium text-white">Nº DE MÓDULOS</h1>
								</div>
								{renderStatsByCity(secondScenarioData, scenarios.second.dueDate, scenarios.second.dilutionDate)}
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}

export default RelatorioSetor;
