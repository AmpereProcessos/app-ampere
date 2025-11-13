import type React from "react";
import { useContext, useState } from "react";
import { AiOutlinePercentage } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { BsBank2, BsCalendar2Week, BsFillPatchCheckFill, BsFolderPlus, BsShieldFillCheck, BsSpeedometer2 } from "react-icons/bs";
import { FaShoppingCart, FaSolarPanel, FaTasks, FaTools } from "react-icons/fa";
import { ImCheckboxChecked } from "react-icons/im";
import { MdAddShoppingCart, MdDesignServices, MdEngineering, MdOutlineBuildCircle, MdPeople } from "react-icons/md";
import { TbRecharging, TbTruckDelivery } from "react-icons/tb";

import type { TAuthSession } from "@/lib/authentication/types";
import { BadgeDollarSign, Database, Diamond, FolderTree, LayoutGrid, List, MessageCircle, ShoppingCart, Warehouse } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type TAppRouteGroup = {
	title: string;
	icon: React.ReactNode;
	items: {
		title: string;
		path: string;
		checkUserAccess: (session: TAuthSession) => boolean;
		icon: React.ReactNode;
	}[];
};
export const AppRoutes: TAppRouteGroup[] = [
	{
		title: "PRINCIPAL",
		icon: <Diamond className="h-4 min-h-4 w-4 min-w-4 text-primary/60" />,
		items: [
			{
				title: "Dashboard",
				path: "/",
				checkUserAccess: (session: TAuthSession) => true,
				icon: <LayoutGrid className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Projetos em Andamento",
				path: "/gestao-de-projetos/emAndamento",
				checkUserAccess: (session: TAuthSession) => true,
				icon: <TbRecharging className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Banco de Dados",
				path: "/gestao-de-projetos/banco-de-dados",
				checkUserAccess: (session: TAuthSession) => true,
				icon: <Database className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
		],
	},
	{
		title: "SETORES",
		icon: <FolderTree className="h-4 min-h-4 w-4 min-w-4 text-primary/60" />,
		items: [
			{
				title: "Comercial",
				path: "/comercial",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.comercial.visualizar,
				icon: <BadgeDollarSign className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Suprimentos",
				path: "/suprimentos",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.suprimentos.visualizar,
				icon: <ShoppingCart className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Projetos",
				path: "/projetos",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.engenharia.visualizar,
				icon: <MdEngineering className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Obras",
				path: "/obras",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.execucao.visualizar,
				icon: <FaTools className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "O&M",
				path: "/oem",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.suporte.visualizar,
				icon: <FaSolarPanel className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Pós-Venda",
				path: "/posvenda",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.posVenda.visualizar,
				icon: <BiSupport className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "RH",
				path: "/recursos-humanos",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.recursosHumanos.visualizar,
				icon: <MdPeople className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "ADM",
				path: "/adm",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.administrativo.visualizar,
				icon: <BsFolderPlus className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Almoxarifado",
				path: "/almoxarifado",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.almoxarifado.visualizar,
				icon: <Warehouse className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
		],
	},
	{
		title: "OUTROS",
		icon: <List className="h-4 min-h-4 w-4 min-w-4 text-primary/60" />,
		items: [
			{
				title: "Chats",
				path: "/chats",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.chats.visualizar,
				icon: <MessageCircle className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Chamados",
				path: "/chamados",
				checkUserAccess: (session: TAuthSession) => true,
				icon: <FaTasks className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Auditoria Financeira",
				path: "/admin/auditoria-financeira",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.administrativo.visualizar,
				icon: <BsBank2 className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Comissões",
				path: "/admin/comissao",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.administrativo.visualizar,
				icon: <AiOutlinePercentage className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Entregas",
				path: "/suprimentos/entregas",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.suprimentos.visualizar || session.user.permissoes.posVenda.visualizar,
				icon: <TbTruckDelivery className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Banco de OS",
				path: "/ordens-servico",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.ordensDeServico.visualizar || session.user.permissoes.execucao.visualizar,
				icon: <MdDesignServices className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},

			{
				title: "Seguro Fotovoltaico",
				path: "/seguro-fotovoltaico",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.posVenda.visualizar,
				icon: <BsShieldFillCheck className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Monitoramento",
				path: "/oem/monitoramento",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.suporte.visualizar,
				icon: <BsSpeedometer2 className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Gestão de Obras",
				path: "/obras/gestao-obras",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.execucao.visualizar || session.user.permissoes.ordensDeServico.visualizar,
				icon: <MdOutlineBuildCircle className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "Nutrição Pós-Venda",
				path: "/posvenda/nutricao",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.posVenda.visualizar,
				icon: <BsCalendar2Week className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
			{
				title: "NPS",
				path: "/posvenda/nps",
				checkUserAccess: (session: TAuthSession) => session.user.permissoes.posVenda.visualizar,
				icon: <BsFillPatchCheckFill className="h-4 min-h-4 w-4 min-w-4 text-[#15599a] dark:text-[#fead42]" />,
			},
		],
	},
];
type GeralSidebarProps = {
	session: TAuthSession;
};
function GeralSidebar({ session }: GeralSidebarProps) {
	return (
		<div className="flex flex-col gap-4">
			{AppRoutes.map((group) => (
				<div key={group.title} className="flex flex-col gap-2">
					<div className="flex items-center gap-1">
						{group.icon}
						<h2 className="text-primary/60 text-xs">{group.title}</h2>
					</div>
					{group.items
						.filter((item) => item.checkUserAccess(session))
						.map((item) => (
							<Button key={item.title} asChild variant="ghost">
								<Link href={item.path} className="w-full flex items-center justify-start gap-2 hover:bg-primary/10">
									{item.icon}
									<p className="text-primary/80 text-xs">{item.title}</p>
								</Link>
							</Button>
						))}
				</div>
			))}

			{/* <div className="mt-6">
				<h2 className="text-primary/60 text-xs">GESTÃO DE PROJETOS</h2>
				<Link href="/gestao-de-projetos/emAndamento">
					<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
						<TbRecharging className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />

						<p className="text-primary/80 pl-3 text-xs">Em andamento</p>
					</div>
				</Link>

				<Link href="/gestao-de-projetos/banco-de-dados">
					<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
						<FaDatabase className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />

						<p className="text-primary/80 pl-3 text-xs">Banco de dados</p>
					</div>
				</Link>
			</div>

			<>
				<div className="mt-6">
					<h2 className="text-primary/60 text-xs">SETORES</h2>
					{checkRoute("PPS") ? (
						<Link href="/comercial">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<SiCashapp className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Comercial</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Suprimentos") ? (
						<Link href="/suprimentos">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaShoppingCart className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Suprimentos</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRouteEitherAccess(["Projetos", "Pós-Venda"]) ? (
						<Link href="/projetos">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdEngineering className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Projetos</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Obras") ? (
						<Link href="/obras">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaTools className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Obras</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("O&M") ? (
						<Link href="/oem">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaSolarPanel className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">O&M</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Pós-Venda") ? (
						<Link href="/posvenda">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BiSupport className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Pós-Venda</p>
							</div>
						</Link>
					) : (
						false
					)}

					{session.user.permissoes.recursosHumanos.visualizar ? (
						<Link href="/adm/colaboradores">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdPeople className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">RH</p>
							</div>
						</Link>
					) : null}
					{checkRoute("ADM") ? (
						<Link href="/adm">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsFolderPlus className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">ADM</p>
							</div>
						</Link>
					) : null}
				</div>
				<div className="mt-6">
					<h2 className="text-primary/60 text-xs">OUTROS</h2>

					{session.user.permissoes.chats.visualizar ? (
						<Link href="/chats">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MessageCircle className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Chats</p>
							</div>
						</Link>
					) : null}
					{session.user.permissoes.suporte.visualizar || session.user.permissoes.posVenda.visualizar ? (
						<Link href={"/oem/comissionamento"}>
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<ImCheckboxChecked className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Comissionamento Pós-Obra</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.suporte.visualizar || session.user.permissoes.posVenda.visualizar ? (
						<Link href="/posvenda/nutricao">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsCalendar2Week className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Nutrição Pós-Venda</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.certificacoes.visualizar ? (
						<Link href="/certificacoes">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsFillPatchCheckFill className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Certificações</p>
							</div>
						</Link>
					) : null}
					<Link href="/calls">
						<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
							<FaTasks className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
							<p className="text-primary/80 pl-3 text-xs">Chamados</p>
						</div>
					</Link>
					{session.user.permissoes.administrativo.visualizar ? (
						<Link href="/admin/auditoria-financeira">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsBank2 className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Auditoria Financeira</p>
							</div>
						</Link>
					) : null}

					{session.user.permissoes.suprimentos.visualizar ? (
						<Link href="/suprimentos/solicitacoesCompra">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdAddShoppingCart className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Solicitações de Compra</p>
							</div>
						</Link>
					) : (
						false
					)}
					{(userIsManager || session.user.permissoes.administrativo.visualizar || session.user.permissoes.recursosHumanos.visualizar) && (
						<Link href="/admin/comissao">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<AiOutlinePercentage className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Comissões</p>
							</div>
						</Link>
					)}
					{session.user.permissoes.suprimentos.visualizar || session.user.permissoes.posVenda.visualizar ? (
						<Link href="/suprimentos/entregas">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<TbTruckDelivery className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Entregas</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.ordensDeServico.visualizar ? (
						<Link href={"/ordens-de-servico"}>
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdDesignServices className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Banco de OS</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.almoxarifado.visualizar ? (
						<Link href={"/almoxarifado"}>
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaWarehouse className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Almoxarifado</p>
							</div>
						</Link>
					) : (
						false
					)}

					{session.user.permissoes.posVenda.visualizar ? (
						<Link href="/seguro-fotovoltaico">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsShieldFillCheck className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Seguro Fotovoltaico</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.suporte.visualizar ? (
						<Link href="/oem/monitoramento">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsSpeedometer2 className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Monitoramento</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.execucao.visualizar || session.user.permissoes.ordensDeServico.visualizar ? (
						<Link href="/obras/gestao-obras">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdOutlineBuildCircle className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Gestão de Obras</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.posVenda.visualizar ? (
						<Link href="/posvenda/nps">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdSentimentSatisfiedAlt className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">NPS</p>
							</div>
						</Link>
					) : (
						false
					)}
				</div>
			</> */}
		</div>
	);
}

export default GeralSidebar;
