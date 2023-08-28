import dayjs from "dayjs";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BsArrowsExpand } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { formatDate } from "../utils/constants";
import { isEmpty } from "../utils/methods/custom";

function PurchaseSolicitationItemRow({ item, index, infoHolder, setInfo }) {
  console.log(item.preco);
  const [showDescription, setShowDescription] = useState(false);
  return (
    <div className="flex flex-col w-full gap-2 bg-gray-50 rounded-tr-sm rounded-tl-sm border-b border-gray-300 py-1">
      <div className="grid grid-cols-10 items-center w-full">
        <h1 className="col-span-2 w-full text-center text-xs text-gray-700 font-medium p-1">
          {item.descricao}
          {item.grandeza ? `(${item.grandeza})` : ""}
        </h1>
        <div className="col-span-1 w-full p-1">
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
        <div className="col-span-2 w-full p-1">
          <input
            value={!isEmpty(item.preco) ? item.preco.toString() : ""}
            onChange={(e) => {
              const list = infoHolder.itens;
              list[index].preco = Number(e.target.value);
              setInfo((prev) => ({ ...prev, itens: list }));
            }}
            type="number"
            className="outline-none text-center text-xs text-gray-700 h-full w-full bg-transparent"
          />
        </div>
        <div className="flex items-center col-span-2 w-full p-1 h-full">
          <input
            value={item.dataCompra ? formatDate(item.dataCompra) : null}
            onChange={(e) => {
              const list = infoHolder.itens;
              list[index].dataCompra = new Date(e.target.value).toISOString();
              setInfo((prev) => ({ ...prev, itens: list }));
            }}
            type="date"
            className="outline-none text-center text-xs text-gray-700 h-full w-full bg-transparent grow"
          />
          {infoHolder.itens.length > 1 && item.dataCompra ? (
            <div
              title="Alterar todas as data para essa."
              className="mx-2 bg-yellow-500 p-1 rounded cursor-pointer"
              onClick={() => {
                var list = infoHolder.itens;
                const itemDate = item.dataCompra;
                const finalList = list.map((item) => {
                  return {
                    ...item,
                    dataCompra: itemDate,
                  };
                });
                setInfo((prev) => ({ ...prev, itens: finalList }));
              }}
            >
              <BsArrowsExpand />
            </div>
          ) : null}
        </div>
        <div className="flex items-center col-span-2 w-full p-1 h-full">
          <input
            value={item.dataEntrega ? formatDate(item.dataEntrega) : null}
            onChange={(e) => {
              const list = infoHolder.itens;
              list[index].dataEntrega = new Date(e.target.value).toISOString();
              setInfo((prev) => ({ ...prev, itens: list }));
            }}
            type="date"
            className="outline-none text-center text-xs text-gray-700 h-full w-full grow bg-transparent"
          />
          {infoHolder.itens.length > 1 && item.dataEntrega ? (
            <div
              title="Alterar todas as data para essa."
              className="mx-2 bg-yellow-500 p-1 rounded cursor-pointer"
              onClick={() => {
                var list = infoHolder.itens;
                const itemDate = item.dataEntrega;
                const finalList = list.map((item) => {
                  return {
                    ...item,
                    dataEntrega: itemDate,
                  };
                });
                setInfo((prev) => ({ ...prev, itens: finalList }));
              }}
            >
              <BsArrowsExpand />
            </div>
          ) : null}
        </div>
        <div className="col-span-1 w-full flex items-center justify-center font-medium p-1 gap-4">
          {item.anotacoes ? (
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
          <p className="text-xs text-[#15599a] font-medium">ANOTAÇÕES</p>
          <p className="grow w-full text-xs text-center text-gray-600 italic">
            {item.anotacoes}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default PurchaseSolicitationItemRow;
