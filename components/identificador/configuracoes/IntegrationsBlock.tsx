import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn, copyToClipboard } from "@/lib/utils";
import ContaAzulLogo from "@/utils/images/conta-azul-logo.jpeg";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { refreshContaAzulV2Integration } from "@/utils/methods/mutation/integrations";
import { useContaAzulV2Integration } from "@/utils/methods/query/integrations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { BsCalendarEvent } from "react-icons/bs";
type IntegrationsBlockProps = {
	session: TAuthSession;
};

function IntegrationsBlock({ session }: IntegrationsBlockProps) {
	return (
		<div className="flex h-full grow flex-col gap-3">
			<div className="border-primary/20 flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
				<div className="flex flex-col">
					<h1 className="text-lg font-bold">Integrações</h1>
					<p className="text-sm text-primary/60">Gerencie as integrações da plataforma</p>
				</div>
			</div>
			<div className="flex w-full flex-col gap-3">
				<ContaAzulIntegration />
			</div>
		</div>
	);
}

export default IntegrationsBlock;

function ContaAzulIntegration() {
	const queryClient = useQueryClient();
	const { data: contaAzulV2Integration, queryKey, isLoading, isSuccess, isError, error } = useContaAzulV2Integration();

	const { mutate: refreshContaAzulV2IntegrationMutation, isPending } = useMutation({
		mutationKey: ["refresh-conta-azul-v2-integration"],
		mutationFn: refreshContaAzulV2Integration,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queryKey });
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKey });
		},
	});
	return (
		<div className={"bg-card border-primary/20 flex w-full flex-col gap-1 rounded-xl border px-3 py-4 shadow-xs"}>
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar className="w-6 h-6 min-w-6 min-h-6">
						<AvatarImage src={ContaAzulLogo.src} />
						<AvatarFallback>CA</AvatarFallback>
					</Avatar>
					<p className="text-sm font-bold">INTEGRAÇÃO CONTA AZUL V2</p>
				</div>
				{isSuccess ? (
					<div
						className={cn("px-2 py-0.5 rounded-lg text-[0.65rem] font-bold", {
							"bg-blue-500 text-white": !!contaAzulV2Integration,
							"bg-primary/20 text-primary": !contaAzulV2Integration,
						})}
					>
						{contaAzulV2Integration ? "INTEGRAÇÃO ATIVA" : "INTEGRAÇÃO INATIVA"}
					</div>
				) : null}
			</div>
			{isSuccess ? (
				contaAzulV2Integration ? (
					<div className="w-full flex flex-col items-center justify-center p-3 gap-1">
						<div className="w-full flex items-center justify-between gap-2">
							<p className="text-xs text-start">TOKEN DE ACESSO:</p>
							<div className="flex items-center gap-1">
								<BsCalendarEvent className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-xs text-start">DATA DE EXPIRAÇÃO: {formatDateAsLocale(contaAzulV2Integration.dados.dataExpiracao, true)}</p>
							</div>
						</div>
						<div className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 break-all text-[0.65rem]">
							{contaAzulV2Integration.dados.tokenAcesso}
							<div className="h-full flex items-center justify-center">
								<Button
									disabled={isPending}
									size={"fit"}
									variant={"ghost"}
									className="p-3 rounded-full"
									onClick={() => refreshContaAzulV2IntegrationMutation()}
								>
									<Loader2 className="w-4 h-4 min-w-4 min-h-4" />
								</Button>
								<Button size={"fit"} variant={"ghost"} className="p-3 rounded-full" onClick={() => copyToClipboard(contaAzulV2Integration.dados.tokenAcesso)}>
									<CopyIcon className="w-4 h-4 min-w-4 min-h-4" />
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div className="w-full flex items-center justify-center gap-3 px-4 py-2">
						<Button size={"fit"} variant={"ghost"} className="p-3" asChild>
							<Link href={"/api/integracao/conta-azul-v2/authorize"} prefetch={false}>
								CONECTAR INTEGRAÇÃO
							</Link>
						</Button>
					</div>
				)
			) : null}
			{isLoading && <LoadingComponent />}
			{isError && <ErrorComponent msg={getErrorMessage(error)} />}
		</div>
	);
}
