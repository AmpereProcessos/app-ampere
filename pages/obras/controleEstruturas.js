import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Select from "react-select";
import EstruturaCard from "../../components/EstruturaCard";
import { useRouter } from "next/router";
function ControleEstruturas({ setCredentials, credentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    searchFilter: "",
    estruturaPersFilter: [],
    liberacaoStatus: [],
    segmentoFilter: [],
    pendencia: false,
  });
  function getProjects() {
    axios.get("/api/gestaoDeObras/estruturas").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  function filterProjects() {
    var newArr;
    if (filters.estruturaPersFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.estruturaPersFilter.includes(call.estruturaPersonalizada.status)
      );
    }
    if (filters.liberacaoStatus.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.liberacaoStatus.includes(call.compra.statusLiberacao)
      );
    }
    if (filters.segmentoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.segmentoFilter.includes(call.segmento)
      );
    }
    if (filters.searchFilter.trim().length > 0) {
      if (!newArr) newArr = projects;
      newArr = projects.filter((call) =>
        call.nomeDoContrato
          .toUpperCase()
          .includes(filters.searchFilter.toUpperCase())
      );
    }
    if (filters.pendencia) {
      if (!newArr) newArr = projects;
      newArr = projects.filter(
        (call) =>
          call.estruturaPersonalizada.status == "PENDÊNCIA" &&
          call.compra.statusLiberacao == "PAGO"
      );
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function ordenate() {
    let arr = filteredProjects.sort(
      (a, b) =>
        new Date(a.projeto.dataAssDocumentacao).getTime() -
        new Date(b.projeto.dataAssDocumentacao).getTime()
    );
    setFilteredProjects([...arr]);
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Obras")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Obras")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow bg-[#fff]">
      <div className="flex w-full items-center border-b border-gray-200 mb-2">
        <h1 className="text-[#fead61] font-bold text-xl pb-2">
          CONTROLE DE ESTRUTURA ({filteredProjects.length})
        </h1>
        <div className="flex w-full items-center gap-x-2 justify-center">
          <input
            type={"text"}
            placeholder="Digite o nome do contrato"
            value={filters.searchFilter}
            className={
              "outline-none p-1.5 rounded border border-gray-200 placeholder:italic"
            }
            onChange={(e) =>
              setFilters({ ...filters, searchFilter: e.target.value })
            }
          />
          <div
            onClick={() =>
              setFilters({ ...filters, pendencia: !filters.pendencia })
            }
            className={`${
              filters.pendencia ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            PENDÊNCIAS
          </div>
          <Select
            isMulti
            placeholder="SEGMENTO"
            onChange={(e) =>
              setFilters({
                ...filters,
                segmentoFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "COMERCIAL",
                label: "COMERCIAL",
              },
              {
                value: "INDUSTRIAL",
                label: "INDUSTRIAL",
              },
              {
                value: "RESIDENCIAL",
                label: "RESIDENCIAL",
              },
              {
                value: "RURAL",
                label: "RURAL",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS EST. PERSONALIZADA"
            onChange={(e) =>
              setFilters({
                ...filters,
                estruturaPersFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "PRONTA",
                label: "PRONTA",
              },
              {
                value: "PENDÊNCIA",
                label: "PENDÊNCIA",
              },
              {
                value: "N/A",
                label: "N/A",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS PAG. KIT"
            onChange={(e) =>
              setFilters({
                ...filters,
                liberacaoStatus: e.map((x) => x.value),
              })
            }
            options={[
              { value: "PAGO", label: "PAGO" },
              {
                value: "REALIZAR COMPRA",
                label: "REALIZAR COMPRA",
              },
              {
                value: "AGUARDANDO PAGAMENTO DO BANCO",
                label: "AGUARDANDO PAGAMENTO DO BANCO",
              },
              {
                value: "AGUARDANDO CLIENTE PAGAR",
                label: "AGUARDANDO CLIENTE PAGAR",
              },
              {
                value: "AGUARDANDO LIBERAÇÃO DE CRÉDITO",
                label: "AGUARDANDO LIBERAÇÃO DE CRÉDITO",
              },
              {
                value: "AGUARDANDO PARECER DE ACESSO",
                label: "AGUARDANDO PARECER DE ACESSO",
              },
              {
                value: "AGUARDANDO N.F",
                label: "AGUARDANDO N.F",
              },
            ]}
          />
          <button
            onClick={ordenate}
            className="flex bg-[#fead61] h-[36px] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>ORDENAR</p>
          </button>
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] h-[36px] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {filteredProjects.map((project) => (
          <EstruturaCard
            credentials={credentials}
            project={project}
            key={project._id}
          />
        ))}
      </div>
    </div>
  );
}

export default ControleEstruturas;
