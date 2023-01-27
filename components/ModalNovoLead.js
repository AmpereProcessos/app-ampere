import React, { useContext, useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import Select from "react-select";
import { cidadesAtendidas, cities, vendedores } from "../utils/constants";
import axios from "axios";
import dayjs from "dayjs";
import { AppContext } from "../context/AppContext";
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
  const { credentials } = useContext(AppContext);
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [info, setInfo] = useState({
    telefone: "",
    nome: "",
    cidade: cidadesAtendidas[0],
    canal: "NÃO DEFINIDO",
    campanha: "",
    dataDeAquisicao: new Date(),
    consumo: 0,
    vendedor: "NÃO DEFINIDO",
    dataDeEnvio: null,
    codigoSVB: 0,
    nicho: "NÃO DEFINIDO",
    leadscoreProduto: "NÃO DEFINIDO",
    leadscoreBranding: "NÃO DEFINIDO",
  });
  const [inProgress, setInProgress] = useState(false);
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
  function resetState() {
    setInfo({
      telefone: "",
      nome: "",
      cidade: cidadesAtendidas[0],
      canal: "NÃO DEFINIDO",
      campanha: "",
      dataDeAquisicao: new Date(),
      consumo: 0,
      vendedor: "NÃO DEFINIDO",
      dataEnvio: null,
      codigoSVB: 0,
      nicho: "NÃO DEFINIDO",
      leadscoreProduto: "NÃO DEFINIDO",
      leadscoreBranding: "NÃO DEFINIDO",
    });
  }
  function addLead() {
    setInProgress(true);
    setMsg({ text: "Em andamento...", color: "text-[#15599a]" });
    if (validateInfo()) {
      axios
        .post("/api/insideSales/newLead", {
          ...info,
          dataDeEnvio: new Date().toISOString(),
          responsavel: credentials.vendedor
            ? credentials.vendedor
            : credentials.nome,
        })
        .then((res) => {
          setMsg({ text: "Lead adicionado!", color: "text-green-500" });
          resetState();
          setInProgress(false);
          getLeads();
        })
        .catch((err) => {
          setMsg({
            text: "Um erro ocorreu, por favor tente novamente",
            color: "text-red-500",
          });
          setInProgress(false);
        });
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
                    <option value={"COLD CALL"}>COLD CALL</option>
                    <option value={"LIGOU NA EMPRESA"}>LIGOU NA EMPRESA</option>
                    <option value={"INDICAÇÃO DE CLIENTE"}>
                      INDICAÇÃO DE CLIENTE
                    </option>
                    <option value={"INDICAÇÃO DE PARCEIRO"}>
                      INDICAÇÃO DE PARCEIRO
                    </option>
                    <option value={"INDICAÇÃO AMPÈRE INTERNO"}>
                      INDICAÇÃO AMPÈRE INTERNO
                    </option>
                    <option value={"FACEBOOK ADS"}>FACEBOOK ADS</option>
                    <option value={"INDICAÇÃO"}>INDICAÇÃO</option>
                    <option value={"PASSIVO"}>PASSIVO</option>
                    <option value={"PROSPECÇÃO ATIVA"}>PROSPECÇÃO ATIVA</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  NICHO
                </span>
                <div className="flex grow justify-center items-center col-span-8">
                  <select
                    type="text"
                    value={info.nicho}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        nicho: e.target.value,
                      })
                    }
                    className="outline-none p-2 h-full text-center"
                  >
                    <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                    <option value={"RESIDENCIAL"}>RESIDENCIAL</option>
                    <option value={"COMERCIAL"}>COMERCIAL</option>
                    <option value={"RURAL"}>RURAL</option>
                    <option value={"INDUSTRIAL"}>INDUSTRIAL</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  LEADSCORE - BRANDING
                </span>
                <div className="flex grow justify-center items-center col-span-8">
                  <select
                    type="text"
                    value={info.leadscoreBranding}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        leadscoreBranding: e.target.value,
                      })
                    }
                    className="outline-none p-2 h-full text-center"
                  >
                    <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                    <option value={"A"}>A</option>
                    <option value={"B"}>B</option>
                    <option value={"C"}>C</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-10 w-full border p-1 border-gray-200">
                <span className="font-bold text-center p-2 col-span-2">
                  LEADSCORE - PRODUTO
                </span>
                <div className="flex grow justify-center items-center col-span-8">
                  <select
                    type="text"
                    value={info.leadscoreProduto}
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        leadscoreProduto: e.target.value,
                      })
                    }
                    className="outline-none p-2 h-full text-center"
                  >
                    <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"3"}>3</option>
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
                    info.dataDeAquisicao
                      ? dayjs(info.dataDeAquisicao).format("YYYY-MM-DD")
                      : null
                  }
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      dataDeAquisicao: new Date(e.target.value).toISOString(),
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
              <div className="flex items-center justify-center">
                {inProgress ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    onClick={addLead}
                    className="p-2 rounded bg-blue-300 hover:bg-[#15599a] text-white font-bold"
                  >
                    ADICIONAR LEAD
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NovoLead;
