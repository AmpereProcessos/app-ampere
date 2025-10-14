import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { uploadFile } from "@/utils/methods/firebase";
import { formatAsSlug } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateEmployee } from "@/utils/methods/mutation/employees";
import { useEmployeeById } from "@/utils/methods/query/users";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import type { TEmployee } from "@/utils/schemas/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CorporativeInformation from "./blocos/CorporativeInformation";
import Documents from "./blocos/Documents";
import EmployeeGeneral from "./blocos/General";
import SystemAccess from "./blocos/SystemAccess";

type EditEmployeeProps = {
	userId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: { onMutate?: () => void; onSettled?: () => void; onSuccess?: () => void; onError?: (error: Error) => void };
};
function EditEmployee({ userId, session, closeModal, callbacks }: EditEmployeeProps) {
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TEmployee>({
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
	});
	function updateInfoHolder(changes: Partial<TEmployee>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}
	const [avatarHolder, setAvatarHolder] = useState<TSimpleAttachment>({
		file: null,
		previewUrl: null,
	});
	function updateAvatarHolder(avatar: TSimpleAttachment) {
		setAvatarHolder((prev) => ({ ...prev, ...avatar }));
	}
	const { data: employee, queryKey, isLoading, isSuccess, isError } = useEmployeeById({ id: userId });

	async function handleUpdateEmployee({ id, changes, file }: { id: string; changes: TEmployee; file: TSimpleAttachment["file"] }) {
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
		mutationKey: ["update-employee", userId],
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
			menuTitle="EDITAR FUNCIONÁRIO"
			menuDescription="Preencha os campos abaixo para atualizar o funcionário."
			menuActionButtonText="ATUALIZAR FUNCIONÁRIO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleUpdateEmployeeMutation({ id: userId, changes: infoHolder, file: avatarHolder.file })}
			actionIsPending={updateLoading}
			stateIsLoading={isLoading}
			closeMenu={closeModal}
		>
			<EmployeeGeneral infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} avatarHolder={avatarHolder} updateAvatarHolder={updateAvatarHolder} />
			<SystemAccess initialMode={true} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<CorporativeInformation infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<Documents employeeId={userId} session={session} />
		</ResponsiveDialogDrawer>
	);
}

export default EditEmployee;
