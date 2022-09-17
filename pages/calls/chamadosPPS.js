import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCallPPS from "../../components/ModalCallPPS";
import { AiOutlineReload } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import Link from "next/link";
var dateFilterParam = new Date();
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
  const [closedCalls, setClosedCalls] = useState([]);
  const [stats, setStats] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
  const [closedFilterDate, setClosedFilterDate] = useState({
    after: dateFilterParam,
    before: new Date(),
  });
  const [respFilter, setRespFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const router = useRouter();
  function getCalls() {
    axios.get("/api/calls/pps/mainData").then((res) => {
      setStats(res.data.stats);
      setInProgress(res.data.inProgress);
      setClosedCalls(res.data.closedCalls);
      setRespFilter([]);
      setStatusFilter([]);
    });
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
            : ["ADRIANO", "ARTHUR", "MATHEUS", "A DEFINIR"],
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
          <p>CHAMADOS ABERTOS:</p>
          <p>{stats.openCallsCount}</p>
        </div>
        <div
          onClick={getCalls}
          className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
        >
          <p className="mr-2 text-sm">Atualizar</p>
          <AiOutlineReload />
        </div>
      </div>
      <div className="w-full border max-h-[400px] overflow-y-auto overscroll-y-auto border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            Chamados abertos
          </h1>
          <div className="flex items-center gap-x-2">
            <p
              onClick={() => filterOpenCallsByResp(undefined, "PENDENTE")}
              className={`border cursor-pointer border-gray-200 ${
                statusFilter.includes("PENDENTE")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              PENDENTE
            </p>
            <p
              onClick={() => filterOpenCallsByResp(undefined, "EM ANDAMENTO")}
              className={`border cursor-pointer border-gray-200 ${
                statusFilter.includes("EM ANDAMENTO")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              EM ANDAMENTO
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <p
              onClick={() => filterOpenCallsByResp("ADRIANO", undefined)}
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("ADRIANO")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              ADRIANO
            </p>
            <p
              onClick={() => filterOpenCallsByResp("ARTHUR", undefined)}
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("ARTHUR")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              ARTHUR
            </p>
            <p
              onClick={() => filterOpenCallsByResp("MATHEUS", undefined)}
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("MATHEUS")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              MATHEUS
            </p>
            <p
              onClick={() => filterOpenCallsByResp("A DEFINIR", undefined)}
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("A DEFINIR")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              A DEFINIR
            </p>
          </div>
        </div>
        <div className="flex justify-around overflow-y-auto gap-3 mt-4 flex-wrap">
          {inProgress.map((call) => (
            <div
              key={call._id}
              onClick={() => handleOpenModal(call)}
              className="w-[420px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
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
                <p>{call.observacoes && call.observacoes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border max-h-[450px] overflow-y-auto overscroll-y-auto border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            CHAMADOS FINALIZADOS
          </h1>
          <div className="flex gap-x-2 items-center">
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
          </div>
          <div
            onClick={filterClosedCallsByDate}
            className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
          >
            <p className="mr-2 text-sm">Filtrar</p>
            <MdDateRange />
          </div>
        </div>
        <div className="flex mt-2 flex-wrap gap-2 justify-around">
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
                <p>TIPO DE SOLITAÇÃO : {call.tipoDeSolicitacao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link href="/publico/chamadosPPS">
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
