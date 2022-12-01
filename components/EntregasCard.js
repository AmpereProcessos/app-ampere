import axios from "axios";
import React, { useState } from "react";

function EntregasCard({ project }) {
  const [prevEntrega, setPrevEntrega] = useState(
    project.compra.previsaoEntrega
  );
  const [dataEntrega, setDataEntrega] = useState(project.compra.dataEntrega);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  async function handleChanges() {
    axios
      .post(`/api/projects/update/${project._id}`, {
        "compra.previsaoEntrega": prevEntrega,
        "compra.dataEntrega": dataEntrega,
      })
      .then((res) => {
        setMsg({ text: "Alterações feitas", color: "text-green-500" });
      })
      .catch((err) =>
        setMsg({
          text: "Um erro ocorreu, por favor tente novamente",
          color: "text-red-500",
        })
      );
  }
  return (
    <>
      <div className="grid grid-cols-6 lg:grid-cols-10 gap-2 p-1 border border-gray-200 items-center">
        <p className="text-[#15599a] font-bold col-span-2 text-center">
          #{project.qtde} - {project.nomeDoContrato}
          {project.compra.fornecedor
            ? ` - (${project.compra.fornecedor})`
            : false}
        </p>
        <div className="flex flex-col items-center col-span-1">
          <p className="text-gray-600 text-xs">NºMÓDULOS</p>
          <p className="text-gray-600 text-xs">
            {project.sistema?.qtdeModulos}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-center col-span-2">
          <p className="text-gray-600 text-xs">FATURAMENTO</p>
          <p
            className={`text-gray-600 ${
              project.faturamento?.previsaoFaturamento?.length > 70
                ? "text-xxs font-bold"
                : "text-xs"
            } uppercase text-center`}
          >
            {project.faturamento?.previsaoFaturamento
              ? project.faturamento?.previsaoFaturamento
              : "-"}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-center col-span-2">
          <p className="text-gray-600 text-xs">RASTREIO</p>
          <div className="w-full text-center">
            <p
              className={`text-gray-600 max-w-full break-words ${
                project.compra?.rastreio?.length > 70
                  ? "text-xxs font-bold"
                  : "text-xxs"
              } uppercase text-center`}
            >
              {project.compra?.rastreio ? project.compra?.rastreio : "-"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <p className="text-gray-600 text-xs">PREV.ENTREGA</p>
          <input
            value={
              prevEntrega ? new Date(prevEntrega).toISOString().slice(0, 10) : 0
            }
            onChange={(e) => {
              console.log(e.target.value);
              setPrevEntrega(
                isNaN(e.target.value)
                  ? new Date(e.target.value).toISOString()
                  : null
              );
            }}
            type="date"
            className="outline-none text-xs"
          />
        </div>
        <div className="flex flex-col items-center col-span-1">
          <p className="text-gray-600 text-xs">DATA ENTREGA</p>
          <input
            value={
              dataEntrega ? new Date(dataEntrega).toISOString().slice(0, 10) : 0
            }
            onChange={(e) => {
              console.log(e.target.value);
              setDataEntrega(
                isNaN(e.target.value)
                  ? new Date(e.target.value).toISOString()
                  : null
              );
            }}
            type="date"
            className="outline-none text-xs"
          />
        </div>
        <div className="flex justify-center items-center col-span-1">
          <button
            onClick={handleChanges}
            className="p-1 text-white rounded text-sm font-bold bg-blue-400 hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
      {msg.text && (
        <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
      )}
    </>
  );
}

export default EntregasCard;
