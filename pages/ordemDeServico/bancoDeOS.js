import axios from "axios";
import React, { useEffect, useState } from "react";
import OSControlCard from "../../components/OSControlCard";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";
function BancoDeOS({ credentials, setCredentials }) {
  const router = useRouter();
  const [oss, setOSs] = useState([]);
  const [filteredOss, setFilteredOss] = useState([]);
  const [filters, setFilters] = useState({
    nomeDoContratoFilter: "",
    emAberto: false,
    categoria: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
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
    if (filters.categoria.length > 0) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter((os) =>
        os.ordensDeServico.some((ordem) =>
          filters.categoria.includes(ordem.categoria)
        )
      );
    }
    if (filters.emAberto) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter(
        (os) => os.ordensDeServico.dataDeFechamento == undefined
      );
    }
    if (dateFilter.after != null && dateFilter.before != null) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter((project) =>
        project.ordensDeServico.some(
          (os) =>
            os.dataDeFechamento >= dateFilter.after &&
            os.dataDeFechamento <= dateFilter.before
        )
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
      <div className="flex flex-col items-center justify-between">
        <h1 className="font-bold text-lg text-[#fead61]">
          BANCO DE ORDENS DE SERVIÇO ({filteredOss.length})
        </h1>
        <div className="flex flex-col items-center justify-around gap-x-2">
          <div className="hidden lg:flex gap-x-2">
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                Fechamento Depois de:
              </span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={
                  dateFilter.after &&
                  new Date(dateFilter.after).toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    after: isNaN(e.target.value)
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                Fechamento Antes de:
              </span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={
                  dateFilter.before &&
                  new Date(dateFilter.before).toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    before: isNaN(e.target.value)
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2">
            <Select
              isMulti
              placeholder="CATEGORIA"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  categoria: e.map((x) => x.value),
                })
              }
              options={[
                { label: "PADRÃO", value: "PADRÃO" },
                { label: "ESTRUTURA", value: "ESTRUTURA" },
                { label: "MONTAGEM", value: "MONTAGEM" },
                {
                  label: "MANUTENÇÃO PREVENTIVA",
                  value: "MANUTENÇÃO PREVENTIVA",
                },
                {
                  label: "MANUTENÇÃO CORRETIVA",
                  value: "MANUTENÇÃO CORRETIVA",
                },
                {
                  label: "NÃO DEFINIDO",
                  value: "NÃO DEFINIDO",
                },
              ]}
            />
            <div
              onClick={() =>
                setFilters({ ...filters, emAberto: !filters.emAberto })
              }
              className={`${
                filters.emAberto ? "bg-[#15599a]" : "bg-blue-300"
              } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
            >
              EM ABERTO
            </div>
            <input
              className="outline-none h-[36px] p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
              placeholder="Digite o nome do contrato"
              value={filters.nomeDoContratoFilter}
              onChange={(e) =>
                setFilters({ ...filters, nomeDoContratoFilter: e.target.value })
              }
            />
            <button
              onClick={filterOS}
              className="flex bg-[#fead61] w-fit h-[36px] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 mt-3 px-4">
        {filteredOss.map((os) => (
          <OSControlCard
            key={os._id}
            info={os}
            categoria={filters.categoria}
            emAberto={filters.emAberto}
          />
        ))}
      </div>
      <Link href={"/ordemDeServico/controleDeOS"}>
        <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">OSs EM ABERTO</p>
        </a>
      </Link>
    </div>
  );
}

export default BancoDeOS;
