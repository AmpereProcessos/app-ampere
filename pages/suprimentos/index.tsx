import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import dayjsBusinessDays from "dayjs-business-days";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSession } from "../../components/providers/SessionProvider";

import { formatDate, formatDecimalPlaces } from "../../utils/constants";
import { useSupplyProjects } from "../../utils/methods/query/supply";
import { formatDateInputChange } from "../../utils/methods/shared";
import {
  HomologationControlStatus,
  PurchaseControlStatus,
  PurchaseDeliveryStatus,
  accessGrantingStatus,
} from "../../utils/select-options";

import ModalSuprimentos from "../../components/ModalSuprimentos";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import DateInput from "../../components/inputs/Date";
import MultipleSelectInput from "../../components/inputs/MultipleSelect";
import SelectInput from "../../components/inputs/Select";
import TextInput from "../../components/inputs/Text";
import SuprimentosSkeleton from "../../components/skeletons/SuprimentosSkeleton";
import LoadingPage from "../../components/utils/LoadingPage";

import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { VscDiffAdded } from "react-icons/vsc";
import ProjectCardsTags from "../../components/utils/ProjectCardsTags";
dayjs.extend(dayjsBusinessDays);

function getDateDiff(date1: Date, date2: Date) {
  const diffInMs = new Date(date1) - new Date(date2);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return Number(diffInDays).toFixed(0);
}

function Suprimentos() {
  const { session, status } = useSession();
  const isAuthorized = session?.user.permissoes.suprimentos.visualizar;
  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  if (!isAuthorized) return <UnauthorizedPage />;
  return <SuprimentosContent session={session} />;
}

export default Suprimentos;

function SuprimentosContent({ session }: { session: TAuthSession }) {
  const queryClient = useQueryClient();
  const {
    data: projects,
    isSuccess: projectsSuccess,
    filters,
    setFilters,
  } = useSupplyProjects({ enabled: !!session?.user });
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const [modalProject, setModalProject] = useState({
    isOpen: false,
    projectId: null,
  });
  async function handleUpdates() {
    await queryClient.invalidateQueries({ queryKey: ["supply-projects"] });
  }

  function getBorderColor(liberationDate) {
    const diff = dayjs(new Date()).businessDiff(dayjs(liberationDate));
    if (diff > 5) {
      return "border-2 border-red-600";
    } else if (diff >= 4) {
      return "border-2 border-yellow-500";
    } else if (diff > 2) {
      return "border-2 border-blue-700";
    } else {
      return "border border-border";
    }
  }

  function getStats({ info }) {
    if (!info)
      return {
        projetos: 0,
        potencia: 0,
        previsto: 0,
        pago: 0,
        resultado: 0,
        pendentes: 0,
        pendentesPronto: 0,
        emRota: 0,
      };
    const projectsQty = info.length;
    const totalPower = info.reduce((acc, current) => {
      const currentPower = current.sistema?.potPico || 0;

      return acc + currentPower;
    }, 0);
    const totalPredictedPayInKits = info.reduce((acc, current) => {
      const predicted = current.compra?.previsaoValorDoKit || 0;
      const costDefined = !!current.compra?.valorDoKit;
      if (costDefined) {
        return acc + predicted;
      }
      return acc;
    }, 0);
    const totalPaidInKits = info.reduce((acc, current) => {
      const paid = current.compra?.valorDoKit || 0;
      return acc + paid;
    }, 0);
    const pendingPurchases = info.reduce((acc, current) => {
      const purchased = !!current.compra?.dataPedido;
      const status = current.compra.status;
      if (!purchased) return acc + 1;
      else return acc;
    }, 0);
    const pendingReadyToBuy = info.reduce((acc, current) => {
      const purchased = !!current.compra?.dataPedido;
      const accessGrantingAproveed = current.homologacao.status == "APROVADO";
      if (!purchased && accessGrantingAproveed) return acc + 1;
      else return acc;
    }, 0);
    const onDeliveryRoute = info.reduce((acc, current) => {
      const onRoute = current.compra?.statusEntrega == "EM ROTA";
      if (onRoute) return acc + 1;
      else return acc;
    }, 0);
    return {
      projetos: projectsQty,
      potencia: formatDecimalPlaces(totalPower, 2),
      previsto: formatDecimalPlaces(totalPredictedPayInKits, 2),
      pago: formatDecimalPlaces(totalPaidInKits, 2),
      resultado: 100 - (totalPaidInKits / totalPredictedPayInKits) * 100,
      pendentes: pendingPurchases,
      pendentesPronto: pendingReadyToBuy,
      emRota: onDeliveryRoute,
    };
  }

  function handleOpenModal(id) {
    setModalProject({ projectId: id, isOpen: true });
  }

  return (
    <div className="grow p-6">
      <div className="border-border flex flex-col justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              Projetos no estágio de suprimentos
            </p>
          </div>
          {dropdownMenuVisible ? (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(false)}
              />
            </div>
          ) : (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(true)}
              />
            </div>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {getStats({ info: projects }).projetos}
              </div>
              <p className="text-foreground text-xs">{getStats({ info: projects }).potencia} kWp</p>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">COMPRAS PENDENTES</h1>
              <AiOutlineShoppingCart />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {getStats({ info: projects }).pendentes}{" "}
              </div>
              <p className="text-foreground text-xs">
                {getStats({ info: projects }).pendentesPronto} aptas para compra
              </p>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">EM ROTA</h1>
              <TbTruckDelivery />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {getStats({ info: projects }).emRota}
              </div>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">VALOR GASTO EM KITS</h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {getStats({ info: projects }).pago}
              </div>
              <p className="text-foreground text-xs">
                {Number(getStats({ info: projects }).resultado) > 0
                  ? `${formatDecimalPlaces(getStats({ info: projects }).resultado, 2)}% a menos que o previsto`
                  : `${formatDecimalPlaces(getStats({ info: projects }).resultado, 2)}% a mais que o previsto`}{" "}
              </p>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">
                VALOR PREVISTO EM KITS
              </h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {getStats({ info: projects }).previsto}
              </div>
            </div>
          </div>
        </div>
        <div className="my-2 flex w-full items-center justify-end gap-2">
          <Link href="/suprimentos/controle-compras">
            <button className="rounded-md bg-green-400 px-4 py-1 text-sm font-bold text-white">
              CONTROLE DE COMPRAS
            </button>
          </Link>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 flex w-full flex-col gap-y-2"
            >
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <TextInput
                  label={"NOME DO CONTRATO"}
                  value={filters.search}
                  placeholder={"Digite o nome do contrato..."}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                  <div className="flex items-center justify-center gap-x-2">
                    <DateInput
                      label={"DEPOIS DE"}
                      value={filters.date.after ? formatDate(filters.date.after) : undefined}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          date: { ...prev.date, after: formatDateInputChange(value) },
                        }))
                      }
                    />
                    <DateInput
                      label={"ANTES DE"}
                      value={filters.date.before ? formatDate(filters.date.before) : undefined}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          date: { ...prev.date, before: formatDateInputChange(value) },
                        }))
                      }
                    />
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <SelectInput
                      label={"CAMPO DE FILTRO"}
                      value={filters.date.field || null}
                      options={[
                        {
                          id: 1,
                          label: "DATA PAGAMENTO",
                          value: "compra.dataPagamento",
                        },
                        {
                          id: 2,
                          label: "DATA MÁX P/ PAGAMENTO",
                          value: "compra.dataMaxPagamento",
                        },
                        {
                          id: 3,
                          label: "PREVISÃO DE ENTREGA",
                          value: "compra.previsaoEntrega",
                        },
                        {
                          id: 3,
                          label: "DATA DO PEDIDO",
                          value: "compra.dataPedido",
                        },
                      ]}
                      selectedItemLabel={"NÃO DEFINIDO"}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          date: {
                            ...prev.date,
                            field: value,
                          },
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          date: {
                            after: null,
                            before: null,
                            field: null,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, yetToBuy: !prev.yetToBuy }))}
                  className={`rounded-md border border-blue-600 ${
                    filters.yetToBuy ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"
                  } h-[49px] px-4 py-1 text-sm font-bold text-white`}
                >
                  APTO PARA COMPRA
                </button>
                <MultipleSelectInput
                  label={"STATUS DE SUPLEMENTAÇÃO"}
                  selected={filters.supplyStatus}
                  options={PurchaseControlStatus}
                  selectedItemLabel={"NÃO DEFINIDO"}
                  handleChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      supplyStatus: value,
                    }))
                  }
                  onReset={() =>
                    setFilters((prev) => ({
                      ...prev,
                      supplyStatus: [],
                    }))
                  }
                />

                <MultipleSelectInput
                  label={"STATUS DE ENTREGA"}
                  selected={filters.deliveryStatus}
                  options={PurchaseDeliveryStatus}
                  selectedItemLabel={"NÃO DEFINIDO"}
                  handleChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      deliveryStatus: value,
                    }))
                  }
                  onReset={() =>
                    setFilters((prev) => ({
                      ...prev,
                      deliveryStatus: [],
                    }))
                  }
                />

                <MultipleSelectInput
                  label={"STATUS DO PARECER"}
                  selected={filters.accessGrantingStatus}
                  options={HomologationControlStatus}
                  selectedItemLabel={"NÃO DEFINIDO"}
                  handleChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      accessGrantingStatus: value,
                    }))
                  }
                  onReset={() =>
                    setFilters((prev) => ({
                      ...prev,
                      accessGrantingStatus: [],
                    }))
                  }
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex flex-wrap justify-around gap-3">
        {projects?.map((project, index) => (
          <motion.div
            onClick={() => {
              handleOpenModal(project._id);
            }}
            initial={{ opacity: 0, translateX: -50, translateY: -35 }}
            animate={{ opacity: 1, translateX: 0, translateY: 0 }}
            transition={{ duration: 0.3, delay: 0.01 * index }}
            key={project._id}
            className={`w-full cursor-pointer md:w-[350px] lg:w-[450px] ${
              project.compra.dataPedido == undefined
                ? getBorderColor(project.compra.dataLiberacao)
                : "border-border border"
            } dark:hover:bg-primary/10 hover:bg-blue-100`}
          >
            <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
            <div className="flex flex-col p-2">
              <div className="flex items-center justify-between">
                <p className="text-foreground text-xs">{project.nomeDoContrato}</p>
                <p className="text-xs text-[#15599a]">#{project.qtde}</p>
              </div>
              <ProjectCardsTags projectTags={project.etiquetas} />
              <div className="mt-2 grid grid-cols-2">
                <div className="flex flex-col items-start">
                  <span className="text-xxs">INFORMAÇÕES</span>
                  <p className="text-foreground text-xs uppercase">
                    {project.compra.informacoes ? project.compra.informacoes : "-"}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xxs">STATUS</span>
                  <p className="text-foreground text-center text-xs">
                    {project.compra.status ? project.compra.status : "-"}
                  </p>
                </div>
              </div>
              <div className="mt-1 grid grid-cols-3 items-center">
                <div className="flex flex-col items-start">
                  <span className="text-xxs">FORNECEDOR</span>
                  <p className="text-xs text-yellow-500">
                    {project.compra.fornecedor ? project.compra.fornecedor : "-"}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xxs">PREVISÃO ENTREGA</span>
                  {dayjs(new Date()).isBefore(
                    dayjs(dayjs(project.compra.previsaoEntrega).add(22, "hour")),
                  ) ? (
                    <p
                      className={`text-xs ${dayjs(project.compra.previsaoEntrega).diff(new Date(), "day") < 7 ? "font-bold text-red-500" : "font-bold text-green-500"} text-center`}
                    >
                      {project.compra.previsaoEntrega
                        ? dayjs(new Date(project.compra.previsaoEntrega)).isValid()
                          ? dayjs(dayjs(project.compra.previsaoEntrega).add(4, "hour")).format(
                              "DD/MM/YYYY",
                            )
                          : "-"
                        : "-"}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-red-500 lg:text-sm">PREV.VENCIDA</p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xxs">STATUS ENTREGA</span>
                  <p className="text-foreground text-xs">
                    {project.compra.statusEntrega ? project.compra.statusEntrega : "-"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center pt-1">
                <span className="text-xxs">FATURAMENTO</span>
                <p className="text-foreground text-center text-xs uppercase">
                  {project.faturamento?.previsaoFaturamento
                    ? project.faturamento?.previsaoFaturamento
                    : "-"}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex w-full flex-col">
                  <span className="text-xxs text-center">DESDE APROV.PARECER</span>
                  <p className={`text-center text-xs text-red-500 uppercase`}>
                    {project.homologacao.acesso.dataResposta
                      ? `${getDateDiff(new Date(), new Date(project.homologacao.acesso.dataResposta))} DIAS`
                      : "-"}
                  </p>
                </div>
                <div className="flex w-full flex-col">
                  <span className="text-xxs text-center">DESDE LIBERAÇÃO ATÉ PEDIDO</span>
                  <p
                    className={`text-xs ${project.compra.dataPedido ? "text-foreground" : "text-red-500"} text-center`}
                  >
                    {project.compra.dataPedido
                      ? `${dayjs(dayjs(project.compra.dataPedido).add(22, "hour")).businessDiff(dayjs(project.compra.dataLiberacao))} DIAS`
                      : `${dayjs(new Date()).businessDiff(dayjs(project.compra.dataLiberacao))} DIAS`}
                  </p>
                </div>
              </div>
              {project.compra.dataPagamento == undefined &&
              project.compra.dataMaxPagamento != null &&
              dayjs(new Date(project.compra.dataMaxPagamento)).isValid() ? (
                dayjs(project.compra.dataMaxPagamento).isAfter(dayjs()) ? (
                  <p
                    className={`text-center text-sm ${dayjs(project.compra.dataMaxPagamento).diff(new Date(), "days") < 2 ? "text-red-500" : "text-foreground"} italic`}
                  >
                    DATA PAGAMENTO LIMITE EM:{" "}
                    {dayjs(project.compra.dataMaxPagamento).diff(new Date(), "day")} DIA(S)
                  </p>
                ) : (
                  <p className="text-center text-sm font-bold text-red-500 italic">
                    PAGAMENTO ATRASADO
                  </p>
                )
              ) : (
                false
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <Link href={"/obras/conferenciaMaterial"}>
        <div className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
          <p className="text-sm font-bold uppercase">CONFERÊNCIA DE MATERIAIS</p>
        </div>
      </Link>

      {modalProject.isOpen && modalProject.projectId ? (
        <ModalSuprimentos
          projectId={modalProject.projectId}
          modalIsOpen={modalProject.isOpen}
          handleUpdates={handleUpdates}
          closeModal={() => setModalProject({ isOpen: false, projectId: null })}
        />
      ) : null}
    </div>
  );
}
