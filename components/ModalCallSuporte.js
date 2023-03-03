import React, { useContext, useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { cidadesAtendidas, cities } from "../utils/constants";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import AnexoArquivo from "./AnexoArquivo";
import dayjs from "dayjs";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
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
  modalIsOpen,
}) {
  const { credentials } = useContext(AppContext);
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
  var selectableCities = cidadesAtendidas.filter(
    (cidade) => cidade != info.cidade
  );
  const [infoHolder, setInfo] = useState(info);
  const [message, setMessage] = useState({ text: "", color: "" });
  function saveCallChanges() {
    if (info.statusChamado != infoHolder.statusChamado) {
      ultAlteracoes.statusAlteracoes.usuario = credentials?.id;
      ultAlteracoes.statusAlteracoes.antes = info.statusChamado;
      ultAlteracoes.statusAlteracoes.depois = infoHolder.statusChamado;
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    if (info.anotacoes != infoHolder.anotacoes) {
      ultAlteracoes.anotAlteracoes.usuario = credentials?.id;
      ultAlteracoes.anotAlteracoes.antes = info.anotacoes;
      ultAlteracoes.anotAlteracoes.depois = infoHolder.anotacoes;
      ultAlteracoes.anotAlteracoes.data = new Date().toJSON();
    }
    axios
      .put("/api/calls/suporte/updateSuporte", {
        ...infoHolder,
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        setMessage({ text: res.data, color: "text-green-500" });
        updateModalInfo(info._id);
      });
  }
  function closeCall() {
    if (info.anotacoes?.trim().length > 0) {
      if (info.statusChamado != "RESOLVIDO") {
        ultAlteracoes.statusAlteracoes.usuario = credentials?.id;
        ultAlteracoes.statusAlteracoes.antes = info.statusChamado;
        ultAlteracoes.statusAlteracoes.depois = "RESOLVIDO";
        ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
      }
      axios
        .post("/api/calls/suporte/updateSuporte", {
          ...infoHolder,
          fechamento: new Date(),
          statusChamado: "RESOLVIDO",
          ultAlteracoes: ultAlteracoes,
        })
        .then((res) => {
          updateModalInfo(info._id);
        });
    } else {
      setMessage({
        text: "Por favor, adicione anotações sobre o chamado pra prosseguir com a finalização.",
        color: "text-red-500",
      });
    }
  }
  function reopenCall() {
    if (info.statusChamado != "ABERTO") {
      ultAlteracoes.statusAlteracoes.usuario = credentials?.id;
      ultAlteracoes.statusAlteracoes.antes = info.statusChamado;
      ultAlteracoes.statusAlteracoes.depois = "ABERTO";
      ultAlteracoes.statusAlteracoes.data = new Date().toJSON();
    }
    axios
      .post("/api/calls/suporte/updateSuporte", {
        ...infoHolder,
        fechamento: "",
        statusChamado: "ABERTO",
        ultAlteracoes: ultAlteracoes,
      })
      .then((res) => {
        updateModalInfo(info._id);
      });
  }
  function addLinks(obj) {
    setInfo({
      ...infoHolder,
      links: infoHolder.links ? [...infoHolder.links, obj] : [obj],
    });
    axios
      .put("/api/calls/suporte/updateSuporte", {
        ...infoHolder,
        links:
          infoHolder.links?.length > 0 ? [...infoHolder.links, obj] : [obj],
      })
      .then(() => {
        setMessage({ text: "Link adicionado", color: "text-green-500" });
        updateModalInfo(info._id);
      });
  }
  useEffect(() => {
    setMessage({ text: "", color: "" });
  }, [infoHolder]);
  console.log(infoHolder);
  return (
    <>
      <AnimatedModalWrapper
        modalIsOpen={modalIsOpen}
        width={"47%"}
        height={"80%"}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <h1 className="text-[#15599a] pl-6 uppercase font-bold">
              {info.tipoChamado} {info.equipamento && `- ${info.equipamento}`}
            </h1>
            {info.demanda && (
              <span className="text-xs border border-gray-200 p-2 font-bold text-gray-600">
                DEMANDA {info.demanda}
              </span>
            )}
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
          <p className="text-gray-700 text-center text-xs mt-2 italic">
            {info.fechamento
              ? `${dayjs(dayjs(info.fechamento)).diff(
                  dayjs(info.abertura),
                  "hours"
                )} horas até fechamento`
              : `${dayjs().diff(
                  dayjs(info.abertura),
                  "hours"
                )} horas em aberto`}
          </p>
          <div className="overflow-y-auto">
            {credentials?.accessibleRoutes.includes("Pós-Venda") &&
            info.fechamento ? (
              <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold font-raleway">
                  COLETA DE FEEDBACK
                </span>
                <input
                  value={
                    infoHolder.feedbackValor ? infoHolder.feedbackValor : ""
                  }
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      feedbackValor: Number(e.target.value),
                    })
                  }
                  className="outline-none text-sm text-center grow placeholder:italic"
                  type="number"
                  max={10}
                  min={0}
                />
              </div>
            ) : (
              false
            )}
            <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="font-bold font-raleway">STATUS</span>
              <div className="flex gap-x-2 justify-center grow">
                {info.statusChamado == "ABERTO" ? (
                  <>
                    <p
                      onClick={() =>
                        setInfo({ ...infoHolder, statusChamado: "ABERTO" })
                      }
                      className={`${
                        infoHolder.statusChamado != "ABERTO" && "opacity-30"
                      } text-xs cursor-pointer font-bold border p-3 w-fit text-center rounded-lg ${
                        info && statusStyles[info?.statusChamado].textColor
                      } ${
                        info && statusStyles[info.statusChamado].borderColor
                      }`}
                    >
                      {info?.statusChamado}
                    </p>
                    <p
                      onClick={() =>
                        setInfo({
                          ...infoHolder,
                          statusChamado: "EM ANDAMENTO",
                        })
                      }
                      className={`${
                        infoHolder.statusChamado != "EM ANDAMENTO" &&
                        "opacity-30"
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
                {info.nomeCliente ? info.nomeCliente : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="text-center font-bold font-raleway">
                NOME DA USINA
              </span>
              <p className="grow text-center font-raleway">
                {info.nomeUsina ? info.nomeUsina : "-"}
              </p>
            </div>
            {info.tipoChamado == "DEFEITOS E GARANTIA" && (
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  EQUIPAMENTO DEFEITUOSO
                </span>
                <select
                  value={
                    infoHolder.equipamento
                      ? infoHolder.equipamento
                      : "NÃO DEFINIDO"
                  }
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      equipamento: e.target.value,
                    })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
                >
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                  <option value={"PLACA"}>PLACA</option>
                  <option value={"INVERSOR/MICRO"}>INVERSOR/MICRO</option>
                  <option value={"COMUNICADOR"}>COMUNICADOR</option>
                </select>
              </div>
            )}
            <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="text-center uppercase font-bold">
                EQUIPE RESPONSÁVEL
              </span>
              <p className="text-sm text-center grow">
                {info.equipeResp ? info.equipeResp : "-"}
              </p>
            </div>
            {![
              "PROBLEMAS COM CONCESSIONÁRIA",
              "GOTEIRA",
              "DISTRIBUIÇÃO DE CRÉDITOS",
              "RETRABALHO EM ESTRUTURA",
            ].includes(info.tipoChamado) && (
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  LINK DA PLANTA
                </span>
                <input
                  value={infoHolder.linkMonitoramento}
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      linkMonitoramento: e.target.value,
                    })
                  }
                  className="outline-none text-sm text-center grow placeholder:italic"
                  type="text"
                />
              </div>
            )}
            <div className="flex justify-center mt-4">
              <a
                href={infoHolder.linkMonitoramento}
                className="text-sm text-center grow text-blue-400"
              >
                {infoHolder.linkMonitoramento
                  ? infoHolder.linkMonitoramento
                  : "-"}
              </a>
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
              <span className="text-center font-bold font-raleway">CIDADE</span>
              <select
                value={infoHolder.cidade}
                onChange={(e) =>
                  setInfo({ ...infoHolder, cidade: e.target.value })
                }
                className="text-xs grow outline-none mt-2 lg:mt-0 text-center"
              >
                {info.cidade && (
                  <option value={info.cidade}>{info.cidade}</option>
                )}
                {selectableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value={"A DEFINIR"}>A DEFINIR</option>
              </select>
            </div>
            <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="text-center font-bold">RESPONSÁVEL</span>
              <select
                value={infoHolder.responsavel}
                onChange={(e) =>
                  setInfo({ ...infoHolder, responsavel: e.target.value })
                }
                className="text-xs grow outline-none mt-2 lg:mt-0 text-center"
              >
                <option value={"A DEFINIR"}>A DEFINIR</option>
                <option value={"GABRIEL MARTINS"}>GABRIEL MARTINS</option>
                <option value={"MARCOS DIAS"}>MARCOS DIAS</option>
              </select>
            </div>
            <div className="flex flex-col lg:flex-row gap-x-2 justify-center items-center border border-gray-200 p-2 mt-4">
              <span className="text-center font-bold">O.S GERADA?</span>
              <input
                checked={infoHolder.osGerada}
                onChange={(e) =>
                  setInfo({ ...infoHolder, osGerada: e.target.checked })
                }
                type={"checkbox"}
                className={"ml-2"}
              />
            </div>

            <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="font-bold text-center font-raleway">
                DESCRIÇÃO DO PROBLEMA
              </span>
              <span className="grow text-center font-raleway text-sm bg-gray-100 p-4 italic">
                {info.descricaoProblema ? info.descricaoProblema : ""}
              </span>
            </div>
            {info.tipoChamado.includes("GARANTIA") && (
              <>
                <div className="flex flex-col gap-1 border border-gray-200 p-2 mt-4">
                  <span className="text-center font-bold font-raleway">
                    ÚLTIMA ATUALIZAÇÃO DO CLIENTE
                  </span>
                  <input
                    value={
                      infoHolder.ultAtualizacaoCliente
                        ? dayjs(infoHolder.ultAtualizacaoCliente)
                            .add(4, "hours")
                            .format("YYYY-MM-DD")
                        : null
                    }
                    onChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        ultAtualizacaoCliente: new Date(
                          e.target.value
                        ).toISOString(),
                      })
                    }
                    type={"date"}
                    className="grow outline-none text-center font-raleway"
                  />
                </div>
                <div className="flex flex-col gap-1 border border-gray-200 p-2 mt-4">
                  <span className="text-center font-bold font-raleway">
                    STATUS DA GARANTIA
                  </span>
                  <select
                    value={
                      infoHolder.statusGarantia
                        ? infoHolder.statusGarantia
                        : "NÃO DEFINIDO"
                    }
                    onChange={(e) =>
                      setInfo({
                        ...infoHolder,
                        statusGarantia: e.target.value,
                      })
                    }
                    className="text-xs grow outline-none mt-2 lg:mt-0 text-center"
                  >
                    <option value={"IDENTIFICAÇÃO E TESTES"}>
                      IDENTIFICAÇÃO E TESTES
                    </option>
                    <option value={"EM PROCESSO DE APROVAÇÃO"}>
                      EM PROCESSO DE APROVAÇÃO
                    </option>
                    <option value={"APROVADO"}>APROVADO</option>
                    <option value={"EQUIPAMENTO EM ROTA"}>
                      EQUIPAMENTO EM ROTA
                    </option>
                    <option value={"ENTREGUE"}>ENTREGUE</option>
                    <option value={"INSTALADO"}>INSTALADO</option>
                    <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                  </select>
                </div>
              </>
            )}
            <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
              <span className="font-bold text-center font-raleway">
                ANOTAÇÕES
              </span>
              <textarea
                value={infoHolder.anotacoes ? infoHolder.anotacoes : ""}
                onChange={(e) =>
                  setInfo({ ...infoHolder, anotacoes: e.target.value })
                }
                placeholder="Digite aqui as anotações do chamado"
                className="outline-none placeholder:italic mt-1 rounded text-sm p-3 resize-none bg-gray-100 min-h-[175px] h-fit text-center grow"
              />
            </div>
            {info.tipoChamado == "GOTEIRA" ||
            info.tipoChamado == "DEFEITOS E GARANTIA" ? (
              <div className="flex flex-col">
                <h1 className="text-center text-[#15599a] my-2 font-bold">
                  ADIÇÃO DE IMAGENS
                </h1>
                <AnexoArquivo
                  id={infoHolder.idPai}
                  prevLinks={
                    infoHolder.links
                      ? { chamadosSuporte: infoHolder.links }
                      : {}
                  }
                  cliente={
                    infoHolder.nomeCliente
                      ? `${infoHolder.nomeCliente}`
                      : `${infoHolder.nomeUsina}`
                  }
                  categorias={[
                    {
                      label: "CHAMADOS DE SUPORTE",
                      value: "links.chamadosSuporte",
                    },
                  ]}
                  multiple={false}
                  handleUpdates={(_, obj) => addLinks(obj)}
                />
                {infoHolder.links?.length > 0 && (
                  <div className="flex flex-col">
                    <h1 className="text-center font-bold">IMAGENS ANEXADAS</h1>
                    <div className="flex flex-col items-center gap-1">
                      {infoHolder.links.map((obj, index2) => (
                        <a
                          className="text-xs text-[#15599a] font-bold text-center"
                          key={index2}
                          href={obj.link}
                        >
                          {obj.title} ({obj.format})
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              false
            )}
            {info.statusChamado == "RESOLVIDO" ? (
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
            {message.text && (
              <p className={`text-center ${message.color} mt-2 italic`}>
                {message.text}
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
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalCallSuporte;
