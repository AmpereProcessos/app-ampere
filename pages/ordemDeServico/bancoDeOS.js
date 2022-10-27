import axios from "axios";
import React, { useEffect, useState } from "react";
import OSControlCard from "../../components/OSControlCard";

function BancoDeOS({ credentials, setCredentials }) {
  const [oss, setOSs] = useState([]);
  const [filteredOss, setFilteredOss] = useState([]);
  const [filters, setFilters] = useState({
    emAberto: false,
  });
  function getOSS() {
    axios.get("/api/ordensDeServico").then((res) => {
      setOSs(res.data);
      setFilteredOss(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.controller) {
        router.push("/");
      } else {
        getOSS();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.controller) {
          router.push("/");
        } else {
          getOSS();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-lg text-[#fead61]">
          BANCO DE ORDENS DE SERVIÇO
        </h1>
        <div className="flex justify-around">
          <div
            onClick={() =>
              setFilters({ ...filters, emAberto: !filters.emAberto })
            }
            className="font-bold cursor-pointer p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white"
          >
            EM ABERTO
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 mt-3 px-4">
        {oss.map((os) => (
          <OSControlCard key={os._id} info={os} emAberto={filters.emAberto} />
        ))}
      </div>
    </div>
  );
}

export default BancoDeOS;
