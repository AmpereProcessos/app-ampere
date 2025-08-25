import React, { useEffect, useState } from 'react'
import OSBlock from './OSBlock'

function BancoDeOSCard({ project, getOSS, categoriesFilter, openOrdersOnly }) {
  const [visibleServiceOrders, setVisibleServiceOrders] = useState(project.ordensDeServico)
  function filterVisibleServiceOrders() {
    var allServiceOrders = project.ordensDeServico
    var newArr
    if (categoriesFilter.length > 0) {
      if (!newArr) newArr = allServiceOrders
      newArr = newArr.filter((os) => categoriesFilter.includes(os.categoria))
    }
    if (openOrdersOnly) {
      if (!newArr) newArr = allServiceOrders
      newArr = newArr.filter((os) => os.dataDeFechamento == undefined)
    }
    if (!newArr) setVisibleServiceOrders(allServiceOrders)
    else {
      setVisibleServiceOrders(newArr)
    }
  }
  useEffect(() => {
    filterVisibleServiceOrders()
  }, [categoriesFilter, openOrdersOnly])
  return (
    <div className="flex flex-col rounded border border-blue-300 p-2 shadow-lg">
      <div className="border-primary/20 grid grid-cols-1 grid-rows-2 border-b pb-2 lg:grid-cols-5 lg:grid-rows-1">
        <h1 className="col-span-1 text-center font-bold text-[#15599a]">
          {project.qtde} - {project.nomeDoContrato}
        </h1>
        <p className="font-raleway text-primary/60 col-span-1 text-center text-xs">CIDADE: {project.cidade ? project.cidade : '-'}</p>
        <p className="font-raleway text-primary/60 col-span-1 hidden text-center text-xs lg:block">
          LOGRADOURO: {project.logradouro ? project.logradouro : '-'}
        </p>
        <p className="font-raleway text-primary/60 col-span-1 hidden text-center text-xs lg:block">BAIRRO: {project.bairro ? project.bairro : '-'}</p>
        <p className="font-raleway text-primary/60 col-span-1 hidden text-center text-xs lg:block">
          Nº: {project.numeroResidencia ? project.numeroResidencia : '-'}
        </p>
      </div>
      {visibleServiceOrders?.map((order, index) => (
        <OSBlock
          key={`${order.index}${project._id}`}
          getOSS={getOSS}
          clientName={project.nomeDoContrato}
          order={order}
          index={order.index}
          projectID={project._id}
        />
      ))}
    </div>
  )
}

export default BancoDeOSCard
