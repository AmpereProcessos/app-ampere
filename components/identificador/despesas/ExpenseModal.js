import dayjs from "dayjs";
import React, { useState } from "react";
import { BsCalendarFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { formatDate, formatToMoney } from "../../../utils/constants";
import ExpenseListItem from "./ExpenseListItem";
import { updateExpense } from "../../../utils/methods/mutation/expenses";
import { getErrorMessage } from "../../../utils/methods/handlers";
import { toast } from "react-hot-toast";
import { useQueryClient } from "react-query";
import DateInput from "../../inputs/Date";
import CheckboxInput from "../../CheckboxInput";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  height: "87%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function ExpenseModal({ expense, closeModal }) {
  const queryClient = useQueryClient();
  const [infoHolder, setInfoHolder] = useState(expense);
  function getTotal(expensesItems) {
    const total = expensesItems.reduce((accumulator, current) => {
      const price = current.preco ? current.preco : 0;
      const qty = current.qtde ? current.qtde : 0;
      const toBeSummed = price * qty;
      return toBeSummed + accumulator;
    }, 0);
    return Number(total.toFixed(2));
  }
  async function handleUpdate() {
    var changes = { ...infoHolder, total: getTotal(infoHolder.itens) };
    delete changes._id;
    try {
      const resp = await updateExpense({
        expenseId: expense._id,
        changes: changes,
      });
      toast.success(resp);
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
    }
  }
  console.log(infoHolder);
  return (
    <div style={OVERLAY_STYLES}>
      <div className="w-[80%]" style={MODAL_STYLES}>
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                ALTERAÇÃO DE DESPESA
              </h1>
              <p className="text-sm text-gray-500 italic">#{expense._id}</p>
            </div>
            <button>
              <VscChromeClose
                onClick={() => closeModal()}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex py-2 flex-col w-full grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="w-full flex gap-2 items-center justify-center">
              <div className="flex items-center gap-4">
                <BsCalendarFill color="rgb(34,197,94)" />
                <p className="text-gray-500 font-medium text-xs">
                  {dayjs(expense.dataInsercao).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaUserAlt color="rgb(34,197,94)" />
                <p className="text-gray-500 font-medium text-xs">
                  {expense.autor.nome}
                </p>
              </div>
            </div>
            {expense.projeto ? (
              <div className="flex flex-col w-full my-2">
                <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm">
                  NOME DO PROJETO
                </h1>
                <p className="w-full text-center text-gray-700 font-black font-raleway text-lg">
                  {expense.projeto.nome}
                </p>
              </div>
            ) : null}
            <div className="flex flex-col w-full my-2">
              <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm">
                RATEIO / CENTRO DE CUSTO
              </h1>
              <p className="w-full text-center text-blue-500 font-black font-raleway text-lg">
                {expense.rateio}
              </p>
            </div>
            <div className="flex flex-col w-full my-2">
              <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm">
                CATEGORIA DA DESPESA
              </h1>
              <p className="w-full text-center text-blue-500 font-black font-raleway text-lg">
                {expense.categoria}
              </p>
            </div>
            <div className="flex flex-col w-full my-2">
              <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm">
                DETALHES ADICIONAIS
              </h1>
              <p className="w-full text-center text-gray-500 font-bold font-raleway text-sm italic">
                {expense.descricao
                  ? expense.descricao
                  : "Sem detalhes adicionais referentes a essa despesa..."}
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-2 w-full my-2">
              <CheckboxInput
                checked={infoHolder.criterioCompetencia}
                labelFalse={"NÃO APLICÁVEL A CRITÉRIO DE COMPETÊNCIA"}
                labelTrue={"APLICÁVEL A CRITÉRIO DE COMPETÊNCIA"}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    criterioCompetencia: value,
                  }))
                }
              />
              <CheckboxInput
                checked={infoHolder.criterioReferencia}
                labelFalse={"NÃO APLICÁVEL A CRITÉRIO DE REFERÊNCIA"}
                labelTrue={"APLICÁVEL A CRITÉRIO DE REFERÊNCIA"}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    criterioReferencia: value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col justify-center  items-center gap-2 w-full my-2">
              <DateInput
                label={
                  infoHolder.efetivacao?.efetivado
                    ? "DATA DA EFETIVAÇÃO"
                    : "PREVISÃO DE EFETIVAÇÃO"
                }
                labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
                value={
                  infoHolder.efetivacao?.data
                    ? formatDate(infoHolder.efetivacao.data)
                    : undefined
                }
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    efetivacao: {
                      ...prev.efetivacao,
                      data: new Date(value).toISOString(),
                    },
                  }))
                }
              />
              <CheckboxInput
                checked={infoHolder.efetivacao?.efetivado}
                labelFalse={"NÃO EFETIVADO"}
                labelTrue={"EFETIVADO"}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    efetivacao: {
                      ...prev.efetivacao,
                      efetivado: value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col w-full my-2 px-2">
              <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm pb-1">
                LISTA DE ITENS
              </h1>
              <div className="w-full bg-gray-500 text-white flex items-center gap-2 p-2 rounded">
                <h1 className="font-bold text-center w-3/6">DESCRIÇÃO</h1>
                <h1 className="font-bold text-center w-1/6">QUANTIDADE</h1>
                <h1 className="font-bold text-center w-1/6">PREÇO UNITÁRIO</h1>

                <h1 className="font-bold text-center w-1/6">VALOR TOTAL</h1>
              </div>
              {expense.itens.length > 0 ? (
                expense.itens.map((item, index) => (
                  <ExpenseListItem
                    key={index}
                    item={item}
                    index={index}
                    items={infoHolder.itens}
                    setExpenseInfo={setInfoHolder}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center min-h-[40px]">
                  <p className="text-sm italic text-gray-500">
                    Não há itens adicionados...
                  </p>
                </div>
              )}
              <div className="w-full bg-gray-500 text-white flex items-center gap-2 p-2 rounded">
                <h1 className="font-bold text-center w-full">VALOR TOTAL</h1>
              </div>
              <h1 className="w-full py-2 text-center border-b border-gray-300 border-x px-2 font-black text-lg">
                {expense.itens.length > 0
                  ? formatToMoney(getTotal(expense.itens))
                  : formatToMoney(expense.total)}
              </h1>
            </div>
            <div className="w-full flex items-center justify-end px-2">
              <button
                onClick={() => handleUpdate()}
                className="p-2 rounded w-fit border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 font-bold text-sm"
              >
                SALVAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseModal;
