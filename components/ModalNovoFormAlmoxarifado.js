import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { MdOutlineAddCircle } from "react-icons/md";
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
  height: "87%",
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
function NovoFormulario({ setModalIsOpen }) {
  const [clientes, setClientes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [materialHolder, setMaterialHolder] = useState({
    nome: null,
    id: null,
    qtde: null,
  });
  const [callInfo, setCallInfo] = useState({
    idPai: null,
    codigoProjeto: null,
    nomeDoContrato: "",
    responsavel: "A DEFINIR",
    servico: "NÃO DEFINIDO",
    saida: [],
  });
  const [message, setMessage] = useState({
    text: "",
    color: "",
  });
  const [materialMsg, setMaterialMsg] = useState("");
  function getMaterials() {
    axios
      .get("/api/almoxarifado/materiais")
      .then((res) => setMateriais(res.data));
  }
  function getClients() {
    axios.get("/api/projects/todos").then((res) => setClientes(res.data));
  }
  function addMaterial() {
    if (materialHolder.qtde > 0) {
      let arr = callInfo.saida;
      let index = arr.findIndex((obj) => obj.id == materialHolder.id);
      if (index != -1) {
        arr[index].qtde += materialHolder.qtde;
      } else {
        arr.push(materialHolder);
      }
      setCallInfo({ ...callInfo, saida: arr });
      setMaterialHolder({ ...materialHolder, qtde: null });
      setMaterialMsg("");
    } else {
      setMaterialMsg("Quantidade inválida");
    }
  }
  function addFormulario() {
    if (callInfo.nomeDoContrato.trim().length < 3) {
      setMessage({ text: "Nome do contrato inválido", color: "text-red-500" });
    } else if (callInfo.responsavel == "A DEFINIR") {
      setMessage({ text: "Responsável não definido", color: "text-red-500" });
    } else if (callInfo.servico == "NÃO DEFINIDO") {
      setMessage({ text: "Serviço não definido", color: "text-red-500" });
    } else if (callInfo.saida.length == 0) {
      setMessage({
        text: "Nenhum produto não definido",
        color: "text-red-500",
      });
    } else {
      axios
        .post("/api/almoxarifado/formularios", {
          ...callInfo,
          tipo: "RETIRADA",
        })
        .then((res) =>
          setMessage({ text: "Formulário criado !", color: "text-green-500" })
        );
    }
  }
  useEffect(() => {
    getClients();
    getMaterials();
  }, []);
  console.log(callInfo);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                ABERTURA DE CHAMADO
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setMessage("");
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col grow overflow-y-auto">
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">CLIENTE</span>
                <div className={"grow"}>
                  <Select
                    isMulti={false}
                    placeholder="NOME DO CLIENTE"
                    onChange={(e) =>
                      setCallInfo({
                        ...callInfo,
                        nomeDoContrato: e.value.nome,
                        idPai: e.value.id,
                        codigoProjeto: e.value.qtde,
                      })
                    }
                    options={clientes.map((cliente) => {
                      return {
                        label: cliente.nomeDoContrato,
                        value: {
                          id: cliente._id,
                          qtde: cliente.qtde,
                          nome: cliente.nomeDoContrato,
                        },
                      };
                    })}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  RESPONSÁVEL
                </span>
                <select
                  value={callInfo.responsavel}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, responsavel: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
                >
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                  <option value={"GABRIEL STEFANO"}>GABRIEL STEFANO</option>
                  <option value={"MATHEUS OLIVEIRA"}>MATHEUS OLIVEIRA</option>
                  <option value={"DIOGO PAULINO"}>DIOGO PAULINO</option>
                </select>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">SERVIÇO</span>
                <select
                  value={callInfo.servico}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, servico: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
                >
                  <option value={"PADRÃO"}>PADRÃO</option>
                  <option value={"ESTRUTURA"}>ESTRUTURA</option>
                  <option value={"MONTAGEM"}>MONTAGEM</option>
                  <option value={"MANUTENÇÃO CORRETIVA"}>
                    MANUTENÇÃO CORRETIVA
                  </option>
                  <option value={"MANUTENÇÃO PREVENTIVA"}>
                    MANUTENÇÃO PREVENTIVA
                  </option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  ADICIONAR
                </span>
                <div className="grid grid-cols-6 gap-x-2">
                  <div className="grow col-span-4">
                    <Select
                      isMulti={false}
                      placeholder="MATERIAL"
                      onChange={(e) =>
                        setMaterialHolder({
                          ...materialHolder,
                          nome: e.value.nome,
                          id: e.value.id,
                        })
                      }
                      options={materiais.map((material) => {
                        return {
                          label: material.nome,
                          value: {
                            id: material._id,
                            nome: material.nome,
                          },
                        };
                      })}
                    />
                  </div>
                  <input
                    placeholder="QTDE"
                    type="number"
                    value={materialHolder.qtde}
                    className="col-span-1 outline-none text-center border border-gray-200"
                    onChange={(e) =>
                      setMaterialHolder({
                        ...materialHolder,
                        qtde: Number(e.target.value),
                      })
                    }
                  />
                  <div
                    onClick={addMaterial}
                    className="cursor-pointer flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
                  >
                    <MdOutlineAddCircle style={{ fontSize: "25px" }} />
                  </div>
                </div>
              </div>
              {materialMsg && (
                <p className="text-sm italic text-red-500 text-center">
                  {materialMsg}
                </p>
              )}
              <div className="flex grow flex-col gap-y-2 border border-gray-200 p-2 mt-4">
                <h1 className="font-bold text-center">SAÍDA</h1>
                <div className="flex flex-col overflow-y-auto overscroll-y-auto">
                  {callInfo.saida.map((obj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-2"
                    >
                      <p className="list-none text-center text-gray-600 font-bold">
                        {obj.nome} - ({obj.qtde})
                      </p>
                      <button
                        onClick={() => {
                          let arr = callInfo.saida;
                          arr.splice(index, 1);
                          setCallInfo({ ...callInfo, saida: arr });
                        }}
                      >
                        <VscChromeClose
                          style={{ color: "red", fontSize: "15px" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={addFormulario}
                className="bg-blue-300 align-bottom mt-1 hover:text-white font-bold hover:bg-[#15599a] p-2"
              >
                ABRIR FORMULÁRIO
              </button>

              {message.text && (
                <p className={`${message.color} text-center text-sm`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NovoFormulario;
