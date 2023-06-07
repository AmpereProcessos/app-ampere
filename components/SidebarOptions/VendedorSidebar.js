import React, { useContext, useState } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { TbRecharging } from "react-icons/tb";
import { FaSolarPanel } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineForm } from "react-icons/ai";
import { MdAddIcCall } from "react-icons/md";

import { BsFillPatchCheckFill } from "react-icons/bs";

import { ImFolderOpen } from "react-icons/im";

import Link from "next/link";

function VendedorSidebar({
  userAccessibleRoutes = [],
  userVisualization,
  sellerName,
}) {
  function checkRoute(route) {
    return userAccessibleRoutes?.includes(route);
  }
  function checkRouteEitherAccess(routes) {
    return routes.some((route) => userAccessibleRoutes?.includes(route));
  }

  return (
    <>
      <div>
        <h2 className="text-xs text-gray-500">PRINCIPAL</h2>
        <Link href="/">
          <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
            <RiDashboardFill style={{ color: "#15599a", fontSize: "20px" }} />
            <p className="pl-3 text-xs text-gray-600">Dashboard</p>
          </a>
        </Link>
      </div>
      {userVisualization == "INSIDE" ? (
        <div className="mt-6">
          <h2 className="text-xs text-gray-500">SETORES</h2>
          {checkRoute("InsideSales") ? (
            <Link href="/insideSales">
              <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
                <MdAddIcCall style={{ color: "#15599a", fontSize: "20px" }} />
                <p className="pl-3 text-xs text-gray-600">Inside Sales</p>
              </a>
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6">
        <h2 className="text-xs text-gray-500">ÁREA DO VENDEDOR</h2>
        <Link href="/vendas">
          <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
            <ImFolderOpen
              style={{
                color: "#15599a",
                fontSize: "20px",
              }}
            />
            <p className="pl-3 text-xs text-gray-600">Projetos</p>
          </a>
        </Link>
        {!!sellerName ? (
          <Link
            href={`/vendas/emProcesso/${userVisualization}?parametro=${sellerName}`}
          >
            <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <TbRecharging
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Em processo</p>
            </a>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/formularios`}>
            <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <AiOutlineForm
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Formulários</p>
            </a>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/visitasTecnicas`}>
            <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <TbReportAnalytics
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Visitas Técnicas</p>
            </a>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/propostasOeM`}>
            <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <FaSolarPanel
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">O&M</p>
            </a>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/entregaTecnica`}>
            <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <BsFillPatchCheckFill
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Entregas Técnicas</p>
            </a>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/leads`}>
            <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <MdAddIcCall
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Leads</p>
            </a>
          </Link>
        ) : null}
      </div>
    </>
  );
}

export default VendedorSidebar;
