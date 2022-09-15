import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCallPPS from "../../components/ModalCallPPS";
import { AiOutlineReload } from "react-icons/ai";
import Link from "next/link";
function ChamadosPPS({ setCredentials }) {
  const [inProgress, setInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);
  const [stats, setStats] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
  const router = useRouter();
  function getCalls() {
    axios.get("/api/calls/pps").then((res) => {
      setStats(res.data.stats);
      setInProgress(res.data.inProgress);
      setClosedCalls(res.data.closedCalls);
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
  const statusStyles = {
    "EM ANDAMENTO": {
      textColor: "text-yellow-500",
      borderColor: "border-yellow-500",
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
  function handleOpenModal(call) {
    setModalCall(call);
    setModalIsOpen(true);
  }
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="flex justify-around w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
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
        <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
          Chamados abertos
        </h1>
        <div className="flex justify-around gap-3 mt-4 flex-wrap">
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
        <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
          CHAMADOS FINALIZADOS
        </h1>
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
      <ModalCallPPS
        info={modalCall}
        setModalIsOpen={setModalIsOpen}
        open={modalIsOpen}
      />
    </div>
  );
}

export default ChamadosPPS;
