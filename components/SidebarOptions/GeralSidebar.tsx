import React, { useContext, useState } from "react";
import { AiOutlineForm, AiOutlinePercentage } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { BsBank2, BsCalendar2Week, BsFillPatchCheckFill, BsFolderPlus, BsShieldFillCheck, BsSpeedometer2 } from "react-icons/bs";
import { FaBox, FaDatabase, FaShoppingCart, FaSolarPanel, FaTasks, FaTools, FaWarehouse } from "react-icons/fa";
import { ImCheckboxChecked, ImFolderOpen } from "react-icons/im";
import { IoIosCalendar } from "react-icons/io";
import {
	MdAddIcCall,
	MdAddShoppingCart,
	MdDesignServices,
	MdEngineering,
	MdOutlineBuildCircle,
	MdOutlinePayments,
	MdPeople,
	MdSentimentSatisfiedAlt,
} from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { SiCashapp } from "react-icons/si";
import { TbDashboard, TbRecharging } from "react-icons/tb";
import { TbReportAnalytics, TbTruckDelivery } from "react-icons/tb";
import { VscWorkspaceTrusted } from "react-icons/vsc";

import type { TAuthSession } from "@/lib/authentication/types";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

type GeralSidebarProps = {
	session: TAuthSession;
	userAccessibleRoutes: string[];
	userIsManager: boolean;
	userIsController: boolean;
};
function GeralSidebar({ session, userAccessibleRoutes, userIsManager, userIsController }: GeralSidebarProps) {
	function checkRoute(route: string) {
		return userAccessibleRoutes?.includes(route);
	}
	function checkRouteEitherAccess(routes: string[]) {
		return routes.some((route) => userAccessibleRoutes?.includes(route));
	}

	return (
		<>
			<div>
				<h2 className="text-primary/60 text-xs">PRINCIPAL</h2>
				<Link href="/">
					<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
						<RiDashboardFill className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
						<p className="text-primary/80 pl-3 text-xs">Dashboard</p>
					</div>
				</Link>
			</div>
			<div className="mt-6">
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
					{checkRouteEitherAccess(["O&M", "Pós-Venda"]) ? (
						<Link href={"/oem/comissionamento"}>
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<ImCheckboxChecked className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Comissionamento Pós-Obra</p>
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
					{checkRouteEitherAccess(["O&M", "Pós-Venda"]) ? (
						<Link href="/posvenda/nutricao">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsCalendar2Week className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Nutrição Pós-Venda</p>
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
					<Link href="/calls">
						<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
							<FaTasks className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
							<p className="text-primary/80 pl-3 text-xs">Chamados</p>
						</div>
					</Link>
					{checkRoute("ADM") ? (
						<Link href="/admin/auditoria-financeira">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsBank2 className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Auditoria Financeira</p>
							</div>
						</Link>
					) : null}

					{checkRoute("Suprimentos") ? (
						<Link href="/suprimentos/solicitacoesCompra">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdAddShoppingCart className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Solicitações de Compra</p>
							</div>
						</Link>
					) : (
						false
					)}
					{(userIsManager || checkRoute("ADM") || checkRoute("RH")) && (
						<Link href="/admin/comissao">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<AiOutlinePercentage className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Comissões</p>
							</div>
						</Link>
					)}
					{checkRoute("Suprimentos") || checkRoute("Pós-Venda") ? (
						<Link href="/suprimentos/entregas">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<TbTruckDelivery className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Entregas</p>
							</div>
						</Link>
					) : (
						false
					)}
					{userIsController ? (
						<Link href={"/ordens-de-servico"}>
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdDesignServices className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Banco de OS</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Almoxarifado") ? (
						<Link href={"/almoxarifado"}>
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaWarehouse className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Almoxarifado</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Projetos") ? (
						<Link href={"/projetos/comissionamento"}>
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<VscWorkspaceTrusted className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Comissionamento</p>
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
						<Link href="/seguro-fotovoltaico">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsShieldFillCheck className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Seguro Fotovoltaico</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("O&M") ? (
						<Link href="/oem/monitoramento">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsSpeedometer2 className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Monitoramento</p>
							</div>
						</Link>
					) : (
						false
					)}
					{/* {userIsManager ? (
               <Link  href={`/vendas/leads`}>
                 <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100 dark:hover:bg-primary/10">
                   <MdAddIcCall
                     style={{
                       color: '#15599a',
                       fontSize: '20px',
                     }}
                   />
                   <p className="pl-3 text-xs 80xt-primary/60">Leads</p>
                 </div>
               </Link>
              ) : null} */}
					{checkRoute("Obras") ? (
						<Link href="/obras/gestao-obras">
							<div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdOutlineBuildCircle className="dark:text-primary h-4 min-h-4 w-4 min-w-4 text-[#15599a]" />
								<p className="text-primary/80 pl-3 text-xs">Gestão de Obras</p>
							</div>
						</Link>
					) : (
						false
					)}
					{/* {userIsManager ? (
               <Link  href="/admin/gestaoTimeVendas">
                 <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100 dark:hover:bg-primary/10">
                   <TbDashboard className='text-[#15599a] w-4 h-4 min-w-4 min-h dark:text-blue-500-4'/>
                   <p className="pl-3 text-xs 80xt-primary/60">Gestão - Time de Vendas</p>
                 </div>
               </Link>
              ) : (
               false
              )} */}
					{checkRoute("Pós-Venda") ? (
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
			</>
		</>
	);
}

export default GeralSidebar;
