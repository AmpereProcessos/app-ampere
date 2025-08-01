import type { TEnergyPAExecution, TEnergyPAExecutionWithFiltersOutput } from "@/pages/api/gestao-obras/padroes";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import type { TLocation } from "@/utils/schemas/useful";
import React from "react";
import { BsCalendarCheck, BsCode } from "react-icons/bs";
import { FaCircle, FaPiggyBank } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdAssistantPhoto, MdDashboard, MdSettingsInputComponent } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/utils/methods/mutation/clients";
import CheckboxWithDate from "@/components/inputs/CheckboxWithDate";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { formatDateInputChange } from "@/utils/methods/shared";
import { cn } from "@/lib/utils";
import { getServiceTypeTagColor } from "@/components/TagTipoDeServico";
import { AlertCircle, BadgeCheck, Banknote, Cable, Contact, Signature, User } from "lucide-react";

type PAAdequationProjectCardProps = {
	project: TEnergyPAExecutionWithFiltersOutput["data"]["projects"][number];
};
function PAAdequationProjectCard({ project }: PAAdequationProjectCardProps) {
	const queryClient = useQueryClient();
	const location: TLocation = {
		cep: project.cep?.toString(),
		uf: project.uf,
		cidade: project.cidade,
		bairro: project.bairro,
		endereco: project.logradouro,
		numeroOuIdentificador: project.numeroResidencia?.toString(),
	};

	async function updatePAAdequationExecutionDate(date: string | null) {
		try {
			await updateProject({ id: project._id, changes: { "padrao.aumentoCarga.dataEfetivacao": date } });

			return "Projeto atualizado com sucesso !";
		} catch (error) {
			throw error;
		}
	}
	function getEnergyPAExecutionStatusFlag(project: TEnergyPAExecution) {
		return (
			<h1
				className={cn("min-w-fit rounded-lg px-2 py-0.5 text-[0.5rem] text-white", {
					"bg-green-500": project.padrao.aumentoCarga.dataEfetivacao,
					"bg-orange-600": !project.padrao.aumentoCarga.dataEfetivacao,
				})}
			>
				{project.padrao.aumentoCarga.dataEfetivacao ? "CONCLUÍDO" : "PENDENTE"}
			</h1>
		);
	}
	const { mutate: handleUpdate, isPending } = useMutationWithFeedback({
		mutationKey: ["update-project", project._id],
		mutationFn: updatePAAdequationExecutionDate,
		affectedQueryKey: ["pa-execution-projects"],
		queryClient: queryClient,
	});
	return (
		<div className="flex w-full flex-col gap-4 rounded border border-gray-300 bg-[#fff] p-3 font-[Inter]">
			<div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<div className="flex items-center gap-1 text-center text-xs font-bold italic text-primary/80">
							<MdDashboard className="w-3 h-3 min-w-3 min-h-3" />
							<p className="text-xs">{project.qtde}</p>
						</div>
						<h1 className="text-sm font-black leading-none tracking-tight">{project.nomeDoContrato}</h1>
					</div>
					<div className={cn("flex items-center gap-1 self-center rounded-lg px-2 py-1", getServiceTypeTagColor(project.tipoDeServico || ""))}>
						<MdDashboard className="w-3 h-3 min-w-3 min-h-3" />
						<h1 className="text-[0.5rem] font-medium">{project.tipoDeServico}</h1>
					</div>
					<div className="flex items-center gap-1">
						<FaLocationDot />
						<p className="text-[0.65rem] font-medium italic text-primary/80">{formatLocation({ location, includeUf: true, includeCity: true })}</p>
					</div>
				</div>
				{getEnergyPAExecutionStatusFlag(project)}
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">HOMOLOGAÇÃO</h1>
					<div
						className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {
							"bg-orange-100 text-orange-700": project.homologacao.status !== "APROVADO",
							"bg-green-100 text-green-700": project.homologacao.status === "APROVADO",
						})}
					>
						<BadgeCheck className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.6rem]")}>PARECER DE ACESSO: {project.homologacao.status}</p>
					</div>
					<div
						className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {
							"bg-orange-100 text-orange-700": !project.homologacao.documentacao.dataConclusaoElaboracao,
							"bg-green-100 text-green-700": project.homologacao.documentacao.dataConclusaoElaboracao,
						})}
					>
						<Signature className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.6rem]")}>DOCUMENTAÇÃO: {project.homologacao.documentacao.dataConclusaoElaboracao ? "CONCLUÍDA" : "PENDENTE"}</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">PADRÃO</h1>
					<div
						className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {
							"bg-orange-100 text-orange-700": !project.compra.dataPagamento,
							"bg-green-100 text-green-700": project.compra.dataPagamento,
						})}
					>
						<Banknote className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.6rem]")}>PAGAMENTO: {project.compra.dataPagamento ? "CONCLUÍDO" : "PENDENTE"}</p>
					</div>
					<div className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80")}>
						<Contact className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.6rem]")}>RESPONSÁVEL: {project.padrao.respInstalacao || "N/A"}</p>
					</div>
					<div className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80")}>
						<Cable className={cn("w-3 h-3 min-w-3 min-h-3")} />
						<p className={cn("font-medium text-[0.6rem]")}>
							TIPO: {project.visitaTecnica.amperagem || ""} {project.padrao.tipo || "N/A"}
						</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ORDEM DE SERVIÇO</h1>
					{project.ordemDeServico ? (
						<>
							<div className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {})}>
								<User className={cn("w-3 h-3 min-w-3 min-h-3")} />
								<p className={cn("font-medium text-[0.6rem]")}>TÍTULO: {project.ordemDeServico?.descricao || "N/A"}</p>
							</div>
							<div className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80")}>
								<Contact className={cn("w-3 h-3 min-w-3 min-h-3")} />
								<p className={cn("font-medium text-[0.6rem]")}>RESPONSÁVEL: {project.ordemDeServico?.responsavel?.nome || "N/A"}</p>
							</div>
							<div className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80")}>
								<Cable className={cn("w-3 h-3 min-w-3 min-h-3")} />
								<p className={cn("font-medium text-[0.6rem]")}>
									AGENDAMENTO: {project.ordemDeServico?.agendamento?.inicio ? formatDateAsLocale(project.ordemDeServico?.agendamento?.inicio) : "N/A"} -{" "}
									{project.ordemDeServico?.agendamento?.fim ? formatDateAsLocale(project.ordemDeServico?.agendamento?.fim) : "N/A"}
								</p>
							</div>
							<div className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80")}>
								<Cable className={cn("w-3 h-3 min-w-3 min-h-3")} />
								<p className={cn("font-medium text-[0.6rem]")}>
									EXECUÇÃO: {project.ordemDeServico?.periodo.inicio ? formatDateAsLocale(project.ordemDeServico?.periodo.inicio) : "N/A"} -{" "}
									{project.ordemDeServico?.periodo.fim ? formatDateAsLocale(project.ordemDeServico?.periodo.fim) : "N/A"}
								</p>
							</div>
						</>
					) : (
						<div className={cn("flex items-center gap-1 rounded-lg px-2 py-0.5 text-center text-[0.5rem] font-bold italic bg-orange-100 text-orange-700")}>
							<AlertCircle className={cn("w-3 h-3 min-w-3 min-h-3")} />
							<p className={cn("font-medium text-[0.6rem]")}>ORDEM DE SERVIÇO NÃO DEFINIDA</p>
						</div>
					)}
				</div>
			</div>
			<div className="flex w-full items-center justify-end">
				<CheckboxWithDate
					labelFalse="EXECUTADO"
					labelTrue="EXECUTADO"
					editable={!isPending}
					showDate={!!project.padrao.aumentoCarga.dataEfetivacao}
					date={project.padrao.aumentoCarga.dataEfetivacao || project.obra.saida || null}
					handleChange={(value) => handleUpdate(formatDateInputChange(value, "string"))}
				/>
			</div>
		</div>
	);
}

export default PAAdequationProjectCard;
