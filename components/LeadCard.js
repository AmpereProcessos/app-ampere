import dayjs from "dayjs";
import React, { useState } from "react";
import { vendedores } from "../utils/constants";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { MdSend, MdSave } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
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
    console.log(infoHolder);
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
      <div className="relative grid grid-cols-1 lg:grid-cols-10 items-center border-b border-gray-200 pb-1 w-full">
        {lead.contratoSolicitado && (
          <div className="absolute -left-2 -top-2 text-green-600">
            <BsPatchCheckFill style={{ fontSize: "20px" }} />
          </div>
        )}

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
              { label: "MARIANA DE SOUZA", value: "MARIANA DE SOUZA" },
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
            BRANDING SCORE
          </p>
          <p className="text-gray-600 text-center text-sm">
            {lead.leadscoreBranding ? lead.leadscoreBranding : "-"}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-center">
          <p className="text-gray-600 text-center font-bold text-sm">
            PRODUTO SCORE
          </p>
          <p className="text-gray-600 text-center text-sm">
            {lead.leadscoreProduto ? lead.leadscoreProduto : "-"}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-center">
          <p className="text-gray-600 text-center font-bold text-sm">NICHO</p>
          <p className="text-gray-600 text-center text-sm">
            {lead.nicho ? lead.nicho : "-"}
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
              <input
                type={"date"}
                className="outline-none text-gray-600 text-center text-sm bg-transparent"
                value={
                  infoHolder.dataDeAquisicao
                    ? dayjs(infoHolder.dataDeAquisicao)
                        .add(4, "hour")
                        .format("YYYY-MM-DD")
                    : null
                }
                onChange={(e) =>
                  setInfo({
                    ...infoHolder,
                    dataDeAquisicao: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-sm">
                DATA DE ENVIO
              </p>
              <p className="text-gray-600 text-center text-sm">
                {dayjs(infoHolder.dataDeEnvio)
                  .add(4, "hour")
                  .format("DD/MM/YYYY")}
              </p>
              {/* <input
                type={"date"}
                className="outline-none text-gray-600 text-center text-sm bg-transparent"
                value={
                  infoHolder.dataDeEnvio
                    ? dayjs(infoHolder.dataDeEnvio)
                        .add(4, "hour")
                        .format("YYYY-MM-DD")
                    : null
                }
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    dataDeEnvio: new Date(e.target.value).toISOString(),
                  });
                }}
              /> */}
            </div>

            <div className="hidden lg:flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-sm">
                TEMPO P/ENVIO
              </p>
              <p className="text-gray-600 text-center text-sm">
                {lead.dataDeAquisicao && lead.dataDeEnvio
                  ? dayjs(lead.dataDeEnvio).diff(
                      dayjs(lead.dataDeAquisicao),
                      "day"
                    )
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
