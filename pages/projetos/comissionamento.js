import axios from "axios";
import React, { useEffect, useState } from "react";
import ComissionamentoCard from "../../components/ComissionamentoCard";

function Comissionamento({ credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  function getProjects() {
    axios.get("/api/projects/comissionamento").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Projetos")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Projetos")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);

  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            Comissionamento
          </p>
        </div>
        <div className="flex items-center">
          <div
            onClick={() =>
              setFilters({
                ...filters,
                manutencaoAtrasada: !filters.manutencaoAtrasada,
              })
            }
            className={`${
              filters.manutencaoAtrasada ? "bg-[#15599a]" : "bg-blue-300"
            } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
          >
            PENDENCIA COMERCIAL
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-3 mt-4 ">
        {filteredProjects.map((project) => (
          <ComissionamentoCard
            getProjects={getProjects}
            credentials={credentials}
            key={project._id}
            info={project}
          />
        ))}
      </div>
    </div>
  );
}

export default Comissionamento;
