import SelectInput from "@/components/inputs/Select";
import SelectVirtualizedInput from "@/components/inputs/SelectVirtualized";
import TextInput from "@/components/inputs/Text";
import { useClients } from "@/utils/methods/query/clients";
import { getCEPInfo } from "@/utils/methods/shared";
import { TNewWarehouseFormulary, TNewWarehouseFormularyDTO } from "@/utils/schemas/warehouse-formularies";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscChromeClose } from "react-icons/vsc";
import { estadosECidades } from "../../../../utils/estados_cidades";
import { formatToCEP } from "@/utils/methods/formatting";
import { useMaterials } from "@/utils/methods/query/materials";
import MaterialsBlock from "./MaterialsBlock";
import { equipesTecnicas, serviceOrdersCategories } from "@/utils/constants";
import CheckboxInput from "@/components/inputs/Checkbox";
import { createWarehouseFormulary, deleteWarehouseFormulary, updateWarehouseFormulary } from "@/utils/methods/mutation/warehouse-forms";
import { updateManyMaterials } from "@/utils/methods/mutation/materials";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { isError, useQueryClient } from "@tanstack/react-query";
import { useWarehouseFormById } from "@/utils/methods/query/warehouse-forms";
import { FaUser } from "react-icons/fa";
import { BsCode } from "react-icons/bs";
import LoadingPage from "@/components/utils/LoadingPage";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { TExpense } from "@/utils/schemas/expenses";
import { createExpense } from "@/utils/methods/mutation/expenses";
import Link from "next/link";

function getExpensesFromFormulary({ session, info }: { session: Session; info: TNewWarehouseFormularyDTO }): TExpense {
	const items = info.materiais.map((material) => {
		const item: TExpense["itens"][number] = {
			idMaterial: material.id,
			descricao: material.nome,
			preco: material.preco,
			qtde: material.qtdeRetirada - material.qtdeDevolucao,
			unidade: material.grandeza || "UN",
		};
		return item;
	});
	const total = items.reduce((acc, current) => acc + current.preco * current.qtde, 0);
	return {
		rateio: "CUSTOS DIRETOS",
		categoria: "INSUMOS DE ALMOXARIFADO",
		descricao: info.titulo,
		projeto: {
			id: info.projeto.id,
			nome: info.projeto.nome,
			identificador: info.projeto.identificador, // identificador QTDE do projeto no banco de projetos
			tipo: "",
		},
		idFormularioAlmoxarifado: info._id || "",
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		itens: items,
		total: total,
		efetivacao: {
			efetivado: true,
			data: new Date().toISOString(),
		},
		criterioCompetencia: true,
		criterioReferencia: false,
		pagamentos: [],
		dataInsercao: new Date().toISOString(),
	};
}
type EditFormProps = {
	formularyId: string;
	session: Session;
	closeModal: () => void;
	invalidateQuery: () => void;
};
function EditForm({ formularyId, session, closeModal, invalidateQuery }: EditFormProps) {
	const queryClient = useQueryClient();
	const [externalResponsible, setExternalResponsible] = useState<boolean>(false);

	const { data: formulary, isLoading, isError, isSuccess } = useWarehouseFormById({ id: formularyId });

	const [infoHolder, setInfoHolder] = useState<TNewWarehouseFormularyDTO>({
		_id: "holder",
		titulo: "",
		categoria: "",
		responsaveis: "",
		projeto: {
			id: null,
			nome: null,
		},
		localizacao: {
			cep: null,
			uf: null,
			cidade: null,
			bairro: "",
			endereco: "",
			numeroOuIdentificador: "",
			complemento: "",
			distancia: null,
		},
		materiais: [],
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataEfetivacao: null,
		dataInsercao: new Date().toISOString(),
	});
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
					localizacao: {
						...prev.localizacao,
						endereco: addressInfo.logradouro,
						bairro: addressInfo.bairro,
						uf: addressInfo.uf as keyof typeof estadosECidades,
						cidade: addressInfo.localidade.toUpperCase(),
					},
				}));
			}
		}, 1000);
	}
	async function handleFormularyConclusion() {
		try {
			// Formatting updates for material devolution
			const updates = infoHolder.materiais
				.filter((m) => !!m.id)
				.map((material) => {
					return {
						id: material.id as string,
						nome: material.nome,
						diferenca: material.qtdeDevolucao,
					};
				});
			// Getting an expense object to create expense from materials take away
			const expense = getExpensesFromFormulary({ session, info: infoHolder });
			const project = infoHolder.projeto;

			// Calling method for stock quantities update
			const updateResponse = await updateManyMaterials({ formularyId, project, updates });
			// Calling method to generate a expense from formulary
			const expenseResponse = await createExpense({ ...expense });
			// Calling method for the update of the formulary itself
			const formularyResponse = await updateWarehouseFormulary({
				id: formularyId,
				changes: { ...infoHolder, dataEfetivacao: new Date().toISOString() },
			});

			return "Formulário de saída de materiais finalizado com sucesso !";
		} catch (error) {
			throw error;
		}
	}

	async function handleFormularyDelete() {
		try {
			const project = infoHolder.projeto;

			const devolutionLoadingToastId = toast.loading("Devolvendo todos os materiais usados.");
			// Formatting updates for material devolution
			const updates = infoHolder.materiais
				.filter((m) => !!m.id)
				.map((material) => {
					return {
						id: material.id as string,
						nome: material.nome,
						diferenca: material.qtdeRetirada - material.qtdeDevolucao, // returning to stock only what wasnt already returned (qtdeDevolucao) in a finished formulary
					};
				})
				.filter((u) => u.diferenca != 0);
			await updateManyMaterials({ formularyId, project, updates });
			toast.dismiss(devolutionLoadingToastId);

			const deleteLoadingToastId = toast.loading("Excluindo formulário.");
			const deleteResponse = await deleteWarehouseFormulary({ id: formularyId });
			toast.dismiss(deleteLoadingToastId);
			return deleteResponse;
		} catch (error) {
			toast.dismiss();
			throw error;
		}
	}
	const { mutate: handleConclusion, isPending: loadingConclusion } = useMutationWithFeedback({
		mutationKey: ["conclude-warehouse-formulary", formularyId],
		mutationFn: handleFormularyConclusion,
		queryClient: queryClient,
		affectedQueryKey: ["warehouse-form-by-id", formularyId],
		callbackFn: () => invalidateQuery(),
	});
	const { mutate: handleUpdate, isPending: loadingUpdate } = useMutationWithFeedback({
		mutationKey: ["edit-warehouse-formulary", formularyId],
		mutationFn: updateWarehouseFormulary,
		queryClient: queryClient,
		affectedQueryKey: ["warehouse-form-by-id", formularyId],
		callbackFn: () => invalidateQuery(),
	});
	const { mutate: handleDelete, isPending: loadingDelete } = useMutationWithFeedback({
		mutationKey: ["delete-warehouse-formulary", formularyId],
		mutationFn: handleFormularyDelete,
		queryClient: queryClient,
		affectedQueryKey: ["warehouse-form-by-id", formularyId],
		callbackFn: () => {
			invalidateQuery();
			closeModal();
		},
	});

	const isFormularyFinished = !!infoHolder.dataEfetivacao;
	const userHasOverallEditingPermission = session.user.permissoes.execucao.editar;
	useEffect(() => {
		if (formulary) setInfoHolder(formulary as TNewWarehouseFormularyDTO);
	}, [formulary]);
	return (
		<div id="new-warehouse-form" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
				<div className="flex h-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg lg:flex-row">
						<div className="flex flex-col">
							<h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR FORMULÁRIO</h3>
							<p className="text-xs text-gray-500">#{formularyId}</p>
						</div>

						<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg={"Erro ao buscar informações do formulário."} /> : null}
					{isSuccess ? (
						<>
							<div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
								<TextInput
									label="TITULO DO FORMULÁRIO"
									editable={!isFormularyFinished}
									placeholder="Preencha aqui um titulo para identificação e filtro desse formulário posteriomente..."
									value={infoHolder.titulo}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, titulo: value }))}
									width="100%"
								/>

								{infoHolder.projeto ? (
									<div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
										<div className="flex items-center gap-2">
											<BsCode size={"20px"} color="rgb(31,41,55)" />
											<p className="font-raleway text-sm font-medium">#{infoHolder.projeto.id || "N/A"}</p>
										</div>
										<div className="flex items-center gap-2">
											<FaUser size={"20px"} color="rgb(31,41,55)" />
											<p className="font-raleway text-sm font-medium">{infoHolder.projeto.nome || "N/A"}</p>
										</div>
									</div>
								) : null}
								<div className="my-2 flex w-full items-center justify-center">
									<CheckboxInput
										labelFalse="RESPONSÁVEL INTERNO"
										labelTrue="RESPONSÁVEL INTERNO"
										checked={!externalResponsible}
										handleChange={(value) => {
											setExternalResponsible((prev) => !prev);
										}}
									/>
								</div>
								<div className="flex w-full flex-col gap-2 lg:flex-row">
									<div className="w-full lg:w-1/2">
										<SelectInput
											label="CATEGORIA"
											value={infoHolder.categoria}
											options={serviceOrdersCategories}
											selectedItemLabel="NÃO DEFINIDO"
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
											onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: "" }))}
											width="100%"
										/>
									</div>
									<div className="w-full lg:w-1/2">
										{externalResponsible ? (
											<TextInput
												label="RESPONSÁVEL(IS)"
												placeholder="Preencha aqui o nome dos responsáveis pelo material.."
												value={infoHolder.responsaveis}
												handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
												width="100%"
											/>
										) : (
											<SelectInput
												label="RESPONSÁVEL(IS)"
												value={infoHolder.responsaveis}
												options={equipesTecnicas}
												selectedItemLabel="NÃO DEFINIDO"
												handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
												onReset={() => setInfoHolder((prev) => ({ ...prev, responsaveis: "" }))}
												width="100%"
											/>
										)}
									</div>
								</div>

								<MaterialsBlock
									formularyId={formularyId}
									formHolder={infoHolder}
									setFormHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TNewWarehouseFormulary>>}
									blockTakeAway={true}
									blockDevolution={false}
									allowPostFinishEditing={userHasOverallEditingPermission}
								/>

								<h1 className="mb-2 w-full rounded-md bg-[#15599a] p-1 text-center text-sm font-bold text-white">LOCALIZAÇÃO</h1>
								<div className="grid grid-cols-1 grid-rows-3 items-center gap-6 px-2 lg:grid-cols-3 lg:grid-rows-1">
									<TextInput
										label="CEP"
										value={(infoHolder.localizacao.cep as string) || ""}
										placeholder="Preencha aqui o CEP do cliente."
										handleChange={(value) => {
											if (value.length == 9) {
												setAddressDataByCEP(value);
											}
											setInfoHolder((prev) => ({
												...prev,
												localizacao: {
													...prev.localizacao,
													cep: formatToCEP(value),
												},
											}));
										}}
										width="100%"
									/>

									<SelectInput
										label="ESTADO"
										value={infoHolder.localizacao.uf}
										handleChange={(value) =>
											setInfoHolder((prev) => ({
												...prev,
												localizacao: { ...prev.localizacao, uf: value, cidade: estadosECidades[value as keyof typeof estadosECidades][0] as string },
											}))
										}
										selectedItemLabel="NÃO DEFINIDO"
										onReset={() => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: "", cidade: "" } }))}
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
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cidade: value } }))}
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
										onReset={() => setInfoHolder((prev) => ({ ...prev, cidade: "" }))}
										width="100%"
									/>
								</div>
								<div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
									<TextInput
										label="BAIRRO"
										value={infoHolder.localizacao.bairro || ""}
										placeholder="Preencha aqui o bairro do cliente."
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, bairro: value } }))}
										width="100%"
									/>

									<TextInput
										label="LOGRADOURO/RUA"
										value={infoHolder.localizacao.endereco || ""}
										placeholder="Preencha aqui o logradouro do cliente."
										handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, endereco: value } }))}
										width="100%"
									/>
								</div>
								<div className="mb-2 grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
									<TextInput
										label="NÚMERO/IDENTIFICADOR"
										value={infoHolder.localizacao.numeroOuIdentificador || ""}
										placeholder="Preencha aqui o número ou identificador da residência do cliente."
										handleChange={(value) =>
											setInfoHolder((prev) => ({
												...prev,
												localizacao: {
													...prev.localizacao,
													numeroOuIdentificador: value,
												},
											}))
										}
										width="100%"
									/>

									<TextInput
										label="COMPLEMENTO"
										value={infoHolder.localizacao.complemento || ""}
										placeholder="Preencha aqui algum complemento do endereço."
										handleChange={(value) =>
											setInfoHolder((prev) => ({
												...prev,
												localizacao: { ...prev.localizacao, complemento: value },
											}))
										}
										width="100%"
									/>
								</div>
							</div>
							{!infoHolder.dataEfetivacao ? (
								<div className="my-1 flex w-full items-center justify-end gap-2">
									<Link href={`/almoxarifado/pdfFormulario/${formularyId}`}>
										<div className="rounded bg-[#fead41] py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-red-500">
											DOCUMENTO (PDF)
										</div>
									</Link>
									<button
										disabled={loadingConclusion || loadingUpdate}
										// @ts-ignore
										onClick={() => handleUpdate({ id: formularyId, changes: infoHolder })}
										className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
									>
										SALVAR
									</button>
									<button
										disabled={loadingConclusion || loadingUpdate}
										onClick={() => handleConclusion()}
										className="rounded bg-green-600 py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-green-700"
									>
										FINALIZAR
									</button>
								</div>
							) : (
								<div className="my-1 flex w-full items-center justify-start gap-2">
									<button
										disabled={loadingDelete}
										// @ts-ignore
										onClick={() => handleDelete({ id: formularyId })}
										className="rounded bg-red-600 py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-red-500"
									>
										EXCLUIR FORMULÁRIO
									</button>
									<Link href={`/almoxarifado/pdfFormulario/${formularyId}`}>
										<div className="rounded bg-[#fead41] py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-red-500">
											DOCUMENTO (PDF)
										</div>
									</Link>
								</div>
							)}
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default EditForm;
