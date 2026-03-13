import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { getCEPInfo } from "@/utils/methods/shared";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import React from "react";
import toast from "react-hot-toast";
import { estadosECidades } from "@/utils/estados_cidades";
import { formatToCEP } from "@/utils/methods/formatting";
import { cn } from "@/lib/utils";
import { MdContentCopy } from "react-icons/md";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { LayoutGrid } from "lucide-react";

type ServiceOrderLocationInformationBlockProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (info: Partial<TServiceOrder>) => void;
	project?: TServiceOrderProject;
};
function ServiceOrderLocationInformationBlock({ infoHolder, updateInfoHolder, project }: ServiceOrderLocationInformationBlockProps) {
	async function setAddressDataByCEP(cep: string) {
		const toastID = toast.loading("Buscando informações sobre o CEP...", {
			duration: 2000,
		});
		try {
			const addressInfo = await getCEPInfo(cep);
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
		} catch (error) {
			toast.dismiss(toastID);
			toast.error("Erro ao buscar dados do CEP.", {
				duration: 2000,
			});
		}
	}

	function handleUseProjectInformation(project: TServiceOrderProject | undefined) {
		if (!project) return toast.error("Dados do projeto não encontrados.");
		updateInfoHolder({
			localizacao: {
				cep: project.cep?.toString() || "",
				uf: project.uf || "",
				cidade: project.cidade || "",
				bairro: project.bairro,
				endereco: project.logradouro,
				numeroOuIdentificador: project.numeroResidencia?.toString() || "",
			},
		});
	}
	const isServiceOrderInformationEqualToProject = Object.values({
		locationCep: project ? infoHolder.localizacao.cep === project.cep?.toString() : false,
		locationUf: project ? infoHolder.localizacao.uf === project.uf : false,
		locationCity: project ? infoHolder.localizacao.cidade === project.cidade : false,
		locationNeighborhood: project ? infoHolder.localizacao.bairro === project.bairro : false,
		locationStreet: project ? infoHolder.localizacao.endereco === project.logradouro : false,
		locationNumber: project ? infoHolder.localizacao.numeroOuIdentificador === project.numeroResidencia?.toString() : false,
	}).every((r) => r);

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="LOCALIZAÇÃO" sectionTitleIcon={<LayoutGrid size={15} />}>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full items-center justify-end">
					{project && !isServiceOrderInformationEqualToProject ? (
						<button
							type="button"
							onClick={() => handleUseProjectInformation(project)}
							className={cn("flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400")}
						>
							<MdContentCopy size={12} />
							<h1 className="text-[0.65rem] font-medium tracking-tight">UTILIZAR DADOS DO PROJETO</h1>
						</button>
					) : null}
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<TextInput
							label="CEP"
							value={infoHolder.localizacao?.cep || ""}
							placeholder="Preencha aqui o CEP da instalação..."
							handleChange={(value) => {
								if (value.length === 9) {
									setAddressDataByCEP(value);
								}
								updateInfoHolder({ localizacao: { ...infoHolder.localizacao, cep: formatToCEP(value) } });
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="ESTADO"
							value={infoHolder.localizacao?.uf || ""}
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, uf: value } })}
							selectedItemLabel="NÃO DEFINIDO"
							onReset={() => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, uf: "" } })}
							options={Object.keys(estadosECidades).map((state, index) => ({
								id: index + 1,
								label: state,
								value: state,
							}))}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="CIDADE"
							value={infoHolder.localizacao?.cidade || ""}
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, cidade: value } })}
							options={
								infoHolder.localizacao?.uf
									? estadosECidades[infoHolder.localizacao?.uf as keyof typeof estadosECidades].map((city, index) => ({
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
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="BAIRRO"
							value={infoHolder.localizacao?.bairro || ""}
							placeholder="Preencha aqui o bairro do instalação..."
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, bairro: value } })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<TextInput
							label="LOGRADOURO/RUA"
							value={infoHolder.localizacao?.endereco || ""}
							placeholder="Preencha aqui o logradouro da instalação..."
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, endereco: value } })}
							width="100%"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="NÚMERO/IDENTIFICADOR"
							value={infoHolder.localizacao?.numeroOuIdentificador || ""}
							placeholder="Preencha aqui o número ou identificador da residência da instalação..."
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, numeroOuIdentificador: value } })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<TextInput
							label="COMPLEMENTO"
							value={infoHolder.localizacao?.complemento || ""}
							placeholder="Preencha aqui algum complemento do endereço..."
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, complemento: value } })}
							width="100%"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="LATITUDE"
							value={infoHolder.localizacao?.latitude || ""}
							placeholder="Preencha aqui a latitude da instalação..."
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, latitude: value } })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<TextInput
							label="LONGITUDE"
							value={infoHolder.localizacao?.longitude || ""}
							placeholder="Preencha aqui a longitude da instalação..."
							handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, longitude: value } })}
							width="100%"
						/>
					</div>
				</div>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default ServiceOrderLocationInformationBlock;
