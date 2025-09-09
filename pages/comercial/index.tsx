import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "../../components/providers/SessionProvider";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TCommercialProjectDTO } from "@/pages/api/projects/comercial";
import ModalComercial from "../../components/ModalComercial";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import LoadingPage from "../../components/utils/LoadingPage";

import { Button } from "@/components/ui/button";
import type { TAuthSession } from "@/lib/authentication/types";
import { FileText } from "lucide-react";
import { FaCode, FaSignature } from "react-icons/fa";
import { MdAttachMoney, MdCreate, MdOutlineAttachMoney } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import DateInput from "../../components/inputs/Date";
import MultipleSelectInput from "../../components/inputs/MultipleSelect";
import SelectInput from "../../components/inputs/Select";
import TextInput from "../../components/inputs/Text";
import ProjectCardsTags from "../../components/utils/ProjectCardsTags";
import { formatDate, formatDecimalPlaces, formatToMoney, statusLiberacao, tiposDeServico, vendedores } from "../../utils/constants";
import { useComercialProjects } from "../../utils/methods/query/comercial";
import { useTags } from "../../utils/methods/query/tags";
import { formatDateInputChange } from "../../utils/methods/shared";
import { getContractValue } from "../../utils/methods/util/projects";
import {
	HomologationControlStatus,
	PurchaseControlStatus,
	allActiveSellers,
	contractStatus,
	insiders,
	serviceTypes,
} from "../../utils/select-options";
const statusStyles = {
	ASSINADO: {
		textColor: "text-green-500",
	},
	"NÃO ASSINADO": {
		textColor: "text-red-500",
	},
	SOLICITADO: {
		textColor: "text-yellow-500",
	},
};
function getContractTagColor(status: keyof typeof statusStyles) {
	const equivalentColor = statusStyles[status];
	if (!equivalentColor) return "text-black";
	return equivalentColor;
}

function Comercial() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	console.log({ session, status });
	return <ComercialContent session={session} />;
}

export default Comercial;

function ComercialContent({ session }: { session: TAuthSession }) {
	const { data: projects, isSuccess: projectsSuccess, filters, setFilters } = useComercialProjects({ enabled: !!session?.user });
	const { data: tags } = useTags({ initialFilters: { applicableToProjects: "true" } });
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

	const [modalProject, setModalProject] = useState<{
		isOpen: boolean;
		projectId: string | null;
	}>({
		isOpen: false,
		projectId: null,
	});

	function getStats({ info }: { info: TCommercialProjectDTO[] }) {
		if (!info)
			return {
				projetos: 0,
				potencia: 0,
				vendido: 0,
				confeccionar: 0,
				assinar: 0,
				vendidoAssinar: 0,
			};

		const stats = info.reduce(
			(acc, current) => {
				acc.projectsQty += 1;
				acc.projectsTotalPower += current.sistema?.potPico || 0;
				acc.totalSoldValue += getContractValue({
					projectValue: current.sistema?.valorProjeto,
					paValue: current.padrao?.valor,
					structureValue: current.estruturaPersonalizada?.valor,
					oemValue: current.oem?.valor,
					insuranceValue: current.seguro?.valor,
				});
				if (!!current.contrato.dataSolicitacao && !current.contrato.dataLiberacao && !current.contrato.dataAssinatura) {
					acc.projectsContractsToMake += 1;
				}
				if (!!current.contrato.dataLiberacao && !current.contrato.dataAssinatura) {
					acc.projectsContractsToSign += 1;
					acc.totalToSignValue += getContractValue({
						projectValue: current.sistema?.valorProjeto,
						paValue: current.padrao?.valor,
						structureValue: current.estruturaPersonalizada?.valor,
						oemValue: current.oem?.valor,
						insuranceValue: current.seguro?.valor,
					});
				}
				return acc;
			},
			{
				projectsQty: 0,
				projectsTotalPower: 0,
				projectsContractsToMake: 0,
				projectsContractsToSign: 0,
				totalSoldValue: 0,
				totalToSignValue: 0,
			},
		);

		return {
			projetos: stats.projectsQty,
			potencia: formatDecimalPlaces(stats.projectsTotalPower, 2),
			vendido: formatToMoney(stats.totalSoldValue),
			confeccionar: stats.projectsContractsToMake,
			assinar: stats.projectsContractsToSign,
			vendidoAssinar: formatToMoney(stats.totalToSignValue),
		};
	}
	const stats = getStats({ info: projects ?? [] });

	if (projectsSuccess && projects) {
		return (
			<div className="flex flex-col gap-6 grow p-6">
				<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col items-center gap-2 lg:flex-row">
							<p className="text-center text-2xl font-black text-[#15599a] uppercase">Projetos no estágio comercial</p>
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
					<div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
						<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
							<div className="flex items-center justify-between">
								<h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
								<VscDiffAdded />
							</div>
							<div className="mt-2 flex w-full flex-col">
								<div className="text-2xl font-bold text-[#15599a]">{stats.projetos}</div>
								<p className="text-primary/60 text-xs">{stats.potencia} kWp</p>
							</div>
						</div>
						<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
							<div className="flex items-center justify-between">
								<h1 className="text-sm font-medium tracking-tight uppercase">FATURAMENTO</h1>
								<MdAttachMoney />
							</div>
							<div className="mt-2 flex w-full flex-col">
								<div className="text-2xl font-bold text-[#15599a]">{stats.vendido} </div>
							</div>
						</div>
						<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
							<div className="flex items-center justify-between">
								<h1 className="text-sm font-medium tracking-tight uppercase">EM CONFECÇÃO</h1>
								<MdCreate />
							</div>
							<div className="mt-2 flex w-full flex-col">
								<div className="text-2xl font-bold text-[#15599a]">{stats.confeccionar}</div>
							</div>
						</div>
						<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
							<div className="flex items-center justify-between">
								<h1 className="text-sm font-medium tracking-tight uppercase">PARA ASSINAR</h1>
								<FaSignature />
							</div>
							<div className="mt-2 flex w-full flex-col">
								<div className="text-2xl font-bold text-[#15599a]">{stats.assinar}</div>
								<p className="text-primary/60 text-xs">{stats.vendidoAssinar} para assinar</p>
							</div>
						</div>
					</div>
					<AnimatePresence>
						{dropdownMenuVisible ? (
							<motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
								<div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
									<TextInput
										label={"NOME DO CONTRATO"}
										value={filters.search}
										placeholder={"Digite o nome do contrato..."}
										handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
									/>
									<TextInput
										label={"CÓDIGO CRM"}
										value={filters.identifier || ""}
										placeholder={"Digite o código CRM do projeto..."}
										handleChange={(value) => setFilters((prev) => ({ ...prev, identifier: value }))}
									/>
									<div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
										<div className="flex items-center justify-center gap-x-2">
											<div className="w-full lg:w-[250px]">
												<DateInput
													width={"100%"}
													label={"DEPOIS DE"}
													value={filters.date.after ? formatDate(filters.date.after) : undefined}
													handleChange={(value) =>
														setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) as string | null } }))
													}
												/>
											</div>
											<div className="w-full lg:w-[250px]">
												<DateInput
													width={"100%"}
													label={"ANTES DE"}
													value={filters.date.before ? formatDate(filters.date.before) : undefined}
													handleChange={(value) =>
														setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) as string | null } }))
													}
												/>
											</div>
										</div>
										<div className="w-full lg:w-[250px]">
											<SelectInput
												width={"100%"}
												label={"CAMPO DE FILTRO"}
												value={filters.date.field || null}
												options={[
													{
														id: 1,
														label: "DATA DA LIBERAÇÃO",
														value: "contrato.dataLiberacao",
													},
													{
														id: 2,
														label: "DATA ASS.CONTRATO",
														value: "contrato.dataAssinatura",
													},
													{
														id: 3,
														label: "DATA PAG.KIT",
														value: "compra.dataPagamento",
													},
												]}
												selectedItemLabel={"SEM FILTRO"}
												handleChange={(value) =>
													setFilters((prev) => ({
														...prev,
														date: {
															...prev.date,
															field: value,
														},
													}))
												}
												onReset={() =>
													setFilters((prev) => ({
														...prev,
														date: {
															after: null,
															before: null,
															field: null,
														},
													}))
												}
											/>
										</div>
									</div>
									<div className="w-full lg:w-[250px]">
										<MultipleSelectInput
											width={"100%"}
											label={"TIPO DE SERVIÇO"}
											selected={filters.serviceType}
											options={serviceTypes}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													serviceType: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													serviceType: [],
												}))
											}
										/>
									</div>
									<div className="w-full lg:w-[250px]">
										<MultipleSelectInput
											width={"100%"}
											label={"ETIQUETAS"}
											selected={filters.tagIds}
											options={tags?.map((t) => ({ id: t._id, value: t._id, label: t.titulo })) || []}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													tagIds: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													tagIds: [],
												}))
											}
										/>
									</div>
								</div>
								<div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
									<div className="w-full lg:w-[250px]">
										<MultipleSelectInput
											width={"100%"}
											label={"STATUS DO CONTRATO"}
											selected={filters.contractStatus}
											options={contractStatus}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													contractStatus: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													contractStatus: [],
												}))
											}
										/>
									</div>
									<div className="w-full lg:w-[250px]">
										<MultipleSelectInput
											width={"100%"}
											label={"VENDEDOR"}
											selected={filters.sellerName}
											options={allActiveSellers}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													sellerName: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													sellerName: [],
												}))
											}
										/>
									</div>
									<div className="w-full lg:w-[250px]">
										<MultipleSelectInput
											width={"100%"}
											label={"INSIDER"}
											selected={filters.insiderName}
											options={insiders}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													insiderName: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													insiderName: [],
												}))
											}
										/>
									</div>
									<div className="w-full lg:w-[250px]">
										<MultipleSelectInput
											width={"100%"}
											label={"STATUS DE SUPLEMENTAÇÃO"}
											selected={filters.supplyStatus}
											options={PurchaseControlStatus}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													supplyStatus: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													supplyStatus: [],
												}))
											}
										/>
									</div>
									<div className="w-full lg:w-[250px]">
										<MultipleSelectInput
											width={"100%"}
											label={"STATUS DO PARECER"}
											selected={filters.grantingStatus}
											options={HomologationControlStatus}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													grantingStatus: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													grantingStatus: [],
												}))
											}
										/>
									</div>
								</div>
								<div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
									<button
										type="button"
										onClick={() =>
											setFilters((prev) => ({
												...prev,
												pendingSupplyLiberation: !filters.pendingSupplyLiberation,
											}))
										}
										className={`${
											filters.pendingSupplyLiberation ? "bg-[#15599a]" : "bg-blue-300"
										} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
									>
										LIBERAÇÃO DE COMPRA PENDENTE
									</button>
									<button
										type="button"
										onClick={() =>
											setFilters((prev) => ({
												...prev,
												signaturePendency: !filters.signaturePendency,
											}))
										}
										className={`${filters.signaturePendency ? "bg-[#15599a]" : "bg-blue-300"} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
									>
										ASSINATURA PENDENTE
									</button>
									<button
										type="button"
										onClick={() =>
											setFilters((prev) => ({
												...prev,
												noAnalysisVinculation: !filters.noAnalysisVinculation,
											}))
										}
										className={`${filters.noAnalysisVinculation ? "bg-[#15599a]" : "bg-blue-300"} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
									>
										SEM VINCULAÇÃO DE ANÁLISE TÉCNICA
									</button>
									<button
										type="button"
										onClick={() =>
											setFilters((prev) => ({
												...prev,
												noCRMVinculation: !filters.noCRMVinculation,
											}))
										}
										className={`${filters.noCRMVinculation ? "bg-[#15599a]" : "bg-blue-300"} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 font-bold text-white`}
									>
										SEM VINCULAÇÃO DE PROJETO CRM
									</button>
								</div>
								<div className="flex items-center justify-between gap-x-2">
									<Link href="/comercial/analise">
										<div className="rounded border border-[#fead61] p-1 font-medium text-[#fead61]">ANALÍTICO</div>
									</Link>
									{/* <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterProjects} /> */}
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>
				<div className="w-full flex items-center justify-end">
					<Link href={"/comercial/solicitacoes-contrato"} className="flex items-center gap-1 transition-colors hover:text-cyan-500">
						<FileText className="h-4 w-4" />
						<p className="text-xs">FORMULÁRIOS</p>
					</Link>
				</div>
				<div className="mt-4 flex flex-wrap justify-around gap-3">
					{projects.map((project, index) => (
						<motion.div
							onClick={() => {
								setModalProject({ isOpen: true, projectId: project._id });
							}}
							initial={{ opacity: 0, translateX: -50 }}
							animate={{ opacity: 1, translateX: 0 }}
							transition={{ duration: 0.3, delay: 0.01 * index }}
							key={project._id}
							className="border-primary/20 dark:hover:bg-primary/10 w-full cursor-pointer border hover:bg-blue-100 md:w-[350px] lg:w-[450px]"
						>
							<TagTipoDeServico tipoDeServico={project.tipoDeServico} />
							<div className="flex flex-col p-2 pb-3">
								<div className="flex items-center justify-between">
									<p className="text-primary/70 text-xs font-bold">{project.nomeDoContrato}</p>
									<p className="text-xs font-bold text-[#15599a]">#{project.qtde}</p>
								</div>
								<ProjectCardsTags projectTags={project.etiquetas} />
								<div className="mt-2 flex items-center justify-between">
									<div className="flex flex-col items-start">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">CONTRATO</span>
										<p className={`text-xs font-medium ${getContractTagColor(project.contrato.status as keyof typeof statusStyles)}`}>
											{project.contrato?.status && project.contrato?.status}
										</p>
									</div>
									<div className="flex flex-col items-end">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">VENDEDOR</span>
										<p className="text-xs font-medium tracking-tight text-[#15599a]">{project.vendedor?.nome}</p>
									</div>
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="flex flex-col items-start">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">FORMA DE PAGAMENTO</span>
										<p className="text-xs font-medium tracking-tight">{project.pagamento?.forma && project.pagamento.forma}</p>
									</div>
									<div className="flex flex-col items-end">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">VALOR TOTAL</span>
										<p className="text-xs font-medium tracking-tight text-green-500">
											{formatToMoney(
												getContractValue({
													projectValue: project.sistema.valorProjeto,
													paValue: project.padrao.valor,
													structureValue: project.estruturaPersonalizada.valor,
												}),
											)}
										</p>
									</div>
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="flex flex-col items-start">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">STATUS DO PARECER</span>
										<p className="text-xs font-medium tracking-tight text-green-500">
											{project.homologacao?.acesso.dataResposta ? "LIBERADO" : "NÃO LIBERADO"}
										</p>
									</div>
									<div className="flex flex-col items-end">
										<span className="text-primary/60 text-[0.6rem] leading-none tracking-tight">STATUS DA COMPRA</span>
										<p className="text-xs font-medium tracking-tight">{project.compra.liberacao ? project.compra.status || "NÃO DEFINIDO" : "NÃO LIBERADA"}</p>
									</div>
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										{project.idProjetoCRM ? <FaCode color={"rgb(34,197,94)"} /> : null}
										<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">
											IDENTIFICADOR: <strong>{project.codigoSVB}</strong>
										</h1>
									</div>
									{project.idVisitaTecnica ? (
										<div className="flex items-center gap-2">
											{project.idVisitaTecnica ? <FaCode color={"rgb(34,197,94)"} /> : null}
											<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">VISITA VINCULADA</h1>
										</div>
									) : (
										<h1 className="text-primary/60 text-[0.6rem] leading-none tracking-tight">SEM VISITA VINCULADA</h1>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</div>
				{modalProject.isOpen && modalProject.projectId ? (
					<ModalComercial session={session} projectId={modalProject.projectId} closeModal={() => setModalProject({ isOpen: false, projectId: null })} />
				) : null}
			</div>
		);
	}
}
