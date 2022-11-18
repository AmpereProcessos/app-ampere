import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import ModalComercial from "../../components/ModalComercial";
// casa em construção (Tais)
import { useRouter } from "next/router";
import Link from "next/link";
const statusStyles = {
  ASSINADO: {
    textColor: "text-green-500",
  },
  "NÃO ASSINADO": {
    textColor: "text-red-500",
  },
  SOLICITADO: {
    textColor: "text-yellow-500",
  },
};
function Comercial({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [codFilter, setCodFilter] = useState(0);
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
  });
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/projects/comercial", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else if (credenciais.visualizacao == "VENDEDOR") {
      axios
        .post("/api/projects/comercial", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.vendedor,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else {
      axios.get("/api/projects/comercial").then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
    }
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
    if (dateFilter.after && dateFilter.before) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call.contrato?.dataAssinatura >= dateFilter.after &&
          call.contrato?.dataAssinatura <= dateFilter.before
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
      if (
        !storedCredentials.accessibleRoutes.includes("PPS") &&
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
          !credentials.accessibleRoutes.includes("PPS") &&
          !credentials.accessibleRoutes.includes("Marketing")
        ) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  function handleUpdates(id) {
    getProjects(credentials);
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
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
  function getListCumulativeValue() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      let projeto = !isNaN(filteredProjects[i].sistema?.valorProjeto)
        ? filteredProjects[i].sistema.valorProjeto
        : 0;
      let padrao = !isNaN(filteredProjects[i].padrao?.valor)
        ? filteredProjects[i].padrao?.valor
        : 0;
      let estrutura = !isNaN(filteredProjects[i].estruturaPersonalizada?.valor)
        ? filteredProjects[i].estruturaPersonalizada.valor
        : 0;
      totalSum =
        Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura);
    }
    return totalSum;
  }
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Number(diffInDays).toFixed(0);
  }
  return (
    <div className="p-6 grow">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <p className="font-bold uppercase text-center text-2xl text-[#15599a] font-raleway">
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
          {filteredProjects && (
            <p className="font-raleway font-bold text-[#fead61]">
              (R${getListCumulativeValue().toLocaleString()})
            </p>
          )}
        </div>
        <div className="flex flex-col w-full gap-y-2">
          <div className="flex items-center justify-around gap-x-2">
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
            <div className="hidden lg:flex gap-x-2">
              <div className="flex flex-col w-fit items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  Contrato depois de:
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
                  Contrato antes de:
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
          </div>
          <div className="flex items-center justify-around gap-x-2">
            <Select
              isMulti
              className="hidden lg:block"
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
              placeholder="STATUS DO PAGAMENTO"
              className="hidden lg:block"
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
            <button
              onClick={filterProjects}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] h-[36px] font-bold rounded px-2 items-center gap-x-2"
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
                <p
                  className={`text-xs ${
                    statusStyles[project.contrato?.status]
                      ? statusStyles[project.contrato.status].textColor
                      : ""
                  }`}
                >
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
            <div className="flex items-center justify-center">
              <div>
                <span className="text-xxs">DESDE ASS.CONTRATO</span>
                <p className={`text-xs uppercase text-red-500 text-center`}>
                  {project.contrato.dataAssinatura
                    ? `${getDateDiff(
                        new Date(),
                        new Date(project.contrato.dataAssinatura)
                      )} DIAS`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {credentials.regional == undefined && (
        <Link href={"/comercial/addProjeto"}>
          <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">Novo projeto</p>
          </a>
        </Link>
      )}
      {credentials.regional == undefined && (
        <Link href={"/comercial/formulariosSolicitacao"}>
          <a className="fixed bg-[#15599a] cursor-pointer ml-36 hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">Formulários</p>
          </a>
        </Link>
      )}
      {modalIsOpen && (
        <ModalComercial
          handleUpdates={handleUpdates}
          project={modalProject}
          editor={
            credentials.accessibleRoutes.includes("PPS") &&
            credentials.regional == undefined
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

export default Comercial;
