import React, { useState } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { TbRecharging } from "react-icons/tb";
import {
  FaDatabase,
  FaShoppingCart,
  FaTools,
  FaTasks,
  FaSolarPanel,
} from "react-icons/fa";
import { MdEngineering } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { SiCashapp } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/router";
function Sidebar({ credentials }) {
  const router = useRouter();
  if (
    router.pathname.includes("pdf") ||
    router.pathname.includes("publico") ||
    router.pathname.includes("ordemDeServico") ||
    router.pathname.includes("auth")
  )
    return null;
  return (
    <div className="flex sticky top-[70px] flex-col w-[250px] max-h-[900px] border-r border-gray-300">
      <div className="mt-4 flex flex-col h-full pb-2 justify-between">
        <div className="flex flex-col py-4 px-2">
          <div>
            <h2 className="text-sm text-gray-500">PRINCIPAL</h2>
            <Link href="/">
              <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                <RiDashboardFill
                  style={{ color: "#15599a", fontSize: "20px" }}
                />
                <p className="pl-3 text-gray-600">Dashboard</p>
              </div>
            </Link>
          </div>
          <div className="mt-6">
            <h2 className="text-sm text-gray-500">GESTÃO DE PROJETOS</h2>
            <Link href="/projectsManagement/inProgress">
              <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                <TbRecharging
                  style={{
                    color: "#15599a",
                    fontSize: "20px",
                  }}
                />
                <p className="pl-3 text-gray-600">Em andamento</p>
              </div>
            </Link>
            <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
              <FaDatabase
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-gray-600">Banco de dados</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-sm text-gray-500">SETORES</h2>
            {credentials.accessibleRoutes != undefined
              ? credentials?.accessibleRoutes.includes("PPS") && (
                  <Link href="/comercial">
                    <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <SiCashapp
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-gray-600">Comercial</p>
                    </div>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined
              ? credentials?.accessibleRoutes.includes("Suprimentos") && (
                  <Link href="/suprimentos">
                    <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <FaShoppingCart
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-gray-600">Suprimentos</p>
                    </div>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined
              ? credentials?.accessibleRoutes.includes("Projetos") && (
                  <Link href="/projetos">
                    <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <MdEngineering
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-gray-600">Projetos</p>
                    </div>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined
              ? credentials?.accessibleRoutes.includes("Obras") && (
                  <Link href="/obras">
                    <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <FaTools style={{ color: "#15599a", fontSize: "20px" }} />
                      <p className="pl-3 text-gray-600">Obras</p>
                    </div>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined
              ? credentials?.accessibleRoutes.includes("O&M") && (
                  <Link href="/oem">
                    <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <FaSolarPanel
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-gray-600">O&M</p>
                    </div>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined
              ? credentials?.accessibleRoutes.includes("Pós-Venda") && (
                  <Link href="/posvenda">
                    <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <BiSupport
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-gray-600">Pós-Venda</p>
                    </div>
                  </Link>
                )
              : false}
          </div>
          <div className="mt-6">
            <h2 className="text-sm text-gray-500">OUTROS</h2>
            <Link href="/calls">
              <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                <FaTasks style={{ color: "#15599a", fontSize: "20px" }} />
                <p className="pl-3 text-gray-600">Chamados</p>
              </div>
            </Link>
          </div>
        </div>
        <p className="justify-self-end mt-10 text-center text-sm">
          A ENERGIA QUE MOVE O MUNDO{" "}
          <strong className="text-[#fead61]">VEM DE VOCÊ!</strong>
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
