import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectList from "../../components/ProjectList";
import ProjectModal from "../../components/ProjectModal";
function InProgress({ setCredentials, credentials }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [InProgressProjects, setProjects] = useState({
    comercialPhase: [],
    supplyPhase: [],
    projectPhase: [],
    installPhase: [],
    suportPhase: [],
  });
  const [modalProject, setModalProject] = useState({});
  function handleOpenModal() {
    setModalIsOpen(true);
  }
  function getData() {
    axios.get("/api/projects/filteredByStage").then((res) =>
      setProjects({
        ...InProgressProjects,
        comercialPhase: res.data.comercial,
        supplyPhase: res.data.suprimentos,
        projectPhase: res.data.projetos,
        installPhase: res.data.obras,
      })
    );
  }

  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getData();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        getData();
      }
    }
  }, []);
  return (
    <>
      <div className="flex flex-col bg-gray-100 grow p-6 w-full">
        <div className="grid lg:grid-cols-4 lg:grid-rows-1 grid-rows-4 grid-cols-1  w-full px-6 py-2 gap-4 mt-5">
          <ProjectList
            setModalProject={setModalProject}
            title={"Comercial"}
            projects={InProgressProjects.comercialPhase}
            openModal={handleOpenModal}
          />
          <ProjectList
            setModalProject={setModalProject}
            projects={InProgressProjects.supplyPhase}
            title={"Suprimentos"}
            openModal={handleOpenModal}
          />
          <ProjectList
            setModalProject={setModalProject}
            projects={InProgressProjects.projectPhase}
            title={"Projetos"}
            openModal={handleOpenModal}
          />
          <ProjectList
            setModalProject={setModalProject}
            projects={InProgressProjects.installPhase}
            title={"Obras"}
            openModal={handleOpenModal}
          />
        </div>
      </div>
      <ProjectModal
        project={modalProject}
        open={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
    </>
  );
}

export default InProgress;
