import DateInput from "@/components/inputs/Date";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import type { TGetProfileOutput, TUpdateProfileInput } from "@/pages/api/colaboradores/perfil";
import { formatDate, formatToPhone } from "@/utils/constants";
import { uploadFile } from "@/utils/methods/firebase";
import { formatAsSlug, formatToCPForCNPJ } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateProfile } from "@/utils/methods/mutation/users";
import { useProfile } from "@/utils/methods/query/users";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import type { TAttachmentHolder } from "@/utils/schemas/useful";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdAttachFile } from "react-icons/md";

type EditProfileProps = {
	session: TAuthSession;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
	closeModal: () => void;
};
export default function EditProfile({ session, closeModal, callbacks }: EditProfileProps) {
	const queryClient = useQueryClient();
	const { data: profile, queryKey, isLoading, isError, error, isSuccess } = useProfile();

	const [infoHolder, setInfoHolder] = useState<TUpdateProfileInput>({
		usuario: "",
		nome: "",
		telefone: "",
		rg: "",
		cpf: "",
		avatar_url: "",
		dataNascimento: "",
		localNascimento: "",
		nacionalidade: "",
		estadoCivil: "",
	});
	function updateInfoHolder(changes: Partial<TUpdateProfileInput>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	const [avatarHolder, setAvatarHolder] = useState<TSimpleAttachment>({
		previewUrl: "",
		file: null,
	});
	function updateAvatarHolder(changes: Partial<TSimpleAttachment>) {
		setAvatarHolder((prev) => ({ ...prev, ...changes }));
	}
	useEffect(() => {
		if (profile) setInfoHolder(profile);
	}, [profile]);

	async function handleUpdateProfile({ input, file }: { input: TUpdateProfileInput; file: TSimpleAttachment["file"] }) {
		let imageUrl = input.avatar_url;
		if (file) {
			const { url } = await uploadFile({
				vinculationId: input.nome,
				fileName: `${formatAsSlug(input.nome)}-avatar`,
				file: file,
				prefix: "colaboradores",
			});
			imageUrl = url;
		}
		return await updateProfile({ input: { ...input, avatar_url: imageUrl } });
	}
	const { mutate: handleUpdateProfileMutation, isPending: updateLoading } = useMutation({
		mutationKey: ["update-profile"],
		mutationFn: handleUpdateProfile,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queryKey });
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data.message);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKey });
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: async (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(getErrorMessage(error));
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="EDITAR PERFIL"
			menuDescription="Preencha os campos abaixo para editar o perfil."
			menuActionButtonText="EDITAR PERFIL"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleUpdateProfileMutation({ input: infoHolder, file: avatarHolder.file })}
			actionIsPending={updateLoading}
			stateIsLoading={isLoading}
			closeMenu={closeModal}
		>
			<ProfileContent infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} avatarHolder={avatarHolder} updateAvatarHolder={updateAvatarHolder} />
		</ResponsiveDialogDrawer>
	);
}

type ProfileContentProps = {
	infoHolder: TUpdateProfileInput;
	updateInfoHolder: (info: Partial<TUpdateProfileInput>) => void;
	avatarHolder: TSimpleAttachment;
	updateAvatarHolder: (changes: Partial<TSimpleAttachment>) => void;
};
function ProfileContent({ infoHolder, updateInfoHolder, avatarHolder, updateAvatarHolder }: ProfileContentProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
				<LayoutGrid size={15} />
				<h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES DO PERFIL</h1>
			</div>
			<ProfileContentAvatar avatarUrl={infoHolder.avatar_url} avatarHolder={avatarHolder} updateAvatarHolder={updateAvatarHolder} />
			<div className="flex flex-col w-full items-center gap-2">
				<TextInput
					label="NOME COMPLETO"
					placeholder="Preencha aqui o nome completo..."
					value={infoHolder.nome}
					handleChange={(value) => updateInfoHolder({ nome: value })}
					width="100%"
				/>
				<div className="w-full flex items-center gap-2">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="NOME DE USUÁRIO"
							placeholder="Preencha aqui o nome de usuário..."
							value={infoHolder.usuario}
							handleChange={(value) => updateInfoHolder({ usuario: value })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<TextInput
							label="TELEFONE"
							placeholder="Preencha aqui o telefone..."
							value={infoHolder.telefone}
							handleChange={(value) => updateInfoHolder({ telefone: formatToPhone(value) })}
							width="100%"
						/>
					</div>
				</div>
				<div className="w-full flex items-center gap-2">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="CPF"
							placeholder="Preencha aqui o CPF..."
							value={infoHolder.cpf}
							handleChange={(value) => updateInfoHolder({ cpf: formatToCPForCNPJ(value) })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<DateInput
							label="DATA DE NASCIMENTO"
							value={infoHolder.dataNascimento ? formatDate(infoHolder.dataNascimento) : undefined}
							handleChange={(value) => updateInfoHolder({ dataNascimento: formatDateInputChange(value, "string") as string })}
							width="100%"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function ProfileContentAvatar({
	avatarUrl,
	avatarHolder,
	updateAvatarHolder,
}: { avatarUrl: TGetProfileOutput["data"]["avatar_url"]; avatarHolder: TSimpleAttachment; updateAvatarHolder: (avatar: TSimpleAttachment) => void }) {
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
