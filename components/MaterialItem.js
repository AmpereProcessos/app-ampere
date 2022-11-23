import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
function MaterialItem({ obj, setDados, dados, index }) {
  const [message, setMessage] = useState("");
  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-9 items-center gap-3">
        <p className="list-none col-span-4 text-center text-gray-600 font-bold">
          {obj.nome}
        </p>
        <input
          type={"number"}
          disabled={dados.efetivado}
          className="outline-none text-center p-1 col-span-2 border border-gray-200"
          value={obj.qtdeSaida ? obj.qtdeSaida : null}
          onChange={(e) => {
            let infoMaterial = dados.materiais;
            infoMaterial[index].qtdeSaida = Number(e.target.value);
            setDados({
              ...dados,
              materiais: infoMaterial,
            });
          }}
        />
        <input
          type={"number"}
          disabled={dados.efetivado}
          className="outline-none text-center p-1 col-span-2 border border-gray-200"
          value={obj.qtdeDevolucao ? obj.qtdeDevolucao : null}
          onChange={(e) => {
            let infoMaterial = dados.materiais;
            console.log(e);
            if (Number(e.target.value) > infoMaterial[index].qtdeSaida) {
              setMessage("Número de devolução incompatível");
              infoMaterial[index].qtdeDevolucao = infoMaterial[index].qtdeSaida;
              infoMaterial[index].diff =
                infoMaterial[index].qtdeSaida - Number(e.target.value);
              setDados({
                ...dados,
                materiais: infoMaterial,
              });
            } else if (Number(e.target.value) < 0) {
              infoMaterial[index].qtdeDevolucao = Math.abs(
                Number(e.target.value)
              );
              infoMaterial[index].diff =
                infoMaterial[index].qtdeSaida -
                Math.abs(Number(e.target.value));
              setDados({
                ...dados,
                materiais: infoMaterial,
              });
            } else {
              setMessage("");
              infoMaterial[index].qtdeDevolucao = Number(e.target.value);
              infoMaterial[index].diff =
                infoMaterial[index].qtdeSaida - Number(e.target.value);
              setDados({
                ...dados,
                materiais: infoMaterial,
              });
            }
          }}
        />
        {dados.efetivado != true && (
          <div className="flex justify-center">
            <button
              className="col-span-1 self-center"
              onClick={() => {
                let infoMaterial = dados.materiais;
                infoMaterial.splice(index, 1);
                setDados({ ...dados, materiais: infoMaterial });
              }}
            >
              <VscChromeClose style={{ color: "red", fontSize: "15px" }} />
            </button>
          </div>
        )}
      </div>
      {message && <p className="text-center italic text-red-500">{message}</p>}
    </div>
  );
}

export default MaterialItem;
