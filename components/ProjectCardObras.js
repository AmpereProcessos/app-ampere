import React from "react";

function ProjectCardObras({ info }) {
  return (
    <div className=" flex flex-col overflow-y-auto overscroll-y-auto justify-around px-2 h-full w-full gap-y-2 py-2 mt-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          NOME DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.nomeDoContrato}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">CIDADE</p>
        <p className="text-md text-center text-gray-600">
          {info.cidade ? info.cidade : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          ENTRADA NA OBRA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.obra.entrada != undefined && info.obra.entrada != "-"
            ? new Date(info.obra.entrada).toLocaleDateString()
            : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">LAUDO</p>
        <p className="text-md text-center text-gray-600">
          {info.obra.laudo ? info.obra.laudo : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          AUMENTO DE CARGA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.projeto.aumentoDeCarga ? info.projeto.aumentoDeCarga : "-"}
        </p>
      </div>
      {info.projeto.aumentoDeCarga == "SIM" && (
        <>
          <div className="grid grid-cols-2">
            <p className="text-md text-center text-[#15599a] font-bold">
              PAGAMENTO DO PADRÃO
            </p>
            <p className="text-md text-center text-[#fead61] font-bold">
              {info.padrao.respPagamento ? info.padrao.respPagamento : "-"}
            </p>
          </div>
          <div className="grid grid-cols-2">
            <p className="text-md text-center text-[#15599a] font-bold">
              RESP.INSTALAÇÃO DO PADRÃO
            </p>
            <p className="text-md text-center text-[#fead61] font-bold">
              {info.padrao.respInstalacao ? info.padrao.respInstalacao : "-"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectCardObras;
