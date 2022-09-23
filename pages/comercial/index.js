import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
// casa em construção (Tais)
import { useRouter } from "next/router";
function Comercial({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios.get("/api/projects/filteredByStage").then((res) => {
      setProjects(res.data.comercial);
      setFilteredProjects(res.data.comercial);
    });
  }
  function filterProjects() {
    var newArr;
    if (
      filters.contratoFilter.length > 0 &&
      filters.pagamentoFilter.length > 0
    ) {
      newArr = projects.filter(
        (project) =>
          filters.pagamentoFilter.includes(project.statuspagamento) &&
          filters.contratoFilter.includes(project.statuscontrato)
      );
    } else if (filters.pagamentoFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.pagamentoFilter.includes(project.statuspagamento)
      );
    } else if (filters.contratoFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.contratoFilter.includes(project.statuscontrato)
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
      getProjects();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        getProjects();
      }
    }
  }, []);
  function filterByContractCondition(condition) {
    setCurrentFilter(condition);
    var newArr = projects.filter((p) => p.statuscontrato == condition);
    setFilteredProjects(newArr);
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
  console.log(projects);
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Projetos no estágio comercial
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
        {/**        <div className="flex gap-x-2">
          <p
            onClick={() => filterByContractCondition("AGUARDANDO SOLICITAÇÃO")}
            className={`text-sm text-gray-600 p-1 ${
              currentFilter == "AGUARDANDO SOLICITAÇÃO"
                ? "bg-blue-200"
                : "bg-tranparent hover:bg-blue-200"
            } cursor-pointer border border-gray-200`}
          >
            AGUARDANDO SOLICITAÇÃO
          </p>
          <p
            onClick={() => filterByContractCondition("SOLICITADO")}
            className={`text-sm text-gray-600 p-1 ${
              currentFilter == "SOLICITADO"
                ? "bg-blue-200"
                : "bg-tranparent hover:bg-blue-200"
            } cursor-pointer border border-gray-200`}
          >
            SOLICITADO
          </p>
          <p
            onClick={() => filterByContractCondition("NÃO ASSINADO")}
            className={`text-sm text-gray-600 p-1 ${
              currentFilter == "NÃO ASSINADO"
                ? "bg-blue-200"
                : "bg-tranparent hover:bg-blue-200"
            } cursor-pointer border border-gray-200`}
          >
            NÃO ASSINADO
          </p>
          <p
            onClick={getProjects}
            className={`text-sm text-gray-600 p-1 ${
              currentFilter == "TODOS"
                ? "bg-blue-200"
                : "bg-tranparent hover:bg-blue-200"
            } cursor-pointer border border-gray-200`}
          >
            TODOS
          </p>
        </div> */}
        <div className="flex gap-x-2">
          <Select
            isMulti
            placeholder="STATUS CONTRATO"
            onChange={(e) =>
              setFilters({
                ...filters,
                contratoFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                value: "AGUARDANDO SOLICITAÇÃO",
                label: "AGUARDANDO SOLICITAÇÃO",
              },
              {
                value: "SOLICITADO",
                label: "SOLICITADO",
              },
              {
                value: "NÃO ASSINADO",
                label: "NÃO ASSINADO",
              },
              {
                value: "ASSINADO",
                label: "ASSINADO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS DA PAGAMENTO"
            onChange={(e) =>
              setFilters({
                ...filters,
                pagamentoFilter: e.map((x) => x.value),
              })
            }
            options={[
              { value: "AGUARDANDO PAGAMENTO", label: "AGUARDANDO PAGAMENTO" },
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
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">CONTRATO</span>
                <p className="text-xs text-yellow-500">
                  {project.statuscontrato && project.statuscontrato}
                </p>
              </div>
              <div>
                <span className="text-xxs">VENDEDOR</span>
                <p className="text-xs text-[#15599a]">
                  {project.vendedor && project.vendedor}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">TIPO DE PAGAMENTO</span>
                <p className="text-xs text-gray-600">
                  {project.formapagamento && project.formapagamento}
                </p>
              </div>
              <div>
                <span className="text-xxs">PAGAMENTO</span>
                <p className="text-xs text-gray-600">
                  {project.statuspagamento ? project.statuspagamento : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comercial;
