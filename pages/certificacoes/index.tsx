import ControlCertification from "@/components/identificador/certificacoes/ControlCertification";
import NewCertification from "@/components/identificador/certificacoes/NewCertification";
import TextInput from "@/components/inputs/Text";
import { useSession } from "@/components/providers/SessionProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { SlideMotionVariants } from "@/utils/constants";
import { handleDownload } from "@/utils/methods/firebase";
import { formatDateAsLocale, formatNameAsInitials, formatTimeDurationUnit } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useCertifications } from "@/utils/methods/query/certifications";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Hourglass, Lock, Pencil } from "lucide-react";
import { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import type { TGetCertificationsInput, TGetCertificationsOutputDefault } from "../api/certificacoes";

export default function Certifications() {
	const { session, status } = useSession();
	const isAuthorized = session?.user.permissoes.certificacoes.visualizar;
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <CertificationsContent session={session} />;
}

function CertificationsContent({ session }: { session: TAuthSession }) {
	const queryClient = useQueryClient();
	const [newCertificationMenuIsOpen, setNewCertificationMenuIsOpen] = useState(false);
	const [editCertificationId, setEditCertificationId] = useState<string | null>(null);
	const [filtersMenuIsOpen, setFiltersMenuIsOpen] = useState(false);

	const { data: certifications, queryKey, isLoading, isError, isSuccess, error, filters, updateFilters } = useCertifications({});

	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey: queryKey });
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};
	const userHasToCreateCertificationsPermission = !!session.user.permissoes.certificacoes.criar;
	const userHasToEditCertificationsPermission = !!session.user.permissoes.certificacoes.editar;
	return (
		<div className="flex flex-col gap-3 grow p-6">
			<div className="border-primary/20 flex flex-col justify-between border-b p-1 pb-2 gap-2">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black text-[#15599a] uppercase">Projetos no estágio de suprimentos</p>
					</div>
					<div className="flex items-center gap-2">
						{userHasToCreateCertificationsPermission ? (
							<Button onClick={() => setNewCertificationMenuIsOpen(true)} type="button">
								NOVA CERTIFICAÇÃO
							</Button>
						) : null}
						{filtersMenuIsOpen ? (
							<div className="text-primary/80 cursor-pointer hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFiltersMenuIsOpen(false)} />
							</div>
						) : (
							<div className="text-primary/80 cursor-pointer hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFiltersMenuIsOpen(true)} />
							</div>
						)}
					</div>
				</div>
			</div>
			<AnimatePresence>{filtersMenuIsOpen ? <CertificationsBlockFiltersMenu filters={filters} updateFilters={updateFilters} /> : null}</AnimatePresence>
			{isLoading ? <h3 className="text-sm text-center my-4 text-primary/60 animate-pulse">Carregando certificações...</h3> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				<div className="flex w-full flex-col gap-2 py-2">
					{certifications.length > 0 ? (
						certifications.map((certification) => (
							<CertificationBlockCard
								key={certification._id}
								certification={certification}
								handleEditClick={() => setEditCertificationId(certification._id)}
								userHasEditCertificationsPermission={userHasToEditCertificationsPermission}
							/>
						))
					) : (
						<div className="text-primary/80 w-full text-center font-medium italic">Nenhuma certificação encontrada.</div>
					)}
				</div>
			) : null}
			{newCertificationMenuIsOpen ? (
				<NewCertification
					session={session}
					closeModal={() => setNewCertificationMenuIsOpen(false)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
			{editCertificationId ? (
				<ControlCertification
					certificationId={editCertificationId}
					session={session}
					closeModal={() => setEditCertificationId(null)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
		</div>
	);
}

type CertificationsBlockFiltersMenuProps = {
	filters: Pick<TGetCertificationsInput, "search">;
	updateFilters: (filters: Partial<Pick<TGetCertificationsInput, "search">>) => void;
};

function CertificationsBlockFiltersMenu({ filters, updateFilters }: CertificationsBlockFiltersMenuProps) {
	return (
		<motion.div variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="flex w-full flex-col gap-2">
			<TextInput
				label="PESQUISA"
				labelClassName="text-[0.6rem]"
				holderClassName="text-xs p-2 min-h-[34px]"
				placeholder="Pesquise pelo nome do usuário..."
				value={filters.search ?? ""}
				handleChange={(value) => updateFilters({ search: value })}
				width="100%"
			/>
		</motion.div>
	);
}

type CertificationBlockCardProps = {
	certification: TGetCertificationsOutputDefault[number];
	handleEditClick: (id: string) => void;
	userHasEditCertificationsPermission: boolean;
};

function CertificationBlockCard({ certification, handleEditClick, userHasEditCertificationsPermission }: CertificationBlockCardProps) {
	return (
		<div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs sm:flex-row dark:bg-[#121212]">
			<div className="flex items-center justify-center">
				<div className="relative h-20 max-h-20 min-h-20 w-20 max-w-20 min-w-20 overflow-hidden rounded-lg">
					<div className="bg-primary/50 text-primary-foreground flex h-full w-full items-center justify-center">
						<Lock className="h-6 w-6" />
					</div>
				</div>
			</div>
			<div className="flex h-full grow flex-col gap-1">
				<div className="flex w-full flex-col">
					<div className="w-full flex items-center justify-between gap-2">
						<p className="text-sm leading-none font-bold tracking-tight">{certification.titulo}</p>

						{certification.referencias.length > 0 ? (
							<HoverCard>
								<HoverCardTrigger asChild>
									<Button variant={"ghost"} size={"fit"} className="text-xs">
										{certification.referencias.length} DOCUMENTOS
									</Button>
								</HoverCardTrigger>
								<HoverCardContent className="w-80">
									<h1 className="text-[0.65rem] font-medium">DOCUMENTOS</h1>
									<div className="flex flex-col gap-3">
										{certification.referencias.map((usage) => (
											<div key={usage._id} className="bg-primary/10 flex w-full flex-col gap-1 rounded-lg p-2">
												<div className="flex w-full items-center gap-2">
													<Badge className="rounded-full text-[0.65rem] w-fit">{usage.documento.formato}</Badge>
													<p className="text-xs font-medium tracking-tight">{usage.documento.titulo}</p>
												</div>
												<div className="flex items-center gap-2">
													<p className="text-xs font-medium tracking-tight text-primary/80">DATA INÍCIO</p>
													<p className="text-xs font-bold tracking-tight">{formatDateAsLocale(usage.dataInicio) || "N/A"}</p>
												</div>
												<div className="flex items-center gap-2">
													<p className="text-xs font-medium tracking-tight text-primary/80">DATA FIM</p>
													<p className="text-xs font-bold tracking-tight">{formatDateAsLocale(usage.dataFim) || "N/A"}</p>
												</div>
												<p className="text-xs font-medium tracking-tight text-primary/80">NOTIFICADOS</p>
												<div className="flex items-center gap-2">
													{usage.notificados.length > 0 ? (
														usage.notificados.map((user) => (
															<div key={user.id} className="flex items-center gap-1">
																<Avatar className="w-4 h-4 min-w-4 min-h-4">
																	<AvatarImage src={user.avatar_url ?? undefined} />
																	<AvatarFallback>{formatNameAsInitials(user.nome ?? "")}</AvatarFallback>
																</Avatar>
																<p className="text-xs font-bold tracking-tight">{user.nome}</p>
															</div>
														))
													) : (
														<p className="text-xs font-bold tracking-tight">NENHUM USUÁRIO NOTIFICADO</p>
													)}
												</div>
												<Button
													size={"fit"}
													variant={"ghost"}
													className="w-fit flex items-center gap-1 px-2 py-1 bg-blue-600 text-white hover:text-white hover:bg-blue-500 self-center"
													onClick={() =>
														handleDownload({
															fileName: usage.documento.titulo,
															fileUrl: usage.documento.url,
														})
													}
												>
													<DownloadIcon className="w-4 h-4 min-w-4 min-h-4" />
													<p className="text-xs font-bold tracking-tight">DOWNLOAD</p>
												</Button>
											</div>
										))}
									</div>
								</HoverCardContent>
							</HoverCard>
						) : (
							<div />
						)}
					</div>
					<p className="text-sm leading-none font-bold tracking-tight">{certification.descricao}</p>
				</div>
				<div className="w-full flex flex-col gap-2 grow">
					<div className="w-full flex items-center gap-3 flex-wrap">
						<div className="flex items-center gap-1">
							<Hourglass className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium text-primary/80">
								{formatTimeDurationUnit({ value: certification.validade.valor, unit: certification.validade.medida, upperCase: true }) || "N/A"}
							</p>
						</div>
					</div>
				</div>
				<div className="flex w-full items-center justify-between gap-1">
					<div className="flex items-center gap-1">
						<BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/60 text-xs font-medium">{formatDateAsLocale(certification.dataInsercao, true) || "N/A"}</p>
					</div>
					{userHasEditCertificationsPermission ? (
						<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"} onClick={() => handleEditClick(certification._id)}>
							<Pencil className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-primary/80 text-sm font-semibold">EDITAR</p>
						</Button>
					) : null}
				</div>
			</div>
		</div>
	);
}
