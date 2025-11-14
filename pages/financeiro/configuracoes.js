import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdOutlineAddCircle } from "react-icons/md";
import ApportionmentItem from "../../components/identificador/centrosDeCusto/ApportionmentItem";
import EditApportionment from "../../components/identificador/centrosDeCusto/EditApportionment";
import NewApportionment from "../../components/identificador/centrosDeCusto/NewApportionment";
import EditReceiptAccount from "../../components/identificador/contasDeRecebimento/EditReceiptAccount";
import NewReceiptAccount from "../../components/identificador/contasDeRecebimento/NewReceiptAccount";
import AccountItem from "../../components/identificador/contasDeRecebimento/ReceiptAccountItem";
import { useSession } from "../../components/providers/SessionProvider";
import LoadingPage from "../../components/utils/LoadingPage";
import { useCostApportionments } from "../../utils/methods/query/costApportionments";
import { useReceiptAccounts } from "../../utils/methods/query/receiptAccounts";

function Configuracoes() {
	const router = useRouter();
	const { session } = useSession({
		onUnauthenticated: () => router.push("/auth/signin"),
	});
	const {
		data: apportionments,
		isFetching: apportionmentsFetching,
		isSuccess: apportionmentsSuccess,
	} = useCostApportionments(session.user.permissoes.financeiro.visualizar);
	const {
		data: receiptAccounts,
		isFetching: receiptAccountsFetching,
		isSuccess: receiptAccountsSuccess,
	} = useReceiptAccounts(session.user.permissoes.financeiro.visualizar);

	const [newApportionmentModalIsOpen, setNewApportionmentModalIsOpen] = useState(false);
	const [newAccountModalIsOpen, setNewAccountModalIsOpen] = useState(false);

	const [editApportionment, setEditApportionment] = useState({
		isOpen: false,
		id: null,
	});
	const [editAccount, setEditAccount] = useState({
		isOpen: false,
		id: null,
	});
	function handleOpenEditApportionment(id) {
		setEditApportionment({ id: id, isOpen: true });
	}
	function handleOpenEditAccount(id) {
		setEditAccount({ id: id, isOpen: true });
	}
	console.log(receiptAccounts);
	return (
		<div className="flex grow flex-col gap-2 p-6">
			<div className="border-primary/20 flex w-full flex-col border-b pb-1">
				<p className="text-start text-2xl font-bold text-[#15599a] uppercase">CONFIGURAÇÕES</p>
			</div>
			<div className="flex w-full items-start gap-2 py-2">
				<div className="border-primary/20 flex h-[500px] max-h-[500px] w-[50%] flex-col rounded border shadow-lg">
					<div className="flex w-full items-center justify-between px-2">
						<h1 className="border-primary/20 font-raleway border-b p-3 pb-1 text-center font-black">CENTROS DE CUSTO</h1>
						<button type="button" onClick={() => setNewApportionmentModalIsOpen(true)}>
							<MdOutlineAddCircle color="rgb(34,197,94)" size={"25px"} />
						</button>
					</div>

					<div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex grow flex-col gap-3 overflow-y-auto px-2 py-2">
						{apportionmentsFetching ? <LoadingPage /> : null}
						{apportionmentsSuccess
							? apportionments?.map((apportionment, index) => (
									<ApportionmentItem
										key={`${index.toString()}-${apportionment.id}`}
										apportionment={apportionment}
										openEditModal={handleOpenEditApportionment}
									/>
								))
							: null}
					</div>
				</div>
				<div className="border-primary/20 flex h-[500px] max-h-[500px] w-[50%] flex-col rounded border shadow-lg">
					<div className="flex w-full items-center justify-between px-2">
						<h1 className="border-primary/20 font-raleway border-b p-3 pb-1 text-center font-black">CONTAS DE RECEBIMENTO</h1>
						<button type="button" onClick={() => setNewAccountModalIsOpen(true)}>
							<MdOutlineAddCircle color="rgb(34,197,94)" size={"25px"} />
						</button>
					</div>
					<div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex grow flex-col gap-3 overflow-y-auto">
						{receiptAccountsFetching ? <LoadingPage /> : null}
						{receiptAccountsSuccess
							? receiptAccounts?.map((account, index) => (
									<AccountItem key={`${index.toString()}-${account.id}`} account={account} openEditModal={handleOpenEditAccount} />
								))
							: null}
					</div>
				</div>
			</div>
			{editApportionment.id && editApportionment.isOpen ? (
				<EditApportionment apportionmentId={editApportionment.id} closeModal={() => setEditApportionment({ id: null, isOpen: false })} />
			) : null}
			{editAccount.id && editAccount.isOpen ? (
				<EditReceiptAccount receiptAccountId={editAccount.id} closeModal={() => setEditAccount({ id: null, isOpen: false })} />
			) : null}
			{newApportionmentModalIsOpen ? <NewApportionment closeModal={() => setNewApportionmentModalIsOpen(false)} /> : null}
			{newAccountModalIsOpen ? <NewReceiptAccount closeModal={() => setNewAccountModalIsOpen((prev) => !prev)} /> : null}
		</div>
	);
}

export default Configuracoes;
