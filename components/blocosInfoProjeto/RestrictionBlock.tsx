import type { TProject, TProjectDTO, TProjectRestriction } from "@/utils/schemas/projects";
import type { Session } from "next-auth";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FaLock } from "react-icons/fa";
import CheckboxInput from "../inputs/Checkbox";
import TextareaInput from "../inputs/TextareaInput";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "../utils/Buttons/LoadingButton";
import { Button } from "../ui/button";
type RestrictionBlockProps = {
	session: Session;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
};
function RestrictionBlock({ session, infoHolder, setInfo, changes, setChanges }: RestrictionBlockProps) {
	return (
		<div className="flex w-full flex-col gap-2 rounded-md border border-gray-500 pb-2 shadow-lg">
			<div className="mb-2 flex w-full items-center justify-center gap-1 rounded-tr-md rounded-tl-md bg-gray-500 py-2 text-center font-bold text-white">
				<FaLock />
				<h1>RESTRIÇÃO DE PROJETO</h1>
			</div>
			<div className="w-fit self-center">
				<CheckboxInput
					labelFalse="RESTRINGIR PROJETO"
					labelTrue="RESTRINGIR PROJETO"
					checked={!!infoHolder.restricao?.aplicavel}
					handleChange={(value) => {
						setInfo((prev) => ({ ...prev, restricao: { ...(prev.restricao || {}), aplicavel: value } }));
						setChanges((prev) => ({ ...prev, "restricao.aplicavel": value }));
					}}
				/>
			</div>
			<TextareaInput
				label="OBSERVAÇÕES SOBRE A RESTRIÇÃO"
				placeholder="Preencha aqui observações, justificativas e afins sobre a restrição..."
				value={infoHolder.restricao?.observacoes || ""}
				handleChange={(value) => {
					setInfo((prev) => ({ ...prev, restricao: { ...(prev.restricao || {}), observacoes: value } }));
					setChanges((prev) => ({ ...prev, "restricao.observacoes": value }));
				}}
			/>
		</div>
	);
}

export default RestrictionBlock;

type ProjectRestrictionMenuProps = {
	initialRestriction: TProject["restricao"];
	session: Session;
	closeMenu: () => void;
};
function ProjectRestrictionMenu({ initialRestriction, session, closeMenu }: ProjectRestrictionMenuProps) {
	const [restrictionHolder, setRestrictionHolder] = useState<TProjectRestriction>(
		initialRestriction || {
			aplicavel: false,
			observacoes: "",
			autor: {
				id: "",
				nome: "",
				avatar: "",
			},
		},
	);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const MENU_TITLE = "RESTRIÇÃO DE PROJETO";
	const MENU_DESCRIPTION = "Gerencie as informações completas do projeto.";
	const BUTTON_TEXT = "SALVAR ALTERAÇÕES";

	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeMenu() : null)}>
			<DialogContent className="flex flex-col min-h-[80vh] max-h-[80vh] dark:bg-white min-w-[80vw]">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
					<ModalDatabaseContent
						session={session}
						projectId={projectId}
						project={project}
						infoHolder={infoHolder}
						setInfoHolder={createNonNullableSetter(setInfo)}
						changes={changes}
						setChanges={setChanges}
						clientChanges={clientChanges}
						setClientChanges={setClientChanges}
						userHasOverallAccess={userHasOverallAccess}
						userHasOeMAccess={userHasOeMAccess}
						userHasRestrictionPermission={userHasRestrictionPermission}
						userHasComissionValuesAccess={userHasComissionValuesAccess}
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					<LoadingButton onClick={() => {}} loading={false}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeMenu() : null)}>
			<DrawerContent className="h-fit max-h-[70vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
					<ModalDatabaseContent
						session={session}
						projectId={projectId}
						project={project}
						infoHolder={infoHolder}
						setInfoHolder={createNonNullableSetter(setInfo)}
						changes={changes}
						setChanges={setChanges}
						clientChanges={clientChanges}
						setClientChanges={setClientChanges}
						userHasOverallAccess={userHasOverallAccess}
						userHasOeMAccess={userHasOeMAccess}
						userHasRestrictionPermission={userHasRestrictionPermission}
						userHasComissionValuesAccess={userHasComissionValuesAccess}
					/>
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
					<LoadingButton onClick={() => {}} loading={false}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
