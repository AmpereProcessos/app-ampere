import { cn } from "@/lib/utils";
import type { TServiceOrderStatsOutput } from "@/pages/api/ordensDeServico/stats";
import { SlideMotionVariants } from "@/utils/constants";
import { useServiceOrdersStats } from "@/utils/methods/query/service-orders";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Check, ChevronDown, ChevronUp, CircleDot, Contact } from "lucide-react";
import type { Session } from "next-auth";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";

type ExecutionPageStatsProps = {
	session: Session;
};
export default function ExecutionPageStats({ session }: ExecutionPageStatsProps) {
	const { data: serviceOrdersStats, isLoading, isError, isSuccess } = useServiceOrdersStats();
	return (
		// <div className="w-full flex flex-col gap-2 p-3 border border-primary/20 shadow-sm rounded-md">
		<div className="w-full flex flex-col lg:flex-row gap-4">
			<div className="flex w-full flex-col items-center justify-between gap-2 rounded border border-primary/50 bg-[#fff] p-3 shadow-sm dark:bg-[#121212] lg:w-1/3 lg:flex-row">
				<div className="flex items-center justify-start gap-2">
					<FaPlay />
					<h1 className="text-xs font-medium leading-none tracking-tight">SERVIÇOS INICIADOS</h1>
				</div>
				<h1 className="font-black leading-none">{serviceOrdersStats?.iniciadas || 0}</h1>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 rounded border border-primary/50 bg-[#fff] p-3 shadow-sm dark:bg-[#121212] lg:w-1/3 lg:flex-row">
				<div className="flex items-center justify-start gap-2">
					<div className={"flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border border-primary bg-blue-500 text-white"}>
						<CircleDot size={12} />
					</div>
					<h1 className="text-xs font-medium leading-none tracking-tight">SERVIÇOS EM ANDAMENTO</h1>
				</div>
				<h1 className="font-black leading-none">{serviceOrdersStats?.emAndamento || 0}</h1>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 rounded border border-primary/50 bg-[#fff] p-3 shadow-sm dark:bg-[#121212] lg:w-[400px] lg:flex-row">
				<div className="flex items-center justify-start gap-2">
					<div className={"flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border border-primary bg-green-500 text-white"}>
						<Check size={12} />
					</div>
					<h1 className="text-xs font-medium leading-none tracking-tight">SERVIÇOS EXECUTADOS</h1>
				</div>
				<h1 className="font-black leading-none">{serviceOrdersStats?.concluidas || 0}</h1>
			</div>
		</div>

		// </div>
	);
}

// type ResultsByCityProps = {
// 	serviceOrderStatsByCity: TServiceOrderStatsOutput["data"]["porCidade"];
// };
// function ResultsByCity({ serviceOrderStatsByCity }: ResultsByCityProps) {
// 	const [showData, setShowData] = useState<boolean>(false);
// 	return (
// 		<div className="w-full flex flex-col gap-2">
// 			<div className="w-full flex items-center gap-2">
// 				<div className="flex items-center gap-1">
// 					<Building2 className="w-3 h-3 min-w-3 min-h-3" />
// 					<h1 className="text-xs font-light leading-none tracking-tight">POR CIDADE</h1>
// 				</div>
// 				<button
// 					type="button"
// 					onClick={() => setShowData((prev) => !prev)}
// 					className={cn("flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-primary duration-300 ease-in-out hover:bg-primary/20", {
// 						"bg-primary/30": showData,
// 					})}
// 				>
// 					{!showData ? <ChevronDown width={14} height={14} /> : <ChevronUp width={14} height={14} />}
// 				</button>
// 			</div>
// 			<AnimatePresence>
// 				{showData ? (
// 					<motion.div
// 						key={"service-orders-stats-by-city"}
// 						variants={SlideMotionVariants}
// 						initial="initial"
// 						animate="animate"
// 						exit="exit"
// 						className="w-full flex items-center flex-wrap gap-1"
// 					>
// 						{serviceOrderStatsByCity.map((resultByCity) => (
// 							<div key={resultByCity.nome} className="flex items-center gap-2 px-2 py-1 rounded-lg border border-primary/30 bg-secondary">
// 								<h1 className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/60">{resultByCity.nome}</h1>
// 								<div className="flex items-center gap-2">
// 									<div className="flex items-center gap-1">
// 										<CircleDot className="w-3 h-3 min-w-3 min-h-3" />
// 										<h1 className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/60">{resultByCity.emAndamento}</h1>
// 									</div>
// 									<div className="flex items-center gap-1">
// 										<Check className="w-3 h-3 min-w-3 min-h-3" />
// 										<h1 className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/60">{resultByCity.concluidas}</h1>
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 					</motion.div>
// 				) : null}
// 			</AnimatePresence>
// 		</div>
// 	);
// }

// type ResultsByResponsibleProps = {
// 	serviceOrderStatsByResponsible: TServiceOrderStatsOutput["data"]["porResponsavel"];
// };
// function ResultsByResponsible({ serviceOrderStatsByResponsible }: ResultsByResponsibleProps) {
// 	const [showData, setShowData] = useState<boolean>(false);

// 	return (
// 		<div className="w-full flex flex-col gap-2">
// 			<div className="w-full flex items-center gap-2">
// 				<div className="flex items-center gap-1">
// 					<Contact className="w-3 h-3 min-w-3 min-h-3" />
// 					<h1 className="text-xs font-light leading-none tracking-tight">POR RESPONSÁVEL</h1>
// 				</div>
// 				<button
// 					type="button"
// 					onClick={() => setShowData((prev) => !prev)}
// 					className={cn("flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-primary duration-300 ease-in-out hover:bg-primary/20", {
// 						"bg-primary/30": showData,
// 					})}
// 				>
// 					{!showData ? <ChevronDown width={14} height={14} /> : <ChevronUp width={14} height={14} />}
// 				</button>
// 			</div>
// 			<AnimatePresence>
// 				{showData ? (
// 					<motion.div
// 						key={"service-orders-stats-by-responsible"}
// 						variants={SlideMotionVariants}
// 						initial="initial"
// 						animate="animate"
// 						exit="exit"
// 						className="w-full flex items-center flex-wrap gap-1"
// 					>
// 						{serviceOrderStatsByResponsible.map((resultByResponsible) => (
// 							<div key={resultByResponsible.nome} className="flex items-center gap-2 px-2 py-1 rounded-lg border border-primary/30 bg-secondary">
// 								<h1 className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/60">{resultByResponsible.nome}</h1>
// 								<div className="flex items-center gap-2">
// 									<div className="flex items-center gap-1">
// 										<CircleDot className="w-3 h-3 min-w-3 min-h-3" />
// 										<h1 className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/60">{resultByResponsible.emAndamento}</h1>
// 									</div>
// 									<div className="flex items-center gap-1">
// 										<Check className="w-3 h-3 min-w-3 min-h-3" />
// 										<h1 className="text-[0.65rem] font-medium leading-none tracking-tight text-primary/60">{resultByResponsible.concluidas}</h1>
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 					</motion.div>
// 				) : null}
// 			</AnimatePresence>
// 		</div>
// 	);
// }
