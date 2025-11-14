import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { MdAddBox, MdContentCopy, MdDelete } from "react-icons/md";

import { Button } from "@/components/ui/button";

import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";

import { cn } from "@/lib/utils";
import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { TServiceOrder } from "@/utils/schemas/service-order";

type ServiceOrderObservationsBlockProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (info: Partial<TServiceOrder>) => void;
	useObservationsFromProject?: () => void;
};
function ServiceOrderObservationsBlock({ infoHolder, updateInfoHolder, useObservationsFromProject }: ServiceOrderObservationsBlockProps) {
	const [newObservationMenuIsOpen, setNewObservationMenuIsOpen] = useState<boolean>(false);

	function addObservation(observation: TServiceOrder["observacoes"][number]) {
		updateInfoHolder({ observacoes: [...infoHolder.observacoes, observation] });
	}
	function removeObservation(index: number) {
		updateInfoHolder({ observacoes: infoHolder.observacoes.filter((x, i) => i != index) });
	}
	return (
		<div className="flex w-full flex-col gap-4">
			<h1 className="w-full rounded-md bg-blue-500 p-1 text-center text-sm font-bold text-white">INSTRUÇÕES PARA EXECUÇÃO</h1>
			<div className="flex w-full items-center justify-end gap-2">
				{useObservationsFromProject ? (
					<button
						onClick={() => useObservationsFromProject()}
						className={cn("flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400")}
					>
						<MdContentCopy size={12} />
						<h1 className="text-[0.65rem] font-medium tracking-tight">UTILIZAR OBSERVAÇÕES DO PROJETO</h1>
					</button>
				) : null}
				<button
					onClick={() => setNewObservationMenuIsOpen((prev) => !prev)}
					className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
						"bg-primary/20 hover:bg-red-300": newObservationMenuIsOpen,
						"bg-green-300 hover:bg-green-400": !newObservationMenuIsOpen,
					})}
				>
					<MdAddBox />
					<h1 className="text-xs font-medium tracking-tight">
						{!newObservationMenuIsOpen ? "ABRIR MENU DE NOVA OBSERVAÇÃO" : "FECHAR MENU DE NOVA OBSERVAÇÃO"}
					</h1>
				</button>
			</div>
			<AnimatePresence>
				{newObservationMenuIsOpen ? <NewObservationMenu addObservation={addObservation} closeMenu={() => setNewObservationMenuIsOpen(false)} /> : null}
			</AnimatePresence>
			<h1 className="text-primary/60 text-[0.65rem] leading-none font-bold tracking-tight lg:text-xs">LISTA DE OBSERVAÇÕES</h1>
			<div className="flex w-full flex-col gap-2">
				{infoHolder.observacoes.length > 0 ? (
					infoHolder.observacoes.map((obs, index) => <ObservationCard key={index} observation={obs} handleRemove={() => removeObservation(index)} />)
				) : (
					<p className="text-primary/60 w-full text-center text-sm font-medium tracking-tight">Nenhuma observação adicionada ao projeto.</p>
				)}
			</div>
		</div>
	);
}

export default ServiceOrderObservationsBlock;

type NewObservationMenuProps = {
	addObservation: (observation: TServiceOrder["observacoes"][number]) => void;
	closeMenu: () => void;
};
function NewObservationMenu({ addObservation, closeMenu }: NewObservationMenuProps) {
	const [observationHolder, setObservationHolder] = useState<TServiceOrder["observacoes"][number]>({
		topico: "GERAL",
		descricao: "",
	});

	return (
		<motion.div
			key={"menu-open"}
			variants={GeneralVisibleHiddenExitMotionVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="bg-background flex w-full flex-col gap-2 rounded border border-green-600 shadow-xs dark:bg-[#121212]"
		>
			<h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVA ATUALIZAÇÃO</h1>
			<div className="flex w-full grow flex-col gap-2 p-3">
				<TextInput
					label="TÓPICO"
					value={observationHolder.topico}
					placeholder="Preencha aqui o tópico da observação..."
					handleChange={(value) => setObservationHolder((prev) => ({ ...prev, topico: value }))}
					width="100%"
				/>

				<TextareaInput
					label="DESCRIÇÃO"
					value={observationHolder.descricao}
					placeholder="Preencha aqui o conteúdo da observação..."
					handleChange={(value) => setObservationHolder((prev) => ({ ...prev, descricao: value }))}
				/>

				<div className="mt-2 flex w-full items-center justify-end gap-2">
					<Button
						onClick={() => {
							addObservation(observationHolder);
							setObservationHolder({ topico: "GERAL", descricao: "" });
						}}
						type="button"
						size={"xs"}
					>
						ADICIONAR ATUALIZAÇÃO
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

type ObservationCardProps = {
	observation: TServiceOrder["observacoes"][number];
	handleRemove: () => void;
};
function ObservationCard({ observation, handleRemove }: ObservationCardProps) {
	return (
		<div className="border-primary/60 flex w-full flex-col rounded-md border">
			<div className="flex min-h-[25px] w-full flex-col items-start justify-between gap-1 lg:flex-row">
				<div className="flex w-full items-center justify-center rounded-tl-md rounded-br-md bg-cyan-700 lg:w-[40%]">
					<p className="w-full text-center text-xs font-medium text-white">{observation.topico}</p>
				</div>
				<div className="flex grow items-center justify-end gap-2 p-2">
					<button
						onClick={() => handleRemove()}
						className="flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[0.6rem] text-white hover:bg-red-500"
					>
						<MdDelete width={10} height={10} />
						<p>REMOVER</p>
					</button>
				</div>
			</div>
			<h1 className="text-primary/60 w-full p-2 text-center text-xs font-medium tracking-tight">{observation.descricao}</h1>
		</div>
	);
}
