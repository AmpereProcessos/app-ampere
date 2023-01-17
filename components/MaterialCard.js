import axios from "axios";
import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
function MaterialCard({ project }) {
  const [infoHolder, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function handleChanges() {
    axios
      .post("/api/gestaoDeObras/material", {
        id: project._id,
        mudancas: changes,
      })
      .then((res) =>
        setMsg({ text: "Alterações feitas", color: "text-green-500" })
      )
      .catch((err) =>
        setMsg({
          text: "Ocorreu um problema com o salvamento, tente novamente.",
          color: "text-red-500",
        })
      );
  }
  console.log(project.nomeDoContrato, changes["material.conferenciaFeita"]);
  return (
    <div className="flex flex-col p-2 shadow-lg w-full border border-[#15599a]">
      <div className="flex items-center justify-between">
        <h1 className="text-[#15599a] font-bold">
          (#{project.qtde}) {project.nomeDoContrato}
        </h1>
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
          <button
            onClick={handleChanges}
            className="flex items-center gap-x-3 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm"
          >
            <p>Salvar alterações</p>
            <FaSave />
          </button>
        </div>
      </div>
      {msg.text && (
        <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
      )}
      <div className="w-full flex flex-wrap items-center justify-center gap-x-4  border-t border-gray-200">
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
                    descricaoProblema: e.target.checked,
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
    </div>
  );
}

export default MaterialCard;
