import { TProjectFinances } from "@/pages/api/stats/financial-auditing";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import Link from "next/link";
import React from "react";
import { BsCode } from "react-icons/bs";
import { FaSignature, FaTools } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import { TbActivity } from "react-icons/tb";

function getBarColor(margin: number) {
	if (margin >= 0.1) return "bg-green-500";
	if (margin > 0.05 && margin < 1) return "bg-orange-500";
	return "bg-red-500";
}
function getResult({ revenues, expenses, power }: { revenues: TProjectFinances["receitas"]; expenses: TProjectFinances["despesas"]; power: number }) {
	const totalExpenses = Object.values(expenses).reduce((acc, current) => acc + current, 0);
	const totalRevenues = Object.values(revenues).reduce((acc, current) => acc + current, 0);

	const salePowerMetric = totalRevenues / power;
	const supplyPowerMetric = (expenses["CUSTO DO KIT GERADOR"] || 0) / power;

	const margin = (totalRevenues - totalExpenses) / totalRevenues;
	return {
		margem: margin,
		liquido: totalRevenues - totalExpenses,
		valorWattVenda: salePowerMetric,
		valorWattCompra: supplyPowerMetric,
	};
}
type AuditingCardProps = {
	info: TProjectFinances;
	handleClick: (id: string) => void;
};
function AuditingCard({ info, handleClick }: AuditingCardProps) {
	const { liquido, margem, valorWattVenda, valorWattCompra } = getResult({ revenues: info.receitas, expenses: info.despesas, power: info.potencia });
	const revenues = Object.entries(info.receitas).filter(([key, value]) => value != 0);
	const totalRevenue = revenues.reduce((acc, [key, value]) => acc + value, 0);
	const expenses = Object.entries(info.despesas).filter(([key, value]) => value != 0);
	const totalExpenses = expenses.reduce((acc, [key, value]) => acc + value, 0);
	return (
		<div className="border-primary/20 flex w-full flex-col rounded-md border p-4 lg:w-[600px]">
			<div className="flex w-full items-center justify-between gap-2">
				<h1
					onClick={() => handleClick(info._id)}
					className="cursor-pointer text-xs leading-none font-black tracking-tight hover:text-cyan-500 lg:text-sm"
				>
					{info.nome}
				</h1>
				<div className="bg-primary/80 flex min-w-fit items-center gap-2 rounded-full px-2 py-1">
					<h1 className="text-[0.65rem] font-bold text-white lg:text-xs">MARGEM DE {formatDecimalPlaces(margem * 100)} %</h1>
				</div>
			</div>
			<div className="flex w-full items-center gap-2">
				<div className="flex items-center gap-2 text-cyan-500">
					<BsCode color={info.idProjetoCRM ? "rgb(6,182,212)" : "black"} />
					{info.idProjetoCRM ? (
						<a
							href={`https://crm.ampereenergias.com.br/comercial/oportunidades/id/${info.idProjetoCRM}`}
							className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight hover:text-cyan-500 lg:text-xs"
						>
							{info.identificador}
						</a>
					) : (
						<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{info.identificador}</p>
					)}
				</div>
				<div className="flex items-center gap-2">
					<ImPower />
					<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{info.potencia} kWp</p>
				</div>
				<div className="flex items-center gap-2">
					<ImPower />
					<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{info.potencia} kWp</p>
				</div>
			</div>
			<div className="mt-2 flex w-full items-center justify-center gap-2">
				<div className="flex items-center gap-2">
					<TbActivity />
					<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
						Vendido a {formatDecimalPlaces(valorWattVenda)} R$/kWp
					</p>
				</div>
				{valorWattCompra ? (
					<div className="flex items-center gap-2">
						<TbActivity />
						<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
							Compra a {formatDecimalPlaces(valorWattCompra)} R$/kWp
						</p>
					</div>
				) : null}
			</div>
			<div className="mt-3 flex w-full items-center justify-between gap-2">
				<h1 className="text-[0.6rem] leading-none font-black tracking-tight text-[#70e000]">RECEITAS</h1>
				<h1 className="text-[0.7rem] leading-none font-black tracking-tight text-[#70e000]">{formatToMoney(totalRevenue)}</h1>
			</div>

			<div className="mt-2 flex w-full flex-wrap items-center gap-2">
				{revenues.map(([key, value]) => (
					<div className="flex items-center gap-2 rounded-md bg-[#006400] px-2 py-1">
						<p className="text-[0.65rem] leading-none font-medium tracking-tight text-white">{key}</p>
						<p className="text-[0.65rem] font-black text-white">{formatToMoney(value)}</p>
					</div>
				))}
			</div>
			{/* <div className="mt-1 flex w-full flex-col gap-0.5"></div> */}
			<div className="mt-1 flex w-full items-center justify-between gap-2">
				<h1 className="text-[0.6rem] leading-none font-black tracking-tight text-[#ed174c]">DESPESAS</h1>
				<h1 className="text-[0.7rem] leading-none font-black tracking-tight text-[#ed174c]">{formatToMoney(totalExpenses)}</h1>
			</div>

			<div className="mt-2 flex w-full flex-wrap items-center gap-2">
				{expenses.length > 0 ? (
					expenses.map(([key, value]) => (
						<div className="flex items-center gap-2 rounded-md bg-[#ce1141] px-2 py-1">
							<p className="text-[0.65rem] leading-none font-medium tracking-tight text-white">{key}</p>
							<p className="text-[0.65rem] font-black text-white">{formatToMoney(value)}</p>
						</div>
					))
				) : (
					<p className="text-[0.65rem] font-black text-white">SEM DESPESAS VINCULADAS</p>
				)}
			</div>
			<div className="mt-2 flex w-full items-center justify-end gap-4">
				<div className="flex items-center gap-2">
					<FaSignature />
					<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
						ASSINADO EM: {formatDateAsLocale(info.dataAssinatura)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<FaTools />
					<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
						CONCLUIDO EM: {info.dataConclusaoObra ? formatDateAsLocale(info.dataConclusaoObra) : "NÃO DEFINIDO"}
					</p>
				</div>
			</div>
			{/* <div className="mt-1 flex w-full flex-col gap-0.5">
             {Object.entries(info.despesas).filter(([key, value]) => value != 0).length > 0 ? (
               Object.entries(info.despesas).map(([key, value]) => (
                 <div className="flex w-full items-center justify-between">
                   <p className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/80">{key}</p>
                   <p className="text-[0.65rem] font-bold text-[#ed174c]">{formatToMoney(value)}</p>
                 </div>
               ))
             ) : (
               <p className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/80">SEM DESPESAS ASSOCIADAS</p>
             )}
            </div> */}
		</div>
	);

	return (
		<div className="border-primary/20 flex w-full gap-2 rounded-md border shadow-xs lg:w-[550px]">
			<div className={`h-full w-[7px] ${getBarColor(margem)} rounded-tl-md rounded-bl-md`}></div>
			<div className="flex grow flex-col p-6">
				<div className="flex w-full items-center justify-between">
					<h1
						onClick={() => handleClick(info._id)}
						className="trackig-tight cursor-pointer leading-none font-bold duration-300 ease-in-out hover:text-cyan-500"
					>
						{info.nome}
					</h1>
					<div className="border-primary/60 rounded-md border px-2 py-1 text-xs font-medium">{formatToMoney(liquido)}</div>
				</div>
				<div className="flex w-full grow flex-col">
					<h1 className="mt-4 text-[0.65rem] leading-none font-medium tracking-tighter text-green-600">RECEITAS</h1>
					{Object.entries(info.receitas)
						.filter(([key, value]) => value != 0)
						.map(([key, value]) => (
							<div className="mt-1 flex w-full items-center justify-between">
								<p className="text-primary/80 text-xs leading-none font-medium tracking-tight">{key}</p>
								<p className="text-xs font-bold text-green-500">{formatToMoney(value)}</p>
							</div>
						))}
					<h1 className="text-primary/80 mt-4 text-[0.65rem] leading-none font-medium tracking-tighter">PREVISÃO</h1>
					<h1 className="mt-4 text-[0.65rem] leading-none font-medium tracking-tighter text-red-600">DESPESAS</h1>
					{Object.entries(info.despesas)
						.filter(([key, value]) => value != 0)
						.map(([key, value]) => (
							<div className="mt-1 flex w-full items-center justify-between">
								<p className="text-primary/80 text-xs leading-none font-medium tracking-tight">{key}</p>
								<p className="text-xs font-bold text-red-500">{formatToMoney(value)}</p>
							</div>
						))}
				</div>
				<div className="mt-2 flex w-full items-center justify-between">
					<div className="flex items-center gap-2">
						<FaTools />
						<h1 className="text-primary/60 text-xs">{formatDateAsLocale(info.dataConclusaoObra)}</h1>
						<FaSignature />
						<h1 className="text-primary/60 text-xs">{formatDateAsLocale(info.dataAssinatura)}</h1>
					</div>
					<h1 className="rounded-md text-xs font-medium text-cyan-500 underline underline-offset-2">MARGEM {formatDecimalPlaces(margem * 100, 2)}%</h1>
				</div>
			</div>
		</div>
	);
}

export default AuditingCard;
