import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import ControlWhatsappTemplate from "@/components/whatsapp-templates/ControlWhatsappTemplate";
import NewWhatsappTemplate from "@/components/whatsapp-templates/NewWhatsappTemplate";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type { TGetWhatsappTemplatesOutputDefault } from "@/pages/api/whatsapp/templates";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useWhatsappTemplates } from "@/utils/methods/query/whatsapp-templates";
import { useQueryClient } from "@tanstack/react-query";
import { CircleGauge, Diamond, Languages, MessageCircle, Pencil, Variable } from "lucide-react";
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
	const getCategoryLabel = (categoria: string) => {
		switch (categoria) {
			case "authentication":
				return "AUTENTICAÇÃO";
			case "marketing":
				return "MARKETING";
			case "utility":
				return "UTILIDADE";
			default:
				return categoria;
		}
	};

	const LANGUAGE_MAP = {
		pt_BR: "Português",
		en_US: "Inglês",
		es_ES: "Espanhol",
		fr_FR: "Francês",
		de_DE: "Alemão",
	};

	return (
		<div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-3 shadow-xs dark:bg-[#121212]">
			<div className="w-full flex flex-col gap-2">
				<div className="w-full flex items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<span className={"text-sm leading-none font-bold tracking-tight font-mono"}>TEMPLATE</span>
						<p className="text-xs px-2 py-1 rounded-lg bg-primary/10">{template.nome}</p>
					</div>
					<div
						className={cn("px-2 py-0.5 rounded-lg text-[0.65rem] font-bold", {
							"bg-blue-500 text-white": template.status === "APROVADO",
							"bg-primary/20 text-primary": template.status === "PENDENTE",
							"bg-yellow-500 text-white": template.status === "REJEITADO",
							"bg-orange-500 text-white": template.status === "PAUSADO",
							"bg-gray-500 text-white": template.status === "DESABILITADO",
						})}
					>
						{template.status}
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<Diamond className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium text-primary/80">{getCategoryLabel(template.categoria)}</p>
					</div>
					<div className="flex items-center gap-1">
						<Languages className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium text-primary/80">{LANGUAGE_MAP[template.idioma as keyof typeof LANGUAGE_MAP]}</p>
					</div>
					<div className="flex items-center gap-1">
						<Variable className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium text-primary/80">{template.formatoParametros === "positional" ? "POSICIONAL" : "NOMEADO"}</p>
					</div>
					<div className="flex items-center gap-1">
						<CircleGauge className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-xs font-medium text-primary/80">{template.qualidade}</p>
					</div>
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
