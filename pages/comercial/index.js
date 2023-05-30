import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import ModalComercial from "../../components/ModalComercial";
import {
  statusLiberacao,
  tiposDeServico,
  vendedores,
} from "../../utils/constants";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import ComercialSkeleton from "../../components/skeletons/ComercialSkeleton";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";

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

function Comercial({ users }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [projects, setProjects] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(null);

  const [searchFilter, setSearchFilter] = useState("");
  const [codFilter, setCodFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
    vendedorFilter: [],
    tipoDeServicoFilter: [],
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
        filters.pagamentoFilter.includes(project.compra.statusLiberacao)
      );
    } else if (filters.contratoFilter.length > 0) {
      newArr = projects.filter((project) =>
        filters.contratoFilter.includes(project.contrato.status)
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.vendedorFilter.includes(project.vendedor.nome)
      );
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.tipoDeServicoFilter.includes(project.tipoDeServico)
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
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects(newArr);
      return newArr;
    }
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || value != " ") {
      let filtered = filterProjects();
      let newArr = filtered.filter((call) =>
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
  function handleUpdates(id) {
    axios
      .get(`/api/projects/fetchDoc/${id}`)
      .then((res) => setModalProject(res.data[0]));
    // let changedObj = projects.filter((project) => project._id == id);
    // setModalProject(changedObj[0]);
  }
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
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("PPS") ||
      session?.user.accessibleRoutes.includes("Marketing")
    ) {
      if (!projects) {
        getProjects(session.user);
      }
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    if (filteredProjects)
      return (
        <div className="p-6 grow">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
                <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
                  Projetos no estágio comercial
                </p>
                <p className="font-bold text-[#fead61]">
                  ({filteredProjects?.length})
                </p>
                {filteredProjects && (
                  <p className="font-bold text-[#fead61]">
                    ({getListCumulativePeakPot()}kWp)
                  </p>
                )}
                {filteredProjects && (
                  <p className="font-bold text-[#fead61]">
                    (R${getListCumulativeValue().toLocaleString()})
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
                      value={codFilter}
                      placeholder="CÓDIGO SVB"
                      onChange={(e) => handleCodFilter(e.target.value)}
                      className="outline-none p-1.5 w-full lg:w-[150px] rounded border border-gray-200 placeholder:italic"
                      type="number"
                    />
                    <input
                      type={"text"}
                      className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO CONTRATO"
                      value={searchFilter}
                      onChange={(e) => handleSearchFilter(e.target.value)}
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
                            {
                              label: "DATA DA LIBERAÇÃO",
                              value: "contrato.dataLiberacao",
                            },
                            {
                              label: "DATA ASS.CONTRATO",
                              value: "contrato.dataAssinatura",
                            },
                            {
                              label: "DATA PAG.KIT",
                              value: "compra.dataPagamento",
                            },
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
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="TIPO DE SERVIÇO"
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
                            tipoDeServicoFilter: e.map((x) => x.value),
                          })
                        }
                        options={tiposDeServico.map((tipo) => {
                          return { label: tipo.label, value: tipo.value };
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="STATUS CONTRATO"
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
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            vendedorFilter: e.map((x) => x.value),
                          })
                        }
                        options={vendedores.map((vendedor) => {
                          return { label: vendedor.nome, value: vendedor.nome };
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="STATUS DE LIBERAÇÃO"
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
                            pagamentoFilter: e.map((x) => x.value),
                          })
                        }
                        options={statusLiberacao.map((status) => {
                          return { label: status.label, value: status.value };
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-x-2">
                    <Link href="/comercial/analise">
                      <a className="p-1 border border-[#fead61] text-[#fead61] font-medium rounded">
                        ANALÍTICO
                      </a>
                    </Link>
                    <FilterButton
                      text={"FILTRAR"}
                      icon={<AiOutlineSearch />}
                      handleClick={filterProjects}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex  justify-around gap-3 mt-4 flex-wrap">
            {filteredProjects.map((project, index) => (
              <motion.div
                onClick={() => {
                  handleOpenModal(project._id);
                }}
                initial={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                key={project._id}
                className="w-full md:w-[350px] lg:w-[450px]  cursor-pointer border border-gray-200 hover:bg-blue-100"
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700">
                      {project.nomeDoContrato}
                    </p>
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
                        {project.pagamento?.status
                          ? project.pagamento.status
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div>
                      <span className="text-xxs">DESDE ASS.CONTRATO</span>
                      <p
                        className={`text-xs uppercase text-red-500 text-center`}
                      >
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
              </motion.div>
            ))}
          </div>
          {/* {session.user?.regional == undefined && (
            <Link href={"/comercial/addProjeto"}>
              <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
                <p className="uppercase font-bold text-sm">Novo projeto</p>
              </a>
            </Link>
          )} */}
          {session.user?.regional == undefined && (
            <Link href={"/comercial/cadastrosFenesc"}>
              <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
                <p className="uppercase font-bold text-sm">CAD.FENESC</p>
              </a>
            </Link>
          )}
          {session.user?.regional == undefined && (
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
                session.user?.accessibleRoutes.includes("PPS") &&
                session.user?.regional == undefined
                  ? true
                  : false
              }
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              credentials={session.user}
            />
          )}
        </div>
      );
    else return <ComercialSkeleton />;
  }
}

export default Comercial;
