import { getRemovedEquipmentFallbacks } from "@/lib/projects/equipment";
import type { Dispatch, SetStateAction } from "react";

import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import System from "../identificador/registrosAlteracoesProjeto/secao/System";
import CheckboxInput from "../inputs/Checkbox";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";

import { Cpu } from "lucide-react";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { sortProjectProducts } from "./Utils/ProjectProductsSpreadsheet";
import ProjectEquipmentSection from "./Utils/ProjectEquipmentSection";
import ProjectServicesSpreadsheet from "./Utils/ProjectServicesSpreadsheet";
import type { TProductItem, TServiceItem } from "@/utils/schemas/crm/kits.schema";

type InfoSistemaBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
	updateLogs: TProjectUpdateLogDTO[];
	showPaymentInfo: boolean;
};
function InfoSistemaBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs = [], showPaymentInfo = false }: InfoSistemaBlockProps) {
	function applyProdutos(updater: (current: TProductItem[]) => TProductItem[]) {
		setInfo((prev) => {
			const produtos = sortProjectProducts(updater(prev.produtos ?? []));
			const removed = getRemovedEquipmentFallbacks(prev, produtos);
			setChanges((changesPrev) => ({
				...changesPrev,
				produtos,
				...Object.fromEntries(Object.entries(removed.sistema).map(([key, value]) => [`sistema.${key}`, value])),
				...Object.fromEntries(Object.entries(removed.oem).map(([key, value]) => [`oem.${key}`, value])),
			}));
			return { ...prev, produtos, sistema: { ...prev.sistema, ...removed.sistema }, oem: { ...prev.oem, ...removed.oem } };
		});
	}

	function applyLegacyInfo({ sistema, oem }: { sistema: Partial<TProjectDTO["sistema"]>; oem?: Partial<TProjectDTO["oem"]> }) {
		setInfo((prev) => ({ ...prev, sistema: { ...prev.sistema, ...sistema }, ...(oem ? { oem: { ...prev.oem, ...oem } } : {}) }));
		setChanges((prev) => ({
			...prev,
			...Object.fromEntries(Object.entries(sistema).map(([key, value]) => [`sistema.${key}`, value])),
			...Object.fromEntries(Object.entries(oem ?? {}).map(([key, value]) => [`oem.${key}`, value])),
		}));
	}

	function applyServicos(updater: (current: TServiceItem[]) => TServiceItem[]) {
		setInfo((prev) => {
			const servicos = updater(prev.servicos ?? []);
			setChanges((changesPrev) => ({ ...changesPrev, servicos }));
			return { ...prev, servicos };
		});
	}
	return (
		<div id={`project-equipment-${infoHolder._id}`} className="flex scroll-mt-4 flex-col gap-6 rounded-md border border-border pb-4">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<Cpu className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">SISTEMA E EQUIPAMENTOS</h1>
			</div>
			<UpdateLogsBlock logs={updateLogs} SectionElement={<System logs={updateLogs} />} />
			{showPaymentInfo ? (
				<div className="w-full px-2 lg:w-1/2">
					<NumberInput
						label="VALOR DO PROJETO"
						placeholder="Preencha aqui o valor do projeto..."
						editable={editor}
						value={infoHolder.sistema?.valorProjeto || 0}
						handleChange={(value) => applyLegacyInfo({ sistema: { valorProjeto: value } })}
						width="100%"
					/>
				</div>
			) : null}
			<ProjectEquipmentSection project={infoHolder} editable={editor} onProductsChange={applyProdutos} onLegacyChange={applyLegacyInfo} />

			{infoHolder.tipoDeServico === "SISTEMA FOTOVOLTAICO (OFF GRID)" && (
				<>
					<h1 className="mt-2 w-full text-center font-black text-[#fead41]">SISTEMA OFF GRID</h1>
					<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
						<div className="w-full lg:w-1/4">
							<SelectInput
								label={"TIPO DO CONTROLADOR"}
								editable={true}
								value={infoHolder.sistema.tipoControlador ? infoHolder.sistema.tipoControlador : "NÃO DEFINIDO"}
								selectedItemLabel="NÃO DEFINIDO"
								options={[
									{
										id: 1,
										label: "INTEGRADO AO INVERSOR",
										value: "INTEGRADO AO INVERSOR",
									},
									{ id: 2, label: "COMPRO EM SEPARADO", value: "SEPARADO" },
								]}
								handleChange={(value) => {
									setChanges((prev) => ({
										...prev,
										"sistema.tipoControlador": value,
									}));
									setInfo((prev) => ({
										...prev,
										sistema: {
											...prev.sistema,
											tipoControlador: value,
										},
									}));
								}}
								onReset={() => {
									setChanges((prev) => ({
										...prev,
										"sistema.tipoControlador": "",
									}));
									setInfo((prev) => ({
										...prev,
										sistema: {
											...prev.sistema,
											tipoControlador: "",
										},
									}));
								}}
								width="100%"
							/>
						</div>
						{infoHolder.sistema.tipoControlador !== "INTEGRADO AO INVERSOR" ? (
							<>
								<div className="w-full lg:w-1/4">
									<TextInput
										label={"MARCA DO CONTROLADOR"}
										value={infoHolder.sistema?.marcaControlador}
										placeholder="Preencha aqui a marca do controlador..."
										handleChange={(value) => {
											setChanges((prev) => ({
												...prev,
												"sistema.marcaControlador": value,
											}));
											setInfo((prev) => ({
												...prev,
												sistema: {
													...prev.sistema,
													marcaControlador: value,
												},
											}));
										}}
										width="100%"
									/>
								</div>
								<div className="w-full lg:w-1/4">
									<NumberInput
										label={"QTDE DE CONTROLADORES"}
										editable={true}
										value={infoHolder.sistema?.qtdeControlador || null}
										placeholder="Preencha a quantidade de controladores..."
										handleChange={(value) => {
											setChanges((prev) => ({
												...prev,
												"sistema.qtdeControlador": Number(value),
											}));
											setInfo((prev) => ({
												...prev,
												sistema: {
													...prev.sistema,
													qtdeControlador: Number(value),
												},
											}));
										}}
										width="100%"
									/>
								</div>
								<div className="w-full lg:w-1/4">
									<NumberInput
										label={"CORRENTE DE CARGA (A)"}
										editable={true}
										value={infoHolder.sistema.correnteControlador || null}
										placeholder="Preencha aqui a corrente de carga do controlador..."
										handleChange={(value) => {
											setChanges((prev) => ({
												...prev,
												"sistema.correnteControlador": Number(value),
											}));
											setInfo((prev) => ({
												...prev,
												sistema: {
													...prev.sistema,
													correnteControlador: Number(value),
												},
											}));
										}}
										width="100%"
									/>
								</div>
							</>
						) : null}
					</div>
				</>
			)}
			{infoHolder.tipoDeServico === "BOMBA SOLAR" && (
				<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<TextInput
							label={"MARCA DA BOMBA"}
							editable={editor}
							value={infoHolder.sistema.marcaBomba}
							placeholder="Preencha aqui a marca da bomba..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"sistema.marcaBomba": value,
								}));
								setInfo((prev) => ({
									...prev,
									sistema: {
										...prev.sistema,
										marcaBomba: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<NumberInput
							label={"QTDE DE BOMBAS"}
							editable={editor}
							value={infoHolder.sistema.qtdeBomba || null}
							placeholder="Preencha aqui a quantidade de bombas..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"sistema.qtdeBomba": value,
								}));
								setInfo((prev) => ({
									...prev,
									sistema: {
										...prev.sistema,
										qtdeBomba: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<NumberInput
							label={"POTÊNCIA DA BOMBA"}
							editable={editor}
							value={infoHolder.sistema.potBomba || null}
							placeholder="Preencha aqui a potência da(s) bomba(s)..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"sistema.potBomba": value,
								}));
								setInfo((prev) => ({
									...prev,
									sistema: {
										...prev.sistema,
										potBomba: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
				</div>
			)}
			{infoHolder.tipoDeServico === "BOMBA SOLAR" || infoHolder.tipoDeServico === "SISTEMA FOTOVOLTAICO (OFF GRID)" ? (
				<div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
					<div className="w-full lg:w-1/4">
						<TextInput
							label={"MARCA DA BATERIA"}
							editable={true}
							value={infoHolder.sistema.marcaBateria}
							placeholder="Preencha aqui a marca da bateria..."
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"sistema.marcaBateria": value,
								}));
								setInfo((prev) => ({
									...prev,
									sistema: {
										...prev.sistema,
										marcaBateria: value,
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<NumberInput
							label={"QTDE DE BATERIAS"}
							editable={true}
							value={infoHolder.sistema.qtdeBateria || null}
							placeholder="Preencha aqui a quantidade de baterias..."
							handleChange={(value) => {
								setChanges({
									...changes,
									"sistema.qtdeBateria": Number(value),
								});
								setInfo({
									...infoHolder,
									sistema: {
										...infoHolder.sistema,
										qtdeBateria: Number(value),
									},
								});
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<SelectInput
							label={"TIPO DA BATERIA"}
							editable={true}
							value={infoHolder.sistema.tipoBateria}
							selectedItemLabel="NÃO DEFINIDO"
							options={[
								{ id: 1, label: "LÍTIO", value: "LÍTIO" },
								{ id: 2, label: "ESTACIONÁRIA", value: "ESTACIONÁRIA" },
							]}
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"sistema.tipoBateria": value,
								}));
								setInfo((prev) => ({
									...prev,
									sistema: {
										...prev.sistema,
										tipoBateria: value,
									},
								}));
							}}
							onReset={() => {
								setChanges((prev) => ({
									...prev,
									"sistema.tipoBateria": "NÃO DEFINIDO",
								}));
								setInfo((prev) => ({
									...prev,
									sistema: {
										...prev.sistema,
										tipoBateria: "NÃO DEFINIDO",
									},
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/4">
						<NumberInput
							label={"CAPACIDADE (Ah)"}
							editable={true}
							value={infoHolder.sistema.capacidadeBateria || null}
							placeholder="Preencha aqui"
							handleChange={(value) => {
								setChanges((prev) => ({
									...prev,
									"sistema.capacidadeBateria": Number(value),
								}));
								setInfo((prev) => ({
									...prev,
									sistema: {
										...prev.sistema,
										capacidadeBateria: Number(value),
									},
								}));
							}}
							width="100%"
						/>
					</div>
				</div>
			) : null}
			<div className="flex w-full flex-col gap-2">
				<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
					<MdOutlineMiscellaneousServices className="h-4 w-4 min-h-4 min-w-4" />
					<h1 className="text-xs tracking-tight font-medium text-start w-fit">SERVIÇOS</h1>
				</div>
				<ProjectServicesSpreadsheet
					services={infoHolder.servicos ?? []}
					editable={editor}
					onAdd={(service) => applyServicos((current) => [...current, service])}
					onUpdate={(index, changes) => applyServicos((current) => current.map((item, i) => (i === index ? { ...item, ...changes } : item)))}
					onRemove={(index) => applyServicos((current) => current.filter((_, i) => i !== index))}
				/>
				<div className="my-4 flex w-full items-center justify-center self-center">
					<CheckboxInput
						labelFalse="INICIAR PROJETO"
						labelTrue="INICIAR PROJETO"
						checked={!!infoHolder.homologacao.dataLiberacao}
						handleChange={(value) => {
							setInfo((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									dataLiberacao: value ? new Date().toISOString() : null,
								},
							}));
							setChanges((prev) => ({
								...prev,
								"homologacao.dataLiberacao": value ? new Date().toISOString() : null,
							}));
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default InfoSistemaBlock;
