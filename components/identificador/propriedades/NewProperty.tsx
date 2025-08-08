import React, { useState } from "react";
import type { Session } from "next-auth";
import type { TProperty } from "@/utils/schemas/properties";

import { useQueryClient } from "@tanstack/react-query";

import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createProperty } from "@/utils/methods/mutation/properties";

import { useMediaQuery } from "@/lib/hooks/media-query";

import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import GeneralInfo from "./blocos/Generalnfo";
import VehicleProperties from "./VehicleProperties";

type NewPropertyProps = {
	session: Session;
	closeModal: () => void;
};
function NewProperty({ session, closeModal }: NewPropertyProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TProperty>({
		nome: "",
		identificador: "",
		metadados: {
			tipo: "VEÍCULO",
			kmInicial: 0,
			kmAcumulado: 0,
			kmIntervaloRevisao: 0,
			kmProximaRevisao: 0,
		},
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});

	function updateInfoHolder(info: Partial<TProperty>) {
		setInfoHolder((prev) => ({
			...prev,
			...info,
		}));
	}
	const { mutate: handleCreateProperty, isPending } = useMutationWithFeedback({
		mutationKey: ["create-property"],
		mutationFn: createProperty,
		queryClient: queryClient,
		affectedQueryKey: ["properties"],
	});
	const MENU_TITLE = "NOVA PROPRIEDADE";
	const MENU_DESCRIPTION = "Preencha os campos abaixo para criar uma nova propriedade.";
	const BUTTON_TEXT = "CADASTRAR";
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[80vh] dark:bg-white">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
					<NewPropertyContent infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					<LoadingButton onClick={() => handleCreateProperty({ info: infoHolder })} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
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

				<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
					<NewPropertyContent infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
					<LoadingButton onClick={() => handleCreateProperty({ info: infoHolder })} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default NewProperty;

type NewPropertyContentProps = {
	infoHolder: TProperty;
	updateInfoHolder: (info: Partial<TProperty>) => void;
};
function NewPropertyContent({ infoHolder, updateInfoHolder }: NewPropertyContentProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 px-4 lg:px-0">
			<GeneralInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<VehicleProperties infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</div>
	);
}
