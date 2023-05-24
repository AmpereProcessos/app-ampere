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
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
import { equipesTecnicas, formatDate } from "../utils/constants";
import SelectFoatingInput from "./SelectFloatingInput";

function ModalEdicaoOperacao({ isOpen, setModalIsOpen, operation }) {
  const [operationMsg, setOperationMsg] = useState({ text: "", color: "" });
  const [activityMsg, setActivityMsg] = useState({ text: "", color: "" });
  const [subActivityMsg, setSubActivityMsg] = useState({ text: "", color: "" });

  const [operationInfo, setOperationInfo] = useState(operation);
  const [activityHolder, setActivityHolder] = useState({
    nome: "",
    descricao: "",
    dataInicio: new Date().toISOString(),
    previsaoConclusao: null,
  });
  const [subactivityHolder, setSubactivityHolder] = useState({
    activityIndex: null,
    info: {
      nome: "",
      dataInicio: new Date().toISOString(),
      previsaoConclusao: null,
    },
  });

  function resetOperationMsg() {
    setTimeout(() => {
      setOperationMsg({ text: "", color: "" });
    }, 2500);
  }
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
    if (
      new Date(activityHolder.dataInicio) < new Date(operationInfo.dataInicio)
    ) {
      setActivityMsg({
        text: "Por favor, especifique uma data de início maior ou igual a data de início da operação.",
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
  function addSubActivity(activityIndex) {
    const activities = [...operationInfo.atividades];

    var subactivityArr = activities[activityIndex].subAtividades
      ? activities[activityIndex].subAtividades
      : [];
    if (subactivityHolder.info.nome.trim().length < 4) {
      setSubActivityMsg({
        text: "Por favor, dê um nome de ao menos 3 letras a atividade.",
        color: "text-red-500",
      });
      return false;
    }
    if (!subactivityHolder.info.dataInicio) {
      setSubActivityMsg({
        text: "Por favor, especifique uma data de início para a atividade.",
        color: "text-red-500",
      });
      return false;
    }
    if (
      subactivityHolder.info.dataInicio &&
      subactivityHolder.info.previsaoConclusao
    ) {
      if (
        new Date(subactivityHolder.info.previsaoConclusao) <
        new Date(subactivityHolder.info.dataInicio)
      ) {
        setSubActivityMsg({
          text: "Por favor, especifique uma previsão de conclusão maior que a data de início.",
          color: "text-red-500",
        });
        return false;
      }
    }
    setActivityMsg({ text: "", color: "" });
    subactivityArr.push({
      ...subactivityHolder.info,
      nome: subactivityHolder.info.nome.toUpperCase(),
    });
    activities[activityIndex].subAtividades = subactivityArr;
    setOperationInfo((prev) => ({ ...prev, atividades: activities }));
    setSubactivityHolder((prev) => ({
      ...prev,
      info: {
        nome: "",
        dataInicio: new Date().toISOString(),
        previsaoConclusao: new Date().toISOString(),
      },
    }));
  }
  function removeSubActivity(activityIndex, subActivityIndex) {
    const activities = [...operationInfo.atividades];
    var subactivityArr = activities[activityIndex].subAtividades;
    subactivityArr.splice(subActivityIndex, 1);
    activities[activityIndex].subAtividades = subactivityArr;
    setOperationInfo((prev) => ({ ...prev, atividades: activities }));
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
              <div className="w-full lg:w-1/2">
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
            <div className="w-full flex-col lg:flex-row flex gap-2 pt-4">
              <div className="w=full lg:w-1/2">
                <DateFloatingInput
                  label={"DATA DE INÍCIO"}
                  editable={true}
                  value={
                    operationInfo.dataInicio
                      ? formatDate(operationInfo.dataInicio)
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
              <div className="w-full lg:w-1/2">
                <DateFloatingInput
                  label={"PREVISÃO DE CONCLUSÃO"}
                  editable={true}
                  value={
                    operationInfo.previsaoConclusao
                      ? formatDate(operationInfo.previsaoConclusao)
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
            <div className="w-full flex flex-col items-center justify-center pt-4">
              <div className="w-full lg:w-[50%]">
                <SelectFoatingInput
                  label={"EQUIPE"}
                  value={operationInfo.equipe}
                  editable={true}
                  options={equipesTecnicas}
                  handleChange={(value) =>
                    setOperationInfo((prev) => ({ ...prev, equipe: value }))
                  }
                  width={"100%"}
                />
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
                            setSubactivityHolder((prev) => ({
                              ...prev,
                              activityIndex: index,
                              info: {
                                ...prev.info,
                                dataInicio: activity.dataInicio,
                              },
                            }));
                          }}
                          className="text-[#fead61] text-sm flex items-center justify-center hover:scale-110 duration-300 ease-in-out"
                        >
                          <FaProjectDiagram
                            title="ADICIONAR SUBTAREFA"
                            style={{ fontSize: "15px" }}
                          />
                        </button>
                        <button
                          onClick={() => removeActivity(index)}
                          className="text-red-500 text-sm flex items-center justify-center hover:scale-110 duration-300 ease-in-out"
                        >
                          <AiOutlineMinus style={{ fontSize: "15px" }} />
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
                            <div
                              onClick={() => removeSubActivity(index, subIndex)}
                              className="w-1/3 lg:w-1/4 flex items-center justify-center gap-4"
                            >
                              <button className="text-red-500 text-sm flex items-center justify-center">
                                <AiOutlineMinus style={{ fontSize: "15px" }} />
                              </button>
                            </div>
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
            {activityMsg.text ? (
              <p
                className={`w-full text-center text-sm italic ${activityMsg.color}`}
              >
                {activityMsg.text}
              </p>
            ) : (
              <p className="h-[21px] w-full"></p>
            )}
            <div className="w-full flex flex-col lg:flex-row pb-2 pt-4">
              <div className="w-full lg:w-[90%] flex flex-col lg:flex-row items-center gap-2 ">
                <div className="w-full lg:w-2/6">
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
                <div className="w-full lg:w-2/6">
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
                <div className="w-full lg:w-1/6">
                  <DateFloatingInput
                    label={"INÍCIO DA ATIVIDADE"}
                    width={"100%"}
                    editable={true}
                    value={
                      activityHolder.dataInicio
                        ? formatDate(activityHolder.dataInicio)
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
                <div className="w-full lg:w-1/6">
                  <DateFloatingInput
                    label={"PREVISÃO DA CONCLUSÃO"}
                    width={"100%"}
                    editable={true}
                    value={
                      activityHolder.previsaoConclusao
                        ? formatDate(activityHolder.previsaoConclusao)
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
              <div className="w-full lg:w-[10%] flex items-start justify-center">
                <button
                  onClick={addActivity}
                  className="bg-green-300 hover:bg-green-500 hover:text-white hover:scale-105 duration-300 ease-in-out font-medium text-sm p-3 rounded"
                >
                  <IoMdAdd />
                </button>
              </div>
            </div>
            <h1 className="w-full p-1 text-center bg-[#15599a] text-white font-medium">
              SUBTAREFAS
            </h1>
            <div className="flex items-center py-1">
              <div className="flex flex-col">
                <h1 className="text-gray-500 italic text-xs">
                  ADICIONAR SUBTAREFA À:
                </h1>
                <h1 className="text-gray-700 text-sm font-medium">
                  {subactivityHolder.activityIndex != null
                    ? operationInfo.atividades[subactivityHolder.activityIndex]
                        .nome
                    : null}
                </h1>
              </div>
            </div>
            {subActivityMsg.text ? (
              <p
                className={`w-full text-center text-sm italic ${subActivityMsg.color}`}
              >
                {subActivityMsg.text}
              </p>
            ) : (
              <p className="h-[21px] w-full"></p>
            )}
            {subactivityHolder.activityIndex != null ? (
              <div className="w-full flex flex-col lg:flex-row pt-4 py-2">
                <div className="w-full lg:w-[90%] flex flex-col lg:flex-row items-center gap-2 ">
                  <div className="w-full lg:w-4/6">
                    <TextFloatingInput
                      label={"NOME DA SUBTAREFA"}
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
                  <div className="w-full lg:w-1/6">
                    <DateFloatingInput
                      label={"INÍCIO DA ATIVIDADE"}
                      width={"100%"}
                      editable={true}
                      value={
                        subactivityHolder.info.dataInicio
                          ? formatDate(subactivityHolder.info.dataInicio)
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
                  <div className="w-full lg:w-1/6">
                    <DateFloatingInput
                      label={"PREVISÃO DA CONCLUSÃO"}
                      width={"100%"}
                      editable={true}
                      value={
                        subactivityHolder.info.previsaoConclusao
                          ? formatDate(subactivityHolder.info.previsaoConclusao)
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
                <div className="w-full lg:w-[10%] flex items-start justify-center">
                  <button
                    onClick={() =>
                      addSubActivity(subactivityHolder.activityIndex)
                    }
                    className="bg-green-300 hover:bg-green-500 hover:text-white hover:scale-105 duration-300 ease-in-out font-medium text-sm p-3 rounded"
                  >
                    <IoMdAdd />
                  </button>
                </div>
              </div>
            ) : null}
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

export default ModalEdicaoOperacao;
