import React from "react";

import Link from "next/link";

import type { TAuthSession } from "@/lib/authentication/types";
import { useFileReferencesByAnalysisId } from "@/utils/methods/query/crm/file-references";
import FileReferenceCard from "../../referencias-arquivos/FileReferenceCard";
import AttachFileMenu from "./Utils/AttachFileMenu";

type FilesBlockProps = {
	auxiliarFilesLink?: string | null;
	analysisId: string;
	session: TAuthSession;
};
function FilesBlock({ auxiliarFilesLink, analysisId, session }: FilesBlockProps) {
	const { data: fileReferences } = useFileReferencesByAnalysisId({ analysisId });
	return (
		<div className="mt-4 flex w-full flex-col">
			<div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
				<h1 className="font-bold text-white">ARQUIVOS</h1>
			</div>
			<div className="flex w-full flex-col items-center">
				<h1 className="font-sans font-bold text-primary">LINK PARA ARQUIVOS AUXILIARES</h1>
				{auxiliarFilesLink ? (
					<Link href={auxiliarFilesLink}>
						<p className="font-raleway w-fit cursor-pointer self-center text-center text-sm font-medium text-blue-300 duration-300 ease-in-out hover:text-cyan-300">
							{auxiliarFilesLink}
						</p>
					</Link>
				) : (
					<p className="text-primary/60 w-full py-2 text-center text-xs font-medium italic">Link não preenchido.</p>
				)}
			</div>
			<div className="mt-2 flex w-full flex-wrap justify-around gap-2">
				{fileReferences && fileReferences.length > 0 ? (
					fileReferences.map((file, index) => <FileReferenceCard info={file} />)
				) : (
					<p className="text-primary/60 w-full text-center text-xs font-medium italic">Nenhum arquivo adicionado.</p>
				)}
			</div>
			<div className="mt-2 w-full">
				<AttachFileMenu analysisId={analysisId} session={session} />
			</div>
		</div>
	);
}

export default FilesBlock;
