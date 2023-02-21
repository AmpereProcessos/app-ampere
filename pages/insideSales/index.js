import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import Select from "react-select";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import ModalNovoLead from "../../components/ModalNovoLead";
import LeadCard from "../../components/LeadCard";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import AnimatedTextAndIconButton from "../../components/AnimatedTextAndIconButton";

var dateFilterParam = new Date();
dateFilterParam.setMonth(dateFilterParam.getMonth() - 3);

function InsideSales() {
  const { credentials, setCredentials } = useContext(AppContext);

  const router = useRouter();

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);

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
  function exportData() {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredLeads)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  }
  useEffect(() => {
    if (credentials.accessibleRoutes.includes("InsideSales")) {
      getLeads();
    } else {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex flex-col grow p-6">
      <div className="flex flex-col pb-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="font-bold  text-2xl text-[#15599a] w-full font-['Roboto'] text-start">
            ACOMPANHAMENTO DE OPORTUNIDADES ({filteredLeads.length})
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
              className="flex flex-col lg:flex-row items-center lg:justify-between mt-4 gap-2 w-full"
            >
              <div className="flex flex-col gap-2">
                <span className="font-['Roboto'] text-xs h-[38px]">
                  ADQUIRIDOS ENTRE:
                </span>
                <div className="flex items-center justify-center flex-wrap gap-2">
                  <input
                    value={dayjs(fetchDateFilter.after).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setFetchDateFilter({
                        ...fetchDateFilter,
                        after: e.target.value,
                      })
                    }
                    type="date"
                    className="border border-gray-200 outline-none py-1 px-2"
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
                    className="border border-gray-200 outline-none py-1 px-2"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    onClick={getLeads}
                    className="flex cursor-pointer bg-[#fead61] text-[#15599a] hover:bg-[#15599a] hover:text-white items-center  font-bold p-2 rounded-lg transition duration-300 ease-in-out hover:scale-105"
                  >
                    <p className="mr-2 text-sm">BUSCAR LEADS</p>
                    <MdDateRange />
                  </div>
                  <div
                    onClick={exportData}
                    className="flex cursor-pointer text-[#15599a] items-center  font-bold p-2 rounded-lg transition duration-300 ease-in-out hover:scale-105"
                  >
                    <p className="mr-2 text-sm">BAIXAR DADOS</p>
                    <BsDownload />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end grow gap-2">
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <input
                    type={"text"}
                    className="outline-none p-1.5 w-full lg:w-[250px] rounded border border-gray-200 placeholder:italic"
                    placeholder="Digite o nome do contrato"
                    value={filters.pesquisaFilter}
                    onChange={(e) =>
                      setFilters({ ...filters, pesquisaFilter: e.target.value })
                    }
                  />
                  <div className="flex gap-x-2">
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
                </div>
                <div className="flex flex-col justify-start lg:justify-end lg:flex-row items-center flex-wrap gap-2 w-full">
                  <div className="w-full lg:w-[200px]">
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
                  <div className="w-full lg:w-[200px]">
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
                  </div>
                  <div className="w-full lg:w-[200px]">
                    <Select
                      isMulti
                      placeholder="CANAL"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                        }),
                      }}
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
                        {
                          label: "PROSPECÇÃO ATIVA",
                          value: "PROSPECÇÃO ATIVA",
                        },
                      ]}
                    />
                  </div>

                  {credentials.accessibleRoutes.includes("PPS") ||
                  credentials.accessibleRoutes.includes("Marketing") ? (
                    <div className="w-full lg:w-[200px]">
                      <Select
                        isMulti
                        placeholder="INSIDER"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                          }),
                        }}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            insiderFilter: e.map((x) => x.value),
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
                  ) : (
                    false
                  )}
                </div>
                <button
                  onClick={filterLeads}
                  className="flex bg-[#fead61] text-[#15599a] hover:bg-[#15599a] hover:text-white h-[36px] font-bold rounded px-2 items-center gap-x-2"
                >
                  <p>FILTRAR</p>
                  <AiOutlineSearch />
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} getLeads={getLeads} />
        ))}
      </div>
      {/* <div
        onClick={() => setModalNovoLead(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">NOVO LEAD</p>
      </div> */}
      <AnimatedTextAndIconButton>
        <p
          onClick={() => setModalNovoLead(true)}
          className="uppercase font-bold text-sm h-full w-full text-center"
        >
          NOVO LEAD
        </p>
      </AnimatedTextAndIconButton>
      {modalNovoLead && (
        <ModalNovoLead setModalIsOpen={setModalNovoLead} getLeads={getLeads} />
      )}
    </div>
  );
}

export default InsideSales;
