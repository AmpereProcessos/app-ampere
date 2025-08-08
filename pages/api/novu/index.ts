import { serve } from "@novu/framework/next";
import { generalNoficationWorkflow } from "@/utils/services/novu/workflows";
import { apiHandler } from "@/utils/api";
import type { NextApiHandler } from "next";

const { GET, POST, OPTIONS } = serve({
	workflows: [generalNoficationWorkflow],
});
export default apiHandler({
	GET: GET as NextApiHandler,
	POST: POST as NextApiHandler,
	OPTIONS: OPTIONS as NextApiHandler,
});
