import axios from "axios";
import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
function MaterialCard({ project }) {
  const [changes, setChanges] = useState({
    "material.conferenciaFeita": project.material.conferenciaFeita,
    "material.avarias": project.material.avarias,
    "material.entregaFaltando": project.material.entregaFaltando,
    "material.descricaoProblema": project.material.descricaoProblema
      ? project.material.descricaoProblema
      : "",
  });
  function handleChanges() {
    axios
      .post("/api/gestaoDeObras/material", {
        id: project._id,
        mudancas: changes,
      })
      .then((res) => console.log(res.data));
  }
  return (
    <div className="flex flex-col p-2 shadow-lg w-full border border-[#15599a]">
      <div className="flex items-center justify-between">
        <h1 className="text-[#15599a] font-bold">{project.nomeDoContrato}</h1>
        <div className="flex items-center gap-x-2 flex-wrap justify-center pb-2">
          <div className="flex flex-col w-fit items-center">
            <span className="font-bold font-raleway text-center text-sm">
              CONFERENCIA FEITA ?
            </span>
            <div className="flex">
              <input
                disabled={false}
                value={
                  changes["material.conferenciaFeita"]
                    ? changes["material.conferenciaFeita"]
                    : false
                }
                onChange={(e) =>
                  setChanges({
                    ...changes,
                    "material.conferenciaFeita": e.target.checked,
                  })
                }
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
                value={
                  changes["material.avarias"]
                    ? changes["material.avarias"]
                    : false
                }
                onChange={(e) =>
                  setChanges({
                    ...changes,
                    "material.avarias": e.target.checked,
                  })
                }
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
              MATERIAL FALTANTE
            </span>
            <div className="flex">
              <input
                disabled={false}
                value={
                  changes["material.entregaFaltando"]
                    ? changes["material.entregaFaltando"]
                    : false
                }
                onChange={(e) =>
                  setChanges({
                    ...changes,
                    "material.entregaFaltando": e.target.checked,
                  })
                }
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
      {changes["material.avarias"] || changes["material.entregaFaltando"] ? (
        <div className="flex justify-center border-t border-gray-200">
          <div className="flex flex-col w-[450px] self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              DESCRIÇÃO DO PROBLEMA
            </span>
            <textarea
              value={changes["material.descricaoProblema"]}
              placeholder={"Descrição do problema encontrado aqui..."}
              onChange={(e) =>
                setChanges({
                  ...changes,
                  "material.descricaoProblema": e.target.value,
                })
              }
              className="w-full text-center h-[100px] bg-gray-100 resize-none p-2 outline-none border border-gray-600"
            />
          </div>
        </div>
      ) : (
        false
      )}
    </div>
  );
}

export default MaterialCard;
