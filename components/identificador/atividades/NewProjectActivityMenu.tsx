import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Avatar as AvatarUI, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avatar from "@/components/utils/Avatar";
import type { TAuthSession } from "@/lib/authentication/types";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { createActivity } from "@/utils/methods/mutation/activities";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useUsers } from "@/utils/methods/query/users";
import type { TActivity } from "@/utils/schemas/activities";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";

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

type NewProjectActivityMenuProps = {
	projectId: string;
	projectName: string;
	projectIdentifier: string | number;
	session: TAuthSession;
};
function NewProjectActivityMenu({ projectId, projectName, projectIdentifier, session }: NewProjectActivityMenuProps) {
	const [newActivityMenuIsOpen, setNewActivityMenuIsOpen] = useState<boolean>(false);
	const [newActivityHolder, setNewActivityHolder] = useState<TActivity>({
		titulo: "", // resume of the activity
		descricao: "", // description of what to be done
		responsaveis: [],
		projeto: {
			id: projectId,
			nome: projectName,
			identificador: projectIdentifier.toString(),
		},
		subatividades: [],
		dataVencimento: null,
		dataConclusao: null,
		dataInsercao: new Date().toISOString(),
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
	});
	const [newResponsibleHolder, setNewResponsibleHolder] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const { data: users } = useUsers();
	function handleVinculateResponsible(id: string | null) {
		if (!id) return toast.error("Escolha um usuário válido.");
		const user = users?.find((u: any) => u._id == id);
		if (!user) return;
		const newResponsible = {
			id: user._id as string,
			nome: user.usuario as string,
			avatar_url: user.avatar_url as string | null,
		};
		const responsibles = [...newActivityHolder.responsaveis];
		responsibles.push(newResponsible);
		setNewActivityHolder((prev) => ({ ...prev, responsaveis: responsibles }));
	}

	const { mutate: handleCreateActivity } = useMutationWithFeedback({
		mutationKey: ["create-activity"],
		mutationFn: createActivity,
		queryClient: queryClient,
		affectedQueryKey: ["activities-by-project", projectId],
		callbackFn: async () => await queryClient.invalidateQueries({ queryKey: ["activities-by-responsible", session.user.id] }),
	});
	return (
		<div className="flex w-full flex-col px-2">
			<div className="flex w-full items-center justify-end">
				<button
					onClick={() => setNewActivityMenuIsOpen((prev) => !prev)}
					className={`${
						newActivityMenuIsOpen ? "border-red-500 text-red-500 hover:bg-red-500" : "border-green-500 text-green-500 hover:bg-green-500"
					} rounded border px-4 py-1 text-sm font-medium hover:text-white`}
				>
					{newActivityMenuIsOpen ? "FECHAR" : "NOVA ATIVIDADE"}
				</button>
			</div>
			<AnimatePresence>
				{newActivityMenuIsOpen ? (
					<motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col gap-2 p-2">
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-1/2 lg:w-full">
								<TextInput
									label="TÍTULO DA ATIVIDADE"
									placeholder="Preencha aqui o titulo a ser dado à atividade..."
									value={newActivityHolder.titulo}
									handleChange={(value) => setNewActivityHolder((prev) => ({ ...prev, titulo: value }))}
									width="100%"
								/>
							</div>
							<div className="w-1/2 lg:w-full">
								<div className="flex w-full flex-col gap-1">
									<label htmlFor={"DATAVENCIMENTO"} className="font-sans font-bold text-primary">
										DATA DE VENCIMENTO
									</label>
									<input
										value={dayjs(newActivityHolder.dataVencimento).isValid() ? dayjs(newActivityHolder.dataVencimento).format("YYYY-MM-DDTHH:mm") : undefined}
										onChange={(e) => {
											setNewActivityHolder((prev) => ({
												...prev,
												dataVencimento: e.target.value != "" ? new Date(e.target.value).toISOString() : undefined,
											}));
										}}
										id={"DATAVENCIMENTO"}
										onReset={() =>
											setNewActivityHolder((prev) => ({
												...prev,
												dataVencimento: undefined,
											}))
										}
										type="datetime-local"
										className="border-primary/20 w-full rounded-md border p-3 text-sm outline-hidden placeholder:italic"
									/>
								</div>
							</div>
						</div>
						<div className="border-primary/20 flex w-full flex-col rounded-md border p-2 shadow-xs">
							<h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">DESCRIÇÃO DA ATIVIDADE</h1>
							<input
								value={newActivityHolder.descricao}
								onChange={(e) => setNewActivityHolder((prev) => ({ ...prev, descricao: e.target.value }))}
								type="text"
								placeholder="Preencha aqui uma descrição mais específica da atividade a ser feita..."
								className="w-full p-3 text-start text-sm outline-hidden"
							/>
						</div>
						<h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">VINCULE RESPONSÁVEIS</h1>
						<div className="flex w-full items-center gap-2">
							<div className="flex items-end gap-2">
								<SelectInput
									label={"RESPONSÁVEL"}
									editable={true}
									showLabel={false}
									value={newResponsibleHolder}
									options={
										users?.map((resp) => ({
											id: resp._id,
											label: resp.usuario,
											value: resp._id,
											startContent: (
												<AvatarUI className="h-5 w-5 min-h-5 min-w-5">
													<AvatarImage src={resp.avatar_url ?? undefined} />
													<AvatarFallback className="text-xs">{formatNameAsInitials(resp.usuario)}</AvatarFallback>
												</AvatarUI>
											),
										})) || []
									}
									handleChange={(value: any) => setNewResponsibleHolder(value)}
									onReset={() => setNewResponsibleHolder(null)}
									selectedItemLabel={"USUÁRIO NÃO DEFINIDO"}
									width="100%"
								/>

								<button
									onClick={() => handleVinculateResponsible(newResponsibleHolder)}
									className="min-h-[46.6px] rounded border border-orange-500 px-4 py-2 text-sm font-medium text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white"
								>
									VINCULAR
								</button>
							</div>
							<div className="flex grow items-center justify-start gap-2">
								{newActivityHolder.responsaveis.map((resp, index) => (
									<div key={index} className="flex items-center gap-2 rounded-lg border border-cyan-500 p-2 shadow-xs">
										<Avatar width={25} height={25} url={resp.avatar_url} fallback={formatNameAsInitials(resp.nome)} />
										<p className="text-primary/60 text-sm font-medium tracking-tight">{resp.nome}</p>
									</div>
								))}
							</div>
						</div>
						<div className="flex w-full items-center justify-end">
							<button
								// @ts-ignore
								onClick={() => handleCreateActivity({ info: newActivityHolder })}
								className='enabled:hover:text-white" disabled:bg-primary/60 enabled:hover:bg-primary/80 rounded bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm disabled:text-white'
							>
								CRIAR ATIVIDADE
							</button>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}

export default NewProjectActivityMenu;
