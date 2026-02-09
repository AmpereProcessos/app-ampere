import DeliveryCompletionModal from "@/components/identificador/controles-transportes/modals/DeliveryCompletion";
import CostsSection from "@/components/identificador/controles-transportes/modals/blocos/CostsPublic";
import DateTimeInput from "@/components/inputs/DateTimeInput";
import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type { TGetTransportControlByIdPublicOutput } from "@/pages/api/controles-transportes";
import { formatLongString, formatToMoney, getFileTypeTitle } from "@/utils/constants";
import { uploadFile } from "@/utils/methods/firebase";
import { formatDateAsLocale, formatDateTime, formatLocation, formatNameAsInitials } from "@/utils/methods/formatting";
import { updateTransportControl, updateTransportControlItem } from "@/utils/methods/mutation/transport-controls";
import { useTransportControlByIdPublic } from "@/utils/methods/query/transport-controls";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TUser } from "@/utils/schemas/users";
import type { TUseTransportControlState } from "@/utils/state/transport-controls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Calendar, CheckCircle2, Clock, DollarSign, MapPin, Package, PlusIcon, Truck } from "lucide-react";
import { ObjectId } from "mongodb";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCalendarCheck, BsCalendarPlus, BsCloudUploadFill } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";

type TransportControlFormularyProps = {
	transportControlId: string;
	error: string | null | undefined;
};

export default function TransportControlFormulary({ transportControlId, error }: TransportControlFormularyProps) {
	if (error) return <ErrorComponent msg={error} />;

	const queryClient = useQueryClient();
	const { data: transportControl, queryKey, isLoading, isError, error: queryError } = useTransportControlByIdPublic({ id: transportControlId });

	const handleOnMutate = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};

	if (isLoading) return <LoadingComponent />;
	if (isError) return <ErrorComponent msg={queryError?.message || "Erro ao carregar controle de transporte."} />;
	if (!transportControl) return <ErrorComponent msg="Controle de transporte não encontrado." />;

	const isStarted = !!transportControl.dataInicio;
	const isFinished = !!transportControl.dataFim;
	const allDeliveriesCompleted = transportControl.itens.every((item) => !!item.dataEfetivacao);

	console.log({
		isStarted,
		isFinished,
		allDeliveriesCompleted,
	});
	if (!isStarted)
		return (
			<div className="h-full w-full flex flex-col items-center justify-center gap-6 bg-background container mx-auto py-12 px-6">
				<div className="w-full flex flex-col items-center gap-1.5 p-3 border border-primary/30 rounded-lg shadow-sm">
					<div className="w-full flex items-center justify-center gap-2">
						<div className="flex items-center p-1 gap-1.5 px-2 py-1 rounded-lg bg-secondary text-primary">
							<Truck className="h-4 w-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium">TRA{transportControl.identificador}</p>
						</div>
						<h1 className="text-2xl font-black tracking-tight">{transportControl.titulo}</h1>
					</div>
					<div className="w-full flex items-center justify-center gap-2">
						<div className="flex items-center gap-1">
							<BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(transportControl.dataInsercao, true)}</p>
						</div>
						<div className="flex items-center gap-1">
							<Avatar className="w-5 h-5 min-w-5 min-h-5">
								<AvatarImage src={transportControl.autor.avatar_url || undefined} />
								<AvatarFallback>{formatNameAsInitials(transportControl.autor.nome)}</AvatarFallback>
							</Avatar>
							<p className="text-primary/80 text-[0.65rem] font-medium">{transportControl.autor.nome}</p>
						</div>
					</div>
				</div>
				<TransportControlFormularyStarting
					transportControlId={transportControlId}
					transportControl={transportControl}
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
				/>
			</div>
		);

	if (!isFinished)
		return (
			<div className="h-full w-full flex flex-col items-center justify-center gap-6 bg-background container mx-auto py-12 px-6">
				<div className="w-full flex flex-col items-center gap-1.5 p-3 border border-primary/30 rounded-lg shadow-sm">
					<div className="w-full flex items-center justify-center gap-2">
						<div className="flex items-center p-1 gap-1.5 px-2 py-1 rounded-lg bg-secondary text-primary">
							<Truck className="h-4 w-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium">TRA{transportControl.identificador}</p>
						</div>
						<h1 className="text-2xl font-black tracking-tight">{transportControl.titulo}</h1>
					</div>
					<div className="w-full flex items-center justify-center gap-2">
						<div className="flex items-center gap-1">
							<BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(transportControl.dataInsercao, true)}</p>
						</div>
						<div className="flex items-center gap-1">
							<Avatar className="w-5 h-5 min-w-5 min-h-5">
								<AvatarImage src={transportControl.autor.avatar_url || undefined} />
								<AvatarFallback>{formatNameAsInitials(transportControl.autor.nome)}</AvatarFallback>
							</Avatar>
							<p className="text-primary/80 text-[0.65rem] font-medium">{transportControl.autor.nome}</p>
						</div>
					</div>
				</div>
				<TransportControlFormularyConcluding
					transportControlId={transportControlId}
					transportControl={transportControl}
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
				/>
			</div>
		);
	return (
		<div className="h-full w-full flex flex-col items-center justify-center gap-6 bg-background container mx-auto py-12 px-6">
			<div className="w-full flex flex-col items-center gap-1.5 p-3 border border-primary/30 rounded-lg shadow-sm">
				<div className="w-full flex items-center justify-center gap-2">
					<div className="flex items-center p-1 gap-1.5 px-2 py-1 rounded-lg bg-secondary text-primary">
						<Truck className="h-4 w-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium">TRA{transportControl.identificador}</p>
					</div>
					<h1 className="text-2xl font-black tracking-tight">{transportControl.titulo}</h1>
				</div>
				<div className="w-full flex items-center justify-center gap-2">
					<div className="flex items-center gap-1">
						<BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(transportControl.dataInsercao, true)}</p>
					</div>
					<div className="flex items-center gap-1">
						<Avatar className="w-5 h-5 min-w-5 min-h-5">
							<AvatarImage src={transportControl.autor.avatar_url || undefined} />
							<AvatarFallback>{formatNameAsInitials(transportControl.autor.nome)}</AvatarFallback>
						</Avatar>
						<p className="text-primary/80 text-[0.65rem] font-medium">{transportControl.autor.nome}</p>
					</div>
				</div>
			</div>
			<div className="w-full flex flex-col items-center justify-center px-3 py-6 border border-green-600 rounded-lg shadow-sm gap-3 bg-green-200">
				<BadgeCheck className="w-6 h-6 min-w-6 min-h-6 text-green-600" />
				<p className="text-green-600 text-sm font-medium">TRANSPORTE FINALIZADO</p>
			</div>
		</div>
	);
}

type TransportControlFormularyStartingPayload = {
	initialKilometers: number | null;
	initialKilometersAttachment: {
		file: File | null;
		previewUrl: string | null;
	};
};
type TransportControlFormularyStartingProps = {
	transportControlId: string;
	transportControl: TGetTransportControlByIdPublicOutput["data"];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
function TransportControlFormularyStarting({ transportControlId, transportControl, callbacks }: TransportControlFormularyStartingProps) {
	const [startingPayload, setStartingPayload] = useState<TransportControlFormularyStartingPayload>({
		initialKilometers: null,
		initialKilometersAttachment: {
			file: null,
			previewUrl: null,
		},
	});

	const { mutate: handleStartTransport, isPending: isStarting } = useMutation({
		mutationKey: ["start-transport", transportControlId],
		mutationFn: async (info: TransportControlFormularyStartingPayload) => {
			if (!info.initialKilometers) throw new Error("Quilometragem inicial é obrigatória.");
			if (!info.initialKilometersAttachment.file) throw new Error("Imagem da quilometragem inicial é obrigatória.");

			const { url } = await uploadFile({
				vinculationId: transportControlId,
				fileName: `quilometragem-inicial-${transportControlId}`,
				file: info.initialKilometersAttachment.file,
				prefix: "transport-controls",
			});
			return await updateTransportControl({
				transportControlId,
				changes: {
					dataInicio: new Date().toISOString(),
					distanciaQuilometragemInicial: startingPayload.initialKilometers,
					distanciaQuilometragemInicialImagemUrl: url,
				},
			});
		},
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success("Transporte iniciado com sucesso!");
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(error?.message || "Erro ao iniciar transporte.");
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
	});

	return (
		<div className="w-full flex flex-col items-center justify-center px-3 py-6 border border-primary/30 rounded-lg shadow-sm gap-6">
			<NumberInput
				label="QUILOMETRAGEM INICIAL"
				value={startingPayload.initialKilometers}
				placeholder="Digite a quilometragem inicial..."
				handleChange={(value) => setStartingPayload({ ...startingPayload, initialKilometers: value })}
			/>
			<div className="w-full flex items-center justify-center">
				<label htmlFor="dropzone-file" className="relative h-[125px] w-[125px] rounded-lg overflow-hidden cursor-pointer">
					{startingPayload.initialKilometersAttachment.previewUrl ? (
						<Image src={startingPayload.initialKilometersAttachment.previewUrl} alt="Imagem da quilometragem inicial." objectFit="cover" fill={true} />
					) : (
						<div className="w-full h-full bg-primary/20 flex items-center justify-center gap-1 flex-col">
							<MdAttachFile className="w-6 h-6" />
							<p className="font-medium text-xs text-center">DEFINIR IMAGEM DA QUILOMETRAGEM INICIAL</p>
						</div>
					)}
					<input
						onChange={(e) => {
							const file = e.target.files?.[0] ?? null;
							setStartingPayload({ ...startingPayload, initialKilometersAttachment: { file, previewUrl: file ? URL.createObjectURL(file) : null } });
						}}
						id="dropzone-file"
						type="file"
						className="absolute h-full w-full opacity-0 cursor-pointer"
						accept=".png,.jpeg,.jpg"
						multiple={false}
						tabIndex={-1}
					/>
				</label>
			</div>
			<LoadingButton loading={isStarting} onClick={() => handleStartTransport(startingPayload)}>
				INICIAR TRANSPORTE
			</LoadingButton>
		</div>
	);
}

type TransportControlFormularyConcludingProps = {
	transportControlId: string;
	transportControl: TGetTransportControlByIdPublicOutput["data"];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};

function TransportControlFormularyConcluding({ transportControlId, transportControl, callbacks }: TransportControlFormularyConcludingProps) {
	const isElegibleToConclude = transportControl.itens.every((item) => !!item.dataEfetivacao);
	const [conclusionMenuIsOpen, setConclusionMenuIsOpen] = useState(false);
	const [newCostMenuIsOpen, setNewCostMenuIsOpen] = useState(false);
	return (
		<div className="w-full flex flex-col items-center justify-center px-3 py-6 border border-primary/30 rounded-lg shadow-sm gap-6">
			<ResponsiveDialogDrawerSection sectionTitleText="ENTREGAS" sectionTitleIcon={<Package className="h-4 w-4 min-w-4 min-h-4" />}>
				{transportControl.itens
					.sort((a, b) => a.ordem - b.ordem)
					.map((item, index) => (
						<TransportControlFormularyConcludingDeliveryCard
							key={item.id}
							transportControlId={transportControlId}
							previousDeliveries={transportControl.itens}
							deliveryIndex={index}
							delivery={item}
							callbacks={callbacks}
						/>
					))}
			</ResponsiveDialogDrawerSection>
			<ResponsiveDialogDrawerSection sectionTitleText="CUSTOS" sectionTitleIcon={<DollarSign className="h-4 w-4 min-w-4 min-h-4" />}>
				<div className="w-full flex items-center justify-end">
					<Button onClick={() => setNewCostMenuIsOpen(true)} variant="ghost" size="fit" className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs">
						<PlusIcon className="w-4 h-4" />
						ADICIONAR
					</Button>
				</div>
				{transportControl.custos.length > 0 ? (
					<div className="w-full flex flex-col gap-2">
						{transportControl.custos.map((cost, index) => (
							<div key={index.toString()} className="w-full flex items-center gap-2 justify-between p-2 rounded-lg shadow-sm border border-primary/30">
								<h1 className="text-xs tracking-tight font-medium text-start w-fit">{cost.descricao}</h1>

								<div className="flex items-center gap-1">
									<h1 className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground", {})}>
										{formatToMoney(cost.valor)}
									</h1>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">Nenhum custo adicionado ainda.</p>
				)}
			</ResponsiveDialogDrawerSection>
			{isElegibleToConclude ? (
				<div className="w-full flex items-center justify-center">
					<Button onClick={() => setConclusionMenuIsOpen(true)} className="flex items-center gap-1">
						<CheckCircle2 className="w-4 h-4 min-w-4 min-h-4" />
						CONCLUIR TRANSPORTE
					</Button>
				</div>
			) : null}
			{conclusionMenuIsOpen ? (
				<TransportControlFormularyConcludingMenu
					transportControlId={transportControlId}
					closeMenu={() => setConclusionMenuIsOpen(false)}
					callbacks={callbacks}
				/>
			) : null}
			{newCostMenuIsOpen ? (
				<NewCostMenu
					transportControlId={transportControlId}
					currentCosts={transportControl.custos}
					closeMenu={() => setNewCostMenuIsOpen(false)}
					callbacks={callbacks}
				/>
			) : null}
		</div>
	);
}

type TransportControlFormularyConcludingMenuProps = {
	transportControlId: string;
	closeMenu: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
type TransportControlFormularyConcludingMenuPayload = {
	finalKilometers: number | null;
	finalKilometersAttachment: {
		file: File | null;
		previewUrl: string | null;
	};
};
function TransportControlFormularyConcludingMenu({ transportControlId, closeMenu, callbacks }: TransportControlFormularyConcludingMenuProps) {
	const [finalKilometers, setFinalKilometers] = useState<TransportControlFormularyConcludingMenuPayload["finalKilometers"]>(null);
	const [finalKilometersAttachment, setFinalKilometersAttachment] = useState<
		TransportControlFormularyConcludingMenuPayload["finalKilometersAttachment"]
	>({
		file: null,
		previewUrl: null,
	});

	const { mutate: handleCompleteDelivery, isPending: isCompletingDelivery } = useMutation({
		mutationKey: ["complete-delivery", transportControlId],
		mutationFn: async (info: TransportControlFormularyConcludingMenuPayload) => {
			if (!info.finalKilometers) throw new Error("Quilometragem final é obrigatória.");
			if (!info.finalKilometersAttachment.file) throw new Error("Imagem da quilometragem final é obrigatória.");

			const { url } = await uploadFile({
				vinculationId: transportControlId,
				fileName: `quilometragem-final-${transportControlId}`,
				file: info.finalKilometersAttachment.file,
				prefix: "transport-controls",
			});
			return await updateTransportControl({
				transportControlId,
				changes: {
					dataFim: new Date().toISOString(),
					distanciaQuilometragemFinal: info.finalKilometers,
					distanciaQuilometragemFinalImagemUrl: url,
				},
			});
		},
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success("Entrega concluída com sucesso!");
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(error?.message || "Erro ao concluir entrega.");
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="CONCLUIR TRANSPORTE"
			menuDescription="Selecione a quilometragem final e anexe a imagem da quilometragem final."
			menuActionButtonText="CONCLUIR TRANSPORTE"
			menuCancelButtonText="CANCELAR"
			closeMenu={closeMenu}
			actionFunction={() => {
				handleCompleteDelivery({ finalKilometers, finalKilometersAttachment });
			}}
			actionIsPending={isCompletingDelivery}
			stateIsLoading={false}
			stateError={null}
		>
			<NumberInput
				label="QUILOMETRAGEM FINAL"
				value={finalKilometers}
				placeholder="Digite a quilometragem final..."
				handleChange={(value) => setFinalKilometers(value)}
				width="100%"
			/>
			<div className="w-full flex items-center justify-center">
				<label htmlFor="dropzone-file" className="relative h-[125px] w-[125px] rounded-lg overflow-hidden cursor-pointer">
					{finalKilometersAttachment.previewUrl ? (
						<Image src={finalKilometersAttachment.previewUrl} alt="Imagem da quilometragem final." objectFit="cover" fill={true} />
					) : (
						<div className="w-full h-full bg-primary/20 flex items-center justify-center gap-1 flex-col">
							<MdAttachFile className="w-6 h-6" />
							<p className="font-medium text-xs text-center">DEFINIR IMAGEM DA QUILOMETRAGEM FINAL</p>
						</div>
					)}
					<input
						onChange={(e) => {
							const file = e.target.files?.[0] ?? null;
							setFinalKilometersAttachment({ ...finalKilometersAttachment, file, previewUrl: file ? URL.createObjectURL(file) : null });
						}}
						id="dropzone-file"
						type="file"
						className="absolute h-full w-full opacity-0 cursor-pointer"
						accept=".png,.jpeg,.jpg"
						multiple={false}
						tabIndex={-1}
					/>
				</label>
			</div>
		</ResponsiveDialogDrawer>
	);
}

type NewCostMenuProps = {
	transportControlId: string;
	currentCosts: TGetTransportControlByIdPublicOutput["data"]["custos"];
	closeMenu: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
function NewCostMenu({ transportControlId, currentCosts, closeMenu, callbacks }: NewCostMenuProps) {
	const [costHolder, setCostHolder] = useState<TUseTransportControlState["state"]["transportControl"]["custos"][number]>({
		descricao: "",
		valor: 0,
		anexos: [],
	});

	async function handleAddCost(info: TUseTransportControlState["state"]["transportControl"]["custos"][number]) {
		if (!costHolder.descricao) {
			toast.error("Preencha uma descrição para o custo.");
			return;
		}
		if (!costHolder.valor) {
			toast.error("Preencha um valor para o custo.");
			return;
		}
		return await updateTransportControl({
			transportControlId,
			changes: {
				custos: [
					...currentCosts,
					{
						descricao: costHolder.descricao,
						valor: costHolder.valor,
						anexos: [],
					},
				],
			},
		});
	}

	const { mutate: handleAddCostMutation, isPending: isAddingCost } = useMutation({
		mutationKey: ["add-cost", transportControlId],
		mutationFn: handleAddCost,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			toast.success("Custo adicionado com sucesso!");
			return closeMenu();
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(error?.message || "Erro ao adicionar custo.");
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVO CUSTO"
			menuDescription="Adicione um novo custo ao controle de transporte."
			menuActionButtonText="ADICIONAR CUSTO"
			menuCancelButtonText="CANCELAR"
			stateIsLoading={false}
			actionFunction={() => handleAddCostMutation(costHolder)}
			actionIsPending={isAddingCost}
			closeMenu={closeMenu}
		>
			<TextInput
				label="DESCRIÇÃO"
				placeholder="Preencha a descrição do custo..."
				value={costHolder.descricao}
				handleChange={(value) => setCostHolder((prev) => ({ ...prev, descricao: value }))}
				width="100%"
			/>
			<NumberInput
				label="VALOR"
				placeholder="Preencha o valor do custo..."
				value={costHolder.valor}
				handleChange={(value) => setCostHolder((prev) => ({ ...prev, valor: value }))}
				width="100%"
			/>
		</ResponsiveDialogDrawer>
	);
}
type TransportControlFormularyConcludingDeliveryCardProps = {
	transportControlId: string;
	deliveryIndex: number;
	previousDeliveries: TGetTransportControlByIdPublicOutput["data"]["itens"];
	delivery: TGetTransportControlByIdPublicOutput["data"]["itens"][number];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
function TransportControlFormularyConcludingDeliveryCard({
	transportControlId,
	deliveryIndex,
	previousDeliveries,
	delivery,
	callbacks,
}: TransportControlFormularyConcludingDeliveryCardProps) {
	const [deliveryMenuIsOpen, setDeliveryMenuIsOpen] = useState(false);
	return (
		<div className="bg-background border-primary/30 relative flex w-full flex-col justify-between gap-1 rounded-lg border p-3 shadow-xs">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex items-center gap-2">
					<div className="bg-secondary text-muted-foreground flex items-center gap-1 text-center text-xs font-bold italic px-2 py-1 rounded-lg">
						<Truck className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs">N° {delivery.ordem}</p>
					</div>
					<h1 className="text-sm leading-none font-bold tracking-tight">{delivery.titulo}</h1>
					<h3 className="text-[0.625rem] font-medium tracking-tight text-primary/80">{delivery.id}</h3>
				</div>
				<div className="flex items-center gap-2">
					<h1
						className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium", {
							"bg-green-200 text-green-600": !!delivery.dataEfetivacao,
							"bg-orange-200 text-orange-600": !delivery.dataEfetivacao,
						})}
					>
						{delivery.dataEfetivacao ? "FINALIZADO" : "PENDENTE"}
					</h1>
				</div>
			</div>
			<div className="w-full flex items-center gap-2 flex-wrap">
				<div className="flex items-center gap-1">
					<MapPin className="w-4 h-4 min-w-4 min-h-4" />
					<h1 className="text-primary text-center text-[0.65rem]">
						{formatLocation({
							location: {
								uf: delivery.controleCompra?.entrega.localizacao.uf,
								cidade: delivery.controleCompra?.entrega.localizacao.cidade,
								cep: delivery.controleCompra?.entrega.localizacao.cep || null,
								bairro: delivery.controleCompra?.entrega.localizacao.bairro || null,
								endereco: delivery.controleCompra?.entrega.localizacao.endereco || null,
								numeroOuIdentificador: delivery.controleCompra?.entrega.localizacao.numeroOuIdentificador || null,
								complemento: delivery.controleCompra?.entrega.localizacao.complemento || null,
								latitude: delivery.controleCompra?.entrega.localizacao.latitude || null,
								longitude: delivery.controleCompra?.entrega.localizacao.longitude || null,
							},
							includeCity: true,
							includeUf: true,
						}) || "LOCALIZAÇÃO NÃO DEFINIDA"}
					</h1>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex flex-wrap items-center gap-2">
					{delivery.dataEfetivacao && (
						<div className="flex items-center gap-1">
							<BsCalendarCheck className="w-4 h-4 min-w-4 min-h-4 text-green-500" />
							<p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(delivery.dataEfetivacao, true)}</p>
						</div>
					)}
				</div>

				{!delivery.dataEfetivacao ? (
					<Button variant="ghost" size="fit" className="flex items-center gap-1 px-2 py-1" onClick={() => setDeliveryMenuIsOpen(true)}>
						<CheckCircle2 className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/80 text-[0.65rem] font-medium">CONCLUIR ENTREGA</p>
					</Button>
				) : null}
			</div>
			{deliveryMenuIsOpen ? (
				<TransportControlFormularyConcludingDeliveryConcludeMethodButton
					transportControlId={transportControlId}
					deliveryIndex={deliveryIndex}
					previousDeliveries={previousDeliveries}
					delivery={delivery}
					callbacks={callbacks}
					closeMenu={() => setDeliveryMenuIsOpen(false)}
				/>
			) : null}
		</div>
	);
}

type TransportControlFormularyConcludingDeliveryConcludeMethodButtonProps = {
	transportControlId: string;
	deliveryIndex: number;
	previousDeliveries: TGetTransportControlByIdPublicOutput["data"]["itens"];
	delivery: TGetTransportControlByIdPublicOutput["data"]["itens"][number];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
	closeMenu: () => void;
};
function TransportControlFormularyConcludingDeliveryConcludeMethodButton({
	transportControlId,
	deliveryIndex,
	previousDeliveries,
	delivery,
	callbacks,
	closeMenu,
}: TransportControlFormularyConcludingDeliveryConcludeMethodButtonProps) {
	const [deliveryDate, setDeliveryDate] = useState<string | undefined>(delivery.dataEfetivacao || undefined);
	const defaultAttachmentDefinitions = [
		{ key: "km", title: "ENTREGA - FOTO DO KM", label: "FOTO DO KM" },
		{ key: "materiais", title: "ENTREGA - FOTO DOS MATERIAIS ENTREGUES", label: "FOTO DOS MATERIAIS ENTREGUES" },
		{ key: "nf", title: "ENTREGA - FOTO DA NF ASSINADA", label: "FOTO DA NF ASSINADA" },
	] as const;
	const [defaultAttachments, setDefaultAttachments] = useState<
		Record<
			(typeof defaultAttachmentDefinitions)[number]["key"],
			{
				file: File | null;
				previewUrl: string | null;
			}
		>
	>({
		km: { file: null, previewUrl: null },
		materiais: { file: null, previewUrl: null },
		nf: { file: null, previewUrl: null },
	});
	const [otherAttachments, setOtherAttachments] = useState<
		{
			file: File | null;
			previewUrl: string | null;
		}[]
	>([]);
	const allDefaultAttachmentsReady = defaultAttachmentDefinitions.every((item) => !!defaultAttachments[item.key].file);

	const { mutate: handleCompleteDelivery, isPending: isCompletingDelivery } = useMutation({
		mutationKey: ["complete-delivery", delivery.id],
		mutationFn: async () => {
			if (!allDefaultAttachmentsReady) {
				throw new Error("As fotos obrigatórias da entrega devem ser anexadas.");
			}
			const defaultUploads = await Promise.all(
				defaultAttachmentDefinitions.map(async (definition) => {
					const attachment = defaultAttachments[definition.key];
					const uploaded = await uploadFile({
						vinculationId: transportControlId,
						fileName: `entrega-${delivery.id}-${definition.key}`,
						file: attachment.file as File,
						prefix: "transport-controls",
					});
					return { uploaded, title: definition.title };
				}),
			);
			const otherUploads = await Promise.all(
				otherAttachments
					.filter((attachment) => !!attachment.file)
					.map(async (attachment) => {
						const uploaded = await uploadFile({
							vinculationId: transportControlId,
							fileName: `entrega-${delivery.id}-${attachment.file?.name}`,
							file: attachment.file as File,
							prefix: "transport-controls",
						});
						return uploaded;
					}),
			);

			await updateTransportControl({
				transportControlId: transportControlId,
				changes: {
					itens: previousDeliveries.map((item, index) => {
						if (index === deliveryIndex) {
							return {
								...item,
								dataEfetivacao: deliveryDate,
								anexos: [
									...defaultUploads.map(({ uploaded, title }) => ({
										idArquivoReferencia: "", // Will be set by backend
										titulo: title,
										identificador: null,
										url: uploaded.url,
										formato: uploaded.format,
										tamanho: uploaded.size,
									})),
									...otherUploads.map((file, index) => ({
										idArquivoReferencia: "", // Will be set by backend
										titulo: `ENTREGA - ANEXO (${index + 1})`,
										identificador: null,
										url: file.url,
										formato: file.format,
										tamanho: file.size,
									})),
								],
							};
						}
						return item;
					}),
				},
			});
		},
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			toast.success("Entrega concluída com sucesso!");
			return closeMenu();
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(error?.message || "Erro ao concluir entrega.");
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="CONCLUIR ENTREGA"
			menuDescription="Anexe as fotos obrigatórias da entrega e, se necessário, inclua outros anexos."
			menuActionButtonText="CONCLUIR ENTREGA"
			menuCancelButtonText="CANCELAR"
			closeMenu={closeMenu}
			actionFunction={() => {
				handleCompleteDelivery();
			}}
			actionIsPending={isCompletingDelivery}
			stateIsLoading={false}
			stateError={null}
		>
			<DateTimeInput
				label="DATA E HORA DA ENTREGA"
				value={formatDateTime(deliveryDate)}
				handleChange={(value) => {
					setDeliveryDate(formatDateInputChange(value, "string", false) || undefined);
				}}
				width="100%"
			/>
			<div className="w-full flex flex-col gap-2">
				<h3 className="text-primary/80 text-xs font-medium tracking-tight">ARQUIVOS OBRIGATÓRIOS</h3>
				<div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
					{defaultAttachmentDefinitions.map((definition) => {
						const attachment = defaultAttachments[definition.key];
						const inputId = `delivery-default-${delivery.id}-${definition.key}`;
						const hasFile = !!attachment.file;
						return (
							<label
								key={definition.key}
								htmlFor={inputId}
								className={cn(
									"relative h-[140px] w-full rounded-lg overflow-hidden cursor-pointer border border-dashed flex items-center justify-center",
									{
										"border-green-500 bg-green-50": hasFile,
										"border-primary/30 bg-primary/10": !hasFile,
									},
								)}
							>
								{attachment.previewUrl ? (
									<Image src={attachment.previewUrl} alt={definition.label} objectFit="cover" fill={true} />
								) : (
									<div className="w-full h-full flex items-center justify-center gap-1 flex-col text-center px-2">
										<MdAttachFile className="w-6 h-6" />
										<p className="font-medium text-[0.65rem]">{definition.label}</p>
									</div>
								)}
								{hasFile ? (
									<div className="absolute right-2 top-2 rounded-full bg-green-600 p-1 text-white">
										<CheckCircle2 className="h-4 w-4" />
									</div>
								) : null}
								<input
									onChange={(e) => {
										const file = e.target.files?.[0] ?? null;
										setDefaultAttachments((prev) => ({
											...prev,
											[definition.key]: { file, previewUrl: file ? URL.createObjectURL(file) : null },
										}));
									}}
									id={inputId}
									type="file"
									className="absolute h-full w-full opacity-0 cursor-pointer"
									accept=".png,.jpeg,.jpg"
									multiple={false}
									tabIndex={-1}
								/>
							</label>
						);
					})}
				</div>
			</div>
			<div className="w-full flex flex-col gap-1">
				<h3 className="text-primary/80 text-xs font-medium tracking-tight">OUTROS ANEXOS</h3>
				<div className="relative flex h-full w-full flex-col items-center justify-center">
					<label
						htmlFor={`dropzone-file-${delivery.id}`}
						className="dark:hover:bg-bray-800 border-primary/20 bg-background hover:bg-primary/10 flex h-full min-h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed dark:bg-[#121212]"
					>
						<div className="text-primary flex flex-col items-center justify-center px-2 pt-5 pb-6">
							<BsCloudUploadFill color={"rgb(31,41,55)"} size={50} />
							<p className="text-center text-xs lg:text-base">Clique para escolher um ou mais arquivos ou os arraste para a àrea demarcada</p>
						</div>
						<input
							onChange={(e) => {
								if (e.target.files) {
									const files = Array.from(e.target.files);
									const attachments = files.map((file) => ({
										file: file,
										previewUrl: URL.createObjectURL(file),
									}));
									return setOtherAttachments((prev) => [...prev, ...attachments]);
								}
								return;
							}}
							multiple={true}
							id={`dropzone-file-${delivery.id}`}
							type="file"
							accept=".png,.jpeg,.jpg"
							className="absolute h-full w-full opacity-0"
						/>
					</label>
				</div>
				<div className="flex w-full flex-wrap items-start justify-start gap-4">
					{otherAttachments.length > 0 ? (
						otherAttachments
							.filter((a) => !!a.file)
							.map((attachment) => (
								<div key={attachment.file?.name} className="border-primary/50 flex h-[100px] max-h-[100px] w-[80px] flex-col rounded border">
									<div className="relative flex h-[80] w-full grow items-center justify-center bg-linear-to-b from-sky-400 to-sky-200">
										{attachment.previewUrl ? (
											<Image src={attachment.previewUrl} alt={attachment.file?.name || ""} fill={true} />
										) : (
											<h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">{getFileTypeTitle(attachment.file?.type || "")}</h1>
										)}
									</div>
									<div className="bg-primary text-primary-foreground h-[20px] rounded rounded-tl-none rounded-tr-none p-1 text-center text-[0.45rem] font-bold">
										{formatLongString(attachment.file?.name || "", 12)}
									</div>
								</div>
							))
					) : (
						<p className="text-primary/80 w-full text-start font-medium tracking-tight">Nenhum arquivo anexado.</p>
					)}
				</div>
			</div>
		</ResponsiveDialogDrawer>
	);
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { query } = context;
	const { id } = query;

	// Validating if ID provided in query is a valid ID
	if (!id || typeof id !== "string" || !ObjectId.isValid(id))
		return {
			props: {
				error: "Oops, o ID do controle de transporte solicitado é inválido.",
			},
		};

	return {
		props: {
			transportControlId: id,
			error: null,
		},
	};
}
