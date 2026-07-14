import React from "react";
import { RiDashboardFill } from "react-icons/ri";
import { FaSolarPanel } from "react-icons/fa";
import { MdAddIcCall } from "react-icons/md";

import { TbReportAnalytics } from "react-icons/tb";

import { ImFolderOpen } from "react-icons/im";

import Link from "next/link";

function VendedorSidebar({ userAccessibleRoutes = [], userVisualization, sellerName }) {
  function checkRoute(route) {
    return userAccessibleRoutes?.includes(route);
  }
  function checkRouteEitherAccess(routes) {
    return routes.some((route) => userAccessibleRoutes?.includes(route));
  }

  return (
    <>
      <div>
        <h2 className="text-foreground text-xs">PRINCIPAL</h2>
        <Link href="/">
          <div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <RiDashboardFill style={{ color: "#15599a", fontSize: "20px" }} />
            <p className="text-foreground pl-3 text-xs">Dashboard</p>
          </div>
        </Link>
      </div>
      {userVisualization == "INSIDE" ? (
        <div className="mt-6">
          <h2 className="text-foreground text-xs">SETORES</h2>
          {checkRoute("InsideSales") ? (
            <Link href="/insideSales">
              <div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdAddIcCall style={{ color: "#15599a", fontSize: "20px" }} />
                <p className="text-foreground pl-3 text-xs">Inside Sales</p>
              </div>
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6">
        <h2 className="text-foreground text-xs">ÁREA DO VENDEDOR</h2>
        <Link href="/vendas">
          <div className="dark:hover:bg-primary/10 mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <ImFolderOpen
              style={{
                color: "#15599a",
                fontSize: "20px",
              }}
            />
            <p className="text-foreground pl-3 text-xs">Projetos</p>
          </div>
        </Link>
        {/* {!!sellerName ? (
          <Link href={`/vendas/emProcesso/${userVisualization}?parametro=${sellerName}`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100 dark:hover:bg-primary/10">
              <TbRecharging
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-foreground">Em processo</p>
            </div>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/formularios`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100 dark:hover:bg-primary/10">
              <diviOutlineForm
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-foreground">Formulários</p>
            </div>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/visitasTecnicas`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100 dark:hover:bg-primary/10">
              <TbReportAnalytics
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-foreground">Visitas Técnicas</p>
            </div>
          </Link>
        ) : null}

        {sellerName ? (
          <Link href={`/vendas/entregaTecnica`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100 dark:hover:bg-primary/10">
              <BsFillPatchCheckFill
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-foreground">Entregas Técnicas</p>
            </div>
          </Link>
        ) : null} */}
        {/* {sellerName ? (
          <Link href={`/vendas/leads`}>
            <div className="hover:bg-blue-100 dark:hover:bg-primary/10 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <MdAddIcCall
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-foreground">Leads</p>
            </div>
          </Link>
        ) : null} */}
      </div>
    </>
  );
}

export default VendedorSidebar;
