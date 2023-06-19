import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Select from "react-select";
import {
  cidadesAtendidas,
  equipesTecnicas,
  oemPlans,
} from "../../utils/constants";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { GiPoliceBadge } from "react-icons/gi";
import ModalOeM from "../../components/ModalOeM";
import Link from "next/link";
import dayjs from "dayjs";
import SelectInput from "../../components/SelectInput";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
const statusStyles = {
  REALIZADO: {
    textColor: "text-green-500",
  },
  "NÃO REALIZADO": {
    textColor: "text-red-500",
  },
};
function OeM({ users }) {
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [opInProgress, setOpInProgress] = useState(false);
  const [filters, setFilters] = useState({
    cidadeFilter: [],
    equipResp: [],
    obraStatusFilter: [],
    planoOeM: [],
    clienteOeM: false,
    manutencaoPendente: false,
    manutencaoAtrasada: false,
    limparAteDezembro: false,
    appPendente: false,
    ordenarAlfabeticamente: false,
    numModulos: null,
    usinaLigadaFilter: [],
    condicaoOeM: "TODOS",
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [modalProject, setModalProject] = useState({});
  function getProjects(credenciais) {
    if (credenciais.visualizacao == "REGIONAL") {
      axios
        .post("/api/projects/oem", {
          filtrarPor: credenciais.visualizacao,
          parametro: credenciais.regional,
        })
        .then((res) => {
          setProjects(res.data);
          setFilteredProjects(res.data);
        });
    } else {
      axios.get("/api/projects/oem").then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
    }
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
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }
    if (filters.equipResp.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.equipResp.includes(call.obra?.equipeResp)
      );
    }
    if (filters.usinaLigadaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.usinaLigadaFilter.includes(call.conferencias.usinaLigada.status)
      );
    }
    if (filters.obraStatusFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.obraStatusFilter.includes(call.obra?.statusDaObra)
      );
    }
    if (filters.planoOeM.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.planoOeM.includes(call.oem?.plano)
      );
    }
    if (filters.clienteOeM) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.tipoDeServico == "OPERAÇÃO E MANUTENÇÃO"
      );
    }
    if (filters.appPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => project.app.data == undefined);
    }
    if (filters.ordenarAlfabeticamente) {
      if (!newArr) newArr = projects;
      newArr = newArr.sort((a, b) =>
        a.nomeDoContrato.trim().localeCompare(b.nomeDoContrato.trim())
      );
    }
    if (filters.manutencaoPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => project.manutencaoPreventiva.status == "NÃO REALIZADO"
      );
    }
    if (filters.condicaoOeM != "TODOS") {
      if (!newArr) newArr = projects;
      if (filters.condicaoOeM == "O&M EM VENCIMENTO") {
        newArr = newArr.filter(
          (project) =>
            project.medidor?.data &&
            dayjs().diff(dayjs(project.medidor?.data), "days") > 350 &&
            dayjs().diff(dayjs(project.medidor?.data), "days") <= 365
        );
      }
      if (filters.condicaoOeM == "O&M VENCIDO") {
        newArr = newArr.filter(
          (project) =>
            project.medidor?.data &&
            dayjs().diff(dayjs(project.medidor?.data), "days") > 365
        );
      }
      if (filters.condicaoOeM == "O&M ATIVO") {
        newArr = newArr.filter(
          (project) =>
            project.medidor?.data &&
            dayjs().diff(dayjs(project.medidor?.data), "days") < 365
        );
      }
    }
    if (filters.manutencaoAtrasada) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => {
        if (project.medidor.data) {
          var timeDiff = Math.abs(
            new Date().getTime() - new Date(project.medidor?.data).getTime()
          );
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          console.log(diffDays);
          return (
            project.manutencaoPreventiva.status == "NÃO REALIZADO" &&
            diffDays > 304
          );
        } else return false;
      });
    }
    if (filters.limparAteDezembro) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => {
        if (project.medidor.data) {
          var timeDiff = Math.abs(
            new Date("2022-12-31T20:35:47.757Z").getTime() -
              new Date(project.medidor?.data).getTime()
          );
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          console.log(diffDays);
          return (
            project.manutencaoPreventiva.status == "NÃO REALIZADO" &&
            diffDays > 365
          );
        } else return false;
      });
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.numModulos > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) => Number(call.sistema.qtdeModulos) > Number(filters.numModulos)
      );
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects([...newArr]);
      return newArr;
    }
  }
  function getListCumulativeModules() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      let modules = filteredProjects[i].sistema.qtdeModulos
        ? filteredProjects[i].sistema.qtdeModulos
        : null;
      if (isNaN(modules)) {
        totalSum = totalSum;
      } else {
        totalSum = totalSum + modules;
      }
    }
    return totalSum.toFixed(0);
  }
  function handleUpdates(id) {
    axios
      .get(`/api/projects/fetchDoc/${id}`)
      .then((res) => setModalProject({ ...res.data[0] }));
  }
  // function fetchMoreProjects() {
  //   setOpInProgress(true);
  //   let lastQtde = projects.length > 0 ? projects[projects.length - 1].qtde : 0;
  //   axios.post("/api/projects/oem", { greater: lastQtde }).then((res) => {
  //     let arr = [...projects, ...res.data];
  //     setOpInProgress(false);
  //     setProjects([...arr]);
  //     setFilteredProjects([...arr]);
  //   });
  // }
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  function checkOeMEnding(dataMedidor, tipoDeServico, dataAssinatura) {
    if (tipoDeServico == "OPERAÇÃO E MANUTENÇÃO") {
      if (dayjs().diff(dayjs(dataAssinatura), "days") > 15) {
        return { text: "O&M VENCIDO", color: "text-red-500" };
      } else {
        return { text: "O&M EM ANDAMENTO", color: "text-red-500" };
      }
    } else {
      if (dataMedidor) {
        if (dayjs().diff(dayjs(dataMedidor), "days") > 365) {
          return { text: "O&M VENCIDO", color: "text-red-500" };
        } else if (dayjs().diff(dayjs(dataMedidor), "days") > 350) {
          return { text: "O&M EM VENCIMENTO", color: "text-orange-500" };
        } else {
          return { text: "O&M EM ANDAMENTO", color: "text-green-500" };
        }
      } else return { text: "O&M EM ANDAMENTO", color: "text-green-500" };
    }
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("O&M") ||
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
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex flex-col lg:flex-row items-center gap-2 font-['Roboto']">
              <p className="font-bold uppercase text-2xl text-[#15599a] text-center">
                Projetos no estágio de O&M
              </p>
              <p className="font-bold text-[#fead61]">
                ({filteredProjects?.length})
              </p>
              {filteredProjects && (
                <p className="font-bold text-[#fead61]">
                  ({getListCumulativeModules().replace(".", ",")} módulos)
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
                    onChange={(e) => handleSearchFilter(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="> NºMÓDULOS"
                    className="outline-none p-1.5 w-full lg:w-[150px] rounded border border-gray-200 placeholder:italic"
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
                          { label: "TROCA DO MEDIDOR", value: "medidor.data" },
                          {
                            label: "DATA MANUTENÇÃO",
                            value: "manutencaoPreventiva.data",
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
                      placeholder={"CONDIÇÃO DO O&M"}
                      isMulti={false}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
                      value={
                        filters.condicaoOeM
                          ? [
                              { label: "TODOS", value: "TODOS" },
                              {
                                label: "O&M EM VENCIMENTO",
                                value: "O&M EM VENCIMENTO",
                              },
                              { label: "O&M VENCIDO", value: "O&M VENCIDO" },
                              { label: "O&M ATIVO", value: "O&M ATIVO" },
                            ].find((x) => x.value == filters.condicaoOeM)
                          : undefined
                      }
                      options={[
                        { label: "TODOS", value: "TODOS" },
                        {
                          label: "O&M EM VENCIMENTO",
                          value: "O&M EM VENCIMENTO",
                        },
                        { label: "O&M VENCIDO", value: "O&M VENCIDO" },
                        { label: "O&M ATIVO", value: "O&M ATIVO" },
                      ]}
                      onChange={(item) => {
                        console.log(item);
                        setFilters({ ...filters, condicaoOeM: item.value });
                      }}
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
                      placeholder="PLANO DE O&M"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          planoOeM: e.map((x) => x.value),
                        })
                      }
                      options={[
                        ...oemPlans.map((plano) => plano),
                        { label: "NÃO DEFINIDO", value: undefined },
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
                      placeholder="STATUS DA OBRA"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          obraStatusFilter: e.map((x) => x.value),
                        })
                      }
                      options={[
                        {
                          value: "EM ANDAMENTO",
                          label: "EM ANDAMENTO",
                        },
                        {
                          value: "PAUSADA",
                          label: "PAUSADA",
                        },
                        {
                          value: "AGENDADA",
                          label: "AGENDADA",
                        },
                        {
                          value: "AGUARDANDO AGENDAMENTO",
                          label: "AGUARDANDO AGENDAMENTO",
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
                      placeholder="USINA LIGADA"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          usinaLigadaFilter: e.map((x) => x.value),
                        })
                      }
                      options={[
                        { label: "NÃO REALIZADO", value: "NÃO REALIZADO" },
                        { label: "REALIZADO", value: "REALIZADO" },
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
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        clienteOeM: !filters.clienteOeM,
                      })
                    }
                    className={`${
                      filters.clienteOeM ? "bg-[#15599a]" : "bg-blue-300"
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    CLIENTES O&M
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        appPendente: !filters.appPendente,
                      })
                    }
                    className={`${
                      filters.appPendente ? "bg-[#15599a]" : "bg-blue-300"
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    APP PENDENTE
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        ordenarAlfabeticamente: !filters.ordenarAlfabeticamente,
                      })
                    }
                    className={`${
                      filters.ordenarAlfabeticamente
                        ? "bg-[#15599a]"
                        : "bg-blue-300"
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    ORDENAR ALFABETICAMENTE
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        manutencaoPendente: !filters.manutencaoPendente,
                      })
                    }
                    className={`${
                      filters.manutencaoPendente
                        ? "bg-[#15599a]"
                        : "bg-blue-300"
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    MANUTENÇÃO PENDENTE
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        manutencaoAtrasada: !filters.manutencaoAtrasada,
                      })
                    }
                    className={`${
                      filters.manutencaoAtrasada
                        ? "bg-[#15599a]"
                        : "bg-blue-300"
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    MANUTENÇÃO ATRASADA
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        limparAteDezembro: !filters.limparAteDezembro,
                      })
                    }
                    className={`${
                      filters.limparAteDezembro ? "bg-[#15599a]" : "bg-blue-300"
                    } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                  >
                    LIMPAR ATÉ DEZEMBRO
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-2">
                  <button
                    onClick={filterProjects}
                    className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] h-[36px] font-bold rounded px-2 items-center gap-x-2"
                  >
                    <p>Filtrar</p>
                    <AiOutlineSearch />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
          {filteredProjects ? (
            filteredProjects.map((project) => (
              <div
                onClick={() => {
                  handleOpenModal(project._id);
                }}
                key={project._id}
                className="w-full md:w-[350px] lg:w-[450px] cursor-pointer border border-gray-200  hover:bg-blue-100"
              >
                <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
                <div className="flex flex-col p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.tipoDeServico == "OPERAÇÃO E MANUTENÇÃO" && (
                        <GiPoliceBadge
                          style={{
                            fontSize: "20px",
                            color: "#15599a",
                          }}
                        />
                      )}{" "}
                      <p className="text-xs text-gray-700">
                        {project.nomeDoContrato}
                      </p>
                    </div>

                    <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xxs">CIDADE</span>
                      <p className="text-xs text-gray-600 uppercase">
                        {project.cidade ? project.cidade : "-"}
                      </p>
                    </div>
                    {checkOeMEnding(
                      project.medidor.data,
                      project.tipoDeServico,
                      project.contrato.dataAssinatura
                    ).text && (
                      <span
                        className={`text-xs ${
                          checkOeMEnding(
                            project.medidor.data,
                            project.tipoDeServico,
                            project.contrato.dataAssinatura
                          ).color
                        } text-center font-bold`}
                      >
                        {
                          checkOeMEnding(
                            project.medidor.data,
                            project.tipoDeServico,
                            project.contrato.dataAssinatura
                          ).text
                        }
                      </span>
                    )}
                    <div>
                      <span className="text-xxs">TOPOLOGIA</span>
                      <p className="text-xs text-center text-gray-600">
                        {project.projeto.topologia
                          ? project.projeto.topologia
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xxs">EQUIPE OBRAS</span>
                      <p className="text-xs text-yellow-500">
                        {project.obra.equipeResp
                          ? project.obra.equipeResp
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xxs">USINA LIGADA</span>
                      <p
                        className={`text-xs ${
                          statusStyles[project.conferencias.usinaLigada.status]
                            .textColor
                        }`}
                      >
                        {project.conferencias.usinaLigada != undefined &&
                        project.conferencias.usinaLigada.status != "-"
                          ? project.conferencias.usinaLigada.status
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xxs text-center">PLANO O&M</span>
                      <p className="text-xs text-yellow-500 text-center">
                        {project.oem?.plano ? project.oem.plano : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <LoadingPage />
          )}
        </div>
        <Link href={"/oem/propostas"}>
          <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">Propostas</p>
          </a>
        </Link>
        <Link href={"/oem/baixaPerformance"}>
          <a className="fixed ml-36 bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">
              ACOMPANHAMENTO DE PERFORMANCE
            </p>
          </a>
        </Link>
        {modalIsOpen && (
          <ModalOeM
            users={users}
            setModalIsOpen={setModalIsOpen}
            modalIsOpen={modalIsOpen}
            project={modalProject}
            editor={
              session?.user?.accessibleRoutes.includes("O&M") ? true : false
            }
            credentials={session?.user}
            handleUpdates={handleUpdates}
          />
        )}
      </div>
    );
  }
}

export default OeM;
