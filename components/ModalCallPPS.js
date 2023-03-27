import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { AppContext } from "../context/AppContext";
import { respChamadosPPS } from "../utils/constants";
import { useKey } from "../utils/hooks";
import PPSModalCallInfo from "./PPSModalCallInfo";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import SaveButton from "./utils/Buttons/SaveButton";
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
  modalIsOpen,
}) {
  useKey("Escape", () => setModalIsOpen(false));

  const { credentials } = useContext(AppContext);
  const editor =
    credentials?.accessibleRoutes.includes("PPS") &&
    credentials?.visualizacao == undefined;
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
  // Letter handler
  // const escPress = useKeyPress("Escape");
  // State Holders
  const [responsavel, setResponsavel] = useState(info.responsavel);
  const [SVBCode, setSVBCode] = useState(info.codigoDoProjeto);
  const [notes, setNotes] = useState(initialNote);
  const [selectedStatus, setSelectedStatus] = useState(info.status);
  const [message, setMessage] = useState({
    text: "",
    color: "",
  });
  // Functions
  function saveProject() {
    if (info.status != selectedStatus) {
      ultAlteracoes.statusAlteracoes.usuario = credentials?.id;
      ultAlteracoes.statusAlteracoes.antes = info.status;
      ultAlteracoes.statusAlteracoes.depois = selectedStatus;
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    if (info.anotacoes != notes) {
      ultAlteracoes.anotAlteracoes.usuario = credentials?.id;
      ultAlteracoes.anotAlteracoes.antes = info.anotacoes;
      ultAlteracoes.anotAlteracoes.depois = notes;
      ultAlteracoes.anotAlteracoes.data = new Date().toJSON();
    }

    axios
      .put("/api/calls/pps/updatePPS", {
        ...info,
        status: selectedStatus,
        anotacoes: notes,
        codigoDoProjeto: SVBCode,
        responsavel: responsavel ? responsavel : info.responsavel,
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        setMessage({ text: res.data, color: "text-green-500" });
        updateModalInfo(info._id);
      });
  }
  function closedCall() {
    if (info.status != "REALIZADO") {
      ultAlteracoes.statusAlteracoes.usuario = credentials?.id;
      ultAlteracoes.statusAlteracoes.antes = info.status;
      ultAlteracoes.statusAlteracoes.depois = "REALIZADO";
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    if (responsavel == undefined || responsavel == "A DEFINIR") {
      setMessage({
        text: "Por favor, adicione o responsável.",
        color: "text-red-500",
      });
    } else {
      axios
        .post("/api/calls/pps/updatePPS", {
          ...info,
          dataDeConclusao: new Date(),
          status: "REALIZADO",
          ultAlteracoes: ultAlteracoes,
        })
        .then((res) => {
          setMessage({ text: "", color: "" });
          updateModalInfo(info._id);
        });
    }
  }
  function reopenCall() {
    if (info.status != "PENDENTE") {
      ultAlteracoes.statusAlteracoes.usuario = credentials?.id;
      ultAlteracoes.statusAlteracoes.antes = info.status;
      ultAlteracoes.statusAlteracoes.depois = "PENDENTE";
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    axios
      .post("/api/calls/pps/updatePPS", {
        ...info,
        dataDeConclusao: null,
        status: "PENDENTE",
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => updateModalInfo(info._id));
  }
  // function useKeyPress(targetKey) {
  //   // State for keeping track of whether key is pressed
  //   const [keyPressed, setKeyPressed] = useState(false);
  //   // If pressed key is our target key then set to true
  //   function downHandler({ key }) {
  //     if (key === targetKey) {
  //       setKeyPressed(true);
  //       setModalIsOpen(false);
  //     }
  //   }
  //   // If released key is our target key then set to false
  //   const upHandler = ({ key }) => {
  //     if (key === targetKey) {
  //       setKeyPressed(false);
  //     }
  //   };
  //   // Add event listeners
  //   useEffect(() => {
  //     window.addEventListener("keydown", downHandler);
  //     window.addEventListener("keyup", upHandler);
  //     // Remove event listeners on cleanup
  //     return () => {
  //       window.removeEventListener("keydown", downHandler);
  //       window.removeEventListener("keyup", upHandler);
  //     };
  //   }, []); // Empty array ensures that effect is only run on mount and unmount
  //   return keyPressed;
  // }
  console.log("TESTE");
  console.log(SVBCode);
  return (
    <>
      <AnimatedModalWrapper
        modalIsOpen={modalIsOpen}
        width={"40%"}
        height={"87%"}
      >
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
                  setMessage({ text: "", color: "" });
                  setModalIsOpen(false);
                }}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
              <input
                type={"number"}
                value={SVBCode}
                onChange={(e) => setSVBCode(Number(e.target.value))}
                className="grow outline-none h-full text-center"
              />
              {/* <span className="grow text-center font-raleway">
                {info.codigoDoProjeto}
              </span> */}
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
                {info.observacoes ? (
                  <ul className="text-xs font-bold text-center list-none">
                    {info.observacoes.split("/").map((string, index) => (
                      <li key={index}>{string}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center italic text-gray-600">
                    SEM OBSERVAÇÕES...
                  </p>
                )}
              </span>
            </div>
            <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="text-center font-bold">RESPONSÁVEL</span>
              <select
                disabled={!editor}
                value={responsavel ? responsavel : info.responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="text-xs grow text-center outline-none mt-2 lg:mt-0"
              >
                {respChamadosPPS.map((resp) => (
                  <option key={resp.value} value={resp.value}>
                    {resp.label}
                  </option>
                ))}
              </select>
            </div>
            {info.demanda == "EXTERNA" && (
              <PPSModalCallInfo
                tipoDeSolicitacao={info.tipoDeSolicitacao}
                dados={info}
              />
            )}
            <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="font-bold text-center font-raleway">
                ANOTAÇÕES
              </span>
              <textarea
                value={notes}
                readOnly={!editor}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Digite aqui as anotações do chamado"
                className="outline-none placeholder:italic mt-1 rounded text-center text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              />
            </div>
            {editor ? (
              info.dataDeConclusao ? (
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
              )
            ) : (
              false
            )}
            {/* {info.dataDeConclusao ? (
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
              )} */}
            {message.text && (
              <p className={`text-center ${message.color} mt-2 italic`}>
                {message.text}
              </p>
            )}
            {editor && (
              <div className="flex items-center justify-center mt-2">
                <SaveButton
                  text={"SALVAR"}
                  icon={<FaSave />}
                  handleClick={saveProject}
                />
              </div>
            )}
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalCallPPS;
