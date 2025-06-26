import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import xml2js from "xml2js";
import * as XLSX from "xlsx";
import { BsCloudUploadFill } from "react-icons/bs";
import TextInput from "@/components/inputs/Text";
import DateMonthInput from "@/components/inputs/DateMonth";
import NumberInput from "@/components/inputs/Number";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { formatDecimalPlaces, formatLongString } from "@/utils/constants";
import { z } from "zod";
type TDistributionEntryHolder = {
	installationTitle: string;
	energyTariff: number;
	distributionFile: File | null;
};

type TDistributionInstallationRecord = {
	identificador: string;
	periodo: string;
	// Defines whether the installation is a receiver or a generator
	modalidade: "RECEBEDORA" | "GERADORA";
	// Defines the energy consumption of the installation for the given period
	consumoValor: number;
	// Defines the energy generation  injected into the grid from the installation for the given period
	injecaoValor: number;
	// Defines the energy generation of the installation for the given period
	geracaoValor: number;
	// Defines the energy compensation of the installation for the given period
	compensacaoValor: number;
	// Defines the quota of the energy received by the installation for the given period
	recebimentoQuota: number;
	// Defines the value of the energy received by the installation for the given period
	recebimentoValor: number;
	// Defines the total accumulated energy balance for the installation in the given period
	saldoAtual: number;
	// Defines the total accumulated energy balance for the installation in the previous period
	saldoAnterior: number;
	// Defines the energy transferred from the installation to other installations in the given period
	transferenciaValor: number;
	// Defines the energy tariff
	tarifaEnergia: number;
};

type TDistributionInstallationRecordGroupedByPeriod = {
	[key: string]: TDistributionInstallationRecord[];
};
const DistributionEntryXLSXSchema = z.object({
	Modalidade: z.string({
		required_error: "Modalidade não encontrada.",
		invalid_type_error: "Modalidade inválida.",
	}),
	Instalação: z.string({
		required_error: "Instalação não encontrada.",
		invalid_type_error: "Instalação inválida.",
	}),
	Período: z.string({
		required_error: "Período não encontrado.",
		invalid_type_error: "Período inválido.",
	}),
	Quota: z.string({
		required_error: "Quota não encontrada.",
		invalid_type_error: "Quota inválida.",
	}),
	"Posto Horário": z.string({
		required_error: "Posto Horário não encontrado.",
		invalid_type_error: "Posto Horário inválido.",
	}),
	"Saldo Anterior": z.string({
		required_error: "Saldo Anterior não encontrado.",
		invalid_type_error: "Saldo Anterior inválido.",
	}),
	"Saldo Expirado": z.string({
		required_error: "Saldo Expirado não encontrado.",
		invalid_type_error: "Saldo Expirado inválido.",
	}),
	Consumo: z.string({
		required_error: "Consumo não encontrado.",
		invalid_type_error: "Consumo inválido.",
	}),
	Geração: z.string({
		required_error: "Geração não encontrada.",
		invalid_type_error: "Geração inválida.",
	}),
	Compensação: z.string({
		required_error: "Compensação não encontrada.",
		invalid_type_error: "Compensação inválida.",
	}),
	Transferido: z.string({
		required_error: "Transferido não encontrado.",
		invalid_type_error: "Transferido inválido.",
	}),
	Recebimento: z.string({
		required_error: "Recebimento não encontrado.",
		invalid_type_error: "Recebimento inválido.",
	}),
	"Saldo Atual": z.string({
		required_error: "Saldo Atual não encontrado.",
		invalid_type_error: "Saldo Atual inválido.",
	}),
	"Quantidade Saldo a Expirar": z.string({
		required_error: "Quantidade Saldo a Expirar não encontrada.",
		invalid_type_error: "Quantidade Saldo a Expirar inválida.",
	}),
	"Período Saldo a Expirar": z.string({
		required_error: "Período Saldo a Expirar não encontrado.",
		invalid_type_error: "Período Saldo a Expirar inválido.",
	}),
});

function EnergyDistributionReport() {
	const [newDistributionEntryHolder, setNewDistributionEntryHolder] = useState<TDistributionEntryHolder>({
		installationTitle: "",
		distributionFile: null,
		energyTariff: 0,
	});
	const [installationRecords, setInstallationRecords] = useState<TDistributionInstallationRecordGroupedByPeriod>({});
	function updateNewDistributionEntryHolder(changes: Partial<TDistributionEntryHolder>) {
		setNewDistributionEntryHolder((prev) => ({
			...prev,
			...changes,
		}));
	}

	const [pdfMode, setPDFMode] = useState(false);

	async function handleExtractDataFromXLSXFile(file: File) {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsArrayBuffer(file);
			fileReader.onload = (e) => {
				try {
					const bufferArray = e.target?.result;
					if (!bufferArray) {
						reject(new Error("Falha ao ler o arquivo"));
						return;
					}
					const wb = XLSX.read(bufferArray, { type: "buffer" });
					const wsname = wb.SheetNames[0];
					const ws = wb.Sheets[wsname];
					const data = XLSX.utils.sheet_to_json(ws);

					resolve(data);
				} catch (error) {
					reject(error);
				}
			};
			fileReader.onerror = (err) => {
				reject(err);
			};
		});
	}

	async function handleDistributionNewEntry(info: TDistributionEntryHolder) {
		const file = info.distributionFile;
		if (!file) return toast.error("Arquivo não selecionado");

		const fileType = file.type;

		const isXLSX = fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		const isXML = fileType === "text/xml";

		if (isXLSX) {
			const data = await handleExtractDataFromXLSXFile(file);
			const installationRecords = z.array(DistributionEntryXLSXSchema).parse(data);
			console.log("INSTALLATION RECORDS", installationRecords);
			const groupedByPeriod = installationRecords.reduce((acc: TDistributionInstallationRecordGroupedByPeriod, curr) => {
				const period = curr.Período;
				// If the period is not in the accumulator, initialize it with an empty array
				if (!acc[period]) acc[period] = [];
				// Add the current record to the period
				acc[period].push({
					identificador: curr.Instalação,
					periodo: period,
					modalidade: curr.Modalidade === "Auto Consumo-Geradora" ? "GERADORA" : "RECEBEDORA",
					consumoValor: Number(curr.Consumo),
					injecaoValor: Number(curr.Geração),
					geracaoValor: 0,
					compensacaoValor: Number(curr.Compensação),
					recebimentoQuota: Number(curr.Quota.replace("%", "").replace(",", ".")),
					recebimentoValor: Number(curr.Recebimento),
					saldoAtual: Number(curr["Saldo Atual"]),
					saldoAnterior: Number(curr["Saldo Anterior"]),
					transferenciaValor: Number(curr.Transferido),
					tarifaEnergia: Number(info.energyTariff),
				});
				return acc;
			}, {});
			console.log("GROUPED BY PERIOD", groupedByPeriod);
			return setInstallationRecords(groupedByPeriod);
		}
		if (isXML) {
			// return handleXMLFile(file);
			return toast.error("Formato de arquivo não suportado !");
		}

		return toast.error("Formato de arquivo não suportado !");
	}

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a8d5e2", "#DB5375", "#B5BD89", "#729EA1", "##1D2C2E", "#023e8a", "#ff006e", "b5179e"];

	console.log("NEW DISTRIBUTION ENTRY HOLDER", newDistributionEntryHolder);

	return (
		<div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
			<div className="flex flex-col items-center gap-2">
				<h1 className="text-center text-xl text-[#15599a] font-bold">RELATÓRIO DE DISTRIBUIÇÃO</h1>
				<div className="w-full lg:w-[60%] bg-white dark:bg-[#121212] flex flex-col p-3 rounded-lg border border-primary/20">
					<h1 className="text-start text-md font-bold">NOVA ENTRADA</h1>
					{/**FILE INPUT */}
					<div className="w-full flex flex-col gap-3">
						<div className="relative flex h-full w-full flex-col items-center justify-center">
							<label
								htmlFor="dropzone-file"
								className="dark:hover:bg-bray-800 min-h-64 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-[#fff] hover:bg-primary/10 dark:bg-[#121212]"
							>
								<div className="flex flex-col items-center justify-center px-2 pb-6 pt-5 text-primary">
									<BsCloudUploadFill color={"rgb(31,41,55)"} size={50} />
									{!newDistributionEntryHolder.distributionFile ? (
										<p className="text-center text-xs lg:text-base">Clique para escolher um arquivo ou o arraste para a àrea demarcada</p>
									) : (
										<p className="text-center text-xs lg:text-base">{formatLongString(newDistributionEntryHolder.distributionFile.name)}</p>
									)}
								</div>
								<input
									onChange={(e) => {
										const files = e.target.files;
										console.log("FILES", files);
										const file = files ? files[0] : null;
										console.log("FILE", file);
										if (file) {
											console.log("Going in here...");
											return updateNewDistributionEntryHolder({
												distributionFile: file,
											});
										}
										return updateNewDistributionEntryHolder({
											distributionFile: null,
										});
									}}
									multiple={false}
									id="dropzone-file"
									type="file"
									className="absolute h-full w-full opacity-0"
									accept=".xlsx, .xml"
								/>
							</label>
						</div>
						<TextInput
							label="Nome da Instalação"
							placeholder="Preencha aqui o nome da instalação..."
							value={newDistributionEntryHolder.installationTitle}
							handleChange={(value) => updateNewDistributionEntryHolder({ installationTitle: value })}
							width="100%"
						/>
						<NumberInput
							label="Tarifa de Energia"
							placeholder="Preencha aqui a tarifa de energia..."
							value={newDistributionEntryHolder.energyTariff}
							handleChange={(value) => updateNewDistributionEntryHolder({ energyTariff: value })}
							width="100%"
						/>
						<div className="w-full flex items-center justify-end">
							<Button onClick={() => handleDistributionNewEntry(newDistributionEntryHolder)}>ADICIONAR INSTALAÇÃO</Button>
						</div>
					</div>
				</div>
				{/* <button onClick={() => setPDFMode(true)} className="p-2 text-xs rounded border-2 border-[#15599a] text-[#15599a] font-bold hover:border-0 hover:bg-[#15599a] hover:text-white">
						MODO PDF
					</button> */}
			</div>

			<div className="w-full flex flex-col gap-2">
				{Object.entries(installationRecords).map(([period, records]) => (
					<div key={period} className="flex flex-col w-full p-3 rounded-lg border border-primary/20 bg-[#fff] dark:bg-[#121212]">
						<h1 className="w-full text-start text-md font-bold">PERÍODO: {period}</h1>
						<div className="w-full flex flex-col gap-2 border border-[#15599a] rounded">
							<div className="flex items-center gap-2 bg-[#15599a] rounded">
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">INSTALAÇÃO</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">MODALIDADE</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">QUOTA DE RECEBIMENTO</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">INJETADO</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">CONSUMO</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">TRANSFERIDO</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">RECEBIDO</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">COMPENSADO</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">PREÇO DO kWh</p>
								<p className="text-xxs font-bold text-white text-center p-1 w-[10%]">VALOR DA FATURA</p>
							</div>
							{records.map((record, recordIndex) => (
								<div key={`${record.identificador}-${recordIndex}`} className="flex items-center gap-1 p-2">
									<div className="w-[10%] flex flex-col gap-1">
										<div className="w-full flex items-center gap-2">
											<div
												style={{
													backgroundColor: COLORS[recordIndex],
												}}
												className="w-4 h-4 min-w-4- min-h-4"
											/>
											<p className={"text-[0.45rem] md:text-sm font-bold"}>{record.identificador}</p>
										</div>
									</div>
									<div className="w-[10%] flex items-center justify-center">
										<p className="text-[0.45rem] md:text-sm font-bold text-center]">{record.modalidade}</p>
									</div>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">{record.recebimentoQuota ? `${formatDecimalPlaces(record.recebimentoQuota, 2)}%` : "-"}</p>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">{record.injecaoValor !== 0 ? `${formatDecimalPlaces(record.injecaoValor, 2)}kWh` : "-"}</p>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">{record.consumoValor !== 0 ? `${formatDecimalPlaces(record.consumoValor, 2)}kWh` : "-"}</p>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">
										{record.transferenciaValor !== 0 ? `${formatDecimalPlaces(record.transferenciaValor, 2)}kWh` : "-"}
									</p>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">{record.recebimentoValor !== 0 ? `${formatDecimalPlaces(record.recebimentoValor, 2)}kWh` : "-"}</p>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">{record.compensacaoValor !== 0 ? `${formatDecimalPlaces(record.compensacaoValor, 2)}kWh` : "-"}</p>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">{record.saldoAtual !== 0 ? `${formatDecimalPlaces(record.saldoAtual, 2)}kWh` : "-"}</p>
									<p className="text-[0.45rem] md:text-sm font-bold text-center w-[10%]">{record.tarifaEnergia !== 0 ? `${formatDecimalPlaces(record.tarifaEnergia, 2)}kWh` : "-"}</p>
									<div className="flex items-center w-[10%]">
										<p className="text-[0.45rem] md:text-sm font-bold text-center">R$</p>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
			{/* <div className="flex flex-col border border-gray-600 mt-2">
				{Object.keys(instalacoes).length > 0 && (
					<div className="grid grid-cols-2">
						<div className="grid grid-cols-2">
							<div className="bg-[#fead61] text-xxs lg:text-base flex items-center justify-center text-center font-bold border-r border-gray-600">VALOR TOTAL DAS FATURAS</div>
							<div className="flex items-center text-xxs lg:text-base justify-center text-center font-bold border-gray-600">
								R$ {getGeneralTotal(instalacoes).faturas.toFixed(2).replace(".", ",")}
							</div>
						</div>
						<div className="grid grid-cols-2">
							<div className="bg-[#15599a] flex items-center text-xxs lg:text-base justify-center text-center text-white font-bold border-r border-gray-600">VALOR TOTAL ECONOMIZADO</div>
							<div className="flex items-center text-xxs lg:text-base justify-center text-center font-bold border-gray-600">
								R$ {getGeneralTotal(instalacoes).economizado.toFixed(2).replace(".", ",")}
							</div>
						</div>
					</div>
				)}

				{Object.keys(instalacoes).length > 0
					? Object.keys(instalacoes).map((key, index) => (
							<div key={index} className="flex flex-col">
								<h1 className="text-center font-bold bg-black  text-white text-sm p-1">{key}</h1>
								<div className="grid grid-cols-6 lg:grid-cols-12 border-b border-gray-200">
									<p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">PERÍODO</p>
									<p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">INSTALAÇÃO</p>
									<p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">MODALIDADE</p>
									<p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">QUOTA</p>
									<p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">GERAÇÃO</p>
									<p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">CONSUMO</p>
									<p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">TRANSFERIDO</p>
									<p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">RECEBIDO</p>
									<p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">COMPENSADO</p>
									<p className="text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">SALDO ATUAL</p>
									<p className="hidden lg:block text-xxs font-bold text-white bg-[#15599a] border-r border-white text-center p-1">PREÇO DO kWh</p>
									<p className="text-xxs font-bold text-white bg-[#15599a] text-center p-1">VALOR DA FATURA</p>
								</div>
								{instalacoes[key].map((item, index2) => (
									<div key={index2} className="grid grid-cols-6 lg:grid-cols-12 gap-1 border-b border-gray-200">
										<p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">{formatPeriodo(item.periodo)}</p>
										<p
											style={{
												color: COLORS[index2],
											}}
											className={`text-xxs font-bold text-center border-r border-gray-200 p-1`}
										>
											{item.instalacao}
										</p>
										<p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.modalidade == "Auto consumo-Geradora" ? "GERADORA" : "RECEBEDORA"}
										</p>
										<p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.quota ? `${item.quota.substr(0, item.quota.length - 4)}%` : "-"}
										</p>
										<p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.geracao != "0.0" ? Number(item.geracao).toFixed(2).replace(".", ",") : "-"}
										</p>
										<p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.consumo != "0.0" ? Number(item.consumo).toFixed(2).replace(".", ",") : "-"}
										</p>
										<p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.transferido != "0.0" ? Number(item.transferido).toFixed(2).replace(".", ",") : "-"}
										</p>
										<p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.recebimento != "0.0" ? Number(item.recebimento).toFixed(2).replace(".", ",") : "-"}
										</p>
										<p className="hidden lg:block text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.compensacao != "0.0" ? Number(item.compensacao).toFixed(2).replace(".", ",") : "-"}
										</p>
										<p className="text-xxs font-bold text-gray-600 text-center border-r border-gray-200 p-1">
											{item.saldoAtual ? Number(item.saldoAtual).toFixed(2).replace(".", ",") : "-"}
										</p>
										<div className="hidden lg:flex items-center border-r border-gray-200">
											<input
												type={"number"}
												placeholder="-"
												value={instalacoes[key][index2].valorkWh}
												onChange={(e) => {
													var obj = instalacoes;
													obj[key][index2].valorkWh = Number(e.target.value);
													setInstalacoes({ ...obj });
												}}
												className="text-xxs font-bold text-gray-600 text-center p-1 outline-none h-full w-full bg-transparent"
											/>
											<p className="text-xxs font-bold text-gray-600 text-center mr-2">R$/kWh</p>
										</div>
										<div className="flex items-center">
											<p className="text-xxs font-bold text-gray-600 text-center">R$</p>
											<input
												type={"number"}
												placeholder="-"
												value={instalacoes[key][index2].valorFatura}
												onChange={(e) => {
													var obj = instalacoes;
													obj[key][index2].valorFatura = Number(e.target.value);
													setInstalacoes({ ...obj });
												}}
												className="text-xxs font-bold text-gray-600 text-center p-1 outline-none h-full w-full bg-transparent"
											/>
										</div>
									</div>
								))}
								<div className="grid grid-rows-2 grid-cols-1 xs:grid-rows-1 xs:grid-cols-2 px-2 my-2">
									<div className="col-span-1 flex flex-col justify-center items-center">
										<h1 className="text-xss lg:text-xs text-center font-bold">ENERGIA COMPENSADA POR INSTALAÇÃO</h1>
										<div className="w-[250px] h-[250px] lg:w-[250px] lg:h-[250px] self-center">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart width="100%" height="80%">
													<Pie data={getGraficoData(instalacoes[key])} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={100} fill="#8884d8" dataKey="value">
														{getGraficoData(instalacoes[key]).map((entry, index) => (
															<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
														))}
													</Pie>
												</PieChart>
											</ResponsiveContainer>
										</div>
									</div>
									<div className="col-span-1 flex flex-col gap-2 justify-center">
										{key.split("-").length > 1 && (
											<div className="border border-[#15599a] p-2 rounded-md">
												<h1 className="text-center font-bold text-xxs lg:text-xs">CONSUMO INSTANTÂNEO</h1>
												<p className="text-center font-bold text-xxs lg:text-base text-[#fead61]">{getConsumoInstantaneo(key.split("-")[1], instalacoes[key])} kWh</p>
											</div>
										)}
										<div className="border border-[#15599a] p-2 rounded-md">
											<h1 className="text-center font-bold text-xxs lg:text-xs">VALOR TOTAL DE FATURAS</h1>
											<p className="text-center font-bold text-xxs lg:text-base text-orange-500">R$ {sumValorFatura(instalacoes[key]).toFixed(2).replace(".", ",")}</p>
										</div>
										<div className="border border-[#15599a] p-2 rounded-md">
											<h1 className="text-center font-bold text-xxs lg:text-xs">ENERGIA TOTAL COMPENSADA</h1>
											<p className="text-center font-bold text-xxs lg:text-base text-[#15599a]">{sumEnergiaCompensada(instalacoes[key]).sumCompensada} kWh</p>
										</div>
										<div className="border border-[#15599a] p-2 rounded-md">
											<h1 className="text-center font-bold text-xxs lg:text-xs">VALOR APROXIMADO ECONOMIZADO</h1>
											<p className="text-center font-bold text-xxs lg:text-base text-green-500">R$ {sumEnergiaCompensada(instalacoes[key]).sumEconomizado.toFixed(2).replace(".", ",")}</p>
										</div>
									</div>
								</div>
							</div>
						))
					: false}
			</div> */}

			{/**<h1 classNameName="text-center text-[#15599a] font-bold">ENTREGUES</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            DESDE ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {entregues.map((obj) => (
            <div classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 text-center font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.compra.statusEntrega == "ENTREGUE"
                  ? obj.compra.dataEntrega
                    ? `${dayjs(new Date()).diff(
                        obj.compra.dataEntrega,
                        "days"
                      )} dias`
                    : `${dayjs(new Date()).diff(
                        obj.compra.previsaoEntrega,
                        "days"
                      )} dias`
                  : "-"}
              </div>
            </div>
          ))}
        </div> */}
			{/* <h1 classNameName="text-center text-[#15599a] font-bold">EM ROTA</h1>
        <div classNameName="grid grid-cols-6">
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO PROJETO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            NOME DO CONTRATO
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            QTDE MÓDULOS
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            TOPOLOGIA
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            CIDADE
          </div>
          <div classNameName=" flex items-center justify-center text-center text-xxs p-2 bg-[#15599a] text-white font-bold">
            ATÉ ENTREGA
          </div>
        </div>
        <div classNameName="flex flex-col bg-[#fff]">
          {emRota.map((obj, index) => (
            <div key={index} classNameName="grid grid-cols-6 h-[36px]">
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoProjeto}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.nomeDoContrato}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.qtdeModulos}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.sistema.topologia}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {obj.cidade}
              </div>
              <div classNameName="text-center flex items-center justify-center text-xxs p-1 text-gray-600 font-bold border-b border-gray-200">
                {dayjs(obj.compra.previsaoEntrega).diff(new Date(), "day")} dias
              </div>
            </div>
          ))}
        </div> */}
		</div>
	);
}

export default EnergyDistributionReport;
