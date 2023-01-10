import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ModalCallSuporte from "../../components/ModalCallSuporte";
import CreateModal from "../../components/SuportCallCreation";
import { AiOutlineReload } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { BsFillPatchCheckFill } from "react-icons/bs";
import Link from "next/link";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import {
  cidadesAtendidas,
  cities,
  tiposChamadosSuporte,
} from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";

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
var dateFilterParam = new Date();
dateFilterParam.setDate(dateFilterParam.getDate() - 2);
function ChamadosSuporte() {
  const { credentials, setCredentials } = useContext(AppContext);
  const router = useRouter();
  // Array com os chamados, filtrados ou não.
  const [inProgress, setInProgress] = useState([]);
  const [filteredInProgress, setFilteredInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);
  const [filteredClosedCalls, setFilteredClosedCalls] = useState([]);
  // Controle booleano da abertura de modais
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [creationModal, setCreationModal] = useState(false);
  // Controle do chamado da modal
  const [modalCall, setModalCall] = useState({});
  // Controle de filtros
  const [inProgressCallsFilters, setInProgressCallsFilters] = useState({
    searchFilter: "",
    respFilter: [],
    statusFilter: [],
    cityFilter: [],
    typeFilter: [],
  });
  const [closedCallsFilters, setClosedCallsFilters] = useState({
    searchFilter: "",
    respFilter: [],
    cityFilter: [],
    typeFilter: [],
    afterDateFilter: dateFilterParam,
    beforeDateFilter: new Date(),
  });
  function getCalls() {
    axios
      .get(
        `/api/calls/suporte/mainData?closedAfter=${closedCallsFilters.afterDateFilter}&closedBefore=${closedCallsFilters.beforeDateFilter}`
      )
      .then((res) => {
        setInProgress(res.data.openCalls);
        setFilteredInProgress(res.data.openCalls);
        setClosedCalls(res.data.closedCalls);
        setFilteredClosedCalls(res.data.closedCalls);
      });
  }
  function getClosedCallsByDate() {
    axios
      .post("/api/calls/suporte/filteredByDate", {
        date: {
          after: closedCallsFilters.afterDateFilter,
          before: closedCallsFilters.beforeDateFilter,
        },
      })
      .then((res) => {
        setFilteredClosedCalls(res.data);
        setClosedCalls(res.data);
      });
  }
  function filterInProgressCalls() {
    var newArr;
    if (
      inProgressCallsFilters.statusFilter.length > 0 &&
      inProgressCallsFilters.respFilter.length > 0
    ) {
      newArr = inProgress.filter(
        (call) =>
          inProgressCallsFilters.respFilter.includes(call.responsavel) &&
          inProgressCallsFilters.statusFilter.includes(call.statusChamado)
      );
    } else if (inProgressCallsFilters.respFilter.length > 0) {
      newArr = inProgress.filter((call) =>
        inProgressCallsFilters.respFilter.includes(call.responsavel)
      );
    } else if (inProgressCallsFilters.statusFilter.length > 0) {
      newArr = inProgress.filter((call) =>
        inProgressCallsFilters.statusFilter.includes(call.statusChamado)
      );
    }
    if (inProgressCallsFilters.cityFilter.length > 0) {
      if (!newArr) newArr = inProgress;
      newArr = newArr.filter((call) =>
        inProgressCallsFilters.cityFilter.includes(call.cidade)
      );
    }
    if (inProgressCallsFilters.typeFilter.length > 0) {
      if (!newArr) newArr = inProgress;
      newArr = newArr.filter((call) =>
        inProgressCallsFilters.typeFilter.includes(call.tipoChamado)
      );
    }
    if (!newArr) {
      setFilteredInProgress(inProgress);
      return inProgress;
    } else {
      setFilteredInProgress(newArr);
      return newArr;
    }
  }
  function filterClosedCalls() {
    var newArr;
    if (closedCallsFilters.cityFilter.length > 0) {
      if (!newArr) newArr = closedCalls;
      newArr = newArr.filter((call) =>
        closedCallsFilters.cityFilter.includes(call.cidade)
      );
    }
    if (closedCallsFilters.typeFilter.length > 0) {
      if (!newArr) newArr = closedCalls;
      newArr = newArr.filter((call) =>
        closedCallsFilters.typeFilter.includes(call.tipoChamado)
      );
    }
    if (closedCallsFilters.respFilter.length > 0) {
      if (!newArr) newArr = closedCalls;
      newArr = newArr.filter((call) =>
        closedCallsFilters.respFilter.includes(call.responsavel)
      );
    }
    if (!newArr) {
      setFilteredClosedCalls(closedCalls);
      return closedCalls;
    } else {
      setFilteredClosedCalls(newArr);
      return newArr;
    }
  }
  // Filtros de pesquisa
  function handleInProgressCallsSearchFilter(value) {
    setInProgressCallsFilters({
      ...inProgressCallsFilters,
      searchFilter: value,
    });
    if (value != "" || " ") {
      let filteredByOptions = filterInProgressCalls();
      let newArr = filteredByOptions.filter((call) =>
        call.nomeCliente
          ? call.nomeCliente.toUpperCase().includes(value.toUpperCase())
          : call.nomeUsina.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredInProgress(newArr);
    } else {
      setFilteredInProgress(inProgress);
    }
  }
  function handleClosedCallsSearchFilter(value) {
    setClosedCallsFilters({ ...closedCallsFilters, searchFilter: value });
    if (value != "" || " ") {
      let filteredByOptions = filterClosedCalls();
      let newArr = filteredByOptions.filter((call) =>
        call.nomeCliente
          ? call.nomeCliente.toUpperCase().includes(value.toUpperCase())
          : call.nomeUsina.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredClosedCalls(newArr);
    } else {
      setFilteredClosedCalls(inProgress);
    }
  }
  function updateModalInfo(id) {
    axios.get(`/api/calls/getSuporte/${id}`).then((res) => {
      setModalCall(res.data);
      getCalls();
    });
  }
  function handleOpenModal(id) {
    axios.get(`/api/calls/getSuporte/${id}`).then((res) => {
      setModalCall(res.data);
      setModalIsOpen(true);
    });
  }
  function getDeadlineStatus(
    tipoDoChamado,
    plano,
    statusPlano,
    abertura,
    statusChamado
  ) {
    if (statusChamado == "ABERTO") {
      let tipoInfo = tiposChamadosSuporte.filter(
        (chamado) => chamado.tipo == tipoDoChamado
      )[0];
      var grau;
      if (plano && plano != "MANUTENÇÃO PREVENTIVA" && statusPlano != true) {
        grau = tipoInfo ? tipoInfo.grauUrgenciaOeM : "B";
      } else {
        grau = tipoInfo ? tipoInfo.grauUrgenciaNormal : "B";
      }
      let diffTempo = dayjs().diff(dayjs(abertura), "hours");
      if (grau == "A" && diffTempo > 24) {
        return "border-red-500";
      } else if (grau == "B" && diffTempo > 48) {
        return "border-red-500";
      } else if (grau == "C" && diffTempo > 72) {
        return "border-red-500";
      } else if (grau == "D" && diffTempo > 96) {
        return "border-red-500";
      } else {
        return "border-gray-200";
      }
    } else {
      return "border-gray-200";
    }
  }
  useEffect(() => {
    if (
      credentials.accessibleRoutes?.includes("O&M") ||
      credentials.accessibleRoutes.includes("Pós-Venda")
    ) {
      getCalls();
    } else {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="flex items-center justify-around w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex gap-x-2">
          <p>CHAMADOS ABERTOS:</p>
          <p>{inProgress.length}</p>
        </div>
        <div
          onClick={getCalls}
          className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
        >
          <p className="mr-2 text-sm">Atualizar</p>
          <AiOutlineReload />
        </div>
      </div>
      <div className="w-full border max-h-[575px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            Chamados abertos ({filteredInProgress.length})
          </h1>
          <div className="flex flex-wrap justify-center gap-y-2 items-center gap-x-2">
            <input
              type="text"
              value={inProgressCallsFilters.searchFilter}
              placeholder={"Digite o nome do cliente..."}
              onChange={(e) =>
                handleInProgressCallsSearchFilter(e.target.value)
              }
              className="outline-none text-gray-700 border border-gray-200 px-2 py-1.5 rounded-sm"
            />
            <Select
              isMulti
              placeholder="TIPO DE CHAMADO"
              onChange={(e) =>
                setInProgressCallsFilters({
                  ...inProgressCallsFilters,
                  typeFilter: e.map((x) => x.value),
                })
              }
              options={tiposChamadosSuporte.map((chamado) => {
                return { value: chamado.tipo, label: chamado.tipo };
              })}
            />
            <Select
              isMulti
              placeholder="CIDADE"
              onChange={(e) =>
                setInProgressCallsFilters({
                  ...inProgressCallsFilters,
                  cityFilter: e.map((x) => x.value),
                })
              }
              options={cidadesAtendidas.map((cidade) => {
                return { value: cidade, label: cidade };
              })}
            />
            <Select
              isMulti
              placeholder="STATUS DO CHAMADOS"
              onChange={(e) =>
                setInProgressCallsFilters({
                  ...inProgressCallsFilters,
                  statusFilter: e.map((x) => x.value),
                })
              }
              options={[
                {
                  value: "ABERTO",
                  label: "ABERTO",
                },
                {
                  value: "EM ANDAMENTO",
                  label: "EM ANDAMENTO",
                },
              ]}
            />
            <Select
              isMulti
              placeholder="RESPONSÁVEL"
              onChange={(e) =>
                setInProgressCallsFilters({
                  ...inProgressCallsFilters,
                  respFilter: e.map((x) => x.value),
                })
              }
              options={[
                {
                  value: "GABRIEL MARTINS",
                  label: "GABRIEL MARTINS",
                },
                {
                  value: "LUCAS FERNANDES",
                  label: "LUCAS FERNANDES",
                },
                {
                  value: "LUIS EDUARDO",
                  label: "LUIS EDUARDO",
                },
                {
                  value: "A DEFINIR",
                  label: "A DEFINIR",
                },
              ]}
            />
            <button
              onClick={filterInProgressCalls}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-1.5 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
          </div>
        </div>
        <div className="flex max-h-[425px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredInProgress.map((call) => (
            <div
              onClick={() => handleOpenModal(call._id)}
              key={call._id}
              className={`w-[420px] cursor-pointer border ${getDeadlineStatus(
                call.tipoChamado,
                call.plano,
                call.oemConcluido,
                call.abertura,
                call.statusChamado
              )} p-3 hover:bg-blue-100`}
            >
              <div className="flex justify-between gap-3 items-center w-full">
                <h1 className="uppercase text-sm">
                  {call.nomeCliente ? call.nomeCliente : call.nomeUsina}
                </h1>
                {call.cidade && (
                  <p className="text-xs uppercase text-gray-700">
                    {call.cidade}
                  </p>
                )}
                <p
                  className={`text-xs text-center font-bold border p-1 rounded-lg ${
                    statusStyles[call.statusChamado].textColor
                  } ${statusStyles[call.statusChamado].borderColor}`}
                >
                  {call.statusChamado}
                </p>
              </div>
              <div className="flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">Responsável:</p>
                <p className="text-xs text-gray-500">{call.responsavel}</p>
              </div>
              <div className="hidden lg:flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">DEMANDA</p>
                <p
                  className={`text-xs ${
                    call.demanda == "EXTERNA" ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {call.demanda ? call.demanda : "-"}
                </p>
              </div>
              <div className="flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">
                  Tipo de chamado:
                </p>
                <p className="text-xs text-gray-500">{call.tipoChamado}</p>
              </div>
              <div className="flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">ABERTURA</p>
                <p className="text-xxs text-gray-500 uppercase">
                  {dayjs().diff(dayjs(call.abertura), "hours")} horas em aberto
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(call.abertura).toLocaleString()}
                </p>
              </div>
              {call.tipoChamado.includes("GARANTIA") &&
              call.statusGarantia != "IDENTIFICAÇÃO E TESTES" &&
              (!call.ultAtualizacaoCliente ||
                dayjs().diff(dayjs(call.ultAtualizacaoCliente), "days") >=
                  7) ? (
                <p className="text-center font-bold text-red-500">
                  ATUALIZAR CLIENTE
                </p>
              ) : (
                false
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border max-h-[750px] lg:max-h-[550px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <h1 className="col-span-1 text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
              CHAMADOS FINALIZADOS ({filteredClosedCalls.length})
            </h1>
            <div className="flex gap-x-2 items-center justify-around">
              <p>Entre:</p>
              <input
                value={dayjs(closedCallsFilters.afterDateFilter).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) =>
                  setClosedCallsFilters({
                    ...closedCallsFilters,
                    afterDateFilter: e.target.value,
                  })
                }
                type="date"
                className="border border-gray-200 outline-none p-2"
              />
              <p>&</p>
              <input
                value={dayjs(closedCallsFilters.beforeDateFilter).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) =>
                  setClosedCallsFilters({
                    ...closedCallsFilters,
                    beforeDateFilter: e.target.value,
                  })
                }
                type="date"
                className="border border-gray-200 outline-none p-2"
              />
              <div
                onClick={getClosedCallsByDate}
                className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
              >
                <p className="mr-2 text-sm">BUSCAR CHAMADOS</p>
                <MdDateRange />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex gap-x-2 items-center">
              <input
                value={closedCallsFilters.searchFilter}
                onChange={(e) => handleClosedCallsSearchFilter(e.target.value)}
                placeholder="Digite o nome do cliente/usina..."
                className="outline-none text-gray-700 border border-gray-200 px-2 py-1.5 rounded-md w-[280px]"
              />
              <Select
                isMulti
                placeholder="TIPO DE CHAMADO"
                onChange={(e) =>
                  setClosedCallsFilters({
                    ...closedCallsFilters,
                    typeFilter: e.map((x) => x.value),
                  })
                }
                options={tiposChamadosSuporte.map((chamado) => {
                  return { value: chamado.tipo, label: chamado.tipo };
                })}
              />
              <Select
                isMulti
                placeholder="CIDADE"
                onChange={(e) =>
                  setClosedCallsFilters({
                    ...closedCallsFilters,
                    cityFilter: e.map((x) => x.value),
                  })
                }
                options={cidadesAtendidas.map((cidade) => {
                  return { value: cidade, label: cidade };
                })}
              />
              <Select
                isMulti
                placeholder="RESPONSÁVEL"
                onChange={(e) =>
                  setClosedCallsFilters({
                    ...closedCallsFilters,
                    respFilter: e.map((x) => x.value),
                  })
                }
                options={[
                  {
                    value: "GABRIEL MARTINS",
                    label: "GABRIEL MARTINS",
                  },
                  {
                    value: "LUCAS FERNANDES",
                    label: "LUCAS FERNANDES",
                  },
                  {
                    value: "LUIS EDUARDO",
                    label: "LUIS EDUARDO",
                  },
                  {
                    value: "A DEFINIR",
                    label: "A DEFINIR",
                  },
                ]}
              />
              <div
                onClick={filterClosedCalls}
                className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
              >
                <p className="mr-2 text-sm">Filtrar</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex max-h-[500px] lg:max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredClosedCalls.map((call) => (
            <div
              onClick={() => handleOpenModal(call._id)}
              key={call._id}
              className="w-[370px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between items-center w-full gap-2">
                {call.feedbackValor != undefined && call.feedbackValor != "" ? (
                  <BsFillPatchCheckFill
                    style={{
                      fontSize: "20px",
                      color: "rgb(21 128 61)",
                      marginLeft: "3px",
                    }}
                  />
                ) : (
                  false
                )}
                <h1 className="uppercase text-sm">
                  {call.nomeCliente ? call.nomeCliente : call.nomeUsina}
                </h1>
                {call.cidade && (
                  <p className="text-xs uppercase text-gray-700">
                    {call.cidade}
                  </p>
                )}
                <p
                  className={`text-xs font-bold border p-1 rounded-lg ${
                    statusStyles[call.statusChamado].textColor
                  } ${statusStyles[call.statusChamado].borderColor}`}
                >
                  {call.statusChamado}
                </p>
              </div>
              <div className="flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">Responsável:</p>
                <p className="text-xs text-gray-500">{call.responsavel}</p>
              </div>
              {call.demanda && (
                <div className="hidden lg:flex justify-between mt-2 items-center w-full">
                  <p className="text-xs text-gray-500 uppercase">DEMANDA</p>
                  <p className="text-xs text-gray-500">{call.demanda}</p>
                </div>
              )}
              <div className="flex justify-between mt-2 items-center w-full">
                <p className="text-xs text-gray-500 uppercase">
                  Tipo de chamado:
                </p>
                <p className="text-xs text-gray-500">{call.tipoChamado}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        onClick={() => setCreationModal(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">Novo chamado</p>
      </div>
      {creationModal && (
        <CreateModal getCalls={getCalls} setModalIsOpen={setCreationModal} />
      )}
      {modalIsOpen && (
        <ModalCallSuporte
          credentials={credentials}
          updateModalInfo={updateModalInfo}
          setModalIsOpen={setModalIsOpen}
          info={modalCall}
        />
      )}
    </div>
  );
}

export default ChamadosSuporte;
