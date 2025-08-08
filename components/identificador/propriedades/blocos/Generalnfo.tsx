import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import type { TProperty } from "@/utils/schemas/properties";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import { MdAttachFile } from "react-icons/md";

type GeneralInfoProps = {
	imageHolder: TSimpleAttachment;
	setImageHolder: (image: TSimpleAttachment) => void;
	infoHolder: TProperty;
	updateInfoHolder: (info: Partial<TProperty>) => void;
};
export default function GeneralInfo({ imageHolder, setImageHolder, infoHolder, updateInfoHolder }: GeneralInfoProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<LayoutGrid size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DA PROPRIEDADE</h1>
			</div>
			<ImageContent imageUrl={infoHolder.imagemUrl} imageHolder={imageHolder} setImageHolder={setImageHolder} />
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="NOME DA PROPRIEDADE"
						placeholder="Preencha o nome da propriedade..."
						value={infoHolder.nome}
						handleChange={(value) => updateInfoHolder({ nome: value })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label="IDENTIFICADOR DA PROPRIEDADE"
						placeholder="Preencha o identificador da propriedade..."
						value={infoHolder.identificador}
						handleChange={(value) => updateInfoHolder({ identificador: value })}
						width="100%"
					/>
				</div>
			</div>
			<TextareaInput
				label="ANOTAÇÕES"
				placeholder="Preencha as anotações da propriedade..."
				value={infoHolder.anotacoes ?? ""}
				handleChange={(value) => updateInfoHolder({ anotacoes: value })}
			/>
		</div>
	);
}

function ImageContent({
	imageUrl,
	imageHolder,
	setImageHolder,
}: { imageUrl: TProperty["imagemUrl"]; imageHolder: TSimpleAttachment; setImageHolder: (image: TSimpleAttachment) => void }) {
	return (
		<div className="w-full flex items-center justify-center">
			<label htmlFor="dropzone-file" className="relative h-[125px] w-[125px] rounded-lg overflow-hidden cursor-pointer">
				{imageUrl ? (
					<Image src={imageUrl} alt="Imagem principal do item." objectFit="cover" fill={true} />
				) : imageHolder.previewUrl ? (
					<Image src={imageHolder.previewUrl} alt="Imagem principal do item." objectFit="cover" fill={true} />
				) : (
					<div className="w-full h-full bg-primary/20 flex items-center justify-center gap-1 flex-col">
						<MdAttachFile className="w-6 h-6" />
						<p className="font-medium text-xs text-center">DEFINIR IMAGEM PRINCIPAL</p>
					</div>
				)}
				<input
					onChange={(e) => {
						const file = e.target.files?.[0] ?? null;
						setImageHolder({ file, previewUrl: file ? URL.createObjectURL(file) : null });
					}}
					id="dropzone-file"
					type="file"
					className="absolute h-full w-full opacity-0 cursor-pointer"
					accept=".png,.jpeg,.jpg"
					multiple={false}
					tabIndex={-1}
				/>
			</label>
		</div>
	);
}
