import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { estadosECidades } from "@/utils/estados_cidades";
import { formatToCEP } from "@/utils/methods/formatting";
import { getCEPInfo } from "@/utils/methods/shared";
import type { TNewWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import { MapIcon, MapPin } from "lucide-react";
import toast from "react-hot-toast";

type WarehouseFormularyLocationProps = {
	infoHolder: TNewWarehouseFormulary;
	updateInfoHolder: (changes: Partial<TNewWarehouseFormulary>) => void;
};
function WarehouseFormularyLocation({ infoHolder, updateInfoHolder }: WarehouseFormularyLocationProps) {
	async function setAddressDataByCEP(cep: string) {
		const addressInfo = await getCEPInfo(cep);
		const toastID = toast.loading("Buscando informações sobre o CEP...", {
			duration: 2000,
		});
		setTimeout(() => {
			if (addressInfo) {
				toast.dismiss(toastID);
				toast.success("Dados do CEP buscados com sucesso.", {
					duration: 1000,
				});
				updateInfoHolder({
					localizacao: {
						...infoHolder.localizacao,
						endereco: addressInfo.logradouro,
						bairro: addressInfo.bairro,
						uf: addressInfo.uf as keyof typeof estadosECidades,
						cidade: addressInfo.localidade.toUpperCase(),
					},
				});
			}
		}, 1000);
	}
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="LOCALIZAÇÃO" sectionTitleIcon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}>
			<div className="grid grid-cols-1 grid-rows-3 items-center gap-6 px-2 lg:grid-cols-3 lg:grid-rows-1">
				<TextInput
					label="CEP"
					value={(infoHolder.localizacao.cep as string) || ""}
					placeholder="Preencha aqui o CEP do cliente."
					handleChange={(value) => {
						if (value.length === 9) {
							setAddressDataByCEP(value);
						}
						updateInfoHolder({
							localizacao: {
								...infoHolder.localizacao,
								cep: formatToCEP(value),
							},
						});
					}}
					width="100%"
				/>

				<SelectInput
					label="ESTADO"
					value={infoHolder.localizacao.uf}
					handleChange={(value) =>
						updateInfoHolder({
							localizacao: { ...infoHolder.localizacao, uf: value, cidade: estadosECidades[value as keyof typeof estadosECidades][0] as string },
						})
					}
					selectedItemLabel="NÃO DEFINIDO"
					onReset={() => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, uf: "", cidade: "" } })}
					options={Object.keys(estadosECidades).map((state, index) => ({
						id: index + 1,
						label: state,
						value: state,
					}))}
					width="100%"
				/>

				<SelectInput
					label="CIDADE"
					value={infoHolder.localizacao.cidade}
					handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, cidade: value } })}
					options={
						infoHolder.localizacao.uf
							? estadosECidades[infoHolder.localizacao.uf as keyof typeof estadosECidades].map((city, index) => ({
									id: index + 1,
									value: city,
									label: city,
								}))
							: null
					}
					selectedItemLabel="NÃO DEFINIDO"
					onReset={() => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, cidade: "" } })}
					width="100%"
				/>
			</div>
			<div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
				<TextInput
					label="BAIRRO"
					value={infoHolder.localizacao.bairro || ""}
					placeholder="Preencha aqui o bairro do cliente."
					handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, bairro: value } })}
					width="100%"
				/>

				<TextInput
					label="LOGRADOURO/RUA"
					value={infoHolder.localizacao.endereco || ""}
					placeholder="Preencha aqui o logradouro do cliente."
					handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, endereco: value } })}
					width="100%"
				/>
			</div>
			<div className="mb-2 grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
				<TextInput
					label="NÚMERO/IDENTIFICADOR"
					value={infoHolder.localizacao.numeroOuIdentificador || ""}
					placeholder="Preencha aqui o número ou identificador da residência do cliente."
					handleChange={(value) =>
						updateInfoHolder({
							localizacao: {
								...infoHolder.localizacao,
								numeroOuIdentificador: value,
							},
						})
					}
					width="100%"
				/>

				<TextInput
					label="COMPLEMENTO"
					value={infoHolder.localizacao.complemento || ""}
					placeholder="Preencha aqui algum complemento do endereço."
					handleChange={(value) =>
						updateInfoHolder({
							localizacao: { ...infoHolder.localizacao, complemento: value },
						})
					}
					width="100%"
				/>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default WarehouseFormularyLocation;
