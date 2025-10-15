import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { cn } from "@/lib/utils";
import type { TGetWhatsappTemplatesOutputById } from "@/pages/api/whatsapp/templates";
import { CheckCircle, Code } from "lucide-react";

type TemplateStatusProps = {
	whatsappTemplateId: string | null;
	status: TGetWhatsappTemplatesOutputById["status"] | null;
	quality: TGetWhatsappTemplatesOutputById["qualidade"] | null;
};
export default function TemplateStatus({ whatsappTemplateId, status, quality }: TemplateStatusProps) {
	if (!whatsappTemplateId) return null;
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="STATUS DE SINCRONIZAÇÃO" sectionTitleIcon={<CheckCircle size={15} />}>
			<div className="w-full flex items-center gap-2">
				<Code className="w-4 h-4 min-w-4 min-h-4" />
				<span className="text-sm font-medium">ID DO TEMPLATE NO WHATSAPP:</span>
				<span className="text-xs font-black px-2 py-1 rounded bg-primary/10">{whatsappTemplateId}</span>
			</div>
			<div className="w-full flex items-center gap-2">
				<CheckCircle className="w-4 h-4 min-w-4 min-h-4" />
				<span className="text-sm font-medium">STATUS:</span>
				<span
					className={cn("text-xs font-black px-2 py-1 rounded", {
						"bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300": status === "APROVADO",
						"bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300": status === "PENDENTE",
						"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300": status === "REJEITADO",
						"bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300": status === "PAUSADO",
						"bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300": status === "DESABILITADO",
					})}
				>
					{status}
				</span>
			</div>
			<div className="w-full flex items-center gap-2">
				<CheckCircle className="w-4 h-4 min-w-4 min-h-4" />
				<span className="text-sm font-medium">QUALIDADE:</span>
				<span
					className={cn("text-xs font-black px-2 py-1 rounded", {
						"bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300": quality === "ALTA",
						"bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300": quality === "MEDIA",
						"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300": quality === "BAIXA",
						"bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300": quality === "PENDENTE",
					})}
				>
					{quality}
				</span>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}
