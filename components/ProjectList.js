import React from "react";
import ProjectCard from "./ProjectCard";

function ProjectList({ title, openModal }) {
  return (
    <div className="flex flex-col lg:max-h-[550px] max-h-[150px] py-2 overflow-y-auto overscroll-y-auto items-center pt-2 px-1 grow bg-white h-full rounded shadow-2xl">
      <div className="border-b pb-2 h-fit w-full text-center border-blue-300 text-xl font-bold">
        <h1>{title}</h1>
      </div>
      <div className="w-full">
        <ProjectCard openModal={openModal} />
        <ProjectCard openModal={openModal} />
        <ProjectCard openModal={openModal} />
        <ProjectCard openModal={openModal} />
        <ProjectCard openModal={openModal} />
      </div>
    </div>
  );
}

export default ProjectList;
