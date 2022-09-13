import React from "react";
import ProjectCard from "./ProjectCard";

function ProjectList({ title, openModal, projects, setModalProject }) {
  return (
    <div className="flex flex-col border border-gray-200 lg:max-h-[550px] max-h-[150px] py-2 overflow-y-auto overscroll-y-auto items-center pt-2 px-1 grow bg-white h-full rounded shadow-2xl">
      <div className="border-b pb-2 h-fit w-full text-center border-blue-300 text-xl font-bold">
        <h1>{title}</h1>
      </div>
      <div className="w-full">
        {projects?.map((project) => (
          <ProjectCard
            key={project._id}
            setModalProject={setModalProject}
            info={project}
            openModal={openModal}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
