import React, { useEffect, useMemo, useState } from "react";
import LoadingPage from "../../utils/LoadingPage";
import { AnimatePresence, motion } from "framer-motion";
import FilterButton from "../../utils/Buttons/FilterButton";
import { AiOutlineSearch } from "react-icons/ai";
import { formatToMoney } from "../../../utils/constants";
import dayjs from "dayjs";
import RevenueCard from "./RevenueCard";
import { useRevenues } from "../../../utils/methods/query/revenues";

function RevenuesWrapper({ userAuthorized, filters }) {
  const {
    data: revenues,
    isLoading,
    isSuccess,
  } = useRevenues(!!userAuthorized, filters);

  const [modalRevenue, setModalExpense] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleOpenModal(expense) {
    setModalExpense(expense);
    setModalIsOpen(true);
  }
  function handleCloseModal() {
    setModalExpense(null);
    setModalIsOpen(false);
  }

  function getStats(revenues) {
    const toReceiveToday = revenues.reduce((acc, current) => {
      const notReceived = !current.efetivacao?.efetivado;
      const scheduledDate = current.efetivacao?.data
        ? new Date(dayjs(current.efetivacao.data).add(3, "hours")).setHours(
            0,
            0,
            0,
            0
          )
        : null;
      const todayDate = new Date().setHours(0, 0, 0, 0);
      const isScheduledToday = scheduledDate == todayDate;
      if (notReceived && isScheduledToday) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    const toReceive = revenues.reduce((acc, current) => {
      const notReceived = !current.efetivacao?.efetivado;
      const scheduledDate = current.efetivacao?.data
        ? new Date(dayjs(current.efetivacao.data).add(3, "hours")).setHours(
            0,
            0,
            0,
            0
          )
        : null;
      const todayDate = new Date().setHours(0, 0, 0, 0);
      const yetToReceive = scheduledDate >= todayDate;
      if (notReceived && yetToReceive) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    const toReceiveOverdue = revenues.reduce((acc, current) => {
      const notReceived = !current.efetivacao?.efetivado;
      const scheduledDate = current.efetivacao?.data
        ? new Date(dayjs(current.efetivacao.data).add(3, "hours")).setHours(
            0,
            0,
            0,
            0
          )
        : null;
      const todayDate = new Date().setHours(0, 0, 0, 0);
      const isOverdue = scheduledDate < todayDate;
      if (notReceived && isOverdue) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    const received = revenues.reduce((acc, current) => {
      const isReceived = !!current.efetivacao?.efetivado;
      if (isReceived) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    return {
      toReceiveToday: toReceiveToday,
      toReceive: toReceive,
      toReceiveOverdue: toReceiveOverdue,
      received: received,
    };
  }

  return (
    <div className="flex flex-col w-full grow">
      <div className="w-full flex items-center gap-2 justify-center">
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-green-500 text-center text-white text-sm rounded-tl rounded-tr">
            RECEBIDO
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(revenues || []).received)}
            </h1>
          </div>
        </div>
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-[#15599a] text-center text-white text-sm rounded-tl rounded-tr">
            À RECEBER
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(revenues || []).toReceive)}
            </h1>
          </div>
        </div>
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-[#fead41] text-center text-white text-sm rounded-tl rounded-tr">
            À RECEBER HOJE
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(revenues || []).toReceiveToday)}
            </h1>
          </div>
        </div>
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-red-500 text-center text-white text-sm rounded-tl rounded-tr">
            EM ATRASO
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(revenues || []).toReceiveOverdue)}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full items-start flex flex-col lg:flex-row gap-4 justify-between flex-wrap grow mt-4">
        {isLoading ? (
          <div className="w-full grow flex items-center justify-center">
            <LoadingPage />
          </div>
        ) : null}
        {isSuccess && revenues ? (
          revenues.length > 0 ? (
            revenues.map((revenue) => (
              <RevenueCard
                key={revenue._id}
                revenue={revenue}
                openModal={handleOpenModal}
              />
            ))
          ) : (
            <p className="w-full text-center italic text-gray-500">
              Nenhuma receita encontrada...
            </p>
          )
        ) : null}
        {/* {modalRevenue && modalIsOpen ? (
          <ExpenseModal expense={modalRevenue} closeModal={handleCloseModal} />
        ) : null} */}
      </div>
    </div>
  );
}

export default RevenuesWrapper;
