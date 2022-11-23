import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import Select from "react-select";
import { cities } from "../utils/constants";
import axios from "axios";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "40%",
  height: "40%",
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
function ControleAlmoxarifado({
  setModalAberta,
  info,
  credentials,
  handleUpdates,
}) {
  const [novaQuantidade, setNovaQuantidade] = useState();
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function handleAlteracoes() {
    axios
      .put("/api/almoxarifado/materiais", {
        id: info._id,
        novaQtde: novaQuantidade,
        infoAlt: {
          valorAnterior: info.qtde,
          respAlteracao: credentials.nome,
        },
      })
      .then((res) => {
        handleUpdates(info._id);
        setMsg({ text: res.data, color: "text-green-500" });
      })
      .catch((err) => setMsg({ text: err, color: "text-red-500" }));
  }
  /*console.log({
    novaQtde: novaQuantidade,
    infoAlt: {
      valorAnterior: info.qtde,
      respAlteracao: credentials.nome,
    },
  });*/
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                {info.nome}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalAberta(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col h-full justify-around">
              <div className="flex flex-col">
                <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">
                    QUANTIDADE ATUAL
                  </span>
                  <div className={"grow"}>
                    <p className="text-gray-600 text-center">{info.qtde}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">
                    NOVA QUANTIDADE
                  </span>
                  <div className={"grow"}>
                    <input
                      type={"number"}
                      value={novaQuantidade}
                      onChange={(e) =>
                        setNovaQuantidade(Number(e.target.value))
                      }
                      className="text-gray-600 w-full p-1 h-full text-sm text-center outline-none"
                    />
                  </div>
                </div>
              </div>
              {msg.text && (
                <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
              )}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleAlteracoes}
                  className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm"
                >
                  <p>SALVAR ALTERAÇÕES</p>
                  <FaSave />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ControleAlmoxarifado;
