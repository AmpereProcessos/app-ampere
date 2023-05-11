import React, { useState } from "react";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import { VscChromeClose } from "react-icons/vsc";
import TextFloatingInput from "./TextFloatingInput";
import DateInput from "./DateInput";
import dayjs from "dayjs";
import DateFloatingInput from "./DateFloatingInput";
import { AiOutlineMinus } from "react-icons/ai";
import { FaProjectDiagram } from "react-icons/fa";

function ModalNovaOperacao({ isOpen, setModalIsOpen }) {
  const [activityMsg, setActivityMsg] = useState({ text: "", color: "" });

  const [operationInfo, setOperationInfo] = useState({
    nome: "",
    descricao: "",
    dataInicio: new Date().toISOString(),
    previsaoConclusao: null,
    atividades: [],
  });
  const [activityHolder, setActivityHolder] = useState({
    nome: "",
    descricao: "",
    dataInicio: null,
    previsaoConclusao: null,
  });
  const [subactivityHolder, setSubactivityHolder] = useState({
    activityIndex: null,
    info: {
      nome: "",
      dataInicio: new Date().toISOString(),
      previsaoConclusao: new Date().toISOString(),
      progresso: 0,
    },
  });
  function addActivity() {
    var activities = operationInfo.atividades;
    if (activityHolder.nome.trim().length < 4) {
      setActivityMsg({
        text: "Por favor, dê um nome de ao menos 3 letras a atividade.",
        color: "text-red-500",
      });
      return false;
    }
    if (!activityHolder.dataInicio) {
      setActivityMsg({
        text: "Por favor, especifique uma data de início para a atividade.",
        color: "text-red-500",
      });
      return false;
    }
    if (activityHolder.dataInicio && activityHolder.previsaoConclusao) {
      if (
        new Date(activityHolder.previsaoConclusao) <
        new Date(activityHolder.dataInicio)
      ) {
        setActivityMsg({
          text: "Por favor, especifique uma previsão de conclusão maior que a data de início.",
          color: "text-red-500",
        });
        return false;
      }
    }
    setActivityMsg({ text: "", color: "" });
    activities.push({
      ...activityHolder,
      nome: activityHolder.nome.toUpperCase(),
    });
    setOperationInfo((prev) => ({ ...prev, atividades: activities }));
    setActivityHolder((prev) => ({
      nome: "",
      descricao: "",
      dataInicio: new Date().toISOString(),
      previsaoConclusao: undefined,
    }));
  }
  function removeActivity(index) {
    var activities = operationInfo.atividades;
    activities.splice(index, 1);
    setOperationInfo((prev) => ({ ...prev, atividades: activities }));
  }

  return (
    <>
      <AnimatedModalWrapper width={"90%"} height={"80%"} modalIsOpen={isOpen}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h1 className="font-bold text-[#15599a]">NOVA OPERAÇÃO</h1>
            <button>
              <VscChromeClose
                onClick={() => setModalIsOpen(false)}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex flex-col grow overflow-y-auto overscroll-y-auto">
            <h1 className="w-full p-1 text-center bg-[#15599a] text-white font-medium">
              INFORMAÇÕES GERAIS DA OPERAÇÃO
            </h1>
            <div className="w-full flex gap-2 pt-4">
              <div className="w-1/2">
                <TextFloatingInput
                  label={"NOME DA OPERAÇÃO"}
                  editable={true}
                  value={operationInfo.nome}
                  handleChange={(value) =>
                    setOperationInfo((prev) => ({ ...prev, nome: value }))
                  }
                  width={"100%"}
                />
              </div>
              <div className="w-1/2">
                <TextFloatingInput
                  label={"DESCRIÇÃO"}
                  editable={true}
                  value={operationInfo.descricao}
                  handleChange={(value) =>
                    setOperationInfo((prev) => ({ ...prev, descricao: value }))
                  }
                  width={"100%"}
                />
              </div>
            </div>
            <div className="w-full flex gap-2 pt-4">
              <div className="w-1/2">
                <DateFloatingInput
                  label={"DATA DE INÍCIO"}
                  editable={true}
                  value={
                    operationInfo.dataInicio
                      ? dayjs(operationInfo.dataInicio)
                          .add(4, "hours")
                          .format("YYYY-MM-DD")
                      : null
                  }
                  handleChange={(value) =>
                    setOperationInfo((prev) => ({
                      ...prev,
                      dataInicio: value,
                    }))
                  }
                  width={"100%"}
                />
              </div>
              <div className="w-1/2">
                <DateFloatingInput
                  label={"PREVISÃO DE CONCLUSÃO"}
                  editable={true}
                  value={
                    operationInfo.previsaoConclusao
                      ? dayjs(operationInfo.previsaoConclusao)
                          .add(4, "hours")
                          .format("YYYY-MM-DD")
                      : null
                  }
                  handleChange={(value) =>
                    setOperationInfo((prev) => ({
                      ...prev,
                      previsaoConclusao: value,
                    }))
                  }
                  width={"100%"}
                />
              </div>
            </div>
            <h1 className="w-full p-1 text-center bg-[#15599a] text-white font-medium">
              ATIVIDADES
            </h1>
            <div className="w-full h-[150px] max-h-[150px] flex flex-col overflow-y-auto overscroll-y-auto">
              {operationInfo.atividades.length > 0 ? (
                operationInfo.atividades.map((activity, index, arr) => (
                  <div
                    className={`w-full flex justify-around py-2 ${
                      arr.length > 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <p className="w-1/4 text-sm text-gray-500 text-center">
                      {activity.nome}
                    </p>
                    <p className="w-1/4 text-sm text-gray-500 text-center">
                      {activity.dataInicio
                        ? `INICIO EM: ${dayjs(activity.dataInicio)
                            .add(4, "hours")
                            .format("DD/MM/YYYY")}`
                        : "-"}
                    </p>
                    <p className="w-1/4 text-sm text-gray-500 text-center">
                      {activity.previsaoConclusao
                        ? `FIM EM: ${dayjs(activity.previsaoConclusao)
                            .add(4, "hours")
                            .format("DD/MM/YYYY")}`
                        : "-"}
                    </p>
                    <div className="w-1/4 flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          setSubactivityHolder((prev) => ({
                            ...prev,
                            activityIndex: index,
                          }))
                        }
                        className="text-[#fead61] text-sm flex items-center justify-center"
                      >
                        <FaProjectDiagram
                          title="ADICIONAR SUBTAREFA"
                          style={{ fontSize: "15px" }}
                        />
                      </button>
                      <button
                        onClick={() => removeActivity(index)}
                        className="text-red-500 text-sm flex items-center justify-center"
                      >
                        <AiOutlineMinus style={{ fontSize: "15px" }} />
                      </button>
                    </div>
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
            {activityMsg.text ? (
              <p
                className={`w-full text-center text-sm italic ${activityMsg.color}`}
              >
                {activityMsg.text}
              </p>
            ) : (
              <p className="h-[21px] w-full"></p>
            )}
            <div className="w-full flex pt-4">
              <div className="w-[90%] flex  items-center gap-2 ">
                <div className="w-2/6">
                  <TextFloatingInput
                    label={"NOME DA ATIVIDADE"}
                    editable={true}
                    value={activityHolder.nome}
                    handleChange={(value) =>
                      setActivityHolder((prev) => ({ ...prev, nome: value }))
                    }
                    width={"100%"}
                  />
                </div>
                <div className="w-2/6">
                  <TextFloatingInput
                    label={"DESCRIÇÃO DA ATIVIDADE"}
                    width={"100%"}
                    editable={true}
                    value={activityHolder.descricao}
                    handleChange={(value) =>
                      setActivityHolder((prev) => ({
                        ...prev,
                        descricao: value,
                      }))
                    }
                  />
                </div>
                <div className="w-1/6">
                  <DateFloatingInput
                    label={"INÍCIO DA ATIVIDADE"}
                    width={"100%"}
                    editable={true}
                    value={
                      activityHolder.dataInicio
                        ? dayjs(activityHolder.dataInicio)
                            .add(4, "hours")
                            .format("YYYY-MM-DD")
                        : null
                    }
                    handleChange={(value) =>
                      setActivityHolder((prev) => ({
                        ...prev,
                        dataInicio: value,
                      }))
                    }
                  />
                </div>
                <div className="w-1/6">
                  <DateFloatingInput
                    label={"PREVISÃO DA CONCLUSÃO"}
                    width={"100%"}
                    editable={true}
                    value={
                      activityHolder.previsaoConclusao
                        ? dayjs(activityHolder.previsaoConclusao)
                            .add(4, "hours")
                            .format("YYYY-MM-DD")
                        : null
                    }
                    handleChange={(value) =>
                      setActivityHolder((prev) => ({
                        ...prev,
                        previsaoConclusao: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-[10%] flex items-start justify-center">
                <button
                  onClick={addActivity}
                  className="bg-green-300 hover:bg-green-500 hover:text-white hover:scale-105 duration-300 ease-in-out font-medium text-sm p-3 rounded"
                >
                  ADD
                </button>
              </div>
            </div>
            <h1 className="w-full p-1 text-center bg-[#15599a] text-white font-medium">
              SUBTAREFAS
            </h1>
            {subactivityHolder.activityIndex != null ? (
              <div className="w-full flex pt-4">
                <div className="w-[90%] flex  items-center gap-2 ">
                  <div className="w-4/6">
                    <TextFloatingInput
                      label={"NOME DA ATIVIDADE"}
                      editable={true}
                      value={subactivityHolder.info.nome}
                      handleChange={(value) =>
                        setSubactivityHolder((prev) => ({
                          ...prev,
                          info: { ...prev.info, nome: value },
                        }))
                      }
                      width={"100%"}
                    />
                  </div>
                  <div className="w-1/6">
                    <DateFloatingInput
                      label={"INÍCIO DA ATIVIDADE"}
                      width={"100%"}
                      editable={true}
                      value={
                        subactivityHolder.info.dataInicio
                          ? dayjs(subactivityHolder.info.dataInicio)
                              .add(4, "hours")
                              .format("YYYY-MM-DD")
                          : null
                      }
                      handleChange={(value) =>
                        setSubactivityHolder((prev) => ({
                          ...prev,
                          info: { ...prev.info, dataInicio: value },
                        }))
                      }
                    />
                  </div>
                  <div className="w-1/6">
                    <DateFloatingInput
                      label={"PREVISÃO DA CONCLUSÃO"}
                      width={"100%"}
                      editable={true}
                      value={
                        subactivityHolder.info.previsaoConclusao
                          ? dayjs(subactivityHolder.info.previsaoConclusao)
                              .add(4, "hours")
                              .format("YYYY-MM-DD")
                          : null
                      }
                      handleChange={(value) =>
                        setSubactivityHolder((prev) => ({
                          ...prev,
                          info: { ...prev.info, previsaoConclusao: value },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="w-[10%] flex items-start justify-center">
                  <button
                    onClick={addActivity}
                    className="bg-green-300 hover:bg-green-500 hover:text-white hover:scale-105 duration-300 ease-in-out font-medium text-sm p-3 rounded"
                  >
                    ADD
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalNovaOperacao;
