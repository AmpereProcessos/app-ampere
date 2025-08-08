import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IoIosSend, IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdNotifications } from "react-icons/md";

import { useUsers } from "../utils/methods/query/users";
import Avatar from "./utils/Avatar";
import SelectInputWithImages from "./inputs/SelectWithImages";
import { formatNameAsInitials } from "../utils/methods/formatting";

import { useMutationWithFeedback } from "../utils/methods/mutation/general-hook";
import { useQueryClient } from "@tanstack/react-query";
import { createNotification } from "../utils/methods/mutation/notifications";
import type { TNotification } from "@/utils/schemas/notifications";
import type { Session } from "next-auth";
const variants = {
	hidden: {
		opacity: 0.2,
		transition: {
			duration: 0.8, // Adjust the duration as needed
		},
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.8, // Adjust the duration as needed
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0.01, // Adjust the duration as needed
		},
	},
};

type NotificationCreationBlockProps = {
	session: Session;
	codProjeto: string;
	nomeDoProjeto: string;
};
function NotificationCreationBlock({ session, codProjeto, nomeDoProjeto }: NotificationCreationBlockProps) {
	const queryClient = useQueryClient();
	const { data: users } = useUsers();

	async function handleNotificationCreation(info: TNotification) {
		if (info.destinatario == null || info.destinatario === "NÃO DEFINIDO") throw new Error("Destinatário não informado.");

		if (info.mensagem.trim().length < 3) throw new Error("Mensagem não informada.");

		return createNotification({ info: info });
	}
	const { mutate: handleNotificationCreationMutation, isPending } = useMutationWithFeedback({
		mutationKey: ["create-notification"],
		mutationFn: handleNotificationCreation,
		affectedQueryKey: ["notifications"],
		queryClient: queryClient,
	});
	const [notifyMenuVisible, setNotifyMenuVisible] = useState(false);

	const initialNotification: TNotification = {
		destinatario: "",
		mensagem: "",
		projetoReferencia: codProjeto,
		nomeDoProjeto: nomeDoProjeto,
		dataDeEnvio: new Date().toISOString(),
		lido: false,
		remetente: session.user.nome,
		remetenteId: session.user.id,
	};
	const [notInfo, setNotInfo] = useState<TNotification>(initialNotification);

	return (
		<>
			<div className="flex w-full items-center justify-center gap-6 rounded-md bg-[#15599a] p-2">
				<div className="flex items-center gap-2">
					<MdNotifications color="#fff" />
					<h1 className="text-center font-medium text-white">PAINEL DE NOTIFICAÇÕES</h1>
				</div>
				{notifyMenuVisible ? (
					<div className="cursor-pointer text-white hover:text-blue-400">
						<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setNotifyMenuVisible(false)} />
					</div>
				) : (
					<div className="cursor-pointer text-white hover:text-blue-400">
						<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setNotifyMenuVisible(true)} />
					</div>
				)}
			</div>
			<AnimatePresence>
				{notifyMenuVisible ? (
					<motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col p-2">
						<div className="flex w-full flex-col self-center lg:w-[50%]">
							<div className="flex w-full items-center justify-center gap-2">
								<h1 className="text-xs font-bold">REMETENTE</h1>
								<div className="h-full w-[1px] bg-primary/30" />
								<div className="flex items-center justify-center  gap-2">
									<Avatar fallback={"U"} height={25} width={25} url={session.user.avatar_url} />
									<p className="text-xs font-medium text-gray-500">{session.user.nome || "Autor não identificado"}</p>
								</div>
							</div>
							<SelectInputWithImages
								label="DESTINATÁRIO"
								labelClassName="font-bold text-xs"
								editable={true}
								options={
									users?.map((resp) => ({
										id: resp._id,
										label: resp.usuario,
										value: resp,
										url: resp.avatar_url ?? undefined,
										fallback: formatNameAsInitials(resp.usuario),
									})) || []
								}
								value={notInfo.destinatario}
								handleChange={(value) => {
									setNotInfo((prev) => ({ ...prev, destinatario: value._id }));
								}}
								onReset={() => setNotInfo((prev) => ({ ...prev, destinatario: "" }))}
								selectedItemLabel="NÃO DEFINIDO"
								width="100%"
							/>
							<h1 className="mt-4 text-xs font-bold">MENSAGEM</h1>
							<textarea
								className="mt-1 w-full resize-none rounded-md border border-primary/30 bg-primary/5 p-3 text-center text-sm outline-none"
								value={notInfo.mensagem}
								onChange={(e) => setNotInfo((prev) => ({ ...prev, mensagem: e.target.value }))}
							/>
							<div className="flex w-full items-center justify-end">
								<button
									type="button"
									disabled={isPending}
									onClick={() => handleNotificationCreationMutation(notInfo)}
									className="mt-2 rounded-lg bg-blue-200  text-[25px] duration-300 ease-in hover:scale-110 hover:bg-blue-600 hover:text-white"
								>
									<div className="h-hull w-full -translate-x-1 rotate-45 p-2 duration-300 ease-in hover:translate-x-0 hover:rotate-0">
										<IoIosSend />
									</div>
								</button>
							</div>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	);
}

export default NotificationCreationBlock;
