import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectList from "../../components/ProjectList";
import ProjectModal from "../../components/ProjectModal";
import connectToDatabase from "../../utils/projectsDb";
function InProgress({ setCredentials, credentials, data }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({
    estagio: "",
    projeto: {},
  });
  const [InProgressProjects, setProjects] = useState({
    comercialPhase: data.comercial,
    supplyPhase: data.suprimentos,
    projectPhase: data.projetos,
    installPhase: data.obras,
    suportPhase: [],
  });
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      }
    }
  }, []);
  return (
    <>
      <div className="flex flex-col bg-gray-100 grow p-6 w-full">
        <div className="grid lg:grid-cols-4 lg:grid-rows-1 grid-rows-4 grid-cols-1  w-full px-6 py-2 gap-4 mt-5">
          <ProjectList
            handleOpenModal={() => setModalIsOpen(true)}
            setModalProject={setModalProject}
            title={"Comercial"}
            projects={InProgressProjects.comercialPhase}
          />
          <ProjectList
            handleOpenModal={() => setModalIsOpen(true)}
            setModalProject={setModalProject}
            projects={InProgressProjects.supplyPhase}
            title={"Suprimentos"}
          />
          <ProjectList
            handleOpenModal={() => setModalIsOpen(true)}
            setModalProject={setModalProject}
            projects={InProgressProjects.projectPhase}
            title={"Projetos"}
          />
          <ProjectList
            handleOpenModal={() => setModalIsOpen(true)}
            setModalProject={setModalProject}
            projects={InProgressProjects.installPhase}
            title={"Obras"}
          />
        </div>
        {modalIsOpen && (
          <ProjectModal
            closeModal={() => setModalIsOpen(false)}
            estagio={modalProject.estagio}
            project={modalProject.projeto}
          />
        )}
      </div>
    </>
  );
}

export default InProgress;
export async function getServerSideProps(context) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  let comercial = await collection
    .aggregate([
      {
        $match: {
          "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
          "obra.statusDaObra": {
            $in: [
              "AGENDADA",
              "AGUARDANDO AGENDAMENTO",
              "EM ANDAMENTO",
              "NÃO DEFINIDO",
              "CASA EM CONSTRUÇÃO",
              "",
              null,
              undefined,
            ],
          },
        },
      },
    ])
    .toArray();
  let suprimentos = await collection
    .aggregate([
      {
        $match: {
          "compra.statusEntrega": {
            $in: [
              "EM ROTA",
              "AGUARDANDO COMPRA",
              "",
              null,
              undefined,
              " ",
              "NÃO DEFINIDO",
            ],
          },
          "contrato.status": "ASSINADO",
        },
      },
    ])
    .toArray();
  let projetos = await collection
    .aggregate([
      {
        $match: {
          "projeto.projetoConcluido": { $ne: "SIM" },
          $or: [
            { "compra.statusLiberacao": "PAGO" },
            { "projeto.iniciar": "SIM" },
          ],
        },
      },
    ])
    .toArray();
  let obras = await collection
    .aggregate([
      {
        $match: {
          "obra.statusDaObra": {
            $in: [
              "AGENDADA",
              "AGUARDANDO AGENDAMENTO",
              "EM ANDAMENTO",
              "CASA EM CONSTRUÇÃO",
              null,
              undefined,
              "",
              " ",
              "NÃO DEFINIDO",
            ],
          },
          "contrato.status": "ASSINADO",
        },
      },
    ])
    .toArray();
  comercial = JSON.parse(JSON.stringify(comercial));
  suprimentos = JSON.parse(JSON.stringify(suprimentos));
  projetos = JSON.parse(JSON.stringify(projetos));
  obras = JSON.parse(JSON.stringify(obras));
  return {
    props: { data: { comercial, suprimentos, projetos, obras } }, // will be passed to the page component as props
  };
}
