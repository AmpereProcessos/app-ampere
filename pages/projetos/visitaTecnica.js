import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function VisitaTecnica({ credentials, setCredentials }) {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  function getProjects() {
    axios.get("/api/solicitacoes/visitaTecnica").then((res) => {
      setFilteredForms(res.data);
      setForms(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Projetos")) {
        router.push("/");
      } else {
        getProjects(storedCredentials);
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Projetos")) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow bg-[#fff] flex flex-col">
      <div className="flex items-center w-full">
        <h1 className="pb-2 border-b border-gray-200 text-[#fead61] text-xl font-bold w-full">
          FORMULÁRIOS DE VISITA TÉCNICA
        </h1>
      </div>
      <div className="flex flex-wrap justify-around gap-3 mt-4">
        {filteredForms.map((form) => (
          <div
            key={form._id}
            className="w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-center">
              <p className="text-xs text-[#15599a] font-bold text-center">
                {form.nomeDoCliente}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-xxs text-gray-700">CIDADE</p>
                <p className="text-xs text-gray-700 font-bold">{form.cidade}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-xxs text-gray-700">VENDEDOR</p>
                <p className="text-xs text-gray-700 font-bold">
                  {form.nomeVendedor}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisitaTecnica;
