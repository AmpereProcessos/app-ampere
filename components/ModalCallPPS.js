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
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
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
function ModalCallPPS({
  open,
  setModalIsOpen,
  info,
  updateModalInfo,
  credentials,
}) {
  var ultAlteracoes = {
    anotAlteracoes: {
      usuario: info.ultAlteracoes?.anotAlteracoes
        ? info.ultAlteracoes?.anotAlteracoes.usuario
        : "",
      antes: info.ultAlteracoes?.anotAlteracoes
        ? info.ultAlteracoes?.anotAlteracoes.antes
        : "",
      depois: info.ultAlteracoes?.anotAlteracoes
        ? info.ultAlteracoes?.anotAlteracoes.depois
        : "",
      data: info.ultAlteracoes?.anotAlteracoes
        ? info.ultAlteracoes?.anotAlteracoes.data
        : "",
    },
    statusAlteracoes: {
      usuario: info.ultAlteracoes?.statusAlteracoes
        ? info.ultAlteracoes?.statusAlteracoes.usuario
        : "",
      antes: info.ultAlteracoes?.statusAlteracoes
        ? info.ultAlteracoes?.statusAlteracoes.antes
        : "",
      depois: info.ultAlteracoes?.statusAlteracoes
        ? info.ultAlteracoes?.statusAlteracoes.depois
        : "",
      data: info.ultAlteracoes?.statusAlteracoes
        ? info.ultAlteracoes?.statusAlteracoes.data
        : "",
    },
  };
  let initialNote = info.anotacoes ? info.anotacoes : "";
  const [responsavel, setResponsavel] = useState(info.responsavel);
  const [notes, setNotes] = useState(initialNote);
  const [selectedStatus, setSelectedStatus] = useState(info.status);
  const [message, setMessage] = useState("");
  function saveProject() {
    if (info.status != selectedStatus) {
      ultAlteracoes.statusAlteracoes.usuario = credentials._id;
      ultAlteracoes.statusAlteracoes.antes = info.status;
      ultAlteracoes.statusAlteracoes.depois = selectedStatus;
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    if (info.anotacoes != notes) {
      ultAlteracoes.anotAlteracoes.usuario = credentials._id;
      ultAlteracoes.anotAlteracoes.antes = info.anotacoes;
      ultAlteracoes.anotAlteracoes.depois = notes;
      ultAlteracoes.anotAlteracoes.data = new Date().toJSON();
    }
    axios
      .put("/api/calls/pps/updatePPS", {
        ...info,
        status: selectedStatus,
        anotacoes: notes,
        responsavel: responsavel ? responsavel : info.responsavel,
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        setMessage(res.data);
        updateModalInfo(info._id);
      });
  }
  function closedCall() {
    if (info.status != "REALIZADO") {
      ultAlteracoes.statusAlteracoes.usuario = credentials._id;
      ultAlteracoes.statusAlteracoes.antes = info.status;
      ultAlteracoes.statusAlteracoes.depois = "REALIZADO";
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    axios
      .post("/api/calls/pps/updatePPS", {
        ...info,
        dataDeConclusao: new Date(),
        status: "REALIZADO",
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => updateModalInfo(info._id));
  }
  function reopenCall() {
    if (info.status != "PENDENTE") {
      ultAlteracoes.statusAlteracoes.usuario = credentials._id;
      ultAlteracoes.statusAlteracoes.antes = info.status;
      ultAlteracoes.statusAlteracoes.depois = "PENDENTE";
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    axios
      .post("/api/calls/pps/updatePPS", {
        ...info,
        dataDeConclusao: "",
        status: "PENDENTE",
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => updateModalInfo(info._id));
  }
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <div className="flex flex-col">
                <h1 className="text-[#15599a] pl-6  font-bold">
                  {info.tipoDeSolicitacao}
                </h1>
                <p className="text-gray-500 text-center text-xs">#{info._id}</p>
              </div>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setMessage("");
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="overflow-y-auto">
              <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold font-raleway">STATUS</span>
                <div className="flex gap-x-2 justify-center grow">
                  {info.status == "PENDENTE" ? (
                    <>
                      <p
                        onClick={() => setSelectedStatus("PENDENTE")}
                        className={`${
                          selectedStatus != "PENDENTE" && "opacity-30"
                        } text-xs cursor-pointer font-bold border p-3 w-fit text-center rounded-lg ${
                          info && statusStyles[info?.status].textColor
                        } ${info && statusStyles[info.status].borderColor}`}
                      >
                        {info?.status}
                      </p>
                      <p
                        onClick={() => setSelectedStatus("EM ANDAMENTO")}
                        className={`${
                          selectedStatus != "EM ANDAMENTO" && "opacity-30"
                        } text-xs font-bold border p-3 w-fit hover:opacity-100 cursor-pointer text-center rounded-lg ${
                          statusStyles["EM ANDAMENTO"].textColor
                        } ${statusStyles["EM ANDAMENTO"].borderColor}`}
                      >
                        EM ANDAMENTO
                      </p>
                    </>
                  ) : (
                    <p
                      className={`text-xs font-bold border p-3 w-fit hover:opacity-100 text-center rounded-lg ${
                        statusStyles[info.status].textColor
                      } ${statusStyles[info.status].borderColor}`}
                    >
                      {info.status}
                    </p>
                  )}
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
                  CÓDIGO SOLAR MARKET (SVB)
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
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Digite aqui as anotações do chamado"
                  className="outline-none placeholder:italic mt-1 rounded text-center text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit grow"
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
