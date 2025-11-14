import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { easeBackInOut } from "d3-ease";

import { FaLink } from "react-icons/fa";

import SelectInput from "../../inputs/Select";

import { useClients } from "../../../utils/methods/query/clients";
import { VscChromeClose } from "react-icons/vsc";
import SelectVirtualizedInput from "@/components/inputs/SelectVirtualized";

const variants = {
	hidden: {
		opacity: 0.2,
		scale: 0.95, // Scale down slightly
		backgroundColor: "rgba(255, 255, 255, 0.9)", // Adjust the color and alpha as needed
		transition: {
			duration: 0.5,
			ease: easeBackInOut, // Use an easing function
		},
	},
	visible: {
		opacity: 1,
		scale: 1, // Scale down slightly
		backgroundColor: "rgba(255, 255, 255, 1)", // Normal background color
		transition: {
			duration: 0.5,
			ease: easeBackInOut, // Use an easing function
		},
	},
	exit: {
		opacity: 0,
		scale: 1.05, // Scale down slightly
		backgroundColor: "rgba(255, 255, 255, 0.5)", // Fading background color
		transition: {
			duration: 0.01,
			ease: easeBackInOut, // Use an easing function
		},
	},
};
type TSelectableProject = { id: string | null; nome: string | null; identificador: string | number | null };

type ProjectVinculationMenuProps = {
	handleLink: (project: TSelectableProject) => void;
	handleUnlink: () => void;
};
function ProjectVinculationMenu({ handleLink, handleUnlink }: ProjectVinculationMenuProps) {
	const [menuIsOpen, setMenuIsOpen] = useState(false);
	// Getting clients and formatted clients
	const { data: clients = [] } = useClients(true);
	const clientsOptions = clients.map((client) => ({
		id: client._id,
		label: `(${client.qtde}) ${client.nomeDoContrato}`,
		value: client._id,
	}));
	const [selectedClient, setSelectedClient] = useState<TSelectableProject>({ id: null, nome: null, identificador: null });
	function handleVinculation() {
		if (!selectedClient) {
			toast.error("Nenhum projeto selecionado foi selecionado. Selecione algum para vincular.");
			return;
		}
		handleLink(selectedClient);
	}
	console.log(selectedClient);
	return (
		<div className="flex w-full flex-col">
			{menuIsOpen ? (
				<button
					onClick={() => setMenuIsOpen((prev) => !prev)}
					className="flex w-fit cursor-pointer items-center justify-center gap-2 self-center rounded border border-red-500 px-2 py-1 text-red-500 duration-300 ease-in-out hover:border-red-600"
				>
					<VscChromeClose />
					<h1 className="font-bold">FECHAR MENU DE VINCULAÇÃO DE PROJETO</h1>
				</button>
			) : (
				<button
					onClick={() => setMenuIsOpen((prev) => !prev)}
					className="flex w-fit cursor-pointer items-center justify-center gap-2 self-center rounded border border-blue-500 px-2 py-1 text-blue-500 duration-300 ease-in-out hover:border-blue-600"
				>
					<FaLink />
					<h1 className="font-bold">ABRIR MENU DE VINCULAÇÃO DE PROJETO</h1>
				</button>
			)}

			<AnimatePresence>
				{menuIsOpen ? (
					<motion.div
						variants={variants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="border-primary/20 mt-2 flex w-full items-end gap-2 border p-3 shadow-xs"
					>
						<div className="grow">
							<SelectVirtualizedInput
								label={"PROJETO AMPÈRE"}
								selectedItemLabel={"NÃO DEFINIDO"}
								value={selectedClient.id}
								options={clientsOptions}
								handleChange={(value) => {
									const equivalent = clients.find((c) => c._id == value);
									setSelectedClient({ id: equivalent?._id || "", nome: equivalent?.nomeDoContrato || "", identificador: equivalent?.qtde || "" });
								}}
								onReset={() => {
									setSelectedClient({ id: null, nome: null, identificador: null });
									handleUnlink();
								}}
								width={"100%"}
							/>
						</div>
						<button
							onClick={handleVinculation}
							className="h-[46px] w-fit rounded-md border border-blue-500 p-3 font-medium text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
						>
							VINCULAR
						</button>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}

export default ProjectVinculationMenu;
