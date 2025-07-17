import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

import TextInput from "../../../inputs/Text";
import SelectInput from "../../../inputs/Select";
import { formatDate, formatLongString, respChamadosPPS } from "../../../../utils/constants";
import { fetchPPSCall, useClosedPPSCalls, useOpenPPSCalls, usePPSCall } from "../../../../utils/methods/query/ppsCalls";
import LoadingPage from "../../../utils/LoadingPage";
import OpenCallCard from "./OpenCallCard";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "../../../../utils/methods/handlers";
import { useSession } from "next-auth/react";
import ModalCallPPS from "../../../ModalCallPPS";
import dayjs from "dayjs";
import { formatDateInputChange } from "../../../../utils/methods/shared";
import DateInput from "../../../inputs/Date";
const statusStyles = {
	"EM ANDAMENTO": {
		textColor: "text-[#15599a]",
		borderColor: "border-[#15599a]",
	},
	"AGUARDANDO VENDEDOR": {
		textColor: "text-orange-400",
		borderColor: "border-orange-400",
	},
	REALIZADO: {
		textColor: "text-green-400",
		borderColor: "border-green-400",
	},
	PENDENTE: {
		textColor: "text-red-400",
		borderColor: "border-red-400",
	},
};
const currentDate = dayjs().endOf("day");
const twoDaysAgoDate = currentDate.subtract(2, "days");
function ClosedCalls() {
	const [dateParams, setDateParams] = useState({
		after: twoDaysAgoDate.toISOString(),
		before: currentDate.toISOString(),
	});
	const { data: calls, isLoading, isFetched, filters, setFilters } = useClosedPPSCalls(dateParams.after, dateParams.before);

	const [modalCallIsOpen, setModalCallIsOpen] = useState(false);
	const [modalCallId, setModalCallId] = useState();
	const [filterMenuVisible, setFilterMenuVisible] = useState(false);

	async function handleOpenModal(id) {
		setModalCallId(id);
		setModalCallIsOpen(true);
	}
	console.log(currentDate);
	return (
		<div className="flex h-[1200px] w-full flex-col border border-gray-300 bg-[#fff] p-4 shadow-xl lg:h-[720px]">
			<div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
				<div className="flex w-full items-center justify-between">
					<div className="font-Raleway flex flex-wrap items-center justify-center gap-2">
						<p className="text-center text-xl font-bold uppercase text-[#15599a]">Chamados abertos</p>
						<p className="font-bold text-[#fead61]">({isFetched ? calls.length : "..."})</p>
					</div>
					{filterMenuVisible ? (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuVisible(false)} />
						</div>
					) : (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuVisible(true)} />
						</div>
					)}
				</div>
				<AnimatePresence>
					{filterMenuVisible ? (
						<motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
							<div className="flex w-full items-center justify-between">
								<div className="flex items-center justify-center gap-x-2">
									<div className="w-full lg:w-[250px]">
										<DateInput
											width={"100%"}
											label={"DEPOIS DE"}
											value={dateParams.after ? formatDate(dateParams.after) : undefined}
											handleChange={(value) => setDateParams((prev) => ({ ...prev, after: formatDateInputChange(value) }))}
										/>
									</div>
									<div className="w-full lg:w-[250px]">
										<DateInput
											width={"100%"}
											label={"ANTES DE"}
											value={dateParams.before ? formatDate(dateParams.before) : undefined}
											handleChange={(value) => setDateParams((prev) => ({ ...prev, before: formatDateInputChange(value) }))}
										/>
									</div>
								</div>
								<div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
									<TextInput
										label="NOME DO VENDEDOR"
										placeholder={"Digite aqui o nome do vendedor..."}
										value={filters.seller}
										handleChange={(value) => setFilters((prev) => ({ ...prev, seller: value }))}
									/>

									<div className="w-full lg:w-[250px]">
										<SelectInput
											label="RESPONSÁVEL"
											selectedItemLabel={"TODOS OS RESPONSÁVEIS"}
											options={respChamadosPPS.map((resp, index) => ({ id: index + 1, label: resp.label, value: resp.value }))}
											value={filters.responsible}
											handleChange={(value) => setFilters((prev) => ({ ...prev, responsible: value }))}
											onReset={() => setFilters((prev) => ({ ...prev, responsible: [] }))}
											width={"100%"}
										/>
									</div>
									{/* <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterOpenCalls} /> */}
								</div>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
			<div className="overscroll-y mt-2 flex grow flex-wrap justify-around gap-2 overflow-y-auto px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{isLoading ? <LoadingPage /> : null}
				{isFetched ? (
					calls?.length > 0 ? (
						calls.map((call) => <OpenCallCard key={call._id} call={call} handleOpenModal={(call) => handleOpenModal(call._id)} />)
					) : (
						<div className="flex w-full grow flex-col items-center justify-center">
							<p className="text-lg font-black text-[#fead41]">EBA !!!</p>
							<p className="text-md font-medium italic text-gray-500">Não há chamados em aberto...</p>
						</div>
					)
				) : null}
			</div>
			{modalCallIsOpen && <ModalCallPPS callId={modalCallId} modalIsOpen={modalCallIsOpen} closeModal={() => setModalCallIsOpen(false)} />}
		</div>
	);
}

export default ClosedCalls;
