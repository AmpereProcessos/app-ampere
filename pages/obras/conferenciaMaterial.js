import axios from "axios";
import React, { useEffect, useState } from "react";
import MaterialCard from "../../components/MaterialCard";
import { useRouter } from "next/router";
function ConferenciaMaterial({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  function getProjects() {
    axios.get("/api/gestaoDeObras/material").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (
        !storedCredentials.accessibleRoutes.includes("Obras") &&
        !storedCredentials.accessibleRoutes.includes("Almoxarifado")
      ) {
        router.push("/");
      } else {
        getProjects();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (
          !storedCredentials.accessibleRoutes.includes("Obras") &&
          !storedCredentials.accessibleRoutes.includes("Almoxarifado")
        ) {
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
        <h1 className="text-[#fead61] font-bold text-xl pb-2">
          CONFERÊNCIA DE MATERIAL
        </h1>
      </div>
      <div className="flex gap-y-2 flex-col w-full flex-wrap">
        {filteredProjects.map((project) => (
          <MaterialCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default ConferenciaMaterial;
