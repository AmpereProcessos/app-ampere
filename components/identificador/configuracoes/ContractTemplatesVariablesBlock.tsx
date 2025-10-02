import ControlContractTemplateVariableMenu from "@/components/contract-templates/variables/ControlVariableMenu";
import NewContractTemplateVariableMenu from "@/components/contract-templates/variables/NewVariableMenu";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type { TGetContractTemplateVariablesOutputDefault } from "@/pages/api/templates-contrato/variaveis";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useContractTemplateVariables } from "@/utils/methods/query/contract-templates-variables";
import { useQueryClient } from "@tanstack/react-query";
import { Code, Pencil } from "lucide-react";
import { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";

type ContractTemplatesVariablesBlockProps = {
	session: TAuthSession;
};
function ContractTemplatesVariablesBlock({ session }: ContractTemplatesVariablesBlockProps) {
	const queryClient = useQueryClient();
	const { data: contractTemplateVariables, queryKey, isLoading, isError, isSuccess, error } = useContractTemplateVariables();
	const [newContractTemplateVariableModalIsOpen, setNewContractTemplateVariableModalIsOpen] = useState(false);
	const [editContractTemplateVariableId, setEditContractTemplateVariableId] = useState<string | null>(null);
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
					<h1 className="text-lg font-bold">Variáveis de Template de Contrato</h1>
					<p className="text-sm text-primary/60">Gerencie as variáveis de template de contrato</p>
				</div>
				<div className="flex items-center gap-2">
					{userHasContractTemplatesVariablesPermission ? (
						<Button onClick={() => setNewContractTemplateVariableModalIsOpen(true)} type="button">
							NOVA VARIÁVEL
						</Button>
					) : null}
				</div>
			</div>
			{isLoading ? <h3 className="text-sm text-primary/60 animate-pulse">Carregando perfil...</h3> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				<div className="flex w-full flex-col gap-2 py-2">
					{contractTemplateVariables.length > 0 ? (
						contractTemplateVariables.map((user) => (
							<ContractTemplatesVariablesBlockCard
								key={user._id}
								contractTemplateVariable={user}
								userHasEditPermission={userHasContractTemplatesVariablesPermission}
								handleEditClick={() => setEditContractTemplateVariableId(user._id)}
							/>
						))
					) : (
						<div className="text-primary/80 w-full text-center font-medium italic">Nenhuma variável de template de contrato encontrada.</div>
					)}
				</div>
			) : null}
			{newContractTemplateVariableModalIsOpen ? (
				<NewContractTemplateVariableMenu
					session={session}
					closeMenu={() => setNewContractTemplateVariableModalIsOpen(false)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
			{editContractTemplateVariableId ? (
				<ControlContractTemplateVariableMenu
					variableId={editContractTemplateVariableId}
					session={session}
					closeMenu={() => setEditContractTemplateVariableId(null)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
		</div>
	);
}

export default ContractTemplatesVariablesBlock;

type ContractTemplatesVariablesBlockCardProps = {
	contractTemplateVariable: TGetContractTemplateVariablesOutputDefault[number];
	userHasEditPermission: boolean;
	handleEditClick: (id: string) => void;
};
function ContractTemplatesVariablesBlockCard({
	contractTemplateVariable,
	userHasEditPermission,
	handleEditClick,
}: ContractTemplatesVariablesBlockCardProps) {
	return (
		<div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs dark:bg-[#121212]">
			<div className="w-full flex flex-col gap-1">
				<div className="w-full flex items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm leading-none font-bold tracking-tight">{contractTemplateVariable.titulo}</p>
						<div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-primary/20">
							<Code className="h-3 w-3 min-w-3 min-h-3" />
							<p className="text-[0.65rem] font-bold tracking-tight">{contractTemplateVariable.identificador}</p>
						</div>
					</div>
					<h1
						className={cn("text-[0.65rem] font-bold tracking-tight px-2 py-0.5 rounded-lg", {
							"bg-primary text-primary-foreground": contractTemplateVariable.categoria === "NATIVA",
							"bg-blue-500 text-white": contractTemplateVariable.categoria === "COMPUTADA",
						})}
					>
						{contractTemplateVariable.categoria}
					</h1>
				</div>
				<p className="text-sm text-primary/80">{contractTemplateVariable.descricao}</p>
			</div>
			<div className="flex w-full items-center justify-end gap-1">
				{userHasEditPermission && contractTemplateVariable.categoria !== "NATIVA" ? (
					<Button
						variant={"ghost"}
						className="flex items-center gap-1 px-2 py-1"
						size={"fit"}
						onClick={() => handleEditClick(contractTemplateVariable._id)}
					>
						<Pencil className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/80 text-sm font-semibold">EDITAR</p>
					</Button>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
