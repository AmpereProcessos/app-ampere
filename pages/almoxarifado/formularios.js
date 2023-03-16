import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ModalNovoFormAlmoxarifado from "../../components/ModalNovoFormAlmoxarifado";
import FilterButton from "../../components/utils/FilterButton";
import ModalFormAlmoxarifado from "../../components/ModalFormAlmoxarifado";
import { AiOutlineSearch } from "react-icons/ai";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
import dayjs from "dayjs";
import Select from "react-select";
import FormAlmoxarifadoCard from "../../components/FormAlmoxarifadoCard";
function Formularios() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [filters, setFilters] = useState({
    efetivados: false,
    pesquisa: "",
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  });

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalForm, setModalForm] = useState({});
  function getForms() {
    axios.get("/api/almoxarifado/formularios").then((res) => {
      setForms(res.data);
      setFilteredForms(res.data);
    });
  }
  function filterProjects() {
    var newArr;
    if (filters.efetivados) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) => !form.efetivado);
    }
    if (filters.pesquisa.trim().length > 0) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) =>
        form.nomeDoContrato
          .toUpperCase()
          .includes(filters.pesquisa.toUpperCase())
      );
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field != null) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field] >= dateFilter.after &&
          call[dateFilter.field] <= dateFilter.before
      );
    }
    if (!newArr) {
      setFilteredForms(forms);
    } else {
      setFilteredForms(newArr);
    }
  }
  function getCardColor(status) {
    if (status == true) {
      return "bg-green-100";
    } else if (status == false) {
      return "bg-red-100";
    } else {
      return "bg-[#fff]";
    }
  }
  async function handleOpenModal(form) {
    let { data } = await axios.get(
      `/api/almoxarifado/getFormularios?id=${form._id}`
    );
    setModalForm(data);
    setModalIsOpen(true);
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("Almoxarifado")) {
      getForms();
    } else {
      if (session?.user) {
        {
          router.push("/");
        }
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center gap-2 border-b border-gray-200 pb-2">
          <h1 className="text-[#fead61] font-raleway font-bold text-xl">
            FORMULÁRIOS ({filteredForms.length})
          </h1>
          <div className="flex items-center flex-wrap justify-around gap-2">
            <button
              onClick={() =>
                setFilters({ ...filters, efetivados: !filters.efetivados })
              }
              className={`${
                filters.efetivados
                  ? "bg-blue-600 text-white hover:bg-blue-300 hover:text-black"
                  : "bg-blue-300 hover:bg-blue-600 hover:text-white"
              } font-bold p-2 rounded h-[36px]`}
            >
              NÃO EFETIVADOS
            </button>
            <input
              type={"text"}
              value={filters.pesquisa}
              className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
              placeholder="DIGITE O NOME DO CONTRATO"
              onChange={(e) =>
                setFilters({ ...filters, pesquisa: e.target.value })
              }
            />

            <div className="flex gap-x-2 w-full lg:w-fit">
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
              <div className="w-full lg:w-[250px]">
                <Select
                  isMulti={false}
                  placeholder={"CAMPO DE FILTRO"}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      width: "100%",
                      minHeight: "41px",
                    }),
                  }}
                  options={[
                    {
                      label: "SAÍDA DE OBRA",
                      value: "saidaDeObra",
                    },
                    {
                      label: "ABERTURA",
                      value: "abertura",
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
            <FilterButton
              text={"FILTRAR"}
              icon={<AiOutlineSearch />}
              handleClick={filterProjects}
            />
          </div>
        </div>
        <div
          onClick={() => setCreateModalIsOpen(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
        >
          <p className="uppercase font-bold text-sm">Novo Formulário</p>
        </div>
        <div className="flex  justify-around gap-3 mt-4 flex-wrap">
          {filteredForms.map((form) => (
            <FormAlmoxarifadoCard
              getForms={getForms}
              form={form}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </div>
        {modalIsOpen && (
          <ModalFormAlmoxarifado
            info={modalForm}
            setModalIsOpen={setModalIsOpen}
            getForms={getForms}
          />
        )}
        {createModalIsOpen && (
          <ModalNovoFormAlmoxarifado
            getForms={getForms}
            setModalIsOpen={setCreateModalIsOpen}
          />
        )}
      </div>
    );
  }
}

export default Formularios;
