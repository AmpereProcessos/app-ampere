import React, { useState, useEffect, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import Select from "react-select";
import {
  cidadesAtendidas,
  customersAcquisitionChannels,
  equipesTecnicas,
  vendedores,
} from "../../utils/constants";
import ModalDB from "../../components/ModalDB";
import SelectInput from "../../components/SelectInput";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "../../components/utils/LoadingPage";
import FilterButton from "../../components/utils/Buttons/FilterButton";
function BandoDeDados({ data }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  // Data
  const [projects, setProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState();

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
    insider: [],
    canal: [],
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
        canalVenda:
          filters.canal.length > 0 ? { $in: filters.canal } : { $ne: "" },
        insider:
          filters.insider.length > 0 ? { $in: filters.insider } : { $ne: "" },
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
        canalVenda:
          filters.canal.length > 0 ? { $in: filters.canal } : { $ne: "" },
        insider:
          filters.insider.length > 0 ? { $in: filters.insider } : { $ne: "" },
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
        canalVenda:
          filters.canal.length > 0 ? { $in: filters.canal } : { $ne: "" },
        insider:
          filters.insider.length > 0 ? { $in: filters.insider } : { $ne: "" },
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
  function getListCumulativePeakPot() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      if (filteredProjects[i].tipoDeServico == "OPERAÇÃO E MANUTENÇÃO") {
        totalSum = totalSum;
      } else {
        let pot = filteredProjects[i].sistema?.potPico
          ? filteredProjects[i].sistema.potPico
          : null;
        if (isNaN(pot)) {
          totalSum = totalSum;
        } else {
          totalSum = totalSum + pot;
        }
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
      let oem = !isNaN(filteredProjects[i].oem?.valor)
        ? filteredProjects[i].oem.valor
        : 0;

      totalSum =
        Number(totalSum) + Number(projeto) + Number(padrao) + Number(oem);
    }
    return totalSum;
  }
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
                BANCO DE DADOS
              </p>
              {filteredProjects && (
                <p className="font-bold text-[#fead61]">
                  ({filteredProjects?.length})
                </p>
              )}
            </div>
            {dropdownMenuVisible ? (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setDropdownMenuVisible(false)}
                />
              </div>
            ) : (
              <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setDropdownMenuVisible(true)}
                />
              </div>
            )}
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col w-full gap-y-2 mt-4"
              >
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <input
                    className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                    placeholder="DIGITE O NOME DO CONTRATO"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="NºMÓDULOS > QUE"
                    className="outline-none p-1.5 w-full lg:w-[200px] rounded border border-gray-200 placeholder:italic"
                    value={filters.numModulos}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        numModulos: Number(e.target.value),
                      })
                    }
                  />
                  <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
                    <div className="flex items-center gap-x-2 justify-center">
                      <div className="flex flex-col w-fit items-center">
                        <span className="uppercase font-bold font-raleway text-center text-sm">
                          Depois de:
                        </span>
                        <input
                          className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                          type="date"
                          value={
                            dateFilter.after &&
                            new Date(dateFilter.after)
                              .toISOString()
                              .slice(0, 10)
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
                            new Date(dateFilter.before)
                              .toISOString()
                              .slice(0, 10)
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
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti={false}
                        placeholder={"CAMPO DE FILTRO"}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
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
                            field1:
                              e.value != null ? e.value.split(".")[0] : null,
                            field2:
                              e.value != null ? e.value.split(".")[1] : null,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="CANAL"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          canal: e.map((x) => x.value),
                        })
                      }
                      options={customersAcquisitionChannels}
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="CIDADE"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="VENDEDOR"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="INSIDER"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
                      options={vendedores
                        .filter((x) => x.qualificacao?.includes("INSIDE"))
                        .map((vendedor) => {
                          return {
                            label: vendedor.nome,
                            value: vendedor.nome,
                          };
                        })}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          insider: e.map((x) => x.value),
                        })
                      }
                      closeMenuOnSelect={false}
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti
                      placeholder="EQUIPE DE MONTAGEM"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
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
                  </div>

                  <SelectInput
                    label={"CONDIÇÃO DO O&M"}
                    editable={true}
                    value={filters.condicaoOeM}
                    options={[
                      { label: "TODOS", value: "TODOS" },
                      {
                        label: "O&M EM VENCIMENTO",
                        value: "O&M EM VENCIMENTO",
                      },
                      { label: "O&M VENCIDO", value: "O&M VENCIDO" },
                    ]}
                    handleChange={(value) =>
                      setFilters({ ...filters, condicaoOeM: value })
                    }
                  />
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
                    } font-bold p-2 rounded h-[41px] cursor-pointer`}
                  >
                    ENTREGA TÉCNICA FEITA
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <FilterButton
                    text={"FILTRAR"}
                    icon={<AiOutlineSearch />}
                    handleClick={handleGetByFilters}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <nav className="my-4" aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px">
              <li>
                <a
                  onClick={() => {
                    if (currentPage == 1) return;
                    getProjects(currentPage - 1);
                    setCurrentPage((prevState) => prevState - 1);
                  }}
                  className="px-3 py-2 cursor-pointer ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Anterior
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (currentPage != 1) {
                      setCurrentPage(1);
                      getProjects(1);
                    } else return;
                  }}
                  className={`px-3 py-2 cursor-pointer ${
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
                  onClick={() => {
                    if (currentPage != 2) {
                      setCurrentPage(2);
                      getProjects(2);
                    } else return;
                  }}
                  className={`px-3 py-2 cursor-pointer ${
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
                  onClick={() => {
                    if (currentPage != 3) {
                      setCurrentPage(3);
                      getProjects(3);
                    } else return;
                  }}
                  className={`px-3 py-2 cursor-pointer ${
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
                  onClick={() => {
                    if (currentPage != 4) {
                      setCurrentPage(4);
                      getProjects(4);
                    } else return;
                  }}
                  className={`px-3 py-2 cursor-pointer ${
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
                  onClick={() => {
                    if (currentPage == 4) return;
                    getProjects(currentPage + 1);
                    setCurrentPage((prevState) => prevState + 1);
                  }}
                  className="px-3 py-2 cursor-pointer leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Próximo
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex  justify-around gap-3 mt-4 flex-wrap">
          {!filteredProjects ? (
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
                className="w-full md:w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700">
                    {project.nomeDoContrato}
                  </p>
                  <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <div className="flex flex-col">
                    <span className="text-xxs">CIDADE</span>
                    <p className="text-xs text-yellow-500">
                      {project.cidade && project.cidade}
                    </p>
                  </div>
                  <div className="flex flex-col">
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
