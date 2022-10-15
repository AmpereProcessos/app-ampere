import React from "react";

function ProjectCardProjetos({ info }) {
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
      <div className="grid items-center grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DO PARECER
        </p>
        <p className="text-md text-center text-gray-600">
          {info.statusparecerdeacesso}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DIAGRAMA UNIFILAR
        </p>
        <p className="text-md text-center uppercase text-gray-600">
          {info.diagramaunifilar}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DESENHO DO TELHADO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.desenhotelhado ? info.desenhotelhado : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          DATA ASS.DOCUMENTAÇÃO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.documentacaoassinada != undefined &&
          info.documentacaoassinada != "-"
            ? new Date(info.documentacaoassinada).toLocaleDateString()
            : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          REPROVA PARECER
        </p>
        <p className="text-md text-center text-gray-600">
          {info.parecerReprovado ? info.parecerReprovado : "-"}{" "}
          {info.qtdeReprovasParecer ? `(${info.qtdeReprovasParecer})` : false}
        </p>
      </div>
      {info.parecerReprovado == "SIM" && (
        <div className="flex flex-col px-2">
          <p className="text-md text-center text-[#fead61] font-bold">
            {info.motivoReprovaParecer ? info.motivoReprovaParecer : "-"}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 px-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          REPROVA VISTORIA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.vistoriaReprovada ? info.vistoriaReprovada : "-"}{" "}
          {info.qtdeReprovasVistoria ? `(${info.qtdeReprovasVistoria})` : false}
        </p>
      </div>
      {info.vistoriaReprovada == "SIM" && (
        <div className="flex flex-col px-2">
          <p className="text-md text-center text-[#fead61] font-bold">
            {info.motivoReprovaVistoria ? info.motivoReprovaVistoria : "-"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProjectCardProjetos;
