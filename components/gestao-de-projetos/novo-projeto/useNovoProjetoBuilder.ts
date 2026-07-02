"use client";

import { useMemo, useState } from "react";

import { createEmptyDirectProject } from "@/utils/methods/util/direct-projects";

import { NEW_PROJECT_STAGE_ORDER, type TDirectProjectDraft, type TNewProjectStage } from "./types";
import { applyClientToProject, createEmptyClientDraft } from "./utils/project-mappers";
import { validateDirectProjectStage } from "./utils/validation";

export function useNovoProjetoBuilder() {
	const [currentStage, setCurrentStage] = useState<TNewProjectStage>("cliente");
	const [furthestStageIndex, setFurthestStageIndex] = useState(0);
	const [draft, setDraft] = useState<TDirectProjectDraft>(() => ({
		client: createEmptyClientDraft(),
		project: createEmptyDirectProject(),
	}));

	const currentStageIndex = NEW_PROJECT_STAGE_ORDER.indexOf(currentStage);

	const updateClient = (client: Partial<TDirectProjectDraft["client"]>) => {
		setDraft((prev) => {
			const nextClient = { ...prev.client, ...client };
			return {
				client: nextClient,
				project: applyClientToProject(prev.project, nextClient),
			};
		});
	};

	const updateClientData = (clientData: Partial<TDirectProjectDraft["client"]["clientData"]>) => {
		setDraft((prev) => {
			const nextClient = {
				...prev.client,
				clientData: { ...prev.client.clientData, ...clientData },
			};
			return {
				client: nextClient,
				project: applyClientToProject(prev.project, nextClient),
			};
		});
	};

	const updateProject = (project: Partial<TDirectProjectDraft["project"]>) => {
		setDraft((prev) => ({
			...prev,
			project: { ...prev.project, ...project },
		}));
	};

	const updateProjectWith = (updater: (project: TDirectProjectDraft["project"]) => TDirectProjectDraft["project"]) => {
		setDraft((prev) => ({
			...prev,
			project: updater(prev.project),
		}));
	};

	const validation = useMemo(() => validateDirectProjectStage(currentStage, draft), [currentStage, draft]);

	function goNext() {
		const result = validateDirectProjectStage(currentStage, draft);
		if (!result.valid) return result;
		const nextStage = NEW_PROJECT_STAGE_ORDER[currentStageIndex + 1];
		if (nextStage) {
			setCurrentStage(nextStage);
			setFurthestStageIndex((prev) => Math.max(prev, currentStageIndex + 1));
		}
		return result;
	}

	return {
		currentStage,
		setCurrentStage,
		furthestStageIndex,
		setFurthestStageIndex,
		draft,
		setDraft,
		updateClient,
		updateClientData,
		updateProject,
		updateProjectWith,
		validation,
		goNext,
	};
}
