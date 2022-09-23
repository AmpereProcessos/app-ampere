import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
function Suprimentos({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  function getProjects() {
    axios.get("/api/projects/filteredByStage").then((res) => {
      setProjects(res.data.suprimentos);
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
      <div className="flex justify-between border-b border-gray-200 p-1">
        <div className="flex items-center">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-ralewayBlack">
            Projetos no estágio de suprimentos
          </p>
          <p className="font-raleway font-bold text-[#fead61]">
            ({projects.length})
          </p>
        </div>
        <div className="flex">
          <div>
            <button>STATUS PAGAMENTO</button>
          </div>
        </div>
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
                <p className="text-xs text-gray-600">
                  {project.statuscontrato ? project.statuscontrato : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">LIBERACÃO DE CRÉDITO</span>
                <p className="text-xs text-center text-gray-600">
                  {project.statusliberacaocredito
                    ? project.statusliberacaocredito
                    : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">FORNECEDOR</span>
                <p className="text-xs text-yellow-500">
                  {project.fornecedor ? project.fornecedor : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">STATUS ENTREGA</span>
                <p className="text-xs text-gray-600">
                  {project.statusentrega ? project.statusentrega : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suprimentos;
