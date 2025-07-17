"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Upload, Zap, TrendingDown, Battery, ArrowUpDown, Plus, FileSpreadsheet, Calendar, Edit } from "lucide-react";
import { z } from "zod";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
	// Defines the value of the energy bill received by the installation for the given period
	valorFatura: number;
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
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function EnergyDistributionDashboard() {
	const [installationRecords, setInstallationRecords] = useState<TDistributionInstallationRecordGroupedByPeriod>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newEntry, setNewEntry] = useState<TDistributionEntryHolder>({
		installationTitle: "",
		energyTariff: 0,
		distributionFile: null,
	});

	const [selectedPeriod, setSelectedPeriod] = useState<string>("");
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editingRecord, setEditingRecord] = useState<{
		period: string;
		index: number;
		record: TDistributionInstallationRecord;
	} | null>(null);
	const [editingValues, setEditingValues] = useState<{
		geracaoValor: number;
		valorFatura: number;
	}>({
		geracaoValor: 0,
		valorFatura: 0,
	});

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
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setNewEntry((prev) => ({ ...prev, distributionFile: file }));
		}
	};

	const handleSubmit = async () => {
		// Handle form submission logic here
		console.log("Submitting:", newEntry);
		const file = newEntry.distributionFile;
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
				const consumptionValue = Number(curr.Consumo);
				const compensatedEnergyValue = Number(curr.Compensação);
				const receivedEnergyValue = Number(curr.Recebimento);

				const ENERGY_INFRA_VALUE = 50;
				const PUBLIC_ILUMINATION_VALUE = 30;
				const energyBillValue = (consumptionValue - compensatedEnergyValue) * newEntry.energyTariff + PUBLIC_ILUMINATION_VALUE + ENERGY_INFRA_VALUE;
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
					tarifaEnergia: Number(newEntry.energyTariff),
					valorFatura: energyBillValue,
				});
				return acc;
			}, {});
			console.log("GROUPED BY PERIOD", groupedByPeriod);
			setIsModalOpen(false);
			// Reset form
			setNewEntry({
				installationTitle: "",
				energyTariff: 0,
				distributionFile: null,
			});
			return setInstallationRecords(groupedByPeriod);
		}
		if (isXML) {
			// return handleXMLFile(file);
			return toast.error("Formato de arquivo não suportado !");
		}

		return toast.error("Formato de arquivo não suportado !");
	};

	const getPeriodStats = (records: TDistributionInstallationRecord[] | undefined) => {
		let totalGeneration = 0;
		let totalInjection = 0;
		let totalConsumptionFromGrid = 0;
		let totalConsumptionFromSelfGeneration = 0;
		let totalCompensation = 0;
		let totalReceived = 0;
		let totalTransferred = 0;
		let totalEnergyBillPaid = 0;
		let totalEnergyBillSaved = 0;
		if (!records)
			return {
				totalGeneration,
				totalInjection,
				totalConsumptionFromGrid,
				totalConsumptionFromSelfGeneration,
				totalCompensation,
				totalReceived,
				totalTransferred,
				totalEnergyBillPaid,
				totalEnergyBillSaved,
			};
		for (const record of records) {
			totalGeneration += record.geracaoValor;
			totalInjection += record.injecaoValor;
			totalConsumptionFromGrid += record.consumoValor;
			totalConsumptionFromSelfGeneration += record.geracaoValor - record.injecaoValor;
			totalCompensation += record.compensacaoValor;
			totalReceived += record.recebimentoValor;
			totalTransferred += record.transferenciaValor;
			totalEnergyBillPaid += record.valorFatura;
			totalEnergyBillSaved += record.compensacaoValor * record.tarifaEnergia;
		}

		return {
			totalGeneration,
			totalInjection,
			totalConsumptionFromGrid,
			totalConsumptionFromSelfGeneration,
			totalCompensation,
			totalReceived,
			totalTransferred,
			totalEnergyBillPaid,
			totalEnergyBillSaved,
		};
	};

	const getChartData = (records: TDistributionInstallationRecord[]) => {
		return records.map((record: TDistributionInstallationRecord, index: number) => ({
			name: record.identificador,
			generation: record.geracaoValor, // Use geracaoValor instead of injecaoValor
			injection: record.injecaoValor, // Keep injection separate
			consumption: record.consumoValor,
			compensation: record.compensacaoValor,
			received: record.recebimentoValor,
			color: COLORS[index % COLORS.length],
		}));
	};

	const getPieData = (records: TDistributionInstallationRecord[]) => {
		return records.map((record: TDistributionInstallationRecord, index: number) => ({
			name: record.identificador,
			value: record.compensacaoValor || record.recebimentoValor,
			color: COLORS[index % COLORS.length],
		}));
		// .filter((item) => item.value > 0);
	};
	const handleEditGeneration = (period: string, index: number, record: TDistributionInstallationRecord) => {
		setEditingRecord({ period, index, record });
		setEditingValues({
			geracaoValor: record.geracaoValor,
			valorFatura: record.valorFatura,
		});
		setEditModalOpen(true);
	};
	const handleSaveGeneration = () => {
		if (!editingRecord) return;

		const updatedRecords = { ...installationRecords };
		updatedRecords[editingRecord.period][editingRecord.index].geracaoValor = editingValues.geracaoValor;
		updatedRecords[editingRecord.period][editingRecord.index].valorFatura = editingValues.valorFatura;
		setInstallationRecords(updatedRecords);
		setEditModalOpen(false);
		setEditingRecord(null);
		toast.success("Valor de geração atualizado!");
	};
	const periodStats = getPeriodStats(installationRecords[selectedPeriod]);
	return (
		<div className="min-h-screen bg-black p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
					<div className="space-y-2">
						<h1 className="text-5xl font-bold text-white tracking-tight">Relatório de Distribuição</h1>
						<p className="text-gray-400 text-lg">Análise de energia e distribuição por instalação</p>
					</div>

					<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
						<DialogTrigger asChild>
							<Button size="lg" className="bg-white text-black hover:bg-gray-100 border-2 border-white font-semibold px-8 py-3">
								<Plus className="w-5 h-5 mr-2" />
								Nova Análise
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md bg-white">
							<DialogHeader>
								<DialogTitle className="text-black">Nova Entrada</DialogTitle>
								<DialogDescription className="text-gray-600">Adicione uma nova análise de distribuição de energia</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="installation" className="text-black">
										Nome da Instalação
									</Label>
									<Input
										id="installation"
										placeholder="Digite o nome da instalação..."
										value={newEntry.installationTitle}
										onChange={(e) => setNewEntry((prev) => ({ ...prev, installationTitle: e.target.value }))}
										className="border-gray-300"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="tariff" className="text-black">
										Tarifa de Energia (R$/kWh)
									</Label>
									<Input
										id="tariff"
										type="number"
										step="0.01"
										placeholder="0.90"
										value={newEntry.energyTariff || ""}
										onChange={(e) => setNewEntry((prev) => ({ ...prev, energyTariff: Number.parseFloat(e.target.value) || 0 }))}
										className="border-gray-300"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="file" className="text-black">
										Arquivo de Distribuição
									</Label>
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
										<Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
										<div className="text-sm text-gray-600">
											{newEntry.distributionFile ? (
												<span className="font-medium">{newEntry.distributionFile.name}</span>
											) : (
												<>
													<span className="font-medium">Clique para enviar</span> ou arraste o arquivo
												</>
											)}
										</div>
										<input id="file" type="file" className="hidden" accept=".xlsx,.xml" onChange={handleFileUpload} />
										<Button type="button" variant="outline" size="sm" className="mt-2 border-gray-300 text-black" onClick={() => document.getElementById("file")?.click()}>
											Selecionar Arquivo
										</Button>
									</div>
								</div>

								<Button onClick={handleSubmit} className="w-full bg-black text-white hover:bg-gray-800">
									<FileSpreadsheet className="w-4 h-4 mr-2" />
									Adicionar Instalação
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{/* Period Selection */}
				{Object.keys(installationRecords).length > 0 && (
					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<Label className="text-white font-semibold">Selecionar Período:</Label>
							<Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
								<SelectTrigger className="w-48 bg-white text-black">
									<SelectValue placeholder="Escolha um período" />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(installationRecords).map((period) => (
										<SelectItem key={period} value={period}>
											{period}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{selectedPeriod && installationRecords[selectedPeriod] && (
							<div className="space-y-8">
								{/* Period Stats Overview */}
								<h1 className="text-2xl font-semibold text-white">Análise de Geração</h1>
								<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/3">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Geração Total</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces(periodStats.totalGeneration, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">kWh gerados no período</p>
										</CardContent>
									</Card>
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/3">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Injeção Total</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces(periodStats.totalInjection, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">kWh injetados no período</p>
										</CardContent>
									</Card>
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/3">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Total Transferido</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces(periodStats.totalTransferred, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">kWh transferidos no período</p>
										</CardContent>
									</Card>
								</div>
								<h1 className="text-2xl font-semibold text-white">Análise do Consumo</h1>
								<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/3">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Consumo Total</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces(periodStats.totalConsumptionFromGrid + periodStats.totalConsumptionFromSelfGeneration, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">kWh consumidos no período</p>
										</CardContent>
									</Card>
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/3">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Consumo Instantâneo</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces(periodStats.totalConsumptionFromSelfGeneration, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">kWh consumidos pela geração no período</p>
										</CardContent>
									</Card>
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/3">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Taxa de Simultaneidade</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces((periodStats.totalConsumptionFromSelfGeneration * 100) / periodStats.totalGeneration, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">%</p>
										</CardContent>
									</Card>
								</div>
								<h1 className="text-2xl font-semibold text-white">Análise do Econômica</h1>
								<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/2">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Total pago</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces(periodStats.totalEnergyBillPaid, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">R$</p>
										</CardContent>
									</Card>
									<Card className="bg-white border-gray-300 shadow-xl w-full lg:w-1/2">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-semibold text-gray-700">Total economizado</CardTitle>
											<Zap className="h-5 w-5 text-black" />
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold text-black">{formatDecimalPlaces(periodStats.totalEnergyBillSaved, 2)}</div>
											<p className="text-xs text-gray-500 mt-1">R$</p>
										</CardContent>
									</Card>
								</div>
								{/* Charts Row */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
									<Card className="bg-white border-gray-300 shadow-xl">
										<CardHeader className="border-b border-gray-100">
											<CardTitle className="text-black">Distribuição de Energia</CardTitle>
											<CardDescription className="text-gray-600">Compensação por instalação</CardDescription>
										</CardHeader>
										<CardContent className="pt-6">
											<div className="h-80">
												<ResponsiveContainer width="100%" height="100%">
													<PieChart>
														<Pie
															data={getPieData(installationRecords[selectedPeriod])}
															cx="50%"
															cy="50%"
															outerRadius={100}
															dataKey="value"
															label={({ name, value }) => `${name}: ${formatDecimalPlaces(value, 2)}kWh`}
															labelLine={false}
														>
															{getPieData(installationRecords[selectedPeriod]).map((entry, index) => (
																<Cell key={`cell-${entry.name}`} fill={entry.color} />
															))}
														</Pie>
														<Tooltip
															contentStyle={{
																backgroundColor: "white",
																border: "1px solid #e5e7eb",
																borderRadius: "8px",
																color: "black",
															}}
														/>
													</PieChart>
												</ResponsiveContainer>
											</div>
										</CardContent>
									</Card>

									<Card className="bg-white border-gray-300 shadow-xl">
										<CardHeader className="border-b border-gray-100">
											<CardTitle className="text-black">Comparativo de Energia</CardTitle>
											<CardDescription className="text-gray-600">Geração vs Consumo vs Compensação</CardDescription>
										</CardHeader>
										<CardContent className="pt-6">
											<div className="h-80">
												<ResponsiveContainer width="100%" height="100%">
													<BarChart data={getChartData(installationRecords[selectedPeriod])}>
														<CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
														<XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 12 }} />
														<YAxis tick={{ fill: "#374151", fontSize: 12 }} />
														<Tooltip
															contentStyle={{
																backgroundColor: "white",
																border: "1px solid #e5e7eb",
																borderRadius: "8px",
																color: "black",
															}}
														/>
														<Legend />
														<Bar dataKey="generation" fill="#0088FE" name="Geração" radius={[2, 2, 0, 0]} />
														<Bar dataKey="consumption" fill="#FF8042" name="Consumo" radius={[2, 2, 0, 0]} />
														<Bar dataKey="compensation" fill="#00C49F" name="Compensação" radius={[2, 2, 0, 0]} />
													</BarChart>
												</ResponsiveContainer>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Installation Cards */}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{installationRecords[selectedPeriod].map((record, index) => (
										<Card key={`${record.identificador}-${index}`} className="bg-white border-gray-300 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
											<div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
											<CardHeader className="pb-4 pl-6">
												<div className="flex items-center justify-between">
													<CardTitle className="text-xl font-bold text-black">{record.identificador}</CardTitle>
													<div className="flex items-center gap-2">
														<Button size="fit" variant="ghost" onClick={() => handleEditGeneration(selectedPeriod, index, record)} className="p-2">
															<Edit className="w-3 h-3" />
														</Button>
														<Badge
															variant={record.modalidade === "GERADORA" ? "default" : "secondary"}
															className={record.modalidade === "GERADORA" ? "bg-black text-white" : "bg-gray-200 text-black"}
														>
															{record.modalidade}
														</Badge>
													</div>
												</div>
												<CardDescription className="text-gray-600 font-medium">Quota: {record.recebimentoQuota ? `${record.recebimentoQuota}%` : "N/A"}</CardDescription>
											</CardHeader>
											<CardContent className="space-y-4 pl-6">
												<div className="flex justify-between items-center py-2 border-b border-gray-100">
													<span className="text-sm font-medium text-gray-700">Geração:</span>
													<span className="font-bold text-black text-lg">{record.geracaoValor ? `${formatDecimalPlaces(record.geracaoValor, 2)} kWh` : "N/A"}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-gray-100">
													<span className="text-sm font-medium text-gray-700">Injetado:</span>
													<span className="font-bold text-black text-lg">{record.injecaoValor ? `${formatDecimalPlaces(record.injecaoValor, 2)} kWh` : "N/A"}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-gray-100">
													<span className="text-sm font-medium text-gray-700">Consumo:</span>
													<span className="font-bold text-black text-lg">{record.consumoValor ? `${formatDecimalPlaces(record.consumoValor, 2)} kWh` : "N/A"}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-gray-100">
													<span className="text-sm font-medium text-gray-700">Compensado:</span>
													<span className="font-bold text-black text-lg">{record.compensacaoValor ? `${formatDecimalPlaces(record.compensacaoValor, 2)} kWh` : "N/A"}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-gray-100">
													<span className="text-sm font-medium text-gray-700">Recebido:</span>
													<span className="font-bold text-black text-lg">{record.recebimentoValor ? `${formatDecimalPlaces(record.recebimentoValor, 2)} kWh` : "N/A"}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-gray-100">
													<span className="text-sm font-medium text-gray-700">Transferido:</span>
													<span className="font-bold text-black text-lg">{record.transferenciaValor ? `${formatDecimalPlaces(record.transferenciaValor, 2)} kWh` : "N/A"}</span>
												</div>
												<div className="pt-3 border-t border-gray-300">
													<div className="flex justify-between items-center">
														<span className="text-sm font-medium text-gray-700">Tarifa:</span>
														<span className="font-bold text-black text-lg">{record.tarifaEnergia ? `${formatToMoney(record.tarifaEnergia)}/kWh` : "N/A"}</span>
													</div>
												</div>
												<div className="pt-3 border-t border-gray-300">
													<div className="flex justify-between items-center">
														<span className="text-sm font-medium text-gray-700">Valor da Fatura:</span>
														<span className="font-bold text-black text-lg">{record.valorFatura ? `${formatToMoney(record.valorFatura)}` : "N/A"}</span>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}
					</div>
				)}
				{/* Edit Generation Modal */}
				<Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
					<DialogContent className="sm:max-w-md bg-white">
						<DialogHeader>
							<DialogTitle className="text-black">Editar Geração</DialogTitle>
							<DialogDescription className="text-gray-600">Defina o valor de geração para {editingRecord?.record.identificador}</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="generation" className="text-black">
									Geração (kWh)
								</Label>
								<Input
									id="generation"
									type="number"
									step="0.01"
									placeholder="0.00"
									value={editingValues.geracaoValor || ""}
									onChange={(e) => setEditingValues((prev) => ({ ...prev, geracaoValor: Number.parseFloat(e.target.value) || 0 }))}
									className="border-gray-300"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="generation" className="text-black">
									Valor da Fatura
								</Label>
								<Input
									id="generation"
									type="number"
									step="0.01"
									placeholder="0.00"
									value={editingValues.valorFatura || ""}
									onChange={(e) => setEditingValues((prev) => ({ ...prev, valorFatura: Number.parseFloat(e.target.value) || 0 }))}
									className="border-gray-300"
								/>
							</div>
							<div className="flex gap-2">
								<Button onClick={() => setEditModalOpen(false)} variant="outline" className="flex-1 border-gray-300 text-black">
									Cancelar
								</Button>
								<Button onClick={handleSaveGeneration} className="flex-1 bg-black text-white hover:bg-gray-800">
									Salvar
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
