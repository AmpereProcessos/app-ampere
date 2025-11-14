import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import * as Dialog from "@radix-ui/react-dialog";
import { TAuthSession } from "@/lib/authentication/types";
import AllocatorGeneral from "./blocos/General";
import { TAllocator } from "@/utils/schemas/allocators";
import AllocatorLocation from "./blocos/Location";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { toast } from "react-hot-toast";
import { updateAllocator } from "@/utils/methods/mutation/allocators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/utils/methods/handlers";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useAllocatorById } from "@/utils/methods/query/allocators";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";

type ControlAllocatorProps = {
	allocatorId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function ControlAllocator({ allocatorId, session, closeModal, callbacks }: ControlAllocatorProps) {
	const queryClient = useQueryClient();

	const { data: allocator, isLoading, isSuccess, isError, error } = useAllocatorById({ id: allocatorId });
	const initialState: TAllocator = {
		nome: "",
		descricao: "",
		localizacao: {
			uf: "",
			cidade: "",
		},
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState<TAllocator>(initialState);

	function updateAllocatorInfoHolder(changes: Partial<TAllocator>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}
	const { mutate, isPending: isUpdateLoading } = useMutation({
		mutationKey: ["update-allocator"],
		mutationFn: updateAllocator,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["allocator-by-id", allocatorId] });
			if (!!callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (!!callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data.message);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["allocator-by-id", allocatorId] });
			if (!!callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});
	useEffect(() => {
		if (allocator) setInfoHolder(allocator);
	}, [allocator]);
	return (
		<Dialog.Root open={true} onOpenChange={closeModal}>
			<Dialog.Overlay className="bg-primary/70 fixed inset-0 z-100 backdrop-blur-xs" />
			<Dialog.Content className="bg-background fixed top-[50%] left-[50%] z-100 h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] lg:h-[60%] lg:w-[50%]">
				<div className="flex h-full w-full flex-col">
					<div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-sm font-bold lg:text-xl">EDITAR ALOCADOR</h3>
						<button
							onClick={() => closeModal()}
							type="button"
							className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
						>
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>

					{isLoading ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						<>
							<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1">
								<AllocatorGeneral data={infoHolder} updateAllocator={updateAllocatorInfoHolder} />
								<AllocatorLocation data={infoHolder} updateAllocator={updateAllocatorInfoHolder} />
							</div>
							<div className="mt-2 flex w-full items-center justify-end">
								<LoadingButton loading={isUpdateLoading} onClick={() => mutate({ id: allocatorId, changes: infoHolder })} type="button">
									ATUALIZAR ALOCADOR
								</LoadingButton>
							</div>
						</>
					) : null}
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}

export default ControlAllocator;
