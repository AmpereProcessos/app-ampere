import axios from "axios";
import React, { useEffect, useState } from "react";
import NPSCard from "../../components/NPSCard";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import { AiOutlineSearch } from "react-icons/ai";
import Select from "react-select";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function NPS() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    naoColetados: false,
    comObs: false,
    cidadeFilter: [],
    pesquisaFilter: "",
    vendedorFilter: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
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
    if (filters.comObs) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.jornada.obsNps != undefined &&
          project.jornada.obsNps != null &&
          project.jornada.obsNps?.trim().length > 2
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
    if (dateFilter.after && dateFilter.before) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call.jornada.dataNps >= dateFilter.after &&
          call.jornada.dataNps <= dateFilter.before
      );
    }
    if (!newArr) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(newArr);
    }
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes) {
      getProjects();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow bg-[#fff]">
        <div className="flex flex-col border-b border-gray-200 mb-6 pb-2 items-center">
          <h1 className="text-[#fead61] font-bold text-xl pb-2">
            COLETA DE NPS ({filteredProjects.length})
          </h1>
          <div className="flex justify-around flex-wrap gap-2">
            <div className="hidden lg:flex gap-x-2">
              <div className="flex flex-col w-fit items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  Coleta depois de:
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
                  Coleta antes de:
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
            <div
              onClick={() =>
                setFilters({ ...filters, naoColetados: !filters.naoColetados })
              }
              className={`cursor-pointer p-2 ${
                filters.naoColetados ? "bg-[#15599a]" : "bg-blue-300"
              } rounded font-bold w-fit text-white`}
            >
              NÃO COLETADOS
            </div>
            <div
              onClick={() =>
                setFilters({ ...filters, comObs: !filters.comObs })
              }
              className={`cursor-pointer p-2 ${
                filters.comObs ? "bg-[#15599a]" : "bg-blue-300"
              } rounded font-bold w-fit text-white`}
            >
              COM OBSERVAÇÕES
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
        <div className="flex flex-wrap mt-4 gap-3 justify-around">
          {filteredProjects.map((project) => (
            <NPSCard
              credentials={session?.user}
              key={project._id}
              project={project}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default NPS;
