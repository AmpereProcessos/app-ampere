import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import axios from "axios";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "40%",
  height: "87%",
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
const statusStyles = {
  ABERTO: {
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  PENDENTE: {
    textColor: "text-red-400",
    borderColor: "border-red-400",
  },
  "EM ANDAMENTO": {
    textColor: "text-orange-400",
    borderColor: "border-orange-400",
  },
  RESOLVIDO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
function ModalCallSuporte({ setModalIsOpen, info }) {
  const [responsavel, setResponsavel] = useState(info.responsavel);
  const [notes, setNotes] = useState(info.anotacoes);
  function closeCall() {
    axios
      .post("/api/calls/updateSuporte", {
        ...info,
        fechamento: new Date(),
        statusChamado: "RESOLVIDO",
      })
      .then((res) => console.log(res.data));
  }
  function reopenCall() {
    axios
      .post("/api/calls/updateSuporte", {
        ...info,
        fechamento: "",
        statusChamado: "ABERTO",
      })
      .then((res) => console.log(res.data));
  }
  console.log(info);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                {info.tipoChamado}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div>
              <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold font-raleway">STATUS</span>
                <div className="flex justify-center grow">
                  <p
                    className={`text-xs font-bold border p-3 w-fit text-center rounded-lg ${
                      info && statusStyles[info?.statusChamado].textColor
                    } ${info && statusStyles[info.statusChamado].borderColor}`}
                  >
                    {info?.statusChamado}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  NOME DO CLIENTE
                </span>
                <p className="grow text-center font-raleway">
                  {info.nomeCliente ? info.nomeCliente : info.nomeUsina}
                </p>
              </div>
              <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  ABERTURA
                </span>
                <p className="grow text-center font-raleway">
                  {new Date(info.abertura).toLocaleString()}
                </p>
              </div>
              {info.fechamento && (
                <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center font-bold font-raleway">
                    FECHAMENTO
                  </span>
                  <p className="grow text-center font-raleway">
                    {new Date(info.fechamento).toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold">RESPONSÁVEL</span>
                <select
                  value={responsavel ? responsavel : info.responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0 text-center"
                >
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                  <option value={"GABRIEL MARTINS"}>GABRIEL MARTINS</option>
                  <option value={"LUCAS FERNANDES"}>LUCAS FERNANDES</option>
                  <option value={"LUIS EDUARDO"}>LUIS EDUARDO</option>
                </select>
              </div>
              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold text-center font-raleway">
                  DESCRIÇÃO DO PROBLEMA
                </span>
                <span className="grow text-center font-raleway text-sm bg-gray-100 p-4 italic">
                  {info.descricaoProblema ? info.descricaoProblema : ""}
                </span>
              </div>
              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold text-center font-raleway">
                  ANOTAÇÕES
                </span>
                <textarea
                  value={notes ? notes : info.anotacoes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Digite aqui as anotações do chamado"
                  className="outline-none placeholder:italic mt-1 rounded text-center text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit text-center grow"
                />
              </div>
              {info.fechamento ? (
                <div className="text-center">
                  <button
                    onClick={reopenCall}
                    className="p-3 font-raleway mt-4 hover:bg-[#f18701] hover:text-white font-bold rounded-lg bg-yellow-400"
                  >
                    REABRIR CHAMADO
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={closeCall}
                    className="p-3 font-raleway mt-4 hover:bg-[#06d6a0] hover:text-white font-bold rounded-lg bg-green-400"
                  >
                    FINALIZAR CHAMADO
                  </button>
                </div>
              )}
              <div className="text-center">
                <button className="px-2 py-1 font-raleway mt-2 hover:bg-[#15599a] hover:text-white font-bold rounded-lg bg-blue-400">
                  SALVAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCallSuporte;
