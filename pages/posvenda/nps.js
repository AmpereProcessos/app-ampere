import axios from "axios";
import React, { useEffect, useState } from "react";
import NPSCard from "../../components/NPSCard";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import { AiOutlineSearch } from "react-icons/ai";
import Select from "react-select";
function NPS({ credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    naoColetados: false,
    cidadeFilter: [],
    pesquisaFilter: "",
    vendedorFilter: [],
  });
  function getProjects() {
    axios.get("/api/projects/nps").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  function filterProjects() {
    var newArr;
    if (filters.naoColetados) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.nps == undefined || project.nps == null
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.cidadeFilter.includes(project.cidade)
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.vendedorFilter.includes(project.vendedor.nome)
      );
    }
    if (filters.pesquisaFilter.trim().length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        call.nomeDoContrato
          .toUpperCase()
          .includes(filters.pesquisaFilter.toUpperCase())
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
      if (!storedCredentials.accessibleRoutes.includes("Pós-Venda")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Pós-Venda")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow bg-[#fff]">
      <div className="grid w-full grid-cols-6 border-b border-gray-200 mb-6 pb-2 items-center">
        <h1 className="col-span-2 text-[#fead61] font-bold text-xl pb-2">
          COLETA DE NPS ({filteredProjects.length})
        </h1>
        <div className="flex justify-end gap-x-2 col-span-4">
          <Select
            isMulti
            placeholder="CIDADE"
            onChange={(e) =>
              setFilters({
                ...filters,
                cidadeFilter: e.map((x) => x.value),
              })
            }
            options={cidadesAtendidas.map((cidade) => {
              return {
                label: cidade,
                value: cidade,
              };
            })}
          />
          <Select
            isMulti
            placeholder="VENDEDOR"
            onChange={(e) =>
              setFilters({
                ...filters,
                vendedorFilter: e.map((x) => x.value),
              })
            }
            options={vendedores.map((vendedor) => {
              return {
                label: vendedor.nome,
                value: vendedor.nome,
              };
            })}
          />
          <input
            className="outline-none p-1.5 w-[300px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={filters.pesquisaFilter}
            onChange={(e) =>
              setFilters({
                ...filters,
                pesquisaFilter: e.target.value,
              })
            }
          />
          <div
            onClick={() =>
              setFilters({ ...filters, naoColetados: !filters.naoColetados })
            }
            className={`cursor-pointer p-2 ${
              filters.naoColetados ? "bg-[#15599a]" : "bg-[#15599a70]"
            } rounded font-bold w-fit text-white`}
          >
            NÃO COLETADOS
          </div>
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap mt-4 gap-3 flex-wrap justify-around">
        {filteredProjects.map((project) => (
          <NPSCard
            credentials={credentials}
            key={project._id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}

export default NPS;
