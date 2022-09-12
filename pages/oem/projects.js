import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { MdManageAccounts } from "react-icons/md";
import { useRouter } from "next/router";
import { validateAuth } from "../../utils/functions";
const acessKey = "O&M";
function Projects(props) {
  const [projects, setProjects] = useState([]);
  const router = useRouter();
  function fetchProjects() {
    axios.get("/api/o&m/projects").then((res) => setProjects(res.data));
  }
  const plans = [
    {
      id: 0,
      text: "Não definido",
    },
    { id: 1, text: "Manutenção simples" },
    { id: 2, text: "Plano Sol" },
    {
      id: 3,
      text: "Plano Sol+",
    },
  ];
  return (
    <div className="grow bg-[#15599a]">
      <h1 className="text-center text-white text-2xl uppercase font-bold my-4">
        Controle de Projetos
      </h1>
      <div className="overflow-x-auto relative px-12">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Nome do cliente
              </th>
              <th scope="col" className="py-3 px-4">
                Cidade
              </th>
              <th scope="col" className="hidden xl:table-cell py-3 px-4">
                Número de módulos
              </th>
              <th scope="col" className="hidden xl:table-cell py-3 px-4">
                Potência dos módulos
              </th>
              <th scope="col" className="hidden md:table-cell py-3 px-4">
                Plano adquirido
              </th>
              <th scope="col" className="hidden md:table-cell py-3 px-4">
                Atendente
              </th>
              <th scope="col" className="py-3 px-6">
                Responsável
              </th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((p) => (
              <tr
                key={p._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {p.projectInfo.clientName}
                </td>
                <td className="py-4 px-4">{p.projectInfo.clientCity}</td>
                <td className="hidden xl:table-cell py-4 px-4">
                  {p.projectInfo.modulesQty}
                </td>
                <td className="hidden xl:table-cell py-4 px-4">
                  {p.projectInfo.modulesPot}
                </td>
                <td className="hidden md:table-cell py-4 px-4">
                  {plans[p.projectInfo.selectedPlan].text}
                </td>
                <td className="hidden md:table-cell py-4 px-4">
                  {p.projectInfo.attendant}
                </td>
                <td className="py-4 px-4">{p.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Projects;
