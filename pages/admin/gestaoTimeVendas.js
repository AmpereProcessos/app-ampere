import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { vendedores } from "../../utils/constants";
const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
const groupByVendedor = groupBy("vendedor");
function GestaoTimeDeVendas() {
  const { credentials } = useContext(AppContext);
  const [stats, setStats] = useState([]);
  function getStats() {
    axios.get("/api/stats/gestaoTimeVendas").then((res) => {
      let newArr = groupByVendedor(res.data);
      setStats(newArr);
    });
  }
  useEffect(() => {
    getStats();
  }, []);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex flex-col items-center pb-2 border-b border-[#15599a]">
        <h1 className="text-center text-[#15599a] font-bold">
          CONTROLE E GESTÃO DO TIME DE VENDAS
        </h1>
        <div className="flex flex-col my-2">
          <h1 className="text-center font-bold">
            POTÊNCIA VENDIDA POR MÊS POR VENDEDOR
          </h1>
          <div className="grid grid-cols-13 items-center border border-gray-200">
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              NOME
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JANEIRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              FEVEREIRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              MARÇO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              ABRIL
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              MAIO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JUNHO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              JULHO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              AGOSTO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              SETEMBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              OUTUBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white border-r border-white">
              NOVEMBRO
            </h1>
            <h1 className="p-1 bg-[#15599a] font-bold text-center text-white">
              DEZEMBRO
            </h1>
          </div>
          {vendedores.map((vendedor) => (
            <div className="grid grid-cols-13 items-center border border-gray-200">
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                {vendedor.nome}
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                -
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                -
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                MARÇO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                ABRIL
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                MAIO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                JUNHO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                JULHO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                AGOSTO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                SETEMBRO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                OUTUBRO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 border-r border-gray-200 h-[60px]">
                NOVEMBRO
              </div>
              <div className="p-1 font-bold flex items-center justify-center text-center text-xs bg-[#fff] text-gray-600 h-[60px]">
                DEZEMBRO
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GestaoTimeDeVendas;
