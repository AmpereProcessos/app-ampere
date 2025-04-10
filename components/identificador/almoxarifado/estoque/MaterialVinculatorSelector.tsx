import { useDebounce } from "@/lib/hooks/debounce";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { useVinculationMaterialsBySearch } from "@/utils/methods/query/materials";
import type { TMaterial, TMaterialSimplifiedWithAlocatorDTO } from "@/utils/schemas/materials";
import { useState } from "react";
import toast from "react-hot-toast";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Box, Link, Ruler, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createMaterial } from "@/utils/methods/mutation/materials";
import SelectInput from "@/components/inputs/Select";
import { units } from "@/utils/select-options";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

type TMaterialState = {
	materialId: string | null;
	materialName: string;
};

type MaterialSelectorProps = {
	initialMaterialState?: TMaterialState;
	vinculateMaterial: (info: TMaterialSimplifiedWithAlocatorDTO) => void;
	unvinculateMaterial: () => void;
};
function MaterialSelector({ initialMaterialState, vinculateMaterial, unvinculateMaterial }: MaterialSelectorProps) {
	const [stateHolder, setStateHolder] = useState<TMaterialState>(initialMaterialState || { materialId: null, materialName: "" });

	const debouncedQueryParams = useDebounce({ search: stateHolder?.materialName }, 350);
	const { data: materials, isLoading, isFetching, isError, isSuccess, isStale, error } = useVinculationMaterialsBySearch(debouncedQueryParams);

	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	function getSelectedMaterial({ materialId, materials }: { materialId?: string | null; materials?: TMaterialSimplifiedWithAlocatorDTO[] }) {
		if (!materialId || !materials) return null;
		return materials.find((material) => material._id === materialId) || null;
	}
	const selectedMaterial = getSelectedMaterial({ materialId: stateHolder?.materialId, materials });

	function handleMaterialVinculation(materialId: string) {
		if (!materials) return toast.error("Não foi possível vincular o material.");
		const selectedMaterial = materials.find((material) => material._id === materialId);
		if (!selectedMaterial) return toast.error("Não foi possível vincular o material.");
		vinculateMaterial(selectedMaterial);
		setOpen(false);
	}
	function handleMaterialUnvinculation() {
		unvinculateMaterial();
	}
	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-full rounded-md border border-primary/20 p-3 text-xs shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-primary"
					>
						{selectedMaterial ? (
							<div className="flex items-center gap-1">
								<h1 className="text-sm font-medium tracking-tight text-primary">{selectedMaterial.nome}</h1>
								<div className="flex items-center gap-1">
									<Ruler width={15} height={15} />
									<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{selectedMaterial.grandeza}</h1>
								</div>
								<div className="flex items-center gap-1">
									<Warehouse width={15} height={15} />
									<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{selectedMaterial.alocadorDados?.nome || "N/A"}</h1>
								</div>
								<div className={cn("flex items-center justify-center rounded-full bg-green-600 p-1 text-xs font-medium text-white duration-300 ease-in-out")}>
									<Link size={12} />
								</div>
							</div>
						) : (
							<>SELECIONE O MATERIAL...</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="flex max-h-[350px] w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] flex-col gap-2 overflow-y-auto overscroll-y-auto p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
					sideOffset={5}
					onClick={(e) => e.stopPropagation()}
				>
					{isLoading ? <h1 className="animate-pulse text-center text-xs font-medium italic text-primary/80">Carregando...</h1> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						<MaterialList
							vinculatedMaterialId={stateHolder?.materialId}
							materials={materials}
							materialDescription={stateHolder?.materialName}
							updateMaterialDescription={(value) => setStateHolder((prev) => ({ ...prev, materialName: value }))}
							handleMaterialVinculation={handleMaterialVinculation}
							handleMaterialUnvinculation={handleMaterialUnvinculation}
						/>
					) : null}
				</PopoverContent>
			</Popover>
		);
	}
	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className="w-full">
					{selectedMaterial ? (
						<div className="flex items-center gap-1">
							<h1 className="text-sm font-medium tracking-tight text-primary">{selectedMaterial.nome}</h1>
							<div className="flex items-center gap-1">
								<Ruler width={15} height={15} />
								<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{selectedMaterial.grandeza}</h1>
							</div>
							<div className="flex items-center gap-1">
								<Warehouse width={15} height={15} />
								<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{selectedMaterial.alocadorDados?.nome || "N/A"}</h1>
							</div>
							<div className={cn("flex items-center justify-center rounded-full bg-green-600 p-1 text-xs font-medium text-white duration-300 ease-in-out")}>
								<Link size={12} />
							</div>
						</div>
					) : (
						<>SELECIONE O MATERIAL...</>
					)}
				</Button>
			</DrawerTrigger>
			<DrawerContent onClick={(e) => e.stopPropagation()} className="flex h-[80%] max-h-[80%]  w-full flex-col gap-2 p-3">
				{isLoading ? <h1 className="animate-pulse text-center text-xs font-medium italic text-primary/80">Carregando...</h1> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<MaterialList
						vinculatedMaterialId={stateHolder?.materialId}
						materials={materials}
						materialDescription={stateHolder?.materialName}
						updateMaterialDescription={(value) => setStateHolder((prev) => ({ ...prev, materialName: value }))}
						handleMaterialVinculation={handleMaterialVinculation}
						handleMaterialUnvinculation={handleMaterialUnvinculation}
					/>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

export default MaterialSelector;

type MaterialListProps = {
	materials: TMaterialSimplifiedWithAlocatorDTO[];
	vinculatedMaterialId?: string | null;
	materialDescription: string;
	updateMaterialDescription: (description: string) => void;
	handleMaterialVinculation: (materialId: string) => void;
	handleMaterialUnvinculation: () => void;
};
function MaterialList({
	materials,
	vinculatedMaterialId,
	materialDescription,
	updateMaterialDescription,
	handleMaterialVinculation,
	handleMaterialUnvinculation,
}: MaterialListProps) {
	return (
		<>
			{/**HEADER BLOCK */}
			<div className="flex w-full flex-col gap-1">
				<div className="flex w-full items-center justify-center gap-2">
					<Box size={15} />
					<h1 className="text-center text-sm font-medium tracking-tight text-primary/80">MENU DE MATERIAIS</h1>
				</div>
				<input
					type="text"
					disabled={!!vinculatedMaterialId}
					value={materialDescription}
					onChange={(e) => updateMaterialDescription(e.target.value)}
					placeholder="Filtre o item desejado..."
					className="h-full w-full italic outline-none"
				/>
			</div>
			<div className="my-2 h-[1px] w-full bg-primary/30" />
			<div className="flex w-full grow flex-col gap-2 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{materials.length > 0 ? (
					materials.map((material) => (
						<div key={material._id} className="group flex w-full items-center justify-between gap-2 rounded px-2 py-1 hover:bg-blue-100">
							<div className="flex items-center gap-2">
								<h1 className="text-sm font-medium tracking-tight text-primary">{material.nome}</h1>
								<div className="flex items-center gap-1">
									<Ruler width={15} height={15} />
									<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{material.grandeza}</h1>
								</div>
								<div className="flex items-center gap-1">
									<Warehouse width={15} height={15} />
									<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{material.alocadorDados?.nome || "N/A"}</h1>
								</div>
							</div>
							<button
								type="button"
								onClick={() => {
									if (vinculatedMaterialId === material._id) {
										handleMaterialUnvinculation();
									} else {
										handleMaterialVinculation(material._id);
									}
								}}
								className={cn(
									"flex items-center justify-center rounded-full bg-blue-500 p-1 text-xs font-medium text-white duration-300 ease-in-out hover:bg-blue-700",
									vinculatedMaterialId === material._id && "bg-green-500 hover:bg-green-700",
								)}
							>
								<Link size={12} />
							</button>
						</div>
					))
				) : materialDescription.trim().length > 3 ? (
					<NewMaterialMenu initialName={materialDescription} />
				) : (
					<p className="text-center text-xs font-medium italic text-primary/80">Nenhum material encontrado...</p>
				)}
			</div>
		</>
	);
}
type NewMaterialMenuProps = {
	initialName: string;
};
function NewMaterialMenu({ initialName }: NewMaterialMenuProps) {
	const queryClient = useQueryClient();
	const [newMaterial, setNewMaterial] = useState<TMaterial>({
		nome: initialName,
		grandeza: "UN",
		qtde: 0,
		dataInsercao: new Date().toISOString(),
		preco: 0,
		alocadorId: null,
		nomeTecnico: null,
		qtdeMaxima: null,
	});

	const { mutate: handleCreateMaterial, isPending } = useMutation({
		mutationKey: ["create-material"],
		mutationFn: createMaterial,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["materials-vinculation-search"] });
		},
		onSuccess: () => {
			toast.success("Material criado com sucesso!");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["materials-vinculation-search"] });
		},
	});
	return (
		<div className="flex w-full grow flex-col items-center justify-center gap-1">
			<h1 className="w-full text-center text-xs font-medium tracking-tight text-primary/80">Adicione um novo material ao estoque.</h1>
			<h1 className="rounded-lg bg-primary px-2 py-1 text-[0.65rem] text-primary-foreground">{initialName}</h1>
			<div className="flex items-center">
				<SelectInput
					label="GRANDEZA"
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					value={newMaterial.grandeza}
					selectedItemLabel={"NÃO DEFINIDO"}
					options={units}
					handleChange={(value) => setNewMaterial((prev) => ({ ...prev, grandeza: value }))}
					onReset={() => setNewMaterial((prev) => ({ ...prev, grandeza: "UN" }))}
				/>
			</div>
			<LoadingButton loading={isPending} onClick={() => handleCreateMaterial({ info: { ...newMaterial, nome: initialName } })} size={"xs"}>
				CRIAR MATERIAL
			</LoadingButton>
		</div>
	);
}
