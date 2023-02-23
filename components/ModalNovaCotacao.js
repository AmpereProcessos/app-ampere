import React, { useContext, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import { fornecedores, suprimentoOption } from "../utils/constants";
import { AppContext } from "../context/AppContext";
import axios from "axios";
function ModalNovaCotacao({ modalIsOpen, setModalIsOpen }) {
  const { credentials } = useContext(AppContext);
  console.log(credentials);
  const [quotationInfo, setQuotationInfo] = useState({
    inversores: [],
    modulos: [],
    componentes: [],
    fornecedor: "NÃO DEFINIDO",
    valorDoKit: 0,
    potPico: 0,
  });
  const [errorMsg, setErrorMsg] = useState({
    inverter: "",
    module: "",
    component: "",
  });
  const [insertQuotationMsg, setInsertQuotationMsg] = useState({
    text: "",
    color: "",
  });
  const [inverterHolder, setInverterHolder] = useState({
    marca: "",
    modelo: "",
    qtde: 0,
  });
  const [moduleHolder, setModuleHolder] = useState({
    marca: "",
    modelo: "",
    qtde: 0,
  });
  const [componentHolder, setComponentHolder] = useState({
    insumo: Object.keys(suprimentoOption)[0],
    tipo: suprimentoOption[Object.keys(suprimentoOption)[0]].tipo[0],
    qtde: 0,
    medida: suprimentoOption[Object.keys(suprimentoOption)[0]].unidade,
  });
  function resetErrorMsg() {
    setErrorMsg({
      inverter: "",
      module: "",
      component: "",
      general: "",
    });
  }
  function resetQuotationInfo() {
    setQuotationInfo({
      inversores: [],
      modulos: [],
      componentes: [],
      fornecedor: "NÃO DEFINIDO",
      valorDoKit: 0,
    });
  }
  async function addNewQuotation() {
    if (quotationInfo.fornecedor == "NÃO DEFINIDO") {
      setErrorMsg({
        inverter: "",
        module: "",
        component: "",
        general: "Por favor, preencha um fornecedor.",
      });
      return;
    }
    if (quotationInfo.potPico <= 0) {
      setErrorMsg({
        inverter: "",
        module: "",
        component: "",
        general: "Por favor, preencha a potência pico da cotação em questão.",
      });
      return;
    }
    if (quotationInfo.valorDoKit <= 0) {
      setErrorMsg({
        inverter: "",
        module: "",
        component: "",
        general: "Por favor, preencha o valor do kit.",
      });
      return;
    }
    setInsertQuotationMsg({ text: "Processando....", color: "text-[#15599a]" });
    try {
      let response = await axios.post("/api/projects/cotacoes", {
        ...quotationInfo,
        dataDeCotacao: new Date(),
        usuario: credentials.nome,
      });
      if (response.statusText == "OK") {
        setInsertQuotationMsg({
          text: "Cotação adicionada !",
          color: "text-green-500",
        });
        resetQuotationInfo();
        setTimeout(() => {
          setInsertQuotationMsg("");
        }, 2000);
      }
    } catch (error) {
      alert(error);
    }
  }

  // Add element functions
  function addInverter() {
    if (inverterHolder.marca.trim().length < 2) {
      setErrorMsg({
        inverter: "Por favor, adicione um marca de inversores válida.",
        module: "",
        component: "",
      });
      return;
    }
    if (inverterHolder.modelo.trim().length < 2) {
      setErrorMsg({
        inverter:
          "Por favor, adicione alguma informação sobre o modelo do inversor.",
        module: "",
        component: "",
      });
      return;
    }
    if (inverterHolder.qtde <= 0) {
      setErrorMsg({
        inverter: "Por favor, adicione uma quantidade válida de inversores.",
        module: "",
        component: "",
      });
      return;
    }
    let info = { ...inverterHolder };
    let currentArr = [...quotationInfo.inversores];
    currentArr.push(info);
    setQuotationInfo({ ...quotationInfo, inversores: currentArr });
    setInverterHolder({ marca: "", modelo: "", qtde: 0 });
    resetErrorMsg();
    return;
  }
  function addModule() {
    if (moduleHolder.marca.trim().length < 2) {
      setErrorMsg({
        inverter: "",
        module: "Por favor, adicione um marca de módulos válida.",
        component: "",
      });
      return;
    }
    if (moduleHolder.modelo.trim().length < 2) {
      setErrorMsg({
        inverter: "",
        module:
          "Por favor, adicione alguma informação sobre o modelo do painel.",
        component: "",
      });
      return;
    }
    if (moduleHolder.qtde <= 0) {
      setErrorMsg({
        inverter: "",
        module: "Por favor, adicione uma quantidade válida de painéis.",
        component: "",
      });
      return;
    }
    let info = { ...moduleHolder };
    let currentArr = [...quotationInfo.modulos];
    currentArr.push(info);
    setQuotationInfo({ ...quotationInfo, modulos: currentArr });
    setModuleHolder({ marca: "", modelo: "", qtde: 0 });
    resetErrorMsg();
    return;
  }
  function addComponent() {
    if (componentHolder.qtde <= 0) {
      setErrorMsg({
        inverter: "",
        module: "",
        component: "Por favor, adicione uma quantidade válida de componentes.",
      });
      return;
    }
    let info = { ...componentHolder };
    let currentArr = [...quotationInfo.componentes];
    currentArr.push(info);
    setQuotationInfo({ ...quotationInfo, componentes: currentArr });
    setComponentHolder({
      insumo: Object.keys(suprimentoOption)[0],
      tipo: suprimentoOption[Object.keys(suprimentoOption)[0]].tipo[0],
      qtde: 0,
      medida: suprimentoOption[Object.keys(suprimentoOption)[0]].unidade,
    });
    resetErrorMsg();
  }
  console.log(quotationInfo);
  return (
    <>
      <AnimatedModalWrapper
        width={"60%"}
        height={"70%"}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={() => setModalIsOpen(false)}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h1 className="font-bold text-[#15599a]">
              ABERTURA DE NOVA COTAÇÃO
            </h1>
            <button>
              <VscChromeClose
                onClick={() => setModalIsOpen(false)}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto ">
            <div className="flex flex-col pt-1">
              <h1 className="text-center bg-[#15599a] text-white font-bold w-full py-2">
                INVERSORES
              </h1>
              <div className="grid grid-cols-7 gap-2 pt-3">
                <div className="flex items-center justify-center col-span-2">
                  <TextFloatingInput
                    label={"MARCA"}
                    editable={true}
                    value={inverterHolder.marca}
                    handleChange={(value) =>
                      setInverterHolder({ ...inverterHolder, marca: value })
                    }
                  />
                </div>
                <div className="flex items-center justify-center col-span-2">
                  <TextFloatingInput
                    label={"MODELO"}
                    editable={true}
                    value={inverterHolder.modelo}
                    handleChange={(value) =>
                      setInverterHolder({ ...inverterHolder, modelo: value })
                    }
                  />
                </div>
                <div className="flex items-center justify-center col-span-2">
                  <NumberFloatingInput
                    label={"QTDE"}
                    editable={true}
                    value={inverterHolder.qtde}
                    handleChange={(value) =>
                      setInverterHolder({
                        ...inverterHolder,
                        qtde: Number(value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-center col-span-1">
                  <IoMdAddCircle
                    onClick={addInverter}
                    style={{
                      color: "green",
                      fontSize: "25px",
                      cursor: "pointer",
                      marginBottom: "5px",
                    }}
                  />
                </div>
              </div>
              {errorMsg.inverter && (
                <p className="text-center text-red-500 italic">
                  {errorMsg.inverter}
                </p>
              )}
              {quotationInfo.inversores.length > 0 ? (
                <div className="flex flex-col w-full">
                  <h1 className="text-center font-bold text-[#15599a]">
                    INVERSORES ADICIONADOS
                  </h1>
                  <div className="grid grid-cols-7 gap-2">
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      MARCA
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      MODELO
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      QTDE
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-1 text-center text-xs">
                      EXCLUIR
                    </h1>
                  </div>
                  {quotationInfo.inversores.map((inverter, index) => (
                    <div className="grid grid-cols-7 gap-2 pt-1">
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {inverter.marca}
                      </h1>
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {inverter.modelo}
                      </h1>
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {inverter.qtde}
                      </h1>
                      <div className="flex items-center col-span-1 justify-center text-red-500">
                        <IoMdRemoveCircle
                          onClick={() => {
                            let invertersArr = quotationInfo.inversores;
                            invertersArr.splice(index, 1);
                            setQuotationInfo({
                              ...quotationInfo,
                              inversores: invertersArr,
                            });
                          }}
                          style={{ fontSize: "15px", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col pt-1">
              <h1 className="text-center bg-[#15599a] text-white font-bold w-full py-2">
                PAINÉIS
              </h1>
              <div className="grid grid-cols-7 gap-2 pt-3">
                <div className="flex items-center justify-center col-span-2">
                  <TextFloatingInput
                    label={"MARCA DOS PAINÉIS"}
                    editable={true}
                    value={moduleHolder.marca}
                    handleChange={(value) =>
                      setModuleHolder({ ...moduleHolder, marca: value })
                    }
                  />
                </div>
                <div className="flex items-center justify-center col-span-2">
                  <TextFloatingInput
                    label={"MODELO DOS PAINÉIS"}
                    editable={true}
                    value={moduleHolder.modelo}
                    handleChange={(value) =>
                      setModuleHolder({ ...moduleHolder, modelo: value })
                    }
                  />
                </div>
                <div className="flex items-center justify-center col-span-2">
                  <NumberFloatingInput
                    label={"QTDE DE PAINÉIS"}
                    editable={true}
                    value={moduleHolder.qtde}
                    handleChange={(value) =>
                      setModuleHolder({
                        ...moduleHolder,
                        qtde: Number(value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-center col-span-1">
                  <IoMdAddCircle
                    onClick={addModule}
                    style={{
                      color: "green",
                      fontSize: "25px",
                      cursor: "pointer",
                      marginBottom: "5px",
                    }}
                  />
                </div>
              </div>
              {errorMsg.module && (
                <p className="text-center text-red-500 italic">
                  {errorMsg.module}
                </p>
              )}
              {quotationInfo.modulos.length > 0 ? (
                <div className="flex flex-col w-full">
                  <h1 className="text-center font-bold text-[#15599a]">
                    MÓDULOS ADICIONADOS
                  </h1>
                  <div className="grid grid-cols-7 gap-2">
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      MARCA
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      MODELO
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      QTDE
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-1 text-center text-xs">
                      EXCLUIR
                    </h1>
                  </div>
                  {quotationInfo.modulos.map((module, index) => (
                    <div className="grid grid-cols-7 gap-2">
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {module.marca}
                      </h1>
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {module.modelo}
                      </h1>
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {module.qtde}
                      </h1>
                      <div className="flex items-center col-span-1 justify-center text-red-500">
                        <IoMdRemoveCircle
                          onClick={() => {
                            let modulesArr = quotationInfo.modulos;
                            modulesArr.splice(index, 1);
                            setQuotationInfo({
                              ...quotationInfo,
                              modulos: modulesArr,
                            });
                          }}
                          style={{ fontSize: "15px", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col pt-1">
              <h1 className="text-center bg-[#15599a] text-white font-bold w-full py-2">
                COMPONENTES
              </h1>
              <div className="w-full grid items-center grid-cols-8 gap-2 pt-3">
                <div className="flex items-center justify-center col-span-2">
                  <SelectFloatingInput
                    label={"INSUMO"}
                    editable={true}
                    width="100%"
                    value={componentHolder.insumo}
                    options={Object.keys(suprimentoOption).map((key) => {
                      return { label: key, value: key };
                    })}
                    handleChange={(value) =>
                      setComponentHolder({
                        ...componentHolder,
                        insumo: value,
                        tipo: suprimentoOption[value].tipo[0],
                        medida: suprimentoOption[value].unidade,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-center col-span-2">
                  <SelectFloatingInput
                    label={"TIPO"}
                    editable={true}
                    width="100%"
                    value={componentHolder.tipo}
                    options={suprimentoOption[componentHolder.insumo].tipo.map(
                      (tipo) => {
                        return { label: tipo, value: tipo };
                      }
                    )}
                    handleChange={(value) => {
                      setComponentHolder({
                        ...componentHolder,
                        tipo: value,
                      });
                    }}
                  />
                </div>
                <div className="flex items-center justify-center col-span-2">
                  <NumberFloatingInput
                    label={"QUANTIDADE"}
                    editable={true}
                    width="100%"
                    value={componentHolder.qtde}
                    handleChange={(value) =>
                      setComponentHolder({
                        ...componentHolder,
                        qtde: Number(value),
                      })
                    }
                  />
                </div>

                <p className="text-gray-600 text-xs text-center col-span-1">
                  {componentHolder.medida}
                </p>
                <div className="flex items-center justify-center col-span-1">
                  <IoMdAddCircle
                    onClick={addComponent}
                    style={{
                      color: "green",
                      fontSize: "25px",
                      cursor: "pointer",
                      marginBottom: "5px",
                    }}
                  />
                </div>
              </div>
              {errorMsg.component && (
                <p className="text-center text-red-500 italic">
                  {errorMsg.component}
                </p>
              )}
              {quotationInfo.componentes.length > 0 ? (
                <div className="flex flex-col w-full">
                  <h1 className="text-center font-bold text-[#15599a]">
                    COMPONENTES ADICIONADOS
                  </h1>
                  <div className="grid grid-cols-8 gap-2">
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      INSUMO
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      TIPO
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-2 text-center text-xs">
                      QUANTIDADE
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-1 text-center text-xs">
                      MEDIDA
                    </h1>
                    <h1 className="font-bold text-gray-700 col-span-1 text-center text-xs">
                      EXCLUIR
                    </h1>
                  </div>
                  {quotationInfo.componentes.map((module, index) => (
                    <div className="grid grid-cols-8 gap-2">
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {module.insumo}
                      </h1>
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {module.tipo}
                      </h1>
                      <h1 className=" text-gray-700 col-span-2 text-center text-xs">
                        {module.qtde}
                      </h1>
                      <h1 className=" text-gray-700 col-span-1 text-center text-xs">
                        {module.medida}
                      </h1>
                      <div className="flex items-center col-span-1 justify-center text-red-500">
                        <IoMdRemoveCircle
                          onClick={() => {
                            let componentesArr = quotationInfo.componentes;
                            componentesArr.splice(index, 1);
                            setQuotationInfo({
                              ...quotationInfo,
                              componentes: componentesArr,
                            });
                          }}
                          style={{ fontSize: "15px", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col pt-1">
              <h1 className="text-center bg-[#15599a] text-white font-bold w-full py-2">
                INFORMAÇÕES ADICIONAIS
              </h1>
              <div className="grid grid-cols-3 pt-3 gap-2">
                <SelectFloatingInput
                  label={"FORNECEDOR"}
                  editable={true}
                  options={fornecedores}
                  width="100%"
                  value={quotationInfo.fornecedor}
                  handleChange={(value) =>
                    setQuotationInfo({ ...quotationInfo, fornecedor: value })
                  }
                />
                <NumberFloatingInput
                  label={"POTÊNCIA PICO"}
                  editable={true}
                  width="100%"
                  value={quotationInfo.potPico}
                  handleChange={(value) =>
                    setQuotationInfo({
                      ...quotationInfo,
                      potPico: Number(value),
                    })
                  }
                />
                <NumberFloatingInput
                  label={"VALOR DO KIT"}
                  editable={true}
                  width="100%"
                  value={quotationInfo.valorDoKit}
                  handleChange={(value) =>
                    setQuotationInfo({
                      ...quotationInfo,
                      valorDoKit: Number(value),
                    })
                  }
                />
              </div>
            </div>
            {errorMsg.general ? (
              <p className="text-center italic text-red-500">
                {errorMsg.general}
              </p>
            ) : null}
            {insertQuotationMsg.text ? (
              <p className={`text-center italic ${insertQuotationMsg.color}`}>
                {insertQuotationMsg.text}
              </p>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  onClick={addNewQuotation}
                  className="p-2 rounded border-2 font-bold border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white hover:scale-105 ease-in-out duration-300"
                >
                  ABRIR NOVA COTAÇÃO
                </button>
              </div>
            )}
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalNovaCotacao;
