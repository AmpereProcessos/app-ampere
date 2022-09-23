import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
function Suprimentos({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    obraStatusFilter: [],
    entregaStatusFilter: [],
  });
  function getProjects() {
    axios.get("/api/projects/filteredByStage").then((res) => {
      setProjects(res.data.obras);
      setFilteredProjects(res.data.obras);
    });
  }
  function filterProjects() {
    var newArr;
    if (
      filters.obraStatusFilter.length > 0 &&
      filters.entregaStatusFilter.length > 0
    ) {
      newArr = projects.filter(
        (project) =>
          filters.entregaStatusFilter.includes(project.statusentrega) &&
          filters.obraStatusFilter.includes(project.statusobra)
      );
    } else if (filters.entregaStatusFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.entregaStatusFilter.includes(project.statusentrega)
      );
    } else if (filters.obraStatusFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.obraStatusFilter.includes(project.statusobra)
      );
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function getListCumulativePeakPot() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      let pot = filteredProjects[i].potpico
        ? filteredProjects[i].potpico
        : null;
      if (isNaN(pot)) {
        totalSum = totalSum;
      } else {
        totalSum = totalSum + pot;
      }
    }
    return totalSum.toFixed(2);
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getProjects();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        getProjects();
      }
    }
  }, []);
  console.log(filters);
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between gap-x-2 border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-ralewayBlack">
            Projetos no estágio de obras
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
          {filteredProjects && (
            <p className="font-raleway font-bold text-[#fead61]">
              ({getListCumulativePeakPot()}kWp)
            </p>
          )}
        </div>
        <div className="flex gap-x-2">
          <Select
            isMulti
            placeholder="STATUS DA OBRA"
            onChange={(e) =>
              setFilters({
                ...filters,
                obraStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "EM ANDAMENTO",
                label: "EM ANDAMENTO",
              },
              {
                value: "PAUSADA",
                label: "PAUSADA",
              },
              {
                value: "AGENDADA",
                label: "AGENDADA",
              },
              {
                value: "AGUARDANDO AGENDAMENTO",
                label: "AGUARDANDO AGENDAMENTO",
              },
            ]}
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
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomedocontrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">STATUS</span>
                <p className="text-xs text-gray-600">
                  {project.statusobra ? project.statusobra : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">LAUDO</span>
                <p className="text-xs text-center text-gray-600">
                  {project.laudo ? project.laudo : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">STATUS KIT</span>
                <p className="text-xs text-yellow-500">
                  {project.statusentrega ? project.statusentrega : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">PREVISÃO DE ENTREGA</span>
                <p className="text-xs text-gray-600 text-center">
                  {project.previsaoentrega
                    ? new Date(project.previsaoentrega).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">TÉCNICO RESPONSÁVEL</span>
                <p className="text-xs text-gray-600 text-center">
                  {project.tecnicoresponsavel
                    ? project.tecnicoresponsavel
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suprimentos;
