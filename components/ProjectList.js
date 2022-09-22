import React from "react";
import ProjectCard from "./ProjectCard";

function ProjectList({ title, openModal, projects, setModalProject }) {
  return (
    <div className="flex flex-col w-full border border-gray-200 lg:max-h-[550px] max-h-[150px] py-2 items-center pt-2 px-1 grow bg-white h-full rounded shadow-2xl">
      <div className="flex gap-x-2 px-2 items-center justify-center border-b pb-2 h-fit w-full border-blue-300 text-xl font-bold">
        <h1>{title}</h1>
        <p className="text-sm text-[#fead61]">{projects.length}</p>
      </div>
      <div className="w-full overflow-y-auto overscroll-y-auto">
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
