import { serve } from "@novu/framework/next";
import { generalNoficationWorkflow } from "@/utils/services/novu/workflows";
import { apiHandler } from "@/utils/api";
import type { NextApiHandler } from "next";

export const { GET, POST, OPTIONS } = serve({
	workflows: [generalNoficationWorkflow],
});
