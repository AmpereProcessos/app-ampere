import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase/firebase-storage";
import { fileTypes } from "../constants";
import { uploadFile } from "./firebase";

export type TAttachmentState = {
	titulo: string;
	arquivos: {
		tipo: string | null;
		arquivo: File | null;
		previewUrl: string | null;
	}[];
	identificador: string;
};
function getFileFormat(contentType: string) {
	const fileFormatInfo = fileTypes[contentType];
	if (!fileFormatInfo) return "INDEFINIDO";
	return fileFormatInfo.title;
}
export async function generalFirebaseUpload({ file, path }: { file: File; path: string }) {
	try {
		const fileRef = ref(storage, path);
		const firebaseUploadResponse = await uploadBytes(fileRef, file);
		const firebaseUploadMetadataFullPath = firebaseUploadResponse.metadata.fullPath;
		const firebaseUploadMetadaContentType = firebaseUploadResponse.metadata.contentType;
		const url = await getDownloadURL(ref(storage, firebaseUploadMetadataFullPath));
		const format = getFileFormat(firebaseUploadMetadaContentType ?? "");
		return { url, format };
	} catch (error) {
		throw error;
	}
}

type HandleMultipleAttachmentsUpdateParams = {
	attachments: TAttachmentState[];
	vinculationId: string;
};
export async function handleMultipleAttachmentsUpdate({ attachments, vinculationId }: HandleMultipleAttachmentsUpdateParams) {
	try {
		const filesMetadata: { titulo: string; url: string; tamanho: number; formato: string }[] = [];
		const flattenAttachments = attachments.flatMap((attachment) => {
			return attachment.arquivos
				.filter((a) => !!a.arquivo)
				.map((file, index) => ({
					titulo: attachment.arquivos.length > 1 ? `${attachment.titulo} (${index + 1})` : attachment.titulo,
					arquivo: file.arquivo as File,
				}));
		});
		await Promise.all(
			flattenAttachments.map(async (attachment) => {
				const { url, format, size } = await uploadFile({
					file: attachment.arquivo,
					fileName: attachment.titulo,
					vinculationId: vinculationId,
					prefix: "property-usage",
				});
				filesMetadata.push({ titulo: attachment.titulo, url, formato: format, tamanho: size });
			}),
		);

		return filesMetadata;
	} catch (error) {
		console.error("Error uploading files:", error);
		throw error;
	}
}
