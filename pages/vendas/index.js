import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalVendas from "../../components/ModalVendas";
import axios from "axios";
const statusStyles = {
  ASSINADO: {
    textColor: "text-green-500",
  },
  "NÃO ASSINADO": {
    textColor: "text-red-500",
  },
  SOLICITADO: {
    textColor: "text-yellow-500",
  },
};
function Vendas({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({});
  function getProjects(credenciais) {
    console.log("FUI CHAMADO");
    axios
      .post("/api/projects/vendas", {
        vendedor: credenciais.vendedor,
      })
      .then((res) => {
        setProjects(res.data);
      });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Vendas")) {
        router.push("/");
      } else {
        getProjects(storedCredentials);
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Vendas")) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  console.log(projects);
  return (
    <div className="p-6 flex flex-col grow bg-[#fff]">
      <div className="flex border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-xl">SEUS CLIENTES</h1>
      </div>
      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {projects.map((project) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalProject(project);
            }}
            key={project._id}
            className={`w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{project.qtde}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">CONTRATO</span>
                <p
                  className={`text-xs ${
                    statusStyles[project.contrato?.status]
                      ? statusStyles[project.contrato.status].textColor
                      : ""
                  }`}
                >
                  {project.contrato?.status && project.contrato?.status}
                </p>
              </div>
              <div className="text-end">
                <span className="text-xxs text-end">PAGAMENTO</span>
                <p className="text-xs text-center text-gray-600">
                  {project.pagamento.status ? project.pagamento.status : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">STATUS OBRA</span>
                <p className={`text-[#fead61] text-xs uppercase`}>
                  {project.obra.statusDaObra ? project.obra.statusDaObra : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">VISTORIA</span>
                <p className="text-xs text-gray-600 text-center">
                  {project.vistoria.status ? project.vistoria.status : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalVendas
          project={modalProject}
          credenciais={credentials}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default Vendas;
