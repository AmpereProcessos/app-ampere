import { useActivitiesByTechnicalAnalysisId } from "@/utils/methods/query/crm/activities";
import { TTechnicalAnalysisDTO } from "@/utils/schemas/technical-analysis";
import type { TAuthSession } from "@/lib/authentication/types";
import React, { useState } from "react";
import NewActivityMenu from "../../crmAtividades/NewActivityMenu";
import LoadingPage from "@/components/utils/LoadingPage";
import ErrorComponent from "@/components/utils/ErrorComponent";
import TechnicalAnalysisActivity from "./Utils/TechnicalAnalysisActivity";

type PendencyBlockProps = {
	session: TAuthSession;
	technicalAnalysisId: string;
	opportunity: { id?: string | null; nome?: string | null };
	infoHolder: TTechnicalAnalysisDTO;
	setInfoHolder: React.Dispatch<React.SetStateAction<TTechnicalAnalysisDTO>>;
	changes: object;
	setChanges: React.Dispatch<React.SetStateAction<object>>;
};
function PendencyBlock({ session, technicalAnalysisId, opportunity, infoHolder, setInfoHolder, changes, setChanges }: PendencyBlockProps) {
	const { data: activities, isLoading, isError, isSuccess } = useActivitiesByTechnicalAnalysisId({ technicalAnalysisId: technicalAnalysisId });
	return (
		<div className="mt-4 flex w-full flex-col">
			<div className="bg-primary/80 mb-2 flex w-full items-center justify-center gap-2 rounded-md p-2">
				<h1 className="font-bold text-white">PENDÊNCIAS</h1>
			</div>
			<NewActivityMenu
				session={session}
				opportunity={opportunity}
				project={undefined}
				technicalAnalysisId={technicalAnalysisId}
				affectedQueryKey={["technical-analysis-activities", technicalAnalysisId]}
			/>

			<div className="mt-2 flex w-full flex-col gap-1">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg="Houve um erro ao buscar atividades da análise técnica." /> : null}
				{isSuccess ? (
					activities.length > 0 ? (
						activities.map((activity, index) => (
							<TechnicalAnalysisActivity key={activity._id} activity={activity} technicalAnalysisId={technicalAnalysisId} />
						))
					) : (
						<p className="text-primary/60 flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
							Sem atividades adicionadas.
						</p>
					)
				) : null}
			</div>
		</div>
	);
}

export default PendencyBlock;
