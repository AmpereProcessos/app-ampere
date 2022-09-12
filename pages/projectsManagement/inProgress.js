import React, { useState } from "react";
import ProjectList from "../../components/ProjectList";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ProjectModal from "../../components/ProjectModal";
function InProgress() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  function handleOpenModal() {
    setModalIsOpen(true);
  }
  return (
    <>
      <div className="flex flex-col bg-gray-100 grow p-6 w-full">
        <div className="grid lg:grid-cols-5 lg:grid-rows-1 grid-rows-5 grid-cols-1  w-full px-6 py-2 gap-4 mt-5">
          <ProjectList title={"Comercial"} openModal={handleOpenModal} />
          <ProjectList title={"Suprimentos"} openModal={handleOpenModal} />
          <ProjectList title={"Projetos"} openModal={handleOpenModal} />
          <ProjectList title={"Obras"} openModal={handleOpenModal} />
          <ProjectList title={"Suporte"} openModal={handleOpenModal} />
        </div>
      </div>
      <ProjectModal open={modalIsOpen} setModalIsOpen={setModalIsOpen} />
    </>
  );
}

export default InProgress;
