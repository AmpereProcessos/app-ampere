import React, { useState } from "react";
import ModalNovoFormAlmoxarifado from "../../components/ModalNovoFormAlmoxarifado";
function Formularios() {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  return (
    <div className="p-6 grow">
      <div className="border-b border-gray-200 pb-2">
        <h1 className="text-[#fead61] font-raleway font-bold text-xl">
          FORMULÁRIOS
        </h1>
      </div>
      <div
        onClick={() => setCreateModalIsOpen(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">Novo Formulário</p>
      </div>
      {createModalIsOpen && (
        <ModalNovoFormAlmoxarifado setModalIsOpen={setCreateModalIsOpen} />
      )}
    </div>
  );
}

export default Formularios;
