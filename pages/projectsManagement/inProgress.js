import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectList from "../../components/ProjectList";
import ProjectModal from "../../components/ProjectModal";
function InProgress() {
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
  useEffect(() => {
    axios
      .get("/api/inProgressInfo")
      .then((res) =>
        setProjects({ ...InProgressProjects, supplyPhase: res.data })
      );
  }, []);
  return (
    <>
      <div className="flex flex-col bg-gray-100 grow p-6 w-full">
        <div className="grid lg:grid-cols-5 lg:grid-rows-1 grid-rows-5 grid-cols-1  w-full px-6 py-2 gap-4 mt-5">
          <ProjectList
            setModalProject={setModalProject}
            title={"Comercial"}
            openModal={handleOpenModal}
          />
          <ProjectList
            setModalProject={setModalProject}
            title={"Suprimentos"}
            openModal={handleOpenModal}
          />
          <ProjectList
            setModalProject={setModalProject}
            title={"Projetos"}
            openModal={handleOpenModal}
          />
          <ProjectList
            setModalProject={setModalProject}
            projects={InProgressProjects.supplyPhase}
            title={"Obras"}
            openModal={handleOpenModal}
          />
          <ProjectList
            setModalProject={setModalProject}
            title={"Suporte"}
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
