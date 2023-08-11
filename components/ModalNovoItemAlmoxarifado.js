import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import Select from "react-select";
import { cities, units } from "../utils/constants";
import axios from "axios";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import SelectFoatingInput from "./SelectFloatingInput";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "40%",
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
function Novoitem({ closeModal, getMateriais }) {
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [quantidadeMinima, setQuantidadeMinima] = useState(0);
  const [grandeza, setGrandeza] = useState("UN");
  const [preco, setPreco] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [anotacoes, setAnotacoes] = useState("");
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function addItem() {
    let obj = {
      nome: nome,
      qtde: quantidade,
      qtdeMinima: quantidadeMinima,
      grandeza: grandeza,
      preco: preco,
      codigo: codigo,
      localizacao: localizacao,
      anotacoes: anotacoes,
    };
    if (nome.trim().length < 3) {
      setMsg({
        text: "Por favor, preencha um nome válido.",
        color: "text-red-500",
      });
      return;
    }
    if (quantidade == 0) {
      setMsg({
        text: "Por favor, preencha uma quantidade válida.",
        color: "text-red-500",
      });
      return;
    }
    if (preco == 0) {
      setMsg({
        text: "Por favor, preencha um preço válido.",
        color: "text-red-500",
      });
      return;
    }
    axios.post("/api/almoxarifado/novoMaterial", obj).then((res) => {
      console.log(res.data);
      getMateriais();
      setMsg({ text: "Item adicionado!", color: "text-green-500" });
      setNome("");
      setQuantidade(0);
      setPreco(0);
      setCodigo("");
      setLocalizacao("");
      setAnotacoes("");
      setTimeout(() => {
        setMsg({ text: "", color: "" });
      }, 2000);
    });
  }
  /*console.log({
    novaQtde: quantidade,
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
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200 min-h-[30px]">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                NOVO ITEM
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    closeModal(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="grow py-2 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex flex-col w-full h-full px-4">
                <TextFloatingInput
                  label={"NOME DO ITEM"}
                  editable={true}
                  value={nome}
                  handleChange={(value) => setNome(value)}
                  width={"100%"}
                />
                <NumberFloatingInput
                  label={"QUANTIDADE"}
                  editable={true}
                  value={quantidade}
                  handleChange={(value) => setQuantidade(Number(value))}
                  width={"100%"}
                />
                <NumberFloatingInput
                  label={"QUANTIDADE MÍNIMA"}
                  editable={true}
                  value={quantidadeMinima}
                  handleChange={(value) => setQuantidadeMinima(Number(value))}
                  width={"100%"}
                />
                <SelectFoatingInput
                  label={"GRANDEZA"}
                  editable={true}
                  value={grandeza}
                  options={units}
                  handleChange={(value) => setGrandeza(value)}
                  width={"100%"}
                />
                {/* <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4" >
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
                </div> */}
                {/* <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
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
                </div> */}
                <NumberFloatingInput
                  label={"PREÇO"}
                  editable={true}
                  value={preco}
                  handleChange={(value) => setPreco(Number(value))}
                  width={"100%"}
                />
                {/* <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
                  <span className="text-center uppercase font-bold">PREÇO</span>
                  <div className={"grow"}>
                    <input
                      type={"number"}
                      value={preco}
                      onChange={(e) => setPreco(Number(e.target.value))}
                      className="text-gray-600 w-full p-1 h-full text-sm text-center outline-none"
                    />
                  </div>
                </div> */}
                <TextFloatingInput
                  label={"CÓDIGO NEREUS"}
                  editable={true}
                  value={codigo}
                  handleChange={(value) => setCodigo(value)}
                  width={"100%"}
                />
                {/* <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-2 border border-gray-200 p-2 mt-4">
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
                </div> */}
                <TextFloatingInput
                  label={"LOCALIZAÇÃO"}
                  editable={true}
                  value={localizacao}
                  handleChange={(value) => setLocalizacao(value)}
                  width={"100%"}
                />
                <div className="flex flex-col w-full gap-1">
                  <h1 className="text-gray-500 font-medium text-xs w-full text-center">
                    ANOTAÇÕES
                  </h1>
                  <textarea
                    value={anotacoes}
                    onChange={(e) => setAnotacoes(e.target.value)}
                    placeholder="Deixe aqui anotações sobre o item em questão..."
                    className="w-full h-[80px] p-1 text-sm text-center resize-none outline-blue-200 bg-gray-100 border border-gray-200"
                  />
                </div>
                {msg.text && (
                  <p className={`text-center italic ${msg.color}`}>
                    {msg.text}
                  </p>
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
      </div>
    </>
  );
}

export default Novoitem;
