import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
import ModalADM from "../../components/ModalADM";
import DateInput from "../../components/DateInput";
import { equipesTecnicas, statusLiberacao } from "../../utils/constants";
import Link from "next/link";
import { AppContext } from "../../context/AppContext";
function Administracao() {
  const router = useRouter();
  const { credentials, setCredentials } = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
    equipResp: [],
    vistoriaFilter: [],
    dataSaidaDeObra: null,
    pesquisaFilter: "",
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
        filters.pagamentoFilter.includes(project.compra.statusLiberacao)
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
    if (
      !credentials.accessibleRoutes.includes("ADM") &&
      !credentials.accessibleRoutes.includes("Marketing")
    ) {
      router.push("/");
    } else {
      getProjects();
    }
  }, []);
  function handleUpdates(id) {
    axios
      .get(`/api/projects/fetchDoc/${id}`)
      .then((res) => setModalProject(res.data[0]));
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
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  return (
    <div className="p-6 grow">
      <div className="flex flex-col gap-y-2 items-center border-b border-gray-200 p-1">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway text-center">
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
          <div className="flex flex-wrap justify-center gap-2">
            <input
              type="text"
              className="outline-none p-2 h-[36px] w-[350px]"
              value={filters.pesquisaFilter}
              onChange={(e) =>
                setFilters({ ...filters, pesquisaFilter: e.target.value })
              }
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
              options={equipesTecnicas.map((equipe) => equipe)}
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
              placeholder="STATUS DE LIBERAÇÃO"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  pagamentoFilter: e.map((x) => x.value),
                })
              }
              options={statusLiberacao.map((status) => {
                return { label: status.label, value: status.value };
              })}
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
              handleOpenModal(project._id);
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
      {credentials.visualizacao == undefined && (
        <Link href={"/comercial/formulariosSolicitacao"}>
          <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">
              SOLICITAÇÕES DE CONTRATO
            </p>
          </a>
        </Link>
      )}
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
          credentials={credentials}
        />
      )}
    </div>
  );
}

export default Administracao;
