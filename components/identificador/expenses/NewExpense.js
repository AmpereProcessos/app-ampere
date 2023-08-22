import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import ProjectVinculationMenu from "./ProjectVinculationMenu";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import SelectInput from "../../inputs/Select";
import {
  centrosDeCusto,
  expenseCategories,
  formatToMoney,
} from "../../../utils/constants";
import TextInput from "../../inputs/Text";
import NumberInput from "../../inputs/Number";
import { MdDelete } from "react-icons/md";
import CheckboxInput from "../../CheckboxInput";
import { insertExpense } from "../../../utils/methods/mutation/expenses";
import { getErrorMessage } from "../../../utils/methods/handlers";
import { useQueryClient } from "react-query";
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

function getExpenseCategories(costApportionment) {
  if (!costApportionment) return [];
  const costApportionmentsObj = centrosDeCusto.find(
    (center) => center.nome == costApportionment
  );
  if (!costApportionmentsObj) return [];

  const options = costApportionmentsObj.categorias.map((category, index) => ({
    id: index + 1,
    ...category,
  }));
  return options;
}

function NewExpense({ closeModal }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [infoHolder, setInfoHolder] = useState({
    rateio: null,
    categoria: null,
    descricao: "",
    projeto: null,
    autor: {
      id: session.user?.id,
      nome: session.user?.name,
    },
    itens: [],
    total: 0,
    criterioReferencia: false,
    criterioCompetencia: false,
    dataInsercao: new Date().toISOString(),
  });
  const [itemHolder, setItemHolder] = useState({
    descricao: "",
    preco: null,
    qtde: null,
  });
  const [insertLoading, setInsertLoading] = useState(false);
  function linkClient(info) {
    const { _id, nomeDoContrato, qtde } = info;
    const project = {
      id: _id,
      nome: nomeDoContrato,
      identificador: qtde,
    };
    setInfoHolder((prev) => ({ ...prev, projeto: project }));
    toast.success("Projeto vinculado com sucesso!");
    return;
  }
  function unlinkClient() {
    setInfoHolder((prev) => ({ ...prev, projeto: null }));
  }
  function addItem() {
    if (itemHolder.descricao.trim().length < 2) {
      toast.error("Prencha uma descrição de item válida.");
      return false;
    }
    if (itemHolder.preco < 0) {
      toast.error("Prencha um preço válido..");
      return false;
    }
    if (itemHolder.qtde <= 0) {
      toast.error("Prencha uma quantidade válida.");
      return false;
    }
    var itemsArr = [...infoHolder.itens];
    itemsArr.push({
      ...itemHolder,
      descricao: itemHolder.descricao.toUpperCase(),
    });
    setInfoHolder((prev) => ({ ...prev, itens: itemsArr }));
    toast.success("Item adicionado !");
    setItemHolder({
      descricao: "",
      preco: null,
      qtde: null,
    });
    return;
  }
  function getExpenseTotal(itens) {
    const total = itens.reduce((acc, current) => {
      const price = current.preco ? current.preco : 0;
      const qtde = current.qtde ? current.qtde : 0;
      const toSum = price * qtde;
      return acc + toSum;
    }, 0);
    return Number(total.toFixed(2));
  }
  async function handleInsertExpense() {
    if (!infoHolder.rateio) {
      toast.error("Preencha o rateio/centro de custo da despesa.");
      return false;
    }
    if (!infoHolder.categoria) {
      toast.error("Preencha a categoria da despesa.");
      return false;
    }
    if (infoHolder.total <= 0) {
      toast.error("Valor da despesa inválido.");
      return false;
    }
    if (!infoHolder.criterioCompetencia && !infoHolder.criterioReferencia) {
      toast.error(
        "Despesa deve ser aplicável a ao menos um critério de análise (Competência ou Referência)."
      );
      return false;
    }
    setInsertLoading(true);
    const loadingToastID = toast.loading("Processando...");
    try {
      const user = {
        id: session?.user.id,
        nome: session?.user.name,
      };
      const response = await insertExpense({ ...infoHolder, autor: user });
      toast.dismiss(loadingToastID);
      toast.success(response);
      setInfoHolder({
        rateio: null,
        categoria: null,
        descricao: "",
        projeto: null,
        autor: {
          id: session.user?.id,
          nome: session.user?.name,
        },
        itens: [],
        total: 0,
        criterioReferencia: false,
        criterioCompetencia: false,
        dataInsercao: new Date().toISOString(),
      });
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setInsertLoading(false);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.dismiss(loadingToastID);
      toast.error(msg);
      setInsertLoading(false);
    }
  }
  useEffect(() => {
    const total = getExpenseTotal(infoHolder.itens);
    setInfoHolder((prev) => ({ ...prev, total: total }));
  }, [infoHolder.itens]);
  return (
    <div style={OVERLAY_STYLES}>
      <div className="w-[80%]" style={MODAL_STYLES}>
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">NOVA DESPESA</h1>
            </div>
            <button>
              <VscChromeClose
                onClick={() => closeModal()}
                style={{ color: "red" }}
              />
            </button>
          </div>
          <div className="flex py-2 px-2 flex-col w-full grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <ProjectVinculationMenu
              linkClient={linkClient}
              unlinkClient={unlinkClient}
            />
            {infoHolder.projeto ? (
              <>
                <div className="flex flex-col w-full my-2">
                  <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm">
                    NOME DO PROJETO
                  </h1>
                  <p className="w-full text-center text-gray-700 font-black font-raleway text-lg">
                    {infoHolder.projeto.nome}
                  </p>
                </div>
              </>
            ) : null}
            <div className="flex flex-col w-full my-2">
              <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm">
                DESCRIÇÃO / DETALHES
              </h1>
              <textarea
                placeholder="Preencha aqui informações adicionais acerca dessa despesas..."
                className="w-full text-sm text-gray-700 p-3 text-center outline-none h-[90px] border border-gray-200 rounded resize-none"
                value={infoHolder.descricao}
                onChange={(e) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col w-full my-2">
              <SelectInput
                editable={true}
                label={"RATEIO / CENTRO DE CUSTO"}
                labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
                selectedItemLabel={"NÃO DEFINIDO"}
                value={infoHolder.rateio}
                options={centrosDeCusto.map((center, index) => ({
                  id: index + 1,
                  label: center.nome,
                  value: center.nome,
                }))}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({ ...prev, rateio: value }))
                }
                onReset={() =>
                  setInfoHolder((prev) => ({ ...prev, rateio: null }))
                }
                width={"100%"}
              />
            </div>
            <div className="flex flex-col w-full my-2">
              <SelectInput
                editable={true}
                label={"CATEGORIA"}
                labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
                selectedItemLabel={"NÃO DEFINIDO"}
                value={infoHolder.categoria}
                options={getExpenseCategories(infoHolder.rateio)}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({ ...prev, categoria: value }))
                }
                onReset={() =>
                  setInfoHolder((prev) => ({ ...prev, categoria: null }))
                }
                width={"100%"}
              />
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
            <div className="flex flex-col w-full my-2">
              <h1 className="w-full text-center bg-gray-500 text-white font-normal font-raleway text-sm">
                ITENS
              </h1>
              <div className="w-full flex flex-col lg:flex-row items-center gap-2 mt-2">
                <div className="w-full lg:flex-[4_4_0%]">
                  <TextInput
                    showLabel={false}
                    placeholder={"Preencha aqui a descrição do item..."}
                    value={itemHolder.descricao}
                    handleChange={(value) =>
                      setItemHolder((prev) => ({ ...prev, descricao: value }))
                    }
                    width={"100%"}
                  />
                </div>
                <div className="w-full lg:flex-[2_2_0%]">
                  <NumberInput
                    showLabel={false}
                    value={itemHolder.preco}
                    placeholder={"Preencha aqui o preço..."}
                    handleChange={(value) =>
                      setItemHolder((prev) => ({ ...prev, preco: value }))
                    }
                    width={"100%"}
                  />
                </div>
                <div className="w-full lg:flex-[2_2_0%]">
                  <NumberInput
                    showLabel={false}
                    value={itemHolder.qtde}
                    placeholder={"Preencha aqui o quantidade..."}
                    handleChange={(value) =>
                      setItemHolder((prev) => ({ ...prev, qtde: value }))
                    }
                    width={"100%"}
                  />
                </div>
                <div className="w-full lg:flex-[1_1_0%] flex items-center justify-center">
                  <button
                    onClick={addItem}
                    className="text-center border h-[41px] p-2 w-fit text-xs font-medium border-green-500 text-green-500 hover:text-white hover:bg-green-500 rounded"
                  >
                    ADICIONAR ITEM
                  </button>
                </div>
              </div>
              {infoHolder.itens.length > 0 ? (
                <>
                  <div className="w-full bg-gray-500 flex items-center gap-2 mt-2 rounded-md">
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                      DESCRIÇÃO
                    </p>
                    <p className="w-full text-center font-medium text-white lg:flex-[2_2_0%]">
                      PREÇO
                    </p>
                    <p className="w-full text-center font-medium text-white lg:flex-[2_2_0%]">
                      QUANTIDADE
                    </p>
                    <p className="w-full text-center font-medium text-white lg:flex-[1_1_0%]">
                      TOTAL
                    </p>
                  </div>
                  {infoHolder.itens.map((item, index) => (
                    <div
                      key={index}
                      className="w-full p-2 border border-gray-300 flex items-center gap-2 my-2 rounded-md"
                    >
                      <p className="w-full text-start font-medium lg:flex-[4_4_0%]">
                        {item.descricao}
                      </p>
                      <p className="w-full text-center font-medium lg:flex-[2_2_0%]">
                        {formatToMoney(item.preco)}
                      </p>
                      <p className="w-full text-center font-medium lg:flex-[2_2_0%]">
                        {item.qtde}
                      </p>
                      <div className="w-full  lg:flex-[1_1_0%] flex items-center justify-center gap-2">
                        <p className="font-medium">
                          {formatToMoney(item.qtde * item.preco)}
                        </p>
                        <button
                          onClick={() => {
                            var itensArr = [...infoHolder.itens];
                            itensArr.splice(index, 1);
                            setInfoHolder((prev) => ({
                              ...prev,
                              itens: itensArr,
                            }));
                          }}
                          className="text-red-300 hover:text-red-500 "
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="w-full bg-gray-500 flex items-center gap-2 rounded-md">
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                      TOTAL
                    </p>
                  </div>
                  <h1 className="w-full py-2 text-center border-b border-gray-300 border-x px-2 font-black text-lg">
                    {formatToMoney(getExpenseTotal(infoHolder.itens))}
                  </h1>
                </>
              ) : (
                <div className="flex items-center justify-center min-h-[40px]">
                  <p className="text-sm italic text-gray-500">
                    Não há itens adicionados...
                  </p>
                </div>
              )}
            </div>
            {!(infoHolder.itens.length > 0) ? (
              <div className="flex justify-center items-center w-full my-2">
                <NumberInput
                  label={"TOTAL DA DESPESA"}
                  labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
                  value={infoHolder.total}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({ ...prev, total: value }))
                  }
                  onReset={() =>
                    setInfoHolder((prev) => ({ ...prev, total: null }))
                  }
                  width={"100%"}
                />
              </div>
            ) : null}

            <div className="flex items-center w-full justify-end mt-2">
              <button
                disabled={insertLoading}
                onClick={handleInsertExpense}
                className="w-fit p-2 rounded border font-medium border-green-500 text-green-500 hover:bg-green-500 hover:text-white disabled:text-gray-500 disabled:border-gray-500"
              >
                CRIAR NOVO REGISTRO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewExpense;
