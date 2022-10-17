import React from "react";

function CardProjeto({ info, handleOpenModal, setModalProject, estagio }) {
  return (
    <div
      onClick={() => {
        handleOpenModal();
        setModalProject({ estagio: estagio, projeto: info });
      }}
      className=" flex flex-col hover:bg-blue-100 flex-col px-2 w-full gap-y-2 py-2 mt-2 border border-gray-300 rounded shadow-sm"
    >
      <div>
        <h1 className="font-bold text-sm text-zinc-700">
          <strong className="text-[#15599a]">{info.qtde}</strong> -{" "}
          {info.nomeDoProjeto}
        </h1>
      </div>
    </div>
  );
}

export default CardProjeto;
