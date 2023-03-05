import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ModalNovoFormAlmoxarifado from "../../components/ModalNovoFormAlmoxarifado";
import ModalFormAlmoxarifado from "../../components/ModalFormAlmoxarifado";
import { AiOutlineSearch } from "react-icons/ai";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
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
              placeholder="Digite o nome do cliente"
              value={filters.pesquisa}
              className={
                "outline-none p-1.5 rounded border border-gray-200 placeholder:italic"
              }
              onChange={(e) =>
                setFilters({ ...filters, pesquisa: e.target.value })
              }
            />
            <button
              onClick={filterProjects}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] h-[36px] font-bold rounded px-2 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
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
            <div
              key={form._id}
              onClick={() => {
                setModalForm(form);
                setModalIsOpen(true);
              }}
              className={`w-[250px] lg:w-[450px] ${getCardColor(
                form.efetivado
              )} cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-700">{form.nomeDoContrato}</p>
                <p className="text-xs text-[#15599a]">#{form.codigoProjeto}</p>
              </div>
              <div className="flex items-center justify-center">
                <div>
                  <span className="text-xxs">RESPONSÁVEL</span>
                  <p className="text-xs text-gray-600">
                    {form.responsavel && form.responsavel}
                  </p>
                </div>
              </div>
            </div>
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
