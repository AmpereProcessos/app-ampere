import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { BsCalendarFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaFilePdf, FaUserAlt } from "react-icons/fa";
import { formatLongString, formatToMoney } from "../../../utils/constants";
import { AiFillEdit, AiOutlineEdit, AiTwotoneEdit } from "react-icons/ai";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
function ExpenseCard({ expense, openModal }) {
  const [showItems, setShowItems] = useState(false);
  const stopPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  function getGradient({ paid, date }) {
    const fixedDate = new Date(dayjs(date).add(3, "hours")).setHours(
      0,
      0,
      0,
      0
    );
    const todayDate = new Date().setHours(0, 0, 0, 0);
    if (paid) return "bg-gradient-to-b from-green-100 to-white";
    if (!paid && fixedDate > todayDate)
      return "bg-gradient-to-b from-[#15599a] to-white";
    if (!paid && fixedDate == todayDate)
      return "bg-gradient-to-b from-[#fead41] to-white";
    if (!paid && fixedDate < todayDate)
      return "bg-gradient-to-b from-red-500 to-white";
  }
  function getTagColor({ paid, date }) {
    const fixedDate = new Date(dayjs(date).add(3, "hours")).setHours(
      0,
      0,
      0,
      0
    );
    const todayDate = new Date().setHours(0, 0, 0, 0);
    if (paid) return "bg-green-500";
    if (!paid && fixedDate > todayDate) return "bg-[#15599a]";
    if (!paid && fixedDate == todayDate) return "bg-[#fead41]";
    if (!paid && fixedDate < todayDate) return "bg-red-500";
  }
  function getPriceColor({ paid, date }) {
    const fixedDate = new Date(dayjs(date).add(3, "hours")).setHours(
      0,
      0,
      0,
      0
    );
    const todayDate = new Date().setHours(0, 0, 0, 0);
    if (paid) return "text-green-500";
    if (!paid && fixedDate > todayDate) return "text-[#15599a]";
    if (!paid && fixedDate == todayDate) return "text-[#fead41]";
    if (!paid && fixedDate < todayDate) return "text-red-500";
  }
  return (
    <div
      onClick={() => openModal(expense)}
      className={`flex h-[150px] items-center border border-gray-200 w-full lg:w-[450px] shadow-md gap-2 rounded-lg hover:bg-blue-100 duration-300 cursor-pointer ease-in-out`}
    >
      <div
        className={`h-full w-[4px] rounded-tl-lg rounded-bl-lg ${getTagColor({
          paid: expense.efetivacao?.efetivado,
          date: expense.efetivacao?.data,
        })}`}
      ></div>
      <div className="h-full flex grow p-4">
        <div className="flex w-[70%] flex-col justify-between h-full">
          <p
            className={`${
              expense.projeto ? "" : "text-gray-300"
            } font-raleway font-bold`}
          >
            {expense.projeto?.nome
              ? formatLongString(expense.projeto.nome, 23)
              : "-"}
          </p>
          <p className="font-raleway text-[#fead41] font-medium">
            {expense.categoria}
          </p>
          <div
            className={`flex items-center p-1 rounded w-fit h-fit border-[1.5px] ${
              expense.idFormularioAlmoxarifado
                ? "border-black text-black hover:bg-black hover:text-white duration-300 ease-in-out cursor-pointer"
                : "border-gray-600 text-gray-600  opacity-30"
            }`}
          >
            {expense.idFormularioAlmoxarifado ? (
              <Link
                href={`/almoxarifado/pdfFormulario/${expense.idFormularioAlmoxarifado}`}
              >
                <a className="text-sm font-raleway font-bold">FORMULÁRIO</a>
              </Link>
            ) : (
              <p className="text-sm font-raleway font-bold">FORMULÁRIO</p>
            )}
          </div>
        </div>
        <div className="flex w-[30%] flex-col justify-between h-full">
          <div className="flex gap-2 items-center">
            <BsCalendarFill color="#15599a" size="20px" />
            <p className="text-gray-600 text-sm font-medium font-raleway">
              {dayjs(expense.dataInsercao).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <FaUserAlt color="#15599a" size="20px" />
            <p className="text-gray-600 text-sm font-medium font-raleway upper">
              {expense.autor.nome}
            </p>
          </div>
          <div className={`flex gap-2 items-center`}>
            <RiMoneyDollarCircleFill color="#15599a" size="23px" />
            <p className="text-gray-600 text-sm font-medium font-raleway">
              {formatToMoney(expense.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCard;
