import React, { useEffect, useState } from "react";
import Select from "react-select";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import { AiOutlineSearch } from "react-icons/ai";
import FetchDataButton from "../../components/utils/Buttons/FetchDataButton";
import dayjs from "dayjs";
import {
  cidadesAtendidas,
  formatDate,
  vendedores,
} from "../../utils/constants";
import { MdDateRange } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";
import LoadingPage from "../../components/utils/LoadingPage";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import AnaliseBlock from "../../components/AnaliseBlock";
const currentDate = new Date();

function getContractValue(valorProjeto, valorPadrao, valorEstrutura) {
  var totalSum = 0;

  let projeto = !isNaN(valorProjeto) ? valorProjeto : 0;
  let padrao = !isNaN(valorPadrao) ? valorPadrao : 0;
  let estrutura = !isNaN(valorEstrutura) ? valorEstrutura : 0;
  totalSum =
    Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura);
  return totalSum;
}

function Analise() {
  const { data: session } = useSession({ required: true });

  const [projects, setProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState();
  const [filters, setFilters] = useState({
    search: "",
    svbCode: "",
    seller: [],
    city: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
      -3
    ).toISOString(),
    before: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    ).toISOString(),
  });

  function filterProjects() {
    var newArr;
    if (filters.seller.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.seller.includes(project.vendedor.nome)
      );
    }
    if (filters.city.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.city.includes(project.cidade)
      );
    }
    if (filters.svbCode.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        Number(project.codigoSVB).toString().includes(filters.svbCode)
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
    setFilters((prev) => ({ ...prev, search: value }));
    if (value != "" || value != " ") {
      let filtered = filterProjects();
      let newArr = filtered.filter((project) =>
        project.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  async function fetchDate() {
    const { data } = await axios.get(
      `/api/projects/analise?after=${dateFilter.after}&before=${
        dateFilter.before
      }&field=${"contrato.dataAssinatura"}`
    );
    console.log(data);
    setProjects(data);
    setFilteredProjects(data);
  }

  function getListCumulativePeakPot() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      if (filteredProjects[i].tipoDeServico == "OPERAÇÃO E MANUTENÇÃO") {
        totalSum = totalSum;
      } else {
        let pot = filteredProjects[i].sistema?.potPico
          ? filteredProjects[i].sistema.potPico
          : null;
        if (isNaN(pot)) {
          totalSum = totalSum;
        } else {
          totalSum = totalSum + pot;
        }
      }
    }
    return totalSum.toFixed(2);
  }
  function getListCumulativeValue() {
    var totalSum = 0;
    for (var i = 0; i < filteredProjects.length; i++) {
      let projeto = !isNaN(filteredProjects[i].sistema?.valorProjeto)
        ? filteredProjects[i].sistema.valorProjeto
        : 0;
      let padrao = !isNaN(filteredProjects[i].padrao?.valor)
        ? filteredProjects[i].padrao?.valor
        : 0;
      let estrutura = !isNaN(filteredProjects[i].estruturaPersonalizada?.valor)
        ? filteredProjects[i].estruturaPersonalizada.valor
        : 0;
      totalSum =
        Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura);
    }
    return totalSum;
  }

  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("PPS") ||
      session?.user.accessibleRoutes.includes("Marketing")
    ) {
      if (!projects) {
        fetchDate(session.user);
      }
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
            <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
              ANÁLISE COMERCIAL
            </p>
            <p className="font-bold text-[#fead61]">
              {filteredProjects ? filteredProjects.length : "-"}
            </p>
            {filteredProjects && (
              <p className="font-bold text-[#fead61]">
                ({getListCumulativePeakPot()}kWp)
              </p>
            )}
            {filteredProjects && (
              <p className="font-bold text-[#fead61]">
                (R${getListCumulativeValue().toLocaleString()})
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:justify-between mt-4 gap-2 w-full">
          <div className="flex flex-col items-start grow gap-2">
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <input
                type={"text"}
                className="outline-none p-1.5 w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                placeholder="Digite o nome do contrato"
                value={filters.search}
                onChange={(e) => handleSearchFilter(e.target.value)}
              />
              <input
                type={"text"}
                className="outline-none p-1.5 w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                placeholder="Digite o código SVB"
                value={filters.svbCode}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, svbCode: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col justify-start  lg:flex-row items-center flex-wrap gap-2 w-full">
              <div className="w-full lg:w-[350px]">
                <Select
                  isMulti
                  placeholder="CIDADE"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      width: "100%",
                    }),
                  }}
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
              <div className="w-full lg:w-[350px]">
                <Select
                  isMulti
                  placeholder="VENDEDOR"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      width: "100%",
                    }),
                  }}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      seller: e.map((x) => x.value),
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
            </div>
            <FilterButton
              text={"FILTRAR"}
              icon={<AiOutlineSearch />}
              handleClick={filterProjects}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-['Roboto'] text-xs h-[38px]">
              ASSINADO ENTRE:
            </span>
            <div className="flex items-center justify-center flex-wrap gap-2">
              <input
                value={formatDate(dateFilter.after)}
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
                value={formatDate(dateFilter.before)}
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    before:
                      dayjs(e.target.value).$d != "Invalid Date"
                        ? dayjs(e.target.value).add("20", "hour").toISOString()
                        : new Date().toISOString(),
                  })
                }
                type="date"
                className="border border-gray-200 outline-none py-1 px-2"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <FetchDataButton
                text={"BUSCAR"}
                icon={<MdDateRange />}
                handleClick={fetchDate}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grow flex w-full flex-col gap-1 py-1">
        {filteredProjects ? (
          filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <AnaliseBlock key={index} project={project} />
            ))
          ) : (
            <p className="text-center w-full italic text-gray-500">
              Sem projetos no período...
            </p>
          )
        ) : (
          <LoadingPage />
        )}
      </div>
    </div>
  );
}

export default Analise;
