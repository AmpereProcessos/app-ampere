import ErrorPage from "@/components/utils/ErrorPage";
import LoadingPage from "@/components/utils/LoadingPage";
import type { TGetTemporaryUsageByPropertyOutput } from "@/pages/api/propriedades/uso-temporario/propriedade";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useOpenPropertyTemporaryUsageByPropertyId } from "@/utils/methods/query/properties";
import type { TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Logo from "../../../utils/images/logo-sem-texto.png";
import { useEmployees, useUsers } from "@/utils/methods/query/users";
import TextInput from "@/components/inputs/Text";
import { formatNameAsInitials, formatToCPForCNPJ } from "@/utils/methods/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { SlideMotionVariants } from "@/utils/constants";
import NumberInput from "@/components/inputs/Number";
function PublicPropertyTemporaryUsagePage() {
	const router = useRouter();
	const { id } = router.query;
	if (!id || typeof id !== "string") return <ErrorPage msg="ID da propriedade não informado." />;

	return <PublicPropertyTemporaryUsagePageContent id={id as string} />;
}

export default PublicPropertyTemporaryUsagePage;

type PublicPropertyTemporaryUsagePageContentProps = {
	id: string;
};
function PublicPropertyTemporaryUsagePageContent({ id }: PublicPropertyTemporaryUsagePageContentProps) {
	const { data: openUsage, isLoading, isSuccess, isError, error } = useOpenPropertyTemporaryUsageByPropertyId({ id });

	if (isLoading) return <LoadingPage />;
	if (isError) return <ErrorPage msg={getErrorMessage(error)} />;

	if (isSuccess) return <PublicPropertyTemporaryUsagePageContentForm openUsage={openUsage} />;

	return <></>;
}

function PublicPropertyTemporaryUsagePageContentForm({ openUsage }: { openUsage: TGetTemporaryUsageByPropertyOutput["data"] }) {
	const [infoHolder, setInfoHolder] = useState<TPropertyTemporaryUsage>({
		propriedade: {
			nome: openUsage.property.nome,
			id: openUsage.property._id,
			identificador: openUsage.property.identificador,
		},
		metadados: {
			tipo: "USO DE VEÍCULO",
			kmInicial: openUsage.openUsage?.metadados.kmInicial ?? openUsage.property.metadados.kmAcumulado,
		},
		responsaveis: [],
		arquivos: [],
		autor: {
			id: "",
			nome: "",
		},
		dataInsercao: new Date().toISOString(),
	});

	function updateInfoHolder(info: Partial<TPropertyTemporaryUsage>) {
		setInfoHolder((prev) => ({
			...prev,
			...info,
		}));
	}
	return (
		<div className="flex h-full justify-center px-6 lg:py-12 py-6 bg-background">
			<div className="flex flex-col gap-4 container">
				<div className="bg-background w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg bg-[#fff] dark:bg-[#121212]">
					<div className="w-full flex items-center justify-center gap-2">
						<Image src={Logo} alt="Logo" width={35} height={35} />
						<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight text-center">FORMULÁRIO DE UTILIZAÇÃO DE PROPRIEDADE</h1>
					</div>
					<h3 className="text-xs lg:text-base font-medium leading-none tracking-tight text-center">{openUsage.property.nome}</h3>
				</div>
				<div className="bg-background w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg bg-[#fff] dark:bg-[#121212]">
					<UserSelection updateInfoHolder={updateInfoHolder} />
					{openUsage.openUsage ? (
						<div className="w-full flex flex-col gap-2">
							<NumberInput
								label="KM FINAL"
								placeholder="Preencha a kilometragem final..."
								value={infoHolder.metadados.kmFinal ?? null}
								handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmFinal: value } })}
								width="100%"
							/>
						</div>
					) : (
						<div className="w-full flex flex-col gap-2">
							<NumberInput
								label="KM INICIAL"
								placeholder="Preencha a kilometragem inicial..."
								value={infoHolder.metadados.kmInicial ?? null}
								handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmInicial: value } })}
								width="100%"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

type UserSelectionProps = {
	updateInfoHolder: (info: Partial<TPropertyTemporaryUsage>) => void;
};
function UserSelection({ updateInfoHolder }: UserSelectionProps) {
	const { data: employees, isLoading, isSuccess, isError, error } = useEmployees({ active: true });

	const [cpfHolder, setCpfHolder] = useState<string>("");

	console.log({
		employees,
	});

	const matchingUser = employees?.find((employee) => cpfHolder && employee.cpf === cpfHolder);
	return (
		<div className="w-full flex flex-col gap-2">
			<TextInput label="CPF" placeholder="Preencha o seu CPF..." value={cpfHolder} handleChange={(value) => setCpfHolder(formatToCPForCNPJ(value))} width="100%" />
			{matchingUser ? (
				<motion.div key={"user-open"} variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center gap-2">
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8 min-h-8 min-w-8">
							<AvatarImage src={matchingUser.avatar_url ?? undefined} />
							<AvatarFallback>{formatNameAsInitials(matchingUser.nome)}</AvatarFallback>
						</Avatar>
						<h1 className="text-sm font-medium leading-none tracking-tight text-center">{matchingUser.nome}</h1>
					</div>
					<div className="w-full flex items-center justify-center gap-2">
						<div className="flex min-w-fit items-center gap-1">
							<Mail className="w-3 h-3 min-w-3 min-h-3" />
							<p className={"text-xs font-medium text-primary/80"}>{matchingUser.email}</p>
						</div>
						<div className="flex min-w-fit items-center gap-1">
							<Phone className="w-3 h-3 min-w-3 min-h-3" />
							<p className={"text-xs font-medium text-primary/80"}>{matchingUser.telefone}</p>
						</div>
					</div>
				</motion.div>
			) : null}
		</div>
	);
}
