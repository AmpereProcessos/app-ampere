import TextInput from "@/components/inputs/Text";
import { formatToPhone } from "@/utils/constants";

import type { TEmployee, TEmployeeDTO } from "@/utils/schemas/users";
import type React from "react";
import { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";

import CheckboxInput from "@/components/inputs/Checkbox";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { uploadFile } from "@/utils/methods/firebase";
import { formatAsSlug } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createEmployee } from "@/utils/methods/mutation/employees";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EmployeeGeneral from "../colaboradores/blocos/General";
import SystemAccess from "../colaboradores/blocos/SystemAccess";

type NewUserProps = {
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
		onSettled?: () => void;
	};
};
function NewUser({ session, closeModal, callbacks }: NewUserProps) {
	const queryClient = useQueryClient();

	const initialInfoHolder: TEmployee = {
		acessoAtivo: true,
		colaboradorAtivo: true,
		nome: "",
		usuario: "",
		email: "",
		telefone: "",
		senha: "",
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
		dataNascimento: "", //
		localNascimento: "",
		nacionalidade: "", //
		estadoCivil: "", //
		grauInstrucao: "", //
		tituloEleitor: "", //
		carteiraTrabalho: {
			pisPaseb: "", //
			numero: "", //
			serie: "", //
		},
		rg: "", //
		cpf: "", //
		carteiraTransito: {
			numero: "", //
			dataVencimento: null, //
		},
		qtdeFilhos: 0, //
		localizacao: {
			cep: null, //
			uf: null, //
			cidade: null, //
			bairro: "", //
			endereco: "", //
			numeroOuIdentificador: "", //
		},
		dataAdmissao: null, //
		cargos: [], //
		salarioBase: 0,
		horariosTrabalho: [], //
		contatosAuxiliares: [],
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState<TEmployee>(initialInfoHolder);
	function updateInfoHolder(info: Partial<TEmployee>) {
		setInfoHolder((prev) => ({ ...prev, ...info }));
	}
	const [avatarHolder, setAvatarHolder] = useState<TSimpleAttachment>({
		file: null,
		previewUrl: null,
	});
	function updateAvatarHolder(avatar: TSimpleAttachment) {
		setAvatarHolder((prev) => ({ ...prev, ...avatar }));
	}

	async function handleCreateEmployee({ info, file }: { info: TEmployee; file: TSimpleAttachment["file"] }) {
		let imageUrl = info.avatar_url;
		if (file) {
			const { url } = await uploadFile({
				vinculationId: info.nome,
				fileName: `${formatAsSlug(info.nome)}-avatar`,
				file: file,
				prefix: "usuarios",
			});
			imageUrl = url;
		}
		return await createEmployee({ ...info, avatar_url: imageUrl });
	}
	const { mutate: handleCreateEmployeeMutation, isPending } = useMutation({
		mutationKey: ["create-employee"],
		mutationFn: handleCreateEmployee,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			setInfoHolder(initialInfoHolder);
			return toast.success(data.message);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: async (error) => {
			if (callbacks?.onError) callbacks.onError(error);
			return toast.error(getErrorMessage(error));
		},
	});

	return (
		<ResponsiveDialogDrawer
			menuTitle="CADASTRO DE USUÁRIO"
			menuDescription="Preencha os campos abaixo para criar um novo usuário."
			menuActionButtonText="CRIAR USUÁRIO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleCreateEmployeeMutation({ info: infoHolder, file: avatarHolder.file })}
			actionIsPending={isPending}
			stateIsLoading={false}
			closeMenu={closeModal}
		>
			<EmployeeGeneral infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} avatarHolder={avatarHolder} updateAvatarHolder={updateAvatarHolder} />
			<SystemAccess initialMode={true} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</ResponsiveDialogDrawer>
	);
}

export default NewUser;
