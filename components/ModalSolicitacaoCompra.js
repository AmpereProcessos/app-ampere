import React, { useState } from "react";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import { VscChromeClose } from "react-icons/vsc";
import TextFloatingInput from "./TextFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import { AiOutlineCalendar } from "react-icons/ai";
import dayjs from "dayjs";
import { BsCalendarCheckFill, BsFillCalendarXFill } from "react-icons/bs";
import PurchaseSolicitationItemRow from "./LinhaItemSolicitacaoCompra";
import SaveButton from "./utils/Buttons/SaveButton";
import { FaSave } from "react-icons/fa";
import axios from "axios";
function PurchaseSolicitationModal({
  info,
  closeModal,
  isOpen,
  getSolicitations,
}) {
  const [infoHolder, setInfo] = useState(info);
  const [msg, setMsg] = useState({ text: "", color: "" });
  async function handleChange() {
    setMsg({ text: "Processando...", color: "text-[#15599a]" });
    try {
      const { data } = await axios.put("/api/solicitacoes/compra", {
        id: info._id,
        changes: infoHolder,
      });
      setMsg({ text: "Alterações feitas!", color: "text-green-500" });
      getSolicitations();
    } catch (error) {
      setMsg({ text: "Erro ao atualizar solicitação.", color: "text-red-500" });
    }
  }
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
          <div className="flex flex-wrap items-center w-full justify-center gap-4 pb-4">
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
                <BsCalendarCheckFill style={{ color: "rgb(249,115,22)" }} />
                <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                  {info.prazo
                    ? dayjs(info.prazo).format("DD/MM/YY HH:mm")
                    : info.urgencia}
                </h1>
              </div>
            </div>
            {infoHolder.dataResposta ? (
              <div className="flex flex-col items-center">
                <h1 className="text-end text-gray-500 text-xs font-medium">
                  {infoHolder.aprovacao ? " APROVAÇÃO EM:" : "REJEITADA EM:"}
                </h1>
                <div className="flex items-center justify-end gap-2">
                  {infoHolder.aprovacao ? (
                    <BsCalendarCheckFill
                      style={{
                        color: "rgb(34,197,94)",
                      }}
                    />
                  ) : (
                    <BsFillCalendarXFill
                      style={{
                        color: "#ef233c",
                      }}
                    />
                  )}

                  <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                    {infoHolder.dataResposta
                      ? dayjs(infoHolder.dataResposta).format("DD/MM/YY HH:mm")
                      : "NÃO DEFINIDO"}
                  </h1>
                </div>
              </div>
            ) : null}
          </div>
          <div className="w-full flex items-center justify-center pb-4">
            <SelectFloatingInput
              label={"STATUS"}
              editable={true}
              value={infoHolder.status ? infoHolder.status : "EM ABERTO"}
              options={[
                { label: "EM ABERTO", value: "EM ABERTO" },
                { label: "EM ANDAMENTO", value: "EM ANDAMENTO" },
                {
                  label: "AGUARDANDO APROVAÇÃO",
                  value: "AGUARDANDO APROVAÇÃO",
                },
                { label: "COMPRA REALIZADA", value: "COMPRA REALIZADA" },
                { label: "EM ROTA", value: "EM ROTA" },
                { label: "FINALIZADO", value: "FINALIZADO" },
              ]}
              handleChange={(value) =>
                setInfo((prev) => ({ ...prev, status: value }))
              }
              width={"50%"}
            />
          </div>
          <div className="flex flex-col gap-4 lg:flex-row items-center w-full pb-4">
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
          <div className="flex flex-col w-full gap-1">
            <h1 className="text-sm text-gray-900 scale-75 w-full text-center">
              ANOTAÇÕES
            </h1>
            <textarea
              value={infoHolder.anotacoes}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, anotacoes: e.target.value }))
              }
              placeholder="Anotações sobre a compra, detalhes sobre aprovação e outras informações relevantes..."
              className="outline-none resize-none text-sm border border-gray-200 bg-gray-100 h-[90px] p-1 text-center"
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
              <PurchaseSolicitationItemRow
                index={index}
                infoHolder={infoHolder}
                item={item}
                setInfo={setInfo}
                key={index}
              />
            ))}
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              {infoHolder.aprovacao == undefined ||
              infoHolder.aprovacao == true ? (
                <button
                  onClick={() =>
                    setInfo((prev) => ({
                      ...prev,
                      aprovacao: false,
                      dataResposta: new Date().toISOString(),
                    }))
                  }
                  className="bg-red-300 hover:bg-red-500 hover:text-black p-2 text-sm rounded font-bold text-white"
                >
                  REJEITAR
                </button>
              ) : null}
              {infoHolder.aprovacao == undefined || !infoHolder.aprovacao ? (
                <button
                  onClick={() =>
                    setInfo((prev) => ({
                      ...prev,
                      aprovacao: true,
                      dataResposta: new Date().toISOString(),
                    }))
                  }
                  className="bg-green-300 hover:bg-green-500 p-2 text-sm rounded font-bold text-white"
                >
                  APROVAR
                </button>
              ) : null}
            </div>
            <div className="flex items-center justify-center gap-4">
              {msg.text ? (
                <p className={`text-sm italic ${msg.color}`}>{msg.text}</p>
              ) : null}
              <SaveButton
                handleClick={handleChange}
                icon={<FaSave />}
                text={"SALVAR"}
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedModalWrapper>
  );
}

export default PurchaseSolicitationModal;
