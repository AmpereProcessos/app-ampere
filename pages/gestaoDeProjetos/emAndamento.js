import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectList from "../../components/ProjectList";
import ProjectModal from "../../components/ProjectModal";
import connectToDatabase from "../../utils/projectsDb";
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
export async function getServerSideProps(context) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("data");
  let comercial = await collection
    .aggregate([
      {
        $match: {
          statuscontrato: { $ne: "RECISÃO DE CONTRATO" },
          statuspagamento: { $in: ["AGUARDANDO PAGAMENTO", null] },
        },
      },
    ])
    .toArray();
  let suprimentos = await collection
    .aggregate([
      {
        $match: {
          statusentrega: {
            $in: ["EM ROTA", "AGUARDANDO COMPRA", "", null],
          },
          statuscontrato: "ASSINADO",
        },
      },
    ])
    .toArray();
  let projetos = await collection
    .aggregate([
      {
        $match: {
          projetoconcluido: { $ne: "SIM" },
          iniciarprojeto: "SIM",
        },
      },
    ])
    .toArray();
  let obras = await collection
    .aggregate([
      {
        $match: {
          statusobra: {
            $in: ["AGENDADA", "AGUARDANDO AGENDAMENTO", "EM ANDAMENTO"],
          },
          statuscontrato: "ASSINADO",
        },
      },
    ])
    .toArray();
  return {
    props: {
      comercial,
      suprimentos,
      projetos,
      obras,
    }, // will be passed to the page component as props
  };
}
