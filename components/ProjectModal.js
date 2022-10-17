import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import ProjectCardComercial from "./ProjectCardComercial";
import ProjectCardProjetos from "./ProjectCardProjetos";
import ProjectCardSuprimentos from "./ProjectCardSuprimentos";
import ProjectCardObras from "./ProjectCardObras";
import TextInput from "./TextInput";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "40%",
  height: "50%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function ProjectModal({ closeModal, project, estagio }) {
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {project.qtde} - {project.nomeDoProjeto}
              </h1>
              <button>
                <VscChromeClose onClick={closeModal} style={{ color: "red" }} />
              </button>
            </div>
            {estagio == "Comercial" && <ProjectCardComercial info={project} />}
            {estagio == "Suprimentos" && (
              <ProjectCardSuprimentos info={project} />
            )}
            {estagio == "Projetos" && <ProjectCardProjetos info={project} />}
            {estagio == "Obras" && <ProjectCardObras info={project} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectModal;
