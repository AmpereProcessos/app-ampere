import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import ControlWhatsappTemplate from "@/components/whatsapp-templates/ControlWhatsappTemplate";
import NewWhatsappTemplate from "@/components/whatsapp-templates/NewWhatsappTemplate";
import type { TAuthSession } from "@/lib/authentication/types";
import type { TGetWhatsappTemplatesOutputDefault } from "@/pages/api/whatsapp/templates";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useWhatsappTemplates } from "@/utils/methods/query/whatsapp-templates";
import { useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Pencil } from "lucide-react";
import { useState } from "react";

type WhatsappTemplatesBlockProps = {
	session: TAuthSession;
};

function WhatsappTemplatesBlock({ session }: WhatsappTemplatesBlockProps) {
	const queryClient = useQueryClient();
	const { data: templates, queryKey, isLoading, isError, isSuccess, error } = useWhatsappTemplates();

	const [newTemplateModalIsOpen, setNewTemplateModalIsOpen] = useState(false);
	const [editTemplateId, setEditTemplateId] = useState<string | null>(null);

	const userHasPermission = session.user.permissoes.chats.enviarMensagens;

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
					<h1 className="text-lg font-bold">Templates WhatsApp</h1>
					<p className="text-sm text-primary/60">Gerencie os templates de mensagem do WhatsApp Business</p>
				</div>
				<div className="flex items-center gap-2">
					{userHasPermission ? (
						<Button onClick={() => setNewTemplateModalIsOpen(true)} type="button">
							<MessageCircle className="w-4 h-4 mr-2" />
							NOVO TEMPLATE
						</Button>
					) : null}
				</div>
			</div>

			{isLoading ? <h3 className="text-sm text-primary/60 animate-pulse py-4">Carregando templates...</h3> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				<div className="flex w-full flex-col gap-2 py-2">
					{templates.length > 0 ? (
						templates.map((template) => (
							<WhatsappTemplatesBlockCard
								key={template._id}
								template={template}
								userHasEditPermission={userHasPermission}
								handleEditClick={() => setEditTemplateId(template._id)}
							/>
						))
					) : (
						<div className="text-primary/80 w-full text-center font-medium italic py-8">Nenhum template de WhatsApp encontrado.</div>
					)}
				</div>
			) : null}

			{newTemplateModalIsOpen ? (
				<NewWhatsappTemplate
					session={session}
					closeMenu={() => setNewTemplateModalIsOpen(false)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}

			{editTemplateId ? (
				<ControlWhatsappTemplate
					whatsappTemplateId={editTemplateId}
					session={session}
					closeMenu={() => setEditTemplateId(null)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
		</div>
	);
}

export default WhatsappTemplatesBlock;

type WhatsappTemplatesBlockCardProps = {
	template: TGetWhatsappTemplatesOutputDefault[number];
	userHasEditPermission: boolean;
	handleEditClick: (id: string) => void;
};

function WhatsappTemplatesBlockCard({ template, userHasEditPermission, handleEditClick }: WhatsappTemplatesBlockCardProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "APROVADO":
				return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
			case "PENDENTE":
				return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
			case "REJEITADO":
				return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
			case "PAUSADO":
				return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
			case "DESABILITADO":
				return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
			default:
				return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
		}
	};

	const getCategoryLabel = (categoria: string) => {
		switch (categoria) {
			case "authentication":
				return "Autenticação";
			case "marketing":
				return "Marketing";
			case "utility":
				return "Utilidade";
			default:
				return categoria;
		}
	};

	return (
		<div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-3 shadow-xs dark:bg-[#121212]">
			<div className="w-full flex flex-col gap-2">
				<div className="w-full flex items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm leading-none font-bold tracking-tight font-mono">{template.nome}</p>
						<span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(template.status)}`}>{template.status}</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2 text-xs text-primary/60">
					<span className="bg-primary/5 px-2 py-1 rounded">{getCategoryLabel(template.categoria)}</span>
					<span className="bg-primary/5 px-2 py-1 rounded">{template.idioma === "pt_BR" ? "Português" : template.idioma}</span>
					<span className="bg-primary/5 px-2 py-1 rounded capitalize">{template.formatoParametros === "positional" ? "Posicional" : "Nomeado"}</span>
					{template.qualidade && <span className="bg-primary/5 px-2 py-1 rounded">Qualidade: {template.qualidade}</span>}
				</div>

				{/* Components Summary */}
				<div className="flex flex-wrap items-center gap-2 text-xs">
					{template.componentes.cabecalho && <span className="text-primary/60">📋 Cabeçalho</span>}
					<span className="text-primary/60">📝 Corpo ({template.componentes.corpo.parametros.length} variáveis)</span>
					{template.componentes.rodape && <span className="text-primary/60">📄 Rodapé</span>}
					{template.componentes.botoes && template.componentes.botoes.length > 0 && (
						<span className="text-primary/60">🔘 {template.componentes.botoes.length} botão(ões)</span>
					)}
				</div>
			</div>

			<div className="flex w-full items-center justify-end gap-1">
				{userHasEditPermission ? (
					<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"} onClick={() => handleEditClick(template._id)}>
						<Pencil className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/80 text-sm font-semibold">EDITAR</p>
					</Button>
				) : null}
			</div>
		</div>
	);
}
