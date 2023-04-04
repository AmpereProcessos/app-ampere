import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import PosVendaCard from "../../components/PosVendaCard";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { GoCreditCard } from "react-icons/go";
import { TbArrowsDownUp } from "react-icons/tb";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
import { AnimatePresence, motion } from "framer-motion";
import FilterButton from "../../components/utils/Buttons/FilterButton";
function Posvenda() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [stats, setStats] = useState({
    assinatura: {
      confeccionar: 0,
      paraAssinar: 0,
    },
  });
  const [projects, setProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState();
  const [filters, setFilters] = useState({
    noContactFilter: false,
    cidadeFilter: [],
    vendedorFilter: [],
    contratoFilter: [],
    assinFaltando: false,
    entregaTecnicaPendente: false,
    numModulos: null,
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [cardMode, setCardMode] = useState(true);
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays;
  }
  function getProjects() {
    axios.get("/api/projects/posvenda").then((res) => {
      setStats({
        assinatura: res.data.assinatura,
      });
      setProjects(res.data.projetos);
      setFilteredProjects(res.data.projetos);
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
  function filterByNoRecentContact(state) {
    setFilters({ ...filters, noContactFilter: state });
    if (state == true) {
      let newArr = projects.filter(
        (project) =>
          project.jornada?.dataUltimoContato == undefined ||
          getDateDiff(new Date(), new Date(project.jornada.dataUltimoContato)) >
            7
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
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (filters.contratoFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.contratoFilter.includes(call.contrato.status)
      );
    }
    if (filters.numModulos > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) => Number(call.sistema.qtdeModulos) == Number(filters.numModulos)
      );
    }
    if (filters.assinFaltando) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          (project.projeto.dataAssDocumentacao == undefined ||
            project.projeto.dataAssDocumentacao == null ||
            project.projeto.dataAssDocumentacao == "-") &&
          (project.compra.statusLiberacao == "PAGO" ||
            project.projeto.iniciar == "SIM") &&
          project.projeto.projetoConcluido != "SIM"
      );
    }
    if (filters.entregaTecnicaPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => call.jornada.entregaTecnica != true);
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      console.log(newArr);
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
      console.log(newArr);
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects(newArr);
      return newArr;
    }
  }
  function ordenate() {
    let arr = filteredProjects.filter(
      (project) =>
        project.jornada?.dataUltimoContato != null ||
        project.jornada?.dataUltimoContato != undefined
    );
    let nulls = filteredProjects.filter(
      (project) =>
        project.jornada?.dataUltimoContato == null ||
        project.jornada?.dataUltimoContato == undefined
    );
    arr = arr.sort(
      (a, b) =>
        new Date(a.jornada?.dataUltimoContato).getTime() -
        new Date(b.jornada?.dataUltimoContato).getTime()
    );
    setFilteredProjects([...arr, ...nulls]);
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("Pós-Venda") ||
      session?.user.accessibleRoutes.includes("Marketing")
    ) {
      if (!projects) getProjects();
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
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 gap-2 w-full mb-2">
            <div className="p-4 flex flex-col items-center bg-[#fff] w-full border border-gray-200 shadow-lg">
              <p className="text-[#15599a] font-bold">
                DOCUMENTAÇÕES A CONFECCIONAR:
              </p>
              <p className="text-gray-500">{stats.assinatura.confeccionar}</p>
            </div>
            <div className="p-4 flex flex-col items-center bg-[#fff] w-full border border-gray-200 shadow-lg">
              <p className="text-[#15599a] font-bold">
                DOCUMENTAÇÕES PARA ASSINAR:
              </p>
              <p className="text-gray-500">{stats.assinatura.paraAssinar}</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
                PROJETOS EM JORNADA
              </p>
              {filteredProjects && (
                <p className="text-[#fead61] text-xl font-bold">
                  ({filteredProjects.length})
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
                  <button
                    onClick={() => setCardMode(!cardMode)}
                    className="font-bold flex items-center gap-2 justify-center w-full lg:w-[250px] bg-[#15599a] h-[46px] text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
                  >
                    {cardMode ? (
                      <GoCreditCard />
                    ) : (
                      <MdOutlineFormatListBulleted />
                    )}
                    {cardMode ? "MODO CARD" : "MODO LISTA"}
                  </button>
                  <button
                    onClick={() =>
                      filterByNoRecentContact(!filters.noContactFilter)
                    }
                    className="font-bold flex items-center gap-2 justify-center w-full lg:w-[250px] bg-[#15599a] h-[46px] text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
                  >
                    <BiTime />
                    SEM CONTATO RECENTE
                  </button>
                  <button
                    onClick={ordenate}
                    className="font-bold flex items-center gap-2 justify-center w-full lg:w-[250px] bg-[#15599a] h-[46px] text-white hover:bg-[#fead61] hover:text-black rounded"
                  >
                    <TbArrowsDownUp />
                    ORDERNAR
                  </button>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <input
                    className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                    placeholder="DIGITE O NOME DO CONTRATO"
                    value={searchFilter}
                    onChange={(e) => handleSearchFilter(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="NºModulos"
                    className="outline-none p-1.5 w-full lg:w-[150px] rounded border border-gray-200 placeholder:italic"
                    value={filters.numModulos}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        numModulos: Number(e.target.value),
                      })
                    }
                  />
                  <div className="flex gap-x-2 w-full lg:w-fit">
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
                          { label: "TROCA DO MEDIDOR", value: "medidor.data" },
                          {
                            label: "DATA ASS.CONTRATO",
                            value: "contrato.dataAssinatura",
                          },
                          {
                            label: "DATA LIB.DOCUMENTAÇÃO",
                            value: "projeto.dataLiberacaoDocumentacao",
                          },
                          {
                            label: "PREVISÃO DE ENTREGA",
                            value: "compra.previsaoEntrega",
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
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        entregaTecnicaPendente: !filters.entregaTecnicaPendente,
                      })
                    }
                    className={`${
                      filters.entregaTecnicaPendente
                        ? "bg-blue-400 text-white"
                        : "text-blue-400"
                    } rounded h-[41px] border border-blue-400 flex justify-center cursor-pointer items-center font-bold px-2`}
                  >
                    ENTREGA TÉCNICA PENDENTE
                  </div>
                  <div
                    onClick={() =>
                      setFilters({
                        ...filters,
                        assinFaltando: !filters.assinFaltando,
                      })
                    }
                    className={`${
                      filters.assinFaltando
                        ? "bg-blue-400 text-white"
                        : "text-blue-400"
                    } rounded h-[41px] border border-blue-400 flex justify-center cursor-pointer items-center font-bold px-2`}
                  >
                    ASSINATURA PENDENTE
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
        <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
          {filteredProjects ? (
            filteredProjects.map((project, index) => (
              <PosVendaCard
                getUpdates={getProjects}
                editor={
                  session?.user?.accessibleRoutes.includes("Pós-Venda") &&
                  session?.user?.visualizacao == undefined
                    ? true
                    : false
                }
                key={project._id}
                project={project}
                cardMode={cardMode}
              />
            ))
          ) : (
            <LoadingPage />
          )}
        </div>
      </div>
    );
  }
}

export default Posvenda;
