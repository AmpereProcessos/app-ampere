import React from "react";

function ProjectCard({ openModal }) {
  return (
    <div
      onClick={openModal}
      className="cursor-pointer flex flex-col px-2 w-full gap-y-2 py-2 mt-2 border border-gray-200 rounded shadow-lg"
    >
      <h1 className="font-bold text-sm text-zinc-700">João Alves Silva</h1>
    </div>
  );
}

export default ProjectCard;
