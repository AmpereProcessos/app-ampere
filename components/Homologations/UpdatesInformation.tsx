import type React from "react";
import { useState } from "react";

import type { TAuthSession } from "@/lib/authentication/types";
import { formatDateAsLocale, formatDateTime } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { Logs } from "lucide-react";
import toast from "react-hot-toast";
import { BsCalendarPlus } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import DateTimeInput from "../inputs/DateTimeInput";
import TextInput from "../inputs/Text";
import Avatar from "../utils/Avatar";

type UpdatesInformationProps = {
	session: TAuthSession;
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function UpdatesInformation({ session, infoHolder, setInfoHolder, setChanges }: UpdatesInformationProps) {
	const [updateHolder, setUpdateHolder] = useState<TProjectDTOWithHomologation["homologacao"]["atualizacoes"][number]>({
		data: new Date().toISOString(),
		descricao: "",
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
	});

	function addUpdate(info: TProjectDTOWithHomologation["homologacao"]["atualizacoes"][number]) {
		if (!updateHolder.data) return toast.error("Preencha uma data válida.");
		if (updateHolder.descricao.trim().length < 3) return toast.error("Preencha uma descrição de ao menos 3 caractéres...");
		const updates = [...infoHolder.homologacao.atualizacoes];
		updates.push(info);

		setChanges((prev) => ({ ...prev, "homologacao.atualizacoes": updates }));
		return setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, atualizacoes: updates } }));
	}
	function removeUpdate(index: number) {
		const updates = [...infoHolder.homologacao.atualizacoes];
		updates.splice(index, 1);

		setChanges((prev) => ({ ...prev, "homologacao.atualizacoes": updates }));
		return setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, atualizacoes: updates } }));
	}
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Logs className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">ATUALIZAÇÕES</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="DESCRIÇÃO DA ATUALIZAÇÃO"
						placeholder="Preencha a descrição da atualização..."
						value={updateHolder.descricao}
						handleChange={(value) => {
							setUpdateHolder((prev) => ({ ...prev, descricao: value }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<DateTimeInput
						label="DATA DA ATUALIZAÇÃO"
						value={formatDateTime(updateHolder.data)}
						handleChange={(value) => {
							console.log(value);
							setUpdateHolder((prev) => ({ ...prev, data: formatDateInputChange(value, "string") || new Date().toISOString() }));
						}}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex items-center justify-end">
				<button
					type="button"
					className="hover:bg-primary/70 rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out"
					onClick={() => addUpdate(updateHolder)}
				>
					ADICIONAR ATUALIZAÇÃO
				</button>
			</div>

			<div className="mt-2 flex w-full flex-col gap-1">
				<h1 className="font-raleway mb-2 text-start leading-none font-bold tracking-tight">ATUALIZAÇÕES DA HOMOLOGAÇÃO</h1>
				{infoHolder.homologacao.atualizacoes.length > 0 ? (
					infoHolder.homologacao.atualizacoes.map((update, index) => (
						<div key={`${update.data}-${index}`} className="border-primary/60 flex w-full flex-col gap-1 rounded-md border p-3">
							<div className="flex w-full items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1">
										<BsCalendarPlus />
										<h1 className="cursor-pointer text-xs leading-none font-black tracking-tight">{formatDateAsLocale(update.data, true)}</h1>
									</div>
									<div className="flex items-center gap-1">
										<Avatar fallback={"R"} url={update.autor.avatar_url || undefined} height={20} width={20} />
										<p className="text-primary/60 text-xs font-medium">{update.autor.nome}</p>
									</div>
								</div>
								<button
									onClick={() => removeUpdate(index)}
									type="button"
									className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
								>
									<MdDelete style={{ color: "red" }} size={15} />
								</button>
							</div>
							<div className="text-primary/60 bg-primary/20 flex w-full items-center justify-center rounded-md p-2 text-center text-xs font-medium">
								{update.descricao}
							</div>
						</div>
					))
				) : (
					<p className="text-primary/60 flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
						Sem atualizações adicionadas.
					</p>
				)}
			</div>
		</div>
	);
}

export default UpdatesInformation;
