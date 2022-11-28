import React, { useState } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { TbRecharging } from "react-icons/tb";
import {
  FaDatabase,
  FaShoppingCart,
  FaTools,
  FaTasks,
  FaSolarPanel,
  FaBox,
} from "react-icons/fa";
import { AiOutlineForm } from "react-icons/ai";
import {
  MdEngineering,
  MdOutlinePayments,
  MdDesignServices,
  MdOutlineBuildCircle,
  MdSentimentSatisfiedAlt,
} from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { SiCashapp } from "react-icons/si";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { BsFolderPlus } from "react-icons/bs";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { ImFolderOpen } from "react-icons/im";
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
      className="flex py-4 px-2 flex-col bg-[#fff] sticky top-[70px] w-full md:w-[250px] overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-gray-300"
    >
      <div>
        <h2 className="text-xs text-gray-500">PRINCIPAL</h2>
        <Link href="/">
          <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
            <RiDashboardFill style={{ color: "#15599a", fontSize: "20px" }} />
            <p className="pl-3 text-xs text-gray-600">Dashboard</p>
          </a>
        </Link>
      </div>
      <div className="mt-6">
        {credentials.visualizacao == undefined && (
          <>
            <h2 className="text-xs text-gray-500">GESTÃO DE PROJETOS</h2>
            <Link href="/gestaoDeProjetos/emAndamento">
              <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                <TbRecharging
                  style={{
                    color: "#15599a",
                    fontSize: "20px",
                  }}
                />
                <p className="pl-3 text-xs text-gray-600">Em andamento</p>
              </a>
            </Link>
          </>
        )}
        {credentials.vendedor == undefined && (
          <Link href="/gestaoDeProjetos/bancoDeDados">
            <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
              <FaDatabase
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Banco de dados</p>
            </a>
          </Link>
        )}
        {credentials.accessibleRoutes != undefined &&
        credentials.accessibleRoutes.includes("Obras") &&
        credentials.regional == undefined ? (
          <Link href="/calendario">
            <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
              <BsFillCalendarEventFill
                style={{ color: "#15599a", fontSize: "20px" }}
              />
              <p className="pl-3 text-xs text-gray-600">
                Cronograma de Obras (em breve)
              </p>
            </a>
          </Link>
        ) : (
          false
        )}
      </div>
      {credentials.vendedor == undefined && (
        <>
          {" "}
          <div className="mt-6">
            <h2 className="text-xs text-gray-500">SETORES</h2>
            {credentials.accessibleRoutes != undefined ? (
              credentials?.accessibleRoutes.includes("PPS") ||
              credentials?.accessibleRoutes.includes("Marketing") ? (
                <Link href="/comercial">
                  <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                    <SiCashapp style={{ color: "#15599a", fontSize: "20px" }} />
                    <p className="pl-3 text-xs text-gray-600">Comercial</p>
                  </a>
                </Link>
              ) : (
                false
              )
            ) : (
              false
            )}
            {credentials.accessibleRoutes != undefined ? (
              credentials?.accessibleRoutes.includes("Suprimentos") ||
              credentials.accessibleRoutes.includes("Marketing") ? (
                <Link href="/suprimentos">
                  <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                    <FaShoppingCart
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="pl-3 text-xs text-gray-600">Suprimentos</p>
                  </a>
                </Link>
              ) : (
                false
              )
            ) : (
              false
            )}
            {credentials.accessibleRoutes != undefined ? (
              credentials?.accessibleRoutes.includes("Projetos") ||
              credentials?.accessibleRoutes.includes("Pós-Venda") ? (
                <Link href="/projetos">
                  <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                    <MdEngineering
                      style={{ color: "#15599a", fontSize: "20px" }}
                    />
                    <p className="pl-3 text-xs text-gray-600">Projetos</p>
                  </a>
                </Link>
              ) : (
                false
              )
            ) : (
              false
            )}
            {credentials.accessibleRoutes != undefined ? (
              credentials?.accessibleRoutes.includes("Obras") ||
              credentials?.accessibleRoutes.includes("Marketing") ? (
                <Link href="/obras">
                  <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                    <FaTools style={{ color: "#15599a", fontSize: "20px" }} />
                    <p className="pl-3 text-xs text-gray-600">Obras</p>
                  </a>
                </Link>
              ) : (
                false
              )
            ) : (
              false
            )}
            {credentials.accessibleRoutes != undefined &&
            credentials.regional == undefined
              ? (credentials?.accessibleRoutes.includes("O&M") ||
                  credentials?.accessibleRoutes.includes("Marketing")) && (
                  <Link href="/oem">
                    <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <FaSolarPanel
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-xs text-gray-600">O&M</p>
                    </a>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined &&
            credentials.visualizacao == undefined ? (
              credentials?.accessibleRoutes.includes("Pós-Venda") ||
              credentials?.accessibleRoutes.includes("Marketing") ? (
                <Link href="/posvenda">
                  <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                    <BiSupport style={{ color: "#15599a", fontSize: "20px" }} />
                    <p className="pl-3 text-xs text-gray-600">Pós-Venda</p>
                  </a>
                </Link>
              ) : (
                false
              )
            ) : (
              false
            )}
            {credentials.accessibleRoutes != undefined &&
            credentials.regional == undefined
              ? (credentials?.accessibleRoutes.includes("ADM") ||
                  credentials?.accessibleRoutes.includes("Marketing")) && (
                  <Link href="/adm">
                    <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <BsFolderPlus
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-xs text-gray-600">ADM</p>
                    </a>
                  </Link>
                )
              : false}
          </div>
          <div className="mt-6">
            <h2 className="text-xs text-gray-500">OUTROS</h2>
            {credentials.visualizacao == undefined ? (
              <Link href="/calls">
                <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <FaTasks style={{ color: "#15599a", fontSize: "20px" }} />
                  <p className="pl-3 text-xs text-gray-600">Chamados</p>
                </a>
              </Link>
            ) : (
              false
            )}
            {credentials.controller != undefined &&
            credentials.controller == true ? (
              <Link href={"/ordemDeServico/bancoDeOS"}>
                <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <MdDesignServices
                    style={{ color: "#15599a", fontSize: "20px" }}
                  />
                  <p className="pl-3 text-xs text-gray-600">Banco de OS</p>
                </a>
              </Link>
            ) : (
              false
            )}
            {credentials.accessibleRoutes != undefined &&
            credentials.accessibleRoutes.includes("Almoxarifado") ? (
              <Link href={"/almoxarifado"}>
                <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <FaBox style={{ color: "#15599a", fontSize: "20px" }} />
                  <p className="pl-3 text-xs text-gray-600">Almoxarifado</p>
                </a>
              </Link>
            ) : (
              false
            )}
            {credentials.accessibleRoutes != undefined &&
            credentials.regional == undefined
              ? credentials?.accessibleRoutes.includes("ADM") && (
                  <Link href={"/adm/cobrancas"}>
                    <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <MdOutlinePayments
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-xs text-gray-600">Cobranças</p>
                    </a>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined &&
            credentials.regional == undefined
              ? credentials?.accessibleRoutes.includes("Projetos") && (
                  <Link href={"/projetos/comissionamento"}>
                    <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <VscWorkspaceTrusted
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-xs text-gray-600">
                        Comissionamento
                      </p>
                    </a>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined &&
            credentials.regional == undefined
              ? credentials?.accessibleRoutes.includes("Obras") && (
                  <Link href="/obras/gestaoDeObras">
                    <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <MdOutlineBuildCircle
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-xs text-gray-600">
                        Gestão de Obras
                      </p>
                    </a>
                  </Link>
                )
              : false}
            {credentials.accessibleRoutes != undefined &&
            credentials.regional == undefined
              ? credentials?.accessibleRoutes.includes("Pós-Venda") && (
                  <Link href="/posvenda/nps">
                    <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                      <MdSentimentSatisfiedAlt
                        style={{ color: "#15599a", fontSize: "20px" }}
                      />
                      <p className="pl-3 text-xs text-gray-600">NPS</p>
                    </a>
                  </Link>
                )
              : false}
          </div>
        </>
      )}
      {credentials.accessibleRoutes != undefined &&
        credentials?.accessibleRoutes.includes("Vendas") &&
        credentials.vendedor && (
          <div className="mt-6">
            <h2 className="text-xs text-gray-500">ÁREA DO VENDEDOR</h2>
            <Link href="/vendas">
              <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                <ImFolderOpen
                  style={{
                    color: "#15599a",
                    fontSize: "20px",
                  }}
                />
                <p className="pl-3 text-xs text-gray-600">Projetos</p>
              </a>
            </Link>
            {credentials.vendedor && (
              <Link
                href={`/vendas/emProcesso/${credentials.visualizacao}?parametro=${credentials.vendedor}`}
              >
                <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <TbRecharging
                    style={{
                      color: "#15599a",
                      fontSize: "20px",
                    }}
                  />
                  <p className="pl-3 text-xs text-gray-600">Em processo</p>
                </a>
              </Link>
            )}
            {credentials.vendedor && (
              <Link href={`/vendas/formularios`}>
                <a className="hover:bg-blue-100 py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <AiOutlineForm
                    style={{
                      color: "#15599a",
                      fontSize: "20px",
                    }}
                  />
                  <p className="pl-3 text-xs text-gray-600">Formulários</p>
                </a>
              </Link>
            )}
          </div>
        )}
    </div>
  );
}

export default Sidebar;
