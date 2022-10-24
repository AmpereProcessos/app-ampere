import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PosVendaCard from "../../components/PosVendaCard";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
function Posvenda({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    noContactFilter: false,
    cidadeFilter: [],
    vendedorFilter: [],
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [cardMode, setCardMode] = useState(true);
  function getDateDiff(date1, date2) {
    const diffInMs = new Date(date1) - new Date(date2);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays;
  }
  function getProjects() {
    axios.get("/api/projects/posvenda").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
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
  function filterByNoRecentContact(state) {
    setFilters({ ...filters, noContactFilter: state });
    if (state == true) {
      let newArr = projects.filter(
        (project) =>
          project.jornada?.dataUltimoContato == undefined ||
          getDateDiff(new Date(), new Date(project.jornada.dataUltimoContato)) >
            7
      );
      setFilteredProjects(newArr);
    } else {
      setFilteredProjects(projects);
    }
  }
  function filterProjects() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.cidadeFilter.includes(call.cidade)
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter((call) =>
        filters.vendedorFilter.includes(call.vendedor.nome)
      );
    }
    if (!newArr) setFilteredProjects(projects);
    else {
      setFilteredProjects(newArr);
    }
  }
  function ordenate() {
    let arr = filteredProjects.sort(
      (a, b) =>
        new Date(b.jornada.dataUltimoContato) -
        new Date(a.jornada.dataUltimoContato)
    );
    console.log(arr);
    setFilteredProjects(arr);
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
      <div className="flex items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Projetos em jornada
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 items-center">
          <button
            onClick={() => setCardMode(!cardMode)}
            className="font-bold bg-[#15599a] w-fit h-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
          >
            {cardMode ? "MODO CARD" : "MODO LISTA"}
          </button>
          <button
            onClick={() => filterByNoRecentContact(!filters.noContactFilter)}
            className="font-bold bg-[#15599a] w-fit h-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
          >
            SEM CONTATO RECENTE
          </button>
          <button
            onClick={ordenate}
            className="font-bold bg-[#15599a] w-fit h-fit text-white hover:bg-[#fead61] hover:text-black p-2 rounded"
          >
            ORDENAR
          </button>
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
          <input
            className="outline-none p-1.5 w-[300px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
          />
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects?.map((project, index) => (
          <div className="w-full flex justify-center" key={index}>
            {cardMode ? (
              <PosVendaCard
                getUpdates={getProjects}
                key={project._id}
                project={project}
              />
            ) : (
              <div
                className="flex justify-between w-1/2 border border-gray-200 p-3 hover:bg-blue-100"
                key={index}
              >
                <p className="text-center font-bold">
                  {project.nomeDoContrato}
                </p>
                <p className="text-center">
                  {project.jornada.dataUltimoContato
                    ? new Date(
                        project.jornada?.dataUltimoContato
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posvenda;
