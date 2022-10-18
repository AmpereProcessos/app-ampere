import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PosVendaCard from "../../components/PosVendaCard";
function Posvenda({ credentials, setCredentials }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  function getProjects() {
    axios.get("/api/projects/posvenda").then((res) => {
      setProjects(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getProjects();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        getProjects();
      }
    }
  }, []);
  return (
    <div className="p-6 grow">
      <div className="flex items-center gap-x-2 border-b border-gray-200 p-1">
        <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
          Projetos em jornada
        </p>
        <p className="font-raleway font-bold text-[#fead61]">
          ({projects.length})
        </p>
      </div>
      <div className="flex overflow-y-auto overscroll-y-auto justify-around gap-3 mt-4 flex-wrap">
        {projects?.map((project) => (
          <PosVendaCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default Posvenda;
