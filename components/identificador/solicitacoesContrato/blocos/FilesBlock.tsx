import TextInput from "@/components/inputs/Text";
import ArchiveLinkBlock from "@/components/utils/FileLinkBlock";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { fileTypes } from "@/utils/constants";
import type { TContractRequest } from "@/utils/schemas/contract-requests";
import { storage } from "@/utils/services/firebase/firebase-storage";
import { useQueryClient } from "@tanstack/react-query";
import { type UploadResult, deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FolderOpen } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BsCloudUploadFill } from "react-icons/bs";

type TFileHolder = { title: string; files: FileList | null };
type FilesBlockProps = {
	tag: string;
	files: TContractRequest["links"];
	vinculateFiles: (files: TContractRequest["links"]) => void;
	vinculationPending: boolean;
};
function FilesBlock({ tag, files, vinculateFiles, vinculationPending }: FilesBlockProps) {
	const queryClient = useQueryClient();
	const [fileHolder, setFileHolder] = useState<TFileHolder>({
		title: "",
		files: null,
	});

	async function attachFiles(fileHolder: TFileHolder) {
		const links: {
			title: string;
			link: string;
			format: string;
		}[] = [];
		if (fileHolder.title.trim().length < 2) return toast.error("Preencha um nome de ao menos 2 caractéres para o arquivo.");
		if (!fileHolder.files || fileHolder.files.length === 0) return toast.error("Anexe ao menos um arquivo.");
		// In case was attached more than one file
		if (fileHolder.files.length > 0) {
			const promises = Array.from(fileHolder.files).map(async (file, index) => {
				const fileAttachmentName = fileHolder.title.toLocaleLowerCase().replaceAll(" ", "_");
				const storageStr = `formSolicitacao/${tag}/${fileAttachmentName} ${index + 1} - ${new Date().toISOString()}`;
				const fileRef = ref(storage, storageStr);
				const firebaseUploadResponse = await uploadBytes(fileRef, file);
				const uploadResult = firebaseUploadResponse as UploadResult;
				const fileTitle = `${fileHolder.title.toUpperCase()} (${index + 1})`;
				const fileUrl = await getDownloadURL(ref(storage, firebaseUploadResponse.metadata.fullPath));
				const fileFormat = fileTypes[uploadResult.metadata.contentType || ""]?.title || "NÃO DEFINIDO";
				links.push({ title: fileTitle, format: fileFormat, link: fileUrl });
			});
			await Promise.all(promises);
		} else {
			// In case only one file was attached
			const file = fileHolder.files[0];
			const fileAttachmentName = fileHolder.title.toLocaleLowerCase().replaceAll(" ", "_");
			const storageStr = `formSolicitacao/${tag}/${fileAttachmentName} - ${new Date().toISOString()}`;
			const fileRef = ref(storage, storageStr);
			const firebaseUploadResponse = await uploadBytes(fileRef, file);
			const uploadResult = firebaseUploadResponse as UploadResult;
			const fileTitle = fileHolder.title.toUpperCase();
			const fileUrl = await getDownloadURL(ref(storage, firebaseUploadResponse.metadata.fullPath));
			const fileFormat = fileTypes[uploadResult.metadata.contentType || ""]?.title || "NÃO DEFINIDO";
			links.push({ title: fileTitle, format: fileFormat, link: fileUrl });
		}
		const newLinks = [...(files || []), ...links];
		vinculateFiles(newLinks);
		setFileHolder({ title: "", files: null });
		return;
	}
	async function deleteFile({ index, url }: { index: number; url: string }) {
		try {
			const storageRef = ref(storage, url);
			const firebaseDeleteResponse = await deleteObject(storageRef);
			const newLinks = [...(files || [])];
			newLinks.splice(index, 1);
			vinculateFiles(newLinks);
		} catch (error) {
			console.error("Error deleting file", error);
			return toast.error("Erro ao excluir arquivo.");
		}
	}
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="DOCUMENTAÇÃO" sectionTitleIcon={<FolderOpen className="h-4 w-4 min-h-4 min-w-4" />}>
			<div className="flex flex-col gap-6 rounded-md border border-primary pb-2 shadow-lg">
				<div className="flex w-full grow flex-wrap items-start justify-around gap-2 px-2">
					{files?.map((x, index) => (
						<div key={`${x.title}-${index}`} className="w-full lg:w-[450px]">
							<ArchiveLinkBlock
								obj={x}
								deleteFile={(x: {
									title: string;
									link: string;
									format: string;
								}) => deleteFile({ index: index, url: x.link })}
							/>
						</div>
					))}
				</div>
				<div className="mt-2 flex w-full flex-col items-center px-2">
					<h1 className="text-sm font-bold tracking-tight">ANEXE NOVOS ARQUIVOS</h1>
					<div className="mb-2 w-full">
						<TextInput
							label="TITULO DO ARQUIVO"
							placeholder="Preencha aqui o nome a ser dado ao arquivo..."
							value={fileHolder.title}
							handleChange={(value) => setFileHolder((prev) => ({ ...prev, title: value }))}
							width="100%"
						/>
					</div>
					<div className="relative mb-4 flex w-full items-center justify-center">
						<label
							htmlFor="dropzone-file"
							className="dark:hover:bg-bray-800 dark:border-primary/80 dark:hover:bg-primary/80 border-primary/20 dark:hover:border-primary/60 hover:bg-primary/20 dark:bg-primary/70 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50"
						>
							<div className="text-primary/80 flex flex-col items-center justify-center pt-5 pb-6">
								<BsCloudUploadFill color={"rgb(31,41,55)"} size={50} />

								{fileHolder.files ? (
									<p className="text-primary/60 mb-2 text-sm dark:text-gray-400">
										{fileHolder.files.length > 0 ? `${fileHolder.files[0]?.name}, outros...` : fileHolder.files[0].name}
									</p>
								) : (
									<p className="text-primary/60 mb-2 px-2 text-center text-sm dark:text-gray-400">
										<span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a àrea demarcada
									</p>
								)}
							</div>
							<input
								onChange={(e) => {
									if (e.target.files)
										return setFileHolder((prev) => ({
											...prev,
											files: e.target.files,
										}));
									return setFileHolder((prev) => ({ ...prev, files: null }));
								}}
								id="dropzone-file"
								type="file"
								multiple={true}
								className="absolute h-full w-full opacity-0"
							/>
						</label>
					</div>
					<div className="flex w-full items-center justify-end">
						<button
							type="button"
							disabled={vinculationPending}
							onClick={() => attachFiles(fileHolder)}
							className="disabled:bg-primary/60 enabled:hover:bg-primary/80 h-9 rounded bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:text-white disabled:text-white"
						>
							ANEXAR
						</button>
					</div>
				</div>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default FilesBlock;
