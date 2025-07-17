import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createNotification, editNotification } from "../../../utils/methods/mutation/notifications";
import { TNotification, TNotificationDTO } from "@/utils/schemas/notifications";
import dayjs from "dayjs";
import { Session } from "next-auth";
import React, { useState } from "react";
import { BsCalendarCheck, BsCalendarPlus, BsCheck, BsCheckAll, BsCode } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import { useQueryClient } from "@tanstack/react-query";
import { formatDateAsLocale } from "@/utils/methods/formatting";

function renderHeader({ projectName, sender }: { projectName: string; sender: string }) {
	if (sender == "SISTEMA") return <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">AUTOMAÇÃO</h1>;

	return (
		<h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">
			<strong className="text-[#15599a]">{sender.toUpperCase()}</strong> DIZ:
		</h1>
	);
}

type NotificationsModalProps = {
	session: Session;
	notifications: TNotificationDTO[];
	closeModal: () => void;
};
function NotificationsModal({ session, notifications, closeModal }: NotificationsModalProps) {
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TNotification>({
		destinatario: "",
		remetente: session.user?.nome,
		remetenteId: session.user?.id || "",
		mensagem: "",
		projetoReferencia: null,
		nomeDoProjeto: null,
		dataDeEnvio: new Date(),
		lido: false,
	});
	const { mutate: handleNotify } = useMutationWithFeedback({
		mutationKey: ["create-notification"],
		mutationFn: createNotification,
		queryClient: queryClient,
		affectedQueryKey: ["notifications", session.user.id],
	});

	const { mutate: handleUpdate } = useMutationWithFeedback({
		mutationKey: ["edit-notification"],
		mutationFn: editNotification,
		queryClient: queryClient,
		affectedQueryKey: ["notifications", session.user.id],
	});
	console.log("OLá");
	return (
		<div className="fixed right-[-150px] top-[230px] z-[100] h-[350px] w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-md border border-gray-300 bg-[#fff] p-[10px]">
			<div className="flex flex-col items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg lg:flex-row">
				<h3 className="text-sm font-bold text-[#353432] dark:text-white ">NOTIFICAÇÕES</h3>
				<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
					<VscChromeClose style={{ color: "red" }} size={12} />
				</button>
			</div>
			{infoHolder.destinatario.length > 3 && (
				<div className="my-2 flex w-full flex-col items-center">
					<h1 className="text-center text-xs italic text-[#15599a]">
						Informações para resposta sobre o projeto: <strong>{infoHolder.projetoReferencia}</strong>
					</h1>
					<div className="flex w-full flex-col">
						<input
							type={"text"}
							className="w-full text-center text-xs text-gray-600 outline-none"
							placeholder="Digite aqui a mensagem a ser enviada..."
							value={infoHolder.mensagem}
							onChange={(e) => setInfoHolder((prev) => ({ ...prev, mensagem: e.target.value }))}
						/>
					</div>

					<button
						// @ts-ignore
						onClick={() => handleNotify({ info: infoHolder })}
						className="mt-2 rounded-lg bg-blue-200 p-1 hover:bg-blue-600 hover:text-white"
					>
						<IoIosSend style={{ fontSize: "15px" }} />
					</button>
				</div>
			)}
			<div className="flex h-full max-w-full flex-col overflow-y-auto overscroll-y-auto px-2 py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{notifications.length > 0 ? (
					notifications.map((notificacao, index) => (
						<div key={index} className={"flex w-full flex-col gap-1 rounded-md border border-gray-300 p-3"}>
							{renderHeader({ projectName: notificacao.nomeDoProjeto || "", sender: notificacao.remetente })}
							{notificacao.nomeDoProjeto ? (
								<div className="flex w-full items-center gap-1 text-green-500">
									<BsCode color="rgb(34,197,94)" size={20} />
									<p className="text-xs font-medium tracking-tight text-gray-500">
										<strong className="text-[#fead41]">({notificacao.projetoReferencia})</strong> {notificacao.nomeDoProjeto}
									</p>
								</div>
							) : null}

							<div className="flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 p-2 text-center text-xs tracking-tight">{notificacao.mensagem}</div>
							<div className="mt-2 flex w-full items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1">
										<BsCalendarPlus />
										<p className="text-[0.70rem] font-medium text-gray-500">{formatDateAsLocale(notificacao.dataDeEnvio, true)}</p>
									</div>
									{notificacao.dataDeLeitura ? (
										<div className="flex items-center gap-1 text-green-500">
											<BsCalendarCheck color="rgb(34,197,94)" />
											<p className="text-[0.70rem] font-medium text-gray-500">{formatDateAsLocale(notificacao.dataDeLeitura, true)}</p>
										</div>
									) : null}
								</div>

								<div className="flex items-center gap-2">
									{notificacao.remetenteId && (
										<button
											onClick={() =>
												setInfoHolder((prev) => ({
													destinatario: notificacao.remetenteId || "",
													remetente: session.user?.nome,
													remetenteId: session.user.id,
													projetoReferencia: notificacao.projetoReferencia,
													nomeDoProjeto: notificacao.nomeDoProjeto,
													mensagem: "",
													lido: false,
													dataDeEnvio: new Date(),
												}))
											}
											className="outline-none transition duration-300 ease-in-out hover:scale-125"
										>
											<MdEmail style={{ fontSize: "20px", color: "#15599a" }} />{" "}
										</button>
									)}
									{
										notificacao.lido ? (
											<button
												onClick={() => {
													// @ts-ignore
													handleUpdate({
														id: notificacao._id,
														changes: { lido: !notificacao.lido, dataDeLeitura: !!notificacao.dataDeLeitura ? null : new Date() },
													});
												}}
												className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-white"
											>
												<BsCheckAll />
												<p className="text-[0.60rem] font-bold">LIDO</p>
											</button>
										) : (
											<button
												onClick={() => {
													// @ts-ignore
													handleUpdate({
														id: notificacao._id,
														changes: { lido: !notificacao.lido, dataDeLeitura: !!notificacao.dataDeLeitura ? null : new Date() },
													});
												}}
												className="flex items-center gap-1 rounded-full bg-gray-500 px-2 py-1 text-white duration-300 ease-in-out hover:scale-[1.05] hover:bg-green-500"
											>
												<BsCheck />
												<p className="text-[0.60rem] font-bold">NÃO LIDO</p>
											</button>
										)

										// <button
										//   onClick={() => {
										//     // @ts-ignore
										//     handleUpdate({
										//       id: notificacao._id,
										//       changes: { lido: !notificacao.lido, dataDeLeitura: !!notificacao.dataDeLeitura ? null : new Date() },
										//     })
										//   }}
										//   className="outline-none transition duration-300 ease-in-out hover:scale-150"
										// >

										// </button>
									}
								</div>
							</div>
							{/* <div className="mt-1 flex items-center justify-between gap-2 pr-2">
            <div>
            <p className="text-xs text-gray-500">{formatDateAsLocale(notificacao.dataDeEnvio)}</p>
            </div>
            <div className="flex items-center gap-2">
            {notificacao.remetenteId && (
            <button onClick={() => {}} className="outline-none transition duration-300 ease-in-out hover:scale-125">
            <MdEmail style={{ fontSize: '20px', color: '#15599a' }} />{' '}
            </button>
            )}
            {notificacao.lido ? (
            <BsCheckAll style={{ fontSize: '20px', color: 'green' }} />
            ) : (
            <button
            onClick={() => {
            // @ts-ignore
            handleUpdate({
            id: notificacao._id,
            changes: { lido: !notificacao.lido, dataDeLeitura: !!notificacao.dataDeLeitura ? null : new Date() },
            })
            }}
            className="outline-none transition duration-300 ease-in-out hover:scale-150"
            >
            <BsCheck
            style={{
            fontSize: '20px',
            color: 'gray',
            cursor: 'pointer',
            }}
            />
            </button>
            )}
            </div>
            </div> */}
						</div>
					))
				) : (
					<div className="flex h-full items-center justify-center">
						<p className="text-sm italic text-gray-500">Sem notificações...</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default NotificationsModal;
