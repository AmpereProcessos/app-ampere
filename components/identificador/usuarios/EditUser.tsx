import TextInput from "@/components/inputs/Text";
import { formatToPhone } from "@/utils/constants";
import type { TEmployeeDTO, TUserDTO } from "@/utils/schemas/users";
import type React from "react";
import { useEffect, useState } from "react";

import type { TAuthSession } from "@/lib/authentication/types";

import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { uploadFile } from "@/utils/methods/firebase";
import { formatAsSlug } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateEmployee } from "@/utils/methods/mutation/employees";
import { useUserById } from "@/utils/methods/query/users";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AvatarAttachment from "../colaboradores/AvatarAttachment";
import EmployeeGeneral from "../colaboradores/blocos/General";
import SystemAccess from "../colaboradores/blocos/SystemAccess";

type EditUserProps = {
	userId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: { onMutate?: () => void; onSettled?: () => void; onSuccess?: () => void; onError?: (error: Error) => void };
};
function EditUser({ userId, session, closeModal, callbacks }: EditUserProps) {
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TUserDTO>({
		_id: "id-holder",
		acessoAtivo: true,
		usuario: "",
		nome: "",
		email: "",
		telefone: "",
		avatar_url: "",
		visualizacao: {
			tipo: null,
			referencia: null,
		},
		permissoes: {
			rotas: [],
			usuarios: {
				escopo: null,
				visualizar: false,
				editar: false,
				criar: false,
			},
			comercial: {
				visualizar: false,
				editar: false,
			},
			posVenda: {
				visualizar: false,
				editar: false,
			},
			suprimentos: {
				visualizar: false,
				editar: false,
			},
			engenharia: {
				visualizar: false,
				editar: false,
			},
			execucao: {
				visualizar: false,
				editar: false,
			},
			suporte: {
				visualizar: false,
				editar: false,
			},
			administrativo: {
				visualizar: false,
				editar: false,
			},
			financeiro: {
				visualizar: false,
				editar: false,
			},
			recursosHumanos: {
				visualizar: false,
				editar: false,
			},
			gestao: {
				visualizarResultados: false,
				restringirProjetos: false,
			},
			ordensDeServico: {
				criar: false,
				visualizar: false,
				editar: false,
			},
			chats: {
				visualizar: false,
				enviarMensagens: false,
			},
			certificacoes: {
				visualizar: false,
				editar: false,
				criar: false,
			},
		},
		empresaVinculada: "", //
		cargos: [], //
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});
	function updateInfoHolder(info: Partial<TUserDTO>) {
		setInfoHolder((prev) => ({ ...prev, ...info }));
	}
	const [avatarHolder, setAvatarHolder] = useState<TSimpleAttachment>({
		file: null,
		previewUrl: null,
	});
	function updateAvatarHolder(avatar: TSimpleAttachment) {
		setAvatarHolder((prev) => ({ ...prev, ...avatar }));
	}
	const { data: employee, queryKey, isLoading, isSuccess, isError } = useUserById({ id: userId });

	async function handleUpdateEmployee({ id, changes, file }: { id: string; changes: TUserDTO; file: TSimpleAttachment["file"] }) {
		let imageUrl = changes.avatar_url;
		if (file) {
			const { url } = await uploadFile({
				vinculationId: changes.nome,
				fileName: `${formatAsSlug(changes.nome)}-avatar`,
				file: file,
				prefix: "usuarios",
			});
			imageUrl = url;
		}
		return await updateEmployee({ id, changes: { ...changes, avatar_url: imageUrl } });
	}
	const { mutate: handleUpdateEmployeeMutation, isPending: updateLoading } = useMutation({
		mutationKey: ["update-employee"],
		mutationFn: handleUpdateEmployee,
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
	useEffect(() => {
		if (employee) setInfoHolder(employee);
	}, [employee]);

	return (
		<ResponsiveDialogDrawer
			menuTitle="EDITAR USUÁRIO"
			menuDescription="Preencha os campos abaixo para editar o usuário."
			menuActionButtonText="ATUALIZAR USUÁRIO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleUpdateEmployeeMutation({ id: userId, changes: infoHolder, file: avatarHolder.file })}
			actionIsPending={updateLoading}
			stateIsLoading={isLoading}
			closeMenu={closeModal}
		>
			<EmployeeGeneral infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} avatarHolder={avatarHolder} updateAvatarHolder={updateAvatarHolder} />
			<SystemAccess initialMode={true} infoHolder={infoHolder as TEmployeeDTO} updateInfoHolder={updateInfoHolder} />
		</ResponsiveDialogDrawer>
	);
}

export default EditUser;
