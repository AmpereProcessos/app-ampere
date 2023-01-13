import dayjs from "dayjs";
import React, { useState } from "react";
import { vendedores } from "../utils/constants";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { MdSend, MdSave } from "react-icons/md";
import axios from "axios";
import NumberInput from "./NumberInput";
function phoneMask(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}
function LeadCard({ lead, getLeads }) {
  const [infoHolder, setInfo] = useState(lead);
  const [msg, setMsg] = useState({ text: "", color: "" });
  function saveChanges() {
    axios
      .put("/api/insideSales", {
        id: lead._id,
        changes: {
          ...infoHolder,
          dataDeEnvio:
            infoHolder.vendedor != lead.vendedor
              ? new Date()
              : lead.dataDeEnvio,
        },
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
      className={`flex flex-col w-full border border-gray-200 p-3 hover:bg-blue-100 items-center`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-8 items-center border-b border-gray-200 pb-1 w-full">
        <p className="text-sm text-[#15599a] font-bold text-center">
          #{lead.codigoSVB} - {lead.nome?.toUpperCase()}
        </p>
        <div className="hidden lg:block">
          <SelectInput
            label="RESPONSÁVEL"
            labelColor="text-gray-600"
            widthFit={true}
            editable={true}
            value={infoHolder.responsavel}
            options={[
              { label: "DÁFINY VILLANO", value: "DÁFINY VILLANO" },
              { label: "DEVISSON LIMA", value: "DEVISSON LIMA" },
              { label: "LEANDRO VIALI", value: "LEANDRO VIALI" },
            ]}
            handleChange={(value) =>
              setInfo({ ...infoHolder, responsavel: value })
            }
          />
        </div>
        <div className="hidden lg:block">
          <TextInput
            label={"TELEFONE"}
            labelColor={"text-gray-600"}
            widthFit={true}
            editable={true}
            value={infoHolder.telefone}
            handleChange={(value) =>
              setInfo({ ...infoHolder, telefone: phoneMask(value) })
            }
          />
        </div>

        <div className="hidden lg:flex flex-col items-center">
          <p className="text-gray-600 text-center font-bold text-sm">CIDADE</p>
          <p className="text-gray-600 text-center text-sm">
            {lead.cidade ? lead.cidade : "-"}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-center">
          <p className="text-gray-600 text-center font-bold text-sm">
            TEMPO P/ENVIO
          </p>
          <p className="text-gray-600 text-center text-sm">
            {lead.dataDeAquisicao && lead.dataDeEnvio
              ? dayjs(lead.dataDeEnvio).diff(dayjs(lead.dataDeAquisicao), "day")
              : "-"}
          </p>
        </div>
        <div className="hidden lg:block">
          <SelectInput
            label="CANAL"
            labelColor="text-gray-600"
            widthFit={true}
            editable={true}
            value={infoHolder.canal}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "GOOGLE ADS", value: "GOOGLE ADS" },
              { label: "FACEBOOK ADS", value: "FACEBOOK ADS" },
              { label: "INDICAÇÃO", value: "INDICAÇÃO" },
              { label: "PASSIVO", value: "PASSIVO" },
              { label: "PROSPECÇÃO ATIVA", value: "PROSPECÇÃO ATIVA" },
            ]}
            handleChange={(value) => setInfo({ ...infoHolder, canal: value })}
          />
        </div>
        <div className="hidden lg:block">
          <NumberInput
            label={"VALOR DE CONSUMO"}
            labelColor={"text-gray-600"}
            editable={true}
            widthFit={true}
            value={infoHolder.consumo}
            handleChange={(value) =>
              setInfo({ ...infoHolder, consumo: Number(value) })
            }
          />
        </div>
        <div className="hidden lg:block">
          <TextInput
            label={"CAMPANHA"}
            labelColor={"text-gray-600"}
            widthFit={true}
            editable={true}
            value={infoHolder.campanha}
            handleChange={(value) =>
              setInfo({ ...infoHolder, campanha: value.toUpperCase() })
            }
          />
        </div>
      </div>
      <div className="flex flex-col w-full pt-1">
        <div className="flex justify-around w-full">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-sm">
                DATA DE AQUISIÇÃO
              </p>
              <p className="text-gray-600 text-center text-sm">
                {lead.dataDeAquisicao
                  ? dayjs(lead.dataDeAquisicao).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-sm">
                DATA DE ENVIO
              </p>
              <p className="text-gray-600 text-center text-sm">
                {lead.dataDeEnvio
                  ? dayjs(lead.dataDeEnvio).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SelectInput
              label={"VENDEDOR P/ENVIO"}
              editable={true}
              widthFit={true}
              value={
                vendedores.filter((x) => x.nome == infoHolder.vendedor).length >
                0
                  ? infoHolder.vendedor
                  : "NÃO DEFINIDO"
              }
              options={vendedores.map((vendedor) => {
                return { label: vendedor.nome, value: vendedor.nome };
              })}
              handleChange={(value) =>
                setInfo({ ...infoHolder, vendedor: value })
              }
            />
            <button
              onClick={saveChanges}
              className="p-1 rounded bg-blue-300 hover:bg-[#15599a] text-white font-bold text-sm flex items-center gap-2"
            >
              <p>{lead.vendedor != "NÃO DEFINIDO" ? "SALVAR" : "ENVIAR"}</p>
              {lead.vendedor ? (
                <MdSave style={{ color: "white" }} />
              ) : (
                <MdSend style={{ color: "white" }} />
              )}
            </button>
          </div>
        </div>
        {msg && <p className={`text-center italic ${msg.color}`}>{msg.text}</p>}
      </div>
    </div>
  );
}

export default LeadCard;
