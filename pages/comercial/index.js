import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import ModalComercial from "../../components/ModalComercial";
// casa em construção (Tais)
import { useRouter } from "next/router";
import Link from "next/link";
function Comercial({ credentials, setCredentials }) {
  var editor;
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [codFilter, setCodFilter] = useState(0);
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios.get("/api/projects/comercial").then((res) => {
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
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
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
  function handleCodFilter(value) {
    setCodFilter(value);
    if (value != 0) {
      let newArr = projects.filter(
        (call) => Number(call.qtde) == Number(value)
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
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
        if (
          credentials.accessibleRoutes.includes("PPS") ||
          storedCredentials.accessibleRoutes.includes("PPS")
        )
          editor = true;
        else editor = false;
        getProjects();
      }
    }
  }, []);
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
  }
  function filterByContractCondition(condition) {
    setCurrentFilter(condition);
    var newArr = projects.filter((p) => p.statuscontrato == condition);
    setFilteredProjects(newArr);
  }
  function getListCumulativePeakPot() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      let pot = filteredProjects[i].sistema?.potPico
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
        <div className="flex gap-x-2">
          <input
            value={codFilter}
            onChange={(e) => handleCodFilter(e.target.value)}
            className="outline-none p-1.5 w-[100px] rounded border border-gray-200 placeholder:italic"
            type="number"
          />
          <input
            type={"text"}
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
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
      <Link href={"/comercial/addProjeto"}>
        <div className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">Novo chamado</p>
        </div>
      </Link>
      {modalIsOpen && (
        <ModalComercial
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials && credentials.accessibleRoutes.includes("PPS")
              ? true
              : false
          }
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Comercial;
