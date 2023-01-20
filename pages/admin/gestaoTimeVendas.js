import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
function GestaoTimeDeVendas() {
  const { credentials } = useContext(AppContext);
  const [stats, setStats] = useState([]);
  function getStats() {
    axios.get("/api/stats/gestaoTimeVendas").then((res) => setStats(res.data));
  }
  useEffect(() => {
    getStats();
  }, []);
  console.log(stats);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex flex-col items-center pb-2 border-b border-[#15599a]">
        <h1 className="text-center text-[#15599a] font-bold">
          CONTROLE E GESTÃO DO TIME DE VENDAS
        </h1>
      </div>
    </div>
  );
}

export default GestaoTimeDeVendas;
