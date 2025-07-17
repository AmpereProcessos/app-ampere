import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import { isValidNumber } from "@/utils/methods/validating";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import { Box, CircleDot } from "lucide-react";
import { AiFillDelete } from "react-icons/ai";
import React, { useState } from "react";
import { BsSuitDiamondFill } from "react-icons/bs";
import { FaSolarPanel } from "react-icons/fa";
import { TbTopologyFull } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { cn } from "@/lib/utils";

type ServiceOrderEquipmentsInformationBlockProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (info: Partial<TServiceOrder>) => void;
	project?: TServiceOrderProject;
	useProjectToTakeEquipmentsInformation?: () => void;
	useProjectInLocoEquipmentsInformation?: () => void;
};
function ServiceOrderEquipmentsInformationBlock({
	infoHolder,
	updateInfoHolder,
	project,
	useProjectInLocoEquipmentsInformation,
	useProjectToTakeEquipmentsInformation,
}: ServiceOrderEquipmentsInformationBlockProps) {
	function addEquipment(info: Exclude<TServiceOrder["equipamentos"]["retirada"], null | undefined>[number], type: "take" | "in-loco") {
		if (type === "take")
			updateInfoHolder({
				equipamentos: {
					...infoHolder.equipamentos,
					retirada: [...(infoHolder.equipamentos.retirada || []), info],
				},
			});
		else
			updateInfoHolder({
				equipamentos: {
					...infoHolder.equipamentos,
					disponivel: [...(infoHolder.equipamentos.disponivel || []), info],
				},
			});
	}
	function removeEquipment(index: number, type: "take" | "in-loco") {
		if (type === "take")
			updateInfoHolder({
				equipamentos: {
					...infoHolder.equipamentos,
					retirada: (infoHolder.equipamentos.retirada || []).filter((x, i) => i !== index),
				},
			});
		else
			updateInfoHolder({
				equipamentos: {
					...infoHolder.equipamentos,
					disponivel: (infoHolder.equipamentos.disponivel || []).filter((x, i) => i !== index),
				},
			});
	}
	function handleUseProjectInformation(project: TServiceOrderProject | undefined) {
		if (!project) return toast.error("Dados do projeto não encontrados.");
		updateInfoHolder({
			equipamentos: {
				...infoHolder.equipamentos,
				inversor: {
					modelo: project.produtos
						?.filter((p) => p.categoria === "INVERSOR")
						.map((p) => p.modelo)
						.join(" / "),
					potencia: project.produtos
						?.filter((p) => p.categoria === "INVERSOR")
						.map((p) => `${p.potencia || 0}W`)
						.join(" / "),
					qtde: project.produtos?.filter((p) => p.categoria === "INVERSOR").reduce((acc, current) => acc + current.qtde, 0),
				},
				modulos: {
					modelo: project.produtos
						?.filter((p) => p.categoria === "MÓDULO")
						.map((p) => p.modelo)
						.join(" / "),
					potencia: project.produtos
						?.filter((p) => p.categoria === "MÓDULO")
						.map((p) => `${p.potencia || 0}W`)
						.join(" / "),
					qtde: project.produtos?.filter((p) => p.categoria === "MÓDULO").reduce((acc, current) => acc + current.qtde, 0),
				},
			},
		});
	}
	const isServiceOrderInformationEqualToProject = Object.values({
		invertersModel: project
			? infoHolder.equipamentos.inversor.modelo ===
				project.produtos
					?.filter((p) => p.categoria === "INVERSOR")
					.map((p) => p.modelo)
					.join(" / ")
			: false,
		invertersPower: project
			? infoHolder.equipamentos.inversor.potencia ===
				project.produtos
					?.filter((p) => p.categoria === "INVERSOR")
					.map((p) => `${p.potencia || 0}W`)
					.join(" / ")
			: false,
		invertersQty: project
			? infoHolder.equipamentos.inversor.qtde === project.produtos?.filter((p) => p.categoria === "INVERSOR").reduce((acc, current) => acc + current.qtde, 0)
			: false,
		modulesModel: project
			? infoHolder.equipamentos.modulos.modelo ===
				project.produtos
					?.filter((p) => p.categoria === "MÓDULO")
					.map((p) => p.modelo)
					.join(" / ")
			: false,
		modulesPower: project
			? infoHolder.equipamentos.modulos.potencia ===
				project.produtos
					?.filter((p) => p.categoria === "MÓDULO")
					.map((p) => `${p.potencia || 0}W`)
					.join(" / ")
			: false,
		modulesQty: project ? infoHolder.equipamentos.modulos.qtde === project.produtos?.filter((p) => p.categoria === "MÓDULO").reduce((acc, current) => acc + current.qtde, 0) : false,
	}).every((r) => r);
	return (
		<div className="flex w-full flex-col items-center gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">EQUIPAMENTOS</h1>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full items-center justify-end">
					{project && !isServiceOrderInformationEqualToProject ? (
						<button
							type="button"
							onClick={() => handleUseProjectInformation(project)}
							className={cn("flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400")}
						>
							<MdContentCopy size={12} />
							<h1 className="text-[0.65rem] font-medium tracking-tight">UTILIZAR DADOS DO PROJETO</h1>
						</button>
					) : null}
				</div>
				<ModulesInformation infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				<InvertersInformation infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="h-full w-full lg:w-1/2">
						<TakeEquipmentBlock
							equipmentsToTake={infoHolder.equipamentos.retirada}
							addEquipmentToTake={(info) => addEquipment(info, "take")}
							removeEquipmentToTake={(index) => removeEquipment(index, "take")}
							useProjectToTakeEquipmentsInformation={useProjectToTakeEquipmentsInformation}
						/>
					</div>
					<div className="h-full w-full lg:w-1/2">
						<InLocoEquipmentBlock
							equipmentsInLoco={infoHolder.equipamentos.disponivel}
							addEquipmentInLoco={(info) => addEquipment(info, "in-loco")}
							removeEquipmentInLoco={(index) => removeEquipment(index, "in-loco")}
							useProjectInLocoEquipmentsInformation={useProjectInLocoEquipmentsInformation}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServiceOrderEquipmentsInformationBlock;

type ModulesInformationProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (info: Partial<TServiceOrder>) => void;
};
function ModulesInformation({ infoHolder, updateInfoHolder }: ModulesInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-2">
			<div className="flex items-center gap-2">
				<FaSolarPanel />
				<h1 className="text-xs font-medium tracking-tight text-gray-500">MÓDULOS FOTOVOLTAICOS</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label={"MODELO DOS MODULOS"}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						placeholder={"Preencha o modelo dos módulos..."}
						value={infoHolder.equipamentos.modulos.modelo || ""}
						handleChange={(value) =>
							updateInfoHolder({
								equipamentos: { ...infoHolder.equipamentos, modulos: { ...infoHolder.equipamentos.modulos, modelo: value } },
							})
						}
						width={"100%"}
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<NumberInput
						label={"QTDE DE MODULOS"}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						placeholder={"Preencha a quantidade de módulos..."}
						value={infoHolder.equipamentos.modulos.qtde || null}
						handleChange={(value) =>
							updateInfoHolder({
								equipamentos: { ...infoHolder.equipamentos, modulos: { ...infoHolder.equipamentos.modulos, qtde: value } },
							})
						}
						width={"100%"}
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label={"POTÊNCIA DOS MODULOS"}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						placeholder={"Preencha a potência dos módulos..."}
						value={infoHolder.equipamentos.modulos.potencia?.toString() || ""}
						handleChange={(value) =>
							updateInfoHolder({
								equipamentos: { ...infoHolder.equipamentos, modulos: { ...infoHolder.equipamentos.modulos, potencia: value } },
							})
						}
						width={"100%"}
					/>
				</div>
			</div>
		</div>
	);
}
type InvertersInformationProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (info: Partial<TServiceOrder>) => void;
};
function InvertersInformation({ infoHolder, updateInfoHolder }: InvertersInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-2">
			<div className="flex items-center gap-2">
				<TbTopologyFull />
				<h1 className="text-xs font-medium tracking-tight text-gray-500">INVERSORES</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label={"MODELO DOS INVERSORES"}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						placeholder={"Preencha o modelo dos inversores..."}
						value={infoHolder.equipamentos.inversor.modelo || ""}
						handleChange={(value) =>
							updateInfoHolder({
								equipamentos: { ...infoHolder.equipamentos, inversor: { ...infoHolder.equipamentos.inversor, modelo: value } },
							})
						}
						width={"100%"}
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<NumberInput
						label={"QTDE DE INVERSORES"}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						placeholder={"Preencha a quantidade de inversores..."}
						value={infoHolder.equipamentos.inversor.qtde || null}
						handleChange={(value) =>
							updateInfoHolder({
								equipamentos: { ...infoHolder.equipamentos, inversor: { ...infoHolder.equipamentos.inversor, qtde: value } },
							})
						}
						width={"100%"}
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label={"POTÊNCIA DOS INVERSORES"}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						placeholder={"Preencha a potência dos inversores..."}
						value={infoHolder.equipamentos.inversor.potencia?.toString() || ""}
						handleChange={(value) =>
							updateInfoHolder({
								equipamentos: { ...infoHolder.equipamentos, inversor: { ...infoHolder.equipamentos.inversor, potencia: value } },
							})
						}
						width={"100%"}
					/>
				</div>
			</div>
		</div>
	);
}

type TakeEquipmentBlockProps = {
	equipmentsToTake: TServiceOrder["equipamentos"]["retirada"];
	addEquipmentToTake: (info: Exclude<TServiceOrder["equipamentos"]["retirada"], null | undefined>[number]) => void;
	removeEquipmentToTake: (index: number) => void;
	useProjectToTakeEquipmentsInformation?: () => void;
};
function TakeEquipmentBlock({ equipmentsToTake, addEquipmentToTake, removeEquipmentToTake, useProjectToTakeEquipmentsInformation }: TakeEquipmentBlockProps) {
	const [newEquipmentToTakeHolder, setNewEquipmentToTakeHolder] = useState<Exclude<TServiceOrder["equipamentos"]["retirada"], null | undefined>[number]>({
		qtde: null,
		descricao: "",
	});
	function handleAddEquipmentToTake(info: Exclude<TServiceOrder["equipamentos"]["retirada"], null | undefined>[number]) {
		if (!info.qtde || info.qtde <= 0) return toast.error("Preencha uma quantidade válida.");
		if (info.descricao.trim().length < 3) return toast.error("Preencha uma descrição de ao menos 3 caractéres.");
		return addEquipmentToTake(info);
	}
	return (
		<div className="flex h-full w-full flex-col gap-2 rounded-lg border border-gray-300 p-2">
			<div className="flex w-full flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Box size={15} />
					<h1 className="text-xs font-medium tracking-tight text-gray-500">MATERIAIS P/ RETIRADA</h1>
				</div>
				{useProjectToTakeEquipmentsInformation && (
					<button
						type="button"
						onClick={() => useProjectToTakeEquipmentsInformation()}
						className={cn("flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400")}
					>
						<MdContentCopy size={12} />
						<h1 className="text-[0.65rem] font-medium tracking-tight">UTILIZAR INFORMAÇÕES DO PROJETO</h1>
					</button>
				)}
			</div>

			<div className="flex min-h-[50px] w-full grow flex-col gap-2">
				{equipmentsToTake ? (
					equipmentsToTake.length > 0 ? (
						equipmentsToTake.map((equipment, index) => (
							<div key={`${equipment.descricao}`} className="flex w-full items-center justify-between">
								<div className="flex items-center gap-2">
									<BsSuitDiamondFill />
									<p className="text-xs tracking-tight text-gray-500">
										{isValidNumber(equipment.qtde) ? `${equipment.qtde}x ` : ""}
										{equipment.descricao}
									</p>
								</div>
								<button type="button" onClick={() => removeEquipmentToTake(index)} className="flex items-center justify-center text-sm text-red-300 hover:text-red-500">
									<AiFillDelete />
								</button>
							</div>
						))
					) : (
						<div className="flex w-full grow items-center justify-center">
							<p className="text-center text-sm italic text-gray-500">Nenhum material adicionado para retirada...</p>
						</div>
					)
				) : (
					<div className="flex w-full grow items-center justify-center">
						<p className="text-center text-sm italic text-gray-500">Nenhum material adicionado para retirada...</p>
					</div>
				)}
			</div>
			<div className="flex w-full items-center gap-1 border-t border-gray-500 pt-1">
				<div className="grow">
					<NumberInput
						label="QTDE"
						showLabel={false}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						value={newEquipmentToTakeHolder.qtde || null}
						handleChange={(value) => setNewEquipmentToTakeHolder((prev) => ({ ...prev, qtde: value }))}
						placeholder="Preencha aqui a quantidade do equipamento..."
						width="100%"
					/>
				</div>
				<div className="grow">
					<TextInput
						label="DESCRIÇÃO"
						showLabel={false}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						value={newEquipmentToTakeHolder.descricao}
						handleChange={(value) => setNewEquipmentToTakeHolder((prev) => ({ ...prev, descricao: value }))}
						placeholder="Preencha aqui a descrição do equipamento..."
						width="100%"
					/>
				</div>
				<div className="flex w-fit items-center justify-center p-2">
					<button
						type="button"
						onClick={() => handleAddEquipmentToTake(newEquipmentToTakeHolder)}
						className="flex items-center justify-center rounded-full bg-green-600 p-2 text-xs text-white duration-300 ease-in-out hover:bg-green-500"
					>
						<IoMdAdd />
					</button>
				</div>
			</div>
		</div>
	);
}
type InLocoEquipmentBlockProps = {
	equipmentsInLoco: TServiceOrder["equipamentos"]["retirada"];
	addEquipmentInLoco: (info: Exclude<TServiceOrder["equipamentos"]["retirada"], null | undefined>[number]) => void;
	removeEquipmentInLoco: (index: number) => void;
	useProjectInLocoEquipmentsInformation?: () => void;
};
function InLocoEquipmentBlock({ equipmentsInLoco, addEquipmentInLoco, removeEquipmentInLoco, useProjectInLocoEquipmentsInformation }: InLocoEquipmentBlockProps) {
	const [newEquipmentInLocoHolder, setNewEquipmentInLocoHolder] = useState<Exclude<TServiceOrder["equipamentos"]["retirada"], null | undefined>[number]>({
		qtde: null,
		descricao: "",
	});
	function handleAddEquipmentInLoco(info: Exclude<TServiceOrder["equipamentos"]["retirada"], null | undefined>[number]) {
		if (!info.qtde || info.qtde <= 0) return toast.error("Preencha uma quantidade válida.");
		if (info.descricao.trim().length < 3) return toast.error("Preencha uma descrição de ao menos 3 caractéres.");
		return addEquipmentInLoco(info);
	}
	return (
		<div className="flex h-full w-full flex-col gap-2 rounded-lg border border-gray-300 p-2">
			<div className="flex w-full flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<CircleDot size={15} />
					<h1 className="text-xs font-medium tracking-tight text-gray-500">MATERIAIS DISPONÍVEIS IN LOCO</h1>
				</div>
				{useProjectInLocoEquipmentsInformation && (
					<button
						type="button"
						onClick={() => useProjectInLocoEquipmentsInformation()}
						className={cn("flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400")}
					>
						<MdContentCopy size={12} />
						<h1 className="text-[0.65rem] font-medium tracking-tight">UTILIZAR INFORMAÇÕES DO PROJETO</h1>
					</button>
				)}
			</div>

			<div className="flex min-h-[50px] w-full grow flex-col gap-2">
				{equipmentsInLoco ? (
					equipmentsInLoco.length > 0 ? (
						equipmentsInLoco.map((equipment, index) => (
							<div key={`${equipment.descricao}-${index}`} className="flex w-full items-center justify-between">
								<div className="flex items-center gap-2">
									<BsSuitDiamondFill />
									<p className="text-xs tracking-tight text-gray-500">
										{isValidNumber(equipment.qtde) ? `${equipment.qtde}x ` : ""}
										{equipment.descricao}
									</p>
								</div>
								<button type="button" onClick={() => removeEquipmentInLoco(index)} className="flex items-center justify-center text-sm text-red-300 hover:text-red-500">
									<AiFillDelete />
								</button>
							</div>
						))
					) : (
						<div className="flex w-full grow items-center justify-center">
							<p className="text-center text-sm italic text-gray-500">Nenhum material adicionado aos disponíveis in loco...</p>
						</div>
					)
				) : (
					<div className="flex w-full grow items-center justify-center">
						<p className="text-center text-sm italic text-gray-500">Nenhum material adicionado aos disponíveis in loco...</p>
					</div>
				)}
			</div>
			<div className="flex w-full items-center gap-1 border-t border-gray-500 pt-1">
				<div className="grow">
					<NumberInput
						label="QTDE"
						showLabel={false}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						value={newEquipmentInLocoHolder.qtde || null}
						handleChange={(value) => setNewEquipmentInLocoHolder((prev) => ({ ...prev, qtde: value }))}
						placeholder="Preencha aqui a quantidade do equipamento..."
						width="100%"
					/>
				</div>
				<div className="grow">
					<TextInput
						label="DESCRIÇÃO"
						showLabel={false}
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						value={newEquipmentInLocoHolder.descricao}
						handleChange={(value) => setNewEquipmentInLocoHolder((prev) => ({ ...prev, descricao: value }))}
						placeholder="Preencha aqui a descrição do equipamento..."
						width="100%"
					/>
				</div>
				<div className="flex w-fit items-center justify-center p-2">
					<button
						type="button"
						onClick={() => handleAddEquipmentInLoco(newEquipmentInLocoHolder)}
						className="flex items-center justify-center rounded-full bg-green-600 p-2 text-xs text-white duration-300 ease-in-out hover:bg-green-500"
					>
						<IoMdAdd />
					</button>
				</div>
			</div>
		</div>
	);
}
