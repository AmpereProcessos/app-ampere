import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { BsCalendarFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaFilePdf, FaUserAlt } from "react-icons/fa";
import { formatLongString, formatToMoney } from "../../../utils/constants";
import { AiFillEdit, AiOutlineEdit, AiTwotoneEdit } from "react-icons/ai";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
function RevenueCard({ revenue, openModal }) {
  const [showItems, setShowItems] = useState(false);

  function getTagColor({ received, date }) {
    const fixedDate = new Date(dayjs(date).add(3, "hours")).setHours(
      0,
      0,
      0,
      0
    );
    const todayDate = new Date().setHours(0, 0, 0, 0);
    if (received) return "bg-green-500";
    if (!received && fixedDate > todayDate) return "bg-[#15599a]";
    if (!received && fixedDate == todayDate) return "bg-[#fead41]";
    if (!received && fixedDate < todayDate) return "bg-red-500";
  }

  return (
    <div
      onClick={() => openModal(revenue)}
      className={`flex h-[150px] items-center border border-gray-200 w-full lg:w-[450px] shadow-md gap-2 rounded-lg hover:bg-blue-100 duration-300 cursor-pointer ease-in-out`}
    >
      <div
        className={`h-full w-[4px] rounded-tl-lg rounded-bl-lg ${getTagColor({
          received: revenue.efetivacao?.efetivado,
          date: revenue.efetivacao?.data,
        })}`}
      ></div>
      <div className="h-full flex flex-col grow p-4">
        <div className="w-full flex grow">
          <div className="flex w-[70%] flex-col justify-between">
            <p
              className={`${
                revenue.projeto ? "" : "text-gray-300"
              } font-raleway font-bold`}
            >
              {revenue.projeto?.nome
                ? formatLongString(revenue.projeto.nome, 23)
                : "-"}
            </p>
            <p className="font-raleway text-[#fead41] font-medium">
              {revenue.tipo}
            </p>
          </div>
          <div className="flex w-[30%] flex-col justify-between">
            <div className="flex gap-2 items-center">
              <BsCalendarFill color="#15599a" size="20px" />
              <p className="text-gray-600 text-sm font-medium font-raleway">
                {dayjs(revenue.dataInsercao).format("DD/MM/YYYY")}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <FaUserAlt color="#15599a" size="20px" />
              <p className="text-gray-600 text-sm font-medium font-raleway upper">
                {revenue.autor.nome}
              </p>
            </div>
          </div>
        </div>
        <div className={`flex w-full gap-2 items-center justify-center mt-4`}>
          <RiMoneyDollarCircleFill color="#15599a" size="25px" />
          <p className="text-gray-600 text-lg font-medium font-raleway">
            {formatToMoney(revenue.total)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RevenueCard;
