import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SleepVolts from "../../utils/sleepVolts-svg.svg";
import LoadingPage from "../../components/utils/LoadingPage";
import { FaUserAlt } from "react-icons/fa";
import {
  BsCalendarCheckFill,
  BsCalendarFill,
  BsFillCartFill,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { AiOutlineCalendar, AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import dayjs from "dayjs";
import PurchaseSolicitationModal from "../../components/ModalSolicitacaoCompra";
import Image from "next/image";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import Select from "react-select";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { formatLongString } from "../../utils/constants";

function getBGColor(status) {
  if (status == true) return "bg-green-100";
  if (status == false) return "bg-red-100";
  return "";
}
function getStatusColor(status) {
  if (status == "EM ABERTO" || status == null)
    return "text-yellow-600 border border-yellow-600";
  if (status == "FINALIZADO") return "text-green-600 border border-green-600";
  return "text-[#15599a] border border-[#15599a]";
}

function SolicitacoesCompra() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [solicitations, setSolicitations] = useState();
  const [filteredSolicitations, setFilteredSolicitations] = useState();

  const [filters, setFilters] = useState({
    search: "",
    status: [],
    responsavel: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  });

  const [modal, setModal] = useState({
    info: null,
    isOpen: false,
  });

  function handleOpenModal(solicitation) {
    setModal({ info: solicitation, isOpen: true });
  }
  async function getSolicitations() {
    const { data } = await axios.get("/api/solicitacoes/compra");
    setSolicitations(data);
    setFilteredSolicitations(data);
  }
  function handleSearchFilter(value) {
    setFilters((prev) => ({ ...prev, search: value }));
    if (value.trim().length > 0) {
      let newArr = solicitations.filter((item) =>
        item.requisitante.nome.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredSolicitations(newArr);
      return;
    } else {
      setFilteredSolicitations(solicitations);
      return;
    }
  }
  function handleFilters() {
    var newArr;
    if (dateFilter.after && dateFilter.before && dateFilter.field != null) {
      if (!newArr) newArr = solicitations;
      newArr = newArr.filter(
        (item) =>
          item[dateFilter.field] >= dateFilter.after &&
          item[dateFilter.field] <= dateFilter.before
      );
    }
    if (filters.status.length > 0) {
      if (!newArr) newArr = solicitations;
      newArr = newArr.filter((item) => filters.status.includes(item.status));
    }
    if (filters.responsavel.length > 0) {
      if (!newArr) newArr = solicitations;
      newArr = newArr.filter((item) =>
        filters.responsavel.includes(item.responsavel)
      );
    }
    if (!newArr) {
      setFilteredSolicitations(solicitations);
      return solicitations;
    } else {
      setFilteredSolicitations(newArr);
      return newArr;
    }
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("Suprimentos") ||
      session?.user.accessibleRoutes.includes("ADM")
    ) {
      if (!solicitations) getSolicitations();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow flex flex-col">
        <div className="flex flex-col justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2 font-['Roboto']">
              <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
                SOLICITAÇÕES DE COMPRA
              </p>
              <p className="font-bold text-[#fead61]">
                ({filteredSolicitations?.length})
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
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                  <input
                    className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                    placeholder="DIGITE O NOME DO SOLICITANTE"
                    value={filters.search}
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
                          onChange={(e) => {
                            setDateFilter({
                              ...dateFilter,
                              after: isNaN(e.target.value)
                                ? new Date(e.target.value).toISOString()
                                : null,
                            });
                          }}
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
                                ? new Date(
                                    dayjs(e.target.value)
                                      .add(20, "hours")
                                      .toISOString()
                                  ).toISOString()
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
                            label: "DATA DE SOLICITAÇÃO",
                            value: "dataSolicitacao",
                          },
                          {
                            label: "DATA DE RESPOSTA",
                            value: "dataResposta",
                          },
                          { label: "NÃO DEFINIDO", value: null },
                        ]}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            field: e.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti={true}
                      placeholder={"STATUS"}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
                      options={[
                        { label: "EM ABERTO", value: "EM ABERTO" },
                        { label: "EM ANDAMENTO", value: "EM ANDAMENTO" },
                        {
                          label: "AGUARDANDO APROVAÇÃO",
                          value: "AGUARDANDO APROVAÇÃO",
                        },
                        {
                          label: "COMPRA REALIZADA",
                          value: "COMPRA REALIZADA",
                        },
                        { label: "EM ROTA", value: "EM ROTA" },
                        { label: "FINALIZADO", value: "FINALIZADO" },
                      ]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: e.map((x) => x.value),
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <Select
                      isMulti={true}
                      placeholder={"RESPONSÁVEL"}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          minHeight: "41px",
                        }),
                      }}
                      options={[
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        { label: "LUIZ PAULO", value: "LUIZ PAULO" },
                        { label: "PÉRSIA PINHEIRO", value: "PÉRSIA PINHEIRO" },
                        {
                          label: "DANILO DE LIMA",
                          value: "DANILO DE LIMA",
                        },
                        { label: "NATASHA CANDIDO", value: "NATASHA CANDIDO" },
                        {
                          label: "POLLIANA CRISTINA",
                          value: "POLLIANA CRISTINA",
                        },
                        { label: "DIOGO PAULINO", value: "DIOGO PAULINO" },
                      ]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          responsavel: e.map((x) => x.value),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end items-center">
                  <FilterButton
                    text={"FILTRAR"}
                    icon={<AiOutlineSearch />}
                    handleClick={() => handleFilters()}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {solicitations ? (
          <div className="flex justify-around mt-4 flex-wrap gap-4">
            {filteredSolicitations.length > 0 ? (
              filteredSolicitations.map((solicitation, index) => (
                <div
                  key={index}
                  onClick={() => handleOpenModal(solicitation)}
                  className={`flex flex-col ${getBGColor(
                    solicitation.aprovacao
                  )} hover:scale-[1.02] duration-300 ease-in-out cursor-pointer hover:bg-blue-50 gap-4 border border-gray-300 shadow-lg w-[450px] p-3 rounded-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaUserAlt style={{ color: "#003d5b" }} />
                      <h1 className="text-gray-700 font-medium">
                        {solicitation.requisitante.nome}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsFillTelephoneFill style={{ color: "#16B010" }} />
                      <h1 className="text-gray-700 font-medium">
                        {solicitation.requisitante.telefone}
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col  items-start">
                      <h1 className="text-start text-gray-500 text-xs font-medium">
                        STATUS
                      </h1>
                      <h1
                        className={`text-xs ${getStatusColor(
                          solicitation.status
                        )} font-medium p-1 rounded-md`}
                      >
                        {solicitation.status
                          ? solicitation.status
                          : "EM ABERTO"}
                      </h1>
                    </div>
                    <div className="flex flex-col  items-end">
                      <h1 className="text-end text-gray-500 text-xs font-medium">
                        RESPONSÁVEL
                      </h1>
                      <h1
                        className={`text-xs font-medium p-1 rounded-md text-end`}
                      >
                        {solicitation.responsavel
                          ? solicitation.responsavel
                          : "NÃO DEFINIDO"}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start">
                      <h1 className="text-start text-gray-500 text-xs font-medium">
                        SOLICITAÇÃO
                      </h1>
                      <div className="flex items-center gap-2">
                        <BsCalendarFill style={{ color: "#15599a" }} />
                        <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                          {solicitation.dataInsercao
                            ? dayjs(solicitation.dataInsercao).format(
                                "DD/MM/YY HH:mm"
                              )
                            : null}
                        </h1>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <h1 className="text-end text-gray-500 text-xs font-medium">
                        PRAZO/URGÊNCIA
                      </h1>
                      <div className="flex items-center justify-end gap-2">
                        <BsCalendarCheckFill
                          style={{ color: "rgb(249,115,22)" }}
                        />
                        <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                          {solicitation.urgencia}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-center gap-2">
                      <BsFillCartFill />
                      <h1 className="text-center text-gray-500 text-xs font-medium">
                        ITENS
                      </h1>
                    </div>
                    {solicitation.itens.map((item, index) => {
                      if (index <= 3)
                        return (
                          <div
                            key={index}
                            className="w-full flex justify-between items-center"
                          >
                            <p className="text-gray-700 text-sm font-light">
                              {formatLongString(item.descricao)}
                            </p>
                            <p className="text-gray-700 text-sm font-light">
                              x{item.qtde}
                            </p>
                          </div>
                        );
                    })}
                    {solicitation.itens.length > 4 ? (
                      <p className="text-gray-700 text-sm w-full text-center font-light">
                        Clique para ver demais itens
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="flex items-center w-[50px] h-[50px] ml-2 hover:scale-105 duration-500 ease-in-out">
                  <Image src={SleepVolts} />
                </div>
                <p className="text-lg italic text-gray-400">
                  Sem solicitações de compra...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grow flex items-center justify-center">
            <LoadingPage />
          </div>
        )}
        {modal.isOpen && modal.info ? (
          <PurchaseSolicitationModal
            info={modal.info}
            isOpen={modal.isOpen}
            closeModal={() => setModal({ info: null, isOpen: false })}
            getSolicitations={getSolicitations}
          />
        ) : null}
      </div>
    );
  }
}

export default SolicitacoesCompra;
