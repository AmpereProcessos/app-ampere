import dayjs from "dayjs";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BsArrowsExpand } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { formatDate } from "../utils/constants";
import { isEmpty } from "../utils/methods/shared";

function PurchaseSolicitationItemRow({ item, index, infoHolder, setInfo }) {
  console.log(item.preco);
  const [showDescription, setShowDescription] = useState(false);
  return (
    <div className="border-border flex w-full flex-col gap-2 rounded-tl-sm rounded-tr-sm border-b bg-gray-50 py-1">
      <div className="grid w-full grid-cols-10 items-center">
        <h1 className="text-foreground col-span-2 w-full p-1 text-center text-xs font-medium">
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
            className="text-foreground h-full w-full bg-transparent text-center text-xs outline-hidden"
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
            className="text-foreground h-full w-full bg-transparent text-center text-xs outline-hidden"
          />
        </div>
        <div className="col-span-2 flex h-full w-full items-center p-1">
          <input
            value={item.dataCompra ? formatDate(item.dataCompra) : null}
            onChange={(e) => {
              const list = infoHolder.itens;
              list[index].dataCompra = new Date(e.target.value).toISOString();
              setInfo((prev) => ({ ...prev, itens: list }));
            }}
            type="date"
            className="text-foreground h-full w-full grow bg-transparent text-center text-xs outline-hidden"
          />
          {infoHolder.itens.length > 1 && item.dataCompra ? (
            <div
              title="Alterar todas as data para essa."
              className="mx-2 cursor-pointer rounded bg-yellow-500 p-1"
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
        <div className="col-span-2 flex h-full w-full items-center p-1">
          <input
            value={item.dataEntrega ? formatDate(item.dataEntrega) : null}
            onChange={(e) => {
              const list = infoHolder.itens;
              list[index].dataEntrega = new Date(e.target.value).toISOString();
              setInfo((prev) => ({ ...prev, itens: list }));
            }}
            type="date"
            className="text-foreground h-full w-full grow bg-transparent text-center text-xs outline-hidden"
          />
          {infoHolder.itens.length > 1 && item.dataEntrega ? (
            <div
              title="Alterar todas as data para essa."
              className="mx-2 cursor-pointer rounded bg-yellow-500 p-1"
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
        <div className="col-span-1 flex w-full items-center justify-center gap-4 p-1 font-medium">
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
          <p className="text-xs font-medium text-[#15599a]">ANOTAÇÕES</p>
          <p className="text-foreground w-full grow text-center text-xs italic">{item.anotacoes}</p>
        </div>
      ) : null}
    </div>
  );
}

export default PurchaseSolicitationItemRow;
