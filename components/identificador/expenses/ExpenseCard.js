import dayjs from "dayjs";
import React, { useState } from "react";
import { BsCalendarFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { formatToMoney } from "../../../utils/constants";
import { format } from "util";

function ExpenseCard({ expense }) {
  const [showItems, setShowItems] = useState(false);
  return (
    <div className="flex flex-col items-center p-3 border border-gray-200 w-full lg:w-[40%] shadow-sm gap-2">
      <div className="w-full">
        <p className="text-[#fead41] font-bold text-center">
          {expense.categoria}
        </p>
      </div>
      <div className="w-full flex gap-2 items-center justify-center">
        <div className="flex items-center gap-2">
          <BsCalendarFill color="#15599a" />
          <p className="text-gray-500 font-medium text-xs">
            Criada em: {dayjs(expense.dataInsercao).format("DD/MM/YYYY HH:mm")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaUserAlt color="rgb(34,197,94)" />
          <p className="text-gray-500 font-medium text-xs">
            Por {expense.autor.nome}
          </p>
        </div>
      </div>
      {showItems ? (
        <div className="w-full flex flex-col items-center">
          <button
            onClick={() => setShowItems(false)}
            className="text-sm text-blue-300 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            ESCONDER ITENS <BsEyeSlashFill />
          </button>
          {expense.itens.map((item, index) => (
            <div
              key={index}
              className="w-full flex items-center text-xs justify-between"
            >
              <p>
                {item.qtde} x {item.descricao} ({item.unidade})
              </p>
              <p>
                {/* R${" "}
                {item.preco.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                {formatToMoney(item.preco)}/{item.unidade}
              </p>
              <p className="font-medium">
                {formatToMoney(item.qtde * item.preco)}
                {/* R${" "}
                {(item.qtde * item.preco).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => setShowItems(true)}
            className="text-sm text-blue-300 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            MOSTRAR ITENS <BsEyeFill />
          </button>
        </div>
      )}
      {expense.descricao ? (
        <p className="w-full text-center italic text-gray-500 text-sm">
          {expense.descricao}
        </p>
      ) : null}
      <h1 className="mt-1 text-center w-full text-gray-500 text-sm">
        TOTAL DA DESPESA
      </h1>
      <h1 className="font-raleway w-full text-center text-red-500 font-bold">
        R${" "}
        {Number(expense.total).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h1>
    </div>
  );
}

export default ExpenseCard;
