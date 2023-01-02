import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ModalNovoLead from "../../components/ModalNovoLead";
import { AiOutlineSearch } from "react-icons/ai";
import Select from "react-select";
import axios from "axios";
import dayjs from "dayjs";
import LeadCard from "../../components/LeadCard";
function InsideSales() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const { credentials, setCredentials } = useContext(AppContext);
  const [modalNovoLead, setModalNovoLead] = useState(false);
  const [filters, setFilters] = useState({
    pesquisaFilter: "",
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  });
  function getLeads() {
    axios
      .post("/api/insideSales", { responsavel: credentials.vendedor })
      .then((res) => {
        setLeads(res.data);
        setFilteredLeads(res.data);
      });
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
  console.log(leads);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex flex-col items-center border-b border-gray-200 pb-2">
        <h1 className="font-bold uppercase text-2xl text-[#15599a] font-raleway text-center">
          ACOMPANHAMENTO DE OPORTUNIDADES ({filteredLeads.length})
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <input
            type={"text"}
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={filters.pesquisaFilter}
            onChange={(e) =>
              setFilters({ ...filters, pesquisaFilter: e.target.value })
            }
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
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] h-[36px] font-bold rounded px-2 items-center gap-x-2"
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
