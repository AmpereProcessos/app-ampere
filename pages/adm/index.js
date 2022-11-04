import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
// casa em construção (Tais)
import { useRouter } from "next/router";
import ModalADM from "../../components/ModalADM";
import DateInput from "../../components/DateInput";
function Administracao({ credentials, setCredentials }) {
  var editor;
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
    equipResp: [],
    vistoriaFilter: [],
    dataSaidaDeObra: null,
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios.get("/api/projects/adm").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
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
          filters.pagamentoFilter.includes(project.pagamento.status) &&
          filters.contratoFilter.includes(project.contrato.status)
      );
    } else if (filters.pagamentoFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.pagamentoFilter.includes(project.pagamento.status)
      );
    } else if (filters.contratoFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.contratoFilter.includes(project.contrato.status)
      );
    }
    if (filters.equipResp.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.equipResp.includes(call.obra?.equipeResp)
      );
    }
    if (filters.vistoriaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vistoriaFilter.includes(call.vistoria?.status)
      );
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
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
      if (storedCredentials.accessibleRoutes.includes("ADM")) {
        getProjects();
      } else {
        router.push("/");
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (credentials.accessibleRoutes.includes("ADM")) {
          getProjects();
        } else {
          router.push("/");
        }
      }
    }
  }, []);
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
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
  console.log(dateFilter);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col gap-y-2 items-center border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Controle de projetos - Administração
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
        </div>
        <div className="flex flex-col items-center gap-y-2">
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
                  label: "DATA ASS.CONTRATO",
                  value: "contrato.dataAssinatura",
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
          <div className="flex gap-x-2">
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
                {
                  value: "AGUARDANDO PAGAMENTO",
                  label: "AGUARDANDO PAGAMENTO",
                },
                { value: undefined, label: "NÃO DEFINIDO" },
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
            <button
              onClick={filterProjects}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
          </div>
        </div>
      </div>
      <div className="flex  justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
            key={project._id}
            className="w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">CONTRATO</span>
                <p className="text-xs text-yellow-500">
                  {project.contrato?.status && project.contrato?.status}
                </p>
              </div>
              <div>
                <span className="text-xxs">VENDEDOR</span>
                <p className="text-xs text-[#15599a]">
                  {project.vendedor && project.vendedor.nome}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">TIPO DE PAGAMENTO</span>
                <p className="text-xs text-gray-600">
                  {project.pagamento?.forma && project.pagamento.forma}
                </p>
              </div>
              <div>
                <span className="text-xxs">PAGAMENTO</span>
                <p className="text-xs text-gray-600">
                  {project.pagamento?.status ? project.pagamento.status : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalADM
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials && credentials.accessibleRoutes.includes("ADM")
              ? true
              : false
          }
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Administracao;
