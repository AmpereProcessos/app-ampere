import CheckboxInput from "@/components/inputs/Checkbox";
import DateInput from "@/components/inputs/Date";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import type { TGetProjectsExportRoutePayload } from "@/lib/data-exports";
import { getExcelFromJSON } from "@/lib/excel-utils";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { formatDate } from "@/utils/constants";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useUsers } from "@/utils/methods/query/crm/users";
import { fetchProjectsExportation } from "@/utils/methods/query/projects";
import { formatDateInputChange } from "@/utils/methods/shared";
import { contractStatus, serviceTypes } from "@/utils/select-options";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }));
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }));

type ProjectExportationMenuProps = {
	closeMenu: () => void;
};
function ProjectExportationMenu({ closeMenu }: ProjectExportationMenuProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const MENU_TITLE = "EXPORTAÇÃO MANUAL DE PROJETOS";
	const MENU_DESCRIPTION = "Preencha os campos abaixo para exportar os projetos.";
	const BUTTON_TEXT = "EXPORTAR PROJETOS";

	const [payloadHolder, setPayloadHolder] = useState<TGetProjectsExportRoutePayload>({
		filters: {
			contractNamesearch: "",
			neighborhoodSearch: "",
			streetSearch: "",
			contractStatus: [],
			serviceType: [],
			sellers: [],
			insiders: [],
			cities: [],
			states: [],
			period: {},
		},
		projection: {
			qtde: true,
			nomeDoContrato: true,
			cpf_cnpj: true,
			inscricaoRural: false,
			tipoDeServico: true,
			telefone: true,
			email: false,
			dataNascimento: false,
			canalVenda: false,
			codigoSVB: false,
			"vendedor.nome": true,
			insider: false,
			nps: false,
			cep: false,
			uf: true,
			cidade: true,
			bairro: false,
			logradouro: false,
			numeroResidencia: false,
			latitude: false,
			longitude: false,
			"pagamento.forma": false,
			"pagamento.credor": false,
			"pagamento.pagador": false,
			"pagamento.contatoPagador": false,
			"pagamento.cpf_cnpjPagador": false,
			"contrato.status": false,
			"sistema.potPico": false,
			"contrato.dataAssinatura": false,
			"homologacao.status": false,
			"homologacao.acesso.dataResposta": false,
			"homologacao.vistoria.dataEfetivacao": false,
			"compra.dataLiberacao": false,
			"compra.dataPedido": false,
			"compra.dataEntrega": false,
			"compra.dataPagamento": false,
			"compra.dataPagamentoEquipamentos": false,
			"obra.statusDaObra": false,
			"obra.equipeResp": false,
			"obra.entrada": false,
			"obra.saida": false,
		},
		computed: {
			valorTotalContrato: false,
			qtdeModulos: false,
			potenciaTotalModulos: false,
			qtdeInversores: false,
			potenciaTotalInversores: false,
		},
	});
	function updatePayloadHolder(changes: Partial<TGetProjectsExportRoutePayload>) {
		setPayloadHolder((prev) => ({ ...prev, ...changes }));
	}
	function updatePayloadFilters(changes: Partial<TGetProjectsExportRoutePayload["filters"]>) {
		setPayloadHolder((prev) => ({ ...prev, filters: { ...prev.filters, ...changes } }));
	}
	function updatePayloadProjection(changes: Partial<TGetProjectsExportRoutePayload["projection"]>) {
		setPayloadHolder((prev) => ({ ...prev, projection: { ...prev.projection, ...changes } }));
	}
	function updatePayloadComputed(changes: Partial<TGetProjectsExportRoutePayload["computed"]>) {
		setPayloadHolder((prev) => ({ ...prev, computed: { ...prev.computed, ...changes } }));
	}
	const { mutate: handleExportation, isPending: isExportationLoading } = useMutation({
		mutationKey: ["projects-exportation", payloadHolder],
		mutationFn: async (payload: TGetProjectsExportRoutePayload) => {
			const exportation = await fetchProjectsExportation(payload);
			const dateKey = dayjs().format("DD-MM-YYYY-HH-mm");
			await getExcelFromJSON(exportation, `EXPORTAÇÃO MANUAL DE PROJETOS ${dateKey}`);
		},
		onSuccess: () => {
			toast.success("Exportação realizada com sucesso!");
			closeMenu();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeMenu() : null)}>
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[70vh]">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto">
					<ExportationMenuContent
						payloadHolder={payloadHolder}
						updatePayloadFilters={updatePayloadFilters}
						updatePayloadProjection={updatePayloadProjection}
						updatePayloadComputed={updatePayloadComputed}
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" size={"sm"}>
							FECHAR
						</Button>
					</DialogClose>
					<LoadingButton onClick={() => handleExportation(payloadHolder)} loading={isExportationLoading} size={"sm"}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeMenu() : null)}>
			<DrawerContent className="h-fit max-h-[70vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 overflow-auto">
					<ExportationMenuContent
						payloadHolder={payloadHolder}
						updatePayloadFilters={updatePayloadFilters}
						updatePayloadProjection={updatePayloadProjection}
						updatePayloadComputed={updatePayloadComputed}
					/>
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline" size={"sm"}>
							FECHAR
						</Button>
					</DrawerClose>
					<LoadingButton onClick={() => handleExportation(payloadHolder)} loading={isExportationLoading} size={"sm"}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default ProjectExportationMenu;

type ExportationMenuContentProps = {
	payloadHolder: TGetProjectsExportRoutePayload;
	updatePayloadFilters: (changes: Partial<TGetProjectsExportRoutePayload["filters"]>) => void;
	updatePayloadProjection: (changes: Partial<TGetProjectsExportRoutePayload["projection"]>) => void;
	updatePayloadComputed: (changes: Partial<TGetProjectsExportRoutePayload["computed"]>) => void;
};
function ExportationMenuContent({
	payloadHolder,
	updatePayloadFilters,
	updatePayloadProjection,
	updatePayloadComputed,
}: ExportationMenuContentProps) {
	const { data: crmUsers } = useUsers({ includeDeleted: true });

	return (
		<div className="w-full h-full flex flex-col gap-6 px-2">
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-sm font-bold leading-none tracking-tight">FILTROS</h1>
				<TextInput
					label="NOME DO CONTRATO"
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					placeholder="Preencha o filtro de nome do contrato"
					value={payloadHolder.filters.contractNamesearch}
					handleChange={(v) => updatePayloadFilters({ contractNamesearch: v })}
					width="100%"
				/>
				<TextInput
					label="BAIRRO"
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					placeholder="Preencha o filtro de bairro"
					value={payloadHolder.filters.neighborhoodSearch}
					handleChange={(v) => updatePayloadFilters({ neighborhoodSearch: v })}
					width="100%"
				/>
				<TextInput
					label="LOGRADOURO"
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					placeholder="Preencha o filtro de logradouro"
					value={payloadHolder.filters.streetSearch}
					handleChange={(v) => updatePayloadFilters({ streetSearch: v })}
					width="100%"
				/>
				<MultipleSelectInput
					label="STATUS DO CONTRATO"
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					options={contractStatus}
					selected={payloadHolder.filters.contractStatus}
					selectedItemLabel="NÃO DEFINIDO"
					handleChange={(v) => updatePayloadFilters({ contractStatus: v as string[] })}
					onReset={() => updatePayloadFilters({ contractStatus: [] })}
					width="100%"
				/>
				<MultipleSelectInput
					label="TIPO DE SERVIÇO"
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					options={serviceTypes}
					selected={payloadHolder.filters.serviceType}
					selectedItemLabel="NÃO DEFINIDO"
					handleChange={(v) => updatePayloadFilters({ serviceType: v as string[] })}
					onReset={() => updatePayloadFilters({ serviceType: [] })}
					width="100%"
				/>
				<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
					<div className="w-full lg:w-1/2">
						<MultipleSelectInput
							label="VENDEDOR"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							options={crmUsers?.map((u) => ({ id: u._id, label: u.nome, value: u._id })) || []}
							selected={payloadHolder.filters.sellers}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(v) => updatePayloadFilters({ sellers: v as string[] })}
							onReset={() => updatePayloadFilters({ sellers: [] })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<MultipleSelectInput
							label="INSIDER"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							options={crmUsers?.map((u) => ({ id: u._id, label: u.nome, value: u._id })) || []}
							selected={payloadHolder.filters.insiders}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(v) => updatePayloadFilters({ insiders: v as string[] })}
							onReset={() => updatePayloadFilters({ insiders: [] })}
							width="100%"
						/>
					</div>
				</div>
				<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
					<div className="w-full lg:w-1/2">
						<MultipleSelectInputVirtualized
							label="ESTADO"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							options={AllStates}
							selected={payloadHolder.filters.states}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(v) => updatePayloadFilters({ states: v as string[] })}
							onReset={() => updatePayloadFilters({ states: [] })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<MultipleSelectInputVirtualized
							label="CIDADE"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							options={AllCities}
							selected={payloadHolder.filters.cities}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(v) => updatePayloadFilters({ cities: v as string[] })}
							onReset={() => updatePayloadFilters({ cities: [] })}
							width="100%"
						/>
					</div>
				</div>
				<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
					<div className="w-full lg:w-1/3">
						<SelectInput
							width={"100%"}
							label={"CAMPO DE FILTRO"}
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							value={payloadHolder.filters.period.field}
							options={[
								{ id: 1, label: "DATA ASS.CONTRATO", value: "contrato.dataAssinatura" },
								{ id: 2, label: "DATA DE SOLICITAÇÃO DO PARECER", value: "homologacao.acesso.dataSolicitacao" },
								{ id: 3, label: "DATA DO PARECER", value: "homologacao.acesso.dataResposta" },
								{ id: 4, label: "DATA PAG.KIT", value: "compra.dataPagamento" },
								{ id: 5, label: "DATA PEDIDO", value: "compra.dataPedido" },
								{ id: 6, label: "DATA DE PREV.ENTREGA", value: "compra.previsaoEntrega" },
								{ id: 7, label: "DATA DE ENTREGA", value: "compra.dataEntrega" },
								{ id: 8, label: "SAÍDA DE OBRA", value: "obra.saida" },
								{ id: 9, label: "PEDIDO DE VISTORIA", value: "homologacao.vistoria.dataSolicitacao" },
								{ id: 10, label: "TROCA DO MEDIDOR", value: "homologacao.vistoria.dataEfetivacao" },
								{ id: 11, label: "DATA DE MANUTENÇÃO", value: "manutencoes.dataEfetivacao" },
							]}
							selectedItemLabel={"SEM FILTRO"}
							handleChange={(value) =>
								updatePayloadFilters({
									period: {
										...payloadHolder.filters.period,
										field: value,
									},
								})
							}
							onReset={() =>
								updatePayloadFilters({
									period: {
										...payloadHolder.filters.period,
										field: null,
									},
								})
							}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<DateInput
							label="DEPOIS DE"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							value={formatDate(payloadHolder.filters.period.after)}
							handleChange={(v) => updatePayloadFilters({ period: { ...payloadHolder.filters.period, after: formatDateInputChange(v, "string") } })}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<DateInput
							label="ANTES DE"
							labelClassName="text-[0.6rem]"
							holderClassName="text-xs p-2 min-h-[34px]"
							value={formatDate(payloadHolder.filters.period.before)}
							handleChange={(v) => updatePayloadFilters({ period: { ...payloadHolder.filters.period, before: formatDateInputChange(v, "string") } })}
							width="100%"
						/>
					</div>
				</div>
			</div>
			<div className="w-full flex flex-col gap-3">
				<h1 className="text-sm font-bold leading-none tracking-tight">CAMPOS A SEREM EXPORTADOS</h1>
				<div className="w-full flex flex-col gap-1">
					<CheckboxInput
						labelFalse="QTDE"
						labelTrue="QTDE"
						checked={payloadHolder.projection.qtde}
						handleChange={(v) => updatePayloadProjection({ qtde: v })}
					/>
					<CheckboxInput
						labelFalse="NOME DO CONTRATO"
						labelTrue="NOME DO CONTRATO"
						checked={payloadHolder.projection.nomeDoContrato}
						handleChange={(v) => updatePayloadProjection({ nomeDoContrato: v })}
					/>
					<CheckboxInput
						labelFalse="CPF/CNPJ"
						labelTrue="CPF/CNPJ"
						checked={payloadHolder.projection.cpf_cnpj}
						handleChange={(v) => updatePayloadProjection({ cpf_cnpj: v })}
					/>
					<CheckboxInput
						labelFalse="INSCRIÇÃO RURAL"
						labelTrue="INSCRIÇÃO RURAL"
						checked={payloadHolder.projection.inscricaoRural}
						handleChange={(v) => updatePayloadProjection({ inscricaoRural: v })}
					/>
					<CheckboxInput
						labelFalse="TIPO DE SERVIÇO"
						labelTrue="TIPO DE SERVIÇO"
						checked={payloadHolder.projection.tipoDeServico}
						handleChange={(v) => updatePayloadProjection({ tipoDeServico: v })}
					/>
					<CheckboxInput
						labelFalse="TELEFONE"
						labelTrue="TELEFONE"
						checked={payloadHolder.projection.telefone}
						handleChange={(v) => updatePayloadProjection({ telefone: v })}
					/>
					<CheckboxInput
						labelFalse="EMAIL"
						labelTrue="EMAIL"
						checked={payloadHolder.projection.email}
						handleChange={(v) => updatePayloadProjection({ email: v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE NASCIMENTO"
						labelTrue="DATA DE NASCIMENTO"
						checked={payloadHolder.projection.dataNascimento}
						handleChange={(v) => updatePayloadProjection({ dataNascimento: v })}
					/>
					<CheckboxInput
						labelFalse="CANAL DE VENDA"
						labelTrue="CANAL DE VENDA"
						checked={payloadHolder.projection.canalVenda}
						handleChange={(v) => updatePayloadProjection({ canalVenda: v })}
					/>
					<CheckboxInput
						labelFalse="CÓDIGO CRM"
						labelTrue="CÓDIGO CRM"
						checked={payloadHolder.projection.codigoSVB}
						handleChange={(v) => updatePayloadProjection({ codigoSVB: v })}
					/>
					<CheckboxInput
						labelFalse="VENDEDOR"
						labelTrue="VENDEDOR"
						checked={payloadHolder.projection["vendedor.nome"]}
						handleChange={(v) => updatePayloadProjection({ "vendedor.nome": v })}
					/>
					<CheckboxInput
						labelFalse="INSIDER"
						labelTrue="INSIDER"
						checked={payloadHolder.projection.insider}
						handleChange={(v) => updatePayloadProjection({ insider: v })}
					/>
					<CheckboxInput
						labelFalse="NPS"
						labelTrue="NPS"
						checked={payloadHolder.projection.nps}
						handleChange={(v) => updatePayloadProjection({ nps: v })}
					/>
					<CheckboxInput
						labelFalse="CEP"
						labelTrue="CEP"
						checked={payloadHolder.projection.cep}
						handleChange={(v) => updatePayloadProjection({ cep: v })}
					/>
					<CheckboxInput labelFalse="UF" labelTrue="UF" checked={payloadHolder.projection.uf} handleChange={(v) => updatePayloadProjection({ uf: v })} />
					<CheckboxInput
						labelFalse="CIDADE"
						labelTrue="CIDADE"
						checked={payloadHolder.projection.cidade}
						handleChange={(v) => updatePayloadProjection({ cidade: v })}
					/>
					<CheckboxInput
						labelFalse="BAIRRO"
						labelTrue="BAIRRO"
						checked={payloadHolder.projection.bairro}
						handleChange={(v) => updatePayloadProjection({ bairro: v })}
					/>
					<CheckboxInput
						labelFalse="LOGRADOURO"
						labelTrue="LOGRADOURO"
						checked={payloadHolder.projection.logradouro}
						handleChange={(v) => updatePayloadProjection({ logradouro: v })}
					/>
					<CheckboxInput
						labelFalse="NÚMERO"
						labelTrue="NÚMERO"
						checked={payloadHolder.projection.numeroResidencia}
						handleChange={(v) => updatePayloadProjection({ numeroResidencia: v })}
					/>
					<CheckboxInput
						labelFalse="LATITUDE"
						labelTrue="LATITUDE"
						checked={payloadHolder.projection.latitude}
						handleChange={(v) => updatePayloadProjection({ latitude: v })}
					/>
					<CheckboxInput
						labelFalse="LONGITUDE"
						labelTrue="LONGITUDE"
						checked={payloadHolder.projection.longitude}
						handleChange={(v) => updatePayloadProjection({ longitude: v })}
					/>
					<CheckboxInput
						labelFalse="FORMA DE PAGAMENTO"
						labelTrue="FORMA DE PAGAMENTO"
						checked={payloadHolder.projection["pagamento.forma"]}
						handleChange={(v) => updatePayloadProjection({ "pagamento.forma": v })}
					/>
					<CheckboxInput
						labelFalse="CREDOR"
						labelTrue="CREDOR"
						checked={payloadHolder.projection["pagamento.credor"]}
						handleChange={(v) => updatePayloadProjection({ "pagamento.credor": v })}
					/>
					<CheckboxInput
						labelFalse="PAGADOR"
						labelTrue="PAGADOR"
						checked={payloadHolder.projection["pagamento.pagador"]}
						handleChange={(v) => updatePayloadProjection({ "pagamento.pagador": v })}
					/>
					<CheckboxInput
						labelFalse="CONTATO DO PAGADOR"
						labelTrue="CONTATO DO PAGADOR"
						checked={payloadHolder.projection["pagamento.contatoPagador"]}
						handleChange={(v) => updatePayloadProjection({ "pagamento.contatoPagador": v })}
					/>
					<CheckboxInput
						labelFalse="CPF/CNPJ DO PAGADOR"
						labelTrue="CPF/CNPJ DO PAGADOR"
						checked={payloadHolder.projection["pagamento.cpf_cnpjPagador"]}
						handleChange={(v) => updatePayloadProjection({ "pagamento.cpf_cnpjPagador": v })}
					/>
					<CheckboxInput
						labelFalse="STATUS DO CONTRATO"
						labelTrue="STATUS DO CONTRATO"
						checked={payloadHolder.projection["contrato.status"]}
						handleChange={(v) => updatePayloadProjection({ "contrato.status": v })}
					/>
					<CheckboxInput
						labelFalse="POTÊNCIA PICO"
						labelTrue="POTÊNCIA PICO"
						checked={payloadHolder.projection["sistema.potPico"]}
						handleChange={(v) => updatePayloadProjection({ "sistema.potPico": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE ASSINATURA"
						labelTrue="DATA DE ASSINATURA"
						checked={payloadHolder.projection["contrato.dataAssinatura"]}
						handleChange={(v) => updatePayloadProjection({ "contrato.dataAssinatura": v })}
					/>
					<CheckboxInput
						labelFalse="STATUS DA HOMOLOGAÇÃO"
						labelTrue="STATUS DA HOMOLOGAÇÃO"
						checked={payloadHolder.projection["homologacao.status"]}
						handleChange={(v) => updatePayloadProjection({ "homologacao.status": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE RESPOSTA DA HOMOLOGAÇÃO"
						labelTrue="DATA DE RESPOSTA DA HOMOLOGAÇÃO"
						checked={payloadHolder.projection["homologacao.acesso.dataResposta"]}
						handleChange={(v) => updatePayloadProjection({ "homologacao.acesso.dataResposta": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE EFETIVAÇÃO DA VISTORIA"
						labelTrue="DATA DE EFETIVAÇÃO DA VISTORIA"
						checked={payloadHolder.projection["homologacao.vistoria.dataEfetivacao"]}
						handleChange={(v) => updatePayloadProjection({ "homologacao.vistoria.dataEfetivacao": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE LIBERAÇÃO PARA COMPRA"
						labelTrue="DATA DE LIBERAÇÃO PARA COMPRA"
						checked={payloadHolder.projection["compra.dataLiberacao"]}
						handleChange={(v) => updatePayloadProjection({ "compra.dataLiberacao": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE PEDIDO PARA COMPRA"
						labelTrue="DATA DE PEDIDO PARA COMPRA"
						checked={payloadHolder.projection["compra.dataPedido"]}
						handleChange={(v) => updatePayloadProjection({ "compra.dataPedido": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE ENTREGA PARA COMPRA"
						labelTrue="DATA DE ENTREGA PARA COMPRA"
						checked={payloadHolder.projection["compra.dataEntrega"]}
						handleChange={(v) => updatePayloadProjection({ "compra.dataEntrega": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE PAGAMENTO PARA COMPRA"
						labelTrue="DATA DE PAGAMENTO PARA COMPRA"
						checked={payloadHolder.projection["compra.dataPagamento"]}
						handleChange={(v) => updatePayloadProjection({ "compra.dataPagamento": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE PAGAMENTO PARA EQUIPAMENTOS"
						labelTrue="DATA DE PAGAMENTO PARA EQUIPAMENTOS"
						checked={payloadHolder.projection["compra.dataPagamentoEquipamentos"]}
						handleChange={(v) => updatePayloadProjection({ "compra.dataPagamentoEquipamentos": v })}
					/>
					<CheckboxInput
						labelFalse="STATUS DA OBRA"
						labelTrue="STATUS DA OBRA"
						checked={payloadHolder.projection["obra.statusDaObra"]}
						handleChange={(v) => updatePayloadProjection({ "obra.statusDaObra": v })}
					/>
					<CheckboxInput
						labelFalse="EQUIPE RESPONSÁVEL PELA OBRA"
						labelTrue="EQUIPE RESPONSÁVEL PELA OBRA"
						checked={payloadHolder.projection["obra.equipeResp"]}
						handleChange={(v) => updatePayloadProjection({ "obra.equipeResp": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE ENTRADA DA OBRA"
						labelTrue="DATA DE ENTRADA DA OBRA"
						checked={payloadHolder.projection["obra.entrada"]}
						handleChange={(v) => updatePayloadProjection({ "obra.entrada": v })}
					/>
					<CheckboxInput
						labelFalse="DATA DE SAÍDA DA OBRA"
						labelTrue="DATA DE SAÍDA DA OBRA"
						checked={payloadHolder.projection["obra.saida"]}
						handleChange={(v) => updatePayloadProjection({ "obra.saida": v })}
					/>
					<CheckboxInput
						labelFalse="VALOR TOTAL DO CONTRATO"
						labelTrue="VALOR TOTAL DO CONTRATO"
						checked={payloadHolder.computed.valorTotalContrato}
						handleChange={(v) => updatePayloadComputed({ valorTotalContrato: v })}
					/>
					<CheckboxInput
						labelFalse="QTDE DE MÓDULOS"
						labelTrue="QTDE DE MÓDULOS"
						checked={payloadHolder.computed.qtdeModulos}
						handleChange={(v) => updatePayloadComputed({ qtdeModulos: v })}
					/>
					<CheckboxInput
						labelFalse="POTÊNCIA TOTAL DOS MÓDULOS"
						labelTrue="POTÊNCIA TOTAL DOS MÓDULOS"
						checked={payloadHolder.computed.potenciaTotalModulos}
						handleChange={(v) => updatePayloadComputed({ potenciaTotalModulos: v })}
					/>
					<CheckboxInput
						labelFalse="QTDE DE INVERSORES"
						labelTrue="QTDE DE INVERSORES"
						checked={payloadHolder.computed.qtdeInversores}
						handleChange={(v) => updatePayloadComputed({ qtdeInversores: v })}
					/>
					<CheckboxInput
						labelFalse="POTÊNCIA TOTAL DOS INVERSORES"
						labelTrue="POTÊNCIA TOTAL DOS INVERSORES"
						checked={payloadHolder.computed.potenciaTotalInversores}
						handleChange={(v) => updatePayloadComputed({ potenciaTotalInversores: v })}
					/>
				</div>
			</div>
		</div>
	);
}
