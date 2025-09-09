import type React from "react";
import { useState } from "react";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import SelectInput from "../../inputs/Select";

import CheckboxInput from "@/components/inputs/Checkbox";
import type { TServiceOrderDTO } from "@/utils/schemas/service-order";
import { AnimatePresence, motion } from "framer-motion";
import { BsArrowDownUp, BsFillGearFill, BsHouse } from "react-icons/bs";
import { IoMdWater } from "react-icons/io";
import { MdElectricMeter, MdOutlineSettingsInputComponent, MdOutlineWifiPassword, MdOutput, MdRoofing } from "react-icons/md";
import { TbTopologyFullHierarchy } from "react-icons/tb";
import { tiposDeEstruturas, tiposDePadrao, tiposDeTelha } from "../../../utils/constants";
import TextInput from "../../inputs/Text";
const variants = {
	hidden: {
		opacity: 0.2,
		backgroundColor: "rgba(255, 255, 255, 0.9)", // Adjust the color and alpha as needed
		transition: {
			duration: 0.5,
		},
	},
	visible: {
		opacity: 1,
		backgroundColor: "rgba(255, 255, 255, 1)", // Normal background color
		transition: {
			duration: 0.5,
		},
	},
	exit: {
		opacity: 0,
		backgroundColor: "rgba(255, 255, 255, 0.5)", // Fading background color
		transition: {
			duration: 0.01,
		},
	},
};

type DetailsModalBlockProps = {
	infoHolder: TServiceOrderDTO;
	setInfoHolder: React.Dispatch<React.SetStateAction<TServiceOrderDTO>>;
};
function DetailsModalBlock({ infoHolder, setInfoHolder }: DetailsModalBlockProps) {
	const [editEnabled, setEditEnabled] = useState(false);
	return (
		<div className="mt-4 flex w-full flex-col">
			<div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
				<h1 className="font-bold text-white">DETALHES</h1>
				<button onClick={() => setEditEnabled((prev) => !prev)}>
					{!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
				</button>
			</div>
			<AnimatePresence>
				{editEnabled ? (
					<motion.div key={"editor"} variants={variants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col gap-2">
						<div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-1/3">
								<SelectInput
									label={"TOPOLOGIA"}
									value={infoHolder.detalhes.topologia}
									options={[
										{ id: 1, label: "MICRO", value: "MICRO" },
										{ id: 2, label: "INVERSOR", value: "INVERSOR" },
									]}
									selectedItemLabel={"NÃO DEFINIDO"}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: value } }))}
									onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: "" } }))}
									width={"100%"}
								/>
							</div>
							<div className="w-full lg:w-1/3">
								<SelectInput
									label={"TIPO DE ESTRUTURA"}
									value={infoHolder.detalhes.tipoEstrutura}
									options={tiposDeEstruturas.map((structure, index) => ({ ...structure, id: index + 1 }))}
									selectedItemLabel={"NÃO DEFINIDO"}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: value } }))}
									onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: "" } }))}
									width={"100%"}
								/>
							</div>
							<div className="w-full lg:w-1/3">
								<SelectInput
									label={"TIPO DE TELHA"}
									value={infoHolder.detalhes.tipoTelha}
									options={tiposDeTelha.map((roofType, index) => ({ ...roofType, id: index + 1 }))}
									selectedItemLabel={"NÃO DEFINIDO"}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: value } }))}
									onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: "" } }))}
									width={"100%"}
								/>
							</div>
						</div>
						{infoHolder.categoria == "MANUTENÇÃO PREVENTIVA" ? (
							<div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
								<div className="w-full lg:w-1/4">
									<TextInput
										label={"PONTO DE ÁGUA"}
										placeholder={"Localização do ponto de água..."}
										value={infoHolder.detalhes.pontoAgua}
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, pontoAgua: value } }))}
										width={"100%"}
									/>
								</div>
								<div className="w-full lg:w-1/4">
									<TextInput
										label={"SENHA DO WIFI"}
										placeholder={"Senha do Wi-Fi do cliente..."}
										value={infoHolder.detalhes.senhaWifi || ""}
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, senhaWifi: value } }))}
										width={"100%"}
									/>
								</div>
								<div className="flex w-full items-center justify-center lg:w-1/4">
									<div className="w-fit">
										<CheckboxInput
											labelFalse={"CONFIGURAR"}
											labelTrue={"CONFIGURAR"}
											labelClassName="font-sans font-bold  text-primary"
											checked={!!infoHolder.detalhes.configuracaoMonitoramento}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, configuracaoMonitoramento: value } }))}
										/>
									</div>
								</div>
								<div className="flex w-full items-center justify-center lg:w-1/4">
									<div className="w-fit">
										<CheckboxInput
											labelFalse={"POSSUI TRAFO"}
											labelTrue={"POSSUI TRAFO"}
											labelClassName="font-sans font-bold  text-primary"
											checked={!!infoHolder.detalhes.possuiTrafo}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, possuiTrafo: value } }))}
										/>
									</div>
								</div>
							</div>
						) : null}
						{infoHolder.categoria == "PADRÃO" ? (
							<div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
								<div className="w-full lg:w-1/4">
									<SelectInput
										label={"ENTRADA DO PADRÃO"}
										value={infoHolder.detalhes.tipoPadrao}
										options={[
											{ id: 1, label: "AEREO", value: "AEREO" },
											{ id: 2, label: "SUBTERRANEO", value: "SUBTERRANEO" },
										]}
										selectedItemLabel={"NÃO DEFINIDO"}
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoPadrao: value } }))}
										onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoPadrao: "" } }))}
										width={"100%"}
									/>
								</div>
								<div className="w-full lg:w-1/4">
									<SelectInput
										label={"SAÍDA DO PADRÃO"}
										value={infoHolder.detalhes.tipoSaidaPadrao}
										options={[
											{ id: 1, label: "AEREO", value: "AEREO" },
											{ id: 2, label: "SUBTERRANEO", value: "SUBTERRANEO" },
										]}
										selectedItemLabel={"NÃO DEFINIDO"}
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoSaidaPadrao: value } }))}
										onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoSaidaPadrao: "N/A" } }))}
										width={"100%"}
									/>
								</div>
								<div className="flex w-full justify-center lg:w-1/4">
									<SelectInput
										label={"AMPERAGEM DO PADRÃO"}
										value={infoHolder.detalhes.amperagemPadrao}
										options={tiposDePadrao.map((type, index) => ({ ...type, id: index + 1 }))}
										selectedItemLabel={"NÃO DEFINIDO"}
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: value } }))}
										onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: "" } }))}
										width={"100%"}
									/>
								</div>
								<div className="flex w-full justify-center lg:w-1/4">
									<SelectInput
										label={"RESPONSABILIDADE DO PADRÃO"}
										value={infoHolder.detalhes.responsabilidadePadrao}
										options={[
											{ id: 1, label: "AMPERE", value: "AMPERE" },
											{ id: 2, label: "CLIENTE", value: "CLIENTE" },
											{ id: 3, label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
										]}
										selectedItemLabel={"NÃO DEFINIDO"}
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, responsabilidadePadrao: value } }))}
										onReset={() => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, responsabilidadePadrao: "NÃO SE APLICA" } }))}
										width={"100%"}
									/>
								</div>
							</div>
						) : null}
					</motion.div>
				) : (
					<motion.div key={"readOnly"} variants={variants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col gap-2">
						<div className="mt-2 flex w-full flex-col flex-wrap items-center justify-center gap-2 md:flex-row lg:gap-4">
							{infoHolder.categoria == "MANUTENÇÃO PREVENTIVA" ? (
								<div className="border-primary/60 flex flex-col rounded-md border p-3">
									<div className="flex items-center gap-2">
										<IoMdWater />
										<p className="text-primary/60 text-xs font-medium uppercase">PONTO DE ÁGUA</p>
									</div>
									<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.pontoAgua || "N/A"}</h1>
								</div>
							) : null}
							{infoHolder.categoria == "MANUTENÇÃO PREVENTIVA" ? (
								<div className="border-primary/60 flex flex-col rounded-md border p-3">
									<div className="flex items-center gap-2">
										<MdOutlineWifiPassword />
										<p className="text-primary/60 text-xs font-medium uppercase">SENHA DO WI-FI</p>
									</div>
									<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.senhaWifi || "N/A"}</h1>
								</div>
							) : null}
							{infoHolder.categoria == "MANUTENÇÃO PREVENTIVA" ? (
								<div className="border-primary/60 flex flex-col rounded-md border p-3">
									<div className="flex items-center gap-2">
										<BsFillGearFill />
										<p className="text-primary/60 text-xs font-medium uppercase">CONFIGURAR MONITORAMENTO</p>
									</div>
									<h1 className="text-primary/60 text-center text-xs font-medium uppercase">
										{infoHolder.detalhes.configuracaoMonitoramento ? "SIM" : "N/A"}
									</h1>
								</div>
							) : null}
							{infoHolder.categoria == "MANUTENÇÃO PREVENTIVA" ? (
								<div className="border-primary/60 flex flex-col rounded-md border p-3">
									<div className="flex items-center gap-2">
										<BsArrowDownUp />
										<p className="text-primary/60 text-xs font-medium uppercase">POSSUI TRAFO</p>
									</div>
									<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.possuiTrafo ? "SIM" : "N/A"}</h1>
								</div>
							) : null}

							<div className="border-primary/60 flex flex-col rounded-md border p-3">
								<div className="flex items-center gap-2">
									<BsHouse />
									<p className="text-primary/60 text-xs font-medium uppercase">TIPO ESTRUTURA</p>
								</div>
								<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.tipoEstrutura || "N/A"}</h1>
							</div>
							<div className="border-primary/60 flex flex-col rounded-md border p-3">
								<div className="flex items-center gap-2">
									<TbTopologyFullHierarchy />
									<p className="text-primary/60 text-xs font-medium uppercase">TOPOLOGIA</p>
								</div>
								<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.topologia || "N/A"}</h1>
							</div>
							<div className="border-primary/60 flex flex-col rounded-md border p-3">
								<div className="flex items-center gap-2">
									<MdRoofing />
									<p className="text-primary/60 text-xs font-medium uppercase">TIPO DE TELHA</p>
								</div>
								<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.tipoTelha || "N/A"}</h1>
							</div>
							{infoHolder.categoria == "PADRÃO" ? (
								<div className="border-primary/60 flex flex-col rounded-md border p-3">
									<div className="flex items-center gap-2">
										<MdElectricMeter />
										<p className="text-primary/60 text-xs font-medium uppercase">TIPO DE PADRÃO</p>
									</div>
									<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.tipoPadrao || "N/A"}</h1>
								</div>
							) : null}
							{infoHolder.categoria == "PADRÃO" ? (
								<div className="border-primary/60 flex flex-col rounded-md border p-3">
									<div className="flex items-center gap-2">
										<MdOutput />
										<p className="text-primary/60 text-xs font-medium uppercase">TIPO DE SAÍDA DO PADRÃO</p>
									</div>
									<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.tipoPadrao || "N/A"}</h1>
								</div>
							) : null}
							{infoHolder.categoria == "PADRÃO" ? (
								<div className="border-primary/60 flex flex-col rounded-md border p-3">
									<div className="flex items-center gap-2">
										<MdOutlineSettingsInputComponent />
										<p className="text-primary/60 text-xs font-medium uppercase">AMPERAGEM</p>
									</div>
									<h1 className="text-primary/60 text-center text-xs font-medium uppercase">{infoHolder.detalhes.amperagemPadrao || "N/A"}</h1>
								</div>
							) : null}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default DetailsModalBlock;
