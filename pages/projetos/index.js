import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import ModalProjetos from "../../components/ModalProjetos";
import { projetistas } from "../../utils/constants";
function Projetos({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [filters, setFilters] = useState({
    parecerFilter: [],
    vistoriaFilter: [],
    projetistaFilter: [],
    distribuicaoFilter: [],
    assinFaltando: false,
    desenhoFilter: false,
    obraStatusFilter: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios.get("/api/projects/projetos").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  }
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
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
  function filterProjects() {
    var newArr;
    if (filters.parecerFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = projects.filter((project) =>
        filters.parecerFilter.includes(project.parecer.statusDoParecerDeAcesso)
      );
    }
    if (filters.vistoriaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vistoriaFilter.includes(call.vistoria?.status)
      );
    }
    if (filters.projetistaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.projetistaFilter.includes(call.projeto.projetista.nome)
      );
    }
    if (filters.distribuicaoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.distribuicaoFilter.includes(call.dadosCemig.distCreditos)
      );
    }
    if (filters.obraStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.obraStatusFilter.includes(call.obra.statusDaObra)
      );
    }
    if (filters.desenhoFilter) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => call.projeto.desenhoTelhado != "OK");
    }
    if (filters.assinFaltando) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.projeto.dataAssDocumentacao == undefined ||
          project.projeto.dataAssDocumentacao == null ||
          project.projeto.dataAssDocumentacao == "-"
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
      let pot = filteredProjects[i].sistema.potPico
        ? filteredProjects[i].sistema.potPico
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
  function getBorderColorByParecer(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 110) {
      return "border-2 border-red-600";
    } else if (diffDays > 105) {
      return "border-2 border-yellow-500";
    } else if (diffDays > 90) {
      return "border-2 border-blue-700";
    } else {
      return "border border-gray-200";
    }
  }
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
        <div className="flex gap-2 flex-wrap justify-center">
          <input
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <Select
            isMulti
            placeholder="STATUS DO PARECER"
            onChange={(e) =>
              setFilters({
                ...filters,
                parecerFilter: e.map((x) => x.value),
              })
            }
            options={[
              {
                label: "AGUARDANDO ASSINATURA",
                value: "AGUARDANDO ASSINATURA",
              },
              {
                label: "AGUARDANDO AUMENTO DE CARGA",
                value: "AGUARDANDO AUMENTO DE CARGA",
              },
              {
                label: "INICIAR PROJETO",
                value: "INICIAR PROJETO",
              },
              {
                label: "SOLICITAR TROCA DE TITULARIDADE",
                value: "SOLICITAR TROCA DE TITULARIDADE",
              },
              {
                label: "AGUARDANDO FATURAMENTO ART",
                value: "AGUARDANDO FATURAMENTO ART",
              },
              {
                label: "AGUARDANDO FORMULÁRIOS",
                value: "AGUARDANDO FORMULÁRIOS",
              },
              {
                label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
              },
              {
                label: "AGUARDANDO TROCA DE TITULARIDADE",
                value: "AGUARDANDO TROCA DE TITULARIDADE",
              },
              {
                label: "AUMENTO DE CARGA",
                value: "AUMENTO DE CARGA",
              },
              {
                label: "CANCELADO",
                value: "CANCELADO",
              },
              {
                label: "PARECER DE ACESSO APROVADO",
                value: "PARECER DE ACESSO APROVADO",
              },
              {
                label: "PENDENCIAS",
                value: "PENDENCIAS",
              },
              {
                label: "SOLICITAR ACESSO",
                value: "SOLICITAR ACESSO",
              },
              {
                label: "SOLICITAR AUMENTO DE CARGA",
                value: "SOLICITAR AUMENTO DE CARGA",
              },
              {
                label: "PARECER DE ACESSO COM OBRAS",
                value: "PARECER DE ACESSO COM OBRAS",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
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
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
          />
          <Select
            isMulti
            placeholder="STATUS DA VISTORIA"
            onChange={(e) =>
              setFilters({
                ...filters,
                vistoriaFilter: e.map((x) => x.value),
              })
            }
            options={[
              { label: "REALIZADA", value: "REALIZADA" },
              {
                label: "AGUARDANDO OBRA DE REDE",
                value: "AGUARDANDO OBRA DE REDE",
              },
              {
                label: "AGUARDANDO CONCESSIONARIA",
                value: "AGUARDANDO CONCESSIONARIA",
              },
              { label: "NÃO DEFINIDO", value: undefined },
            ]}
          />
          <Select
            isMulti
            placeholder="PROJETISTA"
            onChange={(e) =>
              setFilters({
                ...filters,
                projetistaFilter: e.map((x) => x.value),
              })
            }
            options={projetistas.map((projetista) => {
              return {
                label: projetista.label,
                value: projetista.nome,
              };
            })}
          />
          <div
            onClick={() =>
              setFilters({ ...filters, desenhoFilter: !filters.desenhoFilter })
            }
            className={`${
              filters.desenhoFilter ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            DESENHO PENDENTE
          </div>
          <Select
            isMulti
            placeholder="DIST. CRÉDITOS"
            onChange={(e) =>
              setFilters({
                ...filters,
                distribuicaoFilter: e.map((x) => x.value),
              })
            }
            options={[
              { label: "SIM", value: "SIM" },
              { label: "NÃO", value: "NÃO" },
            ]}
          />
          <div
            onClick={() =>
              setFilters({ ...filters, assinFaltando: !filters.assinFaltando })
            }
            className={`${
              filters.assinFaltando ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            FALTANDO ASSINATURA
          </div>
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-2  items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
            key={project._id}
            className={`w-[250px] lg:w-[450px] cursor-pointer ${
              project.parecer.dataParecerDeAcesso != undefined &&
              project.vistoria.status != "REALIZADA"
                ? getBorderColorByParecer(
                    new Date(project.parecer.dataParecerDeAcesso),
                    new Date()
                  )
                : "border border-gray-200"
            }  p-3 hover:bg-blue-100`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">PARECER DE ACESSO</span>
                <p className="text-xs text-gray-600">
                  {project.parecer.statusDoParecerDeAcesso
                    ? project.parecer.statusDoParecerDeAcesso
                    : "-"}
                </p>
              </div>
              <div className="text-end">
                <span className="text-xxs text-end">VISTORIA</span>
                <p className="text-xs text-center text-gray-600">
                  {project.vistoria.status ? project.vistoria.status : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">DIAGRAMA UNIFILAR</span>
                <p
                  className={`${
                    project.projeto.diagramaUnifilar
                      ? "text-yellow-500"
                      : "text-red-400"
                  } text-xs uppercase`}
                >
                  {project.projeto.diagramaUnifilar
                    ? project.projeto.diagramaUnifilar
                    : "PENDENTE"}
                </p>
              </div>
              <div>
                <span className="text-xxs">DESENHO DO TELHADO</span>
                <p className="text-xs text-gray-600 text-center">
                  {project.projeto.desenhoTelhado
                    ? project.projeto.desenhoTelhado
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalProjetos
          credentials={credentials}
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials.accessibleRoutes.includes("Projetos") ? true : false
          }
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Projetos;
