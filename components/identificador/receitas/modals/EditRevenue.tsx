import type { TAuthSession } from "@/lib/authentication/types";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { VscChromeClose } from "react-icons/vsc";

import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { editRevenue } from "@/utils/methods/mutation/revenues";
import { useRevenueById } from "@/utils/methods/query/revenues";
import type { TRevenue, TRevenueDTO } from "@/utils/schemas/revenues";

import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import RevenueProjectInformationBlock from "../modals/blocos/ProjectInformationBlock";
import RevenueProjectVinculation from "../modals/blocos/utils/ProjectVinculation";
import RevenueGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import RevenueReceiptsBlock from "./blocos/ReceiptsBlock";

function getMissingPercentage({ fractionnement }: { fractionnement: TRevenueDTO["fracionamento"] }) {
	const currentTotal = fractionnement.reduce((acc, current) => current.porcentagem + acc, 0);
	return 100 - currentTotal;
}
type EditRevenueProps = {
	revenueId: string;
	session: TAuthSession;
	closeModal: () => void;
};
function EditRevenue({ revenueId, session, closeModal }: EditRevenueProps) {
	const queryClient = useQueryClient();
	const { data: revenue, isLoading, isError, isSuccess, error } = useRevenueById({ id: revenueId });
	const [infoHolder, setInfoHolder] = useState<TRevenue>({
		nome: "",
		tipo: "",
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		projeto: {
			id: null,
			nome: null,
			identificador: null,
		},
		total: 0,
		metodo: "",
		efetivacao: {
			efetivado: false,
			data: null,
		},
		fracionamento: [],
		dataInsercao: new Date().toISOString(),
	});

	const { mutate: handleEditRevenue, isPending: isUpdateLoading } = useMutationWithFeedback({
		mutationKey: ["edit-revenue", revenueId],
		mutationFn: editRevenue,
		queryClient: queryClient,
		affectedQueryKey: ["revenues"],
		callbackFn: () => console.log(),
	});
	useEffect(() => {
		if (revenue) setInfoHolder(revenue);
	}, [revenue]);
	return (
		<div id="defaultModal" className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-[rgba(0,0,0,.85)]">
			<div className="bg-background fixed top-[50%] left-[50%] z-100 h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] lg:w-[70%]">
				<div className="flex h-full flex-col">
					<div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-primary dark:text-white">ATUALIZAR RECEITA</h3>
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
							<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1">
								<RevenueGeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
								{revenue.projetoDados ? (
									<RevenueProjectInformationBlock revenue={infoHolder} project={revenue.projetoDados} />
								) : (
									<RevenueProjectVinculation
										revenueId={revenueId}
										infoHolder={infoHolder}
										setInfoHolder={setInfoHolder}
										affectedQueryKey={["revenue-by-id", revenueId]}
										queryClient={queryClient}
									/>
								)}
								<RevenueReceiptsBlock revenueId={revenueId} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
							</div>
							<div className="mt-2 flex w-full items-center justify-end">
								<LoadingButton
									loading={isUpdateLoading}
									onClick={() =>
										//@ts-ignore
										handleEditRevenue({ id: revenueId, changes: infoHolder })
									}
									type="button"
									className="bg-blue-800 hover:bg-blue-700"
								>
									ATUALIZAR RECEITA
								</LoadingButton>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default EditRevenue;
