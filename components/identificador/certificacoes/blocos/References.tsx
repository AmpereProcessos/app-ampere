import DatetimeInput from "@/components/inputs/Datetime";
import MultipleSelectWithImages from "@/components/inputs/MultipleSelectWithImages";
import TextInput from "@/components/inputs/Text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import { cn } from "@/lib/utils";
import { formatLongString, isFileImage } from "@/utils/constants";
import { TIME_UNITS_MANIPULATION_MAP } from "@/utils/methods/dates";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { useUsers } from "@/utils/methods/query/users";
import { formatDateInputChange } from "@/utils/methods/shared";
import { isValidNumber } from "@/utils/methods/validating";
import type { TUseCertificationState } from "@/utils/state/certification";
import dayjs from "dayjs";
import { LinkIcon, Pencil, PlusIcon, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCloudUploadFill } from "react-icons/bs";

type CertificationReferencesProps = {
	certification: TUseCertificationState["state"]["certification"];
	references: TUseCertificationState["state"]["references"];
	addCertificationReference: TUseCertificationState["addCertificationReference"];
	removeCertificationReference: TUseCertificationState["removeCertificationReference"];
	updateCertificationReference: TUseCertificationState["updateCertificationReference"];
};
export default function CertificationReferences({
	certification,
	references,
	addCertificationReference,
	updateCertificationReference,
	removeCertificationReference,
}: CertificationReferencesProps) {
	const [newReferenceMenuIsOpen, setNewReferenceMenuIsOpen] = useState(false);
	const [editReferenceMenuIndex, setEditReferenceMenuIndex] = useState<number | null>(null);
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="REFERÊNCIAS" sectionTitleIcon={<LinkIcon size={15} />}>
			<div className="w-full flex items-center justify-center">
				<Button type="button" variant={"ghost"} size={"sm"} className="flex items-center gap-1" onClick={() => setNewReferenceMenuIsOpen(true)}>
					<PlusIcon size={15} />
					ADICIONAR REFERÊNCIA
				</Button>
			</div>
			{references.length > 0 ? (
				<div className="w-full flex flex-col gap-2">
					{references.map((reference, index) => (
						<CertificationReferenceCard
							key={`${reference._id ?? ""}-${index}`}
							reference={reference}
							removeCertificationReference={() => removeCertificationReference(index)}
							editCertificationReference={() => setEditReferenceMenuIndex(index)}
						/>
					))}
				</div>
			) : (
				<p className="text-primary/60 w-full text-center text-sm font-medium">Nenhuma referência encontrada.</p>
			)}
			{newReferenceMenuIsOpen ? (
				<NewCertificationReferenceMenu
					certificationValidConfig={certification.validade}
					addCertificationReference={addCertificationReference}
					closeMenu={() => setNewReferenceMenuIsOpen(false)}
				/>
			) : null}
			{isValidNumber(editReferenceMenuIndex) ? (
				<ControlCertificationReferenceMenu
					certificationReference={references[editReferenceMenuIndex as number]}
					updateCertificationReference={(info) => updateCertificationReference(editReferenceMenuIndex as number, info)}
					closeMenu={() => setEditReferenceMenuIndex(null)}
				/>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

type NewCertificationReferenceMenuProps = {
	certificationValidConfig: TUseCertificationState["state"]["certification"]["validade"];
	addCertificationReference: TUseCertificationState["addCertificationReference"];
	closeMenu: () => void;
};
function NewCertificationReferenceMenu({ certificationValidConfig, addCertificationReference, closeMenu }: NewCertificationReferenceMenuProps) {
	const { data: users } = useUsers();
	const [newReferenceHolder, setNewReferenceHolder] = useState<TUseCertificationState["state"]["references"][number]>({
		documento: {
			titulo: "",
			formato: "",
			url: "",
		},
		dataInicio: new Date().toISOString(),
		dataFim: dayjs().add(certificationValidConfig.valor, TIME_UNITS_MANIPULATION_MAP[certificationValidConfig.medida]).toISOString(),
		notificados: [],
		anexo: {},
	});

	function handleAddCertificationReference(info: TUseCertificationState["state"]["references"][number]) {
		if (!info.documento.titulo || info.documento.titulo.trim().length < 3) return toast.error("Título não informado.");
		if (!info.anexo.arquivo) return toast.error("Documento não informado.");
		addCertificationReference(info);
		toast.success("Referência adicionada com sucesso.");
		return closeMenu();
	}
	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVA REFERÊNCIA"
			menuDescription="Preencha os campos abaixo para criar uma nova referência."
			menuActionButtonText="CRIAR REFERÊNCIA"
			menuCancelButtonText="CANCELAR"
			closeMenu={closeMenu}
			actionFunction={() => handleAddCertificationReference(newReferenceHolder)}
			actionIsPending={false}
			stateIsLoading={false}
		>
			<TextInput
				label="TÍTULO DO DOCUMENTO"
				placeholder="Preencha o título do documento da referência"
				value={newReferenceHolder.documento.titulo}
				handleChange={(value) => setNewReferenceHolder((prev) => ({ ...prev, documento: { ...prev.documento, titulo: value } }))}
				width="100%"
			/>
			<div className="relative flex h-full w-full flex-col items-center justify-center">
				<label
					htmlFor="dropzone-file"
					className="dark:hover:bg-primary/80 border-primary/20 bg-background hover:bg-primary/10 flex h-full min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
				>
					<div className="text-primary flex flex-col items-center justify-center px-2 pt-5 pb-6">
						<BsCloudUploadFill
							className={cn("size-10", {
								"text-primary": !newReferenceHolder.anexo.arquivo,
								"text-green-500": newReferenceHolder.anexo.arquivo,
							})}
						/>
						<p className="text-center text-xs lg:text-base tracking-tight">
							{newReferenceHolder.anexo.arquivo ? newReferenceHolder.anexo.arquivo.name : "Clique para escolher o documento da referência."}
						</p>
					</div>
					<input
						onChange={(e) => {
							const file = e.target.files ? e.target.files[0] : null;
							if (file) {
								setNewReferenceHolder((prev) => ({
									...prev,
									documento: { ...prev.documento, id: undefined, url: "" },
									anexo: { arquivo: file, previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null },
								}));
							}
							return;
						}}
						id="dropzone-file"
						type="file"
						className="absolute h-full w-full opacity-0"
					/>
				</label>
			</div>

			<MultipleSelectWithImages
				label="NOTIFICADOS"
				editable={true}
				options={
					users?.map((user) => ({
						id: user._id,
						label: user.nome,
						value: user._id,
						url: user.avatar_url ?? undefined,
					})) || []
				}
				selected={newReferenceHolder.notificados.map((user) => user.id)}
				handleChange={(value) => {
					const notifiedUsers = value
						.map((userId) => {
							const user = users?.find((user) => user._id === userId);
							if (!user) return null;
							return {
								id: user._id,
								nome: user.nome,
								email: user.email,
								avatar_url: user.avatar_url,
							};
						})
						.filter((user) => user !== null);
					setNewReferenceHolder((prev) => ({ ...prev, notificados: notifiedUsers }));
				}}
				resetOptionLabel="NÃO DEFINIDO"
				onReset={() => setNewReferenceHolder((prev) => ({ ...prev, notificados: [] }))}
				width="100%"
			/>
			<DatetimeInput
				label="DATA INÍCIO"
				value={newReferenceHolder.dataInicio}
				handleChange={(value) => setNewReferenceHolder((prev) => ({ ...prev, dataInicio: formatDateInputChange(value, "string", false) as string }))}
				width="100%"
			/>
			<DatetimeInput
				label="DATA FIM"
				value={newReferenceHolder.dataFim}
				handleChange={(value) => setNewReferenceHolder((prev) => ({ ...prev, dataFim: formatDateInputChange(value, "string", false) as string }))}
				width="100%"
			/>
		</ResponsiveDialogDrawer>
	);
}

type ControlCertificationReferenceMenuProps = {
	certificationReference: TUseCertificationState["state"]["references"][number];
	updateCertificationReference: (info: Partial<TUseCertificationState["state"]["references"][number]>) => void;
	closeMenu: () => void;
};
function ControlCertificationReferenceMenu({
	certificationReference,
	updateCertificationReference,
	closeMenu,
}: ControlCertificationReferenceMenuProps) {
	const { data: users } = useUsers();

	return (
		<ResponsiveDialogDrawerViewOnly
			menuTitle="EDITAR REFERÊNCIA"
			menuDescription="Preencha os campos abaixo para editar uma referência."
			menuCancelButtonText="CANCELAR"
			closeMenu={closeMenu}
			stateIsLoading={false}
			stateError={null}
		>
			<TextInput
				label="TÍTULO DO DOCUMENTO"
				placeholder="Preencha o título do documento da referência"
				value={certificationReference.documento.titulo}
				handleChange={(value) => updateCertificationReference({ documento: { ...certificationReference.documento, titulo: value } })}
				width="100%"
			/>
			<div className="relative flex h-full w-full flex-col items-center justify-center">
				<label
					htmlFor="dropzone-file"
					className="dark:hover:bg-primary/80 border-primary/20 bg-background hover:bg-primary/10 flex h-full min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
				>
					<div className="text-primary flex flex-col items-center justify-center px-2 pt-5 pb-6">
						<BsCloudUploadFill
							className={cn("size-10", {
								"text-primary": !certificationReference.anexo.arquivo && !certificationReference.documento.url,
								"text-green-500": certificationReference.anexo.arquivo || certificationReference.documento.url,
							})}
						/>
						<p className="text-center text-xs lg:text-base tracking-tight">
							{certificationReference.documento.url
								? formatLongString(certificationReference.documento.url, 30)
								: certificationReference.anexo.arquivo
									? formatLongString(certificationReference.anexo.arquivo.name, 30)
									: "Clique para escolher o documento da referência."}
						</p>
					</div>
					<input
						onChange={(e) => {
							const file = e.target.files ? e.target.files[0] : null;
							if (file) {
								updateCertificationReference({
									documento: { ...certificationReference.documento, id: undefined, url: "" },
									anexo: { arquivo: file, previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null },
								});
							}
							return;
						}}
						id="dropzone-file"
						type="file"
						className="absolute h-full w-full opacity-0"
					/>
				</label>
			</div>

			<MultipleSelectWithImages
				label="NOTIFICADOS"
				editable={true}
				options={
					users?.map((user) => ({
						id: user._id,
						label: user.nome,
						value: user._id,
						url: user.avatar_url ?? undefined,
					})) || []
				}
				selected={certificationReference.notificados.map((user) => user.id)}
				handleChange={(value) => {
					const notifiedUsers = value
						.map((userId) => {
							const user = users?.find((user) => user._id === userId);
							if (!user) return null;
							return {
								id: user._id,
								nome: user.nome,
								email: user.email,
								avatar_url: user.avatar_url,
							};
						})
						.filter((user) => user !== null);
					updateCertificationReference({ notificados: notifiedUsers });
				}}
				resetOptionLabel="NÃO DEFINIDO"
				onReset={() => updateCertificationReference({ notificados: [] })}
				width="100%"
			/>
			<DatetimeInput
				label="DATA INÍCIO"
				value={certificationReference.dataInicio}
				handleChange={(value) => updateCertificationReference({ dataInicio: formatDateInputChange(value, "string", false) as string })}
				width="100%"
			/>
			<DatetimeInput
				label="DATA FIM"
				value={certificationReference.dataFim}
				handleChange={(value) => updateCertificationReference({ dataFim: formatDateInputChange(value, "string", false) as string })}
				width="100%"
			/>
		</ResponsiveDialogDrawerViewOnly>
	);
}

type CertificationReferenceCardProps = {
	reference: TUseCertificationState["state"]["references"][number];
	removeCertificationReference: () => void;
	editCertificationReference: () => void;
};

function CertificationReferenceCard({ reference, removeCertificationReference, editCertificationReference }: CertificationReferenceCardProps) {
	return (
		<div className="border-primary/20 bg-card flex w-full flex-col gap-1 rounded border p-2 shadow-xs">
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-1">
					<LinkIcon className="w-4 h-4" />
					<h1 className="text-sm leading-none font-bold tracking-tight">{reference.documento.titulo}</h1>
				</div>
				<div className="flex items-center gap-1">
					<Button className="hover:bg-blue-200 hover:text-blue-700 p-1" size={"fit"} variant={"ghost"} onClick={() => editCertificationReference()}>
						<Pencil className="w-4 h-4" />
					</Button>
					<Button className="hover:bg-red-200 hover:text-red-700 p-1" size={"fit"} variant={"ghost"} onClick={() => removeCertificationReference()}>
						<Trash className="w-4 h-4" />
					</Button>
				</div>
			</div>
			<div className="w-full flex flex-col gap-1">
				<p className="text-primary/80 text-[0.65rem] font-medium tracking-tight">NOTIFICADOS</p>
				<div className="w-full flex items-center gap-2 flex-wrap">
					{reference.notificados.length > 0 ? (
						reference.notificados.map((user) => (
							<div key={user.id} className="flex items-center gap-1">
								<Avatar className="w-5 h-5">
									<AvatarImage src={user.avatar_url ?? undefined} alt={user.nome} />
									<AvatarFallback>{formatNameAsInitials(user.nome ?? "")}</AvatarFallback>
								</Avatar>
								<p className="text-primary/80 text-xs font-medium tracking-tight">{user.nome}</p>
							</div>
						))
					) : (
						<p className="text-primary/80 text-xs font-medium tracking-tight">NENHUM USUÁRIO NOTIFICADO</p>
					)}
				</div>
			</div>
		</div>
	);
}
