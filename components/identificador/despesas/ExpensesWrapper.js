import React, { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../../../utils/methods/query/expenses";
import LoadingPage from "../../utils/LoadingPage";
import ExpenseCard from "./ExpenseCard";
import ExpenseModal from "./ExpenseModal";
import { AnimatePresence, motion } from "framer-motion";
import FilterButton from "../../utils/Buttons/FilterButton";
import { AiOutlineSearch } from "react-icons/ai";
import { formatToMoney } from "../../../utils/constants";
import dayjs from "dayjs";

function ExpensesWrapper({ userAuthorized, filters }) {
  const {
    data: expenses,
    isLoading,
    isSuccess,
  } = useExpenses(!!userAuthorized, filters);

  const [modalExpense, setModalExpense] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleOpenModal(expense) {
    setModalExpense(expense);
    setModalIsOpen(true);
  }
  function handleCloseModal() {
    setModalExpense(null);
    setModalIsOpen(false);
  }

  function getStats(expenses) {
    const toPayToday = expenses.reduce((acc, current) => {
      const unpaid = !current.efetivacao?.efetivado;
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
      if (unpaid && isScheduledToday) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    const toPay = expenses.reduce((acc, current) => {
      const unpaid = !current.efetivacao?.efetivado;
      const scheduledDate = current.efetivacao?.data
        ? new Date(dayjs(current.efetivacao.data).add(3, "hours")).setHours(
            0,
            0,
            0,
            0
          )
        : null;
      const todayDate = new Date().setHours(0, 0, 0, 0);
      const yetToPay = scheduledDate >= todayDate;
      if (unpaid && yetToPay) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    const toPayOverdue = expenses.reduce((acc, current) => {
      const unpaid = !current.efetivacao?.efetivado;
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
      if (unpaid && isOverdue) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    const paid = expenses.reduce((acc, current) => {
      const isPaid = !!current.efetivacao?.efetivado;
      if (isPaid) {
        const total = current.total;
        return acc + total;
      } else {
        return acc + 0;
      }
    }, 0);
    return {
      toPayToday: toPayToday,
      toPay: toPay,
      toPayOverdue: toPayOverdue,
      paid: paid,
    };
  }

  return (
    <div className="flex flex-col w-full grow">
      <div className="w-full flex items-center gap-2 justify-center">
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-green-500 text-center text-white text-sm rounded-tl rounded-tr">
            PAGO
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(expenses || []).paid)}
            </h1>
          </div>
        </div>
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-[#15599a] text-center text-white text-sm rounded-tl rounded-tr">
            À PAGAR
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(expenses || []).toPay)}
            </h1>
          </div>
        </div>
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-[#fead41] text-center text-white text-sm rounded-tl rounded-tr">
            À PAGAR HOJE
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(expenses || []).toPayToday)}
            </h1>
          </div>
        </div>
        <div className="w-[200px] flex flex-col rounded border border-gray-300 shadow-md min-h-[100px]">
          <div className="w-full bg-red-500 text-center text-white text-sm rounded-tl rounded-tr">
            EM ATRASO
          </div>
          <div className="w-full grow flex items-center justify-center">
            <h1 className="font-raleway text-center font-bold">
              {formatToMoney(getStats(expenses || []).toPayOverdue)}
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
        {isSuccess && expenses ? (
          expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseCard
                key={expense._id}
                expense={expense}
                openModal={handleOpenModal}
              />
            ))
          ) : (
            <p className="w-full text-center italic text-gray-500">
              Nenhuma despesa encontrada...
            </p>
          )
        ) : null}
        {modalExpense && modalIsOpen ? (
          <ExpenseModal expense={modalExpense} closeModal={handleCloseModal} />
        ) : null}
      </div>
    </div>
  );
}

export default ExpensesWrapper;
