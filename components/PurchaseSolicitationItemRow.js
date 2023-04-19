import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

function PurchaseSolicitationItemRow({ item, index, infoHolder, setInfo }) {
  const [showDescription, setShowDescription] = useState(false);
  console.log(showDescription);
  return (
    <div className="flex flex-col w-full gap-2 bg-gray-50 rounded-tr-sm rounded-tl-sm">
      <div className="flex items-center w-full">
        <h1 className="w-1/4 text-center text-xs text-gray-700 font-medium p-1">
          {item.nome}
        </h1>
        <div className="w-1/4 p-1">
          <input
            value={item.qtde.toString()}
            onChange={(e) => {
              const list = infoHolder.itens;
              list[index].qtde = Number(e.target.value);
              setInfo((prev) => ({ ...prev, itens: list }));
            }}
            type="number"
            className="outline-none text-center text-xs text-gray-700 h-full w-full bg-transparent"
          />
        </div>
        <div className="w-1/4 p-1">
          <input
            value={item.cotacao ? item.cotacao.toString() : null}
            onChange={(e) => {
              const list = infoHolder.itens;
              list[index].cotacao = Number(e.target.value);
              setInfo((prev) => ({ ...prev, itens: list }));
            }}
            type="number"
            className="outline-none text-center text-xs text-gray-700 h-full w-full bg-transparent"
          />
        </div>
        <div className="w-1/4 flex items-center justify-center font-medium p-1 gap-4">
          {item.descricao ? (
            showDescription ? (
              <AiFillEye
                onClick={() => setShowDescription(false)}
                style={{ color: "#fead61", cursor: "pointer" }}
              />
            ) : (
              <AiFillEyeInvisible
                onClick={() => setShowDescription(true)}
                style={{ color: "#fead61", cursor: "pointer" }}
              />
            )
          ) : null}
          <MdCancel
            onClick={() => {
              let items = infoHolder.itens;
              items.splice(index, 1);
              setInfo((prev) => ({ ...prev, itens: items }));
            }}
            style={{ color: "red", cursor: "pointer" }}
          />
        </div>
      </div>
      {showDescription ? (
        <div className="flex flex-col items-center">
          <p className="text-xs text-[#15599a] font-medium">DESCRIÇÃO</p>
          <p className="grow w-full text-xs text-center text-gray-600 italic">
            {item.descricao}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default PurchaseSolicitationItemRow;
