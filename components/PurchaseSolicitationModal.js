import React, { useState } from "react";
import AnimatedModalWrapper from "../components/utils/AnimatedModalWrapper";
import { VscChromeClose } from "react-icons/vsc";
import TextFloatingInput from "./TextFloatingInput";
import { AiFillEye, AiOutlineCalendar } from "react-icons/ai";
import dayjs from "dayjs";
import { BsCalendarCheckFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
function PurchaseSolicitationModal({ info, closeModal, isOpen }) {
  const [infoHolder, setInfo] = useState(info);
  console.log(infoHolder);
  return (
    <AnimatedModalWrapper modalIsOpen={isOpen} width={"50%"} height={"90%"}>
      <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
        <div className="w-full flex items-center justify-between pb-2 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <h1 className="text-sm lg:text-lg font-bold text-[#15599a]">
              SOLICITAÇÃO DE COMPRA
            </h1>
            <p className="hidden lg:block text-xs text-gray-500">#{info._id}</p>
          </div>
          <button
            onClick={closeModal}
            className="hover:bg-red-200 rounded-lg p-1 text-red-500"
          >
            <VscChromeClose />
          </button>
        </div>
        <div className="w-full py-2 grow flex flex-col overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex items-center w-full justify-center gap-4 pb-4">
            <div className="flex flex-col items-center">
              <h1 className="text-start text-gray-500 text-xs font-medium">
                SOLICITAÇÃO FEITA EM:
              </h1>
              <div className="flex items-center gap-2">
                <AiOutlineCalendar style={{ color: "#15599a" }} />
                <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                  {info.dataSolicitacao
                    ? dayjs(info.dataSolicitacao).format("DD/MM/YY HH:mm")
                    : null}
                </h1>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-end text-gray-500 text-xs font-medium">
                PRAZO:
              </h1>
              <div className="flex items-center justify-end gap-2">
                <BsCalendarCheckFill style={{ color: "#ef233c" }} />
                <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                  {info.prazo
                    ? dayjs(info.prazo).format("DD/MM/YY HH:mm")
                    : "NÃO DEFINIDO"}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center w-full pb-4">
            <div className="w-full lg:w-[50%]">
              <TextFloatingInput
                label={"REQUISITANTE"}
                editable={false}
                value={infoHolder.requisitante}
                handleChange={(value) =>
                  setInfo((prev) => ({ ...prev, requisitante: value }))
                }
                width={"100%"}
              />
            </div>
            <div className="w-full lg:w-[50%]">
              <TextFloatingInput
                label={"TELEFONE PARA CONTATO"}
                editable={false}
                value={infoHolder.telefone}
                handleChange={(value) =>
                  setInfo((prev) => ({ ...prev, telefone: value }))
                }
                width={"100%"}
              />
            </div>
          </div>
          <div className="w-full">
            <TextFloatingInput
              label={"MOTIVO"}
              editable={false}
              value={info.motivo}
              handleChange={(value) =>
                setInfo((prev) => ({ ...prev, motivo: value }))
              }
              width={"100%"}
            />
          </div>
          <div className="grow flex flex-col">
            <h1 className="text-[#fead61] text-center font-bold pb-2">ITENS</h1>
            <div className="flex items-center w-full bg-black rounded-tr-sm rounded-tl-sm">
              <h1 className="w-1/4 text-center text-xs lg:text-base text-white font-medium p-2">
                NOME
              </h1>
              <h1 className="w-1/4 text-center text-xs lg:text-base text-white font-medium p-2">
                QTDE
              </h1>
              <h1 className="w-1/4 text-center text-xs lg:text-base text-white font-medium p-2">
                COTAÇÃO
              </h1>
              <h1 className="w-1/4 text-center text-xs lg:text-base text-white font-medium p-2">
                AÇÕES
              </h1>
            </div>
            {infoHolder.itens?.map((item, index) => (
              <div
                key={index}
                className="flex items-center w-full bg-gray-50 rounded-tr-sm rounded-tl-sm"
              >
                <h1 className="w-1/4 text-center text-xs text-gray-700 font-medium p-1">
                  {item.nome}
                </h1>
                <div className="w-1/4 p-1">
                  <input
                    value={item.qtde.toString()}
                    onChange={(e) => {
                      const list = infoHolder.itens;
                      list[index].qtde = Number(e.target.value);
                      setInfo((prev) => ({ ...prev, itens: list }));
                    }}
                    type="number"
                    className="outline-none text-center text-xs text-gray-700 h-full w-full bg-transparent"
                  />
                </div>
                <div className="w-1/4 p-1">
                  <input
                    value={item.cotacao ? item.cotacao.toString() : null}
                    onChange={(e) => {
                      const list = infoHolder.itens;
                      list[index].cotacao = Number(e.target.value);
                      setInfo((prev) => ({ ...prev, itens: list }));
                    }}
                    type="number"
                    className="outline-none text-center text-xs text-gray-700 h-full w-full bg-transparent"
                  />
                </div>
                <div className="w-1/4 flex items-center justify-center font-medium p-1 gap-4">
                  <AiFillEye style={{ color: "#fead61" }} />
                  <MdCancel style={{ color: "red" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedModalWrapper>
  );
}

export default PurchaseSolicitationModal;
