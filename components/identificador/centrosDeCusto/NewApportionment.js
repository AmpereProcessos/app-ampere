import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "../../inputs/Text";
import NumberInput from "../../inputs/Number";
import { toast } from "react-hot-toast";
import { formatToMoney } from "../../../utils/constants";
import { MdDelete } from "react-icons/md";
import MonthYearPicker from "../../inputs/MonthPicker";
import { useInsertApportionment } from "../../../utils/methods/mutation/costApportionments";
import { getErrorMessage } from "../../../utils/methods/handlers";
import { useQueryClient } from "@tanstack/react-query";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
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
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();
const period = `${currentMonth.toString().padStart(2, "0")}/${currentYear}`;
const infoHolderInitialState = {
  nome: "",
  categorias: [],
  orcamentos: [],
};
function NewApportionment({ closeModal }) {
  const queryClient = useQueryClient();
  const { mutate: insertApportionment, isLoading, isSuccess } = useInsertApportionment();
  const [infoHolder, setInfoHolder] = useState(infoHolderInitialState);
  const [categoryHolder, setCategoryHolder] = useState({
    nome: "",
  });
  const [budgetHolder, setBudgetHolder] = useState({
    valor: 0,
    periodo: period,
  });
  function addCategory() {
    const { nome } = categoryHolder;
    if (nome.trim().length < 2) {
      toast.error("Preencha um nome válido para a categoria.");
      return false;
    }
    const budget = {
      label: nome.toUpperCase(),
      value: nome.toUpperCase(),
    };
    var categories = [...infoHolder.categorias];
    categories.push(budget);

    setInfoHolder((prev) => ({ ...prev, categorias: categories }));
    setCategoryHolder({ nome: "" });
  }
  function addBudget() {
    const { valor, periodo } = budgetHolder;
    if (valor <= 0) {
      toast.error("Preencha um valor válido para orçamento.");
      return;
    }
    if (!periodo) {
      toast.error("Preencha o período.");
      return;
    }
    var budgets = [...infoHolder.orcamentos];
    budgets.push({ valor, periodo });
    // Sorting by period asceding order
    budgets = budgets.sort((a, b) => {
      const currentDay = new Date().getDate().toString();
      const [monthA, yearA] = a.periodo.split("/");
      const [monthB, yearB] = b.periodo.split("/");

      const dateA = new Date(yearA + "-" + monthA + "-" + currentDay);
      const dateB = new Date(yearB + "-" + monthB + "-" + currentDay);

      return dateA - dateB;
    });

    setInfoHolder((prev) => ({ ...prev, orcamentos: budgets }));
    toast.success("Orçamento adicionado com sucesso.");
  }
  async function handleApportionmentInsertion() {
    if (!infoHolder.nome || infoHolder.nome.trim().length < 2) {
      toast.error("Preencha um nome válido para o centro de custo.");
      return false;
    }
    if (infoHolder.categorias.length <= 0) {
      toast.error("Adicione 1 ao menos uma categoria.");
      return false;
    }
    const loadingToastId = toast.loading("Carregando...", { duration: 5000 });
    try {
      insertApportionment(infoHolder, {
        onSuccess: async (data) => {
          toast.dismiss(loadingToastId);
          toast.success(data);
          // Resetting info holder
          setInfoHolder(infoHolderInitialState);
          await queryClient.cancelQueries({ queryKey: ["costApportionments"] });
        },
        onSettled: async () => {
          await queryClient.invalidateQueries({ queryKey: ["costApportionments"] });
        },
      });
    } catch (error) {
      toast.dismiss(loadingToastId);
      const msg = getErrorMessage(error);
      toast.error(msg);
    }
  }
  return (
    <div style={OVERLAY_STYLES}>
      <div className="h-[90%] w-[80%] lg:h-[70%] lg:w-[50%]" style={MODAL_STYLES}>
        <div className="flex h-full w-full flex-col">
          <div className="border-border flex items-center justify-between border-b px-2 pb-2 text-lg">
            <div className="flex items-center gap-x-2">
              <h1 className="pl-6 font-bold text-[#15599a]">NOVO RATEIO DE DESPESAS</h1>
            </div>
            <button>
              <VscChromeClose onClick={() => closeModal()} style={{ color: "red" }} />
            </button>
          </div>
          <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex w-full grow flex-col overflow-y-auto px-2 py-2">
            <TextInput
              label={"NOME DO RATEIO"}
              labelClassName="text-center text-foreground font-normal font-raleway text-sm"
              value={infoHolder.nome}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
              placeholder={"Preencha aqui o nome a ser dado ao novo rateio de custos."}
              width={"100%"}
            />
            <div className="my-2 flex w-full flex-col">
              <h1 className="font-raleway bg-primary/60 w-full text-center text-sm font-normal text-white">
                CATEGORIAS
              </h1>
              <div className="mt-2 flex w-full items-end gap-2">
                <div className="flex grow items-end gap-2">
                  <div className="w-full">
                    <TextInput
                      label={"NOME DO CATEGORIA"}
                      labelClassName="text-center text-foreground font-normal font-raleway text-sm"
                      value={categoryHolder.nome}
                      handleChange={(value) =>
                        setCategoryHolder((prev) => ({ ...prev, nome: value }))
                      }
                      placeholder={"Preencha aqui o nome a ser dado à categoria."}
                      width={"100%"}
                    />
                  </div>
                </div>
                <button
                  onClick={addCategory}
                  className="h-[46px] w-fit rounded border border-green-500 p-2 text-center text-xs font-medium text-green-500 hover:bg-green-500 hover:text-white"
                >
                  ADICIONAR ITEM
                </button>
              </div>
              {infoHolder.categorias.length > 0 ? (
                <>
                  <div className="bg-primary/60 mt-1 flex w-full items-center gap-2 rounded-md">
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                      NOME
                    </p>

                    <p className="w-full text-center font-medium text-white lg:flex-[1_1_0%]">
                      AÇÕES
                    </p>
                  </div>
                  {infoHolder.categorias.map((category, index) => (
                    <div
                      key={index}
                      className="border-border my-1 flex w-full items-center gap-2 rounded-md border p-2"
                    >
                      <p className="w-full text-center font-medium lg:flex-[4_4_0%]">
                        {category.value}
                      </p>
                      <div className="flex w-full items-center justify-center gap-2 lg:flex-[1_1_0%]">
                        <button
                          onClick={() => {
                            var itensArr = [...infoHolder.categorias];
                            itensArr.splice(index, 1);
                            setInfoHolder((prev) => ({
                              ...prev,
                              categorias: itensArr,
                            }));
                          }}
                          className="text-red-300 hover:text-red-500"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-foreground w-full py-4 text-center italic">
                  Nenhuma categoria cadastrada
                </p>
              )}
            </div>

            <div className="flex w-full flex-col items-center">
              <h1 className="font-raleway bg-primary/60 w-full text-center text-sm font-normal text-white">
                ORÇAMENTOS
              </h1>
              <div className="mt-2 flex w-full items-end gap-2">
                <div className="flex grow gap-2">
                  <div className="w-[60%]">
                    <NumberInput
                      label={"VALOR"}
                      labelClassName="text-center text-foreground font-normal font-raleway text-sm"
                      value={budgetHolder.valor}
                      handleChange={(value) =>
                        setBudgetHolder((prev) => ({
                          ...prev,
                          valor: value,
                        }))
                      }
                      placeholder={"Preencha aqui o orçamento a ser a esse rateio de custos."}
                      width={"100%"}
                    />
                  </div>
                  <div className="w-[40%]">
                    <MonthYearPicker
                      label={"MÊS/ANO"}
                      labelClassName="text-center text-foreground font-normal font-raleway text-sm"
                      value={budgetHolder.periodo}
                      width={"100%"}
                      handleChange={(value) =>
                        setBudgetHolder((prev) => ({
                          ...prev,
                          periodo: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={addBudget}
                  className="add-center h-[46px] w-fit rounded border border-green-500 p-2 text-xs font-medium text-green-500 hover:bg-green-500 hover:text-white"
                >
                  ADICIONAR ITEM
                </button>
              </div>
              {infoHolder.orcamentos.length > 0 ? (
                <>
                  <div className="bg-primary/60 mt-1 flex w-full items-center gap-2 rounded-md">
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                      VALOR
                    </p>
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                      PERÍODO
                    </p>

                    <p className="w-full text-center font-medium text-white lg:flex-[1_1_0%]">
                      AÇÕES
                    </p>
                  </div>
                  {infoHolder.orcamentos.map((budget, index) => (
                    <div
                      key={index}
                      className="border-border my-1 flex w-full items-center gap-2 rounded-md border p-2"
                    >
                      <p className="w-full text-center font-medium lg:flex-[4_4_0%]">
                        {budget.valor}
                      </p>
                      <p className="w-full text-center font-medium lg:flex-[4_4_0%]">
                        {budget.periodo}
                      </p>
                      <div className="flex w-full items-center justify-center gap-2 lg:flex-[1_1_0%]">
                        <button
                          onClick={() => {
                            var itensArr = [...infoHolder.orcamentos];
                            itensArr.splice(index, 1);
                            setInfoHolder((prev) => ({
                              ...prev,
                              orcamentos: itensArr,
                            }));
                          }}
                          className="text-red-300 hover:text-red-500"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-foreground w-full py-4 text-center italic">
                  Nenhum orçamento cadastrada
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-end py-2">
            <button
              disabled={isLoading}
              onClick={() => handleApportionmentInsertion()}
              className="disabled:bg-primary/80 w-fit rounded border border-green-500 p-2 font-medium text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white disabled:text-white"
            >
              CRIAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewApportionment;
