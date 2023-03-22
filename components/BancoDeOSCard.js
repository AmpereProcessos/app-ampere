import React, { useEffect, useState } from "react";
import OSBlock from "./OSBlock";

function BancoDeOSCard({ project, getOSS, categoriesFilter, openOrdersOnly }) {
  const [visibleServiceOrders, setVisibleServiceOrders] = useState(
    project.ordensDeServico
  );
  function filterVisibleServiceOrders() {
    var allServiceOrders = project.ordensDeServico;
    var newArr;
    if (categoriesFilter.length > 0) {
      if (!newArr) newArr = allServiceOrders;
      newArr = newArr.filter((os) => categoriesFilter.includes(os.categoria));
    }
    if (openOrdersOnly) {
      if (!newArr) newArr = allServiceOrders;
      newArr = newArr.filter((os) => os.dataDeFechamento == undefined);
    }
    if (!newArr) setVisibleServiceOrders(allServiceOrders);
    else {
      setVisibleServiceOrders(newArr);
    }
  }
  useEffect(() => {
    filterVisibleServiceOrders();
  }, [categoriesFilter, openOrdersOnly]);
  return (
    <div className="flex flex-col p-2 border border-blue-300 rounded shadow-lg">
      <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-5 border-b border-gray-200 pb-2">
        <h1 className="font-bold text-[#15599a] col-span-1 text-center">
          {project.qtde} - {project.nomeDoContrato}
        </h1>
        <p className="font-raleway text-xs text-gray-500 col-span-1 text-center">
          CIDADE: {project.cidade ? project.cidade : "-"}
        </p>
        <p className="hidden lg:block font-raleway text-xs text-gray-500 col-span-1 text-center">
          LOGRADOURO: {project.logradouro ? project.logradouro : "-"}
        </p>
        <p className="hidden lg:block font-raleway text-xs text-gray-500 col-span-1 text-center">
          BAIRRO: {project.bairro ? project.bairro : "-"}
        </p>
        <p className="hidden lg:block font-raleway text-xs text-gray-500 col-span-1 text-center">
          Nº: {project.numeroResidencia ? project.numeroResidencia : "-"}
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
  );
}

export default BancoDeOSCard;
