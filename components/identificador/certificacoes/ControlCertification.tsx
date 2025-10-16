import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createCertification } from "@/utils/methods/mutation/certifications";
import { updateCertification as updateCertificationMutation } from "@/utils/methods/mutation/certifications";
import { useCertificationById } from "@/utils/methods/query/certifications";
import type { TCertification } from "@/utils/schemas/certifications";
import { useCertificationState } from "@/utils/state/certification";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CertificationDates from "./blocos/Dates";
import CertificationGeneral from "./blocos/General";
import CertificationReferences from "./blocos/References";
type ControlCertificationProps = {
	certificationId: string;
	session: TAuthSession;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onError?: () => void;
		onSettled?: () => void;
	};
};
export default function ControlCertification({ certificationId, session, closeModal, callbacks }: ControlCertificationProps) {
	const { data: certification, isLoading, isError, isSuccess, error } = useCertificationById({ id: certificationId });
	const {
		state,
		updateCertification,
		addCertificationReference,
		updateCertificationReference,
		removeCertificationReference,
		resetState,
		redefineState,
	} = useCertificationState({});

	const { mutate: handleUpdateCertification, isPending } = useMutation({
		mutationKey: ["update-certification", certificationId],
		mutationFn: updateCertificationMutation,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
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

	useEffect(() => {
		if (certification) {
			redefineState({
				certification: certification,
				references: certification.referencias.map((r) => ({
					...r,
					anexo: {},
				})),
			});
		}
	}, [certification]);
	return (
		<ResponsiveDialogDrawer
			menuTitle="EDITAR CERTIFICAÇÃO"
			menuDescription="Preencha os campos abaixo para atualizar a certificação."
			menuActionButtonText="ATUALIZAR CERTIFICAÇÃO"
			menuCancelButtonText="CANCELAR"
			closeMenu={closeModal}
			actionFunction={() => handleUpdateCertification({ certificationId, certification: state.certification, references: state.references })}
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
