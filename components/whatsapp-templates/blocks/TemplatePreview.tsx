import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { convertHtmlToWhatsappText } from "@/lib/whatsapp/template-management";
import type { TWhatsappTemplateComponents } from "@/utils/schemas/whatsapp-templates";
import { Eye, FileText as FileTextIcon, ImageIcon, VideoIcon } from "lucide-react";

type TemplatePreviewProps = {
	components: TWhatsappTemplateComponents;
};

function TemplatePreview({ components }: TemplatePreviewProps) {
	const { cabecalho, corpo, rodape, botoes } = components;

	// Convert HTML content to plain text with WhatsApp formatting
	const bodyText = convertHtmlToWhatsappText(corpo.conteudo);

	// Replace variables with example values
	let bodyWithExamples = bodyText;
	for (const param of corpo.parametros) {
		const placeholder = `{{${param.nome}}}`;
		const exemplo = param.exemplo || `{{${param.nome}}}`;
		bodyWithExamples = bodyWithExamples.replace(new RegExp(placeholder, "g"), exemplo);
	}

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="PREVIEW" sectionTitleIcon={<Eye size={15} />}>
			<div className="max-w-md mx-auto grow w-full h-full flex items-center justify-center">
				{/* WhatsApp-style message bubble */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
					{/* Header */}
					{cabecalho && (
						<div className="bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
							{cabecalho.tipo === "text" ? (
								<p className="font-semibold text-sm">{cabecalho.conteudo || "Texto do cabeçalho"}</p>
							) : (
								<div className="flex items-center gap-2 text-sm text-primary/60">
									{cabecalho.tipo === "image" && <ImageIcon className="w-4 h-4" />}
									{cabecalho.tipo === "video" && <VideoIcon className="w-4 h-4" />}
									{cabecalho.tipo === "document" && <FileTextIcon className="w-4 h-4" />}
									<span className="capitalize">{cabecalho.tipo}</span>
								</div>
							)}
						</div>
					)}

					{/* Body */}
					<div className="p-4">
						<div className="whitespace-pre-wrap text-sm">{bodyWithExamples || "Digite o conteúdo da mensagem..."}</div>
					</div>

					{/* Footer */}
					{rodape && (
						<div className="px-4 pb-2">
							<p className="text-xs text-gray-500 dark:text-gray-400">{rodape.conteudo}</p>
						</div>
					)}

					{/* Buttons */}
					{botoes && botoes.length > 0 && (
						<div className="border-t border-gray-200 dark:border-gray-600">
							{botoes.map((botao, index) => (
								<div key={index.toString()} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 py-2 px-4 text-center">
									<button type="button" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:cursor-default" disabled>
										{botao.tipo === "quick_reply" && "↩️ "}
										{botao.tipo === "url" && "🔗 "}
										{botao.tipo === "phone_number" && "📞 "}
										{botao.texto || "Texto do botão"}
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Info */}
				<div className="mt-4 space-y-2">
					<div className="flex items-center justify-between text-xs">
						<span className="text-primary/60">Caracteres no corpo:</span>
						<span className={bodyText.length > 1024 ? "text-red-500 font-semibold" : "text-primary/80"}>{bodyText.length} / 1024</span>
					</div>

					{cabecalho?.tipo === "text" && cabecalho.conteudo && (
						<div className="flex items-center justify-between text-xs">
							<span className="text-primary/60">Caracteres no cabeçalho:</span>
							<span className={cabecalho.conteudo.length > 60 ? "text-red-500 font-semibold" : "text-primary/80"}>{cabecalho.conteudo.length} / 60</span>
						</div>
					)}

					{rodape?.conteudo && (
						<div className="flex items-center justify-between text-xs">
							<span className="text-primary/60">Caracteres no rodapé:</span>
							<span className={rodape.conteudo.length > 60 ? "text-red-500 font-semibold" : "text-primary/80"}>{rodape.conteudo.length} / 60</span>
						</div>
					)}

					{botoes && botoes.length > 0 && (
						<div className="flex items-center justify-between text-xs">
							<span className="text-primary/60">Número de botões:</span>
							<span className={botoes.length > 10 ? "text-red-500 font-semibold" : "text-primary/80"}>{botoes.length} / 10</span>
						</div>
					)}
				</div>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default TemplatePreview;
