import React from "react";

function ProjectCardComercial({ info }) {
  return (
    <div className=" flex flex-col overflow-y-auto overscroll-y-auto justify-around h-full px-2 w-full gap-y-2 py-2 mt-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          NOME DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.nomeDoContrato}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.contrato?.status ? info.contrato?.status : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DE LIBERAÇÃO DA COMPRA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.compra.statusLiberacao ? info.compra.statusLiberacao : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DATA MÁXIMA DE PAGAMENTO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.compra.dataMaxPagamento
            ? new Date(info.compra.dataMaxPagamento).toLocaleDateString("pt-br")
            : "-"}
        </p>
      </div>
    </div>
  );
}

export default ProjectCardComercial;
