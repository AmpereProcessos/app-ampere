import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "../../inputs/Text";
import { useQueryClient } from "@tanstack/react-query";
import { useReceiptAccountById } from "../../../utils/methods/query/receiptAccounts";
import LoadingPage from "../../utils/LoadingPage";
import { BiSolidError } from "react-icons/bi";
import { useEditReceiptAccount } from "../../../utils/methods/mutation/receiptAccounts";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "../../../utils/methods/handlers";
const MODAL_STYLES = {
	position: "fixed",
	top: "50%",
	left: "50%",
	transform: "translate(-50%,-50%)",
	backgroundColor: "#fff",
	borderRadius: "10px",
	padding: "10px",
	zIndex: 1000,
};
const OVERLAY_STYLES = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: "rgba(0,0,0,.7)",
	zIndex: 1000,
};

function EditReceiptAccount({ receiptAccountId, closeModal }) {
	const queryClient = useQueryClient();
	const { data: account, isLoading: accountLoading, isSuccess: accountSuccess, isError: accountError } = useReceiptAccountById(receiptAccountId);
	const { mutate: editReceiptAccount, isLoading: editReceiptAccountLoading } = useEditReceiptAccount();
	const [infoHolder, setInfoHolder] = useState(account);
	async function handleReceiptAccountEdit() {
		if (infoHolder.nome?.trim().length < 2) {
			toast.error("Preencha um nome válido.");
			return false;
		}
		const loadingToastId = toast.loading("Carregando...");
		try {
			editReceiptAccount(
				{ id: infoHolder._id, info: infoHolder },
				{
					onSuccess: async (data) => {
						toast.dismiss(loadingToastId);
						toast.success(data);

						await queryClient.cancelQueries({ queryKey: ["receiptAccounts"] });
					},
					onSettled: async () => {
						await queryClient.invalidateQueries({ queryKey: ["receiptAccounts"] });
					},
				},
			);
		} catch (error) {
			toast.dismiss(loadingToastId);
			const msg = getErrorMessage(error);
			toast.error(msg);
		}
	}
	useEffect(() => {
		setInfoHolder(account);
	}, [account]);
	return (
		<div style={OVERLAY_STYLES}>
			<div className="h-[50%] w-[80%] lg:h-[30%] lg:w-[30%]" style={MODAL_STYLES}>
				<div className="flex h-full w-full flex-col">
					<div className="border-primary/20 flex items-center justify-between border-b px-2 pb-2 text-lg">
						<div className="flex flex-col">
							<h1 className="pl-6 font-bold text-[#15599a]">EDIÇÃO DE CONTA DE RECEBIMENTO</h1>
							<h1 className="text-primary/60 pl-6 text-xs font-light italic">#{infoHolder?._id}</h1>
						</div>
						<button>
							<VscChromeClose onClick={() => closeModal()} style={{ color: "red" }} />
						</button>
					</div>
					{accountLoading ? (
						<div className="flex grow items-center justify-center">
							<LoadingPage />
						</div>
					) : null}
					{accountSuccess && infoHolder ? (
						<div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex w-full grow flex-col overflow-y-auto px-2 py-2">
							<TextInput
								label={"NOME DA CONTA DE RECEBIMENTO"}
								labelClassName="text-center text-primary/60 font-normal font-raleway text-sm"
								value={infoHolder.nome}
								handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
								placeholder={"Preencha aqui o nome a ser dado a nova conta de recebimento."}
								width={"100%"}
							/>
						</div>
					) : null}
					{accountError ? (
						<div className="flex grow flex-col items-center justify-center gap-1 text-red-500">
							<BiSolidError color="rgb(239,68,68)" size={35} />
							<p className="text-primary/60 text-center text-sm italic">Houve um erro as informações sobre essa conta de recebimento.</p>
							<p className="text-primary/60 text-center text-sm italic">Confira o funcionamento da sua internet.</p>
							<p className="text-primary/60 text-center text-sm italic">Em persistência do erro, comunique o setor de tecnologia.</p>
						</div>
					) : null}
					<div className="flex w-full items-center justify-end py-2">
						<button
							disabled={editReceiptAccountLoading}
							onClick={() => handleReceiptAccountEdit()}
							className="disabled:bg-primary/80 w-fit rounded border border-[#15599a] p-2 font-medium text-[#15599a] duration-300 ease-in-out hover:bg-[#15599a] hover:text-white disabled:text-white"
						>
							SALVAR
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditReceiptAccount;
