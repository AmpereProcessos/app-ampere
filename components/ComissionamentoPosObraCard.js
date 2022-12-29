import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import DateInput from "./DateInput";
import TextInput from "./TextInput";

function ComissionamentoPosObraCard({ project }) {
  const [info, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  function handleChanges() {
    axios
      .post(`/api/projects/update/${project._id}`, changes)
      .then((res) => {
        setMsg({
          text: "Alterações feitas !",
          color: "text-green-400",
        });
      })
      .catch((err) =>
        setMsg({
          text: "Houve um erro na alterações, por favor tente novamente",
          color: "text-red-500",
        })
      );
  }

  return (
    <div className="grid grid-cols-10 border border-[#15599a] p-2">
      <div className="flex flex-col justify-around col-span-1">
        <h1 className="font-bold text-[#15599a] text-center">
          {info.nomeDoContrato}
        </h1>
        {msg.text && (
          <p className={`text-center text-xs italic ${msg.color}`}>
            {msg.text}
          </p>
        )}
        <button
          onClick={handleChanges}
          className="p-1 rounded bg-blue-300 hover:bg-[#15599a] hover:text-white hover:scale-105 duration-300 ease-in-out font-bold"
        >
          SALVAR
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap col-span-9">
        <DateInput
          label={"Usina Ligada"}
          editable={true}
          value={
            info.conferencias.usinaLigada.data != undefined &&
            dayjs(info.conferencias.usinaLigada.data).isValid()
              ? new Date(info.conferencias.usinaLigada.data)
                  .toISOString()
                  .slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "conferencias.usinaLigada.data": new Date(value).toISOString(),
              "conferencias.usinaLigada.status": "REALIZADO",
            });
            setInfo({
              ...info,
              conferencias: {
                ...info.conferencias,
                usinaLigada: {
                  data: new Date(value).toISOString(),
                  status: "REALIZADO",
                },
              },
            });
          }}
        />
        <DateInput
          label={"Monitoramento feito"}
          editable={true}
          value={
            info.conferencias.monitoramentoFeito.data != undefined &&
            dayjs(info.conferencias.monitoramentoFeito.data).isValid()
              ? new Date(info.conferencias.monitoramentoFeito.data)
                  .toISOString()
                  .slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "conferencias.monitoramentoFeito.data": new Date(
                value
              ).toISOString(),
              "conferencias.monitoramentoFeito.status": "REALIZADO",
            });
            setInfo({
              ...info,
              conferencias: {
                ...info.conferencias,
                monitoramentoFeito: {
                  data: new Date(value).toISOString(),
                  status: "REALIZADO",
                },
              },
            });
          }}
        />
        <DateInput
          label={"Data APP no celular"}
          editable={true}
          value={
            info.app.data != undefined && dayjs(info.app.data).isValid()
              ? new Date(info.app.data).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "app.data": new Date(value).toISOString(),
            });
            setInfo({
              ...info,
              app: {
                ...info.app,
                data: new Date(value).toISOString(),
              },
            });
          }}
        />
        <DateInput
          label={"Energia Injetada"}
          editable={true}
          value={
            info.conferencias.energiaInjetada.data != undefined &&
            dayjs(info.conferencias.energiaInjetada.data).isValid()
              ? new Date(info.conferencias.energiaInjetada.data)
                  .toISOString()
                  .slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "conferencias.energiaInjetada.data": new Date(
                value
              ).toISOString(),
              "conferencias.energiaInjetada.status": "REALIZADO",
            });
            setInfo({
              ...info,
              conferencias: {
                ...info.conferencias,
                energiaInjetada: {
                  data: new Date(value).toISOString(),
                  status: "REALIZADO",
                },
              },
            });
          }}
        />
        <TextInput
          label={"LOGIN NO APP"}
          value={info.app.login ? info.app.login : ""}
          normalCase={true}
          editable={true}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "app.login": value,
            });
            setInfo({
              ...info,
              app: {
                ...info.app,
                login: value,
              },
            });
          }}
        />
        <TextInput
          label={"SENHA NO APP"}
          value={info.app.senha}
          normalCase={true}
          editable={true}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "app.senha": value,
            });
            setInfo({
              ...info,
              app: {
                ...info.app,
                senha: value,
              },
            });
          }}
        />
      </div>
    </div>
  );
}

export default ComissionamentoPosObraCard;
