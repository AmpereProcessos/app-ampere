import React from "react";

function ProjectCard({ openModal, info, setModalProject }) {
  return (
    <div
      onClick={() => {
        openModal();
        setModalProject(info);
      }}
      className="cursor-pointer flex flex-col hover:bg-blue-100 flex-col px-2 w-full gap-y-2 py-2 mt-2 border border-gray-300 rounded shadow-sm"
    >
      <div>
        <h1 className="font-bold text-sm text-zinc-700">
          <strong className="text-[#15599a]">{info.qtde}</strong> -{" "}
          {info.nomedoprojeto}
        </h1>
      </div>
      <div className="flex justify-around">
        <p className="text-xs text-gray-600">
          {info.cidade}/{info.uf}
        </p>
        <p className="text-xs text-gray-600">{info.vendedor}</p>
      </div>
    </div>
  );
}

export default ProjectCard;
