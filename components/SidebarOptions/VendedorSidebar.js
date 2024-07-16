import React, { useContext, useState } from 'react'
import { RiDashboardFill } from 'react-icons/ri'
import { TbRecharging } from 'react-icons/tb'
import { FaSolarPanel } from 'react-icons/fa'
import { TbReportAnalytics } from 'react-icons/tb'
import { AiOutlineForm } from 'react-icons/ai'
import { MdAddIcCall } from 'react-icons/md'

import { BsFillPatchCheckFill } from 'react-icons/bs'

import { ImFolderOpen } from 'react-icons/im'

import Link from 'next/link'

function VendedorSidebar({ userAccessibleRoutes = [], userVisualization, sellerName }) {
  function checkRoute(route) {
    return userAccessibleRoutes?.includes(route)
  }
  function checkRouteEitherAccess(routes) {
    return routes.some((route) => userAccessibleRoutes?.includes(route))
  }

  return (
    <>
      <div>
        <h2 className="text-xs text-gray-500">PRINCIPAL</h2>
        <Link href="/">
          <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <RiDashboardFill style={{ color: '#15599a', fontSize: '20px' }} />
            <p className="pl-3 text-xs text-gray-600">Dashboard</p>
          </div>
        </Link>
      </div>
      {userVisualization == 'INSIDE' ? (
        <div className="mt-6">
          <h2 className="text-xs text-gray-500">SETORES</h2>
          {checkRoute('InsideSales') ? (
            <Link href="/insideSales">
              <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
                <MdAddIcCall style={{ color: '#15599a', fontSize: '20px' }} />
                <p className="pl-3 text-xs text-gray-600">Inside Sales</p>
              </div>
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6">
        <h2 className="text-xs text-gray-500">ÁREA DO VENDEDOR</h2>
        <Link href="/vendas">
          <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
            <ImFolderOpen
              style={{
                color: '#15599a',
                fontSize: '20px',
              }}
            />
            <p className="pl-3 text-xs text-gray-600">Projetos</p>
          </div>
        </Link>
        {/* {!!sellerName ? (
          <Link href={`/vendas/emProcesso/${userVisualization}?parametro=${sellerName}`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <TbRecharging
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Em processo</p>
            </div>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/formularios`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <diviOutlineForm
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Formulários</p>
            </div>
          </Link>
        ) : null}
        {sellerName ? (
          <Link href={`/vendas/visitasTecnicas`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <TbReportAnalytics
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Visitas Técnicas</p>
            </div>
          </Link>
        ) : null}

        {sellerName ? (
          <Link href={`/vendas/entregaTecnica`}>
            <div className="mt-2 flex cursor-pointer items-center py-2 pl-2 duration-300 ease-in hover:scale-105 hover:bg-blue-100">
              <BsFillPatchCheckFill
                style={{
                  color: '#15599a',
                  fontSize: '20px',
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Entregas Técnicas</p>
            </div>
          </Link>
        ) : null} */}
        {/* {sellerName ? (
          <Link href={`/vendas/leads`}>
            <div className="hover:bg-blue-100 hover:scale-105 duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2">
              <MdAddIcCall
                style={{
                  color: "#15599a",
                  fontSize: "20px",
                }}
              />
              <p className="pl-3 text-xs text-gray-600">Leads</p>
            </div>
          </Link>
        ) : null} */}
      </div>
    </>
  )
}

export default VendedorSidebar
