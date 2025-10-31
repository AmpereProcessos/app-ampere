import { Button } from "@/components/ui/button";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { FileImage, FileText, Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type FileUploadComponentProps = {
	onFileSelect: ({ file, fileName, downloadURL }: { file: File; fileName: string; downloadURL: string }) => void;
	disabled?: boolean;
};

// WhatsApp file size limits
const FILE_SIZE_LIMITS = {
	image: 5 * 1024 * 1024, // 5MB for images
	document: 16 * 1024 * 1024, // 16MB for documents
};

// Supported file types
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const SUPPORTED_DOCUMENT_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/plain",
	"text/csv",
];

function FileUploadComponent({ onFileSelect, disabled = false }: FileUploadComponentProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	const validateFile = (file: File): { isValid: boolean; error?: string; fileType?: "image" | "document" } => {
		// Check if it's an image
		if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
			if (file.size > FILE_SIZE_LIMITS.image) {
				return {
					isValid: false,
					error: `Imagem muito grande. Tamanho máximo: ${FILE_SIZE_LIMITS.image / (1024 * 1024)}MB`,
				};
			}
			return { isValid: true, fileType: "image" };
		}

		// Check if it's a document
		if (SUPPORTED_DOCUMENT_TYPES.includes(file.type)) {
			if (file.size > FILE_SIZE_LIMITS.document) {
				return {
					isValid: false,
					error: `Documento muito grande. Tamanho máximo: ${FILE_SIZE_LIMITS.document / (1024 * 1024)}MB`,
				};
			}
			return { isValid: true, fileType: "document" };
		}

		return {
			isValid: false,
			error: "Tipo de arquivo não suportado. Suportados: imagens (JPEG, PNG, GIF, WebP) e documentos (PDF, Word, Excel, TXT, CSV)",
		};
	};

	const handleFileSelect = async (file: File) => {
		const validation = validateFile(file);
		if (!validation.isValid) {
			toast.error(validation.error || "Arquivo inválido");
			return;
		}

		setSelectedFile(file);
		setIsUploading(true);
		setUploadProgress(0);

		try {
			// Get Firebase Storage instance
			const storage = getStorage();

			// Create a unique file name with timestamp
			const timestamp = Date.now();
			const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
			const storagePath = `chat-media/${validation.fileType}s/${timestamp}_${sanitizedFileName}`;

			// Create storage reference
			const storageRef = ref(storage, storagePath);

			// Upload file with progress tracking
			const uploadTask = uploadBytesResumable(storageRef, file, {
				contentType: file.type,
			});

			// Monitor upload progress
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setUploadProgress(Math.round(progress));
				},
				(error) => {
					console.error("Error uploading file:", error);
					toast.error("Erro ao carregar arquivo");
					setIsUploading(false);
					setSelectedFile(null);
					setUploadProgress(0);
				},
				async () => {
					// Upload completed successfully, get download URL
					try {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

						// Call parent callback
						onFileSelect({ file, fileName: file.name, downloadURL });

						toast.success("Arquivo carregado com sucesso!");
					} catch (error) {
						console.error("Error getting download URL:", error);
						toast.error("Erro ao obter URL do arquivo");
					} finally {
						setIsUploading(false);
						setSelectedFile(null);
						setUploadProgress(0);
						if (fileInputRef.current) {
							fileInputRef.current.value = "";
						}
					}
				},
			);
		} catch (error) {
			console.error("Error uploading file:", error);
			toast.error("Erro ao carregar arquivo");
			setIsUploading(false);
			setSelectedFile(null);
			setUploadProgress(0);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const openFileDialog = () => {
		if (!disabled && !isUploading) {
			fileInputRef.current?.click();
		}
	};

	const cancelUpload = () => {
		setIsUploading(false);
		setSelectedFile(null);
		setUploadProgress(0);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="relative">
			<input
				ref={fileInputRef}
				type="file"
				accept={[...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOCUMENT_TYPES].join(",")}
				onChange={handleInputChange}
				className="hidden"
				disabled={disabled || isUploading}
			/>

			{isUploading && selectedFile ? (
				<div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
					<div className="flex items-center gap-2 flex-1">
						{SUPPORTED_IMAGE_TYPES.includes(selectedFile.type) ? (
							<FileImage className="w-4 h-4 text-blue-600" />
						) : (
							<FileText className="w-4 h-4 text-blue-600" />
						)}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">{selectedFile.name}</p>
							<div className="flex items-center gap-2">
								<p className="text-xs text-blue-600 dark:text-blue-400">Enviando... {uploadProgress}%</p>
								<div className="flex-1 h-1 bg-blue-200 rounded-full overflow-hidden">
									<div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
								</div>
							</div>
						</div>
					</div>
					<Button variant="ghost" size="icon" className="h-6 w-6" onClick={cancelUpload}>
						<X className="w-4 h-4" />
					</Button>
				</div>
			) : (
				<div onDrop={handleDrop} onDragOver={handleDragOver} className="flex items-center justify-center">
					<Button type="button" size="icon" onClick={openFileDialog} disabled={disabled || isUploading} title="Anexar arquivo" variant="ghost">
						<Paperclip className="w-4 h-4" />
					</Button>
				</div>
			)}
		</div>
	);
}

export default FileUploadComponent;
