import React from "react";

function ProjectCardComercial({ info }) {
  return (
    <div className=" flex flex-col justify-around h-full px-2 w-full gap-y-2 py-2 mt-2">
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          NOME DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.nomedocontrato}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DO CONTRATO
        </p>
        <p className="text-md text-center text-gray-600">
          {info.statuscontrato ? info.statuscontrato : "-"}
        </p>
      </div>
      <div className="grid grid-cols-2">
        <p className="text-md text-center text-[#15599a] font-bold">
          STATUS DE LIBERAÇÃO DA COMPRA
        </p>
        <p className="text-md text-center text-gray-600">
          {info.statusliberacaocredito ? info.statusliberacaocredito : "-"}
        </p>
      </div>
    </div>
  );
}

export default ProjectCardComercial;
