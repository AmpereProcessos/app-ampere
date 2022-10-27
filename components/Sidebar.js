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
import {
  MdEngineering,
  MdOutlinePayments,
  MdDesignServices,
  MdOutlineBuildCircle,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { SiCashapp } from "react-icons/si";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { BsFolderPlus } from "react-icons/bs";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import Link from "next/link";
const style = {
  heigth: "calc(100% - 350px)",
};
import { useRouter } from "next/router";
function Sidebar({ credentials }) {
  const router = useRouter();
  if (
    router.pathname.includes("pdf") ||
    router.pathname.includes("publico") ||
    router.pathname.includes("auth")
  )
    return null;
  return (
    <div
      style={{ maxHeight: "calc(100vh - 70px)" }}
      className="flex py-4 px-2 flex-col bg-[#fff] sticky top-[70px] w-[250px] overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-gray-300"
    >
      <div>
        <h2 className="text-xs text-gray-500">PRINCIPAL</h2>
        <Link href="/">
          <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
            <RiDashboardFill style={{ color: "#15599a", fontSize: "20px" }} />
            <p className="pl-3 text-xs text-gray-600">Dashboard</p>
          </div>
        </Link>
      </div>
      <div className="mt-6">
        <h2 className="text-xs text-gray-500">GESTÃO DE PROJETOS</h2>
        <Link href="/gestaoDeProjetos/emAndamento">
          <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
            <TbRecharging
              style={{
                color: "#15599a",
                fontSize: "20px",
              }}
            />
            <p className="pl-3 text-xs text-gray-600">Em andamento</p>
          </div>
        </Link>
        <Link href="/gestaoDeProjetos/bancoDeDados">
          <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
            <FaDatabase
              style={{
                color: "#15599a",
                fontSize: "20px",
              }}
            />
            <p className="pl-3 text-xs text-gray-600">Banco de dados</p>
          </div>
        </Link>
        <Link href="/calendario">
          <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
            <BsFillCalendarEventFill
              style={{ color: "#15599a", fontSize: "20px" }}
            />
            <p className="pl-3 text-xs text-gray-600">
              Cronograma de Obras (em breve)
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-6">
        <h2 className="text-xs text-gray-500">SETORES</h2>
        {credentials.accessibleRoutes != undefined
          ? credentials?.accessibleRoutes.includes("PPS") && (
              <Link href="/comercial">
                <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <SiCashapp style={{ color: "#15599a", fontSize: "20px" }} />
                  <p className="pl-3 text-xs text-gray-600">Comercial</p>
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
                  <p className="pl-3 text-xs text-gray-600">Suprimentos</p>
                </div>
              </Link>
            )
          : false}
        {credentials.accessibleRoutes != undefined ? (
          credentials?.accessibleRoutes.includes("Projetos") ||
          credentials?.accessibleRoutes.includes("Pós-Venda") ? (
            <Link href="/projetos">
              <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                <MdEngineering style={{ color: "#15599a", fontSize: "20px" }} />
                <p className="pl-3 text-xs text-gray-600">Projetos</p>
              </div>
            </Link>
          ) : (
            false
          )
        ) : (
          false
        )}
        {credentials.accessibleRoutes != undefined
          ? credentials?.accessibleRoutes.includes("Obras") && (
              <Link href="/obras">
                <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <FaTools style={{ color: "#15599a", fontSize: "20px" }} />
                  <p className="pl-3 text-xs text-gray-600">Obras</p>
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
                  <p className="pl-3 text-xs text-gray-600">O&M</p>
                </div>
              </Link>
            )
          : false}
        {credentials.accessibleRoutes != undefined
          ? credentials?.accessibleRoutes.includes("Pós-Venda") && (
              <Link href="/posvenda">
                <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <BiSupport style={{ color: "#15599a", fontSize: "20px" }} />
                  <p className="pl-3 text-xs text-gray-600">Pós-Venda</p>
                </div>
              </Link>
            )
          : false}
        {credentials.accessibleRoutes != undefined
          ? credentials?.accessibleRoutes.includes("ADM") && (
              <Link href="/adm">
                <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <BsFolderPlus
                    style={{ color: "#15599a", fontSize: "20px" }}
                  />
                  <p className="pl-3 text-xs text-gray-600">ADM</p>
                </div>
              </Link>
            )
          : false}
      </div>
      <div className="mt-6">
        <h2 className="text-xs text-gray-500">OUTROS</h2>
        <Link href="/calls">
          <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
            <FaTasks style={{ color: "#15599a", fontSize: "20px" }} />
            <p className="pl-3 text-xs text-gray-600">Chamados</p>
          </div>
        </Link>
        {credentials.controller != undefined &&
        credentials.controller == true ? (
          <Link href={"/ordemDeServico/bancoDeOS"}>
            <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
              <MdDesignServices
                style={{ color: "#15599a", fontSize: "20px" }}
              />
              <p className="pl-3 text-xs text-gray-600">Banco de OS</p>
            </div>
          </Link>
        ) : (
          false
        )}
        {credentials.accessibleRoutes != undefined
          ? credentials?.accessibleRoutes.includes("ADM") && (
              <Link href={"/adm/cobrancas"}>
                <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <MdOutlinePayments
                    style={{ color: "#15599a", fontSize: "20px" }}
                  />
                  <p className="pl-3 text-xs text-gray-600">Cobranças</p>
                </div>
              </Link>
            )
          : false}
        {credentials.accessibleRoutes != undefined
          ? credentials?.accessibleRoutes.includes("Projetos") && (
              <Link href={"/projetos/comissionamento"}>
                <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <VscWorkspaceTrusted
                    style={{ color: "#15599a", fontSize: "20px" }}
                  />
                  <p className="pl-3 text-xs text-gray-600">Comissionamento</p>
                </div>
              </Link>
            )
          : false}
        {credentials.accessibleRoutes != undefined
          ? credentials?.accessibleRoutes.includes("Obras") && (
              <Link href="/obras/gestaoDeObras">
                <div className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <MdOutlineBuildCircle
                    style={{ color: "#15599a", fontSize: "20px" }}
                  />
                  <p className="pl-3 text-xs text-gray-600">Gestão de Obras</p>
                </div>
              </Link>
            )
          : false}
      </div>
    </div>
  );
}

export default Sidebar;
