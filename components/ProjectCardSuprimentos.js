import React from "react";

function ProjectCardSuprimentos({ info }) {
  return (
    <div className=" flex flex-col overflow-y-auto overscroll-y-auto justify-around px-2 h-full w-full gap-y-1 py-2 mt-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          NOME DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.nomedocontrato}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DATA DO PEDIDO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.datadopedido != undefined && info.datadopedido != "-"
            ? new Date(info.datadopedido).toLocaleDateString()
            : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DO PAGAMENTO
        </p>
        <p className="text-md text-center  text-gray-600">
          {info.statuspagamento ? info.statuspagamento : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DA ENTREGA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.statusentrega ? info.statusentrega : "-"}
        </p>
      </div>
      <div className="flex flex-col h-fit px-2">
        <p className="text-md text-center  text-[#15599a] font-bold">
          TRANSPORTADORA
        </p>
        <p className="text-md text-center break-words text-[#fead61] font-bold">
          {info.rastreiooutransportadora ? info.rastreiooutransportadora : "-"}
        </p>
      </div>
    </div>
  );
}

export default ProjectCardSuprimentos;
