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
import { Code, UserRound } from "lucide-react";
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

type ComissionInfoHolder = {
	sellerComissionPercentage: number;
	insiderComissionPercentage: number;
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
	const { data: project, isLoading, isError, error, isSuccess } = useClientById({ id: projectId, enabled: !!projectId });
	const MENU_TITLE = "EDITAR COMISSÃO";
	const MENU_DESCRIPTION = "Preencha os campos abaixo para editar a comissão.";
	const BUTTON_TEXT = "ATUALIZAR COMISSÃO";
	const [infoHolder, setInfoHolder] = useState<ComissionInfoHolder>({
		sellerComissionPercentage: project?.comissoes?.porcentagemVendedor || 0,
		insiderComissionPercentage: project?.comissoes?.porcentagemInsider || 0,
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
}: { project: TProjectDTO; infoHolder: ComissionInfoHolder; updateInfoHolder: (changes: Partial<ComissionInfoHolder>) => void }) {
	const comissionableItems = project.comissoes?.itensComissionaveis || ["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"];
	const comissionableValue = getContractValue({
		projectValue: comissionableItems.includes("SISTEMA") ? project.sistema?.valorProjeto : 0,
		paValue: comissionableItems.includes("PADRÃO") ? project.padrao?.valor : 0,
		structureValue: comissionableItems.includes("ESTRUTURA PERSONALIZADA") ? project.estruturaPersonalizada?.valor : 0,
		oemValue: comissionableItems.includes("OEM") ? project.oem?.valor : 0,
		insuranceValue: comissionableItems.includes("SEGURO") ? project.seguro?.valor : 0,
	});
	return (
		<div className="w-full h-full flex flex-col gap-6">
			<div className="w-full flex flex-col gap-1.5">
				<div className="w-full flex items-center gap-1.5">
					<Code className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">NOME DO PROJETO</h3>
					<h3 className="text-sm font-semibold tracking-tight">
						{project.qtde} {project.nomeDoContrato}
					</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<UserRound className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VENDEDOR</h3>
					<Avatar className="h-5 w-5">
						<AvatarImage src={project.vendedor.avatar || undefined} alt={project.vendedor.nome} />
						<AvatarFallback>{formatNameAsInitials(project.vendedor.nome || "")}</AvatarFallback>
					</Avatar>
					<h3 className="text-sm font-semibold tracking-tight">{project.vendedor.nome}</h3>
					<h3 className="text-xs font-semibold tracking-tight">COMISSÃO: {project.comissoes?.porcentagemVendedor || 0}%</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<UserRound className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">INSIDER</h3>
					<h3 className="text-sm font-semibold tracking-tight">{project.insider || "N/A"}</h3>
					<h3 className="text-xs font-semibold tracking-tight">COMISSÃO: {project.comissoes?.porcentagemInsider || 0}%</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<FaSolarPanel className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO PROJETO</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.sistema?.valorProjeto || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<MdElectricMeter className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO PADRÃO</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.padrao?.valor || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<MdOutlineRoofing className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DA ESTRUTURA</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.estruturaPersonalizada?.valor || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<FaSolarPanel className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO OEM</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.oem?.valor || 0)}</h3>
				</div>
				<div className="w-full flex items-center gap-1.5">
					<FaShieldHalved className="w-4 h-4" />
					<h3 className="text-sm font-semibold tracking-tighter text-primary/80">VALOR DO SEGURO</h3>
					<h3 className="text-sm font-semibold tracking-tight">{formatToMoney(project.seguro?.valor || 0)}</h3>
				</div>
			</div>
			<div className="w-full flex flex-col gap-1.5">
				<NumberInput
					label="COMISSÃO DO VENDEDOR"
					value={infoHolder.sellerComissionPercentage}
					handleChange={(v) => updateInfoHolder({ sellerComissionPercentage: v })}
					placeholder="Preencha aqui a porcentagem da comissão do vendedor..."
					width="100%"
				/>
				<div className="w-full flex items-center justify-center">
					<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.55rem] font-bold italic text-primary/80">
						<p>COMISSÃO FINAL DO VENDEDOR</p>
						<p className="text-[#15599a] font-black text-[0.57rem]">{formatToMoney(comissionableValue * (infoHolder.sellerComissionPercentage / 100))}</p>
					</div>
				</div>
				<NumberInput
					label="COMISSÃO DO INSIDER"
					value={infoHolder.insiderComissionPercentage}
					handleChange={(v) => updateInfoHolder({ insiderComissionPercentage: v })}
					placeholder="Preencha aqui a porcentagem da comissão do insider..."
					width="100%"
				/>
				<div className="w-full flex items-center justify-center">
					<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.55rem] font-bold italic text-primary/80">
						<p>COMISSÃO FINAL DO INSIDER</p>
						<p className="text-[#15599a] font-black text-[0.57rem]">{formatToMoney(comissionableValue * (infoHolder.insiderComissionPercentage / 100))}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
