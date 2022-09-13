import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCallPPS from "../../components/ModalCallPPS";

function ChamadosPPS({ setCredentials }) {
  const [inProgress, setInProgress] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      axios
        .get("/api/calls/pps")
        .then((res) => setInProgress(res.data.inProgress));
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
  };
  function handleOpenModal() {
    setModalIsOpen(true);
  }
  console.log(inProgress);
  return (
    <div className="flex flex-col bg-gray-100 grow p-6 w-full">
      <div className="w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
        <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
          Chamados abertos
        </h1>
        <div className="flex justify-around gap-3 mt-4 flex-wrap">
          {inProgress.map((call) => (
            <div
              key={call._id}
              onClick={handleOpenModal}
              className="min-w-[300px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
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
              <div className="flex flex-col mt-3 text-xs max-w-[400px] text-center">
                <p>Observações:</p>
                <p>{call.observacoes && call.observacoes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
        <p className="uppercase font-bold text-sm">Novo chamado</p>
      </div>
      <ModalCallPPS setModalIsOpen={setModalIsOpen} open={modalIsOpen} />
    </div>
  );
}

export default ChamadosPPS;
