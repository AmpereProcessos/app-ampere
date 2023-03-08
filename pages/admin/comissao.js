import axios from "axios";
import Select from "react-select";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ComissaoGeralView from "../../components/ComissaoGeralView";
import ComissaoPDFView from "../../components/ComissaoPDFView";
import ComissaoPDFViewInside from "../../components/ComissaoPDFViewInside";
import { vendedores } from "../../utils/constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "../../components/utils/LoadingPage";

const currentDate = new Date();

function Comissao() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
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
    console.log("VALOR PROJETO", sumProjeto);
    console.log("VALOR PADRÃO", sumPadrao);
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
          <div className="flex flex-col gap-2 items-center py-2 border-b border-gray-200">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-[#15599a] font-bold text-xl">COMISSÕES</h1>
              <div className="hidden lg:flex gap-x-2">
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
                        after: isNaN(e.target.value) ? e.target.value : null,
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
                        before: isNaN(e.target.value) ? e.target.value : null,
                      })
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => getProjects()}
                className="flex bg-cyan-200 hover:text-white hover:bg-[#07F2E7] font-bold rounded py-2 px-2 items-center gap-x-2"
              >
                <p>BUSCAR DADOS</p>
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center justify-between gap-2">
                <Select
                  isMulti
                  placeholder="VENDEDOR"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      vendedor: e.map((x) => x.value),
                    })
                  }
                  options={vendedores.map((vendedor) => {
                    return { label: vendedor.nome, value: vendedor.nome };
                  })}
                />
                <Select
                  isMulti
                  placeholder="INSIDER"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      insider: e.map((x) => x.value),
                    })
                  }
                  options={vendedores
                    .filter((x) => x.qualificacao?.includes("INSIDE"))
                    .map((vendedor) => {
                      return { label: vendedor.nome, value: vendedor.nome };
                    })}
                />
                <button
                  onClick={filterProjects}
                  className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-1 px-2 items-center gap-x-2"
                >
                  <p>Filtrar</p>
                  <AiOutlineSearch />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportData}
                  className="p-1 rounded bg-green-200 text-black font-bold hover:bg-[#44F213] hover:text-white"
                >
                  BAIXAR DADOS
                </button>
                <button
                  onClick={() => setView("GERAL")}
                  className={`p-1 cursor-pointer rounded font-bold ${
                    view == "GERAL"
                      ? "bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black"
                      : "bg-[#fead61] hover:bg-[#15599a] hover:text-white"
                  }`}
                >
                  VISÃO GERAL
                </button>
                <button
                  onClick={() => setView("PDF")}
                  className={`p-1 cursor-pointer rounded font-bold ${
                    view == "PDF"
                      ? "bg-[#0781F2] text-white hover:bg-blue-300 hover:text-black"
                      : "bg-blue-300 hover:bg-[#0781F2] hover:text-white"
                  }`}
                >
                  VISÃO PDF
                </button>
                <button
                  onClick={() => setView("PDF INSIDE")}
                  className={`p-1 cursor-pointer rounded font-bold ${
                    view == "PDF INSIDE"
                      ? "bg-[#0781F2] text-white hover:bg-blue-300 hover:text-black"
                      : "bg-blue-300 hover:bg-[#0781F2] hover:text-white"
                  }`}
                >
                  VISÃO PDF INSIDE
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="flex flex-col border-x border-gray-200 px-2">
                <h1 className="text-[#15599a] font-bold text-center">
                  FATURAMENTO TOTAL
                </h1>
                <p className="text-gray-700 text-center text-xs">
                  R$ {Number(getTotalSold()).toLocaleString("pt-br")}
                </p>
              </div>
              <div className="flex flex-col border-x border-gray-200 px-2">
                <h1 className="text-[#15599a] font-bold text-center">
                  COMISSÃO TOTAL ATIVO (PROJETO)
                </h1>
                <p className="text-gray-700 text-center text-xs">
                  R${" "}
                  {Number(getTotalComission().ativoProjeto).toLocaleString(
                    "pt-br"
                  )}
                </p>
              </div>
              <div className="flex flex-col border-x border-gray-200 px-2">
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
              <div className="flex flex-col border-x border-gray-200 px-2">
                <h1 className="text-[#15599a] font-bold text-center">
                  COMISSÃO TOTAL INSIDE
                </h1>
                <p className="text-gray-700 text-center text-xs">
                  R${" "}
                  {Number(getTotalComission().inside).toLocaleString("pt-br")}
                </p>
              </div>
              <div className="flex flex-col border-x border-gray-200 px-2">
                <h1 className="text-[#15599a] font-bold text-center">
                  COMISSÃO TOTAL SOBRE FATURAMENTO
                </h1>
                <p className="text-gray-700 text-center text-xs">
                  {((getTotalComission().total * 100) / getTotalSold()).toFixed(
                    2
                  )}
                  %
                </p>
              </div>
              <div className="flex flex-col border-x border-gray-200 px-2">
                <h1 className="text-[#15599a] font-bold text-center">
                  VALOR DO kWp
                </h1>
                <p className="text-gray-700 text-center text-xs">
                  R$ {(getTotalSold() / getTotalPeakPot()).toFixed(2)}
                </p>
              </div>
            </div>
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

export default Comissao;
