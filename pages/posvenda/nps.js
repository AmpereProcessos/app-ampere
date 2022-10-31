import axios from "axios";
import React, { useEffect, useState } from "react";
import NPSCard from "../../components/NPSCard";

function NPS({ credentials, setCredentials }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function getProjects() {
    axios.get("/api/projects/nps").then((res) => {
      setFilteredProjects(res.data);
      setProjects(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Pós-Venda")) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Pós-Venda")) {
          router.push("/");
        } else {
          getProjects();
        }
      }
    }
  }, []);
  return (
    <div className="p-6 grow bg-[#fff]">
      <div className="flex w-full items-center border-b border-gray-200 mb-2">
        <h1 className="text-[#fead61] font-bold text-xl pb-2">COLETA DE NPS</h1>
      </div>
      <div className="flex flex-wrap mt-4 gap-3 flex-wrap justify-around">
        {filteredProjects.map((project) => (
          <NPSCard
            credentials={credentials}
            key={project._id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}

export default NPS;
