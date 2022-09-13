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
function ProjectModal({ open, setModalIsOpen, project }) {
  if (!open) return null;
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {project.qtde} - {project.nomedoprojeto}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="grid grid-cols-2 grow h-[100%]">
              <div className="flex flex-col mt-4">
                <h1 className="font-bold uppercase">
                  Informações pessoais do cliente
                </h1>
                <div className="grid grid-cols-3">
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Nome do Contrato
                      </h2>
                    </div>
                    <TextInput value={project.nomedocontrato} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Nome do Projeto
                      </h2>
                    </div>
                    <TextInput value={project.nomedoprojeto} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Vendedor
                      </h2>
                    </div>
                    <TextInput value={project.vendedor} />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Cidade
                      </h2>
                    </div>
                    <TextInput value={project.cidade} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Regional
                      </h2>
                    </div>
                    <TextInput value={project.regional} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a]">CPF/CNPJ</h2>
                    </div>
                    <TextInput value={project.cpfcnpj} />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Tipo de serviço
                      </h2>
                    </div>
                    <TextInput value={project.tipodeservico} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Telefone
                      </h2>
                    </div>
                    <TextInput value={project.telefone} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Data solicitação de contrato
                      </h2>
                    </div>
                    <TextInput value={project.datasolicitacaocontrato} />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Visita Técnica
                      </h2>
                    </div>
                    <TextInput value={project.visitatecnica} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Telefone
                      </h2>
                    </div>
                    <TextInput value={project.telefone} />
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-x-4">
                      <h2 className="font-bold text-[#15599a] uppercase">
                        Data solicitação de contrato
                      </h2>
                    </div>
                    <TextInput value={project.datasolicitacaocontrato} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <h1>Olá</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectModal;
