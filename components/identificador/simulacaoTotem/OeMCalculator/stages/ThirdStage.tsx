import { TTotemSimulation } from "@/utils/schemas/totem-simulation";
import React from "react";
import { formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import { formatDate } from "@/utils/constants";
import TextInput from "@/components/inputs/Text";
import DateInput from "@/components/inputs/Date";
import { formatDateInputChange } from "@/utils/methods/shared";

type ThirdStageProps = {
	infoHolder: TTotemSimulation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TTotemSimulation>>;
};
function ThirdStage({ infoHolder, setInfoHolder }: ThirdStageProps) {
	return (
		<div className="flex w-full flex-col items-center gap-10 text-center">
			<div className="flex w-full flex-col gap-0.5 self-center">
				<p className="text-primary text-center text-lg font-medium">Pra finalizar</p>
				<p className="text-lg font-black text-[#15599a] dark:text-[#fead41]">Alguns detalhes sobre você</p>
			</div>
			<div className="flex w-full flex-col gap-3">
				<TextInput
					label="SEU NOME"
					labelClassName="text-primary text-start tracking-tighter text-xs"
					placeholder="Seu nome"
					holderClassName="border-primary/30"
					value={infoHolder.nome || ""}
					handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
					width="100%"
				/>
				<TextInput
					label="SEU TELEFONE"
					labelClassName="text-primary text-start tracking-tighter text-xs"
					placeholder="Seu telefone"
					holderClassName="border-primary/30"
					value={infoHolder.telefone || ""}
					handleChange={(value) =>
						setInfoHolder((prev) => ({
							...prev,
							telefone: formatToPhone(value),
						}))
					}
					width="100%"
				/>
				<TextInput
					label="SEU CPF"
					labelClassName="text-primary text-start tracking-tighter text-xs"
					placeholder="Seu CPF"
					holderClassName="border-primary/30"
					value={infoHolder.cpfCpnj || ""}
					handleChange={(value) =>
						setInfoHolder((prev) => ({
							...prev,
							cpfCpnj: formatToCPForCNPJ(value),
						}))
					}
					width="100%"
				/>
				<TextInput
					label="SEU MELHOR E-MAIL"
					holderClassName="border-primary/30"
					labelClassName="text-primary text-start tracking-tighter text-xs"
					placeholder="Seu melhor e-mail"
					value={infoHolder.email || ""}
					handleChange={(value) => setInfoHolder((prev) => ({ ...prev, email: value }))}
					width="100%"
				/>
				<DateInput
					label="SUA DATA DE NASCIMENTO"
					labelClassName="text-primary text-start tracking-tighter text-xs"
					value={infoHolder.dataNascimento ? formatDate(infoHolder.dataNascimento) : undefined}
					holderClassName="border-primary/30"
					handleChange={(value) =>
						setInfoHolder((prev) => ({
							...prev,
							dataNascimento: formatDateInputChange(value, "string"),
						}))
					}
					width="100%"
				/>
			</div>
		</div>
	);
}

export default ThirdStage;
