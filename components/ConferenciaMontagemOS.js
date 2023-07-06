import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/firebase";
import { parseCookies } from "nookies";
import EtapaTelhado from "./etapasConferenciaMontagem/EtapaTelhado";
import EtapaMontagemMecanica from "./etapasConferenciaMontagem/EtapaMontagemMecanica";
import EtapaLancamentoCabosConexoes from "./etapasConferenciaMontagem/EtapaLancamentoCabosConexoes";
import EtapaFinalizacao from "./etapasConferenciaMontagem/EtapaFinalizacao";
import EtapaEntrada from "./etapasConferenciaMontagem/EtapaEntrada";
function ConferenciaMontagemOS({ info, cliente, index, saveChanges, getOSs }) {
  const [stage, setStage] = useState(0);

  const [msg, setMsg] = useState({ text: "", color: "" });
  const cidadesGoias = [
    "CALDAS NOVAS", // GO
    "PORTEIRÃO", // GO
    "SÃO SIMÃO", // GO
    "INACIOLÂNDIA", // GO
    "TRINDADE", // GO
    "ITUMBIARA", // GO
    "QUIRINÓPOLIS", // GO
    "PARANAIGUARA", // GO
    "CATALÃO", // GO
    "CACHOEIRA ALTA", // GO
  ];

  useEffect(() => {
    const cookies = parseCookies(null);
    const stageCookie = cookies[`STAGE-${info.qtde}`];
    console.log("COOKIES", stageCookie);
    if (stageCookie) {
      let stage = stageCookie ? Number(stageCookie) : 0;
      console.log("STAGE", stage);
      setStage(stage);
    }
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center font-bold text-[#15599a] text-xl">
        CONFERÊNCIA DE FECHAMENTO DA OS
      </h1>
      {stage == 0 && (
        <EtapaEntrada
          cliente={cliente}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {stage == 1 && (
        <EtapaTelhado
          cliente={cliente}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {stage == 2 && (
        <EtapaMontagemMecanica
          cliente={cliente}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {stage == 3 && (
        <EtapaLancamentoCabosConexoes
          cliente={cliente}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
        />
      )}
      {stage == 4 && (
        <EtapaFinalizacao
          cliente={cliente}
          index={index}
          infoCliente={info}
          next={() => setStage((prev) => prev + 1)}
          getOSs={getOSs}
        />
      )}
      {msg.text && (
        <p className={`text-center italic text-xs ${msg.color} mt-2`}>
          {msg.text}
        </p>
      )}
      {/* {stage == 4 && (
        <div className="my-2 flex items-center justify-center mt-6">
          <button
            onClick={closeOS}
            className="p-2 rounded font-bold border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white "
          >
            PRÓXIMO
          </button>
        </div>
      )} */}
    </div>
  );
}

export default ConferenciaMontagemOS;
