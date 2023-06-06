import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import ModalProjetos from "../../components/ModalProjetos";
import ProjetosSkeleton from "../../components/skeletons/ProjetosSkeleton";
import {
  projetistas,
  cidadesAtendidas,
  vendedores,
  tiposDeServico,
  statusDoParecerDeAcesso,
} from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function Projetos() {
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
  const [searchFilter, setSearchFilter] = useState("");
  const [filters, setFilters] = useState({
    parecerFilter: [],
    vistoriaFilter: [],
    projetistaFilter: [],
    distribuicaoFilter: [],
    tipoDeServicoFilter: [],
    assinFaltando: false,
    desenhoFilter: false,
    parecerReprovado: false,
    vistoriaReprovada: false,
    obraStatusFilter: [],
    entregaStatusFilter: [],
    cidadeFilter: [],
    vendedorFilter: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/projects/projetos", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else {
      axios.get("/api/projects/projetos").then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
    }
  }
  function handleUpdates(id) {
    var index = projects.findIndex((x) => x._id == id);
    var indexFiltered = filteredProjects.findIndex((x) => x._id == id);
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      var arr = [...projects];
      arr[index] = res.data[0];
      var arrFiltered = [...filteredProjects];
      arrFiltered[indexFiltered] = res.data[0];
      setModalProject(res.data[0]);
      setProjects(arr);
      setFilteredProjects(arrFiltered);
    });
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
    if (filters.parecerFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = projects.filter((project) =>
        filters.parecerFilter.includes(project.parecer.statusDoParecerDeAcesso)
      );
    }
    if (filters.vistoriaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vistoriaFilter.includes(call.vistoria?.status)
      );
    }
    if (filters.projetistaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.projetistaFilter.includes(call.projeto.projetista.nome)
      );
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.tipoDeServicoFilter.includes(call.tipoDeServico)
      );
    }
    if (filters.distribuicaoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.distribuicaoFilter.includes(call.dadosCemig.distCreditos)
      );
    }
    if (filters.obraStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.obraStatusFilter.includes(call.obra.statusDaObra)
      );
    }
    if (filters.entregaStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      if (filters)
        newArr = newArr.filter((call) =>
          filters.entregaStatusFilter.includes(call.compra.statusEntrega)
        );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      if (filters)
        newArr = newArr.filter((call) =>
          filters.cidadeFilter.includes(call.cidade)
        );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      if (filters)
        newArr = newArr.filter((call) =>
          filters.vendedorFilter.includes(call.vendedor.nome)
        );
    }
    if (filters.desenhoFilter) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => call.projeto.desenhoTelhado != "OK");
    }
    if (filters.assinFaltando) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.projeto.dataLiberacaoDocumentacao != undefined &&
          (project.projeto.dataAssDocumentacao == undefined ||
            project.projeto.dataAssDocumentacao == null ||
            project.projeto.dataAssDocumentacao == "-")
      );
    }
    if (filters.parecerReprovado) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.parecer.parecerReprovado == "SIM"
      );
    }
    if (filters.vistoriaReprovada) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.vistoria.vistoriaReprovada == "SIM"
      );
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          project[dateFilter.field1][dateFilter.field2] <= dateFilter.before
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
  function getBorderColorByParecer(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 110) {
      return "border-2 border-red-600";
    } else if (diffDays > 105) {
      return "border-2 border-yellow-500";
    } else if (diffDays > 90) {
      return "border-2 border-blue-700";
    } else {
      return "border border-gray-200";
    }
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
      session?.user.accessibleRoutes.includes("Projetos") ||
      session?.user.accessibleRoutes.includes("Pós-Venda")
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
  function getTotalCircuitBreakers() {
    var circuitBreakerObj = {};
    for (let i = 0; i < filteredProjects.length; i++) {
      const cbArr = filteredProjects[i].material?.disjuntores;
      if (cbArr) {
        for (let j = 0; j < cbArr.length; j++) {
          var tag = `${cbArr[j].tipo} ${cbArr[j].corrente}A`;
          var currentTagQtde = circuitBreakerObj[tag]
            ? circuitBreakerObj[tag]
            : 0;
          circuitBreakerObj[tag] = currentTagQtde + cbArr[j].qtde;
        }
      }
    }
    if (Object.keys(circuitBreakerObj).length > 0) {
      return circuitBreakerObj;
    } else {
      return null;
    }
  }
  // [1462, 1521, 1522, 1523, 1524, 1526, 1527, 1528, 1535, 1537, 1538, 1539, 1540, 1541, 1542, 1546, 1548, 1549, 1550, 1551, 1552, 1553, 1554]
  // [1462, 1521, 1522, 1523, 1524, 1526, 1527, 1528, 1534, 1535, 1537, 1538, 1539, 1540, 1541, 1542, 1546, 1548, 1549, 1550, 1551, 1552, 1553, 1554]

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    if (filteredProjects) {
      return (
        <div className="p-6 grow">
          <div className="flex flex-col justify-between items-center  gap-2 border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col lg:flex-row items-center gap-2 font-['Roboto']">
                <p className="font-bold uppercase text-2xl text-[#15599a] text-center">
                  Projetos no estágio de engenharia
                </p>
                <p className="font-bold text-[#fead61]">
                  ({filteredProjects.length})
                </p>
                {filteredProjects && (
                  <p className="font-bold text-[#fead61]">
                    ({getListCumulativePeakPot()}kWp)
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
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                    <input
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
                              label: "DATA DE PAGAMENTO",
                              value: "compra.dataPagamento",
                            },
                            {
                              label: "DATA ASS.CONTRATO",
                              value: "contrato.dataAssinatura",
                            },
                            {
                              label: "DATA ASS.DOCUMENTAÇÃO",
                              value: "projeto.dataAssDocumentacao",
                            },
                            {
                              label: "TROCA DO MEDIDOR",
                              value: "medidor.data",
                            },
                            {
                              label: "DATA DE SOLICITAÇÃO DO PARECER",
                              value: "projeto.dataSolicitacaoAcesso",
                            },
                            {
                              label: "APROVAÇÃO DO PARECER",
                              value: "parecer.dataParecerDeAcesso",
                            },
                            {
                              label: "PEDIDO DA VISTORIA",
                              value: "vistoria.dataPedido",
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
                        placeholder="STATUS DA ENTREGA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            entregaStatusFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { value: "EM ROTA", label: "EM ROTA" },
                          {
                            value: "AGUARDANDO COMPRA",
                            label: "AGUARDANDO COMPRA",
                          },
                          { value: "ENTREGUE", label: "ENTREGUE" },
                          { value: "NÃO DEFINIDO", label: "NÃO DEFINIDO" },
                          { value: "CANCELADO", label: "CANCELADO" },
                          { value: undefined, label: "VAZIO" },
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
                        placeholder="STATUS DO PARECER"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            parecerFilter: e.map((x) => x.value),
                          })
                        }
                        options={statusDoParecerDeAcesso}
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
                        placeholder="STATUS DA OBRA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            obraStatusFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            label: "AGENDADA",
                            value: "AGENDADA",
                          },
                          {
                            label: "AGUARDANDO AGENDAMENTO",
                            value: "AGUARDANDO AGENDAMENTO",
                          },
                          {
                            label: "CONCLUIDA",
                            value: "CONCLUIDA",
                          },
                          {
                            label: "EM ANDAMENTO",
                            value: "EM ANDAMENTO",
                          },
                          {
                            label: "OBRA CANCELADA",
                            value: "OBRA CANCELADA",
                          },
                          {
                            label: "NÃO DEFINIDO",
                            value: "NÃO DEFINIDO",
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
                        placeholder="PROJETISTA"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            projetistaFilter: e.map((x) => x.value),
                          })
                        }
                        options={projetistas.map((projetista) => {
                          return {
                            label: projetista.label,
                            value: projetista.nome,
                          };
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
                        placeholder="VENDEDOR"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            vendedorFilter: e.map((x) => x.value),
                          })
                        }
                        options={vendedores.map((vendedor) => {
                          return {
                            label: vendedor.nome,
                            value: vendedor.nome,
                          };
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
                        placeholder="DIST. CRÉDITOS"
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            distribuicaoFilter: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { label: "SIM", value: "SIM" },
                          { label: "NÃO", value: "NÃO" },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          desenhoFilter: !filters.desenhoFilter,
                        })
                      }
                      className={`${
                        filters.desenhoFilter ? "bg-[#15599a]" : "bg-blue-300"
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      DESENHO PENDENTE
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          assinFaltando: !filters.assinFaltando,
                        })
                      }
                      className={`${
                        filters.assinFaltando ? "bg-[#15599a]" : "bg-blue-300"
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      FALTANDO ASSINATURA
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          parecerReprovado: !filters.parecerReprovado,
                        })
                      }
                      className={`${
                        filters.parecerReprovado
                          ? "bg-[#15599a]"
                          : "bg-blue-300"
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      PARECER REPROVADO
                    </div>
                    <div
                      onClick={() =>
                        setFilters({
                          ...filters,
                          vistoriaReprovada: !filters.vistoriaReprovada,
                        })
                      }
                      className={`${
                        filters.vistoriaReprovada
                          ? "bg-[#15599a]"
                          : "bg-blue-300"
                      } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      VISTORIA REPROVADA
                    </div>
                  </div>
                  {getTotalCircuitBreakers() ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <h1 className="text-gray-600 font-medium">
                        CONTAGEM DE DISJUNTORES CADASTRADOS
                      </h1>
                      {Object.keys(getTotalCircuitBreakers()).map((key) => (
                        <p className="bg-[#15599a] text-white p-1 rounded">
                          {key} - ({getTotalCircuitBreakers()[key]} UN)
                        </p>
                      ))}
                    </div>
                  ) : null}
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
                onClick={() => {
                  handleOpenModal(project._id);
                }}
                key={project._id}
                initial={{ opacity: 0, translateX: -50, translateY: -35 }}
                animate={{ opacity: 1, translateX: 0, translateY: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                className={`w-full md:w-[350px] lg:w-[450px] cursor-pointer ${
                  project.parecer.dataParecerDeAcesso != undefined &&
                  project.vistoria.status != "REALIZADA"
                    ? getBorderColorByParecer(
                        new Date(project.parecer.dataParecerDeAcesso),
                        new Date()
                      )
                    : "border border-gray-200"
                }  hover:bg-blue-100`}
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
                    <div>
                      <span className="text-xxs">PARECER DE ACESSO</span>
                      <p className="text-xs text-gray-600">
                        {project.parecer.statusDoParecerDeAcesso
                          ? project.parecer.statusDoParecerDeAcesso
                          : "-"}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className="text-xxs text-end">VISTORIA</span>
                      <p className="text-xs text-center text-gray-600">
                        {project.vistoria.status
                          ? project.vistoria.status
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xxs">DIAGRAMA UNIFILAR</span>
                      <p
                        className={`${
                          project.projeto.diagramaUnifilar
                            ? "text-yellow-500"
                            : "text-red-400"
                        } text-xs uppercase`}
                      >
                        {project.projeto.diagramaUnifilar
                          ? project.projeto.diagramaUnifilar
                          : "PENDENTE"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xxs text-center">
                        {project.compra.statusEntrega == "ENTREGUE"
                          ? "DATA DE ENTREGA"
                          : "PREV. DE ENTREGA"}
                      </span>
                      <p
                        className={`text-gray-600 text-xs uppercase text-center`}
                      >
                        {project.compra.statusEntrega == "ENTREGUE" &&
                        project.compra.dataEntrega
                          ? dayjs(project.compra.dataEntrega)
                              .add(4, "h")
                              .format("DD/MM/YYYY")
                          : project.compra.previsaoEntrega
                          ? dayjs(project.compra.previsaoEntrega)
                              .add(4, "h")
                              .format("DD/MM/YYYY")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xxs">DESENHO DO TELHADO</span>
                      <p className="text-xs text-gray-600 text-center">
                        {project.projeto.desenhoTelhado
                          ? project.projeto.desenhoTelhado
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full flex flex-col">
                      <span className="text-xxs">DESDE ASS.CONTRATO</span>
                      <p
                        className={`text-xs uppercase text-red-500 text-start`}
                      >
                        {project.contrato.dataAssinatura
                          ? `${getDateDiff(
                              new Date(),
                              new Date(project.contrato.dataAssinatura)
                            )} DIAS`
                          : "-"}
                      </p>
                    </div>
                    {project.parecer.statusDoParecerDeAcesso ==
                      "PARECER DE ACESSO COM OBRAS" && (
                      <div className="w-full flex flex-col">
                        <span className="text-xxs text-center">
                          DIAS DE OBRA
                        </span>
                        <p
                          className={`text-xs uppercase text-red-500 text-center`}
                        >
                          {project.parecer.qtdeDiasObraDeRede
                            ? `${project.parecer.qtdeDiasObraDeRede} DIAS`
                            : "-"}
                        </p>
                      </div>
                    )}
                    <div className="w-full flex flex-col">
                      <span className="text-xxs text-end">
                        DESDE APROV.PARECER
                      </span>
                      <p className={`text-xs uppercase text-red-500 text-end`}>
                        {project.parecer.dataParecerDeAcesso
                          ? `${getDateDiff(
                              new Date(),
                              new Date(project.parecer.dataParecerDeAcesso)
                            )} DIAS`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  {project.projeto.dataSolicitacaoAcesso ? (
                    <div className="flex items-center w-full justify-between">
                      <p className="text-xxs ">
                        {project.parecer?.dataParecerDeAcesso
                          ? "ATÉ APROVAÇÃO DO PARECER"
                          : "DESDE A SOLICITAÇÃO DE ACESSO"}
                      </p>
                      <p className="text-xs text-gray-600 text-start">
                        {project.parecer?.dataParecerDeAcesso
                          ? `${getDateDiff(
                              new Date(project.parecer?.dataParecerDeAcesso),
                              new Date(project.projeto.dataSolicitacaoAcesso)
                            )} DIAS`
                          : `${getDateDiff(
                              new Date(),
                              new Date(project.projeto.dataSolicitacaoAcesso)
                            )} DIAS`}
                      </p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
          <Link href={"/projetos/visitaTecnica"}>
            <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
              <p className="uppercase font-bold text-sm">Visitas técnicas</p>
            </a>
          </Link>
          {modalIsOpen && (
            <ModalProjetos
              credentials={session?.user}
              modalIsOpen={modalIsOpen}
              handleUpdates={handleUpdates}
              project={modalProject}
              editor={
                session?.user?.accessibleRoutes.includes("Projetos") &&
                session?.user?.regional == undefined
                  ? true
                  : false
              }
              setModalIsOpen={setModalIsOpen}
            />
          )}
        </div>
      );
    } else {
      return <ProjetosSkeleton />;
    }
  }
}

export default Projetos;
