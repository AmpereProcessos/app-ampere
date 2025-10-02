import TextInput from "@/components/inputs/Text";
import { formatToPhone } from "@/utils/methods/formatting";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import type { TUser } from "@/utils/schemas/users";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import { MdAttachFile } from "react-icons/md";

type GeneralProps = {
	infoHolder: TUser;
	updateInfoHolder: (info: Partial<TUser>) => void;
	avatarHolder: TSimpleAttachment;
	updateAvatarHolder: (avatar: TSimpleAttachment) => void;
};
function EmployeeGeneral({ infoHolder, updateInfoHolder, avatarHolder, updateAvatarHolder }: GeneralProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<LayoutGrid size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES GERAIS</h1>
			</div>
			<div className="w-full flex flex-col gap-3">
				<GeneralAvatar avatarUrl={infoHolder.avatar_url} avatarHolder={avatarHolder} updateAvatarHolder={updateAvatarHolder} />
				<TextInput
					label="NOME"
					value={infoHolder.nome}
					placeholder="Preencha o nome do completo..."
					handleChange={(value) => updateInfoHolder({ nome: value })}
					width="100%"
				/>

				<TextInput
					label="EMAIL"
					value={infoHolder.email}
					placeholder="Preencha o email do usuário..."
					handleChange={(value) => updateInfoHolder({ email: value })}
					width="100%"
				/>
				<TextInput
					label="TELEFONE"
					value={infoHolder.telefone}
					placeholder="Preencha o telefone do usuário..."
					handleChange={(value) => updateInfoHolder({ telefone: formatToPhone(value) })}
					width="100%"
				/>
			</div>
		</div>
	);
}

export default EmployeeGeneral;

function GeneralAvatar({
	avatarUrl,
	avatarHolder,
	updateAvatarHolder,
}: { avatarUrl: TUser["avatar_url"]; avatarHolder: TSimpleAttachment; updateAvatarHolder: (avatar: TSimpleAttachment) => void }) {
	return (
		<div className="w-full flex items-center justify-center">
			<label htmlFor="dropzone-file" className="relative h-[125px] w-[125px] rounded-lg overflow-hidden cursor-pointer">
				{avatarUrl ? (
					<Image src={avatarUrl} alt="Imagem do avatar." objectFit="cover" fill={true} />
				) : avatarHolder.previewUrl ? (
					<Image src={avatarHolder.previewUrl} alt="Imagem do avatar." objectFit="cover" fill={true} />
				) : (
					<div className="w-full h-full bg-primary/20 flex items-center justify-center gap-1 flex-col">
						<MdAttachFile className="w-6 h-6" />
						<p className="font-medium text-xs text-center">DEFINIR IMAGEM DO AVATAR</p>
					</div>
				)}
				<input
					onChange={(e) => {
						const file = e.target.files?.[0] ?? null;
						updateAvatarHolder({ file, previewUrl: file ? URL.createObjectURL(file) : null });
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
