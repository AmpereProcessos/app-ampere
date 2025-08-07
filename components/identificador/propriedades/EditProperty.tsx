import React, { useEffect, useState } from "react";
import type { Session } from "next-auth";
import type { TProperty } from "@/utils/schemas/properties";

import { useQueryClient } from "@tanstack/react-query";

import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createProperty, updateProperty } from "@/utils/methods/mutation/properties";

import { useMediaQuery } from "@/lib/hooks/media-query";

import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import GeneralInfo from "./blocos/Generalnfo";
import VehicleProperties from "./VehicleProperties";
import { usePropertyById } from "@/utils/methods/query/properties";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";

type EditPropertyProps = {
	propertyId: string;
	session: Session;
	closeModal: () => void;
};
function EditProperty({ propertyId, session, closeModal }: EditPropertyProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TProperty>({
		nome: "",
		identificador: "",
		tags: [],
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
	const { data: property, isLoading, isError, isSuccess, error } = usePropertyById({ id: propertyId });
	const { mutate: handleUpdateProperty, isPending: updateLoading } = useMutationWithFeedback({
		mutationKey: ["update-property", propertyId],
		mutationFn: updateProperty,
		queryClient: queryClient,
		affectedQueryKey: ["properties"],
	});
	useEffect(() => {
		if (property) setInfoHolder(property);
	}, [property]);

	const MENU_TITLE = "EDITAR PROPRIEDADE";
	const MENU_DESCRIPTION = "Preencha os campos abaixo para editar a propriedade.";
	const BUTTON_TEXT = "ATUALIZAR";
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[80vh] dark:bg-white">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
							<PropertyContent infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton onClick={() => handleUpdateProperty({ id: propertyId, changes: infoHolder })} loading={updateLoading}>
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
						<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
							<PropertyContent infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton onClick={() => handleUpdateProperty({ id: propertyId, changes: infoHolder })} loading={updateLoading}>
								{BUTTON_TEXT}
							</LoadingButton>
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

export default EditProperty;

type PropertyContentProps = {
	infoHolder: TProperty;
	updateInfoHolder: (info: Partial<TProperty>) => void;
};
function PropertyContent({ infoHolder, updateInfoHolder }: PropertyContentProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 px-4 lg:px-0">
			<GeneralInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<VehicleProperties infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</div>
	);
}
