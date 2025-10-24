import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { uploadFile } from "@/utils/methods/firebase";
import { formatAsSlug } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateProject } from "@/utils/methods/mutation/clients";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import type { TProject } from "@/utils/schemas/projects";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdAttachFile } from "react-icons/md";

type ProjectCoverImageProps = {
	projectId: string;
	projectName: string;
	projectCoverImage: TProject["imagemCapaUrl"];

	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
function ProjectCoverImage({ projectId, projectName, projectCoverImage, callbacks }: ProjectCoverImageProps) {
	const [imageHolder, setImageHolder] = useState<TSimpleAttachment>({ file: null, previewUrl: null });

	function updateImageHolder(image: TSimpleAttachment) {
		setImageHolder((prev) => ({ ...prev, ...image }));
	}

	async function handleUpdateProjectCoverImage(file: TSimpleAttachment["file"]) {
		if (!file) return toast.error("Imagem não informada.");
		const { url } = await uploadFile({
			vinculationId: projectId,
			fileName: `${formatAsSlug(projectName)}-imagem-capa`,
			file: file,
			prefix: "projetos",
		});
		return await updateProject({
			id: projectId,
			changes: { imagemCapaUrl: url },
		});
	}

	const { mutate: handleUpdateProjectCoverImageMutation, isPending } = useMutation({
		mutationKey: ["update-project-cover-image", projectId],
		mutationFn: handleUpdateProjectCoverImage,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success("Imagem da capa atualizada com sucesso!");
		},
		onError: async (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(getErrorMessage(error));
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
	});
	return (
		<div className="w-full flex flex-col gap-2 items-center justify-center">
			<ImageContent imageUrl={projectCoverImage} imageHolder={imageHolder} updateImageHolder={updateImageHolder} />
			{imageHolder.file ? (
				<LoadingButton onClick={() => handleUpdateProjectCoverImageMutation(imageHolder.file)} loading={isPending}>
					ATUALIZAR IMAGEM DA CAPA
				</LoadingButton>
			) : null}
		</div>
	);
}
export default ProjectCoverImage;

function ImageContent({
	imageUrl,
	imageHolder,
	updateImageHolder,
}: {
	imageUrl: TProject["imagemCapaUrl"];
	imageHolder: TSimpleAttachment;
	updateImageHolder: (image: TSimpleAttachment) => void;
}) {
	return (
		<div className="flex items-center justify-center min-h-[250px] min-w-[250px]">
			<label className="relative aspect-square w-full max-w-[250px] cursor-pointer overflow-hidden rounded-lg" htmlFor="dropzone-file">
				<ImagePreview imageHolder={imageHolder} imageUrl={imageUrl} />
				<input
					accept=".png,.jpeg,.jpg"
					className="absolute h-full w-full cursor-pointer opacity-0"
					id="dropzone-file"
					multiple={false}
					onChange={(e) => {
						const file = e.target.files?.[0] ?? null;
						updateImageHolder({
							file,
							previewUrl: file ? URL.createObjectURL(file) : null,
						});
					}}
					tabIndex={-1}
					type="file"
				/>
			</label>
		</div>
	);
}

function ImagePreview({
	imageUrl,
	imageHolder,
}: {
	imageUrl: TProject["imagemCapaUrl"];
	imageHolder: TSimpleAttachment;
}) {
	if (imageHolder.previewUrl) {
		return <Image src={imageHolder.previewUrl} alt="Imagem da capa do projeto." fill className="object-cover" />;
	}
	if (imageUrl) {
		return <Image src={imageUrl} alt="Imagem da capa do projeto." fill className="object-cover" />;
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-primary/20">
			<MdAttachFile className="h-6 w-6" />
			<p className="text-center font-medium text-xs">DEFINIR IMAGEM DA CAPA</p>
		</div>
	);
}
