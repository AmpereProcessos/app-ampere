import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
function Projetos({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [parecerFilter, setParecerFilter] = useState([]);
  function getProjects() {
    axios.get("/api/projects/filteredByStage").then((res) => {
      setProjects(res.data.projetos);
      setFilteredProjects(res.data.projetos);
    });
  }
  function filterProjects() {
    var newArr;
    if (parecerFilter.length > 0) {
      newArr = projects.filter((project) =>
        parecerFilter.includes(project.statusparecerdeacesso)
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
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
      <div className="flex justify-between gap-x-2 border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Projetos no estágio de engenharia
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
            placeholder="STATUS DO PARECER"
            onChange={(e) => setParecerFilter(e.map((x) => x.value))}
            options={[
              {
                value: "AGUARDANDO ASSINATURA",
                label: "AGUARDANDO ASSINATURA",
              },
              {
                value: "AGUARDANDO AUMENTO DE CARGA",
                label: "AGUARDANDO AUMENTO DE CARGA",
              },
              {
                value: "AGUARDANDO FATURAMENTO ART",
                label: "AGUARDANDO FATURAMENTO ART",
              },
              {
                value: "AGUARDANDO FORMULÁRIOS",
                label: "AGUARDANDO FORMULÁRIOS",
              },
              {
                value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
              },
              {
                value: "AGUARDANDO TROCA DE TITULARIDADE",
                label: "AGUARDANDO TROCA DE TITULARIDADE",
              },
              {
                value: "AUMENTO DE CARGA",
                label: "AUMENTO DE CARGA",
              },
              {
                value: "INICIAR PROJETO",
                label: "INICIAR PROJETO",
              },
              {
                value: "PARECER DE ACESSO APROVADO",
                label: "PARECER DE ACESSO APROVADO",
              },
              {
                value: "PENDENCIAS",
                label: "PENDENCIAS",
              },
              {
                value: "SOLICITAR ACESSO",
                label: "SOLICITAR ACESSO",
              },
              {
                value: "SOLICITAR AUMENTO DE CARGA",
                label: "SOLICITAR AUMENTO DE CARGA",
              },
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
                <span className="text-xxs">PARECER DE ACESSO</span>
                <p className="text-xs text-gray-600">
                  {project.statusparecerdeacesso
                    ? project.statusparecerdeacesso
                    : "-"}
                </p>
              </div>
              <div className="text-end">
                <span className="text-xxs text-end">VISTORIA</span>
                <p className="text-xs text-center text-gray-600">
                  {project.statusvistoria ? project.statusvistoria : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">DIAGRAMA UNIFILAR</span>
                <p
                  className={`${
                    project.diagramaunifilar
                      ? "text-yellow-500"
                      : "text-red-400"
                  } text-xs uppercase`}
                >
                  {project.diagramaunifilar
                    ? project.diagramaunifilar
                    : "PENDENTE"}
                </p>
              </div>
              <div>
                <span className="text-xxs">MAPA DE MICRO</span>
                <p className="text-xs text-gray-600 text-center">
                  {project.mapademicro ? project.mapademicro : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projetos;
