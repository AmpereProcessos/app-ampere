import { useState } from "react";
import z from "zod";
import { CertificationReferenceSchema, CertificationSchema } from "../schemas/certifications";

const CertificationState = z.object({
	certification: CertificationSchema.omit({
		autor: true,
		dataInsercao: true,
	}),
	references: z.array(
		CertificationReferenceSchema.omit({
			certificacao: true,
		}).extend({
			documento: CertificationReferenceSchema.shape.documento.partial({
				id: true,
			}),
			_id: z
				.string({
					required_error: "ID da referência da certificação não informado.",
					invalid_type_error: "Tipo não válido para o ID da referência da certificação.",
				})
				.optional()
				.nullable(),
			deletar: z
				.boolean({
					required_error: "Deletar a referência da certificação não informado.",
					invalid_type_error: "Tipo não válido para a deletar a referência da certificação.",
				})
				.optional()
				.nullable(),
			anexo: z.object({
				arquivo: z.instanceof(File).optional().nullable(),
				previewUrl: z.string().optional().nullable(),
			}),
		}),
	),
});
export type TCertificationState = z.infer<typeof CertificationState>;

type UseCertificationStateProps = {
	initialState?: Partial<TCertificationState>;
};
export function useCertificationState({ initialState }: UseCertificationStateProps) {
	const initialStateInner = {
		certification: {
			titulo: initialState?.certification?.titulo || "",
			descricao: initialState?.certification?.descricao || "",
			validade: initialState?.certification?.validade || { medida: "DIAS", valor: 0 },
		},
		references: initialState?.references || [],
	};
	const [state, setState] = useState<TCertificationState>(initialStateInner);

	function updateCertification(changes: Partial<TCertificationState["certification"]>) {
		return setState((prev) => ({ ...prev, certification: { ...prev.certification, ...changes } as TCertificationState["certification"] }));
	}

	function addCertificationReference(reference: TCertificationState["references"][number]) {
		return setState((prev) => ({ ...prev, references: [...prev.references, reference] }));
	}
	function updateCertificationReference(index: number, changes: Partial<TCertificationState["references"][number]>) {
		return setState((prev) => ({ ...prev, references: prev.references.map((r, i) => (i === index ? { ...r, ...changes } : r)) }));
	}
	function removeCertificationReference(index: number) {
		// Validating existence (id defined)
		const isExistingReference = state.references.find((r, rIndex) => rIndex === index && !!r._id);
		if (!isExistingReference)
			// If not an existing instance, just filtering it out
			return setState((prev) => ({ ...prev, references: prev.references.filter((_, i) => i !== index) }));
		// Else, marking it with a deletar flag
		return setState((prev) => ({ ...prev, references: prev.references.map((item, rIndex) => (rIndex === index ? { ...item, deletar: true } : item)) }));
	}
	function resetState() {
		return setState(initialStateInner);
	}
	function redefineState(state: TCertificationState) {
		return setState(state);
	}
	return {
		state,
		updateCertification,
		addCertificationReference,
		updateCertificationReference,
		removeCertificationReference,
		resetState,
		redefineState,
	};
}
export type TUseCertificationState = ReturnType<typeof useCertificationState>;
