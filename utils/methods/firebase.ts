import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { fileTypes } from "../constants";
import { storage } from "../services/firebase/firebase-storage";

type UploadFileParams = {
	file: File;
	fileName: string;
	vinculationId?: string;
	prefix: string;
};
export async function uploadFile({ file, fileName, vinculationId, prefix }: UploadFileParams) {
	if (!file) throw new Error("Arquivo não fornecido.");
	const datetime = new Date().toISOString();
	const fileRef = ref(storage, `${prefix}/${vinculationId ? `(${vinculationId})` : ""} ${fileName} - ${datetime}`);
	const uploadResponse = await uploadBytes(fileRef, file);

	const url = await getDownloadURL(ref(storage, uploadResponse.metadata.fullPath));
	const format =
		uploadResponse.metadata.contentType && fileTypes[uploadResponse.metadata.contentType]
			? fileTypes[uploadResponse.metadata.contentType].title
			: "INDEFINIDO";
	const size = uploadResponse.metadata.size;
	return { url, format, size };
}

export async function handleDownload({ fileName, fileUrl }: { fileName: string; fileUrl: string }) {
	const downloadLoadingToast = toast.loading("Baixando arquivo...");

	// Fetch the file content as a blob
	const downloadResponse = await fetch(fileUrl);
	const blob = await downloadResponse.blob();

	// Create a blob URL and simulate a click to trigger the download
	const blobUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = blobUrl;
	link.download = fileName; // Specify the desired file name
	link.target = "_blank"; // Open in a new tab/window
	link.rel = "noopener noreferrer"; // Security best practice
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	// Revoke the blob URL to free up resources
	URL.revokeObjectURL(blobUrl);

	// If download went successfully
	toast.dismiss(downloadLoadingToast);
}
