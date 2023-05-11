import React, { useState } from "react";
import ModalNovaOperacao from "../../components/ModalNovaOperacao";

function Operacoes() {
  const [newOperationModalIsOpen, setNewOperationModalIsOpen] = useState(false);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
            <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
              OPERAÇÕES E OUTROS PROJETOS
            </p>
          </div>
        </div>
      </div>

      <div
        onClick={() => setNewOperationModalIsOpen(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">NOVA OPERAÇÃO</p>
      </div>

      {newOperationModalIsOpen ? (
        <ModalNovaOperacao
          isOpen={newOperationModalIsOpen}
          setModalIsOpen={setNewOperationModalIsOpen}
        />
      ) : null}
    </div>
  );
}

export default Operacoes;
