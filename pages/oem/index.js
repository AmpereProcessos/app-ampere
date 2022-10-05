import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ModalOeM from "../../components/ModalOeM";
function OeM({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects() {
    axios
      .get("/api/projects/filteredByStage")
      .then((res) => setProjects(res.data.oem));
  }
  useEffect(() => {
    if (Object.keys(credentials).length != 0) {
      if (credentials.accessibleRoutes.includes("O&M")) {
        getProjects();
      } else {
        router.push("/");
      }
    }
  }, []);
  console.log(projects);
  return (
    <div className="p-6 grow">
      <div className="flex items-center gap-x-2 border-b border-gray-200 p-1">
        <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
          Projetos no estágio de operação e manutenção
        </p>
        <p className="font-raleway font-bold text-[#fead61]">
          ({projects.length})
        </p>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {projects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
            key={project._id}
            className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomedocontrato}</p>
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
                  {project.topologia ? project.topologia : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">EQUIPE OBRAS</span>
                <p className="text-xs text-yellow-500">
                  {project.equipeexec ? project.equipeexec : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">USINA LIGADA</span>
                <p className="text-xs text-gray-600">
                  {project.usinaligada != undefined &&
                  project.usinaligada != "-"
                    ? project.usinaligada
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
