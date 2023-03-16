import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalVendas from "../../components/ModalVendas";
import axios from "axios";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import Select from "react-select";
import { cidadesAtendidas } from "../../utils/constants";
import SelectInput from "../../components/SelectInput";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
const statusStyles = {
  ASSINADO: {
    textColor: "text-green-500",
  },
  "NÃO ASSINADO": {
    textColor: "text-red-500",
  },
  SOLICITADO: {
    textColor: "text-yellow-500",
  },
};
function Vendas() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  const [filters, setFilters] = useState({
    searchFilter: "",
    cidadeFilter: [],
    npsValor: "",
    npsTipo: "NÃO DEFINIDO",
  });
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  });
  function getProjects(credenciais) {
    axios
      .post("/api/projects/vendas", {
        filtrarPor: credenciais.visualizacao,
        parametro: credenciais.vendedor,
      })
      .then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      });
  }
  function filterProjects() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        filters.cidadeFilter.includes(project.cidade)
      );
    }
    if (filters.searchFilter.trim().length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((project) =>
        project.nomeDoContrato
          .toUpperCase()
          .includes(filters.searchFilter.toUpperCase())
      );
    }
    if (filters.npsValor && filters.npsTipo != "NÃO DEFINIDO") {
      if (!newArr) newArr = projects;
      if (filters.npsTipo == "ACIMA DE") {
        newArr = newArr.filter((x) => x.nps > filters.npsValor);
      }
      if (filters.npsTipo == "ABAIXO DE") {
        newArr = newArr.filter((x) => x.nps < filters.npsValor);
      }
    }
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (call) =>
          call[dateFilter.field1][dateFilter.field2] >= dateFilter.after &&
          call[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      );
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function handleOpenModal(id) {
    axios.get(`/api/projects/fetchDoc/${id}`).then((res) => {
      setModalProject(res.data[0]);
      setModalIsOpen(true);
    });
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("Vendas")) {
      if (!projects) {
        getProjects(session.user);
      }
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  console.log(filteredProjects);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 flex flex-col grow bg-[#fff]">
        <div className="flex flex-col items-center border-b border-gray-200 pb-3">
          <h1 className="text-[#15599a] font-bold text-xl">
            SEUS CLIENTES ({filteredProjects.length})
          </h1>
          <div className="flex flex-wrap items-center justify-around gap-3">
            <input
              value={filters.searchFilter}
              onChange={(e) =>
                setFilters({ ...filters, searchFilter: e.target.value })
              }
              className="outline-none p-2 h-[36px] text-sm border border-gray-200 grow lg:w-[350px]"
              placeholder="Nome do cliente..."
            />
            <div className="flex items-center gap-2">
              <input
                value={filters.npsValor}
                type="number"
                onChange={(e) =>
                  setFilters({ ...filters, npsValor: Number(e.target.value) })
                }
                placeholder={"VALOR DE NPS"}
                className="outline-none p-2 h-[36px] text-sm border border-gray-200 "
              />
              <div className="flex flex-col text-sm lg:text-base w-fit items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  TIPO DE FILTRO
                </span>
                <select
                  className="text-xs w-full text-center bg-transparent uppercase text-gray-600 outline-none"
                  onChange={(e) =>
                    setFilters({ ...filters, npsTipo: e.target.value })
                  }
                  value={filters.npsTipo}
                >
                  <option value={"ACIMA DE"}>ACIMA DE</option>
                  <option value={"ABAIXO DE"}>ABAIXO DE</option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
            </div>
            <Select
              isMulti={true}
              placeholder="CIDADE"
              options={cidadesAtendidas.map((cidade) => {
                return { label: cidade, value: cidade };
              })}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  cidadeFilter: e.map((x) => x.value),
                })
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
                    label: "DATA ASS.CONTRATO",
                    value: "contrato.dataAssinatura",
                  },
                  {
                    label: "DATA PAGAMENTO",
                    value: "compra.dataPagamento",
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
            </div>
            <button
              onClick={filterProjects}
              className="flex h-[36px] bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-around mt-4 gap-3">
          {filteredProjects.map((project) => (
            <div
              onClick={() => {
                handleOpenModal(project._id);
              }}
              key={project._id}
              className={`w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-700">
                  {project.nomeDoContrato}
                </p>
                <p className="text-xs text-[#15599a]">#{project.qtde}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="hidden lg:flex lg:flex-col">
                  <span className="text-xxs">CONTRATO</span>
                  <p
                    className={`text-xs ${
                      statusStyles[project.contrato?.status]
                        ? statusStyles[project.contrato.status].textColor
                        : ""
                    }`}
                  >
                    {project.contrato?.status && project.contrato?.status}
                  </p>
                </div>
                <div className="text-end">
                  <span className="text-xxs text-end">PAGAMENTO</span>
                  <p className="text-xs text-center text-gray-600">
                    {project.pagamento.status ? project.pagamento.status : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xxs">STATUS OBRA</span>
                  <p className={`text-[#fead61] text-xs uppercase`}>
                    {project.obra.statusDaObra
                      ? project.obra.statusDaObra
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="text-xxs">VISTORIA</span>
                  <p className="text-xs text-gray-600 text-center">
                    {project.vistoria.status ? project.vistoria.status : "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {modalIsOpen && (
          <ModalVendas
            project={modalProject}
            credenciais={session?.user}
            setModalIsOpen={setModalIsOpen}
          />
        )}
      </div>
    );
  }
}

export default Vendas;
