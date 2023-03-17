import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import AnexoArquivo from "./AnexoArquivo";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import SaveButton from "./utils/Buttons/SaveButton";
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
function ModalCallSuprimentos({ setModalIsOpen, info, getCalls, modalIsOpen }) {
  const [modalInfo, setModalInfo] = useState(info);
  const [changes, setChanges] = useState({});
  const [message, setMessage] = useState({
    text: "",
    color: "",
  });
  function handleChanges() {
    axios
      .put("/api/calls/suprimentos/mainData", {
        id: info._id,
        mudancas: changes,
      })
      .then((res) => {
        setMessage({ text: "Alterações feitas", color: "text-green-500" });
        getCalls();
      });
  }
  function addLinks(arr) {
    setModalInfo({
      ...modalInfo,
      links: arr,
    });
    axios
      .put("/api/calls/suprimentos/mainData", {
        id: modalInfo._id,
        mudancas: {
          links: arr,
        },
      })
      .then(() => {
        setMessage({ text: "Link adicionado", color: "text-green-500" });
      });
  }
  function closeCall() {
    axios
      .put("/api/calls/suprimentos/mainData", {
        id: info._id,
        mudancas: { status: "FECHADO", fechamento: new Date().toISOString() },
      })
      .then((res) => {
        setModalInfo({ ...modalInfo, status: "FECHADO" });
        setMessage({ text: "Chamado finalizado !", color: "text-green-500" });
        getCalls();
      });
  }
  function reopenCall() {
    axios
      .put("/api/calls/suprimentos/mainData", {
        id: info._id,
        mudancas: { status: "ABERTO", fechamento: undefined },
      })
      .then((res) => {
        setModalInfo({ ...modalInfo, status: "ABERTO" });
        setMessage({ text: "Chamado finalizado !", color: "text-green-500" });
        getCalls();
      });
  }
  console.log("MODAL", modalInfo);
  return (
    <>
      <AnimatedModalWrapper
        modalIsOpen={modalIsOpen}
        width={"40%"}
        height={"87%"}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                #{modalInfo.codigoProjeto}-{modalInfo.nomeDoContrato}
              </h1>
              <p className="text-gray-500 text-center text-xs">
                #{modalInfo._id}
              </p>
            </div>
            <button>
              <VscChromeClose
                onClick={() => {
                  setMessage({ text: "", color: "" });
                  setModalIsOpen(false);
                }}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex flex-col gap-2 h-full overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 py-3">
            <div className="flex items-center justify-center gap-2 w-full  p-2">
              {modalInfo.status != "FECHADO" ? (
                <>
                  <h1
                    onClick={() => {
                      if (modalInfo.status != "ABERTO") {
                        setModalInfo({ ...modalInfo, status: "ABERTO" });
                        setChanges({ ...changes, status: "ABERTO" });
                      }
                    }}
                    className={`cursor-pointer text-sm font-bold text-yellow-500 border-2 border-yellow-500 p-2 rounded ${
                      modalInfo.status == "ABERTO"
                        ? "opacity-100"
                        : "opacity-30 hover::opacity-100"
                    }`}
                  >
                    ABERTO
                  </h1>
                  <h1
                    onClick={() => {
                      if (modalInfo.status != "EM ANDAMENTO") {
                        setModalInfo({
                          ...modalInfo,
                          status: "EM ANDAMENTO",
                        });
                        setChanges({ ...changes, status: "EM ANDAMENTO" });
                      }
                    }}
                    className={`cursor-pointer text-sm font-bold text-[#15599a] border-2 border-[#15599a] p-2 rounded ${
                      modalInfo.status == "EM ANDAMENTO"
                        ? "opacity-100"
                        : "opacity-30 hover::opacity-100"
                    }`}
                  >
                    EM ANDAMENTO
                  </h1>
                </>
              ) : (
                <h1
                  className={`text-sm font-bold text-green-500 border-2 border-green-500 p-2 rounded`}
                >
                  FECHADO
                </h1>
              )}
            </div>
            <div className="flex items-center justify-between w-full border-y border-gray-300 p-4">
              <h1 className="text-sm font-bold">FORNECEDOR</h1>
              <h1 className="text-sm font-bold text-[#15599a]">
                {modalInfo.fornecedor}
              </h1>
            </div>
            <div className="flex items-center justify-between w-full border-y border-gray-300 p-4">
              <h1 className="text-sm font-bold">DATA DE ENTREGA</h1>
              <h1 className="text-sm font-bold">
                {modalInfo.dataEntrega
                  ? `${dayjs().diff(
                      new Date(modalInfo.dataEntrega),
                      "day"
                    )} dias desde entrega`
                  : "-"}
              </h1>
              <h1 className="text-sm font-bold text-[#15599a]">
                {modalInfo.dataEntrega
                  ? dayjs(modalInfo.dataEntrega).format("DD/MM/YYYY")
                  : "-"}
              </h1>
            </div>
            <div className="flex items-center justify-between w-full border-y border-gray-300 p-4">
              <h1 className="text-sm font-bold">ENTREGA FALTANDO</h1>
              <h1 className="text-sm font-bold text-[#15599a]">
                {modalInfo.entregaFaltando ? "SIM" : "NÃO"}
              </h1>
            </div>
            <div className="flex items-center justify-between w-full border-y border-gray-300 p-4">
              <h1 className="text-sm font-bold">AVARIAS</h1>
              <h1 className="text-sm font-bold text-[#15599a]">
                {modalInfo.avarias ? "SIM" : "NÃO"}
              </h1>
            </div>
            <div className="flex flex-col gap-1 items-center mt-3">
              <h1 className="text-sm font-bold">MATERIAL DO KIT</h1>
              <textarea
                value={modalInfo.kitInfo}
                readOnly={true}
                className="h-[150px] w-full resize-none outline-none border border-gray-300  p-2 flex flex-col overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 text-center text-xs"
              />
            </div>
            <div className="flex flex-col gap-1 items-center mt-3">
              <h1 className="text-sm font-bold">MATERIAL FALTANTE</h1>
              <textarea
                value={modalInfo.materialFaltante}
                readOnly={true}
                className="h-[150px] w-full resize-none outline-none border border-gray-300  p-2 flex flex-col overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 text-center text-xs"
              />
            </div>
            <div className="flex flex-col gap-1 items-center mt-3">
              <h1 className="text-sm font-bold text-[#15599a]">
                OBSERVAÇÕES E ANOTAÇÕES
              </h1>
              <textarea
                value={modalInfo.observacao}
                onChange={(e) => {
                  setModalInfo({
                    ...modalInfo,
                    observacao: e.target.value,
                  });
                  setChanges({ ...changes, observacao: e.target.value });
                }}
                className="h-[150px] w-full resize-none outline-none border border-gray-300  p-2 flex flex-col overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 text-center text-xs"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-center text-[#15599a] my-2 font-bold">
                ADIÇÃO DE IMAGENS
              </h1>
              <AnexoArquivo
                id={modalInfo.idPai}
                prevLinks={
                  modalInfo.links
                    ? { chamadosSuprimentos: modalInfo.links }
                    : {}
                }
                client={`${modalInfo.nomeDoContrato}-${modalInfo.codigoProjeto}`}
                categories={[
                  {
                    label: "CHAMADOS DE SUPRIMENTOS",
                    value: "links.chamadosSuprimentos",
                  },
                ]}
                handleUpdates={(_, obj) => addLinks(obj)}
              />
              {modalInfo.links?.length > 0 && (
                <div className="flex flex-col">
                  <h1 className="text-center font-bold">IMAGENS ANEXADAS</h1>
                  <div className="flex flex-col items-center gap-1">
                    {modalInfo.links.map((obj, index2) => (
                      <a
                        className="text-xs text-[#15599a] font-bold text-center"
                        key={index2}
                        href={obj.link}
                      >
                        {obj.title} ({obj.format})
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {message.text && (
              <p className={`text-center ${message.color} text-xs italic`}>
                {message.text}
              </p>
            )}
            <SaveButton
              text={"SALVAR"}
              icon={<FaSave />}
              handleClick={handleChanges}
            />
            {modalInfo.status != "FECHADO" ? (
              <button
                onClick={() => closeCall()}
                className="mt-3 self-center rounded w-fit p-2 border border-green-500 text-green-500 hover:text-white hover:bg-green-500 hover:font-bold"
              >
                FINALIZAR CHAMADO
              </button>
            ) : (
              <button
                onClick={() => reopenCall()}
                className="mt-3 self-center rounded w-fit p-2 border border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500 hover:font-bold"
              >
                REABRIR CHAMADO
              </button>
            )}
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalCallSuprimentos;
