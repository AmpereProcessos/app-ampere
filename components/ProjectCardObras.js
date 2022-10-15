import React from "react";

function ProjectCardObras({ info }) {
  return (
    <div className=" flex flex-col px-2 h-full w-full gap-y-2 py-2 mt-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          NOME DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.nomedocontrato}
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
          {info.entradanaobra != undefined && info.entradanaobra != "-"
            ? new Date(info.entradanaobra).toLocaleDateString()
            : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">LAUDO</p>
        <p className="text-md text-center text-gray-600">
          {info.laudo ? info.laudo : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          AUMENTO DE CARGA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.aumentodecarga ? info.aumentodecarga : "-"}
        </p>
      </div>
      {info.aumentodecarga == "SIM" && (
        <>
          <div className="grid grid-cols-2">
            <p className="text-md text-center text-[#15599a] font-bold">
              PAGAMENTO DO PADRÃO
            </p>
            <p className="text-md text-center text-[#fead61] font-bold">
              {info.pagamentodopadrao ? info.pagamentodopadrao : "-"}
            </p>
          </div>
          <div className="grid grid-cols-2">
            <p className="text-md text-center text-[#15599a] font-bold">
              RESP.INSTALAÇÃO DO PADRÃO
            </p>
            <p className="text-md text-center text-[#fead61] font-bold">
              {info.respinstalacaopadrao ? info.respinstalacaopadrao : "-"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectCardObras;
