import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ModalDB from "../../components/ModalDB";
import Select from "react-select";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import axios from "axios";
function BandoDeDados({ data, credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [opInProgress, setOpInProgress] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    cidadeFilter: [],
    vendedorFilter: [],
    sorteioFilter: false,
  });
  function getProjects() {
    axios
      .post("/api/projects/bancoDeDados", { skip: 0, greater: 0 })
      .then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch((err) => console.log(err));
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
  function handleFetchMoreProjects(page) {
    setCurrentPage(page);
    setOpInProgress(true);
    let lastId = projects.length > 0 ? projects[projects.length - 1].qtde : 0;
    console.log(projects, lastId);
    axios
      .post("/api/projects/bancoDeDados", {
        skip: projects.length,
        greater: page * 200 - 200,
      })
      .then((res) => {
        let arr = [...projects, ...res.data];
        setProjects(res.data);
        setFilteredProjects(res.data);
        setOpInProgress(false);
      });
  }

  function handleFilters() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
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
    if (filters.sorteioFilter) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.vendedor.nome != "ARTUR MILANE" &&
          (project.nps > 5 || project.jornada.dataNps == undefined)
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
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
      <div className="flex flex-col items-center justify-between gap-x-2 border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            BANCO DE DADOS
          </p>
          {filteredProjects && (
            <p className="text-[#fead61] font-raleway">
              ({filteredProjects.length})
            </p>
          )}
        </div>
        <nav aria-label="Page navigation example mt-2">
          <ul className="inline-flex -space-x-px">
            <li>
              <p
                onClick={() => handleFetchMoreProjects(1)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 1 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                1
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(2)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 2 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                2
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(3)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 3 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                3
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(4)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 4 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                4
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(5)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 5 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                5
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(6)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 6 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                6
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(7)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 7 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                7
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(8)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 8 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                8
              </p>
            </li>
            <li>
              <p
                onClick={() => handleFetchMoreProjects(9)}
                className={`px-3 py-2 leading-tight text-gray-500 ${
                  currentPage == 9 ? "bg-blue-100" : "bg-white"
                } border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                9
              </p>
            </li>
          </ul>
        </nav>
        {opInProgress && (
          <p className="text-center italic text-[#15599a] text-sm">
            Carregando...
          </p>
        )}
        <div className="flex gap-2 flex-wrap justify-center mt-2">
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
          <div
            onClick={() =>
              setFilters({ ...filters, sorteioFilter: !filters.sorteioFilter })
            }
            className={`${
              filters.sorteioFilter ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            FILTRO SORTEIO
          </div>
          <Select
            isMulti
            placeholder="VENDEDOR"
            options={vendedores.map((vendedor) => {
              return {
                label: vendedor.nome,
                value: vendedor.nome,
              };
            })}
            onChange={(e) =>
              setFilters({
                ...filters,
                vendedorFilter: e.map((x) => x.value),
              })
            }
            closeMenuOnSelect={false}
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
                {
                  label: "DATA DO PARECER",
                  value: "parecer.dataParecerDeAcesso",
                },
                {
                  label: "DATA ASS.CONTRATO",
                  value: "contrato.dataAssinatura",
                },
                {
                  label: "DATA PAG.KIT",
                  value: "compra.dataPagamento",
                },
                { label: "TROCA DO MEDIDOR", value: "medidor.data" },
                { label: "DATA PEDIDO", value: "compra.dataPedido" },
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
          <input
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <button
            onClick={handleFilters}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-2  items-center gap-x-2"
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
            <div className="flex items-center mt-2 justify-between">
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">CIDADE</span>
                <p className="text-xs text-yellow-500">
                  {project.cidade && project.cidade}
                </p>
              </div>
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">VENDEDOR</span>
                <p className="text-xs text-[#15599a]">
                  {project.vendedor && project.vendedor.nome}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalDB
          project={modalProject}
          handleUpdates={handleUpdates}
          editor={
            credentials != {} &&
            !credentials.visualizacao &&
            [
              "Projetos",
              "Obras",
              "Suprimentos",
              "O&M",
              "Marketing",
              "Vendas",
              "Pós-Venda",
              "PPS",
              "InsideSales",
              "Financeiro",
              "ADM",
              "RH",
            ].every((el) => credentials.accessibleRoutes.includes(el))
              ? true
              : false
          }
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default BandoDeDados;
