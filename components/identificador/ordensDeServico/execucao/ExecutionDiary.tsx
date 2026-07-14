import Datetime from "@/components/inputs/Datetime";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateServiceOrder } from "@/utils/methods/mutation/service-orders";
import { formatDateInputChange } from "@/utils/methods/shared";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RxTimer } from "react-icons/rx";
import { useQueryClient } from "@tanstack/react-query";
import ExecutionDiaryRecord from "./ExecutionDiaryRecord";
import TextInput from "@/components/inputs/Text";
type ExecutionDiaryProps = {
  orderId: string;
  entryDatetime?: string;
  exitDatetime?: string;
  history?: { entrada: string; saida?: string; anotacoes: string }[];
};

function getEarliestDate(history: { entrada: string; saida?: string; anotacoes: string }[]) {
  const dateArr = history.map((h) => Number(new Date(h.entrada)));
  const minDate = new Date(Math.min.apply(null, dateArr));
  return minDate.toISOString();
}
function ExecutionDiary({ orderId, entryDatetime, exitDatetime, history }: ExecutionDiaryProps) {
  const queryClient = useQueryClient();

  const [infoHolder, setInfoHolder] = useState<{
    entrada: string;
    saida: string | undefined;
    anotacoes: string;
  }>({
    entrada: new Date().toISOString(),
    saida: undefined,
    anotacoes: "",
  });

  async function initializeOS() {
    const loadingToastID = toast.loading("Iniciando ordem de serviço...");
    try {
      await updateServiceOrder({
        changes: { "periodo.inicio": new Date().toISOString() },
        id: orderId,
      });
      toast.dismiss(loadingToastID);
      return toast.success("Ordem de serviço iniciada com sucesso !");
    } catch (error) {
      toast.dismiss(loadingToastID);
      const msg = getErrorMessage(error);
      return toast.error("Erro ao iniciar a ordem de serviço.");
    }
  }
  async function finishOS() {
    const loadingToastID = toast.loading("Finalizando ordem de serviço...");
    try {
      await updateServiceOrder({
        changes: { "periodo.fim": new Date().toISOString() },
        id: orderId,
      });
      toast.dismiss(loadingToastID);
      return toast.success("Ordem de serviço finalizada com sucesso !");
    } catch (error) {
      toast.dismiss(loadingToastID);
      const msg = getErrorMessage(error);
      return toast.error("Erro ao finalizar a ordem de serviço.");
    }
  }

  async function openExecutionRecord() {
    // Verifying existent execution open log
    const historyCopy = history ? [...history] : [];
    const hasOpenLog = historyCopy.some((h) => !!h.entrada && !h.saida);
    if (hasOpenLog) return toast.error("Finalize o registro em aberto antes de abrir um novo.");

    historyCopy.push({
      entrada: infoHolder.entrada,
      saida: infoHolder.saida,
      anotacoes: infoHolder.anotacoes,
    });

    const loadingToastID = toast.loading("Abrindo registro de execução...");
    try {
      const earliestDate = getEarliestDate(historyCopy);
      // Create update object
      var updateObj: any = { "periodo.historico": historyCopy, "periodo.inicio": earliestDate };
      await updateServiceOrder({
        changes: updateObj,
        id: orderId,
      });
      toast.dismiss(loadingToastID);
      return toast.success("Registro aberto com sucesso !");
    } catch (error) {
      toast.dismiss(loadingToastID);
      const msg = getErrorMessage(error);
      return toast.error("Erro ao abrir registro de execução.");
    }
  }

  return (
    <div className="flex w-full flex-col">
      <h1 className="mt-4 w-full rounded-md bg-[#15599A] p-2 text-center font-bold text-white">
        DIÁRIO DE EXECUÇÃO
      </h1>
      <div className="my-2 flex items-center justify-center">
        {entryDatetime && !exitDatetime ? (
          <button
            onClick={() => finishOS()}
            className="hover:bg-primary/70 rounded bg-black px-4 py-2 text-xs font-medium text-white duration-300 ease-in-out"
          >
            FINALIZAR ORDEM DE SERVIÇO
          </button>
        ) : null}
      </div>
      <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <Datetime
            label="CHECK-IN"
            value={infoHolder.entrada}
            handleChange={(value) => {
              localStorage.setItem(
                `${orderId}-checkin`,
                JSON.stringify(formatDateInputChange(value)),
              );
              setInfoHolder((prev) => ({ ...prev, entrada: formatDateInputChange(value) }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="ANOTAÇÕES"
            placeholder="Preencha aqui anotações sobre o registro de execução..."
            value={infoHolder.anotacoes}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, anotacoes: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="my-1 flex w-full items-center justify-end">
        <button
          onClick={() => openExecutionRecord()}
          className="hover:bg-primary/70 rounded bg-black px-4 py-2 text-xs font-medium text-white duration-300 ease-in-out"
        >
          ABRIR REGISTRO DE EXECUÇÃO
        </button>
      </div>
      {history ? (
        <div className="mt-2 flex w-full flex-col gap-1">
          <h1 className="leading-none font-bold tracking-tight">HISTÓRICO</h1>
          {history.map(
            (item, index) => (
              <ExecutionDiaryRecord
                orderId={orderId}
                item={item}
                itemIndex={index}
                history={history}
              />
            ),

            // <div className="flex flex-col w-full p-3 rounded-md shadow-xs border border-border">
            //   <div className="flex items-center gap-2">
            //     <RxTimer />
            //     <p className="font-thin tracking-tight leading-none">
            //       <strong className="text-[#fead41] font-bold">{formatDateAsLocale(item.entrada, true)}</strong> até às{' '}
            //       <strong className="text-[#fead41] font-bold">{formatDateAsLocale(item.saida, true)}</strong>
            //     </p>
            //   </div>
            //   <h1 className="my-1 w-full py-3 bg-primary/20 text-center text-foreground text-sm rounded-md tracking-tight leading-none">
            //     {item.anotacoes}
            //   </h1>
            // </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ExecutionDiary;
