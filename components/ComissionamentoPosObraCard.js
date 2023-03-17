import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import SaveButton from "./utils/Buttons/SaveButton";
import { FaSave } from "react-icons/fa";

function ComissionamentoPosObraCard({ project, index }) {
  const { credentials } = useContext(AppContext);
  const [info, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  function handleChanges() {
    if (
      credentials?.visualizacao == "REGIONAL" ||
      credentials?.visualizacao == "VENDEDOR"
    ) {
      setMsg({
        text: "Seu usuário não tem permissão de alteração nessa área.",
        color: "text-red-500",
      });
    } else {
      if (info.jornada?.entregaTecnica == true) {
        if (
          info.jornada?.tipoEntregaTecnica == undefined ||
          info.jornada?.tipoEntregaTecnica == "NÃO DEFINIDO"
        ) {
          setMsg({
            text: "Por favor, preencha o tipo de visita técnica",
            color: "text-red-500",
          });
        } else {
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
      } else {
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
    }
  }
  function getBorderColor(diff) {
    if (diff > 3) {
      return "border-2 border-red-500";
    } else {
      return "border border-[#15599a]";
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.01 * index }}
      className={`grid grid-rows-6 grid-cols-1 lg:grid-cols-10 lg:grid-rows-1 ${getBorderColor(
        dayjs().diff(info.medidor.data, "days")
      )} p-2`}
    >
      <div className="flex flex-col justify-around row-span-1 col-span-1">
        <h1 className="font-bold text-[#15599a] text-center">
          {info.nomeDoContrato} - ({info.qtde})
        </h1>
        {msg.text && (
          <p className={`text-center text-xs italic ${msg.color}`}>
            {msg.text}
          </p>
        )}
        <div className="flex items-center justify-center">
          <SaveButton
            text={"SALVAR"}
            icon={<FaSave />}
            handleClick={handleChanges}
          />
        </div>
      </div>
      <div className="col-span-9 flex flex-col row-span-5">
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <p className="text-xs text-[#15599a] font-bold">TROCA DO MEDIDOR</p>
            <p className="text-xs text-gray-600">
              {info.medidor.data
                ? dayjs(info.medidor.data).add(4, "hours").format("DD/MM/YYYY")
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-[#15599a] font-bold">SAÍDA DE OBRA</p>
            <p className="text-xs text-gray-600">
              {info.obra.saida
                ? dayjs(info.obra.saida).add(4, "hours").format("DD/MM/YYYY")
                : "-"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-[#15599a] font-bold">VENDEDOR</p>
            <p className="text-xs text-gray-600">{info.vendedor.nome}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 flex-wrap col-span-9">
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
                "conferencias.usinaLigada.data": isNaN(value)
                  ? new Date(value).toISOString()
                  : null,
                "conferencias.usinaLigada.status": isNaN(value)
                  ? "REALIZADO"
                  : "NÃO REALIZADO",
              });
              setInfo({
                ...info,
                conferencias: {
                  ...info.conferencias,
                  usinaLigada: {
                    data: isNaN(value) ? new Date(value).toISOString() : null,
                    status: isNaN(value) ? "REALIZADO" : "NÃO REALIZADO",
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
                "conferencias.monitoramentoFeito.data": isNaN(value)
                  ? new Date(value).toISOString()
                  : null,
                "conferencias.monitoramentoFeito.status": isNaN(value)
                  ? "REALIZADO"
                  : "NÃO REALIZADO",
              });
              setInfo({
                ...info,
                conferencias: {
                  ...info.conferencias,
                  monitoramentoFeito: {
                    data: isNaN(value) ? new Date(value).toISOString() : null,
                    status: isNaN(value) ? "REALIZADO" : "NÃO REALIZADO",
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
                "app.data": isNaN(value) ? new Date(value).toISOString() : null,
              });
              setInfo({
                ...info,
                app: {
                  ...info.app,
                  data: isNaN(value) ? new Date(value).toISOString() : null,
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
                "conferencias.energiaInjetada.data": isNaN(value)
                  ? new Date(value).toISOString()
                  : null,
                "conferencias.energiaInjetada.status": isNaN(value)
                  ? "REALIZADO"
                  : "NÃO REALIZADO",
              });
              setInfo({
                ...info,
                conferencias: {
                  ...info.conferencias,
                  energiaInjetada: {
                    data: isNaN(value) ? new Date(value).toISOString() : null,
                    status: isNaN(value) ? "REALIZADO" : "NÃO REALIZADO",
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
          <SelectInput
            label={"TIPO DA ENTREGA TÉCNICA"}
            editable={true}
            value={
              info.jornada?.tipoEntregaTecnica
                ? info.jornada.tipoEntregaTecnica
                : "NÃO DEFINIDO"
            }
            options={[
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
              {
                label: "PRESENCIAL",
                value: "PRESENCIAL",
              },
              {
                label: "REMOTO",
                value: "REMOTO",
              },
            ]}
            handleChange={(value) => {
              setChanges({ ...changes, "jornada.tipoEntregaTecnica": value });
              setInfo({
                ...info,
                jornada: {
                  ...info.jornada,
                  tipoEntregaTecnica: value,
                },
              });
            }}
          />
          <div className="flex flex-col w-[350px] items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              ENTREGA TÉCNICA
            </span>
            <div className="flex">
              <input
                checked={info.jornada?.entregaTecnica}
                onChange={(e) => {
                  setChanges({
                    ...changes,
                    "jornada.entregaTecnica": e.target.checked,
                    "jornada.dataEntregaTecnicaRemota":
                      e.target.checked == true
                        ? new Date().toISOString()
                        : null,
                  });
                  setInfo({
                    ...info,
                    jornada: {
                      ...info.jornada,
                      entregaTecnica: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="entregaTecnica"
                id="entregaTecnica"
              />
              <label className="ml-2" htmlFor="entregaTecnica">
                FEITA ?
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ComissionamentoPosObraCard;
