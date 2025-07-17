import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { TCreditCardOption } from "@/utils/schemas/credit-card-options";
import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import PaymentOptionsMenu from "./PaymentOptionsMenu";
import { Button } from "@/components/ui/button";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useCreditCardOptionById } from "@/utils/methods/query/credit-card-options";
import { updateCreditCardOption } from "@/utils/methods/mutation/credit-card-options";
import { useQueryClient } from "@tanstack/react-query";
import LoadingPage from "@/components/utils/LoadingPage";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";

type EditCreditCardOptionProps = {
	optionId: string;
	closeModal: () => void;
};
function EditCreditCardOption({ optionId, closeModal }: EditCreditCardOptionProps) {
	const queryClient = useQueryClient();
	const { data: option, isLoading, isSuccess, isError, error } = useCreditCardOptionById({ id: optionId });
	const [infoHolder, setInfoHolder] = useState<TCreditCardOption>({
		empresa: "",
		modalidade: "SEM ANTECIPAÇÃO",
		opcoes: [],
	});

	const { mutate: handleUpdate, isPending: updateLoading } = useMutationWithFeedback({
		mutationKey: ["update-credit-card-option"],
		mutationFn: updateCreditCardOption,
		queryClient: queryClient,
		affectedQueryKey: ["credit-card-options"],
		callbackFn: async () => await queryClient.invalidateQueries({ queryKey: ["credit-card-option-by-id", optionId] }),
	});
	useEffect(() => {
		if (option) setInfoHolder(option);
	}, [option]);
	return (
		<div id="edit-credit-card-option" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]  lg:w-[50%]">
				<div className="flex h-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR OPÇÃO</h3>
						<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						<>
							<div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
								<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
									<div className="w-full lg:w-1/2">
										<TextInput
											label="NOME DA EMPRESA"
											placeholder="Preencha aqui o nome da empresa..."
											value={infoHolder.empresa}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, empresa: value }))}
											width="100%"
										/>
									</div>
									<div className="w-full lg:w-1/2">
										<SelectInput
											label="MODALIDADE"
											value={infoHolder.modalidade}
											options={[
												{ id: 1, label: "SEM ANTECIPAÇÃO", value: "SEM ANTECIPAÇÃO" },
												{ id: 2, label: "COM ANTECIPAÇÃO", value: "COM ANTECIPAÇÃO" },
											]}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, modalidade: value }))}
											onReset={() => setInfoHolder((prev) => ({ ...prev, modalidade: "SEM ANTECIPAÇÃO" }))}
											selectedItemLabel="NÃO DEFINIDO"
											width="100%"
										/>
									</div>
								</div>
								<PaymentOptionsMenu infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
							</div>
							<div className="flex w-full items-center justify-end">
								<Button
									disabled={updateLoading}
									onClick={() =>
										// @ts-ignore
										handleUpdate({ id: optionId, changes: infoHolder })
									}
									type="button"
								>
									ATUALIZAR OPÇÃO
								</Button>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default EditCreditCardOption;
