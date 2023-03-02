import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ModalCallPPS from "../../components/ModalCallPPS";
import { AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import Link from "next/link";
import Select from "react-select";
import dayjs from "dayjs";
import { AppContext } from "../../context/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import FetchDataButton from "../../components/utils/FetchDataButton";
import FilterButton from "../../components/utils/FilterButton";
var dateFilterParam = new Date();
dateFilterParam.setHours(0, 0, 0, 0);
dateFilterParam.setDate(dateFilterParam.getDate() - 2);
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

function ChamadosPPS() {
  // Context and utils
  const { credentials } = useContext(AppContext);
  const router = useRouter();

  const [openCallsDropdownMenuVisible, setOpenCallsDropdownMenuVisible] =
    useState(false);
  const [closedCallsDropdownMenuVisible, setClosedCallsDropdownMenuVisible] =
    useState(false);

  // Data Holders
  const [inProgress, setInProgress] = useState([]);
  const [filteredInProgress, setFilteredInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);

  const [stats, setStats] = useState({});
  // Modal handlers
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
  //Filters
  const [closedFilterDate, setClosedFilterDate] = useState({
    after: dateFilterParam,
    before: new Date(),
  });
  const [filters, setFilters] = useState({
    respFilter: [],
    statusFilter: [],
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [respFilter, setRespFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  // Functions
  function getCalls() {
    axios.get("/api/calls/pps/mainData").then((res) => {
      setStats(res.data.stats);
      setInProgress(res.data.inProgress);
      setFilteredInProgress(res.data.inProgress);
      setClosedCalls(res.data.closedCalls);
      setRespFilter([]);
      setStatusFilter([]);
    });
  }
  function filterOpenCalls() {
    var newArr;
    if (filters.statusFilter.length > 0 && filters.respFilter.length > 0) {
      newArr = inProgress.filter(
        (call) =>
          filters.respFilter.includes(call.responsavel) &&
          filters.statusFilter.includes(call.status)
      );
    } else if (filters.respFilter.length > 0) {
      newArr = inProgress.filter((call) =>
        filters.respFilter.includes(call.responsavel)
      );
    } else if (filters.statusFilter.length > 0) {
      newArr = inProgress.filter((call) =>
        filters.statusFilter.includes(call.status)
      );
    }
    if (!newArr) setFilteredInProgress(inProgress);
    else {
      setFilteredInProgress(newArr);
    }
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let newArr = inProgress.filter((call) =>
        call.vendedor.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredInProgress(newArr);
    } else {
      setFilteredInProgress(inProgress);
    }
  }
  function filterClosedCallsByDate() {
    axios
      .post("/api/calls/pps/filteredByDate", {
        date: closedFilterDate,
      })
      .then((res) => setClosedCalls(res.data));
  }
  function filterOpenCallsByResp(responsavel, status) {
    if (responsavel) {
      if (respFilter.includes(responsavel)) {
        let index = respFilter.indexOf(responsavel);
        respFilter.splice(index, 1);
      } else {
        respFilter.push(responsavel);
      }
    }
    if (status) {
      if (statusFilter.includes(status)) {
        let index = statusFilter.indexOf(status);
        statusFilter.splice(index, 1);
      } else {
        statusFilter.push(status);
      }
    }
    setRespFilter(respFilter);
    setStatusFilter(statusFilter);
    axios
      .post("/api/calls/pps/filteredByResp", {
        responsavel:
          respFilter.length > 0
            ? respFilter
            : ["ADRIANO", "ARTHUR", "MATHEUS", "A DEFINIR", null],
        status:
          statusFilter.length > 0 ? statusFilter : ["EM ANDAMENTO", "PENDENTE"],
      })
      .then((res) => setInProgress(res.data));
  }
  function updateModalInfo(id) {
    axios.get(`/api/calls/getPPS/${id}`).then((res) => {
      setModalCall(res.data);
      getCalls();
    });
  }
  function handleOpenModal(call) {
    setModalCall(call);
    setModalIsOpen(true);
  }
  useEffect(() => {
    if (
      credentials.accessibleRoutes.includes("PPS") ||
      credentials.visualizacao == "REGIONAL"
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
          CHAMADOS DE SUPORTE AO VENDEDOR
        </p>
        <FetchDataButton
          text={"ATUALIZAR"}
          icon={<AiOutlineReload />}
          handleClick={getCalls}
        />
      </div>
      {/* Abertos */}
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
                    value={searchFilter}
                    onChange={(e) => handleSearchFilter(e.target.value)}
                    className="outline-none p-1.5  w-full lg:w-[350px] h-[41px] rounded border border-gray-200 placeholder:italic"
                    placeholder="DIGITE O NOME DO VENDEDOR"
                  />
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
                        setFilters({
                          ...filters,
                          statusFilter: e.map((x) => x.value),
                        })
                      }
                      options={[
                        {
                          value: "PENDENTE",
                          label: "PENDENTE",
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
                        setFilters({
                          ...filters,
                          respFilter: e.map((x) => x.value),
                        })
                      }
                      options={[
                        {
                          value: "ADRIANO",
                          label: "ADRIANO",
                        },
                        {
                          value: "ARTHUR",
                          label: "ARTHUR",
                        },
                        {
                          value: "NATHAN",
                          label: "NATHAN",
                        },
                        {
                          value: "MATHEUS",
                          label: "MATHEUS",
                        },
                        {
                          value: "A DEFINIR",
                          label: "A DEFINIR",
                        },
                      ]}
                    />
                  </div>
                  <FilterButton
                    text={"FILTRAR"}
                    icon={<AiOutlineSearch />}
                    handleClick={filterOpenCalls}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2 flex-wrap gap-2 justify-around">
          {filteredInProgress.map((call) => (
            <div
              key={call._id}
              onClick={() => handleOpenModal(call)}
              className="w-full lg:w-[450px] max-h-[240px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between items-center w-full">
                <h1 className="text-xs text-center">{call.vendedor}</h1>
                <p className="text-xs text-center">
                  {call.codigoDoProjeto} SVB
                </p>
                <p
                  className={`text-xs font-bold border p-1 text-center rounded-lg ${
                    statusStyles[call.status].textColor
                  } ${statusStyles[call.status].borderColor}`}
                >
                  {call.status}
                </p>
              </div>
              <div className="text-xs mt-2 text-center text-gray-500">
                <p>TIPO DE SOLITAÇÃO : {call.tipoDeSolicitacao}</p>
              </div>
              <div className="flex flex-col mt-3 text-xs max-w-[400px] text-center">
                <p>Observações:</p>
                <p>
                  {call.observacoes
                    ? call.observacoes.trim().length > 160
                      ? `${call.observacoes.substring(0, 160)}...`
                      : call.observacoes
                    : "-"}
                </p>
              </div>
              <div className="flex flex-col mt-3 text-xs max-w-[400px] text-center">
                <p>Responsável:</p>
                <p>{call.responsavel && call.responsavel}</p>
              </div>
              <div className="flex flex-col mt-3 text-xs max-w-[400px] text-center">
                <p
                  className={`${
                    call.demanda == "EXTERNA"
                      ? "text-[#fead61]"
                      : "text-gray-600"
                  }`}
                >
                  {call.demanda == "EXTERNA" && "DEMANDA EXTERNA"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Fechados */}
      <div className="flex flex-col w-full border h-[1200px] lg:h-[500px] border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="text-center text-[#15599a] font-bold text-xl">
                CHAMADOS FINALIZADOS
              </p>
              <p className="font-bold text-[#fead61]">({closedCalls.length})</p>
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
                  <div className="flex flex-wrap gap-x-2 items-center">
                    <p>Entre:</p>
                    <input
                      value={new Date(closedFilterDate.after)
                        .toISOString()
                        .slice(0, 10)}
                      onChange={(e) =>
                        setClosedFilterDate({
                          ...closedFilterDate,
                          after: new Date(e.target.value),
                        })
                      }
                      type="date"
                      className="border border-gray-200 outline-none p-2"
                    />
                    <p>&</p>
                    <input
                      value={dayjs(closedFilterDate.before).format(
                        "YYYY-MM-DD"
                      )}
                      onChange={(e) =>
                        setClosedFilterDate({
                          ...closedFilterDate,
                          before: new Date(
                            dayjs(e.target.value).add(22, "hours")
                          ),
                        })
                      }
                      type="date"
                      className="border border-gray-200 outline-none p-2"
                    />
                  </div>
                  <FetchDataButton
                    handleClick={filterClosedCallsByDate}
                    text={"BUSCAR"}
                    icon={<MdDateRange />}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2 flex-wrap gap-2 justify-around">
          {closedCalls.map((call) => (
            <div
              key={call._id}
              onClick={() => handleOpenModal(call)}
              className="w-full max-h-[100px] lg:w-[300px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between items-center w-full">
                <h1>{call.vendedor}</h1>
                <p
                  className={`text-xs font-bold border p-1 rounded-lg ${
                    statusStyles[call.status].textColor
                  } ${statusStyles[call.status].borderColor}`}
                >
                  {call.status}
                </p>
              </div>
              <div className="text-xs mt-2 text-gray-500">
                <p>TIPO DE SOLICITAÇÃO : {call.tipoDeSolicitacao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link href="/publico/chamadoExternoPPS">
        <div className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">Novo chamado</p>
        </div>
      </Link>
      {modalIsOpen && (
        <ModalCallPPS
          modalIsOpen={modalIsOpen}
          credentials={credentials}
          updateModalInfo={updateModalInfo}
          info={modalCall}
          setModalIsOpen={setModalIsOpen}
          open={modalIsOpen}
        />
      )}
    </div>
  );
}

export default ChamadosPPS;
