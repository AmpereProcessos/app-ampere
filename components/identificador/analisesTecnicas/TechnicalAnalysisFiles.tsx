import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { useFileReferencesByAnalysisId } from "@/utils/methods/query/crm/file-references";
import React from "react";
import FileReferenceCard from "../referencias-arquivos/FileReferenceCard";

type TechnicalAnalysisFilesProps = {
	analysisId: string;
};
function TechnicalAnalysisFiles({ analysisId }: TechnicalAnalysisFilesProps) {
	const { data: fileReferences, isLoading, isError, isSuccess } = useFileReferencesByAnalysisId({ analysisId });
	return (
		<div className="flex w-full flex-col gap-2">
			<h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">ARQUIVOS</h1>
			<div className="flex w-full grow flex-wrap items-start justify-around gap-2">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar arquivos da análise técnica."} /> : null}
				{isSuccess ? (
					fileReferences.length > 0 ? (
						fileReferences.map((reference) => <FileReferenceCard key={reference._id} info={reference} />)
					) : (
						<p className="text-primary/60 w-full text-center text-xs font-medium italic">Nenhum arquivo adicionado.</p>
					)
				) : null}
			</div>
		</div>
	);
}

export default TechnicalAnalysisFiles;
