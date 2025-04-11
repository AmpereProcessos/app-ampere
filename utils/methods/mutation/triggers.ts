import axios from "axios";

export async function handleProjectServiceOrderTrigger({ projectId }: { projectId: string }) {
	try {
		const { data } = await axios.post("/api/projects/triggers", {
			projectId,
			triggerType: "create-project-main-service-order",
		});
		if (typeof data.message !== "string") throw new Error("Oops, um erro desconhecido ocorreu.");
		return data.message as string;
	} catch (error) {
		console.log("Error running handleProjectServiceOrderTrigger", error);
		throw error;
	}
}

export async function handleOpportunityOnJourneyEndTrigger({ projectId }: { projectId: string }) {
	try {
		const { data } = await axios.post("/api/projects/triggers", {
			projectId,
			triggerType: "create-opportunity-on-project-journey-end",
		});
		if (typeof data.message !== "string") throw new Error("Oops, um erro desconhecido ocorreu.");
		return data.message as string;
	} catch (error) {
		console.log("Error running handleOpportunityOnJourneyEndTrigger", error);
		throw error;
	}
}
export async function handleTechnicalAnalysisServiceOrderTrigger({ technicalAnalysisId }: { technicalAnalysisId: string }) {
	try {
		const { data } = await axios.post("/api/analises-tecnicas/triggers", {
			technicalAnalysisId,
			triggerType: "create-technical-analysis-service-order",
		});
		if (typeof data.message !== "string") throw new Error("Oops, um erro desconhecido ocorreu.");
		return data.message as string;
	} catch (error) {
		console.log("Error running handleTechnicalAnalysisServiceOrderTrigger", error);
		throw error;
	}
}

export async function handleProjectPurchaseControlTrigger({ projectId }: { projectId: string }) {
	try {
		const { data } = await axios.post("/api/projects/triggers", {
			projectId,
			triggerType: "sync-project-with-purchase",
		});
		if (typeof data.message !== "string") throw new Error("Oops, um erro desconhecido ocorreu.");
		return data.message as string;
	} catch (error) {
		console.log("Error running handleProjectPurchaseControlTrigger", error);
		throw error;
	}
}
