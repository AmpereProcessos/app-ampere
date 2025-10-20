import ChatsHubTesting from "@/components/identificador/chats/ChatsHubTesting";
import WhatsAppConnectButton from "@/components/meta/WhatsappConnectButton";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/convex/utils";
import type { TAuthSession } from "@/lib/authentication/types";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import { BadgeCheck, Calendar, Code, Key, Phone } from "lucide-react";

export default function ChatsTesting() {
	const META_TESTING_SESSION: TAuthSession = {
		session: {
			sessaoId: "123",
			usuarioId: "123",
			dataExpiracao: dayjs().add(1, "month").toISOString(),
		},
		user: {
			id: "68f629694ceea6519925696a",
			nome: "USUÁRIO TESTE - META",
			email: "testing@meta.com",
			avatar_url:
				"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2F(USU%C3%81RIO%20TESTE%20-%20META)%20usuario-teste---meta-avatar%20-%202025-10-20T12%3A22%3A04.809Z?alt=media&token=43951f13-60fc-41b6-9535-495e18f940c8",
			telefone: "",
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
					restringirProjetos: false,
				},
				ordensDeServico: {
					visualizar: false,
					editar: false,
					criar: false,
				},
				chats: {
					visualizar: true,
					enviarMensagens: true,
				},
				certificacoes: {
					visualizar: false,
					editar: false,
					criar: false,
				},
			},
			visualizacao: {
				tipo: "OPERACIONAL",
			},
		},
	};

	const { data: whatsappConnection, isPending, isError, isSuccess } = useConvexQuery(api.queries.connections.getWhatsappConnection);

	return (
		<div className="flex flex-col gap-6 grow p-6">
			<div className="border-primary/20 flex items-center justify-between border-b p-1">
				<h1 className="text-start text-2xl font-black text-[#15599a] uppercase">Chats</h1>
			</div>
			{isPending ? <h3 className="text-sm text-primary/60 animate-pulse py-4">Carregando conexão...</h3> : null}
			{isError ? <ErrorComponent msg="Erro ao carregar conexão do WhatsApp Business." /> : null}
			{isSuccess ? (
				whatsappConnection ? (
					<>
						<WhatsappConnectionBlockConnected whatsappConnection={whatsappConnection} />

						<ChatsHubTesting session={META_TESTING_SESSION} userHasMessageSendingPermission={true} whatsappConnection={whatsappConnection} />
					</>
				) : (
					<WhatsappConnectionBlockDisconnected />
				)
			) : null}
		</div>
	);
}

type WhatsappConnectionBlockConnectedProps = {
	whatsappConnection: Exclude<typeof api.queries.connections.getWhatsappConnection._returnType, null>;
};
function WhatsappConnectionBlockConnected({ whatsappConnection }: WhatsappConnectionBlockConnectedProps) {
	const PERMISSION_LABELS_MAP = {
		email: "Email",
		public_profile: "Perfil Público",
		whatsapp_business_management: "Gerenciamento de WhatsApp Business",
		whatsapp_business_messaging: "Mensagens de WhatsApp Business",
	};

	const disconnectWhatsappConnectionMutation = useMutation(api.mutations.connections.disconnectWhatsappConnection);
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
					loading={false}
					onClick={() => disconnectWhatsappConnectionMutation({ whatsappConnectionId: whatsappConnection._id })}
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
						<p className="text-sm font-bold">{whatsappConnection.metaAutorAppId}</p>
					</div>
					<div className="flex items-start lg:items-center gap-x-2 gap-y-1 flex-col lg:flex-row">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm text-primary/80">Data de expiração do token:</p>
						</div>
						<p className="text-sm font-bold">{formatDateAsLocale(new Date(whatsappConnection.dataExpiracao), true) || "N/A"}</p>
					</div>
					<div className="flex items-start lg:items-center gap-x-2 gap-y-1 flex-col lg:flex-row">
						<div className="flex items-center gap-2">
							<Key className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-sm text-primary/80">Permissões que você concedeu:</p>
						</div>

						<div className="flex items-center gap-2 flex-wrap">
							{whatsappConnection.metaEscopo.map((scope) => (
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
							{whatsappConnection.telefones.map((telefone) => (
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

function WhatsappConnectionBlockDisconnected() {
	return (
		<div className="flex w-full flex-col gap-2 py-2">
			<p className="text-sm text-primary/60">Oops, parece que você não está conectado ao WhatsApp Business.</p>
			<WhatsAppConnectButton />
		</div>
	);
}
