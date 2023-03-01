import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ModalCallSuporte from "../../components/ModalCallSuporte";
import CreateModal from "../../components/SuportCallCreation";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
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
import FetchDataButton from "../../components/utils/FetchDataButton";
import { AnimatePresence, motion } from "framer-motion";
import FilterButton from "../../components/utils/FilterButton";

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

  const [openCallsDropdownMenuVisible, setOpenCallsDropdownMenuVisible] =
    useState(false);
  const [closedCallsDropdownMenuVisible, setClosedCallsDropdownMenuVisible] =
    useState(false);

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
      <div className="flex items-center justify-between w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
        <p className="font-bold uppercase text-center text-2xl text-[#15599a] font-['Roboto']">
          CHAMADOS DE SUPORTE TÉCNICO
        </p>
        <FetchDataButton
          text={"ATUALIZAR"}
          icon={<AiOutlineReload />}
          handleClick={getCalls}
        />
      </div>
      <div className="flex flex-col w-full border h-[1200px] lg:h-[720px] border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="text-center uppercase text-[#15599a] font-bold text-xl">
                Chamados abertos
              </p>
              <p className="font-bold text-[#fead61]">
                ({filteredInProgress.length})
              </p>
            </div>
            {openCallsDropdownMenuVisible ? (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setOpenCallsDropdownMenuVisible(false)}
                />
              </div>
            ) : (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setOpenCallsDropdownMenuVisible(true)}
                />
              </div>
            )}
          </div>
          <AnimatePresence>
            {openCallsDropdownMenuVisible ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col w-full gap-y-2 mt-4"
              >
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <input
                    type="text"
                    className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                    placeholder="DIGITE O NOME DO CLIENTE/USINA"
                    value={inProgressCallsFilters.searchFilter}
                    onChange={(e) =>
                      handleInProgressCallsSearchFilter(e.target.value)
                    }
                  />
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="TIPO DE CHAMADO"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="CIDADE"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="STATUS DO CHAMADOS"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="RESPONSÁVEL"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                          value: "MARCOS DIAS",
                          label: "MARCOS DIAS",
                        },
                        {
                          value: "A DEFINIR",
                          label: "A DEFINIR",
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <FilterButton
                    text={"FILTRAR"}
                    icon={<AiOutlineSearch />}
                    handleClick={filterInProgressCalls}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex grow overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredInProgress.map((call) => (
            <div
              onClick={() => handleOpenModal(call._id)}
              key={call._id}
              className={`w-[420px] max-h-[200px] cursor-pointer border ${getDeadlineStatus(
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
      <div className="flex flex-col w-full border h-[1200px] lg:h-[500px] border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="text-center uppercase text-[#15599a] font-bold text-xl">
                CHAMADOS FINALIZADOS
              </p>
              <p className="font-bold text-[#fead61]">
                ({filteredClosedCalls.length})
              </p>
            </div>
            {closedCallsDropdownMenuVisible ? (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setClosedCallsDropdownMenuVisible(false)}
                />
              </div>
            ) : (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setClosedCallsDropdownMenuVisible(true)}
                />
              </div>
            )}
          </div>
          <AnimatePresence>
            {closedCallsDropdownMenuVisible ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col w-full gap-y-2 mt-4"
              >
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
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
                  <FetchDataButton
                    handleClick={getClosedCallsByDate}
                    text={"BUSCAR"}
                    icon={<MdDateRange />}
                  />
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <input
                    value={closedCallsFilters.searchFilter}
                    onChange={(e) =>
                      handleClosedCallsSearchFilter(e.target.value)
                    }
                    placeholder="DIGITE O NOME DO CLIENTE/USINA"
                    className="outline-none p-1.5  w-full lg:w-[350px] h-[41px] rounded border border-gray-200 placeholder:italic"
                  />
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="TIPO DE CHAMADO"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="CIDADE"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="RESPONSÁVEL"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                          value: "MARCOS DIAS",
                          label: "MARCOS DIAS",
                        },
                        {
                          value: "A DEFINIR",
                          label: "A DEFINIR",
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <FilterButton
                    text={"FILTRAR"}
                    icon={<AiOutlineSearch />}
                    handleClick={filterClosedCalls}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex grow overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredClosedCalls.map((call) => (
            <div
              onClick={() => handleOpenModal(call._id)}
              key={call._id}
              className="w-[370px] max-h-[180px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
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
