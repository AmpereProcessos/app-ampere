import React, { useContext, useState } from 'react'
import { RiDashboardFill } from 'react-icons/ri'
import { TbRecharging, TbDashboard } from 'react-icons/tb'
import { FaDatabase, FaShoppingCart, FaTools, FaTasks, FaSolarPanel, FaBox, FaWarehouse } from 'react-icons/fa'
import { TbTruckDelivery, TbReportAnalytics } from 'react-icons/tb'
import { AiOutlineForm, AiOutlinePercentage } from 'react-icons/ai'
import {
  MdEngineering,
  MdOutlinePayments,
  MdDesignServices,
  MdOutlineBuildCircle,
  MdSentimentSatisfiedAlt,
  MdAddIcCall,
  MdAddShoppingCart,
} from 'react-icons/md'
import { BiSupport } from 'react-icons/bi'
import { SiCashapp } from 'react-icons/si'
import { BsFolderPlus, BsFillPatchCheckFill, BsBank2 } from 'react-icons/bs'
import { IoIosCalendar } from 'react-icons/io'
import { VscWorkspaceTrusted } from 'react-icons/vsc'
import { ImFolderOpen, ImCheckboxChecked } from 'react-icons/im'

import Link from 'next/link'

function GeralSidebar({ userAccessibleRoutes = [], userIsManager, userVisualization, userIsController }) {
  function checkRoute(route, operationalOnly) {
    if (operationalOnly) {
      return userAccessibleRoutes?.includes(route) && userVisualization == undefined
    }
    return userAccessibleRoutes?.includes(route)
  }
  function checkRouteEitherAccess(routes, operationalOnly) {
    return routes.some((route) => userAccessibleRoutes?.includes(route))
  }

  return (
    <>
      <div>
        <h2 className="text-xs text-gray-500">PRINCIPAL</h2>
        <Link href="/">
          <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <RiDashboardFill style={{ color: '#15599a', fontSize: '20px' }} />
            <p className="pl-3 text-xs text-gray-600">Dashboard</p>
          </a>
        </Link>
      </div>
      <div className="mt-6">
        <h2 className="text-xs text-gray-500">GESTÃO DE PROJETOS</h2>
        <Link href="/gestaoDeProjetos/emAndamento">
          <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <TbRecharging
              style={{
                color: '#15599a',
                fontSize: '20px',
              }}
            />
            <p className="pl-3 text-xs text-gray-600">Em andamento</p>
          </a>
        </Link>

        <Link href="/gestaoDeProjetos/bancoDeDados">
          <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <FaDatabase
              style={{
                color: '#15599a',
                fontSize: '20px',
              }}
            />
            <p className="pl-3 text-xs text-gray-600">Banco de dados</p>
          </a>
        </Link>
      </div>

      <>
        <div className="mt-6">
          <h2 className="text-xs text-gray-500">SETORES</h2>
          {checkRoute('PPS') ? (
            <Link href="/comercial">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <SiCashapp style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Comercial</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('Suprimentos') ? (
            <Link href="/suprimentos">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <FaShoppingCart style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Suprimentos</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRouteEitherAccess(['Projetos', 'Pós-Venda']) ? (
            <Link href="/projetos">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdEngineering style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Projetos</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('Obras') ? (
            <Link href="/obras">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <FaTools style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Obras</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRouteEitherAccess(['O&M', 'Pós-Venda']) ? (
            <Link href={'/oem/comissionamento'}>
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <ImCheckboxChecked style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Comissionamento Pós-Obra</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('Pós-Venda') ? (
            <Link href="/posvenda">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <BiSupport style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Pós-Venda</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('ADM') ? (
            <Link href="/adm">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <BsFolderPlus style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">ADM</p>
              </a>
            </Link>
          ) : null}
          {checkRoute('InsideSales') ? (
            <Link href="/insideSales">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdAddIcCall style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Inside Sales</p>
              </a>
            </Link>
          ) : null}
        </div>
        <div className="mt-6">
          <h2 className="text-xs text-gray-500">OUTROS</h2>

          <Link href="/calls">
            <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <FaTasks style={{ color: '#15599a', fontSize: '20px' }} />
              <p className="pl-3 text-xs text-gray-600">Chamados</p>
            </a>
          </Link>
          {checkRoute('ADM', true) ? (
            <Link href="/admin/auditoria-financeira">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <BsBank2 style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Auditoria Financeira</p>
              </a>
            </Link>
          ) : null}

          {userIsManager ? (
            <Link href="/operacoes">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <IoIosCalendar style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Operações</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('Suprimentos', true) ? (
            <Link href="/suprimentos/solicitacoesCompra">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdAddShoppingCart style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Solicitações de Compra</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {(userIsManager || checkRoute('ADM')) && (
            <Link href="/admin/comissao">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <AiOutlinePercentage style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Comissões</p>
              </a>
            </Link>
          )}
          {checkRoute('Suprimentos') ? (
            <Link href="/suprimentos/entregas">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <TbTruckDelivery style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Entregas</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {userIsController ? (
            <Link href={'/ordemDeServico/bancoDeOS'}>
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdDesignServices style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Banco de OS</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('Almoxarifado', true) ? (
            <Link href={'/almoxarifado'}>
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <FaWarehouse style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Almoxarifado</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('ADM', true) ? (
            <Link href={'/adm/cobrancas'}>
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdOutlinePayments style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Cobranças</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('Projetos', true) ? (
            <Link href={'/projetos/comissionamento'}>
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <VscWorkspaceTrusted style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Comissionamento</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('O&M', true) ? (
            <Link href="/oem">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <FaSolarPanel style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">O&M</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {userIsManager || userVisualization == 'REGIONAL' ? (
            <Link href={`/vendas/leads`}>
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdAddIcCall
                  style={{
                    color: '#15599a',
                    fontSize: '20px',
                  }}
                />
                <p className="pl-3 text-xs text-gray-600">Leads</p>
              </a>
            </Link>
          ) : null}
          {checkRoute('Obras', true) ? (
            <Link href="/obras/gestaoDeObras">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdOutlineBuildCircle style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Gestão de Obras</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {userIsManager || userVisualization == 'REGIONAL' ? (
            <Link href="/admin/gestaoTimeVendas">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <TbDashboard style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Gestão - Time de Vendas</p>
              </a>
            </Link>
          ) : (
            false
          )}
          {checkRoute('Pós-Venda', true) ? (
            <Link href="/posvenda/nps">
              <a className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdSentimentSatisfiedAlt style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">NPS</p>
              </a>
            </Link>
          ) : (
            false
          )}
        </div>
      </>
      {/* {credentials?.accessibleRoutes != undefined &&
        credentials?.accessibleRoutes?.includes("Vendas") &&
        credentials?.vendedor && (
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
            {credentials?.vendedor && (
              <Link
                href={`/vendas/emProcesso/${credentials?.visualizacao}?parametro=${credentials?.vendedor}`}
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
            )}
            {credentials?.vendedor && (
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
            )}
            {credentials?.vendedor && (
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
            )}
            {credentials?.vendedor && (
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
            )}
            {credentials?.vendedor && (
              <Link href={`/vendas/entregaTecnica`}>
                <a className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
                  <BsFillPatchCheckFill
                    style={{
                      color: "#15599a",
                      fontSize: "20px",
                    }}
                  />
                  <p className="pl-3 text-xs text-gray-600">
                    Entregas Técnicas
                  </p>
                </a>
              </Link>
            )}
            {credentials.visualizacao == "VENDEDOR" ||
            credentials.visualizacao == "REGIONAL" ? (
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
        )} */}
    </>
  )
}

export default GeralSidebar
