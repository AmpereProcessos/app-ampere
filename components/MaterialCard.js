import dayjs from "dayjs";
import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
function MaterialCard({ project }) {
  const [infoHolder, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function handleChanges(changes) {
    axios
      .post("/api/gestaoDeObras/material", {
        id: project._id,
        mudancas: changes,
      })
      .then((res) => {
        setMsg({ text: "Alterações feitas!", color: "text-green-500" });
      })
      .catch((err) =>
        setMsg({
          text: "Ocorreu um problema com o salvamento, tente novamente.",
          color: "text-red-500",
        })
      );
  }
  function openCall() {
    let obj = {
      status: "ABERTO",
      idPai: infoHolder._id,
      codigoProjeto: infoHolder.qtde,
      nomeDoContrato: infoHolder.nomeDoContrato,
      dataEntrega: infoHolder.compra?.dataEntrega,
      fornecedor: infoHolder.compra.fornecedor,
      kitInfo: infoHolder.compra?.kitInfo,
      materialFaltante: infoHolder.material?.materialFaltante,
      avarias: infoHolder.material.avarias ? true : false,
      entregaFaltando: infoHolder.material.entregaFaltando ? true : false,
      observacao: infoHolder.material.descricaoProblema,
      abertura: new Date().toISOString(),
    };
    axios
      .post("/api/calls/suprimentos/mainData", obj)
      .then((res) => {
        {
          setMsg({ text: res.data, color: "text-green-500" });
          setTimeout(
            () =>
              handleChanges({
                ...changes,
                "material.chamadoIrregularidade": true,
              }),
            1000
          );
          setTimeout;
        }
      })
      .catch((err) =>
        setMsg({ text: err.response.data, color: "text-red-500" })
      );
  }
  return (
    <div className="flex flex-col p-2 shadow-lg w-full border border-[#15599a]">
      <div className="flex items-center justify-between">
        <h1 className="text-[#15599a] font-bold">
          (#{project.qtde}) {project.nomeDoContrato}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <h1 className="text-center font-bold text-gray-700 text-sm">
              FORNECEDOR
            </h1>
            <h1 className="text-center text-xs text-gray-500">
              {infoHolder.compra?.fornecedor
                ? infoHolder.compra.fornecedor
                : "-"}
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-center font-bold text-gray-700 text-sm">
              DATA DE ENTREGA
            </h1>
            <h1 className="text-center text-xs text-gray-500">
              {infoHolder.compra?.dataEntrega
                ? dayjs(infoHolder.compra.dataEntrega).format("DD/MM/YYYY")
                : "-"}
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-center font-bold text-gray-700 text-sm">
              TEMPO DESDE ENTREGA
            </h1>
            <h1 className="text-center text-xs text-gray-500">
              {infoHolder.tempoPassado
                ? `${infoHolder.tempoPassado} DIAS`
                : "-"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-x-2 flex-wrap justify-center pb-2">
          <div className="flex flex-col w-fit items-center">
            <span className="font-bold font-raleway text-center text-sm">
              CONFERENCIA FEITA ?
            </span>
            <div className="flex">
              <input
                disabled={false}
                checked={infoHolder.material.conferenciaFeita}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    material: {
                      ...infoHolder.material,
                      conferenciaFeita: e.target.checked,
                    },
                  });
                  setChanges({
                    ...changes,
                    "material.conferenciaFeita": e.target.checked,
                  });
                }}
                type="checkbox"
                name="conferenciaDeMaterial"
                id="conferenciaDeMaterial"
              />
              <label className="ml-2" htmlFor="conferenciaDeMaterial">
                SIM
              </label>
            </div>
          </div>
          <div className="flex flex-col w-fit items-center">
            <span className="font-bold font-raleway text-center text-sm">
              AVARIAS ?
            </span>
            <div className="flex">
              <input
                disabled={false}
                checked={infoHolder.material.avarias}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    material: {
                      ...infoHolder.material,
                      avarias: e.target.checked,
                    },
                  });
                  setChanges({
                    ...changes,
                    "material.avarias": e.target.checked,
                  });
                }}
                type="checkbox"
                name="avarias"
                id="avarias"
              />
              <label className="ml-2" htmlFor="avarias">
                SIM
              </label>
            </div>
          </div>
          <div className="flex flex-col w-fit items-center">
            <span className="font-bold font-raleway text-center text-sm">
              MATERIAL DO KIT FALTANDO ?
            </span>
            <div className="flex">
              <input
                disabled={false}
                checked={infoHolder.material.entregaFaltando}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    material: {
                      ...infoHolder.material,
                      entregaFaltando: e.target.checked,
                    },
                  });
                  setChanges({
                    ...changes,
                    "material.entregaFaltando": e.target.checked,
                  });
                }}
                type="checkbox"
                name="entregaFaltando"
                id="entregaFaltando"
              />
              <label className="ml-2" htmlFor="entregaFaltando">
                SIM
              </label>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <SaveButton
              text={"Salvar alterações"}
              icon={<FaSave />}
              handleClick={() => handleChanges(changes)}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap items-center justify-center gap-x-4  border-t border-gray-200">
        <div className="flex flex-col w-[300px] self-center mt-2 items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            INFORMAÇÕES DO KIT
          </span>
          <textarea
            value={infoHolder.compra.kitInfo ? infoHolder.compra.kitInfo : ""}
            readOnly={true}
            disabled={true}
            placeholder={"Observações do material aqui..."}
            onChange={(e) => {
              setChanges({
                ...changes,
                "compra.kitInfo": e.target.value,
              });
              setInfo({
                ...infoHolder,
                compra: {
                  ...infoHolder.compra,
                  kitInfo: e.target.value,
                },
              });
            }}
            className="w-full mb-2 text-center text-gray-600 text-xs h-[100px] resize-none p-2 outline-none border border-gray-600"
          />
        </div>
        <div className="flex flex-col w-[300px] self-center mt-2 items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            MATERIAL DO ESCRITÓRIO
          </span>
          <textarea
            value={
              infoHolder.material.materialFaltante
                ? infoHolder.material.materialFaltante
                : ""
            }
            disabled={true}
            readOnly={true}
            placeholder={"Observações do material aqui..."}
            onChange={(e) => {
              setChanges({
                ...changes,
                "material.materialFaltante": e.target.value,
              });
              setInfo({
                ...infoHolder,
                material: {
                  ...infoHolder.material,
                  materialFaltante: e.target.value,
                },
              });
            }}
            className="w-full mb-2 text-center text-gray-600 text-xs h-[100px] resize-none p-2 outline-none border border-gray-600"
          />
        </div>
      </div>
      {infoHolder.material.entregaFaltando || infoHolder.material.avarias ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center">
            <div className="flex flex-col w-[300px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                DESCRIÇÃO DO PROBLEMA
              </span>
              <textarea
                value={infoHolder.material.descricaoProblema}
                placeholder={"Descrição do problema encontrado aqui..."}
                onChange={(e) => {
                  setInfo({
                    ...infoHolder,
                    material: {
                      ...infoHolder.material,
                      descricaoProblema: e.target.value,
                    },
                  });
                  setChanges({
                    ...changes,
                    "material.descricaoProblema": e.target.value,
                  });
                }}
                className="w-full mb-2 text-center text-xs h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
              />
            </div>
          </div>
          {msg.text && (
            <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
          )}
          {infoHolder.material.chamadoIrregularidade ? (
            <p className="text-center text-green-500 font-bold">
              CHAMADO CRIADO PARA ESSE CLIENTE
            </p>
          ) : (
            <button
              onClick={openCall}
              className="p-2 rounded border border-[#15599a] text-[#15599a] font-bold hover:text-white hover:bg-[#15599a]"
            >
              ABRIR CHAMADO
            </button>
          )}
        </div>
      ) : (
        false
      )}
    </div>
  );
}

export default MaterialCard;
