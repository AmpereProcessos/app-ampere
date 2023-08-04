import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ModalADM from "../../components/ModalADM";
import ADMSkeleton from "../../components/skeletons/ADMSkeleton";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import { equipesTecnicas, statusLiberacao } from "../../utils/constants";
import dayjs from "dayjs";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function Administracao() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [projects, setProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState();
  const [filters, setFilters] = useState({
    contratoFilter: [],
    pagamentoFilter: [],
    empresaAFaturar: [],
    equipResp: [],
    vistoriaFilter: [],
    dataSaidaDeObra: null,
    pesquisaFilter: "",
    paraCobrar: false,
    paraFaturar: false,
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
    if (filters.empresaAFaturar.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.empresaAFaturar.includes(call.faturamento?.empresaFaturamento)
      );
    }
    if (filters.paraCobrar) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => call.pagamento.cobrancaFeita != true);
    }
    if (filters.paraFaturar) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => call.faturamento.concluido != true);
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
    setFilters({ ...filters, pesquisaFilter: value });
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
    if (
      session?.user.accessibleRoutes.includes("ADM") ||
      session?.user.accessibleRoutes.includes("Marketing")
    ) {
      if (!projects) {
        getProjects();
      }
    }
  }, [session]);

  if (status == "loading") return <LoadingPage />;

  if (status == "authenticated") {
    if (filteredProjects) {
      return (
        <div className="p-6 grow">
          <div className="flex flex-col gap-y-2 items-center border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex flex-col lg:flex-row items-center gap-2 font-['Roboto']">
                <p className="font-bold uppercase text-2xl text-[#15599a] text-center">
                  Controle de projetos - Administração
                </p>
                <p className="font-bold text-[#fead61]">
                  ({filteredProjects.length})
                </p>
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
                      type="text"
                      className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO CONTRATO"
                      value={filters.pesquisaFilter}
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
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              width: "100%",
                              minHeight: "41px",
                            }),
                          }}
                          placeholder={"CAMPO DE FILTRO"}
                          options={[
                            { label: "SAÍDA DE OBRA", value: "obra.saida" },
                            {
                              label: "TROCA DO MEDIDOR",
                              value: "medidor.data",
                            },
                            {
                              label: "DATA ASS.CONTRATO",
                              value: "contrato.dataAssinatura",
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
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        placeholder="EMPRESA A FATURAR"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            empresaAFaturar: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            label: "AMPERE ENERGIAS",
                            value: "AMPERE ENERGIAS",
                          },
                          {
                            label: "ANALISE DO FINANCEIRO",
                            value: "ANALISE DO FINANCEIRO",
                          },
                          {
                            label: "IZAIRA SERVIÇOS",
                            value: "IZAIRA SERVIÇOS",
                          },
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        ]}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        placeholder="EQUIP.RESP"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            equipResp: e.map((x) => x.value),
                          })
                        }
                        options={equipesTecnicas.map((equipe) => equipe)}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
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
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
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
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
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
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <div
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          paraCobrar: !prev.paraCobrar,
                        }))
                      }
                      className={`font-bold cursor-pointer rounded border border-[#15599a] p-1 ${
                        filters.paraCobrar
                          ? "text-white bg-[#15599a]"
                          : "bg-transparent text-[#15599a]"
                      }`}
                    >
                      COBRANÇA PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          paraFaturar: !prev.paraFaturar,
                        }))
                      }
                      className={`font-bold cursor-pointer rounded border border-[#15599a] p-1 ${
                        filters.paraFaturar
                          ? "text-white bg-[#15599a]"
                          : "bg-transparent text-[#15599a]"
                      }`}
                    >
                      FATURAMENTO PENDENTE
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
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
                initial={{ opacity: 0, translateX: -50, translateY: -35 }}
                animate={{ opacity: 1, translateX: 0, translateY: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                onClick={() => {
                  handleOpenModal(project._id);
                }}
                key={project._id}
                className="w-full md:w-[350px] lg:w-[450px] cursor-pointer border border-gray-200 hover:bg-blue-100"
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs text-gray-700">
                      {project.nomeDoContrato}
                    </p>
                    <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xxs">STATUS DE COBRANÇA</span>
                      <p
                        className={`text-xs p-1 rounded border font-black ${
                          project.pagamento?.cobrancaFeita
                            ? "text-green-500 border border-green-500"
                            : "text-red-500 border border-red-500"
                        }`}
                      >
                        {project.pagamento?.cobrancaFeita
                          ? "REALIZADA"
                          : "PENDENTE"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-xxs">EMPRESA À FATURAR</span>
                      <p
                        className={`text-sm font-bold p-1 rounded text-gray-500 `}
                      >
                        {project.faturamento?.empresaFaturamento
                          ? project.faturamento?.empresaFaturamento
                          : "NÃO DEFINIDO"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-xxs">STATUS DE FATURAMENTO</span>
                      <p
                        className={`text-xs p-1 rounded border font-black ${
                          project.faturamento?.concluido
                            ? "text-green-500 border border-green-500"
                            : "text-red-500 border border-red-500"
                        }`}
                      >
                        {project.faturamento?.concluido
                          ? "REALIZADO"
                          : "PENDENTE"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xxs">SAÍDA DE OBRA</span>
                      <p className="text-xs text-yellow-500">
                        {project.obra?.saida
                          ? dayjs(project.obra.saida)
                              .add(4, "hours")
                              .format("DD/MM/YYYY")
                          : "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xxs text-end">VENDEDOR</span>
                      <p className="text-xs text-[#15599a]">
                        {project.vendedor && project.vendedor.nome}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 items-start">
                      <p className="text-xxs">TIPO DE PAGAMENTO</p>
                      <p className="text-xs text-gray-600">
                        {project.pagamento?.forma && project.pagamento.forma}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <p className="text-xxs text-end">PAGAMENTO DO KIT</p>
                      <p className="text-xs text-gray-600 text-end">
                        {project.compra?.statusLiberacao
                          ? project.compra.statusLiberacao
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {session?.user?.visualizacao == undefined && (
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
              modalIsOpen={modalIsOpen}
              editor={
                session?.user && session?.user?.accessibleRoutes.includes("ADM")
                  ? true
                  : false
              }
              setModalIsOpen={setModalIsOpen}
              credentials={session?.user}
            />
          )}
        </div>
      );
    } else {
      return <ADMSkeleton />;
    }
  }
}

export default Administracao;
