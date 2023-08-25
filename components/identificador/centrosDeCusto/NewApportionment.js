import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "../../inputs/Text";
import NumberInput from "../../inputs/Number";
import { toast } from "react-hot-toast";
import { formatToMoney } from "../../../utils/constants";
import { MdDelete } from "react-icons/md";
import MonthYearPicker from "../../inputs/MonthPicker";

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

function NewApportionment({ closeModal }) {
  const [infoHolder, setInfoHolder] = useState({
    nome: "",
    categorias: [],
    orcamento: 0,
  });
  const [categoryHolder, setCategoryHolder] = useState({
    nome: "",
    orcamento: 0,
  });
  function addCategory() {
    const { nome, orcamento } = categoryHolder;
    if (nome.trim().length < 2) {
      toast.error("Preencha um nome válido para a categoria.");
      return false;
    }
    if (orcamento < 0) {
      toast.error("Preencha um orçamento válido para a categoria.");
      return false;
    }
    const budget = {
      label: nome.toUpperCase(),
      value: nome.toUpperCase(),
      orcamento: orcamento,
    };
    var categories = [...infoHolder.categorias];
    categories.push(budget);

    setInfoHolder((prev) => ({ ...prev, categorias: categories }));
    setCategoryHolder({ nome: "", orcamento: 0 });
  }
  function getBudgetFromCategorias(categories) {
    const total = categories.reduce((acc, current) => {
      const currentBudget = current.orcamento ? current.orcamento : 0;
      return acc + currentBudget;
    }, 0);
    return total;
  }
  useEffect(() => {
    const total = getBudgetFromCategorias(infoHolder.categorias);
    setInfoHolder((prev) => ({ ...prev, orcamento: total }));
  }, [infoHolder.categorias]);

  return (
    <div style={OVERLAY_STYLES}>
      <div
        className="lg:w-[50%] w-[80%] lg:h-[70%] h-[90%]"
        style={MODAL_STYLES}
      >
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                NOVO RATEIO DE DESPESAS
              </h1>
            </div>
            <button>
              <VscChromeClose
                onClick={() => closeModal()}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex flex-col py-2 px-2 w-full grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <TextInput
              label={"NOME DO RATEIO"}
              labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
              value={infoHolder.nome}
              handleChange={(value) =>
                setInfoHolder((prev) => ({ ...prev, nome: value }))
              }
              placeholder={
                "Preencha aqui o nome a ser dado ao novo rateio de custos."
              }
              width={"100%"}
            />
            <div className="flex flex-col w-full my-2">
              <h1 className="w-full text-center bg-gray-500 text-white font-normal font-raleway text-sm">
                CATEGORIAS
              </h1>
              <div className="flex items-end gap-2 w-full mt-2">
                <div className="flex items-end gap-2 grow">
                  <div className="w-[80%]">
                    <TextInput
                      label={"NOME DO CATEGORIA"}
                      labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
                      value={categoryHolder.nome}
                      handleChange={(value) =>
                        setCategoryHolder((prev) => ({ ...prev, nome: value }))
                      }
                      placeholder={
                        "Preencha aqui o nome a ser dado à categoria."
                      }
                      width={"100%"}
                    />
                  </div>
                  <div className="w-[20%]">
                    <NumberInput
                      label={"ORÇAMENTO"}
                      labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
                      value={categoryHolder.orcamento}
                      handleChange={(value) =>
                        setCategoryHolder((prev) => ({
                          ...prev,
                          orcamento: value,
                        }))
                      }
                      placeholder={
                        "Preencha aqui o orçamento a ser dado à categoria."
                      }
                      width={"100%"}
                    />
                  </div>
                </div>
                <button
                  onClick={addCategory}
                  className="text-center border h-[46px] p-2 w-fit text-xs font-medium border-green-500 text-green-500 hover:text-white hover:bg-green-500 rounded"
                >
                  ADICIONAR ITEM
                </button>
              </div>
              {infoHolder.categorias.length > 0 ? (
                <>
                  <div className="w-full bg-gray-500 flex items-center gap-2 mt-1 rounded-md">
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                      NOME
                    </p>
                    <p className="w-full text-center font-medium text-white lg:flex-[2_2_0%]">
                      ORÇAMENTO
                    </p>
                    <p className="w-full text-center font-medium text-white lg:flex-[1_1_0%]">
                      AÇÕES
                    </p>
                  </div>
                  {infoHolder.categorias.map((category, index) => (
                    <div
                      key={index}
                      className="w-full p-2 border border-gray-300 flex items-center gap-2 my-1 rounded-md"
                    >
                      <p className="w-full text-center font-medium lg:flex-[4_4_0%]">
                        {category.value}
                      </p>
                      <p className="w-full text-center font-medium lg:flex-[2_2_0%]">
                        {category.orcamento > 0
                          ? formatToMoney(category.orcamento)
                          : "-"}
                      </p>
                      <div className="w-full  flex items-center justify-center gap-2 lg:flex-[1_1_0%]">
                        <button
                          onClick={() => {
                            var itensArr = [...infoHolder.categorias];
                            itensArr.splice(index, 1);
                            setInfoHolder((prev) => ({
                              ...prev,
                              categorias: itensArr,
                            }));
                          }}
                          className="text-red-300 hover:text-red-500 "
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="w-full text-center text-gray-500 italic py-4">
                  Nenhuma categoria cadastrada
                </p>
              )}
            </div>
            {infoHolder.categorias.length > 0 ? (
              <>
                <div className="w-full bg-gray-500 flex items-center gap-2 rounded-md">
                  <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                    ORÇAMENTO GERAL
                  </p>
                </div>
                <h1 className="w-full py-2 text-center border-b border-gray-300 border-x px-2 font-black text-lg">
                  {formatToMoney(
                    getBudgetFromCategorias(infoHolder.categorias)
                  )}
                </h1>
              </>
            ) : (
              <div className="w-full flex items-center">
                <div className="w-[60%]">
                  <NumberInput
                    label={"ORÇAMENTO GERAL"}
                    labelClassName="w-full bg-gray-500 text-center text-white font-normal font-raleway text-sm"
                    value={infoHolder.orcamento}
                    handleChange={(value) =>
                      setInfoHolder((prev) => ({
                        ...prev,
                        orcamento: value,
                      }))
                    }
                    placeholder={
                      "Preencha aqui o orçamento a ser a esse rateio de custos."
                    }
                    width={"100%"}
                  />
                </div>
                <div className="w-[40%]">
                  <MonthYearPicker
                    label={"MÊS/ANO"}
                    value={null}
                    width={"100%"}
                    handleChange={(value) => console.log(value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewApportionment;
