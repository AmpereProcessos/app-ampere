import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import Select from "react-select";
import { cidadesAtendidas, cities, vendedores } from "../utils/constants";
import axios from "axios";
import dayjs from "dayjs";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "70%",
  height: "80%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function formatPhone(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}
function NovoLead({ setModalIsOpen, getLeads }) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [info, setInfo] = useState({
    telefone: "",
    nome: "",
    cidade: cidadesAtendidas[0],
    canal: "NÃO DEFINIDO",
    campanha: "",
    dataAquisicao: new Date(),
    consumo: 0,
    vendedor: "NÃO DEFINIDO",
    dataEnvio: null,
    codigoSVB: 0,
  });
  // console.log({
  //   ...info,
  //   dataAquisicao: dayjs(info.dataAquisicao).add(4, "h").format("DD/MM/YYYY"),
  // });
  function validateInfo() {
    if (info.telefone.trim().length < 14) {
      setMsg({
        text: "Por favor, preencha um telefone válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (info.nome.trim().length < 3) {
      setMsg({
        text: "Por favor, preencha um nome válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (info.canal == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha um canal de lead válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (info.consumo <= 0) {
      setMsg({
        text: "Por favor, preencha um consumo válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (info.vendedor == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha um vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (info.codigoSVB <= 0) {
      setMsg({
        text: "Por favor, preencha um código SVB válido.",
        color: "text-red-500",
      });
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  function addLead() {
    if (validateInfo()) {
      axios
        .post("/api/insideSales/newLead", {
          ...info,
          responsavel: "DEVISSON LIMA",
        })
        .then((res) => getLeads());
    }
  }
  console.log(info);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                NOVO LEAD
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col gap-2 grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2">
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  NOME
                </span>
                <input
                  type="text"
                  value={info.nome}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      nome: e.target.value.toUpperCase(),
                    })
                  }
                  className="outline-none grow p-2 h-full text-center col-span-8"
                />
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  TELEFONE
                </span>
                <input
                  type="text"
                  value={info.telefone}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      telefone: formatPhone(e.target.value),
                    })
                  }
                  className="outline-none grow p-2 h-full text-center col-span-8"
                />
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  CIDADE
                </span>
                <div className="flex grow justify-center items-center col-span-8">
                  <select
                    type="text"
                    value={info.cidade}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        cidade: e.target.value,
                      })
                    }
                    className="outline-none p-2 h-full text-center"
                  >
                    {cidadesAtendidas.map((cidade) => (
                      <option key={cidade} value={cidade}>
                        {cidade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  CANAL
                </span>
                <div className="flex grow justify-center items-center col-span-8">
                  <select
                    type="text"
                    value={info.canal}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        canal: e.target.value,
                      })
                    }
                    className="outline-none p-2 h-full text-center"
                  >
                    <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                    <option value={"GOOGLE ADS"}>GOOGLE ADS</option>
                    <option value={"INDICAÇÃO"}>INDICAÇÃO</option>
                    <option value={"PASSIVO"}>PASSIVO</option>
                    <option value={"PROSPECÇÃO ATIVA"}>PROSPECÇÃO ATIVA</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  CAMPANHA
                </span>
                <input
                  type="text"
                  value={info.campanha}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      campanha: e.target.value.toUpperCase(),
                    })
                  }
                  className="outline-none grow p-2 h-full text-center col-span-8"
                />
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  DATA DE AQUISIÇÃO
                </span>
                <input
                  type="date"
                  value={
                    info.dataAquisicao
                      ? dayjs(info.dataAquisicao).format("YYYY-MM-DD")
                      : null
                  }
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      dataAquisicao: e.target.value,
                    })
                  }
                  className="outline-none grow p-2 h-full text-center col-span-8"
                />
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  CONSUMO
                </span>
                <input
                  type="number"
                  value={info.consumo}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      consumo: Number(e.target.value),
                    })
                  }
                  className="outline-none grow p-2 h-full text-center col-span-8"
                />
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  VENDEDOR
                </span>
                <div className="flex grow justify-center items-center col-span-8">
                  <select
                    type="text"
                    value={info.vendedor}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        vendedor: e.target.value,
                      })
                    }
                    className="outline-none p-2 h-full text-center"
                  >
                    {vendedores.map((vendedor, index) => (
                      <option key={index} value={vendedor.nome}>
                        {vendedor.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  CÓDIGO SVB
                </span>
                <input
                  type="number"
                  value={info.codigoSVB}
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      codigoSVB: Number(e.target.value),
                    })
                  }
                  className="outline-none grow p-2 h-full text-center col-span-8"
                />
              </div>
              {msg.text && (
                <p className={`text-center italic text-sm ${msg.color}`}>
                  {msg.text}
                </p>
              )}
              <div
                onClick={addLead}
                className="flex items-center justify-center"
              >
                <button className="p-2 rounded bg-blue-300 hover:bg-[#15599a] text-white font-bold">
                  ADICIONAR LEAD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NovoLead;
