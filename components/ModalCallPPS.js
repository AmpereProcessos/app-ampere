import axios from "axios";
import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
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
  "EM ANDAMENTO": {
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  "AGUARDANDO VENDEDOR": {
    textColor: "text-orange-400",
    borderColor: "border-orange-400",
  },
  REALIZADO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
  PENDENTE: {
    textColor: "text-red-400",
    borderColor: "border-red-400",
  },
};
function ModalCallPPS({ open, setModalIsOpen, info }) {
  const [responsavel, setResponsavel] = useState(info.responsavel);
  const [notes, setNotes] = useState(info.anotacoes);
  const [message, setMessage] = useState("");
  function updateRenderInfos() {
    axios.get(`/api/calls/getPPS/${info._id}`).then((res) => (info = res.data));
  }
  function saveProject() {
    axios
      .put("/api/calls/updatePPS", {
        ...info,
        anotacoes: notes,
        responsavel: responsavel,
      })
      .then((res) => {
        setMessage(res.data);
        updateRenderInfos();
      });
  }
  function closedCall() {
    axios
      .post("/api/calls/updatePPS", {
        ...renderInfo,
        dataDeConclusao: new Date(),
        status: "REALIZADO",
      })
      .then((res) => updateRenderInfos());
  }
  function reopenCall() {
    axios
      .post("/api/calls/updatePPS", {
        ...renderInfo,
        dataDeConclusao: "",
        status: "PENDENTE",
      })
      .then((res) => updateRenderInfos());
  }
  console.log(responsavel);
  if (!open) return null;
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {info.tipoDeSolicitacao}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setMessage("");
                    setResponsavel("");
                    setNotes("");
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
                      info && statusStyles[info?.status].textColor
                    } ${info && statusStyles[info.status].borderColor}`}
                  >
                    {info?.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  VENDEDOR
                </span>
                <span className="grow text-center font-raleway">
                  {info.vendedor}
                </span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  CÓDIGO SOLAR MARKET (SBV)
                </span>
                <span className="grow text-center font-raleway">
                  {info.codigoDoProjeto}
                </span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  ABERTURA
                </span>
                <span className="grow text-center font-raleway">
                  {new Date(info.carimboDataHora).toLocaleString()}
                </span>
              </div>
              {info.dataDeConclusao && (
                <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center font-bold font-raleway">
                    FECHAMENTO
                  </span>
                  <span className="grow text-center font-raleway">
                    {new Date(info.dataDeConclusao).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold text-center font-raleway">
                  OBSERVAÇÕES
                </span>
                <span className="grow text-center font-raleway text-sm bg-gray-100 p-4 italic">
                  {info.observacoes}
                </span>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold">RESPONSÁVEL</span>
                <select
                  value={responsavel ? responsavel : info.responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0 text-center"
                >
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                  <option value={"ARTHUR"}>ARTHUR</option>
                  <option value={"ADRIANO"}>ADRIANO</option>
                  <option value={"MATHEUS"}>MATHEUS</option>
                </select>
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
              {info.dataDeConclusao ? (
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
                    onClick={closedCall}
                    className="p-3 font-raleway mt-4 hover:bg-[#06d6a0] hover:text-white font-bold rounded-lg bg-green-400"
                  >
                    FINALIZAR CHAMADO
                  </button>
                </div>
              )}
              {message && (
                <p className="text-center text-green-300 mt-2 italic">
                  {message}
                </p>
              )}
              <div className="text-center">
                <button
                  onClick={saveProject}
                  className="px-2 py-1 font-raleway mt-2 hover:bg-[#15599a] hover:text-white font-bold rounded-lg bg-blue-400"
                >
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

export default ModalCallPPS;
