import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import SeparacaoCard from "../../components/SeparacaoCard";
import { cidadesAtendidas, equipesTecnicas } from "../../utils/constants";
import { AiOutlineSearch } from "react-icons/ai";
function ProjetosSeparacao({ credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    equipeFilter: [],
    cidadeFilter: [],
    topologiaFilter: [],
    statusDaObraFilter: [],
    entregaStatusFilter: [],
    qtdeModulosFilter: null,
  });
  function getProjects() {
    axios.get("/api/almoxarifado/projetos").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  function filterProjects() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.cidadeFilter.includes(project.cidade)
      );
    }
    if (filters.equipeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.equipeFilter.includes(project.obra.equipeResp)
      );
    }
    if (filters.statusDaObraFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.statusDaObraFilter.includes(project.obra.statusDaObra)
      );
    }
    if (filters.entregaStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.entregaStatusFilter.includes(project.compra.statusEntrega)
      );
    }
    if (filters.qtdeModulosFilter && filters.qtdeModulosFilter != 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          Number(project.sistema.qtdeModulos) ==
          Number(filters.qtdeModulosFilter)
      );
    }
    if (filters.topologiaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.topologiaFilter.includes(project.sistema.topologia)
      );
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Almoxarifado")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Almoxarifado")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  console.log(filters);
  return (
    <div className="p-6 grow flex flex-col">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-xl text-[#15599a]">
          PROJETOS PARA SEPARAÇÃO ({filteredProjects.length})
        </h1>
        <div className="flex flex-wrap justify-center gap-2">
          <Select
            placeholder="CIDADE"
            isMulti={true}
            options={cidadesAtendidas.map((cidade) => {
              return {
                label: cidade,
                value: cidade,
              };
            })}
            onChange={(e) =>
              setFilters({
                ...filters,
                cidadeFilter: e.map((x) => x.value),
              })
            }
          />
          <Select
            isMulti
            placeholder="STATUS DA ENTREGA"
            onChange={(e) =>
              setFilters({
                ...filters,
                entregaStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              { value: "EM ROTA", label: "EM ROTA" },
              { value: "AGUARDANDO COMPRA", label: "AGUARDANDO COMPRA" },
              { value: "ENTREGUE", label: "ENTREGUE" },
              { value: undefined, label: "NÃO DEFINIDO" },
            ]}
          />
          <Select
            placeholder="EQUIPE RESP."
            isMulti={true}
            options={equipesTecnicas.map((equipe) => equipe)}
            onChange={(e) =>
              setFilters({
                ...filters,
                equipeFilter: e.map((x) => x.value),
              })
            }
          />
          <Select
            placeholder="STATUS DA OBRA"
            isMulti={true}
            options={[
              {
                label: "AGENDADA",
                value: "AGENDADA",
              },
              {
                label: "AGUARDANDO AGENDAMENTO",
                value: "AGUARDANDO AGENDAMENTO",
              },
              {
                label: "CONCLUIDA",
                value: "CONCLUIDA",
              },
              {
                label: "EM ANDAMENTO",
                value: "EM ANDAMENTO",
              },
              {
                label: "OBRA CANCELADA",
                value: "OBRA CANCELADA",
              },
              {
                label: "CASA EM CONSTRUÇÃO",
                value: "CASA EM CONSTRUÇÃO",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
            onChange={(e) =>
              setFilters({
                ...filters,
                statusDaObraFilter: e.map((x) => x.value),
              })
            }
          />
          <Select
            placeholder="TOPOLOGIA"
            isMulti={true}
            options={[
              { label: "INVERSOR", value: "INVERSOR" },
              { label: "MICRO", value: "MICRO" },
              { label: "OUTROS SERV.", value: "OUTROS SERV." },
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ]}
            onChange={(e) =>
              setFilters({
                ...filters,
                topologiaFilter: e.map((x) => x.value),
              })
            }
          />
          <input
            type="number"
            className="outline-none border border-gray-200 p-2 h-[36px] text-center w-[100px] text-xs"
            placeholder="NºMódulos"
            onChange={(e) =>
              setFilters({
                ...filters,
                qtdeModulosFilter: Number(e.target.value),
              })
            }
          />
          <button
            onClick={filterProjects}
            className="flex h-[36px] bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <SeparacaoCard
            key={project._id}
            info={project}
            editor={
              credentials.accessibleRoutes.includes("Almoxarifado") &&
              credentials.visualizacao == undefined
                ? true
                : false
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ProjetosSeparacao;
