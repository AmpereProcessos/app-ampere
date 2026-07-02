import axios from "axios";

import type { TDirectAddProjectOutput } from "@/pages/api/projects/direct-add";
import type { TProject } from "@/utils/schemas/projects";

export async function createDirectProject(project: TProject) {
	const { data } = await axios.post<TDirectAddProjectOutput>("/api/projects/direct-add", project);
	return data;
}
