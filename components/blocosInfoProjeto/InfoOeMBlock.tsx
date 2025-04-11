import React, { useState } from "react";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import DateInput from "../inputs/Date";
import { formatDate, oemPlans, statusObra } from "../../utils/constants";
import { TProjectDTO } from "@/utils/schemas/projects";
import CheckboxInput from "../inputs/Checkbox";
import { VscChromeClose } from "react-icons/vsc";
import { MdAdd } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import NewMaintenanceMenu from "./Utils/NewMaintenanceMenu";
import MaintenanceCard from "./Utils/MaintenanceCard";
import toast from "react-hot-toast";
import { ServiceOrderStatus } from "@/utils/select-options";
import CheckboxWithDate from "../inputs/CheckboxWithDate";
import { formatDateInputChange } from "@/utils/methods/shared";
import dayjs from "dayjs";

type InfoOeMBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function InfoOeMBlock({ editor, infoHolder, setInfo, changes, setChanges }: InfoOeMBlockProps) {
	const [newMaintenanceMenuIsOpen, setNewMaintenanceMenuIsOpen] = useState<boolean>(false);
	function removeMaintenance(index: number) {
		const maintenances = [...infoHolder.manutencoes];
		maintenances.splice(index, 1);
		setInfo((prev) => ({ ...prev, manutencoes: maintenances }));
		setChanges((prev) => ({ ...prev, manutencoes: maintenances }));
		return toast.success("Manutenção removida !", { duration: 500 });
	}
	function updateMaintenance({ info, index }: { info: TProjectDTO["manutencoes"][number]; index: number }) {
		const maintenances = [...infoHolder.manutencoes];
		maintenances[index] = info;
		setInfo((prev) => ({ ...prev, manutencoes: maintenances }));
		setChanges((prev) => ({ ...prev, manutencoes: maintenances }));
		return toast.success("Manutenção atualizada !", { duration: 500 });
	}
	return (
		<div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
			<span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">OPERAÇÃO E MANUTENÇÃO</span>
			<div className="mt-2 flex w-full items-center justify-center">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="POSSUI O&M?"
						labelTrue="POSSUI O&M?"
						checked={!!infoHolder.oem?.aplicavel}
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, oem: { ...(prev.oem || {}), aplicavel: value } }));
							setChanges((prev) => ({ ...prev, "oem.aplicavel": value }));
						}}
					/>
				</div>
			</div>
			<div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="PLANO DE O&M"
						value={infoHolder.oem?.plano}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => {
							setChanges({ ...changes, "oem.plano": value });
							setInfo({
								...infoHolder,
								oem: {
									...infoHolder.oem,
									plano: value,
								},
							});
						}}
						options={oemPlans.map((p, index) => ({ id: index + 1, label: p.label, value: p.value }))}
						onReset={() => {
							setChanges({ ...changes, "oem.plano": "NÃO SE APLICA" });
							setInfo({
								...infoHolder,
								oem: {
									...infoHolder.oem,
									plano: "NÃO SE APLICA",
								},
							});
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label={"Nº DE MANUTENÇÕES"}
						placeholder="Preencha o número de manutenções..."
						value={infoHolder.oem?.qtdeManutencoes ? infoHolder.oem?.qtdeManutencoes : 0}
						editable={editor}
						handleChange={(value) => {
							setChanges({
								...changes,
								"oem.qtdeManutencoes": Number(value),
							});
							setInfo({
								...infoHolder,
								oem: {
									...infoHolder.oem,
									qtdeManutencoes: Number(value),
								},
							});
						}}
						width="100%"
					/>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<DateInput
							label="INÍCIO DO PLANO (SE APLICÁVEL)"
							value={formatDate(infoHolder.oem.dataInicio)}
							handleChange={(value) => {
								setInfo((prev) => ({
									...prev,
									oem: {
										...prev.oem,
										dataInicio: formatDateInputChange(value),
										duracao: Math.round(dayjs(formatDateInputChange(prev.oem?.dataFim)).diff(formatDateInputChange(value), "days") / 365),
									},
								}));
								setChanges((prev) => ({
									...prev,
									"oem.dataInicio": formatDateInputChange(value),
									"oem.duracao": Math.round(dayjs(formatDateInputChange(prev.oem?.dataFim)).diff(formatDateInputChange(value), "days") / 365),
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<DateInput
							label="FIM DO PLANO (SE APLICÁVEL)"
							value={formatDate(infoHolder.oem.dataFim)}
							handleChange={(value) => {
								setInfo((prev) => ({
									...prev,
									oem: {
										...prev.oem,
										dataFim: formatDateInputChange(value),
										duracao: Math.round(dayjs(formatDateInputChange(value)).diff(prev.oem?.dataInicio, "days") / 365), //   dayjs(formatDateInputChange(value)).diff(prev.oem.dataInicio),
									},
								}));
								setChanges((prev) => ({
									...prev,
									"oem.dataFim": formatDateInputChange(value),
									"oem.duracao": Math.round(dayjs(formatDateInputChange(value)).diff(prev.oem?.dataInicio, "days") / 365),
								}));
							}}
							width="100%"
						/>
					</div>
				</div>
			</div>
			<h1 className="mt-2 w-full text-center font-black text-[#fead41]">MANUTENÇÕES</h1>
			<div className="flex w-full items-center justify-end p-2">
				{newMaintenanceMenuIsOpen ? (
					<button>
						<button
							onClick={() => setNewMaintenanceMenuIsOpen(false)}
							className="flex items-center gap-1 rounded-lg border border-red-500 bg-red-50 px-2 py-1 text-xs text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
						>
							<VscChromeClose />
							<p className="font-medium">FECHAR MENU</p>
						</button>
					</button>
				) : (
					<button
						onClick={() => setNewMaintenanceMenuIsOpen(true)}
						className="flex items-center gap-1 rounded-lg border border-cyan-500 bg-cyan-50 px-2 py-1 text-xs text-cyan-500 duration-300 ease-in-out hover:border-cyan-700 hover:text-cyan-700"
					>
						<MdAdd />
						<p className="font-medium">NOVA MANUTENÇÃO</p>
					</button>
				)}
			</div>
			<AnimatePresence>{newMaintenanceMenuIsOpen ? <NewMaintenanceMenu infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} /> : null}</AnimatePresence>
			<div className="mt-2 flex w-full items-start justify-around gap-4">
				{infoHolder.manutencoes.length > 0 ? (
					infoHolder.manutencoes.map((maintenance, index) => (
						<MaintenanceCard key={index} maintenance={maintenance} handleRemove={() => removeMaintenance(index)} handleUpdate={(info) => updateMaintenance({ info, index })} />
					))
				) : (
					<p className="text-sm font-medium italic tracking-tight text-gray-500">Não há registros de manutenção.</p>
				)}
			</div>
			<div className="mt-2 w-full self-center lg:w-1/4">
				<SelectInput
					label={"STATUS DE EXECUÇÃO"}
					value={infoHolder.obra?.statusDaObra}
					selectedItemLabel="NÃO DEFINIDO"
					editable={editor}
					options={ServiceOrderStatus}
					handleChange={(value) => {
						setChanges((prev) => ({
							...prev,
							"obra.statusDaObra": value,
						}));
						setInfo((prev) => ({
							...prev,
							obra: {
								...prev.obra,
								statusDaObra: value,
							},
						}));
					}}
					onReset={() => {
						setChanges((prev) => ({
							...prev,
							"obra.statusDaObra": null,
						}));
						setInfo((prev) => ({
							...prev,
							obra: {
								...prev.obra,
								statusDaObra: null,
							},
						}));
					}}
					width="100%"
				/>
			</div>
			<div className="my-2 flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="EXECUÇÃO INICIADA"
						labelTrue="EXECUÇÃO INICIADA"
						date={infoHolder.obra.entrada || null}
						handleChange={(value) => {
							setInfo((prev) => ({ ...prev, obra: { ...prev.obra, entrada: value } }));
							setChanges((prev) => ({ ...prev, "obra.entrada": value }));
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="EXECUÇÃO FINALIZADA"
						labelTrue="EXECUÇÃO FINALIZADA"
						date={infoHolder.obra.saida || null}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								obra: { ...prev.obra, saida: value, statusDaObra: value ? "CONCLUIDA" : prev.obra.statusDaObra },
							}));
							setChanges((prev) => ({ ...prev, "obra.saida": value, "obra.statusDaObra": value ? "CONCLUIDA" : prev.obra.statusDaObra }));
						}}
					/>
				</div>
			</div>
			<div className="mt-2 flex w-full items-center justify-center">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="O&M CONCLUÍDO"
						labelTrue="O&M CONCLUÍDO"
						checked={!!infoHolder.oem?.oemConcluido}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								oem: { ...(prev.oem || {}), oemConcluido: value },
								obra: {
									...prev.obra,
									entrada: prev.obra.entrada ? prev.obra.entrada : !!value ? new Date().toISOString() : prev.obra.entrada,
									saida: prev.obra.saida ? prev.obra.saida : !!value ? new Date().toISOString() : prev.obra.saida,
									statusDaObra: !!value ? "CONCLUIDA" : prev.obra.statusDaObra,
								},
							}));
							setChanges((prev) => ({
								...prev,
								"oem.oemConcluido": value,
								"obra.entrada": infoHolder.obra.entrada ? infoHolder.obra.entrada : !!value ? new Date().toISOString() : infoHolder.obra.entrada,
								"obra.saida": infoHolder.obra.saida ? infoHolder.obra.saida : !!value ? new Date().toISOString() : infoHolder.obra.saida,
								"obra.status": !!value ? "CONCLUIDA" : infoHolder.obra.statusDaObra,
							}));
						}}
					/>
				</div>
			</div>
			{/* <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
              <DateInput
                label={'MANUTENÇÃO PREVENTIVA'}
                editable={editor}
                value={
                  infoHolder.manutencaoPreventiva?.data != undefined && infoHolder.manutencaoPreventiva.data != '-'
                    ? new Date(infoHolder.manutencaoPreventiva.data).toISOString().slice(0, 10)
                    : 0
                }
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    'manutencaoPreventiva.data': isNaN(value) ? new Date(value).toISOString() : null,
                    'manutencaoPreventiva.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                  })
                  setInfo({
                    ...infoHolder,
                    manutencaoPreventiva: {
                      ...infoHolder.manutencaoPreventiva,
                      data: isNaN(value) ? new Date(value).toISOString() : null,
                      status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                    },
                  })
                }}
              />
              <div className="flex w-[350px] flex-col items-center">
                <span className="text-center font-raleway text-sm font-bold uppercase">O&M CONCLUÍDO ?</span>
                <div className="flex">
                  <input
                    disabled={!editor}
                    checked={infoHolder.oem?.oemConcluido == true ? true : false}
                    onChange={(e) => {
                      setChanges({
                        ...changes,
                        'oem.oemConcluido': e.target.checked,
                        'obra.statusDaObra': 'CONCLUIDA',
                      })
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          statusDaObra: 'CONCLUIDA',
                        },
                        oem: {
                          ...infoHolder.oem,
                          oemConcluido: e.target.checked,
                        },
                      })
                    }}
                    type="checkbox"
                    name="oemConcluido"
                    id="oemConcluido"
                  />
                  <label className="ml-2" htmlFor="oemConcluido">
                    {infoHolder.oem?.oemConcluido ? 'SIM' : 'NÃO'}
                  </label>
                </div>
              </div>
              <SelectInput
                label={'STATUS DA OBRA'}
                value={infoHolder.obra?.statusDaObra ? infoHolder.obra?.statusDaObra : 'NÃO DEFINIDO'}
                editable={editor}
                options={statusObra.map((status) => status)}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    'obra.statusDaObra': value,
                  })
                  setInfo({
                    ...infoHolder,
                    obra: {
                      ...infoHolder.obra,
                      statusDaObra: value,
                    },
                  })
                }}
              />
             </div> */}
		</div>
	);
}

export default InfoOeMBlock;
