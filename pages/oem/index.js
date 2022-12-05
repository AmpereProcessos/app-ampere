import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Select from "react-select";
import { cidadesAtendidas } from "../../utils/constants";
import { AiOutlineSearch } from "react-icons/ai";
import ModalOeM from "../../components/ModalOeM";
import Link from "next/link";
const statusStyles = {
  REALIZADO: {
    textColor: "text-green-500",
  },
  "NÃO REALIZADO": {
    textColor: "text-red-500",
  },
};
function OeM({ credentials, setCredentials, users }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [opInProgress, setOpInProgress] = useState(false);
  const [filters, setFilters] = useState({
    cidadeFilter: [],
    equipResp: [],
    obraStatusFilter: [],
    manutencaoPendente: false,
    manutencaoAtrasada: false,
    limparAteDezembro: false,
    appPendente: false,
    usinaLigadaFilter: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [modalProject, setModalProject] = useState({});
  function getProjects(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/projects/oem", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else {
      axios.post("/api/projects/oem", { greater: 0 }).then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
    }
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let filtered = filterProjects();
      let newArr = filtered.filter((call) =>
        call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function filterProjects() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }
    if (filters.equipResp.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.equipResp.includes(call.obra?.equipeResp)
      );
    }
    if (filters.usinaLigadaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.usinaLigadaFilter.includes(call.conferencias.usinaLigada.status)
      );
    }
    if (filters.obraStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.obraStatusFilter.includes(call.obra?.statusDaObra)
      );
    }
    if (filters.appPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => project.app.data == undefined);
    }
    if (filters.manutencaoPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.manutencaoPreventiva.status == "NÃO REALIZADO"
      );
    }
    if (filters.manutencaoAtrasada) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => {
        if (project.medidor.data) {
          var timeDiff = Math.abs(
            new Date().getTime() - new Date(project.medidor?.data).getTime()
          );
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          console.log(diffDays);
          return (
            project.manutencaoPreventiva.status == "NÃO REALIZADO" &&
            diffDays > 304
          );
        } else return false;
      });
    }
    if (filters.limparAteDezembro) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => {
        if (project.medidor.data) {
          var timeDiff = Math.abs(
            new Date("2022-12-31T20:35:47.757Z").getTime() -
              new Date(project.medidor?.data).getTime()
          );
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          console.log(diffDays);
          return (
            project.manutencaoPreventiva.status == "NÃO REALIZADO" &&
            diffDays > 365
          );
        } else return false;
      });
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      console.log(newArr);
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
      console.log(newArr);
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects(newArr);
      return newArr;
    }
  }
  function getListCumulativeModules() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      let modules = filteredProjects[i].sistema.qtdeModulos
        ? filteredProjects[i].sistema.qtdeModulos
        : null;
      if (isNaN(modules)) {
        totalSum = totalSum;
      } else {
        totalSum = totalSum + modules;
      }
    }
    return totalSum.toFixed(0);
  }
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
  }
  function fetchMoreProjects() {
    setOpInProgress(true);
    let lastQtde = projects.length > 0 ? projects[projects.length - 1].qtde : 0;
    axios.post("/api/projects/oem", { greater: lastQtde }).then((res) => {
      let arr = [...projects, ...res.data];
      setOpInProgress(false);
      setProjects([...arr]);
      setFilteredProjects([...arr]);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (
        !storedCredentials.accessibleRoutes.includes("O&M") &&
        !storedCredentials.accessibleRoutes.includes("Marketing")
      ) {
        router.push("/");
      } else {
        getProjects(storedCredentials);
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (
          !credentials.accessibleRoutes.includes("O&M") &&
          !credentials.accessibleRoutes.includes("Marketing")
        ) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  return (
    <div className="p-6 grow">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway text-center">
            Projetos no estágio de O&M
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
          {filteredProjects && (
            <p className="font-raleway font-bold text-[#fead61]">
              ({getListCumulativeModules().replace(".", ",")} modulos)
            </p>
          )}
          {projects.length < 1000 ? (
            opInProgress ? (
              <p className="text-sm italic text-[#15599a]">Carregando...</p>
            ) : (
              <button
                onClick={fetchMoreProjects}
                className="bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2"
              >
                CARREGAR MAIS
              </button>
            )
          ) : (
            false
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-around mt-2 items-center">
          <input
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
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
            placeholder="USINA LIGADA"
            onChange={(e) =>
              setFilters({
                ...filters,
                usinaLigadaFilter: e.map((x) => x.value),
              })
            }
            options={[
              { label: "NÃO REALIZADO", value: "NÃO REALIZADO" },
              { label: "REALIZADO", value: "REALIZADO" },
            ]}
          />
          <Select
            isMulti
            placeholder="EQUIP.RESP"
            onChange={(e) =>
              setFilters({
                ...filters,
                equipResp: e.map((x) => x.value),
              })
            }
            options={[
              {
                label: "EQUIPE 1 - JOSÉ ROBERTO",
                value: "EQUIPE 1 - JOSÉ ROBERTO",
              },
              {
                label: "EQUIPE 2 - EDUARDO",
                value: "EQUIPE 2-EDUARDO",
              },
              {
                label: "EQUIPE 3 - EDMAR",
                value: "EQUIPE 3-EDIMAR",
              },
              {
                label: "EQUIPE 4 - ERICK",
                value: "EQUIPE 4-ERICK",
              },
              {
                label: "EQUIPE 5 - JUNIN",
                value: "EQUIPE 5-JUNIN",
              },
              {
                label: "EQUIPE 6 - FELIPE",
                value: "EQUIPE 6-FELIPE",
              },
              {
                label: "EQUIPE 7 - ADENILSON",
                value: "EQUIPE 7- ADENILSON",
              },
              {
                label: "EQUIPE 8 - GERSON",
                value: "EQUIPE 8-GERSON",
              },
              {
                label: "EQUIPE 9 - REGINALDO",
                value: "EQUIPE 9 - REGINALDO",
              },
              {
                label: "EQUIPE 10 - LUIZ",
                value: "EQUIPE 10 - LUIZ",
              },
              {
                label: "EQUIPE 11 - GILMAR",
                value: "EQUIPE 11 - GILMAR",
              },
              {
                label: "EQUIPE 12 - MARCUS V.",
                value: "EQUIPE 12 - MARCUS V.",
              },
              {
                label: "EQUIPE 13 - EDUARDO FRANCO",
                value: "EQUIPE 13 - EDUARDO FRANCO",
              },
              {
                label: "EQUIPE 15 - MARCOS B.",
                value: "EQUIPE 15 - MARCOS B.",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
          />
          <div
            onClick={() =>
              setFilters({
                ...filters,
                appPendente: !filters.appPendente,
              })
            }
            className={`${
              filters.appPendente ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            APP PENDENTE
          </div>
          <div
            onClick={() =>
              setFilters({
                ...filters,
                manutencaoPendente: !filters.manutencaoPendente,
              })
            }
            className={`${
              filters.manutencaoPendente ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            MANUTENÇÃO PENDENTE
          </div>
          <div
            onClick={() =>
              setFilters({
                ...filters,
                manutencaoAtrasada: !filters.manutencaoAtrasada,
              })
            }
            className={`${
              filters.manutencaoAtrasada ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            MANUTENÇÃO ATRASADA
          </div>
          <div
            onClick={() =>
              setFilters({
                ...filters,
                limparAteDezembro: !filters.limparAteDezembro,
              })
            }
            className={`${
              filters.limparAteDezembro ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            LIMPAR ATÉ DEZEMBRO
          </div>
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
          <div className="hidden lg:flex gap-x-2">
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                Depois de:
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
                Antes de:
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
            <Select
              isMulti={false}
              placeholder={"CAMPO DE FILTRO"}
              options={[
                { label: "SAÍDA DE OBRA", value: "obra.saida" },
                { label: "TROCA DO MEDIDOR", value: "medidor.data" },
                {
                  label: "DATA MANUTENÇÃO",
                  value: "manutencaoPreventiva.data",
                },
                { label: "NÃO DEFINIDO", value: null },
              ]}
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  field1: e.value != null ? e.value.split(".")[0] : null,
                  field2: e.value != null ? e.value.split(".")[1] : null,
                })
              }
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
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              handleOpenModal(project._id);
            }}
            key={project._id}
            className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">CIDADE</span>
                <p className="text-xs text-gray-600 uppercase">
                  {project.cidade ? project.cidade : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">TOPOLOGIA</span>
                <p className="text-xs text-center text-gray-600">
                  {project.projeto.topologia ? project.projeto.topologia : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">EQUIPE OBRAS</span>
                <p className="text-xs text-yellow-500">
                  {project.obra.equipeResp ? project.obra.equipeResp : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">USINA LIGADA</span>
                <p
                  className={`text-xs ${
                    statusStyles[project.conferencias.usinaLigada.status]
                      .textColor
                  }`}
                >
                  {project.conferencias.usinaLigada != undefined &&
                  project.conferencias.usinaLigada.status != "-"
                    ? project.conferencias.usinaLigada.status
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href={"/oem/propostas"}>
        <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">Propostas</p>
        </a>
      </Link>
      {modalIsOpen && (
        <ModalOeM
          users={users}
          setModalIsOpen={setModalIsOpen}
          project={modalProject}
          editor={credentials.accessibleRoutes.includes("O&M") ? true : false}
          credentials={credentials}
          handleUpdates={handleUpdates}
        />
      )}
    </div>
  );
}

export default OeM;
