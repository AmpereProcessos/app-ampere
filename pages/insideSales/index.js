import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ModalNovoLead from "../../components/ModalNovoLead";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { BsDownload } from "react-icons/bs";
import Select from "react-select";
import axios from "axios";
import dayjs from "dayjs";
import LeadCard from "../../components/LeadCard";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
var dateFilterParam = new Date();
dateFilterParam.setMonth(dateFilterParam.getMonth() - 3);
function InsideSales() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const { credentials, setCredentials } = useContext(AppContext);
  const [modalNovoLead, setModalNovoLead] = useState(false);
  const [filters, setFilters] = useState({
    pesquisaFilter: "",
    cidadeFilter: [],
    vendedorFilter: [],
    canalFilter: [],
    insiderFilter: [],
  });
  const [fetchDateFilter, setFetchDateFilter] = useState({
    after: new Date(dateFilterParam).toISOString(),
    before: new Date(dayjs().hour(22).$d).toISOString(),
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  });
  function exportData() {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredLeads)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  }
  function getLeads() {
    if (
      credentials.accessibleRoutes.includes("PPS") ||
      credentials.accessibleRoutes.includes("Marketing")
    ) {
      axios
        .get(
          `api/insideSales?after=${new Date(
            fetchDateFilter.after
          ).toISOString()}&before=${fetchDateFilter.before}`
        )
        .then((res) => {
          setLeads(res.data);
          setFilteredLeads(res.data);
        });
    } else {
      axios
        .post("/api/insideSales", {
          responsavel: credentials.vendedor,
          after: new Date(fetchDateFilter.after).toISOString(),
          before: fetchDateFilter.before,
        })
        .then((res) => {
          setLeads(res.data);
          setFilteredLeads(res.data);
        });
    }
  }
  function filterLeads() {
    var newArr;
    if (dateFilter.after && dateFilter.before && dateFilter.field != null) {
      if (!newArr) newArr = leads;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field] >= dateFilter.after &&
          call[dateFilter.field] <= dateFilter.before
      );
    }
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = leads;
      newArr = newArr.filter((lead) =>
        filters.cidadeFilter.includes(lead.cidade)
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = leads;
      newArr = newArr.filter((lead) =>
        filters.vendedorFilter.includes(lead.vendedor)
      );
    }
    if (filters.canalFilter.length > 0) {
      if (!newArr) newArr = leads;
      newArr = newArr.filter((lead) =>
        filters.canalFilter.includes(lead.canal)
      );
    }
    if (filters.insiderFilter.length > 0) {
      if (!newArr) newArr = leads;
      newArr = newArr.filter((lead) =>
        filters.insiderFilter.includes(lead.responsavel)
      );
    }
    if (filters.pesquisaFilter.trim().length > 0) {
      if (!newArr) newArr = leads;
      newArr = newArr.filter((lead) =>
        lead.nome.toUpperCase().includes(filters.pesquisaFilter.toUpperCase())
      );
    }
    if (!newArr) {
      setFilteredLeads(leads);
      return leads;
    } else {
      setFilteredLeads(newArr);
      return newArr;
    }
  }
  useEffect(() => {
    if (credentials.accessibleRoutes.includes("InsideSales")) {
      getLeads();
    } else {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex flex-col items-center border-b border-gray-200 pb-2">
        <h1 className="font-bold uppercase text-2xl text-[#15599a] font-raleway text-center">
          ACOMPANHAMENTO DE OPORTUNIDADES ({filteredLeads.length})
        </h1>

        <div className="flex gap-x-2 items-center justify-around flex-wrap gap-2">
          <p>Adquiridos entre:</p>
          <input
            value={dayjs(fetchDateFilter.after).format("YYYY-MM-DD")}
            onChange={(e) =>
              setFetchDateFilter({
                ...fetchDateFilter,
                after: e.target.value,
              })
            }
            type="date"
            className="border border-gray-200 outline-none p-2"
          />
          <p>&</p>
          <input
            value={dayjs(fetchDateFilter.before).format("YYYY-MM-DD")}
            onChange={(e) =>
              setFetchDateFilter({
                ...fetchDateFilter,
                before: e.target.value,
              })
            }
            type="date"
            className="border border-gray-200 outline-none p-2"
          />
          <div
            onClick={getLeads}
            className="flex cursor-pointer bg-[#fead61] text-[#15599a] hover:bg-[#15599a] hover:text-white items-center  font-bold p-2 rounded-lg transition duration-300 ease-in-out hover:scale-105"
          >
            <p className="mr-2 text-sm">BUSCAR LEADS</p>
            <MdDateRange />
          </div>
          <div
            onClick={exportData}
            className="flex cursor-pointer border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white items-center  font-bold p-2 rounded-lg transition duration-300 ease-in-out hover:scale-105"
          >
            <p className="mr-2 text-sm">BAIXAR DADOS</p>
            <BsDownload />
          </div>
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2 mt-2">
          <input
            type={"text"}
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={filters.pesquisaFilter}
            onChange={(e) =>
              setFilters({ ...filters, pesquisaFilter: e.target.value })
            }
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
          <Select
            isMulti
            placeholder="CANAL"
            onChange={(e) =>
              setFilters({
                ...filters,
                canalFilter: e.map((x) => x.value),
              })
            }
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "GOOGLE ADS", value: "GOOGLE ADS" },
              { label: "FACEBOOK ADS", value: "FACEBOOK ADS" },
              { label: "INDICAÇÃO", value: "INDICAÇÃO" },
              { label: "PASSIVO", value: "PASSIVO" },
              { label: "PROSPECÇÃO ATIVA", value: "PROSPECÇÃO ATIVA" },
            ]}
          />
          {credentials.accessibleRoutes.includes("PPS") ||
          credentials.accessibleRoutes.includes("Marketing") ? (
            <Select
              isMulti
              placeholder="INSIDER"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  insiderFilter: e.map((x) => x.value),
                })
              }
              options={vendedores
                .filter((x) => x.qualificacao?.includes("INSIDE"))
                .map((vendedor) => {
                  return { label: vendedor.nome, value: vendedor.nome };
                })}
            />
          ) : (
            false
          )}

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
                {
                  label: "DATA DE ENVIO",
                  value: "dataDeEnvio",
                },
                {
                  label: "DATA DE AQUISIÇÃO",
                  value: "dataDeAquisicao",
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
          <button
            onClick={filterLeads}
            className="flex bg-[#fead61] text-[#15599a] hover:bg-[#15599a] hover:text-white h-[36px] font-bold rounded px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} getLeads={getLeads} />
        ))}
      </div>
      <div
        onClick={() => setModalNovoLead(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">NOVO LEAD</p>
      </div>
      {modalNovoLead && (
        <ModalNovoLead setModalIsOpen={setModalNovoLead} getLeads={getLeads} />
      )}
    </div>
  );
}

export default InsideSales;
