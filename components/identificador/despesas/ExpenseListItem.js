import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { formatToMoney } from "../../../utils/constants";

function ExpenseListItem({ item, index, setExpenseInfo, items }) {
  const [edit, setEdit] = useState();
  return (
    <div className="w-full py-2 flex items-center border-b border-gray-300 border-x px-2">
      <p className="text-gray-800 text-sm font-medium w-3/6">
        {item.descricao}{" "}
      </p>
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
          className=" bg-orange-200 text-gray-800 text-sm font-medium text-center w-1/6 outline-none rounded"
        />
      ) : (
        <p className="text-gray-800 text-sm font-medium text-center w-1/6">
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
          className=" bg-orange-200 text-gray-800 text-sm font-medium text-center w-1/6 outline-none rounded"
        />
      ) : (
        <p className="text-gray-800 text-sm font-medium text-center w-1/6">
          {formatToMoney(item.preco)}
        </p>
      )}
      <div className="w-1/6 flex items-center justify-center gap-2">
        <p className="text-gray-800 text-sm font-medium text-center ">
          {formatToMoney(item.preco * item.qtde)}
        </p>
        <p
          onClick={() => setEdit((prev) => !prev)}
          className="text-sm text-[#fead41] hover:text-orange-500 cursor-pointer"
        >
          <AiFillEdit />
        </p>
      </div>
    </div>
  );
}

export default ExpenseListItem;
