import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { formatToMoney } from "../../../utils/constants";

function ExpenseListItem({ item, index, setExpenseInfo, items }) {
  const [edit, setEdit] = useState();
  return (
    <div className="border-border flex w-full items-center border-x border-b px-2 py-2">
      <p className="text-foreground w-3/6 text-sm font-medium">{item.descricao} </p>
      {edit ? (
        <input
          type="number"
          value={item.qtde}
          onChange={(e) => {
            const value = e.target.value;
            var itemsArr = [...items];
            itemsArr[index].qtde = Number(value);
            setExpenseInfo((prev) => ({ ...prev, itens: itemsArr }));
          }}
          className="text-foreground w-1/6 rounded bg-orange-200 text-center text-sm font-medium outline-hidden"
        />
      ) : (
        <p className="text-foreground w-1/6 text-center text-sm font-medium">
          x
          {Number(item.qtde).toLocaleString("pt-br", {
            maximumFractionDigits: 2,
          })}{" "}
          {item.grandeza}
        </p>
      )}

      {edit ? (
        <input
          type="number"
          value={item.preco}
          onChange={(e) => {
            const value = e.target.value;
            var itemsArr = [...items];
            itemsArr[index].preco = Number(value);
            setExpenseInfo((prev) => ({ ...prev, itens: itemsArr }));
          }}
          className="text-foreground w-1/6 rounded bg-orange-200 text-center text-sm font-medium outline-hidden"
        />
      ) : (
        <p className="text-foreground w-1/6 text-center text-sm font-medium">
          {formatToMoney(item.preco)}
        </p>
      )}
      <div className="flex w-1/6 items-center justify-center gap-2">
        <p className="text-foreground text-center text-sm font-medium">
          {formatToMoney(item.preco * item.qtde)}
        </p>
        <p
          onClick={() => setEdit((prev) => !prev)}
          className="cursor-pointer text-sm text-[#fead41] hover:text-orange-500"
        >
          <AiFillEdit />
        </p>
      </div>
    </div>
  );
}

export default ExpenseListItem;
