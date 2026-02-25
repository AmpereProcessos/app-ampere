import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { formatToPhone } from "@/utils/constants";
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions, estadosECidades } from "@/utils/estados_cidades";
import { formatToCEP, formatToCPForCNPJ } from "@/utils/methods/formatting";
import { useCreditors } from "@/utils/methods/query/crm/utils";
import { getCEPInfo } from "@/utils/methods/shared";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import { ContractRequestPaymentOptions } from "@/utils/select-options";
import { CreditCard, MapPin } from "lucide-react";
import type React from "react";
import { toast } from "react-hot-toast";

type PaymentInformationBlockProps = {
	infoHolder: TContractRequestDTO;
	setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>;
	userHasEditPermission: boolean;
};
function PaymentInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: PaymentInformationBlockProps) {
	const { data: creditors } = useCreditors();

	function updatePayerData(data: Partial<TContractRequestDTO["pagador"]>) {
		setInfoHolder((prev) => ({
			...prev,
			pagador: { ...prev.pagador, ...data },
		}));
	}
	function updatePayerLocation(data: Partial<TContractRequestDTO["pagador"]["localizacao"]>) {
		setInfoHolder((prev) => ({
			...prev,
			pagador: { ...prev.pagador, localizacao: { ...prev.pagador.localizacao, ...data } },
		}));
	}
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
				setInfoHolder((prev) => ({
					...prev,
					pagador: {
						...prev.pagador,
						localizacao: {
							...prev.pagador.localizacao,
							endereco: addressInfo.logradouro,
							bairro: addressInfo.bairro,
							uf: addressInfo.uf,
							cidade: addressInfo.localidade.toUpperCase(),
						},
					},
				}));
			}
		}, 1000);
	}
	return (
		<ResponsiveDialogDrawerSection
			sectionTitleText="INFORMAÇÕES SOBRE O PAGAMENTO"
			sectionTitleIcon={<CreditCard className="w-4 h-4 min-w-4 min-h-4" />}
		>
			<div className="w-full flex items-center justify-center gap-2 flex-col lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						width={"100%"}
						label={"NOME DO PAGADOR"}
						placeholder="Preencha aqui o nome da pessoa/empresa que realizará o pagamento"
						editable={true}
						value={infoHolder.pagador.nome}
						handleChange={(value) => updatePayerData({ nome: value })}
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						width={"100%"}
						label={"CPF/CNPJ DO PAGADOR"}
						placeholder="Preencha aqui o CPF/CNPJ do pagador."
						editable={true}
						value={infoHolder.pagador.cpfCnpj || ""}
						handleChange={(value) => updatePayerData({ cpfCnpj: formatToCPForCNPJ(value) })}
					/>
				</div>
			</div>
			<div className="w-full flex items-center justify-center gap-2 flex-col lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						width={"100%"}
						label={"TELEFONE DO PAGADOR"}
						placeholder="Preencha aqui o telefone da pessoa que realizará o pagamento"
						editable={true}
						value={infoHolder.pagador.telefone}
						handleChange={(value) => updatePayerData({ telefone: formatToPhone(value) })}
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						width={"100%"}
						label={"EMAIL DO PAGADOR"}
						placeholder="Preencha aqui o email da pessoa que realizará o pagamento"
						editable={true}
						value={infoHolder.pagador.email || ""}
						handleChange={(value) => updatePayerData({ email: value })}
					/>
				</div>
			</div>
			<ResponsiveDialogDrawerSection sectionTitleText="LOCALIZAÇÃO DO PAGADOR" sectionTitleIcon={<MapPin className="w-4 h-4 min-w-4 min-h-4" />}>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<TextInput
							label="CEP"
							value={infoHolder.pagador.localizacao?.cep || ""}
							placeholder="Preencha aqui o CEP do pagador."
							handleChange={(value) => {
								if (value.length === 9) {
									setAddressDataByCEP(value);
								}
								updatePayerLocation({ cep: formatToCEP(value) });
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="ESTADO"
							value={infoHolder.pagador.localizacao?.uf || ""}
							handleChange={(value) => updatePayerLocation({ uf: value, cidade: BrazilianCitiesOptionsFromUF(value)[0]?.value })}
							selectedItemLabel="NÃO DEFINIDO"
							onReset={() => updatePayerLocation({ uf: "", cidade: "" })}
							options={BrazilianStatesOptions}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="CIDADE"
							value={infoHolder.pagador.localizacao.cidade || ""}
							handleChange={(value) => updatePayerLocation({ cidade: value })}
							options={BrazilianCitiesOptionsFromUF(infoHolder.pagador.localizacao.uf || "")}
							selectedItemLabel="NÃO DEFINIDO"
							onReset={() => updatePayerLocation({ cidade: "" })}
							width="100%"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="BAIRRO"
							value={infoHolder.pagador.localizacao.bairro || ""}
							placeholder="Preencha aqui o bairro do cliente."
							handleChange={(value) => updatePayerLocation({ bairro: value })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<TextInput
							label="LOGRADOURO/RUA"
							value={infoHolder.pagador.localizacao.endereco || ""}
							placeholder="Preencha aqui o logradouro do cliente."
							handleChange={(value) => updatePayerLocation({ endereco: value })}
							width="100%"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<TextInput
							label="NÚMERO/IDENTIFICADOR"
							value={infoHolder.pagador.localizacao.numeroOuIdentificador || ""}
							placeholder="Preencha aqui o número ou identificador da residência do cliente."
							handleChange={(value) => updatePayerLocation({ numeroOuIdentificador: value })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<TextInput
							label="COMPLEMENTO"
							value={infoHolder.pagador.localizacao.complemento || ""}
							placeholder="Preencha aqui algum complemento do endereço."
							handleChange={(value) => updatePayerLocation({ complemento: value })}
							width="100%"
						/>
					</div>
				</div>
			</ResponsiveDialogDrawerSection>
			<div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="NECESSÁRIO INSCRIÇÃO RURAL NA NF"
						labelTrue="NECESSÁRIO INSCRIÇÃO RURAL NA NF"
						checked={infoHolder.necessidaInscricaoRural === "SIM"}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, necessidaInscricaoRural: value ? "SIM" : "NÃO" }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="NECESSÁRIO NF ADIANTADA"
						labelTrue="NECESSÁRIO NF ADIANTADA"
						checked={infoHolder.necessidadeNFAdiantada === "SIM"}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, necessidadeNFAdiantada: value ? "SIM" : "NÃO" }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="NECESSÁRIO CÓDIGO FINAME"
						labelTrue="NECESSÁRIO CÓDIGO FINAME"
						checked={infoHolder.necessidadeCodigoFiname === "SIM"}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, necessidadeCodigoFiname: value ? "SIM" : "NÃO" }))}
					/>
				</div>
			</div>
			{infoHolder.necessidaInscricaoRural ? (
				<div className="flex w-full items-center justify-center">
					<TextInput
						label={"INSCRIÇÃO RURAL"}
						placeholder="Preencha a inscrição rural..."
						editable={userHasEditPermission}
						value={infoHolder.inscriçãoRural}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, inscriçãoRural: value }))}
						width="100%"
					/>
				</div>
			) : null}
			<h1 className="w-full py-2 text-center font-bold text-[#fead61]">SOBRE A ENTREGA</h1>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label="CEP"
						value={infoHolder.cepEntrega || ""}
						placeholder="Preencha aqui o CEP da instalação..."
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, cepEntrega: formatToCEP(value) }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<SelectInput
						label="ESTADO"
						value={infoHolder.ufEntrega}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, ufEntrega: value }))}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => setInfoHolder((prev) => ({ ...prev, ufEntrega: null }))}
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
						value={infoHolder.cidadeEntrega}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cidadeEntrega: value }))}
						options={
							infoHolder.ufEntrega
								? estadosECidades[infoHolder.ufEntrega as keyof typeof estadosECidades].map((city, index) => ({
										id: index + 1,
										value: city,
										label: city,
									}))
								: null
						}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => setInfoHolder((prev) => ({ ...prev, cidadeEntrega: null }))}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="BAIRRO"
						value={infoHolder.bairroEntrega || ""}
						placeholder="Preencha aqui o bairro do instalação..."
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, bairroEntrega: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label="LOGRADOURO/RUA"
						value={infoHolder.enderecoEntrega || ""}
						placeholder="Preencha aqui o logradouro da instalação..."
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, enderecoEntrega: value }))}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="NÚMERO/IDENTIFICADOR"
						value={infoHolder.numeroResEntrega || ""}
						placeholder="Preencha aqui o número ou identificador da residência da instalação..."
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, numeroResEntrega: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label="PONTO DE REFERÊNCIA"
						value={infoHolder.pontoDeReferenciaEntrega || ""}
						placeholder="Preencha aqui algum complemento do endereço..."
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, pontoDeReferenciaEntrega: value }))}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="LATITUDE"
						value={infoHolder.latitudeEntrega || ""}
						placeholder="Preencha aqui a latitude da instalação..."
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, latitudeEntrega: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label="LONGITUDE"
						value={infoHolder.longitudeEntrega || ""}
						placeholder="Preencha aqui a longitude da instalação..."
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, longitudeEntrega: value }))}
						width="100%"
					/>
				</div>
			</div>
			<SelectInput
				width={"100%"}
				label={"HÁ RESTRIÇÕES PARA ENTREGA?"}
				editable={true}
				value={infoHolder.restricoesEntrega}
				handleChange={(value) => setInfoHolder({ ...infoHolder, restricoesEntrega: value })}
				options={[
					{
						id: 1,
						label: "SOMENTE HORARIO COMERCIAL",
						value: "SOMENTE HORARIO COMERCIAL",
					},
					{
						id: 2,
						label: "NÃO HÁ RESTRIÇÕES",
						value: "NÃO HÁ RESTRIÇÕES",
					},
					{
						id: 3,
						label: "CASA EM CONSTRUÇÃO",
						value: "CASA EM CONSTRUÇÃO",
					},
					{
						id: 4,
						label: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
						value: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
					},
				]}
				selectedItemLabel="NÃO DEFINIDO"
				onReset={() => {
					setInfoHolder((prev) => ({
						...prev,
						restricoesEntrega: null,
					}));
				}}
			/>

			<div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="VALOR DO CONTRATO (SEM ADICIONAIS)"
						placeholder="Preencher valor do contrato sem adicionais..."
						value={infoHolder.valorContrato || null}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorContrato: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"ORIGEM DO RECURSO"}
						editable={userHasEditPermission}
						value={infoHolder.origemRecurso}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "FINANCIAMENTO", value: "FINANCIAMENTO" },
							{ id: 2, label: "CAPITAL PRÓPRIO", value: "CAPITAL PRÓPRIO" },
						]}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, origemRecurso: value }))}
						onReset={() => setInfoHolder((prev) => ({ ...prev, origemRecurso: "CAPITAL PRÓPRIO" }))}
						width="100%"
					/>
				</div>
			</div>
			{infoHolder.origemRecurso === "FINANCIAMENTO" ? (
				<div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<SelectInput
							label={"CREDOR"}
							editable={userHasEditPermission}
							value={infoHolder.credor}
							selectedItemLabel="NÃO DEFINIDO"
							options={creditors?.map((c, index) => ({ id: index + 1, label: c.valor, value: c.valor })) || []}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, credor: value }))}
							onReset={() => setInfoHolder((prev) => ({ ...prev, credor: null }))}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label={"NOME DO GERENTE"}
							placeholder="Preencha o nome do gerente do cliente..."
							editable={userHasEditPermission}
							value={infoHolder.nomeGerente}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeGerente: value }))}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<TextInput
							label={"CONTATO DO GERENTE"}
							placeholder="Preencha o contato do gerente do cliente..."
							editable={userHasEditPermission}
							value={infoHolder.contatoGerente}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, contatoGerente: value }))}
							width="100%"
						/>
					</div>
				</div>
			) : null}
			<div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="SE PARCELADO, Nº DE PARCELAS"
						placeholder="Preencher o número de parcelas..."
						value={infoHolder.numParcelas || null}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, numParcelas: value, valorParcela: (prev.valorContrato || 0) / value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="VALOR DAS PARCELAS"
						placeholder="Preencher o valor de parcelas..."
						value={infoHolder.valorParcela || null}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorParcela: value }))}
						width="100%"
					/>
				</div>
			</div>
			<SelectInput
				label={"FORMA DE PAGAMENTO"}
				editable={userHasEditPermission}
				value={infoHolder.formaDePagamento}
				selectedItemLabel="NÃO DEFINIDO"
				options={ContractRequestPaymentOptions}
				handleChange={(value) => setInfoHolder((prev) => ({ ...prev, formaDePagamento: value }))}
				onReset={() => setInfoHolder((prev) => ({ ...prev, formaDePagamento: null }))}
				width="100%"
			/>

			<div className="mt-2 flex w-full flex-col items-center self-center px-2">
				<span className="font-raleway text-center text-sm font-bold uppercase">DESCRIÇÃO DA NEGOCIAÇÃO</span>
				<textarea
					readOnly={!userHasEditPermission}
					placeholder={"Descreva aqui a negociação"}
					value={infoHolder.descricaoNegociacao}
					className="border-primary/80 h-[80px] w-full resize-none border bg-gray-200 p-2 text-center outline-hidden"
					onChange={(e) =>
						setInfoHolder((prev) => ({
							...prev,
							descricaoNegociacao: e.target.value,
						}))
					}
				/>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default PaymentInformationBlock;
