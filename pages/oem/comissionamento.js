import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
import Select from "react-select";
import { AppContext } from "../../context/AppContext";
import ComissionamentoPosObraCard from "../../components/ComissionamentoPosObraCard";
import { cidadesAtendidas, equipesTecnicas } from "../../utils/constants";

function Comissionamento() {
  const { credentials } = useContext(AppContext);
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    pesquisaFilter: "",
    cidadeFilter: [],
    equipResp: [],
    usinaLigadaFilter: [],
    appPendente: false,
    energiaInjetadaPendente: false,
    entregaTecnicaPendente: false,
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  function getProjects() {
    axios.get("/api/projects/comissionamentoPosObra").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  function filterProjects() {
    var newArr;
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (filters.appPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) => project.app.data == undefined);
    }
    if (filters.energiaInjetadaPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.medidor.data != undefined &&
          project.conferencias.energiaInjetada.data == undefined
      );
    }
    if (filters.entregaTecnicaPendente) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) =>
          project.medidor.data != undefined &&
          project.jornada?.entregaTecnica == undefined
      );
    }
    if (filters.pesquisaFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        call.nomeDoContrato.toUpperCase().includes(filters.pesquisaFilter)
      );
    }
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
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects([...newArr]);
      return newArr;
    }
  }
  useEffect(() => {
    if (
      credentials.accessibleRoutes.includes("O&M") ||
      credentials.accessibleRoutes.includes("Pós-Venda")
    ) {
      getProjects();
    } else {
      router.push("/");
    }
  }, []);
  console.log(filteredProjects);
  return (
    <div className="p-6 grow flex flex-col">
      <div className="flex flex-col py-2 border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-center text-xl">
          COMISSIONAMENTO PÓS-OBRA ({filteredProjects.length})
        </h1>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <input
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={filters.pesquisaFilter}
            onChange={(e) =>
              setFilters({
                ...filters,
                pesquisaFilter: e.target.value.toUpperCase(),
              })
            }
          />
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
                energiaInjetadaPendente: !filters.energiaInjetadaPendente,
              })
            }
            className={`${
              filters.energiaInjetadaPendente ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            ENERGIA INJETADA PENDENTE
          </div>
          <div
            onClick={() =>
              setFilters({
                ...filters,
                entregaTecnicaPendente: !filters.entregaTecnicaPendente,
              })
            }
            className={`${
              filters.entregaTecnicaPendente ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            ENTREGA TÉCNICA PENDENTE
          </div>
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
            <Select
              isMulti={false}
              placeholder={"CAMPO DE FILTRO"}
              options={[
                { label: "SAÍDA DE OBRA", value: "obra.saida" },
                { label: "TROCA DO MEDIDOR", value: "medidor.data" },
                { label: "NÃO DEFINIDO", value: null },
              ]}
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  field1: e.value != null ? e.value.split(".")[0] : null,
                  field2: e.value != null ? e.value.split(".")[1] : null,
                })
              }
            />
          </div>
          <Select
            isMulti
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
          <Select
            isMulti
            placeholder="EQUIP.RESP"
            onChange={(e) =>
              setFilters({
                ...filters,
                equipResp: e.map((x) => x.value),
              })
            }
            options={equipesTecnicas.map((equipe) => equipe)}
          />
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
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] hover:scale-105 duration-300 ease-in-out font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {filteredProjects?.map((project, index) => (
          <ComissionamentoPosObraCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default Comissionamento;
