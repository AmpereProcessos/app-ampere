import React, { useState } from "react";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import { VscChromeClose } from "react-icons/vsc";
import TextFloatingInput from "./TextFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import { AiOutlineCalendar } from "react-icons/ai";
import dayjs from "dayjs";
import { BsCalendarCheckFill, BsFillCalendarXFill } from "react-icons/bs";
import PurchaseSolicitationItemRow from "./LinhaItemSolicitacaoCompra";
import SaveButton from "./utils/Buttons/SaveButton";
import { FaSave } from "react-icons/fa";
import axios from "axios";
import SelectInput from "./inputs/Select";
import { toast } from "react-hot-toast";
import { useClients } from "../utils/methods/query/clients";
import ProjectVinculationMenu from "../components/identificador/expenses/ProjectVinculationMenu";
import { formatToMoney, motivosSolicitacaoCompra } from "../utils/constants";
import CheckboxInput from "./CheckboxInput";
import { isEmpty } from "../utils/methods/custom";
import { insertExpensesFromPurchaseRequests } from "../utils/methods/mutation/expenses";
import { useSession } from "next-auth/react";
import { getErrorMessage } from "../utils/methods/handlers";

function PurchaseSolicitationModal({
  info,
  closeModal,
  isOpen,
  getSolicitations,
}) {
  const { data: session } = useSession();
  const [infoHolder, setInfo] = useState(info);

  function linkClient(info) {
    const { _id, nomeDoContrato, qtde } = info;
    const project = {
      id: _id,
      nome: nomeDoContrato,
      identificador: qtde,
    };
    setInfo((prev) => ({ ...prev, projeto: project }));
    toast.success("Projeto vinculado com sucesso!");
    return;
  }
  function unlinkClient() {
    setInfo((prev) => ({ ...prev, projeto: null }));
  }
  function getPurchaseMoney(itens) {
    const total = itens.reduce((acc, current) => {
      const qtde = current.qtde ? Number(current.qtde) : 0;
      const price = current.preco ? Number(current.preco) : 0;
      const toSum = qtde * price;
      return acc + toSum;
    }, 0);
    return total;
  }
  async function handleChange() {
    const toastID = toast.loading("Carregando...");
    try {
      const { data } = await axios.put("/api/solicitacoes/compra", {
        id: info._id,
        changes: infoHolder,
      });
      toast.dismiss(toastID);
      toast.success("Alteração feitas com sucesso!");

      getSolicitations();
    } catch (error) {
      toast.dismiss(toastID);
      toast.error("Erro ao atualizar solicitação.");
    }
  }
  async function finishPurchaseSolicitation() {
    if (isEmpty(infoHolder.responsavel)) {
      toast.error("Por favor, preencha o responsável.");
      return false;
    }
    if (!infoHolder.categoria || infoHolder.categoria == "NÃO DEFINIDO") {
      toast.error("Por favor, preencha uma categoria de custo válida.");
      return false;
    }
    if (!infoHolder.criterioCompetencia && !infoHolder.criterioReferencia) {
      toast.error(
        "Por favor, preencha ao menos um critério de custo para finalizar."
      );
      return false;
    }
    if (infoHolder.itens?.some((item) => isEmpty(item.preco))) {
      toast.error("Por favor, preencha o preço de todos os itens.");
      return false;
    }
    const loadingToastID = toast.loading("Carregando...");
    try {
      // updating purchase request information
      const { data: purchaseUpdateResponse } = await axios.put(
        "/api/solicitacoes/compra",
        {
          id: info._id,
          changes: {
            ...infoHolder,
            status: "FINALIZADO",
            dataEfetivacao: new Date().toISOString(),
          },
        }
      );
      setInfo((prev) => ({
        ...prev,
        status: "FINALIZADO",
        dataEfetivacao: new Date().toISOString(),
      }));
      const user = {
        id: session?.user?.id,
        name: session?.user?.name,
      };
      const projectId = infoHolder.projeto ? infoHolder.projeto.id : null;
      const projectName = infoHolder.projeto ? infoHolder.projeto.nome : null;
      const projectQtde = infoHolder.projeto
        ? infoHolder.projeto.identificador
        : null;
      await insertExpensesFromPurchaseRequests({
        category: infoHolder.categoria,
        projectId: projectId,
        projectName: projectName,
        projectQtde: projectQtde,
        user: user,
        materialList: infoHolder.itens,
        competenceCriteria: infoHolder.criterioCompetencia,
        referenceCriteria: infoHolder.referenceCriteria,
      });
      toast.dismiss(loadingToastID);
      toast.success("Solicitação finalizada com sucesso.");
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.dismiss(loadingToastID);
      toast.error(msg);
    }
  }

  return (
    <AnimatedModalWrapper modalIsOpen={isOpen} width={"70%"} height={"90%"}>
      <div className="flex flex-col h-full">
        <div className="w-full flex items-center justify-between pb-2 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <h1 className="text-sm lg:text-lg font-bold text-[#15599a]">
              SOLICITAÇÃO DE COMPRA
            </h1>
            <p className="hidden lg:block text-xs text-gray-500">#{info._id}</p>
          </div>
          <button
            onClick={closeModal}
            className="hover:bg-red-200 rounded-lg p-1 text-red-500"
          >
            <VscChromeClose />
          </button>
        </div>
        <div className="w-full py-2 px-2 grow flex gap-2 flex-col overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex flex-wrap items-center w-full justify-center gap-4 pb-4">
            <div className="flex flex-col items-center">
              <h1 className="text-start text-gray-500 text-xs font-medium">
                SOLICITAÇÃO FEITA EM:
              </h1>
              <div className="flex items-center gap-2">
                <AiOutlineCalendar style={{ color: "#15599a" }} />
                <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                  {info.dataInsercao
                    ? dayjs(info.dataInsercao).format("DD/MM/YY HH:mm")
                    : null}
                </h1>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-end text-gray-500 text-xs font-medium">
                PRAZO:
              </h1>
              <div className="flex items-center justify-end gap-2">
                <BsCalendarCheckFill style={{ color: "rgb(249,115,22)" }} />
                <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                  {info.urgencia}
                </h1>
              </div>
            </div>
            {infoHolder.dataEfetivacao ? (
              <div className="flex flex-col items-center">
                <h1 className="text-end text-gray-500 text-xs font-medium">
                  EFETIVAÇÃO
                </h1>
                <div className="flex items-center justify-end gap-2">
                  <BsCalendarCheckFill
                    style={{
                      color: "rgb(34,197,94)",
                    }}
                  />
                  <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                    {infoHolder.dataEfetivacao
                      ? dayjs(infoHolder.dataEfetivacao).format(
                          "DD/MM/YY HH:mm"
                        )
                      : "NÃO DEFINIDO"}
                  </h1>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-4 lg:flex-row items-center w-full pb-4 mt-2">
            <div className="w-full lg:w-[50%]">
              <SelectFloatingInput
                label={"STATUS"}
                editable={true}
                value={infoHolder.status ? infoHolder.status : "EM ABERTO"}
                options={[
                  { label: "EM ABERTO", value: "EM ABERTO" },
                  { label: "EM ANDAMENTO", value: "EM ANDAMENTO" },
                  {
                    label: "AGUARDANDO APROVAÇÃO",
                    value: "AGUARDANDO APROVAÇÃO",
                  },
                  { label: "COMPRA REALIZADA", value: "COMPRA REALIZADA" },
                  { label: "EM ROTA", value: "EM ROTA" },
                  { label: "FINALIZADO", value: "FINALIZADO" },
                ]}
                handleChange={(value) =>
                  setInfo((prev) => ({ ...prev, status: value }))
                }
                width={"100%"}
              />
            </div>
            <div className="w-full lg:w-[50%]">
              <SelectFloatingInput
                label={"RESPONSÁVEL"}
                editable={true}
                value={
                  infoHolder.responsavel
                    ? infoHolder.responsavel
                    : "NÃO DEFINIDO"
                }
                options={[
                  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  { label: "LUIZ PAULO", value: "LUIZ PAULO" },
                  { label: "PÉRSIA PINHEIRO", value: "PÉRSIA PINHEIRO" },
                  {
                    label: "DANILO DE LIMA",
                    value: "DANILO DE LIMA",
                  },
                  { label: "NATASHA CANDIDO", value: "NATASHA CANDIDO" },
                  { label: "POLLIANA CRISTINA", value: "POLLIANA CRISTINA" },
                  { label: "DIOGO PAULINO", value: "DIOGO PAULINO" },
                ]}
                handleChange={(value) =>
                  setInfo((prev) => ({ ...prev, responsavel: value }))
                }
                width={"100%"}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row items-center w-full pb-4">
            <div className="w-full lg:w-[50%]">
              <TextFloatingInput
                label={"REQUISITANTE"}
                editable={false}
                value={infoHolder.requisitante.nome}
                handleChange={(value) =>
                  setInfo((prev) => ({
                    ...prev,
                    requisitante: { ...prev.requisitante, nome: value },
                  }))
                }
                width={"100%"}
              />
            </div>
            <div className="w-full lg:w-[50%]">
              <TextFloatingInput
                label={"REQUISITANTE"}
                editable={false}
                value={infoHolder.requisitante.telefone}
                handleChange={(value) =>
                  setInfo((prev) => ({
                    ...prev,
                    requisitante: { ...prev.requisitante, telefone: value },
                  }))
                }
                width={"100%"}
              />
            </div>
          </div>
          <div className="w-full">
            <SelectFloatingInput
              label={"MOTIVO"}
              editable={false}
              value={info.motivo}
              options={motivosSolicitacaoCompra}
              handleChange={(value) =>
                setInfo((prev) => ({ ...prev, motivo: value }))
              }
              width={"100%"}
            />
          </div>
          <div className="w-full">
            <SelectFloatingInput
              label={"CATEGORIA DE CUSTO"}
              editable={!infoHolder.dataEfetivacao}
              value={
                infoHolder.categoria ? infoHolder.categoria : "NÃO DEFINIDO"
              }
              options={[
                { label: "KIT'S GERADORES", value: "KIT'S GERADORES" },
                {
                  label: "INSUMOS DE ALMOXARIFADO",
                  value: "INSUMOS DE ALMOXARIFADO",
                },
                {
                  label: "FAXINA/MATERIAIS DO ESCRITÓRIO",
                  value: "FAXINA/MATERIAIS DO ESCRITÓRIO",
                },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) =>
                setInfo((prev) => ({ ...prev, categoria: value }))
              }
              width={"100%"}
            />
          </div>
          <h1 className="text-center text-gray-500 font-normal font-raleway text-sm w-full">
            CRITÉRIO DE CUSTO
          </h1>
          <div className="flex flex-col md:flex-row justify-center gap-2 w-full my-2">
            <CheckboxInput
              editable={!infoHolder.dataEfetivacao}
              checked={infoHolder.criterioCompetencia}
              labelFalse={"NÃO APLICÁVEL A CRITÉRIO DE COMPETÊNCIA"}
              labelTrue={"APLICÁVEL A CRITÉRIO DE COMPETÊNCIA"}
              handleChange={(value) =>
                setInfo((prev) => ({
                  ...prev,
                  criterioCompetencia: value,
                }))
              }
            />
            <CheckboxInput
              editable={!infoHolder.dataEfetivacao}
              checked={infoHolder.criterioReferencia}
              labelFalse={"NÃO APLICÁVEL A CRITÉRIO DE REFERÊNCIA"}
              labelTrue={"APLICÁVEL A CRITÉRIO DE REFERÊNCIA"}
              handleChange={(value) =>
                setInfo((prev) => ({
                  ...prev,
                  criterioReferencia: value,
                }))
              }
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <h1 className="text-sm text-gray-900 scale-75 w-full text-center">
              ANOTAÇÕES
            </h1>
            <textarea
              value={infoHolder.anotacoes}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, anotacoes: e.target.value }))
              }
              placeholder="Anotações sobre a compra, detalhes sobre aprovação e outras informações relevantes..."
              className="outline-none resize-none text-sm border border-gray-200 bg-gray-100 h-[90px] p-1 text-center"
            />
          </div>
          <div className="grow flex flex-col">
            <h1 className="text-[#fead61] text-center font-bold pb-2">ITENS</h1>
            <div className="grid grid-cols-10 items-center w-full bg-gray-500 rounded-tr-md rounded-tl-md ">
              <h1 className="col-span-2 text-center text-xs lg:text-base text-white font-medium p-2">
                NOME
              </h1>
              <h1 className="col-span-1 text-center text-xs lg:text-base text-white font-medium p-2">
                QTDE
              </h1>
              <h1 className="col-span-2 text-center text-xs lg:text-base text-white font-medium p-2">
                COTAÇÃO
              </h1>
              <h1 className="col-span-2 text-center text-xs lg:text-base text-white font-medium p-2">
                DATA DE COMPRA
              </h1>
              <h1 className="col-span-2 text-center text-xs lg:text-base text-white font-medium p-2">
                DATA ENTREGA
              </h1>
              <h1 className="col-span-1 text-center text-xs lg:text-base text-white font-medium p-2">
                AÇÕES
              </h1>
            </div>
            {infoHolder.itens?.map((item, index) => (
              <PurchaseSolicitationItemRow
                index={index}
                infoHolder={infoHolder}
                item={item}
                setInfo={setInfo}
                key={index}
              />
            ))}
            <div className="w-full bg-gray-500 flex items-center gap-2 rounded-md">
              <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">
                TOTAL
              </p>
            </div>
            <h1 className="w-full py-2 text-center border-b border-gray-300 border-x px-2 font-black text-lg rounded-bl rounded-br">
              {formatToMoney(getPurchaseMoney(infoHolder.itens))}
            </h1>
          </div>

          <div className="w-full h-[10px] bg-gray-800"></div>
          {!infoHolder.dataEfetivacao ? (
            <ProjectVinculationMenu
              linkClient={linkClient}
              unlinkClient={unlinkClient}
            />
          ) : null}

          {infoHolder.projeto ? (
            <>
              <div className="flex flex-col w-full my-2">
                <h1 className="w-full text-center text-gray-500 font-normal font-raleway text-sm">
                  PROJETO VINCULADO
                </h1>
                <p className="w-full text-center text-gray-700 font-black font-raleway text-lg">
                  {infoHolder.projeto.nome}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-xs italic text-gray-500">
                    (#{infoHolder.projeto.identificador})
                  </p>
                  <p className="text-xs italic text-gray-500">
                    #{infoHolder.projeto.id}
                  </p>
                </div>
              </div>
            </>
          ) : null}
          <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-300">
            {!infoHolder.dataEfetivacao ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => finishPurchaseSolicitation()}
                  className="bg-green-300 hover:bg-green-500 p-2 text-sm rounded font-bold text-white"
                >
                  EFETIVAR
                </button>
              </div>
            ) : (
              <div></div>
            )}

            <div className="flex items-center justify-center gap-4">
              <SaveButton
                handleClick={handleChange}
                icon={<FaSave />}
                text={"SALVAR"}
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedModalWrapper>
  );
}

export default PurchaseSolicitationModal;
