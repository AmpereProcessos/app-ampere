import axios from "axios";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Select from "react-select";
import { AiOutlineReload, AiOutlineSearch } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import {
  formatDate,
  projetistas,
  projetosSolicitations,
} from "../../utils/constants";
import ModalCallProjetos from "../../components/ModalCallProjetos";
import FetchDataButton from "../../components/utils/Buttons/FetchDataButton";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
var dateFilterParam = new Date();
dateFilterParam.setHours(0, 0, 0, 0);
dateFilterParam.setMonth(dateFilterParam.getMonth() - 2);
const statusStyles = {
  "AGUARDANDO CONCESSIONÁRIA": {
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  "EM ANDAMENTO": {
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
  },
  FINALIZADO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
function ChamadosProjetos() {
  // Utils
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [openCallsDropdownMenuVisible, setOpenCallsDropdownMenuVisible] =
    useState(false);
  const [closedCallsDropdownMenuVisible, setClosedCallsDropdownMenuVisible] =
    useState(false);

  const [stats, setStats] = useState({
    assinatura: {
      confeccionar: 0,
      paraAssinar: 0,
    },
    parecer: {
      solicitar: 0,
      aguardando: 0,
    },
    comissionamento: {
      total: 0,
      parcial: 0,
    },
    distribuicoes: 0,
    vistoria: {
      pendente: 0,
      aguardando: 0,
    },
  });
  // Data holders/states
  const [openCalls, setOpenCalls] = useState();
  const [filteredOpenCalls, setFilteredOpenCalls] = useState();
  const [closedCalls, setClosedCalls] = useState();
  const [filteredClosedCalls, setFilteredClosedCalls] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCall, setModalCall] = useState({});
  // Filters
  const [closedFilterDate, setClosedFilterDate] = useState({
    after: dateFilterParam,
    before: new Date(),
  });
  const [openCallsFilters, setOpenCallsFilters] = useState({
    resp: [],
    callStatus: [],
    solicitationType: [],
    search: "",
  });
  const [closedCallsFilters, setClosedCallsFilters] = useState({
    search: "",
    solicitationType: [],
    resp: [],
  });
  // Functions
  function getCalls() {
    axios
      .get(
        `/api/calls/projetos/mainData?closedAfter=${closedFilterDate.after}&closedBefore=${closedFilterDate.before}`
      )
      .then((res) => {
        console.log(res.data);
        setStats({
          assinatura: res.data.assinatura,
          parecer: res.data.parecer,
          comissionamento: res.data.comissionamento,
          distribuicoes: res.data.openCalls.filter(
            (x) => x.tipoDoChamado == "DISTRIBUIÇÃO DE CRÉDITO"
          ).length,
          vistoria: res.data.vistoria,
        });
        setOpenCalls(res.data.openCalls);
        setFilteredOpenCalls(res.data.openCalls);
        setClosedCalls(res.data.closedCalls);
        setFilteredClosedCalls(res.data.closedCalls);
      });
  }
  function handleOpenModal(id) {
    axios.get(`/api/calls/getProjetos/${id}`).then((res) => {
      setModalCall(res.data);
      setModalIsOpen(true);
    });
  }
  function filterOpenCalls() {
    var newArr;
    if (openCallsFilters.resp.length > 0) {
      if (!newArr) newArr = openCalls;
      newArr = newArr.filter((call) =>
        openCallsFilters.resp.includes(call.responsavel)
      );
    }
    if (openCallsFilters.callStatus.length > 0) {
      if (!newArr) newArr = openCalls;
      newArr = newArr.filter((call) =>
        openCallsFilters.callStatus.includes(call.status)
      );
    }
    if (openCallsFilters.solicitationType.length > 0) {
      if (!newArr) newArr = openCalls;
      newArr = newArr.filter((call) =>
        openCallsFilters.solicitationType.includes(call.tipoDoChamado)
      );
    }
    if (!newArr) {
      setFilteredOpenCalls(openCalls);
      return openCalls;
    } else {
      setFilteredOpenCalls(newArr);
      return newArr;
    }
  }
  function filterClosedCalls() {
    var newArr;
    if (closedCallsFilters.resp.length > 0) {
      if (!newArr) newArr = closedCalls;
      newArr = newArr.filter((call) =>
        closedCallsFilters.resp.includes(call.responsavel)
      );
    }
    if (closedCallsFilters.solicitationType.length > 0) {
      if (!newArr) newArr = closedCalls;
      newArr = newArr.filter((call) =>
        closedCallsFilters.solicitationType.includes(call.tipoDoChamado)
      );
    }
    if (!newArr) {
      setFilteredClosedCalls(closedCalls);
      return closedCalls;
    } else {
      setFilteredClosedCalls(newArr);
      return newArr;
    }
  }
  function handleSearchInOpenCalls(value) {
    setOpenCallsFilters({ ...openCallsFilters, search: value });
    let filtered = filterOpenCalls();
    if (value.trim().length > 1) {
      let newArr = [...filtered].filter((call) =>
        call.projeto
          .toUpperCase()
          .includes(openCallsFilters.search.toUpperCase())
      );
      setFilteredOpenCalls(newArr);
    } else {
      setFilteredOpenCalls([...filtered]);
    }
  }
  function handleSearchInClosedCalls(value) {
    setClosedCallsFilters({ ...closedCallsFilters, search: value });
    let filtered = filterClosedCalls();
    if (value.trim().length > 1) {
      let newArr = [...filtered].filter((call) =>
        call.projeto
          .toUpperCase()
          .includes(closedCallsFilters.search.toUpperCase())
      );
      setFilteredClosedCalls(newArr);
    } else {
      setFilteredClosedCalls([...filtered]);
    }
  }
  function getClosedCallsByDate() {
    axios
      .post("/api/calls/projetos/filteredByDate", {
        date: {
          after: closedFilterDate.after,
          before: closedFilterDate.before,
        },
      })
      .then((res) => {
        setFilteredClosedCalls(res.data);
        setClosedCalls(res.data);
      });
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("Projetos")) {
      if (!openCalls) {
        getCalls();
      }
    } else {
      if (session?.user) {
        {
          router.push("/");
        }
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="flex flex-col gap-y-2 grow p-6">
        <div className="flex items-center justify-between w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
          <p className="font-bold uppercase text-center text-2xl text-[#15599a] font-['Roboto']">
            CHAMADOS DE PROJETOS
          </p>
          <FetchDataButton
            text={"ATUALIZAR"}
            icon={<AiOutlineReload />}
            handleClick={getCalls}
          />
        </div>
        <div className="grid grid-rows-5 grid-cols-1  lg:grid-cols-5 lg:grid-rows-1 gap-3">
          <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">ASSINATURAS</h1>
            </div>
            <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
              CONFECCIONAR: {stats.assinatura && stats.assinatura.confeccionar}
            </p>
            <p className="text-center text-gray-600">
              PARA ASSINAR:{" "}
              <strong className="text-red-500">
                {stats.assinatura && stats.assinatura.paraAssinar}
              </strong>
            </p>
          </div>
          <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">PARECER</h1>
            </div>
            <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
              SOLICITAR: {stats.parecer && stats.parecer.solicitar}
            </p>
            <p className="text-center text-gray-600">
              AGUARDANDO CONC.:{" "}
              <strong className="text-red-500">
                {stats.parecer && stats.parecer.aguardando}
              </strong>
            </p>
          </div>
          <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">COMISSIONAMENTO</h1>
            </div>
            <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
              PROJETOS: {stats.comissionamento && stats.comissionamento.parcial}
            </p>
            <p className="text-center text-gray-600">
              TOTAL:{" "}
              <strong className="text-red-500">
                {stats.comissionamento && stats.comissionamento.total}
              </strong>
            </p>
          </div>
          <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">CHAMADOS</h1>
            </div>
            <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
              DISTRIBUIÇÕES: {stats.distribuicoes && stats.distribuicoes}
            </p>
            <p className="text-center text-gray-600">
              TOTAL:{" "}
              <strong className="text-red-500">
                {openCalls && openCalls.length}
              </strong>
            </p>
          </div>
          <div className="flex flex-col p-4 h-[150px] border border-gray-200 bg-[#fff] shadow-xl">
            <div className="flex justify-between">
              <h1 className="uppercase text-gray-600">VISTORIAS</h1>
            </div>
            <p className="grow text-center text-xl font-bold text-[#fead61] flex items-center justify-center">
              SOLICITAR: {stats.vistoria.pendente && stats.vistoria.pendente}
            </p>
            <p className="text-center text-gray-600">
              AGUARDANDO CONCESSIONÁRIA:{" "}
              <strong className="text-red-500">
                {stats.vistoria.aguardando && stats.vistoria.aguardando}
              </strong>
            </p>
          </div>
        </div>
        {/* Abertos */}
        <div className="flex flex-col w-full border h-[1200px] lg:h-[720px] border-gray-200 bg-[#fff] shadow-xl p-4">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
                <p className="text-center uppercase text-[#15599a] font-bold text-xl">
                  Chamados abertos
                </p>
                <p className="font-bold text-[#fead61]">
                  ({filteredOpenCalls?.length})
                </p>
              </div>
              {openCallsDropdownMenuVisible ? (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropupCircle
                    style={{ fontSize: "25px" }}
                    onClick={() => setOpenCallsDropdownMenuVisible(false)}
                  />
                </div>
              ) : (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropdownCircle
                    style={{ fontSize: "25px" }}
                    onClick={() => setOpenCallsDropdownMenuVisible(true)}
                  />
                </div>
              )}
            </div>
            <AnimatePresence>
              {openCallsDropdownMenuVisible ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col w-full gap-y-2 mt-4"
                >
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={openCallsFilters.search}
                      onChange={(e) => handleSearchInOpenCalls(e.target.value)}
                      className="outline-none p-1.5  w-full lg:w-[350px] h-[41px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO PROJETO"
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="RESPONSÁVEL"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        onChange={(e) =>
                          setOpenCallsFilters({
                            ...openCallsFilters,
                            resp: e.map((x) => x.value),
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
                        placeholder="STATUS DO CHAMADO"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        onChange={(e) =>
                          setOpenCallsFilters({
                            ...openCallsFilters,
                            callStatus: e.map((x) => x.value),
                          })
                        }
                        options={[
                          {
                            value: "AGUARDANDO CONCESSIONÁRIA",
                            label: "AGUARDANDO CONCESSIONÁRIA",
                          },
                          {
                            value: "EM ANDAMENTO",
                            label: "EM ANDAMENTO",
                          },
                          {
                            value: undefined,
                            label: "NÃO DEFINIDO",
                          },
                        ]}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="TIPO DO CHAMADO"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        onChange={(e) =>
                          setOpenCallsFilters({
                            ...openCallsFilters,
                            solicitationType: e.map((x) => x.value),
                          })
                        }
                        options={projetosSolicitations.map((solicitacao) => {
                          return {
                            label: solicitacao,
                            value: solicitacao,
                          };
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                    <FilterButton
                      text={"FILTRAR"}
                      icon={<AiOutlineSearch />}
                      handleClick={filterOpenCalls}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2 flex-wrap gap-2 justify-around">
            {filteredOpenCalls ? (
              filteredOpenCalls.map((call) => (
                <div
                  onClick={() => handleOpenModal(call._id)}
                  key={call._id}
                  className="w-full lg:w-[420px] min-h-[120px] max-h-[150px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
                >
                  <div className="grid grid-cols-5 justify-between items-center w-full">
                    <h1 className="col-span-3 uppercase text-sm font-semibold">
                      {call.projeto && call.projeto}
                    </h1>
                    {call.status && (
                      <p
                        className={`col-span-2 text-xs text-center font-bold border p-1 rounded-lg ${
                          call.status ? statusStyles[call.status].textColor : ""
                        } ${
                          call.status
                            ? statusStyles[call.status].borderColor
                            : ""
                        }`}
                      >
                        {call.status}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between mt-2 items-center w-full">
                    <p className="text-xs text-gray-500 uppercase">
                      Responsável:
                    </p>
                    <p className="text-xs text-gray-500">{call.responsavel}</p>
                  </div>
                  <div className="flex justify-between mt-2 items-center w-full">
                    <p className="text-xs text-gray-500 uppercase">
                      Tipo de chamado:
                    </p>
                    <p className="text-xs text-gray-500">
                      {call.tipoDoChamado}
                    </p>
                  </div>
                </div>
              ))
            ) : (
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
            )}
          </div>
        </div>
        {/* Fechados */}
        <div className="flex flex-col w-full border h-[1200px] lg:h-[500px] border-gray-200 bg-[#fff] shadow-xl p-4">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
                <p className="text-center text-[#15599a] font-bold text-xl">
                  CHAMADOS FINALIZADOS
                </p>
                <p className="font-bold text-[#fead61]">
                  ({filteredClosedCalls?.length})
                </p>
              </div>
              {closedCallsDropdownMenuVisible ? (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropupCircle
                    style={{ fontSize: "25px" }}
                    onClick={() => setClosedCallsDropdownMenuVisible(false)}
                  />
                </div>
              ) : (
                <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
                  <IoMdArrowDropdownCircle
                    style={{ fontSize: "25px" }}
                    onClick={() => setClosedCallsDropdownMenuVisible(true)}
                  />
                </div>
              )}
            </div>
            <AnimatePresence>
              {closedCallsDropdownMenuVisible ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col w-full gap-y-2 mt-4"
                >
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <p>Entre:</p>
                    <input
                      value={formatDate(closedFilterDate.after)}
                      onChange={(e) =>
                        setClosedFilterDate({
                          ...closedFilterDate,
                          after: e.target.value,
                        })
                      }
                      type="date"
                      className="border border-gray-200 outline-none p-2"
                    />
                    <p>&</p>
                    <input
                      value={formatDate(closedFilterDate.before)}
                      onChange={(e) =>
                        setClosedFilterDate({
                          ...closedFilterDate,
                          before: e.target.value,
                        })
                      }
                      type="date"
                      className="border border-gray-200 outline-none p-2"
                    />
                    <FetchDataButton
                      text={"BUSCAR"}
                      icon={<MdDateRange />}
                      handleClick={getClosedCallsByDate}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                    <input
                      value={closedCallsFilters.search}
                      onChange={(e) =>
                        handleSearchInClosedCalls(e.target.value)
                      }
                      className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO PROJETO"
                    />
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="TIPO DE CHAMADO"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        onChange={(e) =>
                          setClosedCallsFilters({
                            ...closedCallsFilters,
                            solicitationType: e.map((x) => x.value),
                          })
                        }
                        options={projetosSolicitations.map((solicitacao) => {
                          return {
                            label: solicitacao,
                            value: solicitacao,
                          };
                        })}
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <Select
                        isMulti
                        placeholder="RESPONSÁVEL"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            minHeight: "41px",
                          }),
                        }}
                        onChange={(e) =>
                          setClosedCallsFilters({
                            ...closedCallsFilters,
                            resp: e.map((x) => x.value),
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
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                    <FilterButton
                      text={"FILTRAR"}
                      icon={<AiOutlineSearch />}
                      handleClick={filterClosedCalls}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2 flex-wrap gap-2 justify-around">
            {filteredClosedCalls ? (
              filteredClosedCalls.map((call) => (
                <div
                  onClick={() => handleOpenModal(call._id)}
                  key={call._id}
                  className="flex flex-col min-h-[120px] max-h-[150px] w-full lg:w-[420px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
                >
                  <div className="grid grid-cols-3 gap-x-2 items-center w-full">
                    <h1 className="uppercase text-sm col-span-2 font-semibold">
                      {call.projeto && call.projeto}
                    </h1>
                    <p
                      className={`text-xs font-bold border p-1 col-span-1 rounded-lg ${
                        statusStyles[call.status].textColor
                      } ${statusStyles[call.status].borderColor}`}
                    >
                      {call.status}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 mt-2 items-center w-full">
                    <p className="text-xs text-gray-500 uppercase">
                      Responsável:
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      {call.responsavel}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 mt-2 items-center w-full">
                    <p className="text-xs text-gray-500 uppercase">
                      Tipo de chamado:
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      {call.tipoDoChamado}
                    </p>
                  </div>
                </div>
              ))
            ) : (
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
            )}
          </div>
        </div>
        <Link href="/publico/chamadosProjetos">
          <div className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">Novo chamado</p>
          </div>
        </Link>
        {modalIsOpen && (
          <ModalCallProjetos
            modalIsOpen={modalIsOpen}
            credentials={session?.user}
            setModalIsOpen={setModalIsOpen}
            info={modalCall}
            getCalls={getCalls}
          />
        )}
      </div>
    );
  }
}

export default ChamadosProjetos;
