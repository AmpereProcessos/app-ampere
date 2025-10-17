import WhatsAppConnectButton from "@/components/meta/WhatsappConnectButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import type { TGetWhatsappIntegrationOutput } from "@/pages/api/integracao/whatsapp/connect";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import disconnectWhatsappIntegration from "@/utils/methods/mutation/integrations";
import { useWhatsappIntegration } from "@/utils/methods/query/integrations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Calendar, Code, Key, Phone } from "lucide-react";
import toast from "react-hot-toast";

type WhatsappConnectionBlockProps = {
	session: TAuthSession;
};
export default function WhatsappConnectionBlock({ session }: WhatsappConnectionBlockProps) {
	const queryClient = useQueryClient();
	const { data: whatsappIntegration, queryKey, isLoading, isError, isSuccess, error } = useWhatsappIntegration();

	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey: queryKey });
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};

	const handleOnDisconnectMutate = async () => {
		await queryClient.cancelQueries({ queryKey: queryKey });
	};
	const handleOnDisconnectSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};
	return (
		<div className="flex h-full grow flex-col">
			<div className="border-primary/20 flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
				<div className="flex flex-col">
					<h1 className="text-lg font-bold">Conexão WhatsApp</h1>
					<p className="text-sm text-primary/60">Gerencie a conexão do WhatsApp Business</p>
				</div>
			</div>
			{isLoading ? <h3 className="text-sm text-primary/60 animate-pulse py-4">Carregando conexão...</h3> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				whatsappIntegration ? (
					<WhatsappConnectionBlockConnected
						whatsappIntegration={whatsappIntegration}
						onDisconnectMutate={handleOnDisconnectMutate}
						onDisconnectSettled={handleOnDisconnectSettled}
					/>
				) : (
					<div className="flex w-full flex-col gap-2 py-2">
						<p className="text-sm text-primary/60">Oops, parece que você não está conectado ao WhatsApp Business.</p>
						<WhatsAppConnectButton />
					</div>
				)
			) : null}
		</div>
	);
}

type WhatsappConnectionBlockConnectedProps = {
	whatsappIntegration: Exclude<TGetWhatsappIntegrationOutput["data"], null>;
	onDisconnectMutate: () => void;
	onDisconnectSettled: () => void;
};
function WhatsappConnectionBlockConnected({ whatsappIntegration, onDisconnectMutate, onDisconnectSettled }: WhatsappConnectionBlockConnectedProps) {
	const PERMISSION_LABELS_MAP = {
		email: "Email",
		public_profile: "Perfil Público",
		whatsapp_business_management: "Gerenciamento de WhatsApp Business",
		whatsapp_business_messaging: "Mensagens de WhatsApp Business",
	};

	const { mutate: disconnectWhatsappIntegrationMutation, isPending: isDisconnectingWhatsappIntegration } = useMutation({
		mutationFn: disconnectWhatsappIntegration,
		onMutate: () => {
			onDisconnectMutate();
		},
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
		onSettled: async () => {
			onDisconnectSettled();
		},
	});
	return (
		<div className="flex w-full flex-col gap-2 py-2">
			<div className="w-full flex items-center justify-between gap-2 flex-col lg:flex-row">
				<Badge className="flex items-center gap-1 bg-green-200 text-green-800">
					<BadgeCheck className="w-4 h-4 min-w-4 min-h-4" />
					<h1 className="text-sm font-bold">Você está conectado ao WhatsApp Business</h1>
				</Badge>
				<LoadingButton
					variant={"ghost"}
					size={"sm"}
					className="w-fit hover:bg-destructive/10 hover:text-destructive"
					loading={isDisconnectingWhatsappIntegration}
					onClick={() => disconnectWhatsappIntegrationMutation()}
				>
					DESCONECTAR
				</LoadingButton>
			</div>

			<div className="w-full flex flex-col gap-1.5">
				<p className="text-sm text-primary/80">Detalhes da sua Conexão:</p>
				<div className="w-full flex flex-col gap-3">
					<div className="flex items-start lg:items-center gap-x-2 gap-y-1 flex-col lg:flex-row">
						<div className="flex items-center gap-2">
							<Code className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm text-primary/80">ID da conta do WhatsApp Business:</p>
						</div>
						<p className="text-sm font-bold">{whatsappIntegration.dados.metaAutorId}</p>
					</div>
					<div className="flex items-start lg:items-center gap-x-2 gap-y-1 flex-col lg:flex-row">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm text-primary/80">Data de expiração do token:</p>
						</div>
						<p className="text-sm font-bold">{formatDateAsLocale(whatsappIntegration.dados.dataExpiracao, true) || "N/A"}</p>
					</div>
					<div className="flex items-start lg:items-center gap-x-2 gap-y-1 flex-col lg:flex-row">
						<div className="flex items-center gap-2">
							<Key className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm text-primary/80">Permissões que você concedeu:</p>
						</div>

						<div className="flex items-center gap-2 flex-wrap">
							{whatsappIntegration.dados.metaEscopo.map((scope) => (
								<Badge key={scope} className="text-xs text-primary/80 bg-primary/10 rounded-md px-2 py-1">
									{PERMISSION_LABELS_MAP[scope as keyof typeof PERMISSION_LABELS_MAP]}
								</Badge>
							))}
						</div>
					</div>
					<div className="flex items-start lg:items-center gap-x-2 gap-y-1 flex-col lg:flex-row">
						<div className="flex items-center gap-2">
							<Phone className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm text-primary/80">Telefones conectados:</p>
						</div>
						<div className="flex items-center gap-2 flex-wrap">
							{whatsappIntegration.dados.telefones.map((telefone) => (
								<Badge key={telefone.numero} className="text-xs text-primary/80 bg-primary/10 rounded-md px-2 py-1">
									{telefone.nome}: <strong>{telefone.numero}</strong>
								</Badge>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
