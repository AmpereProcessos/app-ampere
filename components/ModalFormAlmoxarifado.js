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
  height: "90%",
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
function FormularioAlmoxarifado({ setModalIsOpen, info }) {
  const [materiais, setMateriais] = useState({
    saida: [],
    devolucao: [],
  });
  const [saidaMaterialHolder, setSaidaMaterialHolder] = useState({
    nome: null,
    id: null,
    qtde: null,
  });
  const [devolucaoMaterialHolder, setDevolucaoMaterialHolder] = useState({
    nome: null,
    id: null,
    qtde: null,
  });
  const [infoMateriais, setInfoMateriais] = useState({
    saida: info.saida,
    devolucao: [],
  });
  const [saidaMaterialMsg, setSaidaMaterialMsg] = useState("");
  const [devolucaoMaterialMsg, setDevolucaoMaterialMsg] = useState("");
  function getMaterials() {
    axios.get("/api/almoxarifado/materiais").then((res) => {
      const result = Array.from(new Set(info.saida.map((s) => s.id))).map(
        (id) => {
          return {
            id: id,
            nome: info.saida.find((s) => s.id === id).nome,
          };
        }
      );
      setMateriais({ saida: res.data, devolucao: result });
    });
  }
  function addMaterialSaida() {
    if (
      saidaMaterialHolder.qtde > 0 &&
      saidaMaterialHolder.nome.trim().length > 0
    ) {
      let arr = infoMateriais.saida;
      let index = arr.findIndex((obj) => obj.id == saidaMaterialHolder.id);
      if (index != -1) {
        arr[index].qtde += saidaMaterialHolder.qtde;
      } else {
        arr.push(saidaMaterialHolder);
      }
      setInfoMateriais({ ...infoMateriais, saida: arr });
      setSaidaMaterialHolder({ ...saidaMaterialHolder, qtde: null });
      setSaidaMaterialMsg("");
    } else {
      setSaidaMaterialMsg("Informações inválidas");
    }
  }
  function addMaterialDevolucao() {
    if (
      devolucaoMaterialHolder.qtde > 0 &&
      devolucaoMaterialHolder.nome.trim().length > 0
    ) {
      let arr = infoMateriais.devolucao;
      let index = arr.findIndex((obj) => obj.id == devolucaoMaterialHolder.id);
      if (index != -1) {
        arr[index].qtde += devolucaoMaterialHolder.qtde;
      } else {
        arr.push(devolucaoMaterialHolder);
      }
      setInfoMateriais({ ...infoMateriais, devolucao: arr });
      setDevolucaoMaterialHolder({ ...devolucaoMaterialHolder, qtde: null });
      setDevolucaoMaterialMsg("");
    } else {
      setDevolucaoMaterialMsg("Informações inválidas");
    }
  }
  /*function addFormulario() {
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
  }*/
  useEffect(() => {
    getMaterials();
  }, []);
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
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col grow overflow-y-auto scrollbar-thin scrollbar-thumb-[#15599a80] scrollbar-track-gray-100">
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">CLIENTE</span>
                <div className={"grow"}>
                  <p className="text-gray-600">{info.nomeDoContrato}</p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  RESPONSÁVEL
                </span>
                <p className="text-gray-600">{info.responsavel}</p>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">SERVIÇO</span>
                <p className="text-gray-600">{info.servico}</p>
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
                        setSaidaMaterialHolder({
                          ...saidaMaterialHolder,
                          nome: e.value.nome,
                          id: e.value.id,
                        })
                      }
                      options={materiais.saida.map((material) => {
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
                    value={saidaMaterialHolder.qtde}
                    className="col-span-1 outline-none text-center border border-gray-200"
                    onChange={(e) =>
                      setSaidaMaterialHolder({
                        ...saidaMaterialHolder,
                        qtde: Number(e.target.value),
                      })
                    }
                  />
                  <div
                    onClick={addMaterialSaida}
                    className="cursor-pointer flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
                  >
                    <MdOutlineAddCircle style={{ fontSize: "25px" }} />
                  </div>
                </div>
              </div>
              {saidaMaterialMsg && (
                <p className="text-sm italic text-red-500 text-center">
                  {saidaMaterialMsg}
                </p>
              )}
              <div className="flex h-[125px] flex-col gap-y-2 border border-gray-200 p-2 mt-4">
                <h1 className="font-bold text-center">SAÍDA</h1>
                <div className="flex flex-col grow overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {infoMateriais.saida.map((obj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-2"
                    >
                      <p className="list-none text-center text-gray-600 font-bold">
                        {obj.nome} - ({obj.qtde})
                      </p>
                      <button
                        onClick={() => {
                          let arr = infoMateriais.saida;
                          arr.splice(index, 1);
                          setInfoMateriais({
                            ...infoMateriais,
                            saida: arr,
                          });
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
                        setDevolucaoMaterialHolder({
                          ...devolucaoMaterialHolder,
                          nome: e.value.nome,
                          id: e.value.id,
                        })
                      }
                      options={materiais.devolucao.map((material) => {
                        return {
                          label: material.nome,
                          value: {
                            id: material.id,
                            nome: material.nome,
                          },
                        };
                      })}
                    />
                  </div>
                  <input
                    placeholder="QTDE"
                    type="number"
                    value={devolucaoMaterialHolder.qtde}
                    className="col-span-1 outline-none text-center border border-gray-200"
                    onChange={(e) =>
                      setDevolucaoMaterialHolder({
                        ...devolucaoMaterialHolder,
                        qtde: Number(e.target.value),
                      })
                    }
                  />
                  <div
                    onClick={addMaterialDevolucao}
                    className="cursor-pointer flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
                  >
                    <MdOutlineAddCircle style={{ fontSize: "25px" }} />
                  </div>
                </div>
              </div>
              {devolucaoMaterialMsg && (
                <p className="text-sm italic text-red-500 text-center">
                  {devolucaoMaterialMsg}
                </p>
              )}
              <div className="flex h-[125px] flex-col gap-y-2 border border-gray-200 p-2 mt-4">
                <h1 className="font-bold text-center">DEVOLUÇÃO</h1>
                <div className="flex flex-col grow overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {infoMateriais.devolucao.map((obj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-2"
                    >
                      <p className="list-none text-center text-gray-600 font-bold">
                        {obj.nome} - ({obj.qtde})
                      </p>
                      <button
                        onClick={() => {
                          let arr = infoMateriais.devolucao;
                          arr.splice(index, 1);
                          setInfoMateriais({
                            ...infoMateriais,
                            devolucao: arr,
                          });
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormularioAlmoxarifado;
