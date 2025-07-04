import { updateProject } from "@/utils/methods/mutation/clients";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MdOutlineMiscellaneousServices, MdSync } from "react-icons/md";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { FaBolt, FaIndustry, FaUser, FaUserAlt } from "react-icons/fa";
import { BsCalendar, BsCalendarCheck, BsCalendarEvent, BsPersonVcard } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineSafety } from "react-icons/ai";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import { TbReportAnalytics } from "react-icons/tb";
import Avatar from "@/components/utils/Avatar";
import { useTechnicalAnalysisById } from "@/utils/methods/query/technical-analysis";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import TechnicalAnalysisFiles from "@/components/identificador/analisesTecnicas/TechnicalAnalysisFiles";

type ServiceOrderProjectInformationBlockProps = {
	project: TServiceOrderProject;
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
};
function ServiceOrderProjectInformationBlock({ project, infoHolder, updateInfoHolder }: ServiceOrderProjectInformationBlockProps) {
	const [technicalAnalysisBlockIsOpen, setTechnicalAnalysisBlockIsOpen] = useState<boolean>(false);

	async function handleUpdateProject() {
		try {
			const changes = {
				"obra.entrada": !project.obra.entrada ? infoHolder.periodo.inicio : project.obra.entrada,
				"obra.saida": !project.obra.saida ? infoHolder.periodo.fim : project.obra.saida,
				"obra.statusDaObra": !project.obra.statusDaObra ? infoHolder.status : project.obra.statusDaObra,
				"obra.equipeResp": !project.obra.equipeResp ? infoHolder.responsavel.nome : project.obra.equipeResp,
				"obra.observacoes": infoHolder.observacoes.join("/"),
			};
			await updateProject({ id: project._id, changes });
			return "Dados sincronizados com sucesso !";
		} catch (error) {
			console.log("ERROR", error);
			throw error;
		}
	}
	const { mutate, isPending } = useMutation({
		mutationKey: ["sync-project-data", project._id],
		mutationFn: handleUpdateProject,
		onSuccess: () => toast.success("Dados sincronizados no projeto."),
	});
	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DO PROJETO</h1>
			<div className="flex w-full items-center justify-center">
				{project.idOrdemServico ? (
					<button
						type="button"
						disabled={isPending}
						onClick={() => mutate()}
						className={cn(
							"flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-white duration-300 ease-in-out  disabled:bg-gray-500 hover:bg-blue-700 disabled:hover:bg-gray-500",
						)}
					>
						<MdSync />
						<h1 className="text-xs font-medium tracking-tight">SINCRONIZAR DADOS NO PROJETO</h1>
					</button>
				) : null}
			</div>
			<div className="flex w-full grow flex-col gap-2">
				<h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">GERAIS</h1>
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-[0.65rem] font-medium text-gray-500">PROJETO</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<FaUserAlt />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">{project.nomeDoContrato}</p>
							</div>

							<div className="flex items-center gap-1">
								<BsPersonVcard />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.cpf_cnpj}</p>
							</div>

							<div className="flex items-center gap-1">
								<FaLocationDot />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">
									{formatLocation({
										location: {
											uf: project.uf || "",
											cidade: project.cidade || "",
											cep: project.cep?.toString() || "",
											bairro: project.bairro,
											endereco: project.logradouro,
											numeroOuIdentificador: project.numeroResidencia?.toString() || "",
											complemento: null,
											latitude: null,
											longitude: null,
										},
										includeCity: true,
										includeUf: true,
									})}
								</p>
							</div>
							<div className="flex items-center gap-1">
								<FaUser />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">VENDIDO POR: {project.vendedor?.nome || "N/A"}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-[0.65rem] font-medium text-gray-500">COMPRA</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<BsCalendarEvent />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">
									{project.compra.previsaoEntrega ? `ENTREGA PREVISTA P/ ${formatDateAsLocale(project.compra.previsaoEntrega)}` : "ENTREGA SEM PREVISÃO DEFINIDA"}
								</p>
							</div>
							<div className="flex items-center gap-1">
								<BsCalendarCheck />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">
									{project.compra.dataEntrega ? `ENTREGA REALIZADA EM: ${formatDateAsLocale(project.compra.dataEntrega)}` : "ENTREGA NÃO REALIZADA"}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-[0.65rem] font-medium text-gray-500">HOMOLOGAÇÃO</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<BsCalendar />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">
									{project.homologacao?.acesso?.dataResposta ? `PARECER LIBERADO EM: ${formatDateAsLocale(project.homologacao.acesso.dataResposta)}` : "SEM PARECER DE ACESSO"}
								</p>
							</div>
							<div className="flex items-center gap-1">
								<BsCalendar />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">
									{project.homologacao?.vistoria?.dataEfetivacao ? `VISTORIA REALIZADA EM: ${formatDateAsLocale(project.homologacao.vistoria.dataEfetivacao)}` : "VISTORIA NÃO REALIZADA"}
								</p>
							</div>
						</div>
					</div>
				</div>
				<h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">PRODUTOS</h1>
				<div className="flex w-full flex-wrap items-center gap-2">
					{project.produtos && project.produtos.length > 0 ? (
						project.produtos.map((product) => (
							<div key={product.id} className="flex w-full flex-col gap-1 rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212]">
								<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
									<div className="flex w-full items-center gap-1 lg:grow">
										<div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 dark:border-[#fff]">
											{renderProductCategoryIcon(product.categoria, 15)}
										</div>
										<p className="text-sm font-bold leading-none tracking-tight">
											<strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
										</p>
									</div>
									<div className="flex w-full items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
										<div className="flex items-center gap-1">
											<FaIndustry size={12} />
											<p className="text-[0.6rem] font-light text-gray-500 lg:text-xs">{product.fabricante}</p>
										</div>
										{product.potencia ? (
											<div className="flex items-center gap-1">
												<FaBolt size={12} />
												<p className="text-[0.6rem] font-light text-gray-500 lg:text-xs">{product.potencia} W</p>
											</div>
										) : null}
										<div className="flex items-center gap-1">
											<AiOutlineSafety size={12} />
											<p className="text-[0.6rem] font-light text-gray-500 lg:text-xs">{product.garantia} ANOS</p>
										</div>
									</div>
								</div>
								<div className="flex w-full items-center justify-end">
									{/* <button
                onClick={() =>
                addProductToComposition({
                categoria: product.categoria,
                descricao: `${product.fabricante} - ${product.modelo}`,
                qtde: product.qtde,
                unidade: 'UN',
                valor: 0,
                })
                }
                className="flex items-center gap-1 rounded-lg border border-[#fead41] px-2  py-1 text-[0.6rem] font-medium text-[#fead41] hover:bg-[#fead41] hover:text-black"
                >
                <IoMdAdd width={10} height={10} />
                <p>ADICIONAR À COMPOSIÇÃO</p>
                </button> */}
								</div>
							</div>
						))
					) : (
						<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum produto adicionado</div>
					)}
				</div>
				<h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">SERVIÇOS</h1>
				<div className="flex w-full flex-col items-center gap-2">
					{project.servicos && project.servicos.length > 0 ? (
						project.servicos.map((service) => (
							<div key={service.id} className="flex w-full flex-col gap-1 rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212]">
								<div className="flex w-full items-center justify-between gap-2">
									<div className="flex  items-center gap-1">
										<div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 dark:border-[#fff]">
											<MdOutlineMiscellaneousServices />
										</div>
										<p className="text-sm font-bold leading-none tracking-tight">{service.descricao}</p>
									</div>
									<div className="flex items-center gap-1">
										<AiOutlineSafety size={12} />
										<p className="text-[0.6rem] font-light text-primary/50 lg:text-xs">
											{service.garantia} {service.garantia && service.garantia > 0 ? "ANOS" : "ANO"}
										</p>
									</div>
								</div>
								<div className="flex w-full items-center justify-center">
									<div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
										<h1 className="text-[0.6rem] font-medium">{service.observacoes || "OBSERVAÇÕES NÃO DEFINIDAS"}</h1>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum serviço adicionado</div>
					)}
				</div>
				<h1 className="w-full bg-gray-500 p-1 text-center text-xs font-medium text-white">DADOS DA OBRA</h1>
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-[0.65rem] font-medium text-gray-500">EXECUÇÃO</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<FaUserAlt />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">{project?.obra.equipeResp}</p>
							</div>
							<div className="flex items-center gap-1">
								<BsCalendar />
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">
									{project?.obra.entrada ? `${formatDateAsLocale(project?.obra.entrada, true)} - ${project?.obra.saida ? formatDateAsLocale(project?.obra.saida, true) : "N/A"}` : "N/A"}
								</p>
							</div>
							<h1 className="rounded-md bg-primary px-2 py-0.5 text-[0.5rem] font-medium leading-none tracking-tight text-white">{project?.obra.statusDaObra}</h1>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 lg:items-end">
						<p className="text-[0.65rem] font-medium text-gray-500">PENDÊNCIAS</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-end">
							{project.obra.pendencias ? (
								<h1 className="rounded-md bg-orange-500 px-2 py-0.5 text-[0.5rem] font-medium leading-none tracking-tight text-white">{project?.obra.pendencias}</h1>
							) : (
								<p className="text-[0.6rem] font-medium leading-none tracking-tight">N/A</p>
							)}
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
					<div className="flex w-full flex-col lg:w-1/2">
						<h1 className="w-full text-center text-[0.6rem] font-medium tracking-tight text-primary lg:text-start">OBSERVAÇÕES GERAIS SOBRE A OBRA</h1>
						<div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
							<h1 className="whitespace-pre-wrap text-[0.6rem] font-medium">{project.obra.observacoes || "OBSERVAÇÕES DA OBRA NÃO DEFINIDAS"}</h1>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServiceOrderProjectInformationBlock;
