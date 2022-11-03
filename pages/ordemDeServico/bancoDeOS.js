import axios from "axios";
import React, { useEffect, useState } from "react";
import OSControlCard from "../../components/OSControlCard";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
function BancoDeOS({ credentials, setCredentials }) {
  const router = useRouter();
  const [oss, setOSs] = useState([]);
  const [filteredOss, setFilteredOss] = useState([]);
  const [filters, setFilters] = useState({
    nomeDoContratoFilter: "",
    emAberto: false,
  });
  function getOSS() {
    axios.get("/api/ordensDeServico").then((res) => {
      setOSs(res.data);
      setFilteredOss(res.data);
    });
  }
  function filterOS() {
    var newArr;
    if (filters.nomeDoContratoFilter.trim().length > 0) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter((os) =>
        os.nomeDoContrato
          .toUpperCase()
          .includes(filters.nomeDoContratoFilter.toUpperCase())
      );
    }
    if (!newArr) setFilteredOss(oss);
    else {
      setFilteredOss(newArr);
    }
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
          BANCO DE ORDENS DE SERVIÇO ({filteredOss.length})
        </h1>
        <div className="flex justify-around gap-x-2">
          <div
            onClick={() =>
              setFilters({ ...filters, emAberto: !filters.emAberto })
            }
            className="font-bold cursor-pointer p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white"
          >
            EM ABERTO
          </div>
          <input
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={filters.nomeDoContratoFilter}
            onChange={(e) =>
              setFilters({ ...filters, nomeDoContratoFilter: e.target.value })
            }
          />
          <button
            onClick={filterOS}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 mt-3 px-4">
        {filteredOss.map((os) => (
          <OSControlCard key={os._id} info={os} emAberto={filters.emAberto} />
        ))}
      </div>
    </div>
  );
}

export default BancoDeOS;
