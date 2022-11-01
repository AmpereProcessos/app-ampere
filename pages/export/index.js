import axios from "axios";
import React, { useEffect, useState } from "react";

function Export() {
  const [projects, setProjects] = useState([]);
  function getData() {
    axios
      .get("/api/export", { timeout: 15000, keepAlive: true })
      .then((res) => setProjects(res.data));
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-6 grow flex flex-col">
      {projects?.map((project) => (
        <div key={project._id}>{project.nomeDoContrato}</div>
      ))}
    </div>
  );
}

export default Export;
