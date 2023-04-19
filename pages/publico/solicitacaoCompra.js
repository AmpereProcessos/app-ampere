import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import Logo from "../../utils/whitelogoHD.png";
import SelectFloatingInput from "../../components/SelectFloatingInput";
import TextFloatingInput from "../../components/TextFloatingInput";
import NumberFloatingInput from "../../components/NumberFloatingInput";
import { FiCheckCircle } from "react-icons/fi";
import DateFloatingInput from "../../components/DateFloatingInput";
import Image from "next/image";
import dayjs from "dayjs";
import { MdCancel, MdSmsFailed } from "react-icons/md";
import axios from "axios";

function SolicitacaoCompra() {
  const [solicitationInfo, setSolicitationInfo] = useState({
    requisitante: "",
    telefone: "",
    motivo: "",
    prazo: null,
    itens: [],
  });
  const [itemHolder, setItemHolder] = useState({
    nome: "",
    qtde: 0,
    descricao: "",
  });
  const [itemsMsg, setItemsMsg] = useState({ text: "", color: "" });
  const [sendMsg, setSendMsg] = useState({
    status: null,
    text: "",
    color: "",
  });
  function reset() {
    setSolicitationInfo({
      requisitante: "",
      telefone: "",
      motivo: "",
      prazo: null,
      itens: [],
    });
    setSendMsg({
      status: null,
      text: "",
      color: "",
    });
  }

  async function sendSolicitation() {
    setSendMsg({ text: "Processando...", color: "text-[#155991]" });
    if (solicitationInfo.requisitante.trim().length < 5) {
      setSendMsg({
        status: null,
        text: "Por favor, preencha um nome válido.",
        color: "text-red-500",
      });
      return false;
    }
    if (solicitationInfo.telefone.trim().length < 10) {
      setSendMsg({
        status: null,
        text: "Por favor, preencha um telefone para contato.",
        color: "text-red-500",
      });
      return false;
    }
    if (solicitationInfo.itens.length == 0) {
      setSendMsg({
        status: null,
        text: "Por favor, adicione os itens da solicitação.",
        color: "text-red-500",
      });
      return false;
    }
    setSendMsg((prev) => ({
      status: "loading",
      text: "Enviando...",
      color: "text-[#15999a]",
    }));
    try {
      await axios.post("/api/solicitacoes/compra", solicitationInfo);
      setSendMsg({
        status: "success",
        text: "Solicitação enviada com sucesso. O prazo para avaliação da solicitação é de 24 horas.",
        color: "text-green-500",
      });
      setSolicitationInfo({
        requisitante: "",
        telefone: "",
        motivo: "",
        prazo: null,
        itens: [],
      });
    } catch (error) {
      setSendMsg({
        status: "failure",
        text: "Ocorreu um erro no envio da solicitação, por favor tente novamente.",
        color: "text-red-500",
      });
    }
  }

  function addItens() {
    if (itemHolder.nome.trim().length < 2) {
      setItemsMsg({
        text: "Por favor, adicione um nome de item válido.",
        color: "text-red-500",
      });
      return;
    }
    if (itemHolder.qtde < 0) {
      setItemsMsg({
        text: "Por favor, adicione um quantidade de item válida.",
        color: "text-red-500",
      });
      return;
    }
    var currentItensArr = [...solicitationInfo.itens];
    currentItensArr.push(itemHolder);
    setSolicitationInfo((prev) => ({ ...prev, itens: currentItensArr }));
    setItemHolder({ nome: "", qtde: 0, descricao: "" });
  }
  function formatPhone(value) {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  }
  return (
    <div className="p-6 grow flex flex-col bg-[#15599a] items-center">
      {sendMsg.status ? (
        <div className="w-[90%] h-[100%] bg-[#fff] rounded-lg flex flex-col justify-center border border-gray-300 shadow-lg p-2 items-center">
          {sendMsg.status == "loading" ? (
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
          ) : null}
          {sendMsg.status == "failure" ? (
            <MdSmsFailed style={{ fontSize: "45px", color: "red" }} />
          ) : null}
          {sendMsg.status == "success" ? (
            <FiCheckCircle style={{ fontSize: "45px", color: "green" }} />
          ) : null}
          <h1
            className={`text-lg text-center italic ${sendMsg.color} font-medium mt-2`}
          >
            {sendMsg.text}
          </h1>
          {sendMsg.status != "loading" ? (
            <button
              onClick={reset}
              className="text-[#15559a] border border-[#15599a] font-medium p-2 rounded-md mt-4 hover:bg-[#15599a] hover:text-white"
            >
              NOVA SOLICITAÇÃO
            </button>
          ) : null}
        </div>
      ) : (
        <div className="w-[90%] h-[100%] bg-[#fff] rounded-lg flex flex-col border border-gray-300 shadow-lg p-2 items-center">
          <div className="flex items-center justify-center h-[80px]">
            <Image height={"80px"} width={"80px"} src={Logo} objectFit="fill" />
          </div>
          <h1 className="w-full text-center text-[#15599a] text-2xl font-bold">
            SOLICITAÇÃO DE COMPRA
          </h1>
          <div className="grow w-full flex flex-col items-center">
            <h1 className="text-[#fead61] font-bold text-center my-4">
              INFORMAÇÕES GERAIS
            </h1>
            <TextFloatingInput
              label={"NOME COMPLETO"}
              value={solicitationInfo.requisitante}
              handleChange={(value) =>
                setSolicitationInfo((prev) => ({
                  ...prev,
                  requisitante: value,
                }))
              }
              editable={true}
              notDefinedOption={true}
              width={"50%"}
            />
            <TextFloatingInput
              label={"TELEFONE PARA CONTATO"}
              value={solicitationInfo.telefone}
              handleChange={(value) =>
                setSolicitationInfo((prev) => ({
                  ...prev,
                  telefone: formatPhone(value),
                }))
              }
              editable={true}
              notDefinedOption={true}
              width={"50%"}
            />
            <TextFloatingInput
              label={"MOTIVO DA SOLICITAÇÃO"}
              value={solicitationInfo.motivo}
              editable={true}
              handleChange={(value) =>
                setSolicitationInfo((prev) => ({ ...prev, motivo: value }))
              }
              width={"50%"}
            />
            <div
              className={`flex flex-col relative font-mono items-center z-0 w-full lg:w-[50%] text-center mb-6 group`}
            >
              <input
                value={
                  solicitationInfo.prazo
                    ? dayjs(solicitationInfo.prazo).format("YYYY-MM-DDTHH:mm")
                    : null
                }
                onChange={(e) => {
                  console.log(dayjs(e.target.value).format("YYYY-MM-DDTHH:MM"));
                  setSolicitationInfo((prev) => ({
                    ...prev,
                    prazo: new Date(e.target.value).toISOString(),
                  }));
                }}
                type="datetime-local"
                name={"prazo"}
                id={"prazo"}
                className="flex py-2.5 z-1 items-center justify-center text-center px-0 w-full bg-[#fff] text-sm text-gray-900 border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />

              <label
                htmlFor={"datahora"}
                className="peer-focus:font-medium z-2 absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                PARA QUANDO ?
              </label>
            </div>
            <h1 className="text-[#fead61] font-bold text-center mt-4">ITENS</h1>
            <p className="text-xs text-[#15599a] italic text-center mb-4">
              Preencha as informações sobre o item e clique em{" "}
              <strong className="text-green-500">adicionar.</strong>
            </p>
            <div className="w-full flex-col lg:flex-row flex items-center gap-4">
              <div className="lg:w-[90%] w-full flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-[50%]">
                    <TextFloatingInput
                      label={"NOME DO ITEM"}
                      width={"100%"}
                      editable={true}
                      value={itemHolder.nome}
                      handleChange={(value) =>
                        setItemHolder((prev) => ({ ...prev, nome: value }))
                      }
                    />
                  </div>
                  <div className="w-[50%]">
                    <NumberFloatingInput
                      label={"QUANTIDADE"}
                      width={"100%"}
                      editable={true}
                      value={itemHolder.qtde.toString()}
                      handleChange={(value) =>
                        setItemHolder((prev) => ({
                          ...prev,
                          qtde: Number(value),
                        }))
                      }
                    />
                  </div>
                </div>
                <textarea
                  value={itemHolder.descricao}
                  onChange={(e) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Descreva aqui a finalidade do item (uso próprio ou venda), características do item, lugares específico pra compra e outras informações relevantes..."
                  className="w-full resize-none border border-gray-300 outline-none text-xs text-center h-[100px] lg:h-[70px] p-2"
                />
              </div>
              <div className="w-full lg:w-[10%] flex items-center justify-center">
                <button onClick={addItens} className="text-green-500 text-2xl">
                  <IoMdAddCircle />
                </button>
              </div>
            </div>
            {itemsMsg.text ? (
              <p
                className={`w-full text-center ${itemsMsg.color} italic text-sm my-1`}
              >
                {itemsMsg.text}
              </p>
            ) : null}
            {solicitationInfo.itens.length > 0 ? (
              <div className="flex flex-col w-full items-center mt-4">
                <div className="w-full flex items-center gap-2 bg-black">
                  <h1 className="w-1/3 text-white text-center p-1 font-medium">
                    NOME
                  </h1>
                  <h1 className="w-1/3 text-white text-center p-1 font-medium">
                    QTDE
                  </h1>
                  <h1 className="w-1/3 text-white text-center p-1 font-medium">
                    EXCLUIR
                  </h1>
                </div>
                {solicitationInfo.itens.map((item, index) => (
                  <div key={index} className="w-full flex items-center gap-2">
                    <h1 className="w-1/3 text-center p-1 font-medium">
                      {item.nome}
                    </h1>
                    <h1 className="w-1/3 text-center p-1 font-medium">
                      {item.qtde}
                    </h1>
                    <div className="flex items-center justify-center text-red-500 w-1/3">
                      <MdCancel
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          let items = solicitationInfo.itens;
                          items.splice(index, 1);
                          setSolicitationInfo((prev) => ({
                            ...prev,
                            itens: items,
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="w-full flex items-center justify-end gap-2">
            {sendMsg.text ? (
              <p className={`text-sm italic ${sendMsg.color}`}>
                {sendMsg.text}
              </p>
            ) : null}
            <button
              onClick={sendSolicitation}
              className="p-2 bg-green-500 text-white rounded font-bold"
            >
              ENVIAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SolicitacaoCompra;
