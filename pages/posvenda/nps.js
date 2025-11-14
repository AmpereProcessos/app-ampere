import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { ImSad } from "react-icons/im";
import { useSession } from "../../components/providers/SessionProvider";

import { formatDecimalPlaces } from "../../utils/constants";
import { useNPS } from "../../utils/methods/query/aftersales";

import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { AnimatePresence, motion } from "framer-motion";
import { BiHappyAlt, BiSad } from "react-icons/bi";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdGrade } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import NPSCard from "../../components/NPSCard";
import NPSFilterBlock from "../../components/identificador/posvenda/NPSFilterBlock";
import ErrorPage from "../../components/utils/ErrorPage";
import LoadingPage from "../../components/utils/LoadingPage";

function NPS() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	return <NPSContent session={session} />;
}

export default NPS;

function NPSContent({ session }) {
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

	const { data, isLoading, isSuccess, isError, filters, setFilters } = useNPS(session.user.permissoes.posVenda.visualizar);

	function getStats({ info }) {
		if (!info)
			return {
				projetos: 0,
				coletados: 0,
				promotores: 0,
				detratores: 0,
				nps: 0,
			};
		const projectsQty = info.length;
		const { promoters, detrators, collected } = info.reduce(
			(acc, current) => {
				const currentNPSValue = current.nps;
				if (currentNPSValue != null && currentNPSValue >= 9) acc.promoters = acc.promoters + 1;
				if (currentNPSValue != null && currentNPSValue <= 6) acc.detrators = acc.detrators + 1;
				if (currentNPSValue != null && currentNPSValue <= 10) acc.collected = acc.collected + 1;
				return acc;
			},
			{ promoters: 0, detrators: 0, collected: 0 },
		);
		const nps = ((promoters - detrators) * 100) / collected;

		return {
			projetos: projectsQty,
			coletados: collected,
			promotores: promoters,
			detratores: detrators,
			nps: formatDecimalPlaces(nps, 2),
		};
	}

	const renderCards = useMemo(() => data?.map((project) => <NPSCard key={project._id} project={project} />), [data]);
	return (
		<div className="bg-background grow p-6">
			<div className="border-primary/20 mb-6 flex flex-col items-center border-b pb-2">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black text-[#15599a] uppercase">COLETA DE NPS</p>
					</div>
					{dropdownMenuVisible ? (
						<div className="text-primary/80 cursor-pointer hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
						</div>
					) : (
						<div className="text-primary/80 cursor-pointer hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
						</div>
					)}
				</div>
				<div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
							<VscDiffAdded />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).projetos}</div>
							<p className="text-primary/60 text-xs">{getStats({ info: data }).coletados} coletados</p>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PROMOTORES</h1>
							<BiHappyAlt />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).promotores}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">DETRATORES</h1>
							<BiSad />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).detratores}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">NPS</h1>
							<MdGrade />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).nps}%</div>
						</div>
					</div>
				</div>
				<AnimatePresence>
					{dropdownMenuVisible ? (
						<motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
							<NPSFilterBlock filters={filters} setFilters={setFilters} />
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
			<div className="mt-4 flex flex-wrap justify-around gap-3">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorPage msg={"Houve um erro na busca dos registros..."} /> : null}
				{isSuccess ? (
					data.length > 0 ? (
						renderCards
					) : (
						<div className="flex flex-col items-center justify-center gap-4">
							<ImSad style={{ fontSize: "50px", color: "#fead61" }} />
							<p className="text-primary/80 w-full text-center text-sm italic lg:w-[50%]">
								Oops, parece que não há projetos que se enquadrem nos filtros definidos.
							</p>
						</div>
					)
				) : null}
			</div>
		</div>
	);
}
