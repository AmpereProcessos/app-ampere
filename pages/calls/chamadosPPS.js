import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCallPPS from "../../components/ModalCallPPS";
import { AiOutlineReload } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import Link from "next/link";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import dayjs from "dayjs";
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

function ChamadosPPS({ setCredentials, credentials }) {
  const [inProgress, setInProgress] = useState([]);
  const [filteredInProgress, setFilteredInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);
  const [stats, setStats] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
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
  const router = useRouter();
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
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getCalls();
    } else {
      router.push("/auth/authHome");
    }
  }, []);
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
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="flex items-center justify-around w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex gap-x-2">
          <p>CHAMADOS ABERTOS</p>
        </div>
        <div
          onClick={getCalls}
          className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
        >
          <p className="mr-2 text-sm">Atualizar</p>
          <AiOutlineReload />
        </div>
        <Link href="/calls/ppsReport">
          <button className="bg-[#15599a] font-bold text-white hover:text-black hover:bg-[#fead61] p-2 rounded-lg">
            Relátorio
          </button>
        </Link>
      </div>
      <div className="w-full border flex flex-col h-[550px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex h-[10%] flex-col gap-y-2 lg:gap-y-0 lg:flex-row items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            Chamados abertos ({inProgress.length})
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => handleSearchFilter(e.target.value)}
              className="outline-none border border-gray-200 px-2 py-1"
            />
            <Select
              isMulti
              placeholder="STATUS DO CHAMADOS"
              onChange={(e) =>
                setFilters({ ...filters, statusFilter: e.map((x) => x.value) })
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
            <Select
              isMulti
              placeholder="RESPONSÁVEL"
              onChange={(e) =>
                setFilters({ ...filters, respFilter: e.map((x) => x.value) })
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
                  value: "MATHEUS",
                  label: "MATHEUS",
                },
                {
                  value: "A DEFINIR",
                  label: "A DEFINIR",
                },
              ]}
            />
            <button
              onClick={filterOpenCalls}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-1 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
          </div>
        </div>
        <div className="flex h-[90%] justify-around pb-2 overflow-y-auto overscroll-y-auto gap-3 mt-4 flex-wrap">
          {filteredInProgress.map((call) => (
            <div
              key={call._id}
              onClick={() => handleOpenModal(call)}
              className="w-[450px] h-[240px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
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
                  {console.log(call.observacoes.length)}
                  {call.observacoes
                    ? call.observacoes.trim().length > 250
                      ? `${call.observacoes.substring(0, 250)}...`
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
                    call.demanda == "EXTERNA" ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  {call.demanda == "EXTERNA" && "DEMANDA EXTERNA"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border max-h-[750px] lg:max-h-[450px] border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            CHAMADOS FINALIZADOS
          </h1>
          <p>{closedCalls.length} resolvidos no período</p>
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
              value={dayjs(closedFilterDate.before).format("YYYY-MM-DD")}
              onChange={(e) =>
                setClosedFilterDate({
                  ...closedFilterDate,
                  before: new Date(dayjs(e.target.value).add(22, "hours")),
                })
              }
              type="date"
              className="border border-gray-200 outline-none p-2"
            />
          </div>
          <div
            onClick={filterClosedCallsByDate}
            className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
          >
            <p className="mr-2 text-sm">Filtrar</p>
            <MdDateRange />
          </div>
        </div>
        <div className="flex mt-2 max-h-[500px] lg:max-h-[350px] overflow-y-auto overscroll-y-auto flex-wrap gap-2 justify-around">
          {closedCalls.map((call) => (
            <div
              key={call._id}
              onClick={() => handleOpenModal(call)}
              className="w-[300px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
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
      <Link href="/publico/chamadoInternoPPS">
        <div className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">Novo chamado</p>
        </div>
      </Link>
      {modalIsOpen && (
        <ModalCallPPS
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
