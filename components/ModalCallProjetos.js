import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { cities, projetistas } from "../utils/constants";
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
  "AGUARDANDO CONCESSIONÁRIA": {
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  "EM ANDAMENTO": {
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
  },
  FINALIZADO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
function ModalCallProjetos({ setModalIsOpen, info, getCalls, credentials }) {
  const [infoHolder, setInfo] = useState(info);
  const [changes, setChanges] = useState({});
  const [responsavel, setResponsavel] = useState(info.responsavel);
  const [notes, setNotes] = useState(info.anotacoes);

  const [message, setMessage] = useState("");
  function saveCallChanges(status, mode) {
    axios
      .post("/api/calls/projetos/updateProjetos", {
        id: info._id,
        mudancas: {
          ...changes,
          status: status ? status : infoHolder.status,
          fechamento: status == "FINALIZADO" ? new Date() : info.fechamento,
        },
      })
      .then((res) => {
        setMessage(res.data);
        getCalls();
      });
  }
  function deleteCall() {
    axios
      .put("/api/calls/projetos/updateProjetos", {
        _id: info._id,
      })
      .then((res) => {
        setMessage(res.data);
        getCalls();
      });
  }
  useEffect(() => {
    setMessage("");
  }, [notes, responsavel]);
  console.log(changes);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                {info.tipoDoChamado}
              </h1>
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
                  {infoHolder.status == "FINALIZADO" ? (
                    <p
                      className={`text-xs font-bold border p-3 w-fit hover:opacity-100 text-center rounded-lg ${statusStyles["FINALIZADO"].textColor} ${statusStyles["FINALIZADO"].borderColor}`}
                    >
                      FINALIZADO
                    </p>
                  ) : (
                    <>
                      <p
                        onClick={() => {
                          setChanges({ ...changes, status: "EM ANDAMENTO" });
                          setInfo({ ...infoHolder, status: "EM ANDAMENTO" });
                        }}
                        className={`${
                          infoHolder.status != "EM ANDAMENTO" && "opacity-30"
                        } text-xs font-bold border p-3 w-fit hover:opacity-100 cursor-pointer text-center rounded-lg ${
                          statusStyles["EM ANDAMENTO"].textColor
                        } ${statusStyles["EM ANDAMENTO"].borderColor}`}
                      >
                        EM ANDAMENTO
                      </p>
                      <p
                        onClick={() => {
                          setChanges({
                            ...changes,
                            status: "AGUARDANDO CONCESSIONÁRIA",
                          });
                          setInfo({
                            ...infoHolder,
                            status: "AGUARDANDO CONCESSIONÁRIA",
                          });
                        }}
                        className={`${
                          infoHolder.status != "AGUARDANDO CONCESSIONÁRIA" &&
                          "opacity-30"
                        } text-xs cursor-pointer font-bold border p-3 w-fit text-center rounded-lg ${
                          info &&
                          statusStyles["AGUARDANDO CONCESSIONÁRIA"].textColor
                        } ${
                          info &&
                          statusStyles["AGUARDANDO CONCESSIONÁRIA"].borderColor
                        }`}
                      >
                        AGUARDANDO CONCESSIONÁRIA
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  PROJETO
                </span>
                <input
                  type={"text"}
                  value={infoHolder.projeto}
                  className={`text-sm w-full text-center uppercase text-gray-600 outline-none`}
                  onChange={(e) => {
                    setChanges({ ...changes, projeto: e.target.value });
                    setInfo({
                      ...infoHolder,
                      projeto: e.target.value.toUpperCase(),
                    });
                  }}
                />
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
                  value={responsavel}
                  onChange={(e) => {
                    setChanges({ ...changes, responsavel: e.target.value });
                    setResponsavel(e.target.value);
                  }}
                  className="text-xs grow outline-none mt-2 lg:mt-0 text-center"
                >
                  {projetistas.map((projetista) => (
                    <option key={projetista.label} value={projetista.nome}>
                      {projetista.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold text-center font-raleway">
                  DESCRIÇÃO DO PROBLEMA
                </span>
                <input
                  type={"text"}
                  value={infoHolder.observacoes}
                  className={`p-4 text-sm w-full text-center uppercase text-gray-600 font-bold outline-none bg-gray-100 min-h-[50px] italic]`}
                  onChange={(e) => {
                    setChanges({ ...changes, observacoes: e.target.value });
                    setInfo({
                      ...infoHolder,
                      observacoes: e.target.value.toUpperCase(),
                    });
                  }}
                />
              </div>
              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold text-center font-raleway">
                  ANOTAÇÕES
                </span>
                <textarea
                  value={infoHolder.anotacoes ? infoHolder.anotacoes : ""}
                  onChange={(e) => {
                    setChanges({ ...changes, anotacoes: e.target.value });
                    setInfo({ ...infoHolder, anotacoes: e.target.value });
                  }}
                  placeholder="Digite aqui as anotações do chamado"
                  className="outline-none placeholder:italic mt-1 rounded text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit text-center grow"
                />
              </div>
              {message && (
                <p className="text-center text-green-300 mt-2 italic">
                  {message}
                </p>
              )}
              {infoHolder.status == "FINALIZADO" ? (
                <div className="text-center">
                  <button
                    onClick={() => {
                      setInfo({ ...infoHolder, status: "EM ANDAMENTO" });
                      saveCallChanges("EM ANDAMENTO", "ABERTO");
                    }}
                    className="p-3 font-raleway mt-4 hover:bg-[#f18701] hover:text-white font-bold rounded-lg bg-yellow-400"
                  >
                    REABRIR CHAMADO
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setInfo({ ...infoHolder, status: "FINALIZADO" });
                        saveCallChanges("FINALIZADO", "FECHADO");
                      }}
                      className="p-3 font-raleway mt-4 hover:bg-[#06d6a0] hover:text-white font-bold rounded-lg bg-green-400"
                    >
                      FINALIZAR CHAMADO
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => saveCallChanges(null, "ABERTO")}
                      className="px-2 py-1 font-raleway mt-2 hover:bg-[#15599a] hover:text-white font-bold rounded-lg bg-blue-400"
                    >
                      SALVAR
                    </button>
                  </div>
                </>
              )}
              <div className="flex justify-center mt-6">
                <button
                  onClick={deleteCall}
                  className="bg-red-300 p-2 rounded hover:bg-red-600 text-white font-bold"
                >
                  EXCLUR CHAMADO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCallProjetos;
