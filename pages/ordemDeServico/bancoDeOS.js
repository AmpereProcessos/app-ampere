import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import OSBlock from "../../components/OSBlock";
import LoadingPage from "../../components/utils/LoadingPage";
import { AnimatePresence, motion } from "framer-motion";
import FetchDataButton from "../../components/utils/Buttons/FetchDataButton";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import dayjs from "dayjs";

var dateFilterParam = new Date();
dateFilterParam.setMonth(dateFilterParam.getMonth() - 3);
function BancoDeOS() {
  // Utils
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  // Projects array holder
  const [oss, setOSs] = useState([]);
  const [filteredOss, setFilteredOss] = useState([]);
  //Filters
  const [filters, setFilters] = useState({
    nomeDoContratoFilter: "",
    emAberto: false,
    categoria: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: new Date(dateFilterParam).toISOString(),
    before: new Date().toISOString(),
  });

  // Fetch data function
  function getOSS() {
    axios
      .get(
        `/api/ordensDeServico?after=${dateFilter.after}&before=${dateFilter.before}`
      )
      .then((res) => {
        setOSs(res.data);
        setFilteredOss(res.data);
      });
  }
  // Filtering function based user filters
  function filterOS() {
    var newArr;
    if (filters.nomeDoContratoFilter.trim().length > 0) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter((os) =>
        os.nomeDoContrato
          .toUpperCase()
          .includes(filters.nomeDoContratoFilter.toUpperCase())
      );
    }
    if (filters.categoria.length > 0) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter((os) =>
        os.ordensDeServico.some((ordem) =>
          filters.categoria.includes(ordem.categoria)
        )
      );
    }
    if (filters.emAberto) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter((item) =>
        item.ordensDeServico.some((os) => os.dataDeFechamento == undefined)
      );
    }
    if (!newArr) setFilteredOss(oss);
    else {
      setFilteredOss(newArr);
    }
  }
  useEffect(() => {
    if (session?.user.controller) {
      getOSS();
    } else {
      if (session?.user) return router.push();
    }
  }, [session]);

  console.log(filteredOss);

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
              <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
                BANDO DE ORDENS DE SERVIÇO
              </p>
              {filteredOss ? (
                <p className="font-bold text-[#fead61]">
                  ({filteredOss.length})
                </p>
              ) : null}
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
                <div className="flex flex-col lg:flex-row justify-between gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-['Roboto'] text-xs">
                      ADQUIRIDOS ENTRE:
                    </span>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                      <input
                        value={dayjs(dateFilter.after)
                          .add(4, "hours")
                          .format("YYYY-MM-DD")}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            after:
                              dayjs(e.target.value).$d != "Invalid Date"
                                ? new Date(e.target.value).toISOString()
                                : dateFilterParam,
                          })
                        }
                        type="date"
                        className="border border-gray-200 outline-none py-1 px-2"
                      />
                      <p>&</p>
                      <input
                        value={dayjs(dateFilter.before).format("YYYY-MM-DD")}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            before:
                              dayjs(e.target.value).$d != "Invalid Date"
                                ? dayjs(e.target.value)
                                    .add("20", "hour")
                                    .toISOString()
                                : new Date().toISOString(),
                          })
                        }
                        type="date"
                        className="border border-gray-200 outline-none py-1 px-2"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <FetchDataButton
                        text={"BUSCAR"}
                        icon={<MdDateRange />}
                        handleClick={getOSS}
                      />
                      {/* <div className="flex cursor-pointer text-[#15599a] items-center  font-bold p-2 rounded-lg transition duration-300 ease-in-out hover:scale-105">
                        <p className="mr-2 text-sm">BAIXAR DADOS</p>
                        <BsDownload />
                      </div> */}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full">
                    <div className="w-full lg:w-[350px]">
                      <Select
                        isMulti
                        placeholder="CATEGORIA"
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
                            categoria: e.map((x) => x.value),
                          })
                        }
                        options={[
                          { label: "PADRÃO", value: "PADRÃO" },
                          { label: "ESTRUTURA", value: "ESTRUTURA" },
                          { label: "MONTAGEM", value: "MONTAGEM" },
                          {
                            label: "MANUTENÇÃO PREVENTIVA",
                            value: "MANUTENÇÃO PREVENTIVA",
                          },
                          {
                            label: "MANUTENÇÃO CORRETIVA",
                            value: "MANUTENÇÃO CORRETIVA",
                          },
                          {
                            label: "NÃO DEFINIDO",
                            value: "NÃO DEFINIDO",
                          },
                        ]}
                      />
                    </div>
                    <div
                      onClick={() =>
                        setFilters({ ...filters, emAberto: !filters.emAberto })
                      }
                      className={`${
                        filters.emAberto ? "bg-[#15599a]" : "bg-blue-300"
                      } rounded h-[41px] w-full lg:w-[350px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
                    >
                      EM ABERTO
                    </div>
                    <input
                      className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                      placeholder="DIGITE O NOME DO CONTRATO"
                      value={filters.nomeDoContratoFilter}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          nomeDoContratoFilter: e.target.value,
                        })
                      }
                    />
                    <FilterButton
                      text={"FILTRAR"}
                      icon={<AiOutlineSearch />}
                      handleClick={filterOS}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {/* <div className="flex flex-col items-center justify-between">
          <h1 className="font-bold text-lg text-[#fead61]">
            BANCO DE ORDENS DE SERVIÇO ({filteredOss.length})
          </h1>
          <div className="flex flex-col items-center justify-around gap-x-2">
            <div className="flex gap-x-2 mb-2">
              <div className="flex flex-col w-fit items-center">
                <span className="font-bold font-raleway text-center text-sm">
                  ABERTURA DEPOIS DE:
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
                  ABERTURA ANTES DE:
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
              <button
                onClick={getOSS}
                className="p-1 rounded border border-[#15599a] text-[#15599a] font-bold hover:text-white hover:bg-[#15599a]"
              >
                BUSCAR
              </button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <Select
                isMulti
                placeholder="CATEGORIA"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    categoria: e.map((x) => x.value),
                  })
                }
                options={[
                  { label: "PADRÃO", value: "PADRÃO" },
                  { label: "ESTRUTURA", value: "ESTRUTURA" },
                  { label: "MONTAGEM", value: "MONTAGEM" },
                  {
                    label: "MANUTENÇÃO PREVENTIVA",
                    value: "MANUTENÇÃO PREVENTIVA",
                  },
                  {
                    label: "MANUTENÇÃO CORRETIVA",
                    value: "MANUTENÇÃO CORRETIVA",
                  },
                  {
                    label: "NÃO DEFINIDO",
                    value: "NÃO DEFINIDO",
                  },
                ]}
              />
              <div
                onClick={() =>
                  setFilters({ ...filters, emAberto: !filters.emAberto })
                }
                className={`${
                  filters.emAberto ? "bg-[#15599a]" : "bg-blue-300"
                } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
              >
                EM ABERTO
              </div>
              <input
                className="outline-none h-[36px] p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
                placeholder="Digite o nome do contrato"
                value={filters.nomeDoContratoFilter}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    nomeDoContratoFilter: e.target.value,
                  })
                }
              />
              <button
                onClick={filterOS}
                className="flex bg-[#fead61] w-fit h-[36px] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
              >
                <p>Filtrar</p>
                <AiOutlineSearch />
              </button>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col gap-y-4 mt-3">
          {filteredOss.map((project, i) => (
            <div
              key={i}
              className="flex flex-col p-2 border border-blue-300 rounded shadow-lg"
            >
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-5 border-b border-gray-200 pb-2">
                <h1 className="font-bold text-[#15599a] col-span-1 text-center">
                  {project.qtde} - {project.nomeDoContrato}
                </h1>
                <p className="font-raleway text-xs text-gray-500 col-span-1 text-center">
                  CIDADE: {project.cidade ? project.cidade : "-"}
                </p>
                <p className="hidden lg:block font-raleway text-xs text-gray-500 col-span-1 text-center">
                  LOGRADOURO: {project.logradouro ? project.logradouro : "-"}
                </p>
                <p className="hidden lg:block font-raleway text-xs text-gray-500 col-span-1 text-center">
                  BAIRRO: {project.bairro ? project.bairro : "-"}
                </p>
                <p className="hidden lg:block font-raleway text-xs text-gray-500 col-span-1 text-center">
                  Nº:{" "}
                  {project.numeroResidencia ? project.numeroResidencia : "-"}
                </p>
              </div>
              {project.ordensDeServico?.map((order, index) => (
                <OSBlock
                  key={index}
                  getOSS={getOSS}
                  clientName={project.nomeDoContrato}
                  order={order}
                  index={index}
                  open={filters.emAberto}
                  categories={filters.categoria}
                  projectID={project._id}
                />
              ))}
            </div>
            // <BancodeOSsCard
            //   key={project._id}
            //   project={project}
            //   categories={filters.categoria}
            //   open={filters.emAberto}
            // />
          ))}
        </div>
        <Link href={"/ordemDeServico/controleDeOS"}>
          <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">DESIGNAÇÃO DE OSS</p>
          </a>
        </Link>
      </div>
    );
  }
}

export default BancoDeOS;
