import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { useUnauthorizedRedirect } from "@/utils/hooks";
import { useMaterials } from "@/utils/methods/query/materials";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsCode } from "react-icons/bs";
import LoadingPage from "../../../components/utils/LoadingPage";
import { formatDecimalPlaces, formatToMoney } from "../../../utils/constants";
import Logo from "../../../utils/images/logo-semtexto-branco.png";

function RelatorioEstoque() {
	const { session, status } = useSession();
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	return <RelatorioEstoqueContent session={session} />;
}

export default RelatorioEstoque;

type RelatorioEstoqueContentProps = {
	session: TAuthSession;
};
function RelatorioEstoqueContent({ session }: RelatorioEstoqueContentProps) {
	const { data: materials, isLoading, isError, isSuccess } = useMaterials();

	return (
		<div className="flex w-full items-center justify-center">
			<div className="flex h-[29.7cm] w-[21cm] flex-col p-4 px-4">
				<div className="flex items-center justify-center gap-4 border border-[#15599a] bg-[#15599a] p-3">
					<Link href={"/almoxarifado/estoque"}>
						<div className="flex cursor-pointer items-center justify-end">
							<Image height={30} width={30} src={Logo} alt="Logo" />
						</div>
					</Link>
					<h1 className="text-center text-xl leading-none font-black tracking-tight text-white">RELATÓRIO DE ESTOQUE</h1>
				</div>
				<div className="flex w-full grow flex-col">
					<div className="flex items-center gap-2 border border-black bg-[#fead41] p-2">
						<h1 className="w-[10%] text-center text-sm font-bold text-white">INDEX</h1>
						<h1 className="w-[50%] text-center text-sm font-bold text-white">NOME</h1>
						<h1 className="w-[20%] text-center text-sm font-bold text-white">QTDE</h1>
						<h1 className="w-[20%] text-center text-sm font-bold text-white">PREÇO</h1>
					</div>
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg={"Erro ao buscar materiais."} /> : null}
					{isSuccess
						? materials.map((material, index) => (
								<div key={material._id} className="flex items-center gap-2 border-x border-b border-black p-2">
									<h1 className="w-[10%] text-center text-xs font-medium text-black">{index + 1}</h1>
									<div className="flex w-[50%] flex-col">
										<h1 className="w-full text-start text-xs font-medium text-black">{material.nome}</h1>
										<div className="flex w-full items-center gap-1">
											<BsCode />
											<h1 className="text-primary/60 text-[0.65rem] tracking-tight">{material.codigo || "CÓDIGO NÃO DEFINIDO"}</h1>
										</div>
									</div>
									<h1 className="w-[20%] text-center text-xs font-medium text-black">{formatDecimalPlaces(material.qtde)}</h1>
									<h1 className="w-[20%] text-center text-xs font-medium text-black">{formatToMoney(material.preco)}</h1>
								</div>
							))
						: null}
				</div>
			</div>
		</div>
	);
}
