import React, { useContext, useState } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { TbRecharging, TbDashboard } from "react-icons/tb";
import { FaDatabase, FaShoppingCart, FaTools, FaTasks, FaSolarPanel, FaBox, FaWarehouse } from "react-icons/fa";
import { TbTruckDelivery, TbReportAnalytics } from "react-icons/tb";
import { AiOutlineForm, AiOutlinePercentage } from "react-icons/ai";
import { MdEngineering, MdOutlinePayments, MdDesignServices, MdOutlineBuildCircle, MdSentimentSatisfiedAlt, MdAddIcCall, MdAddShoppingCart, MdPeople } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { SiCashapp } from "react-icons/si";
import { BsFolderPlus, BsFillPatchCheckFill, BsBank2, BsSpeedometer2, BsShieldFillCheck, BsCalendar2Week } from "react-icons/bs";
import { IoIosCalendar } from "react-icons/io";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { ImFolderOpen, ImCheckboxChecked } from "react-icons/im";

import Link from "next/link";
import { Session } from "next-auth";

type GeralSidebarProps = {
	session: Session;
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
				<h2 className="text-xs text-gray-500">PRINCIPAL</h2>
				<Link href="/">
					<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
						<RiDashboardFill style={{ color: "#15599a", fontSize: "20px" }} />
						<p className="pl-3 text-xs text-gray-600">Dashboard</p>
					</div>
				</Link>
			</div>
			<div className="mt-6">
				<h2 className="text-xs text-gray-500">GESTÃO DE PROJETOS</h2>
				<Link href="/gestao-de-projetos/emAndamento">
					<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
						<TbRecharging
							style={{
								color: "#15599a",
								fontSize: "20px",
							}}
						/>

						<p className="pl-3 text-xs text-gray-600">Em andamento</p>
					</div>
				</Link>

				<Link href="/gestao-de-projetos/banco-de-dados">
					<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
						<FaDatabase
							style={{
								color: "#15599a",
								fontSize: "20px",
							}}
						/>

						<p className="pl-3 text-xs text-gray-600">Banco de dados</p>
					</div>
				</Link>
			</div>

			<>
				<div className="mt-6">
					<h2 className="text-xs text-gray-500">SETORES</h2>
					{checkRoute("PPS") ? (
						<Link href="/comercial">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<SiCashapp style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Comercial</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Suprimentos") ? (
						<Link href="/suprimentos">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaShoppingCart style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Suprimentos</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRouteEitherAccess(["Projetos", "Pós-Venda"]) ? (
						<Link href="/projetos">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdEngineering style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Projetos</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Obras") ? (
						<Link href="/obras">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaTools style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Obras</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRouteEitherAccess(["O&M", "Pós-Venda"]) ? (
						<Link href={"/oem/comissionamento"}>
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<ImCheckboxChecked style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Comissionamento Pós-Obra</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Pós-Venda") ? (
						<Link href="/posvenda">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BiSupport style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Pós-Venda</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRouteEitherAccess(["O&M", "Pós-Venda"]) ? (
						<Link href="/posvenda/nutricao">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsCalendar2Week style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Nutrição Pós-Venda</p>
							</div>
						</Link>
					) : (
						false
					)}
					{session.user.permissoes.recursosHumanos.visualizar ? (
						<Link href="/adm/colaboradores">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdPeople style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">RH</p>
							</div>
						</Link>
					) : null}
					{checkRoute("ADM") ? (
						<Link href="/adm">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsFolderPlus style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">ADM</p>
							</div>
						</Link>
					) : null}
				</div>
				<div className="mt-6">
					<h2 className="text-xs text-gray-500">OUTROS</h2>

					<Link href="/calls">
						<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
							<FaTasks style={{ color: "#15599a", fontSize: "20px" }} />
							<p className="pl-3 text-xs text-gray-600">Chamados</p>
						</div>
					</Link>
					{checkRoute("ADM") ? (
						<Link href="/admin/auditoria-financeira">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsBank2 style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Auditoria Financeira</p>
							</div>
						</Link>
					) : null}

					{checkRoute("Suprimentos") ? (
						<Link href="/suprimentos/solicitacoesCompra">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdAddShoppingCart style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Solicitações de Compra</p>
							</div>
						</Link>
					) : (
						false
					)}
					{(userIsManager || checkRoute("ADM")) && (
						<Link href="/admin/comissao">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<AiOutlinePercentage style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Comissões</p>
							</div>
						</Link>
					)}
					{checkRoute("Suprimentos") || checkRoute("Pós-Venda") ? (
						<Link href="/suprimentos/entregas">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<TbTruckDelivery style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Entregas</p>
							</div>
						</Link>
					) : (
						false
					)}
					{userIsController ? (
						<Link href={"/ordens-de-servico"}>
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdDesignServices style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Banco de OS</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Almoxarifado") ? (
						<Link href={"/almoxarifado"}>
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaWarehouse style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Almoxarifado</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Projetos") ? (
						<Link href={"/projetos/comissionamento"}>
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<VscWorkspaceTrusted style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Comissionamento</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("O&M") ? (
						<Link href="/oem">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<FaSolarPanel style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">O&M</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("Pós-Venda") ? (
						<Link href="/seguro-fotovoltaico">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsShieldFillCheck style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Seguro Fotovoltaico</p>
							</div>
						</Link>
					) : (
						false
					)}
					{checkRoute("O&M") ? (
						<Link href="/oem/monitoramento">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<BsSpeedometer2 style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Monitoramento</p>
							</div>
						</Link>
					) : (
						false
					)}
					{/* {userIsManager ? (
               <Link  href={`/vendas/leads`}>
                 <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                   <MdAddIcCall
                     style={{
                       color: '#15599a',
                       fontSize: '20px',
                     }}
                   />
                   <p className="pl-3 text-xs text-gray-600">Leads</p>
                 </div>
               </Link>
              ) : null} */}
					{checkRoute("Obras") ? (
						<Link href="/obras/gestao-obras">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdOutlineBuildCircle style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">Gestão de Obras</p>
							</div>
						</Link>
					) : (
						false
					)}
					{/* {userIsManager ? (
               <Link  href="/admin/gestaoTimeVendas">
                 <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                   <TbDashboard style={{ color: '#15599a', fontSize: '20px' }} />
                   <p className="pl-3 text-xs text-gray-600">Gestão - Time de Vendas</p>
                 </div>
               </Link>
              ) : (
               false
              )} */}
					{checkRoute("Pós-Venda") ? (
						<Link href="/posvenda/nps">
							<div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
								<MdSentimentSatisfiedAlt style={{ color: "#15599a", fontSize: "20px" }} />
								<p className="pl-3 text-xs text-gray-600">NPS</p>
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
