import React from "react";

function ProjectCardProjetos({ info }) {
  return (
    <div className=" flex flex-col overflow-y-auto overscroll-y-auto justify-around px-2 h-full w-full gap-y-2">
      <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
        <p className="text-md text-center text-[#15599a] font-bold">
          NOME DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.nomeDoContrato}
        </p>
      </div>
      <div className="grid items-center grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DO PARECER
        </p>
        <p className="text-md text-center text-gray-600">
          {info.parecer.statusDoParecerDeAcesso}
        </p>
      </div>
      <div className="grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DIAGRAMA UNIFILAR
        </p>
        <p className="text-md text-center uppercase text-gray-600">
          {info.projeto.diagramaUnifilar}
        </p>
      </div>
      <div className="grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DESENHO DO TELHADO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.projeto.desenhoTelhado ? info.projeto.desenhoTelhado : "-"}
        </p>
      </div>
      <div className="grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DATA ASS.DOCUMENTAÇÃO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.projeto.dataAssDocumentacao != undefined &&
          info.projeto.dataAssDocumentacao != "-"
            ? new Date(info.projeto.dataAssDocumentacao).toLocaleDateString()
            : "-"}
        </p>
      </div>
      <div className="grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          REPROVA PARECER
        </p>
        <p className="text-md text-center text-gray-600">
          {info.parecer.parecerReprovado ? info.parecer.parecerReprovado : "-"}{" "}
          {info.parecer.qtdeReprovas ? `(${info.parecer.qtdeReprovas})` : false}
        </p>
      </div>
      {info.parecer.parecerReprovado == "SIM" && (
        <div className="flex flex-col px-2">
          <p className="text-md text-center text-[#fead61] font-bold">
            {info.parecer.motivoReprova ? info.parecer.motivoReprova : "-"}
          </p>
        </div>
      )}
      <div className="grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          REPROVA VISTORIA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.vistoria.vistoriaReprovada
            ? info.vistoria.vistoriaReprovada
            : "-"}{" "}
          {info.vistoria.qtdeReprovas
            ? `(${info.vistoria.qtdeReprovas})`
            : false}
        </p>
      </div>
      {info.vistoria.vistoriaReprovada == "SIM" && (
        <div className="flex flex-col px-2">
          <p className="text-md text-center text-[#fead61] font-bold">
            {info.vistoria.motivoReprova ? info.vistoria.motivoReprova : "-"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProjectCardProjetos;
