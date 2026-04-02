import React, { useState } from "react";

import type { TAuthSession } from "@/lib/authentication/types";
import type { TExpense } from "@/utils/schemas/expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useMediaQuery } from "@/lib/hooks/media-query";

import { getErrorMessage } from "@/utils/methods/handlers";
import { createExpense } from "@/utils/methods/mutation/expenses";
import { useExpenseProject } from "@/utils/methods/query/expenses";
import ExpenseGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import ExpenseItemsInformationBlock from "./blocos/ItemsInformationBlock";
import ExpensePaymentsBlock from "./blocos/PaymentsBlock";
import ExpenseProjectInformationBlock from "./blocos/ProjectInformationBlock";
import ExpenseProjectVinculation from "./blocos/utils/ProjectVinculation";

type NewExpenseProps = {
	initialState?: Partial<TExpense>;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};

function NewExpense({ session, closeModal, callbacks, initialState }: NewExpenseProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const queryClient = useQueryClient();

	const initialInfoHolder: TExpense = {
		identificador: initialState?.identificador ?? null,
		rateio: initialState?.rateio || "",
		categoria: initialState?.categoria || "",
		descricao: initialState?.descricao || "",
		projeto: {
			id: initialState?.projeto?.id || null,
			nome: initialState?.projeto?.nome || null,
			identificador: initialState?.projeto?.identificador || null,
			tipo: initialState?.projeto?.tipo || null,
		},
		autor: {
			id: initialState?.autor?.id || session.user?.id,
			nome: initialState?.autor?.nome || session.user.nome,
			avatar_url: initialState?.autor?.avatar_url || session.user.avatar_url,
		},
		itens: initialState?.itens || [],
		total: initialState?.total || 0,
		efetivacao: {
			efetivado: false,
			data: null,
		},
		pagamentos: [],
		criterioReferencia: false,
		criterioCompetencia: false,
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState(initialInfoHolder);

	const { data: project } = useExpenseProject({ projectId: infoHolder.projeto.id || null });

	const { mutate: handleCreateExpense, isPending } = useMutation({
		mutationKey: ["create-expense"],
		mutationFn: createExpense,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
			setInfoHolder(initialInfoHolder);
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});

	const MENU_TITLE = "NOVA DESPESA";
	const MENU_DESCRIPTION = "Preencha os dados para cadastrar uma nova despesa.";

	const formBody = (
		<>
			<ExpenseGeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			{project ? (
				<ExpenseProjectInformationBlock expense={infoHolder} project={project} />
			) : (
				<ExpenseProjectVinculation
					expenseId={undefined}
					infoHolder={infoHolder}
					setInfoHolder={setInfoHolder}
					affectedQueryKey={["expenses"]}
					queryClient={queryClient}
				/>
			)}
			<ExpenseItemsInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<ExpensePaymentsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
		</>
	);

	const dialogFooter = (
		<>
			<DialogClose asChild>
				<Button variant="outline">FECHAR</Button>
			</DialogClose>
			<LoadingButton
				loading={isPending}
				onClick={() =>
					//@ts-ignore
					handleCreateExpense(infoHolder)
				}
				type="button"
				className="bg-green-800 hover:bg-green-700"
			>
				CRIAR DESPESA
			</LoadingButton>
		</>
	);

	const drawerFooter = (
		<>
			<DrawerClose asChild>
				<Button variant="outline">FECHAR</Button>
			</DrawerClose>
			<LoadingButton
				loading={isPending}
				onClick={() =>
					//@ts-ignore
					handleCreateExpense(infoHolder)
				}
				type="button"
				className="bg-green-800 hover:bg-green-700"
			>
				CRIAR DESPESA
			</LoadingButton>
		</>
	);

	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="dark:bg-background flex max-h-[85vh] min-h-[70vh] min-w-[75vw] flex-col">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-y-2 overflow-y-auto px-1 py-1">
					{formBody}
				</div>
				<DialogFooter>{dialogFooter}</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer shouldScaleBackground={false} open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="flex h-fit max-h-[90vh] flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-y-2 overflow-y-auto px-4 py-1">
					{formBody}
				</div>
				<DrawerFooter>{drawerFooter}</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default NewExpense;
