import { useSession } from "@/components/providers/SessionProvider";
import type { TProjectDTO } from "@/utils/schemas/projects";
import React, { useState } from "react";
import ModalNewServiceOrder from "./identificador/ordensDeServico/modals/ModalNewProjectServiceOrder";

type OSCreationBlockProps = {
	project: TProjectDTO;
	categories: { label: string; value: string }[];
};
function OSCreationBlock({ project, categories }: OSCreationBlockProps) {
	const { session, status } = useSession();
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
	if (status !== "authenticated") return null;
	return (
		<div className="flex w-full flex-col items-center">
			<button
				type="button"
				onClick={() => setDropdownMenuVisible(true)}
				className="bg-primary/60 mb-2 flex w-fit cursor-pointer items-center justify-between rounded-md p-2 hover:bg-cyan-500"
			>
				<h1 className="text-center font-bold text-white">ABRIR PAINEL DE CRIAÇÃO DE ORDEM DE SERVIÇO</h1>
			</button>

			{dropdownMenuVisible ? <ModalNewServiceOrder project={project} closeModal={() => setDropdownMenuVisible(false)} session={session} /> : null}
		</div>
	);
}

export default OSCreationBlock;
