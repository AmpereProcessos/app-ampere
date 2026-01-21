import DateInput from "@/components/inputs/Date";
import DateTimeInput from "@/components/inputs/DateTimeInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { getExcelFromJSON } from "@/lib/excel-utils";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { formatDate } from "@/utils/constants";
import { formatDateTimeForInput } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { fetchMaterialsSnapshot } from "@/utils/methods/query/materials";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";

type StockSnapshotExportMenuProps = {
	closeMenu: () => void;
};
function StockSnapshotExportMenu({ closeMenu }: StockSnapshotExportMenuProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const MENU_TITLE = "EXPORTAÇÃO DE SNAPSHOT DO ESTOQUE";
	const MENU_DESCRIPTION = "Selecione a data para exportar o estoque naquele momento.";
	const BUTTON_TEXT = "EXPORTAR SNAPSHOT";

	const [snapshotDate, setSnapshotDate] = useState<string>(dayjs().subtract(1, "day").endOf("day").toISOString());

	const { mutate: handleExportation, isPending: isExportationLoading } = useMutation({
		mutationKey: ["stock-snapshot-exportation", snapshotDate],
		mutationFn: async (paramDate: string) => {
			const exportation = await fetchMaterialsSnapshot(paramDate);
			const dateKey = dayjs(paramDate).format("DD-MM-YYYY");
			await getExcelFromJSON(exportation, `SNAPSHOT ESTOQUE ${dateKey}`);
		},
		onSuccess: () => {
			toast.success("Exportação realizada com sucesso!");
			closeMenu();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});

	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeMenu() : null)}>
			<DialogContent className="flex h-fit max-h-[70vh] min-h-[30vh] flex-col">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto">
					<SnapshotMenuContent snapshotDate={snapshotDate} setSnapshotDate={setSnapshotDate} />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" size={"sm"}>
							FECHAR
						</Button>
					</DialogClose>
					<LoadingButton onClick={() => handleExportation(snapshotDate)} loading={isExportationLoading} size={"sm"}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeMenu() : null)}>
			<DrawerContent className="flex h-fit max-h-[70vh] flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-auto">
					<SnapshotMenuContent snapshotDate={snapshotDate} setSnapshotDate={setSnapshotDate} />
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline" size={"sm"}>
							FECHAR
						</Button>
					</DrawerClose>
					<LoadingButton onClick={() => handleExportation(snapshotDate)} loading={isExportationLoading} size={"sm"}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default StockSnapshotExportMenu;

type SnapshotMenuContentProps = {
	snapshotDate: string;
	setSnapshotDate: (date: string) => void;
};
function SnapshotMenuContent({ snapshotDate, setSnapshotDate }: SnapshotMenuContentProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 px-2">
			<div className="flex w-full flex-col gap-3">
				<h1 className="text-sm font-bold leading-none tracking-tight">DATA DO SNAPSHOT</h1>
				<p className="text-muted-foreground text-xs">
					O snapshot mostrará as quantidades dos materiais como estavam no final do dia selecionado, revertendo todas as alterações feitas após essa data.
				</p>
				<DateTimeInput
					label="DATA DE REFERÊNCIA"
					labelClassName="text-[0.6rem]"
					value={formatDateTimeForInput(snapshotDate)}
					handleChange={(v) => {
						const dateValue = formatDateInputChange(v, "string", false) as string;
						setSnapshotDate(dateValue || new Date().toISOString());
					}}
					width="100%"
				/>
			</div>
		</div>
	);
}
