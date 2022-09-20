import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCallSuporte from "../../components/ModalCallSuporte";
import { AiOutlineReload } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import Link from "next/link";
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
function ChamadosSuporte({ credentials, setCredentials }) {
  const router = useRouter();
  const [inProgress, setInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);
  const [stats, setStats] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
  const [closedFilterDate, setClosedFilterDate] = useState({
    after: dateFilterParam,
    before: new Date(),
  });
  const [respFilter, setRespFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  function getCalls() {
    axios.get("/api/calls/suporte/mainData").then((res) => {
      setStats(res.data.stats);
      setInProgress(res.data.openCalls);
      setClosedCalls(res.data.closedCalls);
      setRespFilter([]);
      setStatusFilter([]);
    });
  }
  function filterOpenCallsByRespAndStatus(responsavel, status) {
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
      .post("/api/calls/suporte/filtered", {
        responsavel:
          respFilter.length > 0
            ? respFilter
            : ["GABRIEL MARTINS", "LUCAS FERNANDES", "LUIS EDUARDO", "DEFINIR"],
        status:
          statusFilter.length > 0 ? statusFilter : ["ABERTO", "EM ANDAMENTO"],
      })
      .then((res) => setInProgress(res.data));
  }
  function filterClosedCallsByDate() {
    axios
      .post("/api/calls/suporte/filteredByDate", {
        date: closedFilterDate,
      })
      .then((res) => setClosedCalls(res.data));
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
          <p>{stats}</p>
        </div>
        <div
          onClick={getCalls}
          className="flex cursor-pointer hover:bg-orange-500 items-center bg-[#fead61] font-bold p-2 rounded-lg"
        >
          <p className="mr-2 text-sm">Atualizar</p>
          <AiOutlineReload />
        </div>
      </div>
      <div className="w-full border max-h-[400px]  border-gray-200 bg-[#fff] shadow-xl p-4">
        <div className="flex items-center justify-around">
          <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
            Chamados abertos
          </h1>
          <div className="flex items-center gap-x-2">
            <p
              onClick={() =>
                filterOpenCallsByRespAndStatus(undefined, "ABERTO")
              }
              className={`border cursor-pointer border-gray-200 ${
                statusFilter.includes("ABERTO")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              ABERTO
            </p>
            <p
              onClick={() =>
                filterOpenCallsByRespAndStatus(undefined, "EM ANDAMENTO")
              }
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
              onClick={() =>
                filterOpenCallsByRespAndStatus("GABRIEL MARTINS", undefined)
              }
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("GABRIEL MARTINS")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              GABRIEL
            </p>
            <p
              onClick={() =>
                filterOpenCallsByRespAndStatus("LUCAS FERNANDES", undefined)
              }
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("LUCAS FERNANDES")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              LUCAS
            </p>
            <p
              onClick={() =>
                filterOpenCallsByRespAndStatus("LUIS EDUARDO", undefined)
              }
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("LUIS EDUARDO")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              LUIS
            </p>
            <p
              onClick={() =>
                filterOpenCallsByRespAndStatus("DEFINIR", undefined)
              }
              className={`border cursor-pointer border-gray-200 ${
                respFilter.includes("DEFINIR")
                  ? "bg-blue-200 hover:bg-transparent"
                  : "hover:bg-blue-200 bg-transparent"
              } p-2 text-xs text-gray-600`}
            >
              A DEFINIR
            </p>
          </div>
        </div>
        <div className="flex max-h-[350px] overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
          {inProgress.map((call) => (
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
                  <p className="text-xs text-gray-700">{call.cidade}</p>
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
      <div className="w-full border max-h-[450px]  border-gray-200 bg-[#fff] shadow-xl p-4">
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
        <div className="flex max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {closedCalls.map((call) => (
            <div
              onClick={() => handleOpenModal(call)}
              key={call._id}
              className="w-[300px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between items-center w-full">
                <h1 className="uppercase text-sm">
                  {call.nomeCliente ? call.nomeCliente : call.nomeUsina}
                </h1>
                {call.cidade && (
                  <p className="text-xs text-gray-700">{call.cidade}</p>
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
