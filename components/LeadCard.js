import dayjs from "dayjs";
import React, { useState } from "react";
import {
  customersAcquisitionChannels,
  AcquisitionChannels,
  vendedores,
  formatDate,
} from "../utils/constants";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import { MdSend, MdSave, MdDelete } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import axios from "axios";
import NumberFloatingInput from "./NumberFloatingInput";
import NumberInput from "./NumberInput";
import SaveButton from "./utils/Buttons/SaveButton";
import { FaFileContract, FaHandshake, FaSave } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
function phoneMask(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

const stages = {
  1: "Em atendimento",
  2: "Em acompanhamento",
  3: "Venda fechada",
};

function LeadCard({ lead, getLeads }) {
  const [infoHolder, setInfo] = useState(lead);
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [showLostLeadJustification, setShowJustification] = useState(false);
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
  async function deleteLead() {
    let response = await axios.delete(`/api/insideSales?id=${lead._id}`);
    if (response.status == 200) {
      getLeads();
      return;
    } else {
      alert("Erro ao excluir lead.");
    }
  }
  return (
    <div
      key={lead._id}
      className={`flex flex-col w-full border border-gray-200 p-3 hover:bg-blue-100 ${
        lead.perdido ? "bg-red-100" : ""
      } items-center`}
    >
      <div className="relative grid grid-cols-1 lg:grid-cols-10 items-center border-b border-gray-200 pb-1 w-full">
        {lead.contratoSolicitado && (
          <div className="absolute -left-2 -top-2 text-green-600">
            <BsPatchCheckFill style={{ fontSize: "20px" }} />
          </div>
        )}
        {lead.contratoAssinado && (
          <div className="absolute -left-2 top-4 text-green-600">
            <FaHandshake style={{ fontSize: "20px" }} />
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
            options={vendedores
              .filter((x) => x.qualificacao?.includes("INSIDE"))
              .map((vendedor) => {
                return {
                  label: vendedor.nome,
                  value: vendedor.nome,
                };
              })}
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
            options={customersAcquisitionChannels.map((value) => value)}
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
        <div className="grid grid-cols-1 grid-rows-4 gap-2 lg:grid-cols-10 lg:grid-rows-1 w-full">
          <div className="grid grid-cols-1">
            <NumberInput
              label={"CÓDIGO"}
              labelColor={"text-gray-600"}
              editable={true}
              widthFit={true}
              value={infoHolder.codigoSVB}
              handleChange={(value) =>
                setInfo({ ...infoHolder, codigoSVB: Number(value) })
              }
            />
          </div>
          <div className="flex justify-center items-start col-span-1  lg:col-span-4 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-sm">
                DATA DE AQUISIÇÃO
              </p>
              <input
                type={"date"}
                className="outline-none text-gray-600 text-center text-sm bg-transparent"
                value={
                  infoHolder.dataDeAquisicao
                    ? formatDate(infoHolder.dataDeAquisicao)
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
          <div className="flex justify-center items-center col-span-1 lg:col-span-4 gap-3">
            <SelectInput
              label={"VENDEDOR P/ENVIO"}
              labelColor={"text-gray-600"}
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
            <div className="flex items-center justify-center">
              <SaveButton
                text={"SALVAR"}
                icon={<FaSave />}
                handleClick={saveChanges}
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-sm">
                STATUS
              </p>
              <p className="text-gray-600 uppercase text-center text-sm">
                {lead.perdido
                  ? "PERDIDO"
                  : lead.estagioFunil
                  ? stages[lead.estagioFunil]
                  : stages[1]}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 relative mt-1 lg:mt-0">
            {deleteMenu ? (
              <div className="flex flex-col items-center justify-center">
                <div
                  onClick={() => setDeleteMenu(false)}
                  className="w-fit text-red-500 scale-110 cursor-pointer text-[20px]"
                >
                  <MdDelete />
                </div>
                <div className="w-fit rounded bg-[#fff] z-2 shadow-lg border border-gray-200 absolute top-8">
                  <button
                    onClick={deleteLead}
                    className="text-gray-700 font-bold text-xs hover:bg-red-200 p-2"
                  >
                    EXCLUIR
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {lead.perdido ? (
                  showLostLeadJustification ? (
                    <AiFillEye
                      title="ESCONDER MOTIVO DA PERDA"
                      onClick={() => setShowJustification(false)}
                      style={{ color: "#fead61", cursor: "pointer" }}
                    />
                  ) : (
                    <AiFillEyeInvisible
                      title="MOSTRAR MOTIVO DA PERDA"
                      onClick={() => setShowJustification(true)}
                      style={{ color: "#fead61", cursor: "pointer" }}
                    />
                  )
                ) : null}
                <div
                  onClick={() => setDeleteMenu(true)}
                  className="w-fit text-red-500 opacity-40 hover:opacity-100 hover:text-red-500 hover:scale-110 duration-300 ease-in cursor-pointer text-[20px]"
                >
                  <MdDelete />
                </div>
              </div>
            )}
          </div>
        </div>
        {msg && <p className={`text-center italic ${msg.color}`}>{msg.text}</p>}
      </div>
      {showLostLeadJustification ? (
        <div className="flex flex-col w-full border border-red-500">
          <h1 className="font-bold text-center text-sm">
            MOTIVO DA PERDA DO LEAD
          </h1>
          <p className="w-full text-center py-1 text-xs italic text-red-500 font-medium">
            {lead.motivoPerda}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default LeadCard;
