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
function Novoitem({ setModalAberta }) {
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [preco, setPreco] = useState();
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function addItem() {
    let obj = {
      nome: nome,
      qtde: quantidade,
      preco: preco,
    };
    axios.post("/api/almoxarifado/novoMaterial", obj).then((res) => {
      console.log(res.data);
      setMsg({ text: "Item adicionado!", color: "text-green-500" });
    });
  }
  /*console.log({
    novaQtde: quantidade,
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
                NOVO ITEM
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
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">
                    NOME DO ITEM
                  </span>
                  <div className={"grow"}>
                    <input
                      type={"text"}
                      value={nome}
                      onChange={(e) => setNome(e.target.value.toUpperCase())}
                      className="text-gray-600 w-full p-1 h-full text-sm text-center outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">
                    QUANTIDADE
                  </span>
                  <div className={"grow"}>
                    <input
                      type={"number"}
                      value={quantidade}
                      onChange={(e) => setQuantidade(Number(e.target.value))}
                      className="text-gray-600 w-full p-1 h-full text-sm text-center outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">PREÇO</span>
                  <div className={"grow"}>
                    <input
                      type={"number"}
                      value={preco}
                      onChange={(e) => setPreco(Number(e.target.value))}
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
                  onClick={addItem}
                  className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-2 text-white font-bold rounded text-sm"
                >
                  <p>ADICIONAR</p>
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

export default Novoitem;
