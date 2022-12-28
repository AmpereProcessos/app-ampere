import axios from "axios";
import Select from "react-select";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ComissaoGeralView from "../../components/ComissaoGeralView";
import ComissaoPDFView from "../../components/ComissaoPDFView";
import { AppContext } from "../../context/AppContext";
import { vendedores } from "../../utils/constants";
const currentDate = new Date();
function Comissao() {
  const { credentials, setCredentials } = useContext(AppContext);
  const [view, setView] = useState("GERAL");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    vendedor: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    before: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
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
  function getTotalSold() {
    var sum = 0;
    for (let i = 0; i < filteredProjects.length; i++) {
      let projeto = !isNaN(filteredProjects[i].sistema?.valorProjeto)
        ? filteredProjects[i].sistema.valorProjeto
        : 0;
      sum = sum + projeto;
    }
    return sum;
  }
  function getTotalComission() {
    var sum = 0;
    for (let i = 0; i < filteredProjects.length; i++) {
      sum = sum + filteredProjects[i].valorComissao;
    }
    return sum.toFixed(2);
  }
  function getTotalPeakPot() {
    var sum = 0;
    for (let i = 0; i < filteredProjects.length; i++) {
      sum = sum + filteredProjects[i].sistema.potPico;
    }
    return sum;
  }
  useEffect(() => {
    if (credentials?.manager) {
      getProjects();
    }
  }, []);
  if (credentials?.manager)
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
              <button
                onClick={filterProjects}
                className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
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
              <buttton
                onClick={() => setView("GERAL")}
                className={`p-1 cursor-pointer rounded font-bold ${
                  view == "GERAL"
                    ? "bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black"
                    : "bg-[#fead61] hover:bg-[#15599a] hover:text-white"
                }`}
              >
                VISÃO GERAL
              </buttton>
              <buttton
                onClick={() => setView("PDF")}
                className={`p-1 cursor-pointer rounded font-bold ${
                  view == "PDF"
                    ? "bg-[#0781F2] text-white hover:bg-blue-300 hover:text-black"
                    : "bg-blue-300 hover:bg-[#0781F2] hover:text-white"
                }`}
              >
                VISÃO PDF
              </buttton>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="flex flex-col border-x border-gray-200 px-2">
              <h1 className="text-[#15599a] font-bold text-center">
                FATURAMENTO TOTAL
              </h1>
              <p className="text-gray-700 text-center text-xs">
                R$ {getTotalSold().toLocaleString("pt-br")}
              </p>
            </div>
            <div className="flex flex-col border-x border-gray-200 px-2">
              <h1 className="text-[#15599a] font-bold text-center">
                COMISSÃO TOTAL
              </h1>
              <p className="text-gray-700 text-center text-xs">
                R$ {getTotalComission().toLocaleString("pt-br")}
              </p>
            </div>
            <div className="flex flex-col border-x border-gray-200 px-2">
              <h1 className="text-[#15599a] font-bold text-center">
                COMISSÃO TOTAL SOBRE FATURAMENTO
              </h1>
              <p className="text-gray-700 text-center text-xs">
                {((getTotalComission() * 100) / getTotalSold()).toFixed(2)}%
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
      </div>
    );
}

export default Comissao;
