import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import ModalNovoFormAlmoxarifado from "../../components/ModalNovoFormAlmoxarifado";
import FilterButton from "../../components/utils/Buttons/FilterButton";
import ModalFormAlmoxarifado from "../../components/ModalFormAlmoxarifado";
import { AiOutlineSearch } from "react-icons/ai";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
import Select from "react-select";
import FormAlmoxarifadoCard from "../../components/FormAlmoxarifadoCard";
import FetchDataButton from "../../components/utils/Buttons/FetchDataButton";
import { useInView } from "react-intersection-observer";
import { useForms } from "../../utils/methods/query/warehouseForms";

function validateAuthorization(session, paramRoute) {
  if (!session) return false;
  if (session.user.accessibleRoutes.includes(paramRoute)) return true;
  return false;
}

function Formularios() {
  const router = useRouter();
  const { ref, inView } = useInView();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const {
    data: forms,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
  } = useForms(validateAuthorization(session, "Almoxarifado"));

  const [filteredForms, setFilteredForms] = useState([]);
  const [filters, setFilters] = useState({
    efetivados: false,
    pesquisa: "",
    codigo: "",
    servico: [],
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field: null,
  });

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalForm, setModalForm] = useState({});

  function filterProjects() {
    var newArr;
    if (filters.efetivados) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) => !form.efetivado);
    }
    if (filters.pesquisa.trim().length > 0) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter(
        (form) =>
          form.nomeDoContrato
            .toUpperCase()
            .includes(filters.pesquisa.toUpperCase()) ||
          form.nomeTerceiro
            ?.toUpperCase()
            .includes(filters.pesquisa.toUpperCase())
      );
    }
    if (filters.codigo.trim().length > 0) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) =>
        form.codigoProjeto?.toString().includes(filters.codigo)
      );
    }
    if (filters.servico.length > 0) {
      if (!newArr) newArr = forms;
      newArr = newArr.filter((form) => filters.servico.includes(form.servico));
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
  async function handleOpenModal(form) {
    let { data } = await axios.get(
      `/api/almoxarifado/getFormularios?id=${form._id}`
    );
    setModalForm(data);
    setModalIsOpen(true);
  }
  useEffect(() => {
    if (isSuccess) {
      // const allForms = [].concat(...forms.pages);
      setFilteredForms(forms);
    }
  }, [forms]);
  const formsRender = useMemo(
    () =>
      filteredForms.map((form, index) => (
        <FormAlmoxarifadoCard
          key={form._id}
          index={index}
          forms={filteredForms}
          setFilteredForms={setFilteredForms}
          getForms={refetch}
          form={form}
          handleOpenModal={handleOpenModal}
        />
      )),
    [filteredForms]
  );

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col items-center gap-2 border-b border-gray-200 pb-2">
          <h1 className="text-[#fead61] font-raleway font-bold text-xl">
            FORMULÁRIOS ({filteredForms.length})
          </h1>
          <div className="flex flex-col items-center w-full gap-2">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-2">
              <input
                type={"text"}
                value={filters.pesquisa}
                className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                placeholder="DIGITE O NOME DO CONTRATO"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, pesquisa: e.target.value }))
                }
              />
              <input
                type={"number"}
                value={filters.codigo}
                className="outline-none p-1.5  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                placeholder="DIGITE O CÓDIGO DO PROJETO"
                onChange={(e) =>
                  setFilters({ ...filters, codigo: e.target.value })
                }
              />
              <div className="w-full lg:w-[250px]">
                <Select
                  isMulti={true}
                  placeholder={"SERVIÇO"}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      width: "100%",
                      minHeight: "41px",
                    }),
                  }}
                  options={[
                    {
                      label: "PADRÃO",
                      value: "PADRÃO",
                    },
                    {
                      label: "ESTRUTURA",
                      value: "ESTRUTURA",
                    },
                    {
                      label: "MONTAGEM",
                      value: "MONTAGEM",
                    },
                    {
                      label: "MANUTENÇÃO CORRETIVA",
                      value: "MANUTENÇÃO CORRETIVA",
                    },
                    {
                      label: "MANUTENÇÃO PREVENTIVA",
                      value: "MANUTENÇÃO PREVENTIVA",
                    },
                  ]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      servico: e.map((x) => x.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-2">
              <div className="w-fit flex items-center gap-2">
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
              <button
                onClick={() =>
                  setFilters({ ...filters, efetivados: !filters.efetivados })
                }
                className={`p-2 rounded w-fit border border-[#15599a] font-bold ${
                  filters.efetivados
                    ? "bg-[#15599a] text-white"
                    : "text-[#15599a] bg-transparent"
                }`}
              >
                NÃO EFETIVADOS
              </button>
            </div>
            <div className="flex items-center justify-end w-full">
              <FilterButton
                text={"FILTRAR"}
                icon={<AiOutlineSearch />}
                handleClick={filterProjects}
              />
            </div>
          </div>
        </div>
        <div className="flex grow justify-around gap-3 mt-4 flex-wrap">
          {isFetching ? (
            <div className="grow flex items-center justify-center">
              <LoadingPage />
            </div>
          ) : null}
          {/* {filteredForms.map((form, index) => {
            const applyInViewRef = filteredForms.length === index + 1;
            return (
              <FormAlmoxarifadoCard
                key={form._id}
                index={index}
                forms={filteredForms}
                setFilteredForms={setFilteredForms}
                getForms={refetch}
                form={form}
                handleOpenModal={handleOpenModal}
                inViewRef={applyInViewRef ? ref : undefined}
              />
            );
          })} */}
          {formsRender}
        </div>

        {modalIsOpen && (
          <ModalFormAlmoxarifado
            info={modalForm}
            setModalIsOpen={setModalIsOpen}
            getForms={refetch}
          />
        )}
        {createModalIsOpen && (
          <ModalNovoFormAlmoxarifado
            getForms={refetch}
            setModalIsOpen={setCreateModalIsOpen}
          />
        )}
        <div
          onClick={() => setCreateModalIsOpen(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
        >
          <p className="uppercase font-bold text-sm">Novo Formulário</p>
        </div>
      </div>
    );
  }
}

export default Formularios;
