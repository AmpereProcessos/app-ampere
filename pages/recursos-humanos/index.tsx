import { TAuthSession } from "@/lib/authentication/types";
import LoadingPage from "../../components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { useSession } from "@/components/providers/SessionProvider";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import ComissionsSVG from "@/utils/svgs/comissions.svg";
import EmployeesSVG from "@/utils/svgs/employees.svg";
import AssetsSVG from "@/utils/svgs/assets.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HumanResourcesPage() {
	const { session, status } = useSession();
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	const isAuthorized = session?.user.permissoes.recursosHumanos.visualizar;
	if (!isAuthorized) return <UnauthorizedComponent />;
	return <HumanResourcesContent session={session} />;
}

function HumanResourcesContent({ session }: { session: TAuthSession }) {
	return (
		<div className="flex w-full grow flex-col gap-6 p-6">
			<div className="border-primary/20 flex items-center gap-2 border-b pb-2">
				<p className="text-start text-2xl font-black text-[#15599a] uppercase">RECURSOS HUMANOS</p>
			</div>
			<div className="flex w-full flex-wrap items-center justify-around gap-2">
				<Link href="/admin/comissao" className="h-fit w-full md:h-[280px] md:w-[600px]">
					<Button variant={"outline"} size={"fit"} className="bg-card border-primary/30 flex h-full w-full flex-col gap-2 rounded-lg border p-6">
						<div className="relative mx-auto h-32 w-32">
							<Image src={ComissionsSVG} alt="Comissões" fill />
						</div>
						<h1 className="text-center text-lg font-black text-wrap text-[#15599a] uppercase md:text-2xl dark:text-[#fead41]">Comissões</h1>
						<p className="text-muted-foreground text-center text-sm tracking-tight text-wrap">Controle de comissões de vendas.</p>
					</Button>
				</Link>

				<Link href="/adm/colaboradores" className="h-fit w-full md:h-[280px] md:w-[600px]">
					<Button variant={"outline"} size={"fit"} className="bg-card border-primary/30 flex h-full w-full flex-col gap-2 rounded-lg border p-6">
						<div className="relative mx-auto h-32 w-32">
							<Image src={EmployeesSVG} alt="Colaboradores" fill />
						</div>
						<h1 className="text-center text-lg font-black text-wrap text-[#15599a] uppercase md:text-2xl dark:text-[#fead41]">Colaboradores</h1>
						<p className="text-muted-foreground text-center text-sm tracking-tight text-wrap">Controle de colaboradores.</p>
					</Button>
				</Link>

				<Link href="/adm/propriedades" className="h-fit w-full md:h-[280px] md:w-[600px]">
					<Button variant={"outline"} size={"fit"} className="bg-card border-primary/30 flex h-full w-full flex-col gap-2 rounded-lg border p-6">
						<div className="relative mx-auto h-32 w-32">
							<Image src={AssetsSVG} alt="Ativos" fill />
						</div>
						<h1 className="text-center text-lg font-black text-wrap text-[#15599a] uppercase md:text-2xl dark:text-[#fead41]">Propriedades</h1>
						<p className="text-muted-foreground text-center text-sm tracking-tight text-wrap">Controle de propriedades.</p>
					</Button>
				</Link>
			</div>
		</div>
	);
}
