import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Select from "react-select";
import { cidadesAtendidas } from "../../utils/constants";
import { AiOutlineSearch } from "react-icons/ai";
import ModalOeM from "../../components/ModalOeM";
function OeM({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    cidadeFilter: [],
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios.get("/api/projects/oem").then((res) => {
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
  function filterProjects() {
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
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getProjects();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (
          credentials.accessibleRoutes.includes("O&M") ||
          storedCredentials.accessibleRoutes.includes("O&M")
        )
          editor = true;
        else editor = false;
        getProjects();
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Projetos no estágio de operação e manutenção
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({filteredProjects.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            className="outline-none p-1.5 w-[250px] rounded border border-gray-200 placeholder:italic"
            placeholder="Digite o nome do contrato"
            value={searchFilter}
            onChange={(e) => handleSearchFilter(e.target.value)}
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
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {filteredProjects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
            key={project._id}
            className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">CIDADE</span>
                <p className="text-xs text-gray-600 uppercase">
                  {project.cidade ? project.cidade : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">TOPOLOGIA</span>
                <p className="text-xs text-center text-gray-600">
                  {project.projeto.topologia ? project.projeto.topologia : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">EQUIPE OBRAS</span>
                <p className="text-xs text-yellow-500">
                  {project.obra.equipeResp ? project.obra.equipeResp : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">USINA LIGADA</span>
                <p className="text-xs text-gray-600">
                  {project.conferencias.usinaLigada != undefined &&
                  project.conferencias.usinaLigada.status != "-"
                    ? project.conferencias.usinaLigada.status
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalOeM
          setModalIsOpen={setModalIsOpen}
          project={modalProject}
          editor={credentials.accessibleRoutes.includes("O&M") ? true : false}
        />
      )}
    </div>
  );
}

export default OeM;
