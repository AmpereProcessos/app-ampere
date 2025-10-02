import ControlContractTemplate from "@/components/contract-templates/ControlContractTemplate";
import NewContractTemplate from "@/components/contract-templates/NewContractTemplate";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { TGetContractTemplatesOutput, type TGetContractTemplatesOutputDefault } from "@/pages/api/templates-contrato";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useContractTemplates } from "@/utils/methods/query/contract-templates";
import { useQueryClient } from "@tanstack/react-query";
import { Code, Pencil } from "lucide-react";
import { useState } from "react";

type ContractTemplatesBlockProps = {
	session: TAuthSession;
};
function ContractTemplatesBlock({ session }: ContractTemplatesBlockProps) {
	const queryClient = useQueryClient();
	const { data: contractTemplates, queryKey, isLoading, isError, isSuccess, error } = useContractTemplates();
	const [newContractTemplateModalIsOpen, setNewContractTemplateModalIsOpen] = useState(false);
	const [editContractTemplateId, setEditContractTemplateId] = useState<string | null>(null);
	const userHasContractTemplatesVariablesPermission =
		session.user.permissoes.administrativo.editar && session.user.permissoes.administrativo.visualizar;

	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey: queryKey });
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};
	return (
		<div className="flex h-full grow flex-col">
			<div className="border-primary/20 flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
				<div className="flex flex-col">
					<h1 className="text-lg font-bold">Templates de Contrato</h1>
					<p className="text-sm text-primary/60">Gerencie os templates de contrato</p>
				</div>
				<div className="flex items-center gap-2">
					{userHasContractTemplatesVariablesPermission ? (
						<Button onClick={() => setNewContractTemplateModalIsOpen(true)} type="button">
							NOVO TEMPLATE
						</Button>
					) : null}
				</div>
			</div>
			{isLoading ? <h3 className="text-sm text-primary/60 animate-pulse">Carregando perfil...</h3> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				<div className="flex w-full flex-col gap-2 py-2">
					{contractTemplates.length > 0 ? (
						contractTemplates.map((template) => (
							<ContractTemplatesBlockCard
								key={template._id}
								contractTemplate={template}
								userHasEditPermission={userHasContractTemplatesVariablesPermission}
								handleEditClick={() => setEditContractTemplateId(template._id)}
							/>
						))
					) : (
						<div className="text-primary/80 w-full text-center font-medium italic">Nenhum template de contrato encontrado.</div>
					)}
				</div>
			) : null}
			{newContractTemplateModalIsOpen ? (
				<NewContractTemplate
					session={session}
					closeMenu={() => setNewContractTemplateModalIsOpen(false)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
			{editContractTemplateId ? (
				<ControlContractTemplate
					contractTemplateId={editContractTemplateId}
					session={session}
					closeMenu={() => setEditContractTemplateId(null)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
		</div>
	);
}
export default ContractTemplatesBlock;
type ContractTemplatesBlockCardProps = {
	contractTemplate: TGetContractTemplatesOutputDefault[number];
	userHasEditPermission: boolean;
	handleEditClick: (id: string) => void;
};

function ContractTemplatesBlockCard({ contractTemplate, userHasEditPermission, handleEditClick }: ContractTemplatesBlockCardProps) {
	return (
		<div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs dark:bg-[#121212]">
			<div className="w-full flex flex-col gap-1">
				<div className="w-full flex items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm leading-none font-bold tracking-tight">{contractTemplate.titulo}</p>
					</div>
				</div>
				<p className="text-sm text-primary/80">{contractTemplate.descricao}</p>
			</div>
			<div className="flex w-full items-center justify-end gap-1">
				{userHasEditPermission ? (
					<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"} onClick={() => handleEditClick(contractTemplate._id)}>
						<Pencil className="w-4	 h-4 min-w-4 min-h-4" />
						<p className="text-primary/80 text-sm font-semibold">EDITAR</p>
					</Button>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
