import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import {
  CONTRACT_TEMPLATE_VARIABLES_PREVIEW,
  getTemplateProcessed,
} from "@/lib/contract-templates/processing";
import { Eye } from "lucide-react";

type TemplatePreviewProps = {
  templateContent: string;
};
function ContractTemplatePreview({ templateContent }: TemplatePreviewProps) {
  const processedTemplate = getTemplateProcessed({
    templateContent,
    variables: CONTRACT_TEMPLATE_VARIABLES_PREVIEW,
  });
  console.log("[DEBUG] Processed Template", processedTemplate);
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="EDITOR DE TEMPLATE"
      sectionTitleIcon={<Eye size={15} />}
    >
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: processedTemplate }}
        className="prose prose-sm max-w-none
					prose-headings:font-bold prose-headings:text-primary prose-headings:mt-6 prose-headings:mb-4
					prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
					prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
					prose-strong:text-primary prose-strong:font-semibold
					prose-ul:my-4 prose-ol:my-4
					prose-li:text-foreground prose-li:my-2"
      />
    </ResponsiveDialogDrawerSection>
  );
}

export default ContractTemplatePreview;
