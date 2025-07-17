import TextInput from "@/components/inputs/Text";
import { formatDate, formatToPhone } from "@/utils/constants";
import { formatToCPForCNPJ } from "@/utils/methods/formatting";
import { TEmployee, TEmployeeDTO } from "@/utils/schemas/users";
import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import SystemAccess from "./blocos/SystemAccess";
import DateInput from "@/components/inputs/Date";
import { formatDateInputChange } from "@/utils/methods/shared";
import CorporativeInformation from "./blocos/CorporativeInformation";
import { Session } from "next-auth";
import Documents from "./blocos/Documents";
import { useEmployeeById } from "@/utils/methods/query/users";
import LoadingPage from "@/components/utils/LoadingPage";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { useQueryClient } from "@tanstack/react-query";
import { updateEmployee } from "@/utils/methods/mutation/employees";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import CheckboxInput from "@/components/inputs/Checkbox";
import AvatarAttachment from "./AvatarAttachment";

type EditEmployeeProps = {
	userId: string;
	session: Session;
	closeModal: () => void;
};
function EditEmployee({ userId, session, closeModal }: EditEmployeeProps) {
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TEmployeeDTO>({
		_id: "id-holder",
		acessoAtivo: true,
		colaboradorAtivo: true,
		nome: "",
		usuario: "",
		email: "",
		telefone: "",
		senha: "",
		avatar_url: "",
		visualizacao: {
			tipo: null,
			referencia: null,
		},
		permissoes: {
			rotas: [],
			usuarios: {
				escopo: null,
				visualizar: false,
				editar: false,
				criar: false,
			},
			comercial: {
				visualizar: false,
				editar: false,
			},
			posVenda: {
				visualizar: false,
				editar: false,
			},
			suprimentos: {
				visualizar: false,
				editar: false,
			},
			engenharia: {
				visualizar: false,
				editar: false,
			},
			execucao: {
				visualizar: false,
				editar: false,
			},
			suporte: {
				visualizar: false,
				editar: false,
			},
			administrativo: {
				visualizar: false,
				editar: false,
			},
			financeiro: {
				visualizar: false,
				editar: false,
			},
			recursosHumanos: {
				visualizar: false,
				editar: false,
			},
			gestao: {
				visualizarResultados: false,
			},
			ordensDeServico: {
				criar: false,
				visualizar: false,
				editar: false,
			},
		},
		empresaVinculada: "", //
		dataNascimento: "", //
		localNascimento: "",
		nacionalidade: "", //
		estadoCivil: "", //
		grauInstrucao: "", //
		tituloEleitor: "", //
		carteiraTrabalho: {
			pisPaseb: "", //
			numero: "", //
			serie: "", //
		},
		rg: "", //
		cpf: "", //
		carteiraTransito: {
			numero: "", //
			dataVencimento: null, //
		},
		qtdeFilhos: 0, //
		localizacao: {
			cep: null, //
			uf: null, //
			cidade: null, //
			bairro: "", //
			endereco: "", //
			numeroOuIdentificador: "", //
		},
		dataAdmissao: null, //
		cargos: [], //
		salarioBase: 0,
		horariosTrabalho: [], //
		contatosAuxiliares: [],
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});
	const { data: employee, isLoading, isSuccess, isError } = useEmployeeById({ id: userId });

	const { mutate: handleUpdateEmployee, isPending: updateLoading } = useMutationWithFeedback({
		mutationKey: ["create-employee"],
		mutationFn: updateEmployee,
		queryClient: queryClient,
		affectedQueryKey: ["employees"],
	});
	useEffect(() => {
		if (employee) setInfoHolder(employee);
	}, [employee]);
	return (
		<div id="new-warehouse-form" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
				<div className="flex h-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-[#353432] dark:text-white ">CADASTRO DE COLABORADOR</h3>
						<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg={"Erro ao buscar informações do "} /> : null}
					{isSuccess ? (
						<>
							<div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
								<h1 className="w-full rounded bg-gray-800 py-1 text-center font-bold text-white">INFORMAÇÕES GERAIS</h1>
								<div className="flex w-full items-center justify-center">
									<CheckboxInput
										checked={infoHolder.colaboradorAtivo}
										handleChange={(value) =>
											setInfoHolder((prev) => ({
												...prev,
												colaboradorAtivo: value,
											}))
										}
										labelFalse="COLABORADOR ATIVO"
										labelTrue="COLABORADOR ATIVO"
										justify="justify-center"
									/>
								</div>
								<AvatarAttachment userId={userId} userName={employee.usuario} avatar_url={employee.avatar_url || null} />
								<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
									<div className="w-full lg:w-1/2">
										<TextInput
											label="NOME DO COLABORADOR"
											placeholder="Preencha aqui o nome do colaborador..."
											value={infoHolder.nome}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
											width="100%"
										/>
									</div>
									<div className="w-full lg:w-1/2">
										<TextInput
											label="CPF DO COLABORADOR"
											placeholder="Preencha aqui o CPF do colaborador..."
											value={infoHolder.cpf}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cpf: formatToCPForCNPJ(value) }))}
											width="100%"
										/>
									</div>
								</div>
								<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
									<div className="w-full lg:w-1/2">
										<TextInput
											label="EMAIL DO COLABORADOR"
											placeholder="Preencha aqui o email do colaborador..."
											value={infoHolder.email}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, email: value }))}
											width="100%"
										/>
									</div>
									<div className="w-full lg:w-1/2">
										<TextInput
											label="TELEFONE DO COLABORADOR"
											placeholder="Preencha aqui o telefone do colaborador..."
											value={infoHolder.telefone}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, telefone: formatToPhone(value) }))}
											width="100%"
										/>
									</div>
								</div>
								<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
									<div className="w-full lg:w-1/2">
										<DateInput
											label="DATA DE NASCIMENTO"
											value={infoHolder.dataNascimento ? formatDate(infoHolder.dataNascimento) : undefined}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataNascimento: formatDateInputChange(value) }))}
											width="100%"
										/>
									</div>
									<div className="w-full lg:w-1/2">
										<TextInput
											label="NACIONALIDADE"
											placeholder="Preencha aqui a nacionalidade do colaborador..."
											value={infoHolder.nacionalidade}
											handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nacionalidade: value }))}
											width="100%"
										/>
									</div>
								</div>
								<SystemAccess initialMode={true} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
								<CorporativeInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TEmployeeDTO>>} />

								<Documents employeeId={userId} session={session} />
							</div>
							<div className="my-1 flex w-full items-center justify-end">
								<button
									disabled={updateLoading}
									// @ts-ignore
									onClick={() => handleUpdateEmployee({ id: userId, changes: infoHolder })}
									className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
								>
									ATUALIZAR COLABORADOR
								</button>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default EditEmployee;
