import CheckboxInput from "@/components/inputs/Checkbox";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { equipesTecnicas } from "@/utils/constants";
import type { TEmployee } from "@/utils/schemas/users";
import { VisualizationTypes, allSellers } from "@/utils/select-options";
import { Shield } from "lucide-react";
import type React from "react";
import PermissionsPannel from "./PermissionsPannel";

type SystemAccessProps = {
	infoHolder: TEmployee;
	updateInfoHolder: (changes: Partial<TEmployee>) => void;
	initialMode: boolean;
};
function SystemAccess({ infoHolder, updateInfoHolder, initialMode }: SystemAccessProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Shield size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DE ACESSO DE SISTEMA</h1>
			</div>

			<div className="flex w-full items-center justify-center">
				<div className="w-fit">
					<CheckboxInput
						checked={infoHolder.acessoAtivo}
						handleChange={(value) =>
							updateInfoHolder({
								acessoAtivo: value,
								visualizacao: { ...infoHolder.visualizacao, tipo: !infoHolder.visualizacao.tipo ? "OPERACIONAL" : infoHolder.visualizacao.tipo },
							})
						}
						labelFalse="ACESSO ATIVO"
						labelTrue="ACESSO ATIVO"
						justify="justify-center"
					/>
				</div>
			</div>
			<TextInput
				label="NOME DO USUÁRIO"
				placeholder="Preencha aqui o nome do usuário.."
				value={infoHolder.usuario}
				handleChange={(value) => updateInfoHolder({ usuario: value })}
				width="100%"
			/>
			<TextInput
				label="SENHA DO USUÁRIO"
				placeholder="Preencha aqui a senha de acesso..."
				value={infoHolder.senha}
				handleChange={(value) => updateInfoHolder({ senha: value })}
				width="100%"
			/>

			<SelectInput
				label="TIPO DE VISUALIZAÇÃO"
				value={infoHolder.visualizacao.tipo || undefined}
				selectedItemLabel="NÃO DEFINIDO"
				options={VisualizationTypes}
				handleChange={(value) =>
					updateInfoHolder({
						visualizacao: { ...infoHolder.visualizacao, tipo: value, referencia: value === "OPERACIONAL" ? null : infoHolder.visualizacao.referencia },
					})
				}
				onReset={() => updateInfoHolder({ visualizacao: { ...infoHolder.visualizacao, tipo: null, referencia: null } })}
				width="100%"
			/>
			{infoHolder.visualizacao.tipo === "OPERACIONAL" ? (
				<div className="relative flex w-full flex-col gap-1">
					<h1 className="text-start font-sans font-bold text-primary">REFERÊNCIA DA VISUALIZAÇÃO</h1>
					<h1 className="border-primary/20 h-[47px] w-full rounded-md border p-3 text-sm outline-hidden placeholder:italic">NÃO APLICÁVEL</h1>
				</div>
			) : null}
			{infoHolder.visualizacao.tipo === "EXECUÇÃO" ? (
				<SelectInput
					label="REFERÊNCIA DA VISUALIZAÇÃO"
					value={infoHolder.visualizacao.referencia || undefined}
					selectedItemLabel="NÃO DEFINIDO"
					options={equipesTecnicas}
					handleChange={(value) => updateInfoHolder({ visualizacao: { ...infoHolder.visualizacao, referencia: value } })}
					onReset={() => updateInfoHolder({ visualizacao: { ...infoHolder.visualizacao, referencia: null } })}
					width="100%"
				/>
			) : null}
			{infoHolder.visualizacao.tipo === "VENDAS" ? (
				<SelectInput
					label="REFERÊNCIA DA VISUALIZAÇÃO"
					value={infoHolder.visualizacao.referencia || undefined}
					selectedItemLabel="NÃO DEFINIDO"
					options={allSellers}
					handleChange={(value) => updateInfoHolder({ visualizacao: { ...infoHolder.visualizacao, referencia: value } })}
					onReset={() => updateInfoHolder({ visualizacao: { ...infoHolder.visualizacao, referencia: null } })}
					width="100%"
				/>
			) : null}

			<PermissionsPannel infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</div>
	);
}

export default SystemAccess;
