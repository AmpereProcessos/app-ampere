import React, { useState, useEffect, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import Select from "react-select";
import { motion } from "framer-motion";
import {
  cidadesAtendidas,
  equipesTecnicas,
  vendedores,
} from "../../utils/constants";
import ModalDB from "../../components/ModalDB";
import SelectInput from "../../components/SelectInput";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function BandoDeDados({ data }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  // Data
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Modal Control
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});

  // Filters
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
    equipeFilter: [],
    entregaTecnicaFeita: false,
    condicaoOeM: "TODOS",
    numModulos: null,
  });

  // Functions
  function getProjects(page) {
    setOpInProgress(true);
    axios
      .get(`/api/projects/bancoDeDados?page=${page}`)
      .then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
        setOpInProgress(false);
      })
      .catch((err) => console.log(err));
  }
  // function handleSearchFilter(value) {
  //   setSearchFilter(value);
  //   if (value != "" || " ") {
  //     let newArr = projects.filter((call) =>
  //       call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
  //     );
  //     setFilteredProjects(newArr);
  //   } else {
  //     setFilteredProjects(projects);
  //   }
  // }
  function handleGetByFilters() {
    var matchObj;
    var equipes = equipesTecnicas.map((equipe) => equipe.value);
    console.log(equipes);
    if (filters.condicaoOeM == "TODOS") {
      matchObj = {
        cidade:
          filters.cidadeFilter.length > 0
            ? { $in: filters.cidadeFilter }
            : { $ne: null },
        "vendedor.nome":
          filters.vendedorFilter.length > 0
            ? { $in: filters.vendedorFilter }
            : { $ne: null },
        "obra.equipeResp":
          filters.equipeFilter.length > 0
            ? { $in: filters.equipeFilter }
            : { $ne: "" },
        "sistema.qtdeModulos":
          filters.numModulos != 0 && filters.numModulos
            ? { $gte: filters.numModulos }
            : { $ne: null },
        [`${
          dateFilter.field1
            ? `${[dateFilter.field1]}.${[dateFilter.field2]}`
            : "qtde"
        }`]: dateFilter.field1
          ? {
              $gte: dateFilter.after,
              $lte: dateFilter.before,
            }
          : { $ne: null },
        nomeDoContrato:
          searchFilter.length > 0
            ? { $regex: searchFilter.toUpperCase() }
            : { $ne: null },
        "jornada.entregaTecnica": filters.entregaTecnicaFeita
          ? true
          : { $in: [null, true, false] },
      };
    }
    if (filters.condicaoOeM == "O&M EM VENCIMENTO") {
      matchObj = {
        cidade:
          filters.cidadeFilter.length > 0
            ? { $in: filters.cidadeFilter }
            : { $ne: null },
        "vendedor.nome":
          filters.vendedorFilter.length > 0
            ? { $in: filters.vendedorFilter }
            : { $ne: null },
        "sistema.qtdeModulos":
          filters.numModulos != 0 && filters.numModulos
            ? { $gte: filters.numModulos }
            : { $ne: null },
        [`${
          dateFilter.field1
            ? `${[dateFilter.field1]}.${[dateFilter.field2]}`
            : "qtde"
        }`]: dateFilter.field1
          ? {
              $gte: dateFilter.after,
              $lte: dateFilter.before,
            }
          : { $ne: null },
        nomeDoContrato:
          searchFilter.length > 0
            ? { $regex: searchFilter.toUpperCase() }
            : { $ne: null },
        "jornada.entregaTecnica": filters.entregaTecnicaFeita
          ? true
          : { $in: [null, true, false] },
        $and: [
          {
            $expr: {
              $gt: [
                {
                  $dateDiff: {
                    startDate: {
                      $dateFromString: { dateString: "$medidor.data" },
                    },
                    endDate: ISODate("2023-01-24T08:00:00.000Z"),
                    unit: "day",
                  },
                },
                350,
              ],
            },
          },
          {
            $expr: {
              $lt: [
                {
                  $dateDiff: {
                    startDate: {
                      $dateFromString: { dateString: "$medidor.data" },
                    },
                    endDate: ISODate("2023-01-24T08:00:00.000Z"),
                    unit: "day",
                  },
                },
                365,
              ],
            },
          },
        ],
      };
    }
    if (filters.condicaoOeM == "O&M VENDIDO") {
      matchObj = {
        cidade:
          filters.cidadeFilter.length > 0
            ? { $in: filters.cidadeFilter }
            : { $ne: null },
        "vendedor.nome":
          filters.vendedorFilter.length > 0
            ? { $in: filters.vendedorFilter }
            : { $ne: null },
        "sistema.qtdeModulos":
          filters.numModulos != 0 && filters.numModulos
            ? { $gte: filters.numModulos }
            : { $ne: null },
        [`${
          dateFilter.field1
            ? `${[dateFilter.field1]}.${[dateFilter.field2]}`
            : "qtde"
        }`]: dateFilter.field1
          ? {
              $gte: dateFilter.after,
              $lte: dateFilter.before,
            }
          : { $ne: null },
        nomeDoContrato:
          searchFilter.length > 0
            ? { $regex: searchFilter.toUpperCase() }
            : { $ne: null },
        "jornada.entregaTecnica": filters.entregaTecnicaFeita
          ? true
          : { $in: [null, true, false] },
        $expr: {
          $gt: [
            {
              $dateDiff: {
                startDate: {
                  $dateFromString: { dateString: "$medidor.data" },
                },
                endDate: ISODate("2023-01-24T08:00:00.000Z"),
                unit: "day",
              },
            },
            365,
          ],
        },
      };
    }
    // setCurrentPage(page);
    // setOpInProgress(true);
    // let lastId = projects.length > 0 ? projects[projects.length - 1].qtde : 0;
    // console.log(projects, lastId);
    setOpInProgress(true);
    axios.post("/api/projects/bancoDeDados", matchObj).then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
      setCurrentPage(0);
      setOpInProgress(false);
    });
  }
  function handleUpdates(id) {
    axios
      .get(`/api/projects/fetchDoc/${id}`)
      .then((res) => setModalProject(res.data[0]));
  }
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  useEffect(() => {
    if (session?.user) {
      if (!projects) {
        setCurrentPage(1);
        getProjects(1);
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
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
          <div className="flex gap-2 flex-wrap justify-center mt-2">
            <div
              onClick={() => {
                setFilters({
                  ...filters,
                  entregaTecnicaFeita: !filters.entregaTecnicaFeita,
                });
              }}
              className={`${
                filters.entregaTecnicaFeita
                  ? "bg-blue-500 hover:bg-blue-300 text-black hover:text-white"
                  : "bg-blue-300 hover:bg-blue-500 text-white hover:text-black"
              } font-bold p-2 rounded h-[36px] cursor-pointer`}
            >
              ENTREGA TÉCNICA FEITA
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
            <Select
              isMulti
              placeholder="EQUIPE DE MONTAGEM"
              options={equipesTecnicas.map((equipe) => {
                return {
                  label: equipe.label,
                  value: equipe.value,
                };
              })}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  equipeFilter: e.map((x) => x.value),
                })
              }
              closeMenuOnSelect={false}
            />
            <input
              type="number"
              placeholder="NºModulos > que"
              className={
                "outline-none p-1.5 text-center rounded border border-gray-200 placeholder:italic"
              }
              value={filters.numModulos}
              onChange={(e) =>
                setFilters({ ...filters, numModulos: Number(e.target.value) })
              }
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
                    label: "DATA DE ENTREGA",
                    value: "compra.dataEntrega",
                  },
                  {
                    label: "DATA DE PREV.ENTREGA",
                    value: "compra.previsaoEntrega",
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
            <SelectInput
              label={"CONDIÇÃO DO O&M"}
              editable={true}
              value={filters.condicaoOeM}
              options={[
                { label: "TODOS", value: "TODOS" },
                { label: "O&M EM VENCIMENTO", value: "O&M EM VENCIMENTO" },
                { label: "O&M VENCIDO", value: "O&M VENCIDO" },
              ]}
              handleChange={(value) =>
                setFilters({ ...filters, condicaoOeM: value })
              }
            />
            <input
              className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
              placeholder="Digite o nome do contrato"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <button
              onClick={handleGetByFilters}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-2  items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
          </div>
          <nav className="my-4" aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px">
              <li>
                <a
                  href="#"
                  onClick={() => {
                    if (currentPage == 1) return;
                    getProjects(currentPage - 1);
                    setCurrentPage((prevState) => prevState - 1);
                  }}
                  className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Anterior
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    if (currentPage != 1) {
                      setCurrentPage(1);
                      getProjects(1);
                    } else return;
                  }}
                  className={`px-3 py-2 ${
                    currentPage == 1
                      ? "text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100"
                      : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                  } leading-tight  border border-gray-300`}
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    if (currentPage != 2) {
                      setCurrentPage(2);
                      getProjects(2);
                    } else return;
                  }}
                  className={`px-3 py-2 ${
                    currentPage == 2
                      ? "text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100"
                      : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                  } leading-tight  border border-gray-300`}
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    if (currentPage != 3) {
                      setCurrentPage(3);
                      getProjects(3);
                    } else return;
                  }}
                  className={`px-3 py-2 ${
                    currentPage == 3
                      ? "text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100"
                      : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                  } leading-tight  border border-gray-300`}
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    if (currentPage != 4) {
                      setCurrentPage(4);
                      getProjects(4);
                    } else return;
                  }}
                  className={`px-3 py-2 ${
                    currentPage == 4
                      ? "text-blue-700 bg-blue-300 hover:text-blue-500 hover:bg-blue-100"
                      : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                  } leading-tight  border border-gray-300`}
                >
                  4
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    if (currentPage == 4) return;
                    getProjects(currentPage + 1);
                    setCurrentPage((prevState) => prevState + 1);
                  }}
                  className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Próximo
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex  justify-around gap-3 mt-4 flex-wrap">
          {opInProgress ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                onClick={() => {
                  handleOpenModal(project._id);
                }}
                initial={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                key={project._id}
                className="w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700">
                    {project.nomeDoContrato}
                  </p>
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
                <div className="flex items-center mt-2 justify-between">
                  <p className="text-xs text-gray-700">TIPO DE SERVIÇO</p>
                  <p className="text-xs text-gray-700 font-bold">
                    {project.tipoDeServico ? project.tipoDeServico : "-"}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
        {modalIsOpen && (
          <ModalDB
            project={modalProject}
            handleUpdates={handleUpdates}
            editor={
              session?.user != {} &&
              !session?.user.visualizacao &&
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
              ].every((el) => session?.user.accessibleRoutes.includes(el))
                ? true
                : false
            }
            setModalIsOpen={setModalIsOpen}
          />
        )}
      </div>
    );
  }
}

export default BandoDeDados;
