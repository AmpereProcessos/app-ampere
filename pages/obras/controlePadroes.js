import axios from "axios";
import React, { useEffect, useState } from "react";

function ControlePadroes({ setCredentials, credentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  function getProjects() {
    axios.get("/api/gestaoDeObras/padroes").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Obras")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Obras")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  console.log(projects);
  return (
    <div className="p-6 grow bg-[#fff]">
      <div className="flex w-full items-center border-b border-gray-200">
        <h1 className="text-[#fead61] font-bold text-xl pb-2">
          CONTROLE DE PADRÕES ({filteredProjects.length})
        </h1>
      </div>
      <div className="flex flex-col gap-y-2">
        {filteredProjects.map((project) => (
          <div className="w-full p-2 border border-[#15599a] rounded">
            <div className="flex items-center gap-x-2 justify-between border-b border-gray-200 pb-2">
              <h1 className="font-bold">
                <strong className="text-[#15599a]">{project.qtde} </strong>
                {project.nomeDoContrato}
              </h1>
              <div className="flex flex-wrap gap-y-2 items-center grow justify-around">
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    PAGAMENTO DO KIT
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.compra.statusLiberacao}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    CIDADE
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.cidade}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    BAIRRO
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.bairro}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    LOGRADOURO
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.logradouro}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    NÚMERO
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.numeroResidencia}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    TIPO DO PADRÃO
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.padrao?.tipo ? project.padrao.tipo : "-"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    RESP.PAGAMENTO DO PADRÃO
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.padrao?.respPagamento
                      ? project.padrao.respPagamento
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    RESP.INSTALAÇÃO DO PADRÃO
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.padrao?.respInstalacao
                      ? project.padrao.respInstalacao
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    VALOR DO PADRÃO
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.padrao?.valor ? project.padrao.valor : "-"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    SAIDA DO CLIENTE
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.visitaTecnica.saidaDoCliente
                      ? project.visitaTecnica.saidaDoCliente
                      : "-"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm uppercase text-[#15599a] font-bold">
                    AMPERAGEM
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    {project.visitaTecnica?.amperagem
                      ? project.visitaTecnica.amperagem
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-around mt-2">
              <div className="flex flex-col gap-y-1">
                <h1 className="font-bold">DIA DA MONTAGEM</h1>
                <input
                  className="border border-gray-200 outline-none p-1 rounded"
                  type="date"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ControlePadroes;
