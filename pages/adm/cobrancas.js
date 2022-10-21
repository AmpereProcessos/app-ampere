import axios from "axios";
import React, { useEffect, useState } from "react";
import OSCard from "../../components/OSCard";

function Cobrancas({ credentials, setCredentials }) {
  const [oss, setOss] = useState([]);

  function getOSsToReceive() {
    axios
      .get("/api/ordensDeServico/realizarCobranca")
      .then((res) => setOss(res.data));
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (storedCredentials.accessibleRoutes.includes("ADM")) {
        getOSsToReceive();
      } else {
        router.push("/");
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (credentials.accessibleRoutes.includes("ADM")) {
          getOSsToReceive();
        } else {
          router.push("/");
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <h1 className="font-bold text-lg text-[#fead61]">
        COBRANÇAS DE ORDENS DE SERVIÇO
      </h1>
      <div className="flex flex-col gap-y-4 mt-3 px-4">
        {oss.map((os) => (
          <OSCard reload={getOSsToReceive} key={os._id} info={os} />
        ))}
      </div>
    </div>
  );
}

export default Cobrancas;
