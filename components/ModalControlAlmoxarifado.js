import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import Select from "react-select";
import { cities } from "../utils/constants";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "30%",
  height: "50%",
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
  const [novoPreco, setNovoPreco] = useState();
  const [codigo, setCodigo] = useState(info.codigo);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function handleAlteracoes() {
    axios
      .put("/api/almoxarifado/materiais", {
        id: info._id,
        novaQtde: novaQuantidade >= 0 ? novaQuantidade : info.qtde,
        novoPreco: novoPreco ? novoPreco : info.preco,
        codigo: codigo,
        infoAlt: {
          valorAnterior: info.qtde,
          respAlteracao: credentials?.name,
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
      respAlteracao: credentials?.name,
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
            <div className="flex flex-col h-full justify-around overflow-y-auto">
              <div className="flex flex-col">
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2  mt-4">
                  <span className="text-center uppercase font-bold">
                    QUANTIDADE ATUAL
                  </span>
                  <div className={"grow"}>
                    <p className="text-gray-600 text-center">{info.qtde}</p>
                  </div>
                </div>
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2  mt-4">
                  <span className="text-center uppercase font-bold">
                    PREÇO ATUAL
                  </span>
                  <div className={"grow"}>
                    <p className="text-gray-600 text-center">
                      R${info.preco.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">
                    CÓDIGO NEREUS
                  </span>
                  <div className={"grow"}>
                    <input
                      type={"text"}
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                      className="text-gray-600 w-full p-1 h-full text-sm text-center outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">
                    NOVA QUANTIDADE
                  </span>
                  <div className={"grow"}>
                    <input
                      type={"number"}
                      value={
                        novaQuantidade >= 0 ? novaQuantidade.toString() : null
                      }
                      onChange={(e) => {
                        let number = Number(e.target.value);
                        if (number >= 0) setNovaQuantidade(number);
                        else setNovaQuantidade(0);
                      }}
                      className="text-gray-600 w-full p-1 h-full text-sm text-center outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">
                    NOVO PREÇO
                  </span>
                  <div className={"grow"}>
                    <input
                      type={"number"}
                      value={novoPreco}
                      onChange={(e) => {
                        let number = Number(e.target.value);
                        if (number >= 0) setNovoPreco(Number(e.target.value));
                        else setNovoPreco(0);
                      }}
                      className="text-gray-600 w-full p-1 h-full text-sm text-center outline-none"
                    />
                  </div>
                </div>
              </div>
              {msg.text && (
                <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
              )}
              <div className="mt-4 flex justify-center">
                <SaveButton
                  text={"SALVAR"}
                  icon={<FaSave />}
                  handleClick={handleAlteracoes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ControleAlmoxarifado;
