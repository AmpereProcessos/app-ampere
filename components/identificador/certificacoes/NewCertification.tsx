import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { uploadFile } from "@/utils/methods/firebase";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createCertification } from "@/utils/methods/mutation/certifications";
import type { TCertification } from "@/utils/schemas/certifications";
import { type TUseCertificationState, useCertificationState } from "@/utils/state/certification";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import CertificationDates from "./blocos/Dates";
import CertificationGeneral from "./blocos/General";
import CertificationReferences from "./blocos/References";

type NewCertificationProps = {
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: () => void;
		onSettled?: () => void;
	};
};
export default function NewCertification({ session, closeModal, callbacks }: NewCertificationProps) {
	const {
		state,
		updateCertification,
		addCertificationReference,
		updateCertificationReference,
		removeCertificationReference,
		resetState,
		redefineState,
	} = useCertificationState({});

	async function handleCreateCertification(state: TUseCertificationState["state"]) {
		const { certification, references } = state;

		const referencesEnriched: TUseCertificationState["state"]["references"] = await Promise.all(
			references.map(async (reference) => {
				if (reference.documento.id) return reference;
				const file = reference.anexo.arquivo;
				if (!file) throw new Error(`Anexo o documento ${reference.documento.titulo}.`);
				const { url, format, size } = await uploadFile({ file, fileName: reference.documento.titulo, prefix: "certificacoes" });
				return { ...reference, documento: { ...reference.documento, url, formato: format, tamanho: size } };
			}),
		);

		return await createCertification({ certification, references: referencesEnriched });
	}
	const { mutate: handleCreateCertificationMutation, isPending } = useMutation({
		mutationKey: ["create-certification"],
		mutationFn: handleCreateCertification,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			resetState();
			return toast.success(data.message);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError();
			return toast.error(getErrorMessage(error));
		},
	});
	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVA CERTIFICAÇÃO"
			menuDescription="Preencha os campos abaixo para criar uma nova certificação."
			menuActionButtonText="CRIAR CERTIFICAÇÃO"
			menuCancelButtonText="CANCELAR"
			closeMenu={closeModal}
			actionFunction={() => handleCreateCertificationMutation({ certification: state.certification, references: state.references })}
			actionIsPending={isPending}
			stateIsLoading={false}
		>
			<CertificationGeneral certification={state.certification} updateCertification={updateCertification} />
			<CertificationDates certification={state.certification} updateCertification={updateCertification} />
			<CertificationReferences
				certification={state.certification}
				references={state.references}
				addCertificationReference={addCertificationReference}
				updateCertificationReference={updateCertificationReference}
				removeCertificationReference={removeCertificationReference}
			/>
		</ResponsiveDialogDrawer>
	);
}
