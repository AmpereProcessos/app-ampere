import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
function ControleDeOSs() {
  const { credentials } = useContext(AppContext);
  return (
    <div className="p-6 grow bg-[#fff]">
      <div className="flex flex-col items-center">
        <h1 className="text-[#15599a] font-bold text-xl">
          {credentials.visualizacao == "OBRAS" ? "MINHAS OSs" : "OSs EM ABERTO"}
        </h1>
      </div>
    </div>
  );
}

export default ControleDeOSs;
