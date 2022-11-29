import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CreateModal from "../../components/SuportCallCreation";
import { AiOutlineReload } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import Link from "next/link";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { cities } from "../../utils/constants";
import ModalCallADM from "../../components/ModalCallADM";

const statusStyles = {
  ABERTO: {
    textColor: "text-red-500",
    borderColor: "border-red-500",
  },
  PENDENTE: {
    textColor: "text-red-400",
    borderColor: "border-red-400",
  },
  FINALIZADO: {
    textColor: "text-green-500",
    borderColor: "border-green-500",
  },
  RESOLVIDO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
var dateFilterParam = new Date();
dateFilterParam.setDate(dateFilterParam.getDate() - 2);
function ChamadosADM({ credentials, setCredentials }) {
  const router = useRouter();
  const [inProgress, setInProgress] = useState([]);
  const [filteredInProgress, setFilteredInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);
  const [filteredClosedCalls, setFilteredClosedCalls] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});

  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("ADM")) {
        router.push("/");
      } else {
        getCalls();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("ADM")) {
          router.push("/");
        } else {
          getCalls();
        }
      }
    }
  }, []);
  function getDemandColor(demanda) {
    if (demanda == "PAGAMENTO") {
      return "text-[#fead61] font-bold";
    }
    if (demanda == "COBRANÇA") {
      return "text-[#15599a] font-bold";
    }
  }
  function handleOpenModal(call) {
    setModalCall(call);
    setModalIsOpen(true);
  }
  function getCalls() {
    axios.get("/api/calls/adm/mainData").then((res) => {
      setInProgress(res.data.openCalls);
      setFilteredInProgress(res.data.openCalls);
      setClosedCalls(res.data.closedCalls);
      setFilteredClosedCalls(res.data.closedCalls);
    });
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
        </div>
        <div className="flex max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredInProgress.map((call) => (
            <div
              onClick={() => handleOpenModal(call)}
              key={call._id}
              className="w-[420px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between mb-2">
                <h1 className={`${getDemandColor(call.demanda)}`}>
                  {call.demanda}
                </h1>
                <p
                  className={`text-xs font-bold border p-1 rounded-lg ${
                    statusStyles[call.status].textColor
                  } ${statusStyles[call.status].borderColor}`}
                >
                  {call.status}
                </p>
              </div>
              <div className="flex justify-between">
                <h1 className="text-gray-600 text-xs">{call.nomeCliente}</h1>
                <p className="text-[#15599a] font-bold text-xs">
                  #{call.codigoProjeto}
                </p>
              </div>
              <div className="flex justify-center">
                <h1 className="text-gray-600 text-xs text-center">
                  {call.servico}
                </h1>
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
        </div>
        <div className="flex max-h-[500px] lg:max-h-[350px] overflow-y-auto overscroll-y-auto mt-2 flex-wrap gap-2 justify-around">
          {filteredClosedCalls.map((call) => (
            <div
              onClick={() => handleOpenModal(call)}
              key={call._id}
              className="w-[420px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between mb-2">
                <h1 className={`${getDemandColor(call.demanda)}`}>
                  {call.demanda}
                </h1>
                <p
                  className={`text-xs font-bold border p-1 rounded-lg ${
                    statusStyles[call.status].textColor
                  } ${statusStyles[call.status].borderColor}`}
                >
                  {call.status}
                </p>
              </div>
              <div className="flex justify-between">
                <h1 className="text-gray-600 text-xs">{call.nomeCliente}</h1>
                <p className="text-[#15599a] font-bold text-xs">
                  #{call.codigoProjeto}
                </p>
              </div>
              <div className="flex justify-center">
                <h1 className="text-gray-600 text-xs text-center">
                  {call.servico}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalIsOpen && (
        <ModalCallADM
          info={modalCall}
          setModalIsOpen={setModalIsOpen}
          getCalls={getCalls}
        />
      )}
    </div>
  );
}

export default ChamadosADM;
