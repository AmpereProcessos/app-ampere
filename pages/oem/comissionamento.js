import axios from "axios";
import React, { useEffect, useState } from "react";

function Comissionamento() {
  const [projects, setProjects] = useState([]);
  function getProjects() {
    axios
      .get("/api/projects/comissionamentoPosObra")
      .then((res) => setProjects(res.data));
  }
  useEffect(() => {
    getProjects();
  }, []);
  return (
    <div className="p-6 grow flex flex-col">
      <div className="flex flex-col py-2 border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold">COMISSIONAMENTO PÓS-OBRA</h1>
      </div>
    </div>
  );
}

export default Comissionamento;
