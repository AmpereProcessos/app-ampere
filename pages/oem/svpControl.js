import axios from "axios";
import React, { useState, useEffect } from "react";

function SvpControl({ credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  function getProjects() {
    axios.get("/api/o&m/svpControl").then((res) => {
      console.log(res.data);
      setProjects(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("O&M")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("O&M")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col">
        <div className="flex items-center gap-x-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            CLIENTES SVP
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          {projects?.map((project) => (
            <div
              key={project._id}
              className="flex justify-between w-full p-2 border border-gray-200 shadow-lg"
            >
              <h1 className="text-[#15599a] font-bold">
                ({project.qtde}) {project.nomeDoContrato}
              </h1>
              <h1>{project.email}</h1>
              <h1>{project.telefone}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SvpControl;
