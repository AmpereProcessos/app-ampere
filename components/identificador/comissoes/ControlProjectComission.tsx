import { useMediaQuery } from "@/lib/hooks/media-query";
import type { Session } from "next-auth";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useClientById } from "@/utils/methods/query/clients";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { BadgeDollarSign, Code, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { FaSolarPanel } from "react-icons/fa";
import { MdElectricMeter, MdOutlineRoofing } from "react-icons/md";
import { FaShieldHalved } from "react-icons/fa6";
import NumberInput from "@/components/inputs/Number";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/utils/methods/mutation/clients";
import toast from "react-hot-toast";
import { formatToMoney } from "@/utils/constants";
import { getContractValue } from "@/utils/methods/util/projects";
import { useComissionDataByProjectId } from "@/utils/methods/query/comissions";
import { ComissionableItems, type TComissionableItemsEnum, type TComissionDataByProjectId } from "@/pages/api/gestao/comissoes";
import { cn } from "@/lib/utils";

type ComissionInfoHolder = {
	comissionableValue: number;
	comissionableItems: TComissionDataByProjectId["comissoes"]["itensComissionaveis"];
	sellerComissionPercentage: number;
	insiderComissionPercentage: number;
	sellerComissionValue: number;
	insiderComissionValue: number;
};

type ControlProjectComissionProps = {
	projectId: string;
	session: Session["user"];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
	closeModal: () => void;
};
function ControlProjectComission({ projectId, session, closeModal, callbacks }: ControlProjectComissionProps) {
	const queryClient = useQueryClient();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const { data: project, isLoading, isError, error, isSuccess } = useComissionDataByProjectId({ projectId });
	const MENU_TITLE = "EDITAR COMISSÃO";
	const MENU_DESCRIPTION = "Preencha os campos abaixo para editar a comissão.";
	const BUTTON_TEXT = "ATUALIZAR COMISSÃO";
	const [infoHolder, setInfoHolder] = useState<ComissionInfoHolder>({
		comissionableValue: project?.comissoes?.valorComissionavel || 0,
		comissionableItems: project?.comissoes?.itensComissionaveis || ["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"],
		sellerComissionPercentage: project?.comissoes?.porcentagemVendedor || 0,
		sellerComissionValue: (project?.comissoes?.valorComissionavel || 0) * ((project?.comissoes?.porcentagemVendedor || 0) / 100) || 0,
		insiderComissionPercentage: project?.comissoes?.porcentagemInsider || 0,
		insiderComissionValue: (project?.comissoes?.valorComissionavel || 0) * ((project?.comissoes?.porcentagemInsider || 0) / 100) || 0,
	});
	function updateInfoHolder(changes: Partial<ComissionInfoHolder>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutateUpdateComissionData, isPending: isUpdateLoading } = useMutation({
		mutationFn: updateProject,
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ["project-by-id", projectId],
			});
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success("Comissão atualizada com sucesso !");
		},
		onSettled: async () => {
			queryClient.invalidateQueries({ queryKey: ["project-by-id", projectId] });
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[70vh]">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-auto">
							<ProjectComissionDataBlock project={project} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton
								onClick={() =>
									mutateUpdateComissionData({
										id: projectId,
										changes: {
											"comissoes.porcentagemVendedor": infoHolder.sellerComissionPercentage,
											"comissoes.porcentagemInsider": infoHolder.insiderComissionPercentage,
										},
									})
								}
								loading={isUpdateLoading}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="h-fit max-h-[70vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-auto">
							<ProjectComissionDataBlock project={project} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton
								onClick={() =>
									mutateUpdateComissionData({
										id: projectId,
										changes: {
											"comissoes.porcentagemVendedor": infoHolder.sellerComissionPercentage,
											"comissoes.porcentagemInsider": infoHolder.insiderComissionPercentage,
										},
									})
								}
								loading={isUpdateLoading}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

export default ControlProjectComission;

function ProjectComissionDataBlock({
	project,
	infoHolder,
	updateInfoHolder,
}: { project: TComissionDataByProjectId; infoHolder: ComissionInfoHolder; updateInfoHolder: (changes: Partial<ComissionInfoHolder>) => void }) {
	const comissionableItems = project.comissoes?.itensComissionaveis || ["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"];
	return (
		<div className="w-full h-full flex flex-col gap-6">
			<div className="w-full flex flex-col gap-1.5">
				<div className="w-full flex items-center gap-1.5">
					<Code className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">NOME DO PROJETO</h3>
					<h3 className="text-sm font-semibold tracking-tight">
						{project.identificadorApp} - {project.nome}
					</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<UserRound className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VENDEDOR</h3>
					<Avatar className="h-5 w-5">
						<AvatarImage src={project.vendedor.avatar_url || undefined} alt={project.vendedor.nome} />
						<AvatarFallback>{formatNameAsInitials(project.vendedor.nome || "")}</AvatarFallback>
					</Avatar>
					<h3 className="text-sm font-semibold tracking-tight">{project.vendedor.nome}</h3>
					<h3 className="text-xs font-semibold tracking-tight">COMISSÃO: {project.comissoes?.porcentagemVendedor || 0}%</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<UserRound className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">INSIDER</h3>
					{project.insider.nome ? (
						<>
							<Avatar className="h-5 w-5">
								<AvatarImage src={project.insider.avatar_url || undefined} alt={project.insider.nome} />
								<AvatarFallback>{formatNameAsInitials(project.insider.nome || "")}</AvatarFallback>
							</Avatar>
							<h3 className="text-sm font-semibold tracking-tight">{project.insider.nome || "N/A"}</h3>
							<h3 className="text-xs font-semibold tracking-tight">COMISSÃO: {project.comissoes?.porcentagemInsider || 0}%</h3>
						</>
					) : (
						<h3 className="text-sm font-semibold tracking-tight">N/A</h3>
					)}
				</div>
				<div className="w-full flex items-center gap-1.5">
					<FaSolarPanel className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO PROJETO</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.valorProjeto || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<MdElectricMeter className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO PADRÃO</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.valorPadrao || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<MdOutlineRoofing className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DA ESTRUTURA</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.valorEstruturaPersonalizada || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<FaSolarPanel className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO OEM</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.valorOem || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<FaShieldHalved className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO SEGURO</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.valorSeguro || 0)}</h3>
				</div>
				<div className="w-full h-[1px] bg-primary/10" />
				<div className="w-full flex items-center gap-1.5">
					<BadgeDollarSign className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR COMISSIONÁVEL SUGERIDO</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.comissoes?.valorComissionavelSugerido || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<UserRound className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">COMISSÃO DE VENDEDOR SUGERIDA</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.vendedor.comissao || 0)}%</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<UserRound className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">COMISSÃO DE INSIDER SUGERIDA</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.insider.comissao || 0)}%</h3>
				</div>
				<div className="w-full flex items-center justify-center">
					<Button
						onClick={() => {
							updateInfoHolder({
								comissionableValue: project.comissoes?.valorComissionavelSugerido || 0,
								sellerComissionPercentage: project.vendedor.comissao,
								insiderComissionPercentage: project.insider.comissao,
								sellerComissionValue: (project.comissoes?.valorComissionavelSugerido || 0) * ((project.vendedor.comissao || 0) / 100) || 0,
								insiderComissionValue: (project.comissoes?.valorComissionavelSugerido || 0) * ((project.insider.comissao || 0) / 100) || 0,
							});
						}}
						variant="ghost"
						className="text-xs px-2 py-1"
						size="fit"
					>
						APLICAR VALORES SUGERIDOS
					</Button>
				</div>
			</div>
			<div className="w-full flex flex-col gap-3">
				<NumberInput
					label="VALOR COMISSIONÁVEL"
					value={infoHolder.comissionableValue}
					handleChange={(v) => updateInfoHolder({ comissionableValue: v })}
					placeholder="Preencha aqui o valor comissionável..."
					width="100%"
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
				/>
				<div className="w-full flex items-center flex-wrap gap-1.5">
					{ComissionableItems.map((item) => (
						<Button
							key={item}
							className={cn("flex items-center gap-1.5 px-2 py-1", {
								"bg-green-500 text-white": infoHolder.comissionableItems.includes(item as TComissionableItemsEnum),
							})}
							variant={"outline"}
							size={"fit"}
						>
							<h3 className="text-sm font-semibold tracking-tighter text-primary/80">{item}</h3>
						</Button>
					))}
				</div>
				<div className="w-full flex flex-col gap-1.5">
					<h1 className="text-sm font-bold leading-none tracking-tight">COMISSIONADOS</h1>

					<div className="w-full flex flex-col gap-1 p-2 border border-primary/10 rounded-md bg-[#fff] dark:bg-[#121212] shadow-sm">
						<div className="w-full flex items-center justify-center gap-2">
							<Avatar className="h-5 w-5">
								<AvatarImage src={project.vendedor.avatar_url || undefined} alt={project.vendedor.nome} />
								<AvatarFallback>{formatNameAsInitials(project.vendedor.nome || "")}</AvatarFallback>
							</Avatar>
							<h1 className="text-[0.6rem] font-bold tracking-tighter">{project.vendedor.nome}</h1>
						</div>
						<NumberInput
							label="COMISSÃO DO VENDEDOR (%)"
							value={infoHolder.sellerComissionPercentage}
							handleChange={(v) => {
								updateInfoHolder({ sellerComissionPercentage: v, sellerComissionValue: v * (infoHolder.comissionableValue / 100) });
							}}
							placeholder="Preencha aqui a porcentagem da comissão do vendedor..."
							width="100%"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
						/>
						<NumberInput
							label="COMISSÃO DO VENDEDOR (R$)"
							value={infoHolder.sellerComissionValue}
							handleChange={(v) => {
								const percentage = (v / infoHolder.comissionableValue) * 100;
								updateInfoHolder({ sellerComissionPercentage: percentage, sellerComissionValue: v });
							}}
							placeholder="Preencha aqui o valor da comissão do vendedor..."
							width="100%"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
						/>
						<div className="w-full flex items-center justify-center">
							<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.55rem] font-bold italic text-primary/80">
								<p>COMISSÃO FINAL DO VENDEDOR</p>
								<p className="text-[#15599a] font-black text-[0.57rem]">{formatToMoney(infoHolder.comissionableValue * (infoHolder.sellerComissionPercentage / 100))}</p>
							</div>
						</div>
					</div>
					{project.insider.nome ? (
						<div className="w-full flex flex-col gap-1 p-2 border border-primary/10 rounded-md bg-[#fff] dark:bg-[#121212] shadow-sm">
							<div className="w-full flex items-center justify-center">
								<div className={"flex items-center gap-2 rounded-lg p-1 text-[0.6rem] font-medium bg-primary/80 px-2 text-white dark:bg-primary/20"}>
									<Avatar className="h-5 w-5">
										<AvatarImage src={project.insider.avatar_url || undefined} alt={project.insider.nome} />
										<AvatarFallback>{formatNameAsInitials(project.insider.nome || "")}</AvatarFallback>
									</Avatar>
									<h1 className="text-[0.6rem] font-bold tracking-tighter">{project.insider.nome}</h1>
								</div>
							</div>
							<NumberInput
								label="COMISSÃO DO INSIDER"
								value={infoHolder.insiderComissionPercentage}
								handleChange={(v) => {
									updateInfoHolder({ insiderComissionPercentage: v, insiderComissionValue: v * (infoHolder.comissionableValue / 100) });
								}}
								placeholder="Preencha aqui a porcentagem da comissão do insider..."
								width="100%"
								labelClassName="text-[0.6rem]"
								holderClassName="text-xs p-2 min-h-[34px]"
							/>
							<NumberInput
								label="COMISSÃO DO INSIDER (R$)"
								value={infoHolder.insiderComissionValue}
								handleChange={(v) => {
									const percentage = (v / infoHolder.comissionableValue) * 100;
									updateInfoHolder({ insiderComissionPercentage: percentage, insiderComissionValue: v });
								}}
								placeholder="Preencha aqui o valor da comissão do insider..."
								width="100%"
								labelClassName="text-[0.6rem]"
								holderClassName="text-xs p-2 min-h-[34px]"
							/>
							<div className="w-full flex items-center justify-center">
								<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.55rem] font-bold italic text-primary/80">
									<p>COMISSÃO FINAL DO INSIDER</p>
									<p className="text-[#15599a] font-black text-[0.57rem]">{formatToMoney(infoHolder.comissionableValue * (infoHolder.insiderComissionPercentage / 100))}</p>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
