import React, { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../../../utils/methods/query/expenses";
import LoadingPage from "../../utils/LoadingPage";
import ExpenseCard from "./ExpenseCard";
import ExpenseModal from "./ExpenseModal";
import { AnimatePresence, motion } from "framer-motion";
import FilterButton from "../../utils/Buttons/FilterButton";
import { AiOutlineSearch } from "react-icons/ai";

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

  return (
    <div className="w-full items-start flex flex-col lg:flex-row gap-2 justify-between flex-wrap grow">
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
  );
}

export default ExpensesWrapper;
