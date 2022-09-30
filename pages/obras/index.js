import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import ModalObras from "../../components/ModalObras";
function Suprimentos({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    obraStatusFilter: [],
    entregaStatusFilter: [],
    acFilter: [],
    acStatusFilter: [],
    epFilter: [],
    epStatusFilter: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios.get("/api/projects/filteredByStage").then((res) => {
      setProjects(res.data.obras);
      setFilteredProjects(res.data.obras);
    });
  }
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
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
    if (filters.acFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.acFilter.includes(call.aumentodecarga)
      );
    }
    if (filters.acStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.acStatusFilter.includes(call.acstatus)
      );
    }
    if (filters.epFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.epFilter.includes(call.possuiestruturapersonalisada)
      );
    }
    if (filters.epStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.epStatusFilter.includes(call.estruturapersonalisada)
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
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between gap-x-2 border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
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
        <div className="flex flex-wrap justify-center gap-y-2 gap-x-2">
          <Select
            isMulti
            placeholder="ESTRUTURA PERSONALIZADA"
            onChange={(e) =>
              setFilters({
                ...filters,
                epFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "SIM",
                label: "SIM",
              },
              {
                value: "NÃO",
                label: "NÃO",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS ESTRUTURA PERSONALIZADA"
            onChange={(e) =>
              setFilters({
                ...filters,
                epStatusFilter: e.map((x) => x.value),
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
            placeholder="AUMENTO DE CARGA"
            onChange={(e) =>
              setFilters({
                ...filters,
                acFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "SIM",
                label: "SIM",
              },
              {
                value: "NÃO",
                label: "NÃO",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="A.C STATUS"
            onChange={(e) =>
              setFilters({
                ...filters,
                acStatusFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "PENDÊNCIA",
                label: "PENDÊNCIA",
              },
              {
                value: "REALIZADO",
                label: "REALIZADO",
              },
              {
                value: "N/A",
                label: "N/A",
              },
              {
                value: "SOLICITADO COM G.D",
                label: "SOLICITADO COM G.D",
              },
              {
                value: undefined,
                label: "NÃO DEFINIDO",
              },
            ]}
          />
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
        </div>
        <button
          onClick={filterProjects}
          className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
        >
          <p>Filtrar</p>
          <AiOutlineSearch />
        </button>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
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
      {modalIsOpen && (
        <ModalObras
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={credentials.accessibleRoutes.includes("Obras") ? true : false}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Suprimentos;
