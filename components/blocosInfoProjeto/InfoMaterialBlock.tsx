import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { MdDelete, MdOutlineAddCircle } from "react-icons/md";
import { RiDeleteBack2Line } from "react-icons/ri";

import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { TbCircuitChangeover } from "react-icons/tb";
import MaterialSelector from "../identificador/almoxarifado/estoque/MaterialVinculatorSelector";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import { Button } from "../ui/button";
import { InfoBlockSection } from "./Utils/SectionBlock";
type TCircuitBreaker = {
	tipo: "NÃO DEFINIDO" | "MONOFÁSICO" | "BIFÁSICO" | "TRIFÁSICO";
	corrente: number;
	qtde: number;
};

type InfoMaterialBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
	updateLogs: TProjectUpdateLogDTO[];
	project: TProjectDTO;
	showCircuitBreakers: boolean;
	circuitBreakerAddition: boolean;
};
function InfoMaterialBlock({
	editor,
	infoHolder,
	setInfo,
	changes,
	setChanges,
	updateLogs = [],
	showCircuitBreakers,
	circuitBreakerAddition,
}: InfoMaterialBlockProps) {
	function addAllocation(info: Exclude<TProject["alocacoes"], undefined | null>[number]) {
		const prevAllocations = infoHolder.alocacoes || [];
		const newAllocations = [...prevAllocations, info];
		setInfo((prev) => ({
			...prev,
			alocations: newAllocations,
		}));
		setChanges((prev) => ({
			...prev,
			alocacoes: newAllocations,
		}));
	}

	function deleteAllocation(index: number) {
		const prevAllocations = infoHolder.alocacoes || [];
		const newAllocations = prevAllocations.filter((_, i) => i !== index);
		setInfo((prev) => ({
			...prev,
			alocacoes: newAllocations,
		}));
		setChanges((prev) => ({
			...prev,
			alocacoes: newAllocations,
		}));
	}

	function updateAllocation(index: number, info: Partial<Exclude<TProject["alocacoes"], undefined | null>[number]>) {
		const prevAllocations = infoHolder.alocacoes || [];
		const newAllocations = prevAllocations.map((allocation, i) => (i === index ? { ...allocation, ...info } : allocation));
		setInfo((prev) => ({
			...prev,
			alocacoes: newAllocations,
		}));
		setChanges((prev) => ({
			...prev,
			alocacoes: newAllocations,
		}));
	}
	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<Box className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE MATERIAIS DO PROJETO</h1>
			</div>
			<div className="flex w-full flex-col gap-2 px-2">
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<NumberInput
							label={"PREVISÃO DE CUSTOS EM INSUMOS"}
							editable={editor}
							value={infoHolder.material?.previsaoCustos || null}
							placeholder="Preencha a previsão de custos em insumos..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"material.previsaoCustos": value,
								}));
								setInfo((prev) => ({
									...prev,
									material: {
										...prev.material,
										previsaoCustos: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<NumberInput
							label={"EFETIVO DE CUSTOS EM INSUMOS"}
							editable={editor}
							value={infoHolder.material?.efetivoCustos || null}
							placeholder="Preencha o efetivo de custos em insumos..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"material.efetivoCustos": value,
								}));
								setInfo((prev) => ({
									...prev,
									material: {
										...prev.material,
										efetivoCustos: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
				</div>
				<div className="flex w-full items-center justify-center self-center lg:w-1/3">
					<SelectInput
						label={"STATUS DE SEPARAÇÃO DO MATERIAL"}
						value={infoHolder.material?.statusSeparacao}
						selectedItemLabel="NÃO DEFINIDO"
						editable={editor}
						options={[
							{ id: 1, label: "INICIAR SEPARAÇÃO", value: "INICIAR SEPARAÇÃO" },
							{ id: 2, label: "SEPARADO", value: "SEPARADO" },
						]}
						handleChange={(value) => {
							setChanges((prev) => ({
								...prev,
								"material.statusSeparacao": value,
							}));
							setInfo((prev) => ({
								...prev,
								material: {
									...prev.material,
									statusSeparacao: value,
								},
							}));
						}}
						onReset={() => {
							setChanges((prev) => ({
								...prev,
								"material.statusSeparacao": "NÃO DEFINIDO",
							}));
							setInfo((prev) => ({
								...prev,
								material: {
									...prev.material,
									statusSeparacao: "NÃO DEFINIDO",
								},
							}));
						}}
						width="100%"
					/>
				</div>
				<InfoMaterialBlockAllocations
					allocations={infoHolder.alocacoes}
					addAllocation={addAllocation}
					deleteAllocation={deleteAllocation}
					updateAllocation={updateAllocation}
				/>
			</div>
		</div>
	);
}

export default InfoMaterialBlock;

type InfoMaterialBlockAllocationsProps = {
	allocations: TProject["alocacoes"];
	addAllocation: (allocation: Exclude<TProject["alocacoes"], undefined | null>[number]) => void;
	deleteAllocation: (index: number) => void;
	updateAllocation: (index: number, allocation: Partial<Exclude<TProject["alocacoes"], undefined | null>[number]>) => void;
};
function InfoMaterialBlockAllocations({ allocations, addAllocation, deleteAllocation, updateAllocation }: InfoMaterialBlockAllocationsProps) {
	const [newAllocationMenuIsOpen, setNewAllocationMenuIsOpen] = useState(false);
	return (
		<InfoBlockSection headerTitle="ALOCAÇÕES DE MATERIAL" headerIcon={<Box className="h-4 w-4 min-h-4 min-w-4" />}>
			<div className="flex items-center justify-end">
				<Button onClick={() => setNewAllocationMenuIsOpen((prev) => !prev)} size={"sm"} variant={"ghost"} type="button">
					ADICIONAR ALOCAÇÃO
				</Button>
			</div>
			<AnimatePresence>
				{newAllocationMenuIsOpen ? (
					<InfoMaterialBlockNewAllocationMenu addAllocation={addAllocation} closeMenu={() => setNewAllocationMenuIsOpen(false)} />
				) : null}
			</AnimatePresence>
			<div className="flex w-full flex-col gap-2">
				{allocations && allocations.length > 0 ? (
					allocations.map((allocation, index) => (
						<InfoMaterialBlockAllocationCard
							key={allocation.idMaterial}
							allocation={allocation}
							deleteAllocation={() => deleteAllocation(index)}
							updateAllocation={(changes) => updateAllocation(index, changes)}
						/>
					))
				) : (
					<div className="flex grow items-center justify-center">
						<p className="text-primary/60 text-center text-sm italic">Nenhuma alocação de material encontrada...</p>
					</div>
				)}
			</div>
		</InfoBlockSection>
	);
}

type InfoMaterialBlockNewAllocationMenuProps = {
	addAllocation: (allocation: Exclude<TProject["alocacoes"], undefined | null>[number]) => void;
	closeMenu: () => void;
};
function InfoMaterialBlockNewAllocationMenu({ addAllocation, closeMenu }: InfoMaterialBlockNewAllocationMenuProps) {
	const [allocationHolder, setAllocationHolder] = useState<Exclude<TProject["alocacoes"], undefined | null>[number]>({
		idMaterial: "",
		nome: "",
		unidade: "UN",
		quantidadePrevista: 0,
		quantidade: 0,
		movimentacoes: [],
		precoUnitario: 0,
	});

	function handleAddAllocation(info: Exclude<TProject["alocacoes"], undefined | null>[number]) {
		if (!info.idMaterial) return toast.error("Selecione um material para adicionar à alocação.");
		if (info.quantidadePrevista <= 0) return toast.error("A quantidade prevista deve ser maior que zero.");
		addAllocation(info);
		setAllocationHolder({
			idMaterial: "",
			nome: "",
			unidade: "UN",
			quantidadePrevista: 0,
			quantidade: 0,
			movimentacoes: [],
			precoUnitario: 0,
		});
	}
	return (
		<motion.div
			key={"menu-open"}
			variants={GeneralVisibleHiddenExitMotionVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="bg-background flex w-full flex-col gap-2 rounded border border-green-600 shadow-xs dark:bg-[#121212]"
		>
			<h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVA ALOCAÇÃO</h1>
			<div className="flex w-full grow flex-col gap-2 p-3">
				<MaterialSelector
					initialMaterialState={{ materialId: allocationHolder.idMaterial || null, materialName: allocationHolder.nome }}
					vinculateMaterial={(m) =>
						setAllocationHolder((prev) => ({
							...prev,
							idMaterial: m._id,
							nome: m.nome,
							unidade: m.grandeza || "UN",
						}))
					}
					unvinculateMaterial={() =>
						setAllocationHolder((prev) => ({
							...prev,
							idMaterial: "",
							nome: "",
							unidade: "UN",
						}))
					}
				/>

				<div className="flex w-full items-center justify-center">
					<NumberInput
						label="QUANTIDADE PREVISTA"
						value={allocationHolder.quantidadePrevista || null}
						handleChange={(value) =>
							setAllocationHolder((prev) => ({
								...prev,
								quantidadePrevista: value,
							}))
						}
						placeholder="Preencha aqui a quantidade prevista."
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						width="100%"
					/>
				</div>

				<div className="flex items-center justify-end">
					<Button onClick={() => handleAddAllocation(allocationHolder)} size={"sm"} type="button">
						ADICIONAR ALOCAÇÃO
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

type InfoMaterialBlockAllocationProps = {
	allocation: Exclude<TProject["alocacoes"], undefined | null>[number];
	deleteAllocation: () => void;
	updateAllocation: (allocation: Partial<Exclude<TProject["alocacoes"], undefined | null>[number]>) => void;
};

function InfoMaterialBlockAllocationCard({ allocation, deleteAllocation, updateAllocation }: InfoMaterialBlockAllocationProps) {
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);
	const [allocationHolder, setAllocationHolder] = useState<Exclude<TProject["alocacoes"], undefined | null>[number]>(allocation);
	return (
		<AnimatePresence>
			<div className="w-full flex flex-col p-2 rounded border border-primary/20 shadow-xs">
				<div className="w-full flex items-center justify-between">
					<h1 className="text-xs font-bold tracking-tight">{allocation.nome}</h1>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="fit" onClick={() => setEditMenuIsOpen((prev) => !prev)}>
							<Pencil className="w-4 h-4 min-w-4 min-h-4" />
						</Button>
						<Button variant="ghost" size="fit" onClick={() => deleteAllocation()}>
							<MdDelete className="w-4 h-4 min-w-4 min-h-4" />
						</Button>
					</div>
				</div>
				<div className="w-full flex items-center justify-center gap-2">
					<div className="flex items-center gap-1 bg-blue-200 rounded-md px-2 py-1">
						<h1 className="text-[0.65rem] font-bold tracking-tight text-blue-600">
							{allocation.quantidadePrevista} {allocation.unidade} PREVISTOS
						</h1>
					</div>
					<div className="flex items-center gap-1 bg-green-200 rounded-md px-2 py-1">
						<h1 className="text-[0.65rem] font-bold tracking-tight text-green-600">
							{allocation.quantidade} {allocation.unidade} ALOCADOS
						</h1>
					</div>
				</div>
			</div>
			{editMenuIsOpen ? (
				<motion.div
					variants={GeneralVisibleHiddenExitMotionVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="flex w-full flex-col gap-3 p-3"
				>
					<MaterialSelector
						initialMaterialState={{ materialId: allocationHolder.idMaterial || null, materialName: allocationHolder.nome }}
						vinculateMaterial={(m) =>
							setAllocationHolder((prev) => ({
								...prev,
								materialId: m._id,
								nome: m.nome,
								unidade: m.grandeza || "UN",
							}))
						}
						unvinculateMaterial={() =>
							setAllocationHolder((prev) => ({ ...prev, materialId: allocation.idMaterial, nome: allocation.nome, unidade: allocation.unidade }))
						}
					/>

					<div className="flex w-full items-center justify-center">
						<NumberInput
							label="QUANTIDADE PREVISTA"
							value={allocationHolder.quantidadePrevista || null}
							handleChange={(value) =>
								setAllocationHolder((prev) => ({
									...prev,
									quantidadePrevista: value,
								}))
							}
							placeholder="Preencha aqui a quantidade prevista."
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							width="100%"
						/>
					</div>

					<div className="flex items-center justify-end gap-2">
						<button
							type="button"
							onClick={() => {
								setEditMenuIsOpen(false);
							}}
							className="rounded bg-red-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-red-700"
						>
							FECHAR
						</button>
						<button
							type="button"
							onClick={() => {
								updateAllocation(allocationHolder);
								setEditMenuIsOpen(false);
							}}
							className="rounded bg-blue-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-blue-700"
						>
							ATUALIZAR ITEM
						</button>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
