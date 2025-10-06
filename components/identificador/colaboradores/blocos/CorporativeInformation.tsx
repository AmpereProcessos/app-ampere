import CheckboxInput from "@/components/inputs/Checkbox";
import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import TimeInput from "@/components/inputs/TimeInput";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { cidadesAtendidas, formatDate } from "@/utils/constants";
import { estadosECidades } from "@/utils/estados_cidades";
import { getDifferenceBetweenTimes } from "@/utils/methods/dates";
import { formatDateAsLocale, formatToCEP, formatToPhone } from "@/utils/methods/formatting";
import { formatDateInputChange, getCEPInfo } from "@/utils/methods/shared";
import type { TCorporatePosition, TEmployee, TEmployeeAuxiliarContact, TWorkingHours } from "@/utils/schemas/users";
import { InstructionLevels, NaturalPersonMaritalStatus, VinculationCompanies } from "@/utils/select-options";
import { Building2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCalendarMinus, BsCalendarPlus, BsCode } from "react-icons/bs";
import { FaPhone, FaPlayCircle, FaRegClock, FaStopCircle, FaUsers } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

type CorporativeInformationProps = {
	infoHolder: TEmployee;
	updateInfoHolder: (changes: Partial<TEmployee>) => void;
};
function EmployeeCorporativeInformation({ infoHolder, updateInfoHolder }: CorporativeInformationProps) {
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
						uf: addressInfo.uf,
						cidade: addressInfo.localidade.toUpperCase(),
					},
				});
			}
		}, 1000);
	}
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Building2 size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES CORPORATIVAS</h1>
			</div>
			<div className="flex w-full items-center justify-center">
				<div className="w-fit">
					<CheckboxInput
						checked={infoHolder.colaboradorAtivo}
						handleChange={(value) =>
							updateInfoHolder({
								colaboradorAtivo: value,
							})
						}
						labelFalse="COLABORADOR ATIVO"
						labelTrue="COLABORADOR ATIVO"
						justify="justify-center"
					/>
				</div>
			</div>
			<SelectInput
				label="EMPRESA"
				options={VinculationCompanies}
				value={infoHolder.empresaVinculada}
				selectedItemLabel="NÃO DEFINIDO"
				handleChange={(value) => updateInfoHolder({ empresaVinculada: value })}
				onReset={() => updateInfoHolder({ empresaVinculada: VinculationCompanies[0].value })}
				width="100%"
			/>
			<DateInput
				label="DATA DE ADMISSÃO"
				value={infoHolder.dataAdmissao ? formatDate(infoHolder.dataAdmissao) : undefined}
				handleChange={(value) => updateInfoHolder({ dataAdmissao: formatDateInputChange(value, "string") })}
				width="100%"
			/>
			<PositionsMenu infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<WorkingHoursMenu infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />

			<h1 className="w-full pt-2 text-start text-sm font-medium">CONTATOS AUXILIARES</h1>
			<AuxiliarContactsMenu infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />

			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="ESTADO CIVIL"
						options={NaturalPersonMaritalStatus}
						value={infoHolder.estadoCivil}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => updateInfoHolder({ estadoCivil: value })}
						onReset={() => updateInfoHolder({ estadoCivil: NaturalPersonMaritalStatus[0].value })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="GRAU DE INSTRUÇÃO"
						options={InstructionLevels}
						value={infoHolder.grauInstrucao}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => updateInfoHolder({ grauInstrucao: value })}
						onReset={() => updateInfoHolder({ grauInstrucao: InstructionLevels[0].value })}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<NumberInput
						label="NÚMERO DE FILHOS"
						placeholder="Preencha o número de filhos, se houver, do colaborador."
						value={infoHolder.qtdeFilhos}
						handleChange={(value) => updateInfoHolder({ qtdeFilhos: value })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label="RG"
						placeholder="Preencha aqui o RG do colaborador..."
						value={infoHolder.rg}
						handleChange={(value) => updateInfoHolder({ rg: value })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label="TÍTULO DE ELEITOR"
						placeholder="Preencha aqui o título de eleitor do colaborador..."
						value={infoHolder.tituloEleitor}
						handleChange={(value) => updateInfoHolder({ tituloEleitor: value })}
						width="100%"
					/>
				</div>
			</div>
			<h1 className="w-full pt-2 text-start text-sm font-medium">CARTEIRA DE TRABALHO</h1>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label="PIS/PASEB"
						placeholder="Preencha aqui o PIS/Paseb do colaborador..."
						value={infoHolder.carteiraTrabalho.pisPaseb}
						handleChange={(value) => updateInfoHolder({ carteiraTrabalho: { ...infoHolder.carteiraTrabalho, pisPaseb: value } })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label="NÚMERO"
						placeholder="Preencha aqui o número da carteira de trabalho do colaborador..."
						value={infoHolder.carteiraTrabalho.numero}
						handleChange={(value) => updateInfoHolder({ carteiraTrabalho: { ...infoHolder.carteiraTrabalho, numero: value } })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label="SÉRIE"
						placeholder="Preencha aqui a série da carteira de trabalho do colaborador..."
						value={infoHolder.carteiraTrabalho.serie}
						handleChange={(value) => updateInfoHolder({ carteiraTrabalho: { ...infoHolder.carteiraTrabalho, serie: value } })}
						width="100%"
					/>
				</div>
			</div>
			<h1 className="w-full pt-2 text-start text-sm font-medium">CARTEIRA DE TRÂNSITO</h1>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="NÚMERO"
						placeholder="Preencha aqui o número da CNH do colaborador..."
						value={infoHolder.carteiraTransito.numero || ""}
						handleChange={(value) => updateInfoHolder({ carteiraTransito: { ...infoHolder.carteiraTransito, numero: value } })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<DateInput
						label="DATA DE VENCIMENTO"
						value={infoHolder.carteiraTransito.dataVencimento ? formatDate(infoHolder.carteiraTransito.dataVencimento) : undefined}
						handleChange={(value) =>
							updateInfoHolder({ carteiraTransito: { ...infoHolder.carteiraTransito, dataVencimento: formatDateInputChange(value, "string") } })
						}
						width="100%"
					/>
				</div>
			</div>
			<h1 className="w-full pt-2 text-start text-sm font-medium">ENDEREÇO</h1>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label="CEP"
						value={infoHolder.localizacao.cep || ""}
						placeholder="Preencha aqui o CEP do cliente."
						handleChange={(value) => {
							if (value.length === 9) {
								setAddressDataByCEP(value);
							}
							updateInfoHolder({
								localizacao: { ...infoHolder.localizacao, cep: formatToCEP(value) },
							});
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
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
				</div>
				<div className="w-full lg:w-1/3">
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
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="BAIRRO"
						value={infoHolder.localizacao.bairro}
						placeholder="Preencha aqui o bairro do cliente."
						handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, bairro: value } })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<TextInput
						label="LOGRADOURO/RUA"
						value={infoHolder.localizacao.endereco}
						placeholder="Preencha aqui o logradouro do cliente."
						handleChange={(value) => updateInfoHolder({ localizacao: { ...infoHolder.localizacao, endereco: value } })}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full items-center justify-center">
				<TextInput
					label="NÚMERO/IDENTIFICADOR"
					value={infoHolder.localizacao.numeroOuIdentificador}
					placeholder="Preencha aqui o número ou identificador da residência do cliente."
					handleChange={(value) =>
						updateInfoHolder({
							localizacao: { ...infoHolder.localizacao, numeroOuIdentificador: value },
						})
					}
					width="100%"
				/>
			</div>
		</div>
	);
}

export default EmployeeCorporativeInformation;

type PositionsMenuProps = {
	infoHolder: TEmployee;
	updateInfoHolder: (changes: Partial<TEmployee>) => void;
};
function PositionsMenu({ infoHolder, updateInfoHolder }: PositionsMenuProps) {
	const [newPositionModalIsOpen, setNewPositionModalIsOpen] = useState(false);
	const [positionHolder, setPositionHolder] = useState<TCorporatePosition>({ cargo: "", cbo: "", dataInicio: new Date().toISOString() });
	function handleAddPosition(info: TCorporatePosition) {
		if (info.cargo.trim().length < 3) return toast.error("Preencha um cargo de ao menos 3 caracteres.");
		if (info.cbo.trim().length < 3) return toast.error("Preencha um CBO de ao menos 3 caracteres.");

		const positions = [...infoHolder.cargos];

		positions.push(info);

		updateInfoHolder({ cargos: positions });
	}
	function handleDeletePosition(index: number) {
		const positions = [...infoHolder.cargos];

		positions.splice(index, 1);

		updateInfoHolder({ cargos: positions });
	}
	return (
		<>
			<h1 className="w-full pt-2 text-start text-sm font-medium">CARGOS</h1>
			<div className="flex w-full items-center justify-end">
				<Button onClick={() => setNewPositionModalIsOpen(true)} size="xs" variant="ghost">
					ADICIONAR CARGO
				</Button>
			</div>
			<div className="flex w-full flex-wrap items-start justify-around gap-2">
				{infoHolder.cargos.length ? (
					infoHolder.cargos.map((position, index) => (
						<div key={`${index.toString()}`} className="border-primary/20 flex w-full flex-col rounded-md border p-3 lg:w-[450px]">
							<div className="flex w-full items-center justify-between gap-2">
								<h1 className="text-xs leading-none font-black tracking-tight lg:text-sm">{position.cargo}</h1>
								<button
									onClick={() => handleDeletePosition(index)}
									type="button"
									className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
								>
									<MdDelete style={{ color: "red" }} size={15} />
								</button>
							</div>
							<div className="flex items-center gap-2">
								<BsCode />
								<p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{position.cbo}</p>
							</div>
							<div className="mt-2 flex w-full items-center justify-between">
								<div className={"flex items-center gap-2"}>
									<BsCalendarPlus />
									<p className="text-primary/60 text-xs font-medium">{formatDateAsLocale(position.dataInicio)}</p>
								</div>
								<div className="flex items-center justify-center gap-2">
									{position.dataFinal ? (
										<>
											<BsCalendarMinus color={"#ed174c"} />
											<p className="text-primary/60 text-xs font-medium">{formatDateAsLocale(position.dataFinal)}</p>
										</>
									) : (
										<p className="text-xs font-bold text-green-500">EM ABERTO</p>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<p className="text-primary/60 text-xs font-medium italic">Não há registros de cargos ocupados.</p>
				)}
			</div>
			{newPositionModalIsOpen ? (
				<ResponsiveDialogDrawer
					menuTitle="NOVO CARGO"
					menuDescription="Preencha os campos abaixo para adicionar um novo cargo."
					menuActionButtonText="ADICIONAR CARGO"
					menuCancelButtonText="CANCELAR"
					actionFunction={() => handleAddPosition(positionHolder)}
					actionIsPending={false}
					stateIsLoading={false}
					closeMenu={() => setNewPositionModalIsOpen(false)}
				>
					<TextInput
						label="CARGO"
						placeholder="Preencha o nome do cargo..."
						value={positionHolder.cargo}
						handleChange={(value) => setPositionHolder((prev) => ({ ...prev, cargo: value }))}
						width="100%"
					/>
					<TextInput
						label="CBO"
						placeholder="Preencha o CBO do cargo..."
						value={positionHolder.cbo}
						handleChange={(value) => setPositionHolder((prev) => ({ ...prev, cbo: value }))}
						width="100%"
					/>
					<DateInput
						label="DATA DE INÍCIO"
						value={positionHolder.dataInicio ? formatDate(positionHolder.dataInicio) : undefined}
						handleChange={(value) =>
							setPositionHolder((prev) => ({ ...prev, dataInicio: formatDateInputChange(value, "string") || new Date().toISOString() }))
						}
						width="100%"
					/>
					<DateInput
						label="DATA DE TÉRMINO"
						value={positionHolder.dataFinal ? formatDate(positionHolder.dataFinal) : undefined}
						handleChange={(value) => setPositionHolder((prev) => ({ ...prev, dataFinal: formatDateInputChange(value, "string") }))}
						width="100%"
					/>
				</ResponsiveDialogDrawer>
			) : null}
		</>
	);
}

type WorkingHoursMenuProps = {
	infoHolder: TEmployee;
	updateInfoHolder: (changes: Partial<TEmployee>) => void;
};
function WorkingHoursMenu({ infoHolder, updateInfoHolder }: WorkingHoursMenuProps) {
	const [newWorkingHoursModalIsOpen, setNewWorkingHoursModalIsOpen] = useState(false);
	const [workingHoursHolder, setWorkingHoursHolder] = useState<TWorkingHours>({
		horarioInicio: "",
		horarioFinal: "",
	});
	function handleAddWorkingHours(info: TWorkingHours) {
		if (info.horarioInicio.trim().length < 3) return toast.error("Preencha um horário início.");
		if (info.horarioFinal.trim().length < 3) return toast.error("Preencha um horário de término.");

		const hours = [...infoHolder.horariosTrabalho];

		hours.push(info);

		updateInfoHolder({ horariosTrabalho: hours });
	}
	function handleDeleteWorkingHours(index: number) {
		const hours = [...infoHolder.horariosTrabalho];

		hours.splice(index, 1);

		updateInfoHolder({ horariosTrabalho: hours });
	}
	function getWorkload(workingHours: TWorkingHours[]) {
		const totalMinutes = workingHours.reduce(
			(acc, current) => acc + getDifferenceBetweenTimes(current.horarioInicio, current.horarioFinal).minutesTotal,
			0,
		);

		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return { hours, minutes };
	}
	return (
		<>
			<h1 className="w-full pt-2 text-start text-sm font-medium">HORÁRIOS DE TRABALHO</h1>
			<div className="flex w-full items-center justify-end">
				<Button onClick={() => setNewWorkingHoursModalIsOpen(true)} size="xs" variant="ghost">
					ADICIONAR HORÁRIO
				</Button>
			</div>
			{infoHolder.horariosTrabalho.length ? (
				<div className="flex items-center gap-2 self-center rounded-md bg-[#15599a] px-2 py-1 font-medium text-white">
					<FaRegClock />
					<h1 className="text-sm tracking-tight">
						{getWorkload(infoHolder.horariosTrabalho).hours} HORAS E {getWorkload(infoHolder.horariosTrabalho).minutes} MINUTOS TOTAIS
					</h1>
				</div>
			) : null}
			<div className="flex w-full flex-wrap items-start justify-around gap-2">
				{infoHolder.horariosTrabalho.length > 0 ? (
					infoHolder.horariosTrabalho.map((hour, index) => (
						<div key={`${index.toString()}`} className="border-primary/20 flex w-full flex-col rounded-md border p-3 lg:w-[350px]">
							<h1 className="text-xs leading-none font-black tracking-tight lg:text-sm">TURNO {index + 1}</h1>
							<div className="flex w-full items-center justify-between">
								<div className="flex items-center gap-2">
									<div className={"flex items-center gap-2"}>
										<FaPlayCircle color="rgb(34,197,94)" />
										<p className="text-primary/60 text-xs font-medium">INÍCIO ÀS {hour.horarioInicio}</p>
									</div>
									<div className="flex items-center justify-center gap-2">
										<FaStopCircle color={"#ed174c"} />
										<p className="text-primary/60 text-xs font-medium">TERMINO ÀS {hour.horarioFinal}</p>
									</div>
								</div>

								<button
									onClick={() => handleDeleteWorkingHours(index)}
									type="button"
									className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
								>
									<MdDelete style={{ color: "red" }} size={15} />
								</button>
							</div>
						</div>
					))
				) : (
					<p className="text-primary/60 text-xs font-medium italic">Não há registros de horários de trabalho.</p>
				)}
				{newWorkingHoursModalIsOpen ? (
					<ResponsiveDialogDrawer
						menuTitle="NOVO HORÁRIO"
						menuDescription="Preencha os campos abaixo para adicionar um novo horário."
						menuActionButtonText="ADICIONAR HORÁRIO"
						menuCancelButtonText="CANCELAR"
						actionFunction={() => handleAddWorkingHours(workingHoursHolder)}
						actionIsPending={false}
						stateIsLoading={false}
						closeMenu={() => setNewWorkingHoursModalIsOpen(false)}
					>
						<TimeInput
							label="HORÁRIO DE INÍCIO"
							value={workingHoursHolder.horarioInicio}
							handleChange={(value) => setWorkingHoursHolder((prev) => ({ ...prev, horarioInicio: value || "" }))}
							width="100%"
						/>
						<TimeInput
							label="HORÁRIO DE TÉRMINO"
							value={workingHoursHolder.horarioFinal}
							handleChange={(value) => setWorkingHoursHolder((prev) => ({ ...prev, horarioFinal: value || "" }))}
							width="100%"
						/>
					</ResponsiveDialogDrawer>
				) : null}
			</div>
		</>
	);
}

type AuxiliarContactsMenuProps = {
	infoHolder: TEmployee;
	updateInfoHolder: (changes: Partial<TEmployee>) => void;
};
function AuxiliarContactsMenu({ infoHolder, updateInfoHolder }: AuxiliarContactsMenuProps) {
	const [newAuxiliarContactModalIsOpen, setNewAuxiliarContactModalIsOpen] = useState(false);
	const [contactsHolder, setContactsHolder] = useState<TEmployeeAuxiliarContact>({
		nome: "",
		grau: "",
		telefone: "",
	});
	function handleAddAuxiliarContact(info: TEmployeeAuxiliarContact) {
		if (info.nome.trim().length < 3) return toast.error("Preencha um nome de ao menos 3 caracteres.");
		if (info.telefone.trim().length < 11) return toast.error("Preencha um telefone válido");

		const contacts = [...infoHolder.contatosAuxiliares];

		contacts.push(info);

		updateInfoHolder({ contatosAuxiliares: contacts });
	}
	function handleDeleteAuxiliarContact(index: number) {
		const contacts = [...infoHolder.contatosAuxiliares];

		contacts.splice(index, 1);

		updateInfoHolder({ contatosAuxiliares: contacts });
	}
	return (
		<>
			<div className="flex w-full items-center justify-end">
				<Button onClick={() => setNewAuxiliarContactModalIsOpen(true)} size="xs" variant="ghost">
					ADICIONAR CONTATO
				</Button>
			</div>

			<div className="flex w-full flex-wrap items-start justify-around gap-2">
				{infoHolder.contatosAuxiliares.length > 0 ? (
					infoHolder.contatosAuxiliares.map((contact, index) => (
						<div key={index.toString()} className="border-primary/20 flex w-full flex-col rounded-md border p-3 lg:w-[350px]">
							<div className="flex w-full items-center justify-between">
								<h1 className="text-xs leading-none font-black tracking-tight lg:text-sm">{contact.nome}</h1>
								<button
									onClick={() => handleDeleteAuxiliarContact(index)}
									type="button"
									className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
								>
									<MdDelete style={{ color: "red" }} size={15} />
								</button>
							</div>
							<div className="flex w-full items-center justify-between gap-2">
								<div className={"flex items-center gap-2"}>
									<FaUsers />
									<p className="text-primary/60 text-xs font-medium">{contact.grau}</p>
								</div>
								<div className="flex items-center justify-center gap-2">
									<FaPhone color={"#15599a"} />
									<p className="text-primary/60 text-xs font-medium">{contact.telefone}</p>
								</div>
							</div>
						</div>
					))
				) : (
					<p className="text-primary/60 text-xs font-medium italic">Não há contatos auxiliares cadastrados</p>
				)}
			</div>
			{newAuxiliarContactModalIsOpen ? (
				<ResponsiveDialogDrawer
					menuTitle="NOVO CONTATO"
					menuDescription="Preencha os campos abaixo para adicionar um novo contato."
					menuActionButtonText="ADICIONAR CONTATO"
					menuCancelButtonText="CANCELAR"
					actionFunction={() => handleAddAuxiliarContact(contactsHolder)}
					actionIsPending={false}
					stateIsLoading={false}
					closeMenu={() => setNewAuxiliarContactModalIsOpen(false)}
				>
					<TextInput
						label="NOME DO CONTATO"
						placeholder="Preencha aqui o nome do contato..."
						value={contactsHolder.nome}
						handleChange={(value) => setContactsHolder((prev) => ({ ...prev, nome: value }))}
						width="100%"
					/>
					<TextInput
						label="GRAU DO CONTATO"
						placeholder="Preencha aqui o grau de parentesco do contato..."
						value={contactsHolder.grau}
						handleChange={(value) => setContactsHolder((prev) => ({ ...prev, grau: value }))}
						width="100%"
					/>
					<TextInput
						label="TELEFONE DO CONTATO"
						placeholder="Preencha aqui o telefone de parentesco do contato..."
						value={contactsHolder.telefone}
						handleChange={(value) => setContactsHolder((prev) => ({ ...prev, telefone: formatToPhone(value) }))}
						width="100%"
					/>
				</ResponsiveDialogDrawer>
			) : null}
		</>
	);
}
