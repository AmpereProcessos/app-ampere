import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { cities } from "../utils/constants";
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
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
  },
  RESOLVIDO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
function ModalCallSuporte({
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
  let initialCidade = info.cidade ? info.cidade : "A DEFINIR";
  var selectableCities = cities.filter((cidade) => cidade.name != info.cidade);
  const [responsavel, setResponsavel] = useState(info.responsavel);
  const [notes, setNotes] = useState(initialNote);
  const [selectedStatus, setSelectedStatus] = useState(info.statusChamado);
  const [cidade, setCidade] = useState(initialCidade);
  const [message, setMessage] = useState("");
  function saveCallChanges() {
    if (info.statusChamado != selectedStatus) {
      ultAlteracoes.statusAlteracoes.usuario = credentials._id;
      ultAlteracoes.statusAlteracoes.antes = info.statusChamado;
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
      .put("/api/calls/suporte/updateSuporte", {
        ...info,
        statusChamado: selectedStatus,
        anotacoes: notes,
        cidade: cidade,
        responsavel: responsavel ? responsavel : info.responsavel,
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        setMessage(res.data);
        updateModalInfo(info._id);
      });
  }
  function closeCall() {
    if (info.statusChamado != "RESOLVIDO") {
      ultAlteracoes.statusAlteracoes.usuario = credentials._id;
      ultAlteracoes.statusAlteracoes.antes = info.statusChamado;
      ultAlteracoes.statusAlteracoes.depois = "RESOLVIDO";
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    axios
      .post("/api/calls/suporte/updateSuporte", {
        ...info,
        fechamento: new Date(),
        statusChamado: "RESOLVIDO",
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        updateModalInfo(info._id);
      });
  }
  function reopenCall() {
    if (info.status != "ABERTO") {
      ultAlteracoes.statusAlteracoes.usuario = credentials._id;
      ultAlteracoes.statusAlteracoes.antes = info.statusChamado;
      ultAlteracoes.statusAlteracoes.depois = "ABERTO";
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    axios
      .post("/api/calls/suporte/updateSuporte", {
        ...info,
        fechamento: "",
        statusChamado: "ABERTO",
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        updateModalInfo(info._id);
      });
  }
  useEffect(() => {
    setMessage("");
  }, [notes, responsavel]);
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
                  {info.statusChamado == "ABERTO" ? (
                    <>
                      <p
                        onClick={() => setSelectedStatus("ABERTO")}
                        className={`${
                          selectedStatus != "ABERTO" && "opacity-30"
                        } text-xs cursor-pointer font-bold border p-3 w-fit text-center rounded-lg ${
                          info && statusStyles[info?.statusChamado].textColor
                        } ${
                          info && statusStyles[info.statusChamado].borderColor
                        }`}
                      >
                        {info?.statusChamado}
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
                        statusStyles[info.statusChamado].textColor
                      } ${statusStyles[info.statusChamado].borderColor}`}
                    >
                      {info.statusChamado}
                    </p>
                  )}
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
              <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  CIDADE
                </span>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0 text-center"
                >
                  {info.cidade && (
                    <option value={info.cidade}>{info.cidade}</option>
                  )}
                  {selectableCities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                </select>
              </div>

              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold">RESPONSÁVEL</span>
                <select
                  value={responsavel}
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Digite aqui as anotações do chamado"
                  className="outline-none placeholder:italic mt-1 rounded text-center text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit text-center grow"
                />
              </div>
              {info.statusChamado != "ABERTO" ? (
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
              {message && (
                <p className="text-center text-green-300 mt-2 italic">
                  {message}
                </p>
              )}
              <div className="text-center">
                <button
                  onClick={saveCallChanges}
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

export default ModalCallSuporte;
