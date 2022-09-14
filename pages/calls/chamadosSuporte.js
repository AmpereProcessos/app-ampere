import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCallPPS from "../../components/ModalCallPPS";
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
    textColor: "text-orange-400",
    borderColor: "border-orange-400",
  },
  RESOLVIDO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
function ChamadosSuporte({ credentials, setCredentials }) {
  const router = useRouter();
  const [inProgress, setInProgress] = useState([]);
  const [closedCalls, setClosedCalls] = useState([]);
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      axios.get("/api/calls/suporte").then((res) => {
        console.log(res.data);
        setInProgress(res.data.openCalls);
        setClosedCalls(res.data.closedCalls);
      });
    } else {
      router.push("/auth/authHome");
    }
  }, []);
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="w-full border max-h-[400px] overflow-y-auto overscroll-y-auto border-gray-200 bg-[#fff] shadow-xl p-4">
        <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
          Chamados abertos
        </h1>
        <div className="flex justify-around gap-3 mt-4 flex-wrap">
          {inProgress.map((call) => (
            <div
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
      <div className="w-full border max-h-[450px] overflow-y-auto overscroll-y-auto border-gray-200 bg-[#fff] shadow-xl p-4">
        <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
          CHAMADOS FINALIZADOS
        </h1>
        <div className="flex mt-2 flex-wrap gap-2 justify-around">
          {closedCalls.map((call) => (
            <div
              key={call._id}
              className="w-[300px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
            >
              <div className="flex justify-between items-center w-full">
                <h1 className="uppercase text-sm">{call.nomeUsina}</h1>
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
    </div>
  );
}

export default ChamadosSuporte;
