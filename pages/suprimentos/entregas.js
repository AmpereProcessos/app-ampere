import axios from "axios";
import React, { useState, useEffect } from "react";
import EntregasCard from "../../components/EntregasCard";
import Select from "react-select";
function Entregas({ credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    deliveryStatus: [],
    searchFilter: "",
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  function getProjects() {
    axios.get("/api/projects/suprimentos").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  function filterProjects() {
    var newArr;
    if (filters.deliveryStatus.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.deliveryStatus.includes(project.compra.statusEntrega)
      );
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
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
    setFilters({ ...filters, searchFilter: value });
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
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (
        !storedCredentials.accessibleRoutes.includes("Suprimentos") &&
        !storedCredentials.accessibleRoutes.includes("Marketing")
      ) {
        router.push("/");
      } else {
        getProjects(storedCredentials);
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (
          !credentials.accessibleRoutes.includes("Suprimentos") &&
          !credentials.accessibleRoutes.includes("Marketing")
        ) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex justify-between border-b border-gray-200">
        <h1 className="font-bold text-[#15599a] text-xl">
          ENTREGAS ({filteredProjects.length})
        </h1>
        <div className="flex items-center gap-2">
          <input
            className="outline-none p-1.5 w-[250px] h-[36px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={filters.searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <Select
            isMulti
            placeholder="STATUS ENTREGA"
            onChange={(e) =>
              setFilters({ ...filters, deliveryStatus: e.map((x) => x.value) })
            }
            options={[
              { value: "EM ROTA", label: "EM ROTA" },
              { value: "AGUARDANDO COMPRA", label: "AGUARDANDO COMPRA" },
              { value: "CANCELADO", label: "CANCELADO" },
              { value: undefined, label: "NÃO DEFINIDO" },
            ]}
          />
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
                { label: "DATA PAGAMENTO", value: "compra.dataPagamento" },
                {
                  label: "DATA MÁX P/ PAGAMENTO",
                  value: "compra.dataMaxPagamento",
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
                  field1: e.value != null ? e.value.split(".")[0] : null,
                  field2: e.value != null ? e.value.split(".")[1] : null,
                })
              }
            />
            <button
              onClick={filterProjects}
              className="bg-[#fead61] p-2 h-[36px] rounded font-bold"
            >
              FILTRAR
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {filteredProjects.map((project) => (
          <EntregasCard project={project} />
        ))}
      </div>
    </div>
  );
}

export default Entregas;
