import React, { useState } from "react";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import { VscChromeClose } from "react-icons/vsc";
import TextFloatingInput from "./TextFloatingInput";
import DateInput from "./DateInput";
import dayjs from "dayjs";
import DateFloatingInput from "./DateFloatingInput";
import { AiOutlineMinus } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { FaProjectDiagram, FaSave } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
import OperationReportBlock from "./OperationReportBlock";

function ModalControlOperacao({ isOpen, setModalIsOpen, operation }) {
  const [operationMsg, setOperationMsg] = useState({ text: "", color: "" });

  const [operationInfo, setOperationInfo] = useState(operation);
  const [reportInfo, setReportInfo] = useState({
    nomeAtividade: null,
    atividades: [],
    anotacoes: "",
    data: new Date().toISOString(),
  });

  function resetOperationMsg() {
    setTimeout(() => {
      setOperationMsg({ text: "", color: "" });
    }, 2500);
  }

  async function updateOperation() {
    setOperationMsg({ text: "Processando...", color: "text-[#15599a]" });
    if (operationInfo.nome.trim().length < 5) {
      setOperationMsg({
        text: "Por favor, preencha um nome de ao menos 5 letras para a operação.",
        color: "text-red-500",
      });
      resetOperationMsg();
      return false;
    }
    if (!operationInfo.dataInicio) {
      setOperationMsg({
        text: "Por favor, preencha uma data de início para a operação.",
        color: "text-red-500",
      });
      resetOperationMsg();
      return false;
    }
    if (operationInfo.atividades.length == 0) {
      setOperationMsg({
        text: "Por favor, adicione ao menos uma atividade a essa operação.",
        color: "text-red-500",
      });
      resetOperationMsg();
      return false;
    }
    if (operationInfo.dataInicio && operationInfo.previsaoConclusao) {
      if (
        new Date(operationInfo.previsaoConclusao) <
        new Date(operationInfo.dataInicio)
      ) {
        setOperationInfo({
          text: "Por favor, especifique uma previsão de conclusão maior que a data de início.",
          color: "text-red-500",
        });
        return false;
      }
    }
    try {
      const { data } = await axios.put(`/api/operacoes`, operationInfo);
      if (data)
        setOperationMsg({
          text: "Atualizações feitas !",
          color: "text-green-500",
        });
      resetOperationMsg();
    } catch (error) {
      console.log(error);
      setOperationMsg({
        text: "Houve um erro nas alterações da operação.",
        color: "text-red-500",
      });
      resetOperationMsg();
    }
  }
  console.log(operationInfo);
  return (
    <>
      <AnimatedModalWrapper width={"90%"} height={"80%"} modalIsOpen={isOpen}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h1 className="font-bold text-[#15599a]">{operation.nome}</h1>
            <button>
              <VscChromeClose
                onClick={() => setModalIsOpen(false)}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex flex-col grow overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2">
            <h1 className="w-full p-1 text-center bg-[#15599a] text-white font-medium">
              INFORMAÇÕES GERAIS DA OPERAÇÃO
            </h1>
            <div className="w-full flex-col lg:flex-row flex gap-2 pt-4">
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col w-full">
                  <h1 className="text-gray-500 text-sm">NOME DA OPERAÇÃO</h1>
                  <p className="font-arial text-center text-sm border-b-2 border-gray-300 text-gray-700">
                    {operationInfo.nome}
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col w-full">
                  <h1 className="text-gray-500 text-sm">DESCRIÇÃO</h1>
                  <p className="font-arial text-center text-sm border-b-2 border-gray-300 text-gray-700">
                    {operationInfo.descricao}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex-col lg:flex-row flex gap-2 pt-4">
              <div className="w=full lg:w-1/2">
                <div className="flex flex-col w-full">
                  <h1 className="text-gray-500 text-sm">DATA DE INÍCIO</h1>
                  <p className="font-arial text-center text-sm border-b-2 border-gray-300 text-gray-700">
                    {new Date(operationInfo.dataInicio).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col w-full">
                  <h1 className="text-gray-500 text-sm">
                    PREVISÃO DE CONCLUSÃO
                  </h1>
                  <p className="font-arial text-center text-sm border-b-2 border-gray-300 text-gray-700">
                    {operationInfo.previsaoConclusao}
                  </p>
                </div>
              </div>
            </div>
            <h1 className="w-full p-1 text-center bg-[#15599a] text-white font-medium">
              ATIVIDADES
            </h1>
            <div className="w-full h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-[200px] max-h-[200px] flex flex-col overflow-y-auto overscroll-y-auto">
              {operationInfo.atividades.length > 0 ? (
                operationInfo.atividades.map((activity, index, arr) => (
                  <div
                    key={index}
                    className={`w-full items-start flex flex-col py-2 ${
                      arr.length > 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <div className="w-full items-start flex justify-around">
                      <p className="w-2/3 lg:w-1/4 text-gray-700 font-medium text-center">
                        {activity.nome}
                      </p>
                      <div className="hidden lg:flex w-1/4 items-center gap-2 text-gray-700 font-medium text-center">
                        <p className="hidden lg:block">INICIO EM:</p>
                        <p>
                          {activity.dataInicio
                            ? dayjs(activity.dataInicio)
                                .add(4, "hours")
                                .format("DD/MM/YYYY")
                            : "-"}
                        </p>
                      </div>
                      <div className="hidden lg:flex w-1/4 items-center gap-2 text-gray-700 font-medium text-center">
                        <p className="hidden lg:block">FIM EM:</p>
                        <p>
                          {activity.previsaoConclusao
                            ? dayjs(activity.previsaoConclusao)
                                .add(4, "hours")
                                .format("DD/MM/YYYY")
                            : "-"}
                        </p>
                      </div>
                      <div className="w-1/3 lg:w-1/4 flex items-center justify-center gap-4">
                        <button
                          onClick={() => {
                            setReportInfo((prev) => ({
                              ...prev,
                              nomeAtividade: activity.nome,
                            }));
                          }}
                          className="text-[#fead61] text-sm flex items-center justify-center hover:scale-110 duration-300 ease-in-out"
                        >
                          <TbReport
                            title="REPORTAR ATUALIZAÇÃO A ESSA ATIVIDADE"
                            style={{ fontSize: "15px" }}
                          />
                        </button>
                      </div>
                    </div>
                    {activity.subAtividades
                      ? activity.subAtividades.map((subActivity, subIndex) => (
                          <div
                            key={subIndex}
                            className="w-full items-start flex  justify-around"
                          >
                            <p className="w-2/3 lg:w-1/4 text-xs text-gray-500 text-center">
                              {subActivity.nome}
                            </p>

                            <p className="hidden lg:block w-1/4 text-xs text-gray-500 text-center">
                              {subActivity.dataInicio
                                ? `INICIO EM: ${dayjs(subActivity.dataInicio)
                                    .add(4, "hours")
                                    .format("DD/MM/YYYY")}`
                                : "-"}
                            </p>
                            <p className="hidden lg:block w-1/4 text-xs text-gray-500 text-center">
                              {subActivity.previsaoConclusao
                                ? `FIM EM: ${dayjs(
                                    subActivity.previsaoConclusao
                                  )
                                    .add(4, "hours")
                                    .format("DD/MM/YYYY")}`
                                : "-"}
                            </p>
                          </div>
                        ))
                      : null}
                  </div>
                ))
              ) : (
                <div className="grow w-full flex items-center justify-center py-2">
                  <p className="text-gray-500 italic font-medium">
                    Sem atividades vinculadas...
                  </p>
                </div>
              )}
            </div>
            <OperationReportBlock
              operationName={operationInfo.nome}
              operationId={operationInfo._id}
              data={reportInfo}
              setReportInfo={setReportInfo}
            />
          </div>
          <div className="w-full py-2 border-t border-gray-200 flex items-center justify-end justify-self-end">
            {operationMsg.text ? (
              <p className={`text-sm italic ${operationMsg.color}`}>
                {operationMsg.text}
              </p>
            ) : (
              <SaveButton
                text={"Salvar alterações"}
                icon={<FaSave />}
                handleClick={updateOperation}
              />
            )}
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalControlOperacao;
