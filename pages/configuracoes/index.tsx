import AllocatorsBlock from "@/components/identificador/configuracoes/AllocatorsBlock";
import CertificationsBlock from "@/components/identificador/configuracoes/CertificationsBlock";
import CompositionKitsBlock from "@/components/identificador/configuracoes/CompositionKitsBlock";
import ContractTemplatesBlock from "@/components/identificador/configuracoes/ContractTemplatesBlock";
import ContractTemplatesVariablesBlock from "@/components/identificador/configuracoes/ContractTemplatesVariablesBlock";
import EmployeesBlock from "@/components/identificador/configuracoes/EmployeesBlock";
import ProfileBlock from "@/components/identificador/configuracoes/ProfileBlock";
import UsersBlock from "@/components/identificador/configuracoes/UsersBlock";
import WhatsappConnectionBlock from "@/components/identificador/configuracoes/WhatsappConnectionBlock";
import WhatsappTemplatesBlock from "@/components/identificador/configuracoes/WhatsappTemplatesBlock";
import { useSession } from "@/components/providers/SessionProvider";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { useQueryState } from "@/lib/hooks/query-state";
import React from "react";

function ConfigurationsMainPage() {
	const { session, status } = useSession();
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	return <ConfigurationBlock session={session} />;
}

export default ConfigurationsMainPage;

type ConfigurationPageModes =
	| "profile"
	| "users"
	| "employees"
	| "allocators"
	| "certifications"
	| "composition-kits"
	| "contract-templates"
	| "contract-templates-variables"
	| "whatsapp-templates"
	| "whatsapp-connection";
type ConfigurationBlockProps = {
	session: TAuthSession;
};
function ConfigurationBlock({ session }: ConfigurationBlockProps) {
	const [mode, setMode] = useQueryState<ConfigurationPageModes>("mode", "profile");

	const userHasUsersViewPermission = session.user.permissoes.usuarios.visualizar;
	const userHasCompositionKitsViewPermission = session.user.permissoes.suprimentos.visualizar;
	const userHasContractTemplatesVariablesPermission =
		session.user.permissoes.administrativo.editar && session.user.permissoes.administrativo.visualizar;
	const userHasCertificationsPermission = session.user.permissoes.certificacoes.visualizar;
	const userHasWhatsappTemplatesPermission = session.user.permissoes.chats.enviarMensagens;
	return (
		<div className="flex grow flex-col gap-2 p-6">
			<div className="border-primary/20 flex w-full flex-col border-b px-6 pb-2">
				<h1 className="text-2xl font-black tracking-tight text-[#15599a]">CONFIGURAÇÕES</h1>
				<p className="text-muted-foreground">Gerencie configurações e preferências</p>
			</div>
			<div className="flex grow flex-col items-center gap-2 py-2 lg:flex-row">
				<div className="flex h-fit w-full flex-col gap-1 px-2 py-2 lg:h-full lg:w-1/5">
					<button
						type="button"
						onClick={() => setMode("profile")}
						className={`${
							mode === "profile" ? "bg-secondary" : ""
						} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
					>
						Perfil
					</button>
					{userHasUsersViewPermission && (
						<button
							type="button"
							onClick={() => setMode("users")}
							className={`${
								mode === "users" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Usuários
						</button>
					)}
					{userHasUsersViewPermission && (
						<button
							type="button"
							onClick={() => setMode("employees")}
							className={`${
								mode === "employees" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Colaboradores
						</button>
					)}

					{userHasCertificationsPermission && (
						<button
							type="button"
							onClick={() => setMode("certifications")}
							className={`${
								mode === "certifications" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Certificações
						</button>
					)}
					{userHasContractTemplatesVariablesPermission && (
						<button
							type="button"
							onClick={() => setMode("contract-templates")}
							className={`${
								mode === "contract-templates" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Templates de Contrato
						</button>
					)}
					{userHasContractTemplatesVariablesPermission && (
						<button
							type="button"
							onClick={() => setMode("contract-templates-variables")}
							className={`${
								mode === "contract-templates-variables" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Variáveis de Template de Contrato
						</button>
					)}
					<button
						type="button"
						onClick={() => setMode("allocators")}
						className={`${
							mode === "allocators" ? "bg-secondary" : ""
						} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
					>
						Alocadores de Ativos
					</button>
					{userHasCompositionKitsViewPermission && (
						<button
							type="button"
							onClick={() => setMode("composition-kits")}
							className={`${
								mode === "composition-kits" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Kits de Composição
						</button>
					)}
					{userHasWhatsappTemplatesPermission && (
						<button
							type="button"
							onClick={() => setMode("whatsapp-templates")}
							className={`${
								mode === "whatsapp-templates" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Templates WhatsApp
						</button>
					)}
					{userHasWhatsappTemplatesPermission && (
						<button
							type="button"
							onClick={() => setMode("whatsapp-connection")}
							className={`${
								mode === "whatsapp-connection" ? "bg-secondary" : ""
							} text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
						>
							Conexão WhatsApp
						</button>
					)}
				</div>
				<div className="flex h-full w-full flex-col gap-1 px-2 py-2 lg:w-4/5">
					{mode === "profile" ? <ProfileBlock session={session} /> : null}
					{mode === "allocators" ? <AllocatorsBlock session={session} /> : null}
					{mode === "users" ? <UsersBlock session={session} /> : null}
					{mode === "employees" ? <EmployeesBlock session={session} /> : null}
					{mode === "certifications" ? <CertificationsBlock session={session} /> : null}
					{mode === "contract-templates" ? <ContractTemplatesBlock session={session} /> : null}
					{mode === "contract-templates-variables" ? <ContractTemplatesVariablesBlock session={session} /> : null}
					{mode === "composition-kits" ? <CompositionKitsBlock session={session} /> : null}
					{mode === "whatsapp-templates" ? <WhatsappTemplatesBlock session={session} /> : null}
					{mode === "whatsapp-connection" ? <WhatsappConnectionBlock session={session} /> : null}
				</div>
			</div>
		</div>
	);
}
