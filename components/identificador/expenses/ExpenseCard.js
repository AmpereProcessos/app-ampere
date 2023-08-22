import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { BsCalendarFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaFilePdf, FaUserAlt } from "react-icons/fa";
import { formatToMoney } from "../../../utils/constants";
import { AiFillEdit, AiOutlineEdit, AiTwotoneEdit } from "react-icons/ai";

function ExpenseCard({ expense, openModal }) {
  const [showItems, setShowItems] = useState(false);
  return (
    <div className="flex flex-col items-center p-3 border border-gray-200 w-full lg:w-[450px] shadow-sm gap-2">
      {expense.projeto ? (
        <p className="w-full text-center font-black text-black">
          {expense.projeto.nome}
        </p>
      ) : null}
      <div className="w-full">
        <p className="text-blue-500 font-bold text-center">
          {expense.categoria}
        </p>
      </div>
      <div className="flex flex-col w-full grow">
        <div className="w-full flex gap-2 items-center justify-center">
          <div className="flex items-center gap-2">
            <BsCalendarFill color="rgb(34,197,94)" />
            <p className="text-gray-500 font-medium text-xs">
              Criada em:{" "}
              {dayjs(expense.dataInsercao).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaUserAlt color="rgb(34,197,94)" />
            <p className="text-gray-500 font-medium text-xs">
              Por {expense.autor.nome}
            </p>
          </div>
        </div>
        {expense.idFormularioAlmoxarifado ? (
          <Link
            href={`/almoxarifado/pdfFormulario/${expense.idFormularioAlmoxarifado}`}
          >
            <a className="hover:bg-orange-200 border border-orange-200 p-2 rounded hover:scale-[1.02] duration-300 ease-in py-2 pl-2 cursor-pointer flex items-center mt-2 w-fit self-center">
              <FaFilePdf style={{ color: "#fead41", fontSize: "15px" }} />
              <p className="pl-3 text-xs text-gray-600 font-medium">
                FORMULÁRIO (PDF)
              </p>
            </a>
          </Link>
        ) : null}
        {expense.itens.length > 0 ? (
          showItems ? (
            <div className="mt-2 w-full flex flex-col items-center">
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
                    {item.qtde?.toLocaleString("pt-br", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    x {item.descricao}
                    {item.unidade ? `(${item.unidade})` : null}
                  </p>
                  <p>
                    {/* R${" "}
                {item.preco.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                    {formatToMoney(item.preco)}
                    {item.unidade ? `/${item.unidade}` : null}
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
            <div className="mt-2 flex items-center justify-center w-full">
              <button
                onClick={() => setShowItems(true)}
                className="text-sm text-blue-300 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                MOSTRAR ITENS <BsEyeFill />
              </button>
            </div>
          )
        ) : null}
      </div>

      <div className="flex items-center gap-2 w-full">
        <div className="flex-1"></div>
        <div className="flex flex-col grow">
          <h1 className="mt-1 text-center w-full text-gray-500 text-sm">
            TOTAL DA DESPESA
          </h1>
          <h1 className="font-raleway w-full text-center text-red-500 font-bold">
            {formatToMoney(expense.total)}
          </h1>
        </div>
        <div className="flex-1 items-end justify-center flex">
          <p
            onClick={() => openModal(expense)}
            className="text-[#fead41] hover:text-orange-500 hover:scale-105 duration-300 ease-in-out cursor-pointer"
          >
            <AiFillEdit size={"20px"} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCard;
