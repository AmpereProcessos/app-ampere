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
import type { TProjectComissionedUser, TProjectDTO } from "@/utils/schemas/projects";
import { BadgeCheck, BadgeDollarSign, Code, Plus, Trash, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { FaSolarPanel } from "react-icons/fa";
import { MdElectricMeter, MdOutlineRoofing } from "react-icons/md";
import { FaShieldHalved } from "react-icons/fa6";
import NumberInput from "@/components/inputs/Number";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/utils/methods/mutation/clients";
import toast from "react-hot-toast";
import { formatToMoney } from "@/utils/constants";
import { getContractValue } from "@/utils/methods/util/projects";
import { useComissionDataByProjectId } from "@/utils/methods/query/comissions";
import { cn } from "@/lib/utils";
import type { TGetComissionDataOutputByProjectId } from "@/app/api/comissoes/route";
import { ComissionableItems, type TComissionableItemsEnum } from "@/utils/select-options";
import CheckboxInput from "@/components/inputs/Checkbox";
import CheckboxWithDate from "@/components/inputs/CheckboxWithDate";
import NewProjectComissionedMenu from "./NewProjectComissionedMenu";

type ComissionInfoHolder = {
	comissionableValue: number;
	comissionableItems: TGetComissionDataOutputByProjectId["comissoes"]["itensComissionaveis"];
	comissioned: TGetComissionDataOutputByProjectId["comissoes"]["comissionados"];
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
		comissioned: project?.comissoes?.comissionados || [],
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
	useEffect(() => {
		if (project) {
			setInfoHolder({
				comissionableValue: project.comissoes?.valorComissionavel || 0,
				comissionableItems: project.comissoes?.itensComissionaveis || [],
				comissioned: project.comissoes?.comissionados || [],
			});
		}
	}, [project]);
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
						<div className="flex-1 overflow-auto px-4">
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
											"comissoes.comissionados": infoHolder.comissioned,
											"comissoes.itensComissionaveis": infoHolder.comissionableItems,
											"comissoes.valorComissionavel": infoHolder.comissionableValue,
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
						<div className="flex-1 overflow-auto px-4">
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
											"comissoes.comissionados": infoHolder.comissioned,
											"comissoes.itensComissionaveis": infoHolder.comissionableItems,
											"comissoes.valorComissionavel": infoHolder.comissionableValue,
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
}: { project: TGetComissionDataOutputByProjectId; infoHolder: ComissionInfoHolder; updateInfoHolder: (changes: Partial<ComissionInfoHolder>) => void }) {
	const [newComissionedMenuIsOpen, setNewComissionedMenuIsOpen] = useState(false);
	function updateComissionableItems(item: TComissionableItemsEnum) {
		const itemIsInComissionableItems = infoHolder.comissionableItems.includes(item);
		const newComissionableItems = itemIsInComissionableItems ? infoHolder.comissionableItems.filter((i) => i !== item) : [...infoHolder.comissionableItems, item];
		updateInfoHolder({
			comissionableItems: newComissionableItems,
			comissionableValue: getContractValue({
				projectValue: newComissionableItems.includes("SISTEMA") ? project.valorProjeto : 0,
				paValue: newComissionableItems.includes("PADRÃO") ? project.valorPadrao : 0,
				structureValue: newComissionableItems.includes("ESTRUTURA PERSONALIZADA") ? project.valorEstruturaPersonalizada : 0,
				oemValue: newComissionableItems.includes("OEM") ? project.valorOem : 0,
				insuranceValue: newComissionableItems.includes("SEGURO") ? project.valorSeguro : 0,
			}),
		});
	}
	function updateComissioned({ index, changes }: { index: number; changes: Partial<TProjectComissionedUser> }) {
		updateInfoHolder({ comissioned: infoHolder.comissioned.map((comissioned, i) => (i === index ? { ...comissioned, ...changes } : comissioned)) });
	}
	function addComissioned(comissioned: TGetComissionDataOutputByProjectId["comissoes"]["comissionados"][number]) {
		updateInfoHolder({ comissioned: [...infoHolder.comissioned, comissioned] });
	}
	function removeComissioned(index: number) {
		updateInfoHolder({ comissioned: infoHolder.comissioned.filter((_, i) => i !== index) });
	}
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
				{project.comissoes.comissionados.map((comissioned, index) => (
					<div key={`${comissioned.nome}-${index}`} className="w-full flex items-center gap-1.5">
						<UserRound className="w-4 h-4" />
						<h3 className="text-sm font-semibold tracking-tighter text-primary/80">{comissioned.papel}</h3>
						<Avatar className="h-5 w-5">
							<AvatarImage src={comissioned.avatar_url || undefined} alt={comissioned.nome} />
							<AvatarFallback>{formatNameAsInitials(comissioned.nome || "")}</AvatarFallback>
						</Avatar>
						<h3 className="text-sm font-semibold tracking-tight">{comissioned.nome}</h3>
						<h3 className="text-xs font-semibold tracking-tight">COMISSÃO: {comissioned.porcentagem || 0}%</h3>
					</div>
				))}

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
				<div className="w-full flex items-center justify-center">
					<Button
						onClick={() => {
							updateInfoHolder({
								comissionableValue: project.comissoes?.valorComissionavelSugerido || 0,
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
				<h1 className="text-[0.6rem] font-medium tracking-tight text-primary/80">ITENS COMISSIONÁVEIS</h1>
				<div className="w-full flex items-center flex-wrap gap-1.5">
					{ComissionableItems.map((item) => {
						const itemIsInComissionableItems = infoHolder.comissionableItems.includes(item as TComissionableItemsEnum);
						return (
							<Button
								key={item}
								className={cn("flex items-center gap-1.5 px-2 py-1", {
									"bg-green-500 text-white": itemIsInComissionableItems,
								})}
								variant={"outline"}
								size={"fit"}
								onClick={() => {
									updateComissionableItems(item as TComissionableItemsEnum);
								}}
							>
								<h3 className="text-xs font-semibold tracking-tighter">{item}</h3>
							</Button>
						);
					})}
				</div>
				<div className="w-full flex flex-col gap-1.5">
					<div className="w-full flex items-center justify-between gap-2">
						<h1 className="text-sm font-bold leading-none tracking-tight">COMISSIONADOS</h1>

						<div className="w-fit">
							<Button
								variant="ghost"
								size="fit"
								onClick={() => updateInfoHolder({ comissioned: infoHolder.comissioned.map((comissioned) => ({ ...comissioned, dataEfetivacao: new Date().toISOString() })) })}
							>
								EFETIVAR TODAS
							</Button>
						</div>
					</div>
					{infoHolder.comissioned.map((comissioned, index) => (
						<ComissionedCard
							key={`${comissioned.nome}-${index}`}
							comissionableValue={infoHolder.comissionableValue}
							comissioned={comissioned}
							updateComissioned={(changes) => updateComissioned({ index, changes })}
							removeComissioned={() => removeComissioned(index)}
						/>
					))}
					<div className="w-full flex items-center justify-center">
						<button
							type="button"
							onClick={() => setNewComissionedMenuIsOpen(true)}
							className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem] text-primary hover:bg-blue-600 hover:text-white transition-colors"
						>
							<Plus className="w-4 h-4 min-w-4 min-h-4" />
							<p>ADICIONAR COMISSIONADO</p>
						</button>
					</div>
				</div>
			</div>
			{newComissionedMenuIsOpen ? (
				<NewProjectComissionedMenu comissionableValue={infoHolder.comissionableValue} addComissioned={addComissioned} closeModal={() => setNewComissionedMenuIsOpen(false)} />
			) : null}
		</div>
	);
}

type ComissionedCardProps = {
	comissionableValue: number;
	comissioned: TGetComissionDataOutputByProjectId["comissoes"]["comissionados"][number];
	updateComissioned: (changes: Partial<TProjectComissionedUser>) => void;
	removeComissioned: () => void;
};
function ComissionedCard({ comissionableValue, comissioned, updateComissioned, removeComissioned }: ComissionedCardProps) {
	return (
		<div className="w-full flex flex-col gap-1 p-2 border border-primary/30 rounded-md bg-[#fff] dark:bg-[#121212] shadow-sm">
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={() => removeComissioned()}
						className="flex items-center gap-1 rounded-full p-2 text-[0.6rem] text-primary hover:bg-red-600 hover:text-white transition-colors"
					>
						<Trash className="w-3 h-3 min-w-3 min-h-3" />
					</button>
					<h1 className="text-[0.6rem] font-bold tracking-tighter">COMISSÃO DO VENDEDOR:</h1>
					<Avatar className="h-5 w-5">
						<AvatarImage src={comissioned.avatar_url || undefined} alt={comissioned.nome} />
						<AvatarFallback>{formatNameAsInitials(comissioned.nome || "")}</AvatarFallback>
					</Avatar>
					<h1 className="text-[0.6rem] font-bold tracking-tighter">{comissioned.nome}</h1>
				</div>
				<div
					className={cn("flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80", {
						"bg-orange-100 text-orange-700": !comissioned.dataValidacao,
						"bg-green-100 text-green-700": comissioned.dataValidacao,
					})}
				>
					<BadgeCheck className={cn("w-3 h-3 min-w-3 min-h-3")} />
					<p className={cn("font-medium text-[0.57rem]")}>{comissioned.dataValidacao ? "VALIDADO" : "NÃO VALIDADO"}</p>
				</div>
			</div>

			<NumberInput
				label="COMISSÃO DO VENDEDOR (%)"
				value={comissioned.porcentagem}
				handleChange={(v) => {
					updateComissioned({ porcentagem: v, valor: (v / 100) * comissionableValue });
				}}
				placeholder="Preencha aqui a porcentagem da comissão do vendedor..."
				width="100%"
				labelClassName="text-[0.6rem]"
				holderClassName="text-xs p-2 min-h-[34px]"
			/>
			<NumberInput
				label="COMISSÃO DO VENDEDOR (R$)"
				value={comissioned.valor || null}
				handleChange={(v) => {
					updateComissioned({ valor: v, porcentagem: (v / comissionableValue) * 100 });
				}}
				placeholder="Preencha aqui o valor da comissão do vendedor..."
				width="100%"
				labelClassName="text-[0.6rem]"
				holderClassName="text-xs p-2 min-h-[34px]"
			/>
			<div className="w-full flex items-center justify-center">
				<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.55rem] font-bold italic text-primary/80">
					<p>COMISSÃO FINAL DO VENDEDOR</p>
					<p className="text-[#15599a] font-black text-[0.57rem]">{formatToMoney(comissionableValue * (comissioned.porcentagem / 100))}</p>
				</div>
			</div>
			<div className="w-full flex items-center gap-2 flex-wrap justify-center">
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="VALORES NÃO EFETIVADOS"
						labelTrue="VALORES EFETIVADOS"
						date={comissioned.dataEfetivacao ? new Date(comissioned.dataEfetivacao) : null}
						handleChange={(value) => {
							updateComissioned({ dataEfetivacao: value });
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="PAGAMENTO NÃO REALIZADO"
						labelTrue="PAGAMENTO REALIZADO"
						date={comissioned.dataPagamento ? new Date(comissioned.dataPagamento) : null}
						handleChange={(value) => {
							updateComissioned({ dataPagamento: value });
						}}
					/>
				</div>
			</div>
		</div>
	);
}
