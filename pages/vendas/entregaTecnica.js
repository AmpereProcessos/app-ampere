import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { TbToggleLeft, TbToggleRight } from "react-icons/tb";
import { AiOutlineSearch } from "react-icons/ai";
import EntregaTecnicaPresencialCard from "../../components/EntregaTecnicaPresencialCard";
import { AppContext } from "../../context/AppContext";

function EntregaTecnica() {
  const { credentials } = useContext(AppContext);

  const [projects, setProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState();

  const [filters, setFilters] = useState({
    overdue: false,
  });
  async function getProjects() {
    try {
      if (credentials.visualizacao == "VENDEDOR") {
        var { data } = await axios.get(
          `/api/projects/entregaTecnica?vendedor=${credentials.vendedor}`
        );
      } else {
        var { data } = await axios.get(`/api/projects/entregaTecnica`);
      }

      setProjects(data);
      setFilteredProjects(data);
      return;
    } catch (error) {
      console.log(error);
      alert("Erro na comunicação com o servidor");
      return;
    }
  }
  function filterProjects() {
    var newArr;
    if (filters.overdue) {
      if (!newArr) newArr = projects;
      newArr = newArr.filter(
        (project) => dayjs().diff(new Date(project.medidor.data), "days") > 40
      );
    }
    if (!newArr) {
      setFilteredProjects(projects);
      return projects;
    } else {
      setFilteredProjects(newArr);
      return newArr;
    }
  }
  useEffect(() => {
    getProjects();
  }, []);
  return (
    <div className="p-6 grow">
      <div className="pb-2 border-b border-gray-200 flex flex-col">
        <h1 className="text-center text-[#15599a] text-xl font-bold">
          ENTREGAS TÉCNICAS PENDENTES ({filteredProjects?.length})
        </h1>
        <div className="w-full flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setFilters((prevState) => {
                return { ...prevState, overdue: !prevState.overdue };
              });
            }}
            className={`flex items-center gap-2 rounded text-white p-2 h-[36px] font-bold shadow-md ${
              filters.overdue ? "bg-red-500" : "bg-[#15599a]"
            }`}
          >
            {filters.overdue ? (
              <>
                <p>PENDENTES</p> <TbToggleRight style={{ fontSize: "25px" }} />
              </>
            ) : (
              <>
                <p>EM ABERTO</p> <TbToggleLeft style={{ fontSize: "25px" }} />
              </>
            )}
          </button>
          <button
            onClick={filterProjects}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] h-[36px] font-bold rounded px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-4 gap-2">
        {filteredProjects ? (
          filteredProjects.map((project) => (
            <EntregaTecnicaPresencialCard key={project._id} info={project} />
          ))
        ) : (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntregaTecnica;
