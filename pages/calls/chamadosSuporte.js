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
import { cities } from "../../utils/constants";
import { AppContext } from "../../context/AppContext";

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
  const [inProgress, setInProgress] = useState([]);
  const [filteredInProgress, setFilteredInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);
  const [filteredClosedCalls, setFilteredClosedCalls] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [creationModal, setCreationModal] = useState(false);
  const [modalCall, setModalCall] = useState({});
  const [closedFilterDate, setClosedFilterDate] = useState({
    after: dateFilterParam,
    before: new Date(),
  });
  const [filters, setFilters] = useState({
    respFilter: [],
    statusFilter: [],
    cityFilter: [],
  });
  const [closedCallsFilter, setClosedCallsFilter] = useState({
    cidadeFilter: [],
    searchFilter: "",
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [searchByType, setSearchByType] = useState("");
  function getCalls() {
    axios.get("/api/calls/suporte/mainData").then((res) => {
      setInProgress(res.data.openCalls);
      setFilteredInProgress(res.data.openCalls);
      setClosedCalls(res.data.closedCalls);
      setFilteredClosedCalls(res.data.closedCalls);
    });
  }
  function filterClosedCallsByDate() {
    axios
      .post("/api/calls/suporte/filteredByDate", {
        date: closedFilterDate,
      })
      .then((res) => {
        setFilteredClosedCalls(res.data);
        setClosedCalls(res.data);
      });
  }
  function filterInProgressCalls() {
    var newArr;
    if (filters.statusFilter.length > 0 && filters.respFilter.length > 0) {
      newArr = inProgress.filter(
        (call) =>
          filters.respFilter.includes(call.responsavel) &&
          filters.statusFilter.includes(call.statusChamado)
      );
    } else if (filters.respFilter.length > 0) {
      newArr = inProgress.filter((call) =>
        filters.respFilter.includes(call.responsavel)
      );
    } else if (filters.statusFilter.length > 0) {
      newArr = inProgress.filter((call) =>
        filters.statusFilter.includes(call.statusChamado)
      );
    }
    if (filters.cityFilter.length > 0) {
      if (!newArr) newArr = inProgress;
      newArr = newArr.filter((call) =>
        filters.cityFilter.includes(call.cidade)
      );
    }
    if (!newArr) setFilteredInProgress(inProgress);
    else {
      setFilteredInProgress(newArr);
    }
  }
  function filterCloseCalls() {
    var newArr;
    if (closedCallsFilter.cidadeFilter.length > 0) {
      if (!newArr) newArr = closedCalls;
      newArr = newArr.filter((call) =>
        closedCallsFilter.cidadeFilter.includes(call.cidade)
      );
    }
    if (closedCallsFilter.searchFilter.length > 0) {
      if (!newArr) newArr = closedCalls;
      newArr = closedCalls.filter((call) =>
        call.tipoChamado
          .toUpperCase()
          .includes(closedCallsFilter.searchFilter.toUpperCase())
      );
    }
    if (!newArr) setFilteredClosedCalls(closedCalls);
    else {
      setFilteredClosedCalls(newArr);
    }
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let newArr = inProgress.filter((call) =>
        call.nomeCliente
          ? call.nomeCliente.toUpperCase().includes(value.toUpperCase())
          : call.nomeUsina.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredInProgress(newArr);
    } else {
      setFilteredInProgress(inProgress);
    }
  }
  function handleSearchByType(value) {
    setSearchByType(value);
    if (value != "" || " ") {
      let newArr = inProgress.filter((call) =>
        call.tipoChamado.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredInProgress(newArr);
    } else {
      setFilteredInProgress(inProgress);
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
  function updateModalInfo(id) {
    axios.get(`/api/calls/getSuporte/${id}`).then((res) => {
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
      <div className="w-full border max-h-[450px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            Chamados abertos ({filteredInProgress.length})
          </h1>
          <div className="flex flex-wrap justify-center gap-y-2 items-center gap-x-2">
            <input
              type="text"
              value={searchFilter}
              placeholder={"Digite o nome do cliente..."}
              onChange={(e) => handleSearchFilter(e.target.value)}
              className="outline-none text-gray-700 border border-gray-200 px-2 py-1.5 rounded-md"
            />
            <input
              value={searchByType}
              onChange={(e) => handleSearchByType(e.target.value)}
              placeholder="Digite o tipo do chamado..."
              className="outline-none text-gray-700 border border-gray-200 px-2 py-1.5 rounded-md"
            />
            <Select
              isMulti
              placeholder="CIDADE"
              onChange={(e) =>
                setFilters({ ...filters, cityFilter: e.map((x) => x.value) })
              }
              options={cities.map((city) => {
                return { value: city.name, label: city.name };
              })}
            />
            <Select
              isMulti
              placeholder="STATUS DO CHAMADOS"
              onChange={(e) =>
                setFilters({ ...filters, statusFilter: e.map((x) => x.value) })
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
                setFilters({ ...filters, respFilter: e.map((x) => x.value) })
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
        <div className="flex max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredInProgress.map((call) => (
            <div
              onClick={() => handleOpenModal(call)}
              key={call._id}
              className="w-[420px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between items-center w-full">
                <h1 className="uppercase text-sm">
                  {call.nomeUsina ? call.nomeUsina : call.nomeCliente}
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
                <p className="text-xs text-gray-500">
                  {new Date(call.abertura).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border max-h-[750px] lg:max-h-[450px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 gap-y-2 lg:gap-y-0">
          <h1 className="col-span-1 text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            CHAMADOS FINALIZADOS ({filteredClosedCalls.length})
          </h1>
          <div className="col-span-2 flex-wrap flex gap-x-2 items-center justify-around">
            <div className="flex gap-x-2 items-center">
              <input
                value={closedCallsFilter.searchFilter}
                onChange={(e) =>
                  setClosedCallsFilter({
                    ...closedCallsFilter,
                    searchFilter: e.target.value,
                  })
                }
                placeholder="Digite o tipo do chamado..."
                className="outline-none text-gray-700 border border-gray-200 px-2 py-1.5 rounded-md"
              />
              <Select
                isMulti
                placeholder="CIDADE"
                onChange={(e) =>
                  setClosedCallsFilter({
                    ...closedCallsFilter,
                    cidadeFilter: e.map((x) => x.value),
                  })
                }
                options={cities.map((city) => {
                  return { value: city.name, label: city.name };
                })}
              />
              <div
                onClick={filterCloseCalls}
                className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
              >
                <p className="mr-2 text-sm">Filtrar</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center justify-around">
              <p>Entre:</p>
              <input
                value={closedFilterDate.after}
                onChange={(e) =>
                  setClosedFilterDate({
                    ...closedFilterDate,
                    after: e.target.value,
                  })
                }
                type="date"
                className="border border-gray-200 outline-none p-2"
              />
              <p>&</p>
              <input
                value={closedFilterDate.before}
                onChange={(e) =>
                  setClosedFilterDate({
                    ...closedFilterDate,
                    before: e.target.value,
                  })
                }
                type="date"
                className="border border-gray-200 outline-none p-2"
              />
              <div
                onClick={filterClosedCallsByDate}
                className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
              >
                <p className="mr-2 text-sm">Filtrar</p>
                <MdDateRange />
              </div>
            </div>
          </div>
        </div>
        <div className="flex max-h-[500px] lg:max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredClosedCalls.map((call) => (
            <div
              onClick={() => handleOpenModal(call)}
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
      {creationModal && <CreateModal setModalIsOpen={setCreationModal} />}
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
