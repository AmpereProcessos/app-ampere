import dayjs from "dayjs";
import React, { useState } from "react";
import { vendedores } from "../utils/constants";
import SelectInput from "./SelectInput";
import { MdSend, MdSave } from "react-icons/md";
import axios from "axios";

function LeadCard({ lead, getLeads }) {
  const [vendedor, setVendedor] = useState(lead.vendedor);
  const [msg, setMsg] = useState({ text: "", color: "" });
  function saveChanges() {
    axios
      .put("/api/insideSales", {
        id: lead._id,
        changes: { vendedor: vendedor, dataEnvio: new Date() },
      })
      .then((res) => {
        setMsg({ text: "Alterações feitas!", color: "text-green-500" });
        getLeads();
      })
      .catch((err) =>
        setMsg({
          text: "Houve um erro no servidor, tente novamente",
          color: "text-red-500",
        })
      );
  }
  return (
    <div
      key={lead._id}
      className={`grid grid-rows-2 grid-cols-6 lg:grid-cols-9 gap-2  w-full border border-gray-200 p-3 hover:bg-blue-100 items-center`}
    >
      <p className="text-sm text-[#15599a] font-bold text-center">
        #{lead.codigoSVB} - {lead.nome?.toUpperCase()}
      </p>
      <div className="hidden lg:flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">
          RESPONSÁVEL
        </p>
        <p className="text-gray-600 text-center text-xs">{lead.responsavel}</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">TELEFONE</p>
        <p className="text-gray-600 text-center text-xs">{lead.telefone}</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">CIDADE</p>
        <p className="text-gray-600 text-center text-xs">
          {lead.cidade ? lead.cidade : "-"}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">
          DATA DE AQUISIÇÃO
        </p>
        <p className="text-gray-600 text-center text-xs">
          {lead.dataDeAquisicao
            ? dayjs(lead.dataDeAquisicao).format("DD/MM/YYYY")
            : "-"}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">
          DATA DE ENVIO
        </p>
        <p className="text-gray-600 text-center text-xs">
          {lead.dataDeEnvio
            ? dayjs(lead.dataDeEnvio).format("DD/MM/YYYY")
            : "-"}
        </p>
      </div>
      <div className="hidden lg:flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">
          TEMPO P/ENVIO
        </p>
        <p className="text-gray-600 text-center text-xs">
          {lead.dataDeAquisicao && lead.dataDeEnvio
            ? dayjs(lead.dataDeEnvio).diff(dayjs(lead.dataDeAquisicao), "day")
            : "-"}
        </p>
      </div>
      <div className="hidden lg:flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">CANAL</p>
        <p className="text-gray-600 text-center uppercase text-xs">
          {lead.canal ? lead.canal : "-"}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-600 text-center font-bold text-xs">CONSUMO</p>
        <p className="text-gray-600 text-center text-xs">
          {lead.consumo
            ? lead.consumo.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })
            : "-"}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center col-span-6 lg:col-span-9">
        {msg && <p className={`text-center italic ${msg.color}`}>{msg.text}</p>}
        <div className="flex gap-2">
          <SelectInput
            label={"VENDEDOR P/ENVIO"}
            editable={true}
            value={
              vendedores.filter((x) => x.nome == vendedor).length > 0
                ? vendedor
                : "NÃO DEFINIDO"
            }
            options={vendedores.map((vendedor) => {
              return { label: vendedor.nome, value: vendedor.nome };
            })}
            handleChange={(value) => setVendedor(value)}
          />
          <button
            onClick={saveChanges}
            className="p-1 rounded bg-blue-300 hover:bg-[#15599a] text-white font-bold text-xs flex items-center gap-2"
          >
            <p>{lead.vendedor ? "SALVAR" : "ENVIAR"}</p>
            {lead.vendedor ? (
              <MdSave style={{ color: "white" }} />
            ) : (
              <MdSend style={{ color: "white" }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadCard;
