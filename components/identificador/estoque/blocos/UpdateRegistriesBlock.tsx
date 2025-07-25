import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { useMaterialLogs } from "@/utils/methods/query/materials";
import React from "react";

import UpdateRegistriesCard from "./UpdateRegistriesCard";
import { FileStack } from "lucide-react";

type UpdateRegistriesProps = {
	materialId: string;
};
function UpdateRegistries({ materialId }: UpdateRegistriesProps) {
	const { data: logs, isLoading, isError, isSuccess } = useMaterialLogs(materialId);
	return (
		<div className="w-full flex flex-col gap-3">
			<div className="w-fit flex items-center justify-start gap-2 rounded-lg bg-primary/20 px-4 py-1.5">
				<FileStack className="w-4 h-4 min-w-4 min-h-4" />
				<h1 className="w-full text-start text-xs font-medium leading-none tracking-tight">REGISTROS DE ATUALIZAÇÕES</h1>
			</div>
			{isLoading ? <LoadingPage /> : null}
			{isError ? <ErrorComponent msg={"Erro ao buscar registros de atualização."} /> : null}
			{isSuccess ? (
				<div className="flex w-full flex-wrap items-start justify-around gap-2 py-2">
					{logs.length > 0 ? (
						logs.map((log) => <UpdateRegistriesCard key={log._id} registry={log} />)
					) : (
						<p className="w-full text-center font-medium italic tracking-tight text-gray-500">Não há registros de atualizações.</p>
					)}
				</div>
			) : null}
		</div>
	);
}

export default UpdateRegistries;
