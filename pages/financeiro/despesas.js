import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ExpensesWrapper from "../../components/identificador/expenses/ExpensesWrapper";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import NewExpense from "../../components/identificador/expenses/NewExpense";
function Despesas() {
  const router = useRouter();
  const { data: session } = useSession({
    onUnauthenticated: () => {
      router.push("/auth/authHome");
    },
  });
  const isAuthorized = !!session?.user.accessibleRoutes.includes("ADM");
  const [newExpenseModalIsOpen, setNewExpenseModalIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
  });
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
  useEffect(() => {
    if (session?.user && !isAuthorized) router.push("/");
  }, [session?.user]);
  return (
    <div className="p-6 grow flex flex-col gap-2">
      <div className="flex flex-col w-full pb-1 border-b border-gray-200">
        <div className="flex items-center gap-2 font-['Roboto']  justify-between">
          <p className="font-bold uppercase text-start text-2xl text-[#15599a]">
            REGISTROS DE DESPESAS
          </p>
          {dropdownMenuVisible ? (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropupCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(false)}
              />
            </div>
          ) : (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(true)}
              />
            </div>
          )}
        </div>
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
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <ExpensesWrapper
        filters={filters}
        userAuthorized={isAuthorized}
        dropdownMenuVisible={dropdownMenuVisible}
      />
      <a
        onClick={() => setNewExpenseModalIsOpen(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10"
      >
        <p className="uppercase font-bold text-sm">NOVA DESPESA</p>
      </a>
      {/* {newExpenseModalIsOpen ? (
        <NewExpense closeModal={() => setNewExpenseModalIsOpen(false)} />
      ) : null} */}
    </div>
  );
}

export default Despesas;
