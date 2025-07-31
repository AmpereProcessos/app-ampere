import { useMediaQuery } from "@/lib/hooks/media-query";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { TGetComissionDataOutputByProjectId } from "@/app/api/comissoes/route";
import { useUsers } from "@/utils/methods/query/crm/users";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SelectWithImages from "@/components/inputs/SelectWithImages";
import SelectInput from "@/components/inputs/Select";
import NumberInput from "@/components/inputs/Number";

type NewProjectComissionedMenuProps = {
	comissionableValue: number;
	addComissioned: (comissioned: TGetComissionDataOutputByProjectId["comissoes"]["comissionados"][number]) => void;
	closeModal: () => void;
};
function NewProjectComissionedMenu({ comissionableValue, addComissioned, closeModal }: NewProjectComissionedMenuProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const [infoHolder, setInfoHolder] = useState<TGetComissionDataOutputByProjectId["comissoes"]["comissionados"][number]>({
		nome: "",
		papel: "VENDEDOR",
		porcentagem: 0,
		valor: 0,
	});
	function updateInfoHolder(changes: Partial<TGetComissionDataOutputByProjectId["comissoes"]["comissionados"][number]>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}
	const MENU_TITLE = "NOVO COMISSIONADO";
	const MENU_DESCRIPTION = "Adicione um novo comissionado ao projeto.";
	const BUTTON_TEXT = "ADICIONAR COMISSIONADO";
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[70vh]">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto px-4">
					<ProjectComissionDataBlock comissionableValue={comissionableValue} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					<Button
						onClick={() => {
							addComissioned(infoHolder);
							closeModal();
						}}
					>
						{BUTTON_TEXT}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="h-fit max-h-[70vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-auto px-4">
					<ProjectComissionDataBlock comissionableValue={comissionableValue} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
					<Button
						onClick={() => {
							addComissioned(infoHolder);
							closeModal();
						}}
					>
						{BUTTON_TEXT}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default NewProjectComissionedMenu;

type ProjectComissionDataBlockProps = {
	comissionableValue: number;
	infoHolder: TGetComissionDataOutputByProjectId["comissoes"]["comissionados"][number];
	updateInfoHolder: (infoHolder: Partial<TGetComissionDataOutputByProjectId["comissoes"]["comissionados"][number]>) => void;
};
function ProjectComissionDataBlock({ comissionableValue, infoHolder, updateInfoHolder }: ProjectComissionDataBlockProps) {
	const { data: crmUsers } = useUsers({ includeDeleted: false });
	return (
		<div className="w-full h-full flex flex-col gap-6">
			<SelectWithImages
				label="VENDEDOR"
				selectedItemLabel="NÃO DEFINIDO"
				options={crmUsers?.map((user) => ({ id: user._id, label: user.nome, value: user._id, image: user.avatar_url ?? undefined })) || []}
				value={infoHolder.idCrm}
				handleChange={(value) => {
					const crmUser = crmUsers?.find((user) => user._id === value);
					if (!crmUser) return;
					updateInfoHolder({ idCrm: crmUser._id, nome: crmUser.nome, avatar_url: crmUser.avatar_url ?? undefined });
				}}
				onReset={() => updateInfoHolder({ idCrm: undefined, papel: undefined })}
				width="100%"
			/>
			<SelectInput
				label="VENDEDOR"
				selectedItemLabel="NÃO DEFINIDO"
				options={[
					{
						id: 1,
						label: "VENDEDOR",
						value: "VENDEDOR",
					},
					{
						id: 2,
						label: "SDR",
						value: "SDR",
					},
					{
						id: 3,
						label: "ANALISTA TÉCNICO",
						value: "ANALISTA TÉCNICO",
					},
				]}
				value={infoHolder.papel}
				handleChange={(value) => updateInfoHolder({ papel: value ?? undefined })}
				onReset={() => updateInfoHolder({ papel: undefined })}
				width="100%"
			/>
			<NumberInput
				label="COMISSÃO (%)"
				value={infoHolder.porcentagem}
				handleChange={(v) => {
					updateInfoHolder({ porcentagem: v, valor: (v / 100) * comissionableValue });
				}}
				placeholder="Preencha aqui a porcentagem da comissão..."
				width="100%"
				labelClassName="text-[0.6rem]"
				holderClassName="text-xs p-2 min-h-[34px]"
			/>
			<NumberInput
				label="COMISSÃO (R$)"
				value={infoHolder.valor || null}
				handleChange={(v) => {
					updateInfoHolder({ valor: v, porcentagem: (v / comissionableValue) * 100 });
				}}
				placeholder="Preencha aqui o valor da comissão..."
				width="100%"
				labelClassName="text-[0.6rem]"
				holderClassName="text-xs p-2 min-h-[34px]"
			/>
		</div>
	);
}
