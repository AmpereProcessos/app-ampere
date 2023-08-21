import React, { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../../../utils/methods/query/expenses";
import LoadingPage from "../../utils/LoadingPage";
import ExpenseCard from "./ExpenseCard";
import ExpenseModal from "./ExpenseModal";
import { AnimatePresence, motion } from "framer-motion";
import FilterButton from "../../utils/Buttons/FilterButton";
import { AiOutlineSearch } from "react-icons/ai";

function ExpensesWrapper({ userAuthorized, dropdownMenuVisible }) {
  const {
    data: expenses,
    isLoading,
    isSuccess,
  } = useExpenses(!!userAuthorized);
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [filters, setFilters] = useState({
    search: "",
  });

  const [modalExpense, setModalExpense] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  function handleFilter() {
    var newArr;
    if (filters.search.trim().length > 0) {
      if (!newArr) newArr = [...expenses];
      newArr = newArr.filter(
        (exp) =>
          exp.projeto?.nome &&
          exp.projeto.nome.toUpperCase().includes(filters.search.toUpperCase())
      );
      console.log("NOVO", newArr);
    }
    if (newArr) {
      setFilteredExpenses(newArr);
    } else {
      setFilteredExpenses(expenses);
    }
  }
  function handleOpenModal(expense) {
    setModalExpense(expense);
    setModalIsOpen(true);
  }
  function handleCloseModal() {
    setModalExpense(null);
    setModalIsOpen(false);
  }
  const renderExpenses = useMemo(() =>
    filteredExpenses?.map((expense) => (
      <ExpenseCard
        key={expense._id}
        expense={expense}
        openModal={handleOpenModal}
      />
    ))
  );
  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);
  console.log(filteredExpenses);
  return (
    <div className="w-full items-start flex flex-col lg:flex-row gap-2 justify-between flex-wrap grow">
      <AnimatePresence>
        {dropdownMenuVisible ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col w-full gap-y-2 mt-4"
          >
            <div className="flex flex-col lg:flex-row items-center justify-end gap-2 flex-wrap">
              <input
                value={filters.search}
                placeholder="NOME DO PROJETO"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="outline-none p-2 h-[41px]  w-full lg:w-[350px] rounded border border-gray-200 placeholder:italic"
                type="text"
              />
              <FilterButton
                text={"FILTRAR"}
                icon={<AiOutlineSearch />}
                handleClick={handleFilter}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {isLoading ? (
        <div className="w-full grow flex items-center justify-center">
          <LoadingPage />
        </div>
      ) : null}
      {isSuccess && filteredExpenses ? (
        filteredExpenses.length > 0 ? (
          <>{renderExpenses}</>
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
