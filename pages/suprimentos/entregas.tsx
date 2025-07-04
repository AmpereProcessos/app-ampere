import * as Dialog from "@radix-ui/react-dialog";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useProjectsInDelivery } from "@/utils/methods/query/supply";
import { TProjectDTO } from "@/utils/schemas/projects";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { PureComponent, useState } from "react";
import { BsCalendar2Check, BsCalendarEvent, BsCalendarPlus, BsCloudUploadFill, BsPersonVcard, BsTruck } from "react-icons/bs";
import { FaIndustry, FaPhone, FaUser, FaUserAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import DateInput from "@/components/inputs/Date";
import { fileTypes, formatDate, formatLongString, GeneralVisibleHiddenExitMotionVariants, getFileTypeTitle, isFileImage } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import Image from "next/image";
import { AlignCenter, ExternalLink, Pencil, ShoppingCart } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/services/firebase/firebase-storage";
import { uploadFile } from "@/utils/methods/firebase";
import toast from "react-hot-toast";
import axios from "axios";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import TextInput from "@/components/inputs/Text";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import { deliveryStatus } from "@/utils/select-options";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { updateProject } from "@/utils/methods/mutation/clients";
import { createManyFileReferences } from "@/utils/methods/mutation/crm/file-references";
import type { Session } from "next-auth";
import type { TPurchaseControlDeliveryTrackingDTO } from "@/utils/schemas/purchases";
import { usePurchaseControlById, usePurchaseControlsTags } from "@/utils/methods/query/purchase-controls";
import { MdLandscape, MdPhone } from "react-icons/md";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import { updatePurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import { handleProjectServiceOrderTrigger } from "@/utils/methods/mutation/triggers";
import type { GetServerSideProps } from "next";
import CheckboxInput from "@/components/inputs/Checkbox";

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }));
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }));

interface DeliveriesPageProps {
	tagIds: string[];
	purchasedOnly: boolean;
	deliveredRecentOnly: boolean;
}

export const getServerSideProps: GetServerSideProps<DeliveriesPageProps> = async (context) => {
	const { tagIds, purchasedOnly, deliveredRecentOnly } = context.query;

	// Se for string, converte para array usando a vírgula como delimitador
	const parsedTagIds = typeof tagIds === "string" ? tagIds.split(",").filter(Boolean) : [];
	const parsedPurchasedOnly = typeof purchasedOnly === "string" ? purchasedOnly === "true" : true;
	const parsedDeliveredRecentOnly = typeof deliveredRecentOnly === "string" ? deliveredRecentOnly === "true" : false;
	return {
		props: {
			tagIds: parsedTagIds,
			purchasedOnly: parsedPurchasedOnly,
			deliveredRecentOnly: parsedDeliveredRecentOnly,
		},
	};
};

function DeliveriesPage({ tagIds, purchasedOnly, deliveredRecentOnly }: DeliveriesPageProps) {
	const { data: session, status } = useSession({ required: true });
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false);
	const [acknowlegdeMenu, setAcknowlegdeMenu] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });
	const { data: projects, isLoading, isError, isSuccess, error, filters, setFilters } = useProjectsInDelivery({ initialFilters: { tagIds, purchasedOnly, deliveredRecentOnly } });
	const { data: tags } = usePurchaseControlsTags();
	if (status !== "authenticated") return <LoadingPage />;

	return (
		<div className="grow p-6">
			<div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS EM PROCESSO DE ENTREGA</p>
					</div>
					{dropdownMenuVisible ? (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
						</div>
					) : (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
						</div>
					)}
				</div>
			</div>
			<AnimatePresence>
				{dropdownMenuVisible ? (
					<motion.div
						key={"editor"}
						variants={GeneralVisibleHiddenExitMotionVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
					>
						<h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
						<div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
							<TextInput
								label="NOME DO PROJETO"
								value={filters.search}
								handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
								placeholder="Filtro pelo nome do projeto..."
							/>

							<MultipleSelectInput
								label="STATUS DE ENTREGA"
								selected={filters.deliveryStatus}
								handleChange={(value) => setFilters((prev) => ({ ...prev, deliveryStatus: value as string[] }))}
								options={deliveryStatus}
								onReset={() => setFilters((prev) => ({ ...prev, deliveryStatus: [] }))}
								selectedItemLabel="NÃO DEFINIDO"
							/>

							<MultipleSelectInput
								label="CIDADE"
								selected={filters.cities}
								handleChange={(value) => setFilters((prev) => ({ ...prev, cities: value as string[] }))}
								options={AllCities}
								onReset={() => setFilters((prev) => ({ ...prev, cities: [] }))}
								selectedItemLabel="NÃO DEFINIDO"
							/>

							<MultipleSelectInput
								label="ESTADOS"
								selected={filters.ufs}
								handleChange={(value) => setFilters((prev) => ({ ...prev, ufs: value as string[] }))}
								options={AllStates}
								onReset={() => setFilters((prev) => ({ ...prev, ufs: [] }))}
								selectedItemLabel="NÃO DEFINIDO"
							/>
							<MultipleSelectInput
								label="ETIQUETAS"
								selected={filters.tagIds}
								handleChange={(value) => setFilters((prev) => ({ ...prev, tagIds: value as string[] }))}
								options={tags?.map((tag) => ({ id: tag._id, label: tag.titulo, value: tag._id })) || []}
								onReset={() => setFilters((prev) => ({ ...prev, tagIds: [] }))}
								selectedItemLabel="NÃO DEFINIDO"
							/>
						</div>
						<div className="flex w-full items-center  gap-2 flex-wrap">
							<div className="w-fit">
								<CheckboxInput
									labelTrue="COMPRAS COM PEDIDO FEITO"
									labelFalse="COMPRAS COM PEDIDO FEITO"
									checked={filters.purchasedOnly}
									handleChange={(value) => setFilters((prev) => ({ ...prev, purchasedOnly: value }))}
								/>
							</div>
							<div className="w-fit">
								<CheckboxInput
									labelTrue="COMPRAS ENTREGUES RECENTEMENTE"
									labelFalse="COMPRAS ENTREGUES RECENTEMENTE"
									checked={filters.deliveredRecentOnly}
									handleChange={(value) => setFilters((prev) => ({ ...prev, deliveredRecentOnly: value }))}
								/>
							</div>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
			<div className="flex w-full flex-col gap-2 py-4">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(projects)} /> : null}
				{isSuccess ? (
					projects.length > 0 ? (
						projects.map((project) => <ProjectCard key={project._id} project={project} handleClick={(id) => setAcknowlegdeMenu({ id, isOpen: true })} />)
					) : (
						<p className="w-full text-center tracking-tight text-gray-500">Nenhuma compra em processo de entrega encontrado.</p>
					)
				) : null}
			</div>
			{acknowlegdeMenu.id && acknowlegdeMenu.isOpen ? (
				<AcknowledgeDeliveryMenu
					session={session}
					purchaseControlId={acknowlegdeMenu.id}
					closeModal={() => setAcknowlegdeMenu({ id: null, isOpen: false })}
					affectedQueryKey={["projects-in-delivery", filters]}
				/>
			) : null}
		</div>
	);
}

export default DeliveriesPage;

type ProjectCardProps = {
	project: TPurchaseControlDeliveryTrackingDTO;
	handleClick: (id: string) => void;
};
function ProjectCard({ project, handleClick }: ProjectCardProps) {
	function getDeliveryStatusTag(status: TPurchaseControlDeliveryTrackingDTO["entrega"]["status"]) {
		if (status === "AGUARDANDO COMPRA") return <h1 className="min-w-fit rounded-lg bg-orange-600 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>;

		if (status === "EM ROTA") return <h1 className="min-w-fit rounded-lg bg-blue-600 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>;

		if (status === "ENTREGUE") return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>;

		if (status === "AGUARDANDO DESPACHE") return <h1 className="min-w-fit rounded-lg bg-orange-500 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>;

		return <h1 className="min-w-fit rounded-lg bg-gray-500 px-2 py-0.5 text-[0.5rem] text-white">NÃO DEFINIDO</h1>;
	}
	return (
		<div className="flex w-full flex-col gap-1 rounded border border-gray-500 p-2">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex items-center gap-2">
					<p className="text-sm font-bold leading-none tracking-tight">{project.titulo}</p>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<div className="flex items-center gap-1">
						<FaUser width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.projetoDados?.vendedor?.nome}</h1>
					</div>
					<div className="flex items-center gap-1">
						<FaPhone width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.projetoDados?.telefone}</h1>
					</div>
					<div className="flex items-center gap-1">
						<FaLocationDot width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
							{formatLocation({
								location: {
									uf: project.entrega.localizacao.uf,
									cidade: project.entrega.localizacao.cidade,
									cep: project.entrega.localizacao.cep?.toString(),
									bairro: project.entrega.localizacao.bairro,
									endereco: project.entrega.localizacao.endereco,
									numeroOuIdentificador: project.entrega.localizacao.numeroOuIdentificador?.toString(),
								},
								includeUf: true,
								includeCity: true,
							})}
						</h1>
					</div>
				</div>
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-1">
						<FaIndustry width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">FORNECEDOR</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{project.fornecedor?.nome || "NÃO DEFINIDO"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendarPlus width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">DATA DO PEDIDO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(project.dataPedido) || "NÃO POSSUI"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendarEvent width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO DE ENTREGA</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(project.entrega.dataPrevisao) || "NÃO POSSUI"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendar2Check width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">DATA DE ENTREGA</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(project.entrega.dataEfetivacao) || "NÃO POSSUI"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsTruck width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">ENTREGA</h1>
						{getDeliveryStatusTag(project.entrega.status)}
					</div>
				</div>
			</div>
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-1">
					<BsCalendarPlus width={10} height={10} />
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">DATA DA REQUISIÇÃO</h1>
					<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(project.dataInsercao, true)}</h1>
				</div>
				<button type="button" onClick={() => handleClick(project._id)} className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary">
					<Pencil width={10} height={10} />
					<p>ACUSAR RECEBIMENTO</p>
				</button>
			</div>
		</div>
	);
}

type AcknowledgeDeliveryMenuProps = {
	session: Session;
	purchaseControlId: string;
	closeModal: () => void;
	affectedQueryKey: any[];
};
type TAcknowlegdeDeliveryInfo = {
	deliveryDate: string | null;
	files: {
		file: File;
		previewUrl: string | null;
		type: string | null;
	}[];
};

function AcknowledgeDeliveryMenu({ session, purchaseControlId, closeModal, affectedQueryKey }: AcknowledgeDeliveryMenuProps) {
	const queryClient = useQueryClient();

	const { data: purchaseControl, isLoading, isError, isSuccess, error } = usePurchaseControlById({ id: purchaseControlId });
	const [infoHolder, setInfoHolder] = useState<TAcknowlegdeDeliveryInfo>({
		deliveryDate: null,
		files: [],
	});

	async function handleUploads(files: TAcknowlegdeDeliveryInfo["files"]) {
		const links: { title: string; link: string; category: string; size: number; format: string }[] = [];
		const uploadPromises = files.map(async (file, index) => {
			const datetime = new Date().toISOString();
			const storageStr =
				files.length > 1
					? `clientes/${purchaseControlId}-${purchaseControl?.titulo}/entrega-{${index + 1}}-${datetime}`
					: `clientes/${purchaseControlId}-${purchaseControl?.titulo}/entrega-${datetime}`;
			const fileRef = ref(storage, storageStr);
			const uploadResponse = await uploadBytes(fileRef, file.file);
			const url = await getDownloadURL(ref(storage, uploadResponse.metadata.fullPath));
			const size = uploadResponse.metadata.size;

			const format = uploadResponse.metadata.contentType && fileTypes[uploadResponse.metadata.contentType] ? fileTypes[uploadResponse.metadata.contentType].title : "INDEFINIDO";
			links.push({
				title: files.length > 1 ? `ENTREGA (${index + 1})` : "ENTREGA",
				link: url,
				category: "links.equipamentos",
				format: format,
				size,
			});
		});

		await Promise.all(uploadPromises);

		return links;
	}
	async function handleAcknowledgeDelivery(info: TAcknowlegdeDeliveryInfo) {
		try {
			if (!info.deliveryDate) throw new Error("Preencha a data de entrega.");
			if (!purchaseControl) throw new Error("Oops, um erro ocorreu. Tente novamente.");

			// Updating the purchase control with the provided delivery date
			await updatePurchaseControl({
				id: purchaseControlId,
				changes: {
					...purchaseControl,
					entrega: { ...purchaseControl.entrega, status: "ENTREGUE", dataEfetivacao: info.deliveryDate },
				},
			});
			// In case purchase control has a vinculated project, update the project delivery date and delivery status
			if (purchaseControl.projeto.id) {
				await updateProject({
					id: purchaseControl.projeto.id,
					changes: {
						"compra.statusEntrega": "ENTREGUE",
						"compra.dataEntrega": info.deliveryDate,
					},
				});
				await handleProjectServiceOrderTrigger({
					projectId: purchaseControl.projeto.id,
				});
			}

			const links = await handleUploads(info.files);

			const fileReferences: TFileReference[] = links.map((l) => ({
				titulo: l.title,
				categorias: ["COMPRAS"],
				formato: l.format,
				url: l.link,
				tamanho: l.size,
				idCompra: purchaseControlId,
				idProjeto: purchaseControl?.projeto.id,
				autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url },
				dataInsercao: new Date().toISOString(),
			}));
			await createManyFileReferences({ info: fileReferences });

			return "Reconhecimento de entrega feito com sucesso !";
		} catch (error) {
			throw error;
		}
	}
	const { mutate, isPending } = useMutationWithFeedback({
		mutationKey: ["acknowlegde-delivery"],
		mutationFn: async () => handleAcknowledgeDelivery(infoHolder),
		queryClient: queryClient,
		affectedQueryKey: affectedQueryKey,
	});
	return (
		<Dialog.Root open onOpenChange={closeModal}>
			<Dialog.Overlay className="fixed inset-0 z-[100] bg-primary/70 backdrop-blur-sm" />
			<Dialog.Content className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[80%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-[10px] lg:h-[70%] lg:w-[50%]">
				<div className="flex h-full w-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-sm font-bold lg:text-xl">ACUSAR ENTREGA</h3>
						<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					{isLoading ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						<>
							<div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
								<div className="flex items-center gap-1 self-center">
									<AlignCenter width={13} height={13} />
									<h1 className="py-0.5 text-center text-sm font-bold italic">{purchaseControl.titulo}</h1>
								</div>
								{purchaseControl.projetoDados ? (
									<>
										<h1 className="w-full rounded bg-gray-600 p-1 text-center text-[0.65rem] font-bold tracking-tight text-white">INFORMAÇÕES DO PROJETO</h1>
										<div className="flex flex-wrap items-center justify-center gap-4 py-1">
											<div className="flex items-center gap-1">
												<FaUserAlt />
												<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.projetoDados?.nomeDoContrato}</p>
											</div>
											<div className="flex items-center gap-1">
												<MdPhone />
												<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.projetoDados?.telefone}</p>
											</div>
											<div className="flex items-center gap-1">
												<BsPersonVcard />
												<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.projetoDados?.cpf_cnpj}</p>
											</div>
											<div className="flex items-center gap-1">
												<MdLandscape />
												<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.projetoDados?.inscricaoRural || "N/A"}</p>
											</div>
											<div className="flex items-center gap-1">
												<FaLocationDot />
												<p className="text-[0.75rem] font-medium leading-none tracking-tight">
													{formatLocation({
														location: {
															uf: purchaseControl.projetoDados?.uf || "",
															cidade: purchaseControl.projetoDados?.cidade || "",
															cep: purchaseControl.projetoDados?.cep?.toString() || "",
															bairro: purchaseControl.projetoDados?.bairro,
															endereco: purchaseControl.projetoDados?.logradouro,
															numeroOuIdentificador: purchaseControl.projetoDados?.numeroResidencia?.toString() || "",
															complemento: null,
															latitude: null,
															longitude: null,
														},
														includeCity: true,
														includeUf: true,
													})}
												</p>
											</div>
										</div>
									</>
								) : null}
								<h1 className="w-full rounded bg-gray-600 p-1 text-center text-[0.65rem] font-bold tracking-tight text-white">COMPOSIÇÃO</h1>
								{purchaseControl.composicao.length > 0 ? (
									purchaseControl.composicao.map((item, index) => (
										<div key={`${index}-${item.descricao}`} className="flex w-full items-center gap-2">
											<ShoppingCart height={13} width={13} />
											<h1 className="text-[0.75rem] tracking-tight">
												{item.qtde}x {item.descricao}
											</h1>
										</div>
									))
								) : (
									<p className="w-full text-center text-[0.75rem] font-medium tracking-tight">Não há itens de composição da compra.</p>
								)}
								<h1 className="w-full rounded bg-gray-600 p-1 text-center text-[0.65rem] font-bold tracking-tight text-white">FORNECEDOR</h1>
								<div className="flex flex-wrap items-center justify-center gap-4 py-1">
									<div className="flex items-center gap-1">
										<FaIndustry height={10} width={10} />
										<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.fornecedor?.nome || "FORNECEDOR NÃO DEFINIDO"}</p>
									</div>
									<div className="flex items-center gap-1">
										<FaPhone height={10} width={10} />
										<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.fornecedor?.contato || "N/A"}</p>
									</div>
								</div>
								<h1 className="w-full rounded bg-gray-600 p-1 text-center text-[0.65rem] font-bold tracking-tight text-white">TRANSPORTE</h1>
								<div className="flex flex-wrap items-center justify-center gap-4 py-1">
									<div className="flex items-center gap-1">
										<BsTruck height={10} width={10} />
										<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.transporte?.transportadora.nome || "FORNECEDOR NÃO DEFINIDO"}</p>
									</div>
									<div className="flex items-center gap-1">
										<FaPhone height={10} width={10} />
										<p className="text-[0.75rem] font-medium leading-none tracking-tight">{purchaseControl.transporte?.transportadora.contato || "N/A"}</p>
									</div>
									{purchaseControl.transporte.linkRastreio ? (
										<div className="flex items-center gap-1">
											<ExternalLink height={13} width={13} />
											<a href={purchaseControl.transporte.linkRastreio} className="text-[0.75rem] font-medium leading-none tracking-tight duration-300 ease-in-out hover:bg-blue-400">
												LINK DE RASTREIO
											</a>
										</div>
									) : null}
								</div>
								<h1 className="w-full rounded bg-blue-800 p-1 text-center text-sm font-bold tracking-tight text-white">ACUSAR ENTREGA</h1>
								<DateInput
									label="DATA DE ENTREGA"
									value={formatDate(infoHolder.deliveryDate)}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, deliveryDate: formatDateInputChange(value) as string }))}
									width="100%"
								/>

								<h1 className="text-center text-sm tracking-tight">ARQUIVOS</h1>
								<div className="flex w-full flex-col gap-2">
									<div className="relative flex w-full items-center justify-center">
										<label
											htmlFor="dropzone-file"
											className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-[#fff] hover:bg-primary/10 dark:bg-[#121212]"
										>
											<div className="flex flex-col items-center justify-center pb-6 pt-5 text-primary">
												<BsCloudUploadFill color={"rgb(31,41,55)"} size={50} />
												<p>Clique para escolher um ou mais arquivos ou os arraste para a àrea demarcada</p>
											</div>
											<input
												onChange={(e) => {
													if (e.target.files) {
														const files = Array.from(e.target.files);
														const attachments = files.map((file) => ({
															file: file,
															previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null,
															type: file.type,
														}));
														return setInfoHolder((prev) => ({ ...prev, files: [...prev.files, ...attachments] }));
													}
													return;
												}}
												multiple={true}
												id="dropzone-file"
												type="file"
												className="absolute h-full w-full opacity-0"
											/>
										</label>
									</div>
									<div className="flex w-full flex-wrap items-start justify-center gap-4">
										{infoHolder.files
											.filter((a) => !!a.file)
											.map((attachment, index) => (
												<div key={`${index}-${attachment.file.name}`} className="flex h-[180px] w-[150px] flex-col rounded border border-primary/50">
													<div className="relative flex h-[150px] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
														{attachment.previewUrl ? (
															<Image src={attachment.previewUrl} alt={attachment.file?.name || ""} fill={true} />
														) : (
															<h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">{getFileTypeTitle(attachment.type || "")}</h1>
														)}
													</div>
													<div className="h-[30px] rounded rounded-tl-none rounded-tr-none bg-primary p-2 text-center text-[0.55rem] font-bold text-primary-foreground">
														{formatLongString(attachment.file?.name || "", 15)}
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
							<div className="mt-2 flex w-full items-center justify-end">
								<LoadingButton loading={isPending} onClick={() => mutate()} type="button">
									RECONHECER ENTREGA
								</LoadingButton>
							</div>
						</>
					) : null}
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}
