import { serve } from "@novu/framework/next";
import { generalNoficationWorkflow } from "@/utils/services/novu/workflows";

export const { GET, POST, OPTIONS } = serve({
	workflows: [generalNoficationWorkflow],
});
