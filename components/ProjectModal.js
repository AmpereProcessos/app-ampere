import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "85%",
  height: "98%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function ProjectModal({ open, setModalIsOpen }) {
  if (!open) return null;
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-cyan-700 pl-6  font-bold">
                João Alves Silva
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col mt-4">
              <h1 className="font-bold uppercase">
                Informações pessoais do cliente
              </h1>
              <div className="mt-3">
                <div className="flex gap-x-4">
                  <h2 className="font-bold text-blue-700">Nome completo</h2>
                  <button>
                    <AiFillEdit style={{ fontSize: "16px" }} />
                  </button>
                </div>
                <TextInput value={"João Alves Silva"} />
              </div>
              <div className="mt-3">
                <div className="flex gap-x-4">
                  <h2 className="font-bold text-blue-700">CPF/CNPJ</h2>
                  <button>
                    <AiFillEdit style={{ fontSize: "16px" }} />
                  </button>
                </div>
                <input
                  className="pl-4 font-sm text-gray-600 outline-none"
                  type="text"
                  readOnly={true}
                  value={"999.999.999-99"}
                />
              </div>
              <div className="mt-3">
                <div className="flex gap-x-4">
                  <h2 className="font-bold text-blue-700">Contato</h2>
                  <button>
                    <AiFillEdit style={{ fontSize: "16px" }} />
                  </button>
                </div>
                <input
                  className="pl-4 font-sm text-gray-600 outline-none"
                  type="text"
                  readOnly={true}
                  value={"(34) 99999-9999"}
                />
              </div>
              <div className="mt-3">
                <h2 className="font-bold text-blue-700">Cidade / Estado</h2>
                <p className="pl-4 font-sm text-gray-600">Ituiutaba/MG</p>
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <h1 className="font-bold uppercase">
                Informações do projeto proposto
              </h1>
              <div className="mt-3">
                <h2 className="font-bold text-blue-700">Módulos</h2>
                <p className="pl-4 font-sm text-gray-600">
                  (12) Painel Solar DAH 550W
                </p>
              </div>
              <div className="mt-3">
                <h2 className="font-bold text-blue-700">Topologia - Modelo</h2>
                <p className="pl-4 font-sm text-gray-600">
                  Inversor - Growatt 3K
                </p>
              </div>
              <div className="mt-3">
                <h2 className="font-bold text-blue-700">Contato</h2>
                <p className="pl-4 font-sm text-gray-600">(34) 99999-9999</p>
              </div>
              <div className="mt-3">
                <h2 className="font-bold text-blue-700">Cidade / Estado</h2>
                <p className="pl-4 font-sm text-gray-600">Ituiutaba/MG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectModal;
