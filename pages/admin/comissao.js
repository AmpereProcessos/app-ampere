import axios from "axios";
import Select from "react-select";
import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { vendedores } from "../../utils/constants";
import ComissaoGeralView from "../../components/ComissaoGeralView";
import ComissaoPDFView from "../../components/ComissaoPDFView";
import ComissaoPDFViewInside from "../../components/ComissaoPDFViewInside";
import LoadingPage from "../../components/utils/LoadingPage";
import FetchDataButton from "../../components/utils/Buttons/FetchDataButton";
import { MdDateRange } from "react-icons/md";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import { BsDownload } from "react-icons/bs";
const currentDate = new Date();

function ComissaoPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [view, setView] = useState("GERAL");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    insider: [],
    vendedor: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, -3),
    before: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
  });

  function getProjects() {
    axios
      .get(
        `/api/projects/comissao?depois=${dateFilter.after}&antes=${dateFilter.before}`
      )
      .then((res) => {
        setFilteredProjects(res.data);
        setProjects(res.data);
      });
  }

  function filterProjects() {
    var newArr;
    if (filters.vendedor.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vendedor.includes(call.vendedor.nome)
      );
    }
    if (filters.insider.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) => filters.insider.includes(call.insider));
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects([...newArr]);
      return newArr;
    }
  }

  function exportData() {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredProjects)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  }
  // Functions used to get the total values
  function getTotalSold() {
    var sum = 0;
    for (let i = 0; i < filteredProjects.length; i++) {
      let projeto = !isNaN(filteredProjects[i].sistema?.valorProjeto)
        ? filteredProjects[i].sistema.valorProjeto
        : 0;
      let padrao = !isNaN(filteredProjects[i].padrao.valor)
        ? filteredProjects[i].padrao.valor
        : 0;
      sum = sum + padrao + projeto;
    }
    return sum;
  }
  function getTotalComission() {
    var sumProjeto = 0;
    var sumPadrao = 0;
    var sumInside = 0;
    for (let i = 0; i < filteredProjects.length; i++) {
      var comissao = filteredProjects[i].porcentagemComissao
        ? filteredProjects[i].porcentagemComissao
        : 0;
      var valueProjeto =
        !isNaN(filteredProjects[i].sistema.valorProjeto) &&
        filteredProjects[i].sistema.valorProjeto != null
          ? filteredProjects[i].sistema.valorProjeto
          : 0;
      var valuePadrao =
        !isNaN(filteredProjects[i].padrao.valor) &&
        filteredProjects[i].padrao.valor != null
          ? filteredProjects[i].padrao.valor
          : 0;

      if (
        filteredProjects[i].insider != null ||
        filteredProjects[i].insider != undefined
      ) {
        sumInside =
          sumInside +
          (filteredProjects[i].porcentagemComissaoInsider / 100) *
            (valueProjeto + valuePadrao);
      }
      sumProjeto = sumProjeto + (Number(valueProjeto) * comissao) / 100;
      sumPadrao = sumPadrao + (Number(valuePadrao) * comissao) / 100;
    }
    sumProjeto = sumProjeto != undefined ? sumProjeto : 0;
    sumPadrao = sumPadrao != undefined ? sumPadrao : 0;
    sumInside = sumInside != undefined ? sumInside : 0;

    return {
      ativoProjeto: sumProjeto.toFixed(2),
      ativoPadrao: sumPadrao.toFixed(2),
      inside: sumInside.toFixed(2),
      total: (sumProjeto + sumPadrao + sumInside).toFixed(2),
    };
  }
  function getTotalPeakPot() {
    var sum = 0;
    for (let i = 0; i < filteredProjects.length; i++) {
      sum = sum + filteredProjects[i].sistema.potPico;
    }
    return sum;
  }

  useEffect(() => {
    if (session?.user.manager || session?.user.visualizacao == "REGIONAL") {
      getProjects();
    } else {
      if (session?.user) router.push("/");
    }
  }, [session]);

  if (status == "loading") return <LoadingPage />;

  if (status == "authenticated") {
    if (session?.user?.manager || session?.user?.visualizacao == "REGIONAL")
      return (
        <div className="flex flex-col p-6 grow">
          <div className="flex flex-col items-center px-1 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between w-full">
              <h1 className="font-bold uppercase text-center text-2xl text-[#15599a]">
                COMISSÕES
              </h1>
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
                  <div className="grid grid-rows-3 grid-cols-1 lg:grid-rows-1 lg:grid-cols-3">
                    <div className="flex flex-col items-center lg:items-start w-full gap-1">
                      <span className="font-['Roboto'] text-xs">
                        KITS PAGOS ENTRE:
                      </span>
                      <div className="flex flex-col lg:flex-row items-center justify-center flex-wrap gap-2">
                        <input
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
                                ? e.target.value
                                : null,
                            })
                          }
                          type="date"
                          className="border border-gray-200 outline-none py-1 px-2"
                        />
                        <p>&</p>
                        <input
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
                                ? e.target.value
                                : null,
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
                          handleClick={getProjects}
                        />
                        <div
                          onClick={exportData}
                          className="flex cursor-pointer text-[#15599a] items-center  font-bold p-2 rounded-lg transition duration-300 ease-in-out hover:scale-105"
                        >
                          <p className="mr-2 text-sm">BAIXAR DADOS</p>
                          <BsDownload />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center w-full gap-1">
                      <button
                        onClick={() => setView("GERAL")}
                        className={`p-1 cursor-pointer w-[350px] rounded font-bold ${
                          view == "GERAL"
                            ? "bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black"
                            : "bg-[#fead61] hover:bg-[#15599a] hover:text-white"
                        }`}
                      >
                        VISÃO GERAL
                      </button>
                      <button
                        onClick={() => setView("PDF")}
                        className={`p-1 cursor-pointer w-[350px] rounded font-bold ${
                          view == "PDF"
                            ? "bg-[#0781F2] text-white hover:bg-blue-300 hover:text-black"
                            : "bg-blue-300 hover:bg-[#0781F2] hover:text-white"
                        }`}
                      >
                        VISÃO PDF
                      </button>
                      <button
                        onClick={() => setView("PDF INSIDE")}
                        className={`p-1 cursor-pointer w-[350px] rounded font-bold ${
                          view == "PDF INSIDE"
                            ? "bg-[#0781F2] text-white hover:bg-blue-300 hover:text-black"
                            : "bg-blue-300 hover:bg-[#0781F2] hover:text-white"
                        }`}
                      >
                        VISÃO PDF INSIDE
                      </button>
                    </div>
                    <div className="flex flex-col items-end w-full gap-1">
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
                              vendedor: e.map((x) => x.value),
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
                          placeholder="INSIDER"
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
                              insider: e.map((x) => x.value),
                            })
                          }
                          options={vendedores
                            .filter((x) => x.qualificacao?.includes("INSIDE"))
                            .map((vendedor) => {
                              return {
                                label: vendedor.nome,
                                value: vendedor.nome,
                              };
                            })}
                        />
                      </div>
                      <FilterButton
                        text={"FILTRAR"}
                        icon={<AiOutlineSearch />}
                        handleClick={filterProjects}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-6">
                    <div className="flex flex-col justify-between border-x border-gray-200 px-2 h-full">
                      <h1 className="text-[#15599a] font-bold text-center">
                        FATURAMENTO TOTAL
                      </h1>
                      <p className="text-gray-700 text-center text-xs">
                        R$ {Number(getTotalSold()).toLocaleString("pt-br")}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between border-x border-gray-200 px-2 h-full">
                      <h1 className="text-[#15599a] font-bold text-center">
                        COMISSÃO TOTAL ATIVO (PROJETO)
                      </h1>
                      <p className="text-gray-700 text-center text-xs">
                        R${" "}
                        {Number(
                          getTotalComission().ativoProjeto
                        ).toLocaleString("pt-br")}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between border-x border-gray-200 px-2 h-full">
                      <h1 className="text-[#15599a] font-bold text-center">
                        COMISSÃO TOTAL ATIVO (PADRÃO)
                      </h1>
                      <p className="text-gray-700 text-center text-xs">
                        R${" "}
                        {Number(getTotalComission().ativoPadrao).toLocaleString(
                          "pt-br"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between border-x border-gray-200 px-2 h-full">
                      <h1 className="text-[#15599a] font-bold text-center">
                        COMISSÃO TOTAL INSIDE
                      </h1>
                      <p className="text-gray-700 text-center text-xs">
                        R${" "}
                        {Number(getTotalComission().inside).toLocaleString(
                          "pt-br"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between border-x border-gray-200 px-2 h-full">
                      <h1 className="text-[#15599a] font-bold text-center">
                        COMISSÃO TOTAL SOBRE FATURAMENTO
                      </h1>
                      <p className="text-gray-700 text-center text-xs">
                        {(
                          (getTotalComission().total * 100) /
                          getTotalSold()
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                    <div className="flex flex-col justify-between border-x border-gray-200 px-2 h-full">
                      <h1 className="text-[#15599a] font-bold text-center">
                        VALOR DO kWp
                      </h1>
                      <p className="text-gray-700 text-center text-xs">
                        R$ {(getTotalSold() / getTotalPeakPot()).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {view == "GERAL" && (
            <ComissaoGeralView
              projects={filteredProjects}
              setProjects={setFilteredProjects}
            />
          )}
          {view == "PDF" && (
            <ComissaoPDFView
              projects={filteredProjects}
              totalComission={getTotalComission()}
            />
          )}
          {view == "PDF INSIDE" && (
            <ComissaoPDFViewInside
              projects={filteredProjects}
              totalComission={getTotalComission()}
            />
          )}
        </div>
      );
  }
}

export default ComissaoPage;
