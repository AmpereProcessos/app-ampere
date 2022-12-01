import axios from "axios";
import React, { useEffect, useState } from "react";
import ComissionamentoCard from "../../components/ComissionamentoCard";
import { AiOutlineSearch } from "react-icons/ai";
function Comissionamento({ credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState();
  const [filters, setFilters] = useState({
    pendenciaComercial: false,
    pendenciaSuprimentos: false,
    pendenciaProjetos: false,
  });
  function getProjects() {
    axios.get("/api/projects/comissionamento").then((res) => {
      console.log(res.data);
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  }
  function filterPendenciaComercial(value) {
    setFilters({ pendenciaComercial: value });
    var newArr;
    if (value) {
      newArr = projects.filter((obj) => !obj.comissionamento?.comercial);
      console.log("comercial", newArr);
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function filterPendenciaSuprimentos(value) {
    setFilters({ pendenciaSuprimentos: value });
    var newArr;
    if (value) {
      newArr = projects.filter(
        (obj) =>
          obj.comissionamento?.comercial && !obj.comissionamento?.suprimentos
      );
      console.log("comercial", newArr);
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }

  function filterPendenciaProjetos(value) {
    setFilters({ pendenciaProjetos: value });
    var newArr;
    if (value) {
      newArr = projects.filter(
        (obj) =>
          obj.comissionamento?.comercial && obj.comissionamento?.suprimentos
      );
      console.log("comercial", newArr);
    }
    if (!newArr) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(newArr);
    }
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let newArr = projects.filter((call) =>
        call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Projetos")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Projetos")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Comissionamento
          </p>
          {filteredProjects && <p>({filteredProjects.length})</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 pl-4">
          <input
            type={"text"}
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <div
            onClick={() =>
              filterPendenciaComercial(!filters.pendenciaComercial)
            }
            className={`${
              filters.pendenciaComercial ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            PENDENCIA COMERCIAL
          </div>
          <div
            onClick={() =>
              filterPendenciaSuprimentos(!filters.pendenciaSuprimentos)
            }
            className={`${
              filters.pendenciaSuprimentos ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            PENDENCIA SUPRIMENTOS
          </div>
          <div
            onClick={() => filterPendenciaProjetos(!filters.pendenciaProjetos)}
            className={`${
              filters.pendenciaProjetos ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            PENDENCIA PROJETOS
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3 mt-4 ">
        {filteredProjects.map((project) => (
          <ComissionamentoCard
            getProjects={getProjects}
            credentials={credentials}
            key={project._id}
            info={project}
          />
        ))}
      </div>
    </div>
  );
}

export default Comissionamento;
