import React, { useState } from "react";

function Comissao() {
  const [projects, setProjects] = useState([]);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="py-2 border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-xl">COMISSÕES</h1>
      </div>
    </div>
  );
}

export default Comissao;
