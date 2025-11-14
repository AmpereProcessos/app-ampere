import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FaLock } from "react-icons/fa";
import TextareaInput from "../inputs/TextareaInput";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "../utils/Buttons/LoadingButton";
import { Button } from "../ui/button";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useMutation } from "@tanstack/react-query";
import { updateProjectRestriction } from "@/utils/methods/mutation/clients";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/methods/handlers";
import type { TAuthSession } from "@/lib/authentication/types";
type RestrictionBlockProps = {
	projectId: string;
	session: TAuthSession;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: () => void;
		onSettled?: () => void;
	};
};
function RestrictionBlock({ projectId, infoHolder, callbacks }: RestrictionBlockProps) {
	const [isRestrictionMenuOpen, setIsRestrictionMenuOpen] = useState(false);
	return (
		<div className="border-primary/60 flex w-full flex-col gap-2 rounded-md border pb-2 shadow-lg">
			<div className="bg-primary/60 mb-2 flex w-full items-center justify-center gap-1 rounded-tl-md rounded-tr-md py-2 text-center font-bold text-white">
				<FaLock />
				<h1>RESTRIÇÃO DE PROJETO</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2">
				{infoHolder.restricao?.aplicavel ? (
					<div className="flex flex-col gap-2">
						<h2 className="text-center text-lg leading-none font-bold">O projeto em questão está restrito.</h2>
						<h3 className="text-center text-lg leading-none font-semibold">
							Restrição feita em {formatDateAsLocale(infoHolder.restricao?.data)} por {infoHolder.restricao?.autor?.nome}.
						</h3>
						<div className="bg-primary/20 flex w-full items-center justify-center rounded-md p-2">
							<p className="text-center text-sm">{infoHolder.restricao?.observacoes}</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-1">
						<h2 className="text-center text-lg leading-none font-bold">O projeto em questão NÃO foi restringido.</h2>
					</div>
				)}
				<Button size={"fit"} variant={"ghost"} className="self-center px-2 py-1" onClick={() => setIsRestrictionMenuOpen(true)}>
					ABRIR MENU DE RESTRIÇÃO
				</Button>
			</div>
			{isRestrictionMenuOpen ? (
				<ProjectRestrictionMenu
					projectId={projectId}
					currentRestriction={infoHolder.restricao}
					closeMenu={() => setIsRestrictionMenuOpen(false)}
					callbacks={callbacks}
				/>
			) : null}
		</div>
	);
}

export default RestrictionBlock;

type ProjectRestrictionMenuProps = {
	projectId: string;
	currentRestriction: TProject["restricao"];
	closeMenu: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: () => void;
		onSettled?: () => void;
	};
};
function ProjectRestrictionMenu({ projectId, currentRestriction, closeMenu, callbacks }: ProjectRestrictionMenuProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const MENU_TITLE = "RESTRIÇÃO DE PROJETO";
	const MENU_DESCRIPTION = "Gerencie as informações completas do projeto.";

	const { mutate: updateProjectRestrictionMutation, isPending: isUpdatingProjectRestriction } = useMutation({
		mutationKey: ["update-project-restriction", projectId],
		mutationFn: updateProjectRestriction,
		onMutate: () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: (data) => {
			toast.success(data.message);
			if (callbacks?.onSuccess) callbacks.onSuccess();
			closeMenu();
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
			if (callbacks?.onError) callbacks.onError();
		},
		onSettled: () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
	});
	function RestrictedContent() {
		return (
			<div className="flex w-full flex-col gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-center text-lg leading-none font-bold">O projeto em questão está restrito.</h2>
					<h3 className="text-center text-lg leading-none font-semibold">
						Restrição feita em {formatDateAsLocale(currentRestriction?.data)} por {currentRestriction?.autor?.nome}.
					</h3>
				</div>
				<div className="bg-primary/20 flex w-full items-center justify-center rounded-md p-2">
					<p className="text-center text-sm">{currentRestriction?.observacoes}</p>
				</div>
				<LoadingButton
					size={"fit"}
					variant={"ghost"}
					className="self-center px-2 py-1"
					onClick={() => updateProjectRestrictionMutation({ projectId, type: "REMOVE_RESTRICTION" })}
					loading={isUpdatingProjectRestriction}
				>
					REMOVER RESTRIÇÃO
				</LoadingButton>
			</div>
		);
	}
	function UnrestrictedContent() {
		const [observations, setObservations] = useState("");
		return (
			<div className="flex w-full flex-col gap-3">
				<div className="flex flex-col gap-1">
					<h2 className="text-center text-lg leading-none font-bold">O projeto em questão não está restrito.</h2>
					<h3 className="text-center text-lg leading-none font-semibold">Se deseja restringi-lo, preencha as observações abaixo.</h3>
				</div>
				<TextareaInput
					label="OBSERVAÇÕES SOBRE A RESTRIÇÃO"
					placeholder="Preencha aqui observações, justificativas e afins sobre a restrição..."
					value={observations}
					handleChange={setObservations}
				/>
				<LoadingButton
					size={"fit"}
					variant={"destructive"}
					className="self-center px-2 py-1"
					onClick={() => updateProjectRestrictionMutation({ projectId, type: "ADD_RESTRICTION", observations })}
					loading={isUpdatingProjectRestriction}
				>
					RESTRINGIR PROJETO
				</LoadingButton>
			</div>
		);
	}
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeMenu() : null)}>
			<DialogContent className="dark:bg-background flex h-fit flex-col">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
					{currentRestriction?.aplicavel ? <RestrictedContent /> : <UnrestrictedContent />}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
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

				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
					{currentRestriction?.aplicavel ? <RestrictedContent /> : <UnrestrictedContent />}
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
