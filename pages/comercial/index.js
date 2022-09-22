import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
function Comercial({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  function getProjects() {
    axios.get("/api/projects/filteredByStage").then((res) => {
      setProjects(res.data.comercial);
    });
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
  console.log(projects);
  return (
    <div className="p-6 grow">
      <div className="flex items-center gap-x-2 border-b border-gray-200 p-1">
        <p className="font-bold uppercase text-2xl text-[#15599a] font-ralewayBlack">
          Projetos no estágio comercial
        </p>
        <p className="font-raleway font-bold text-[#fead61]">
          ({projects.length})
        </p>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {projects.map((project) => (
          <div
            key={project._id}
            className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomedocontrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">CONTRATO</span>
                <p className="text-xs text-yellow-500">
                  {project.statuscontrato && project.statuscontrato}
                </p>
              </div>
              <div>
                <span className="text-xxs">PAGAMENTO</span>
                <p className="text-xs text-gray-600">
                  {project.formapagamento && project.formapagamento}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comercial;
