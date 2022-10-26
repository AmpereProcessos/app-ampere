import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ModalDB from "../../components/ModalDB";
import Select from "react-select";
import { cidadesAtendidas } from "../../utils/constants";
import axios from "axios";
function BandoDeDados({ data, credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [orderFilter, setOrderFilter] = useState({
    text: "ORDEM CRESC",
    value: true,
  });
  const [filters, setFilters] = useState({
    cidadeFilter: [],
  });
  function getProjects() {
    axios
      .get("/api/projects/bancoDeDados")
      .then((res) => {
        console.log(res.data);
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch((err) => console.log(err));
  }
  function handleSearchFilter(value) {
    setSearchFilter(value);
    if (value != "" || " ") {
      let newArr = projects.filter((call) =>
        call.nomeDoContrato.toUpperCase().includes(value.toUpperCase())
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function handleOrderChange(value) {
    if (value == false) {
      setOrderFilter({ value: false, text: "ORDEM DECRESC" });
      let arr = filteredProjects.sort((a, b) => {
        return b.qtde - a.qtde;
      });
      setFilteredProjects(arr);
    } else if (value == true) {
      setOrderFilter({ value: true, text: "ORDEM CRESC" });
      let arr = filteredProjects.sort((a, b) => {
        return a.qtde - b.qtde;
      });
      setFilteredProjects(arr);
    }
  }
  function handleFilters() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function handleUpdates(id) {
    getProjects();
    let changedObj = projects.filter((project) => project._id == id);
    setModalProject(changedObj[0]);
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getProjects();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        getProjects();
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex justify-between gap-x-2 border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            BANCO DE DADOS
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <div
            onClick={() => handleOrderChange(!orderFilter.value)}
            className="bg-[#fead61] cursor-pointer p-2 hover:text-white hover:bg-[#15599a] font-bold rounded"
          >
            {orderFilter.text}
          </div>
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
          <input
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <button
            onClick={handleFilters}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded px-2 py-2  items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex  justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
            key={project._id}
            className="w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center mt-2 justify-between">
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">CIDADE</span>
                <p className="text-xs text-yellow-500">
                  {project.cidade && project.cidade}
                </p>
              </div>
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">VENDEDOR</span>
                <p className="text-xs text-[#15599a]">
                  {project.vendedor && project.vendedor.nome}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalDB
          project={modalProject}
          handleUpdates={handleUpdates}
          editor={
            credentials != {} &&
            [
              "Projetos",
              "Obras",
              "Suprimentos",
              "O&M",
              "Marketing",
              "Vendas",
              "Pós-Venda",
              "PPS",
              "InsideSales",
              "Financeiro",
              "ADM",
              "RH",
            ].every((el) => credentials.accessibleRoutes.includes(el))
              ? true
              : false
          }
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default BandoDeDados;
