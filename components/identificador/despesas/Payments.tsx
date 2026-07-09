import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import { formatDate, formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TExpense } from "@/utils/schemas/expenses";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsCalendar, BsCalendarCheck } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

type PaymentsProps = {
  infoHolder: TExpense;
  setInfoHolder: React.Dispatch<React.SetStateAction<TExpense>>;
  missingPercentage: number;
};
function Payments({ infoHolder, setInfoHolder, missingPercentage }: PaymentsProps) {
  const [newFractionnementHolder, setNewFractionnementHolder] = useState<
    TExpense["pagamentos"][number]
  >({
    valor: 0,
    porcentagem: missingPercentage,
    dataPrevisaoPagamento: new Date().toISOString(),
  });
  function addPayment() {
    if (newFractionnementHolder.porcentagem > missingPercentage)
      return toast.error("Porcentagem excede o máximo permitido.");
    if (!newFractionnementHolder.dataPrevisaoPagamento)
      return toast.error("Preencha uma data de previsão de pagamento.");

    const currentFractionnements = [...infoHolder.pagamentos];
    currentFractionnements.push(newFractionnementHolder);
    setInfoHolder((prev) => ({ ...prev, pagamentos: currentFractionnements }));
  }
  function deletePayment(index: number) {
    const currentFractionnements = [...infoHolder.pagamentos];
    currentFractionnements.splice(index, 1);
    setInfoHolder((prev) => ({ ...prev, pagamentos: currentFractionnements }));
  }
  useEffect(() => {
    setNewFractionnementHolder((prev) => ({ ...prev, porcentagem: missingPercentage }));
  }, [missingPercentage]);
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-primary/80 w-full rounded text-center font-bold text-white">PAGAMENTOS</h1>
      <h1 className="text-foreground my-2 w-full self-center text-center text-sm font-medium lg:w-[80%]">
        Os pagamentos serão utilizadas como parametro para o{" "}
        <strong className="text-[#fead41]">regime de referência / regime de caixa.</strong>
      </h1>
      <div className="item-center flex w-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="VALOR"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui o valor do fracionamento..."
            value={newFractionnementHolder.valor || null}
            handleChange={(value) =>
              setNewFractionnementHolder((prev) => ({
                ...prev,
                valor: value,
                porcentagem: (value / infoHolder.total) * 100,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="PORCENTAGEM"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui a porcentagem do fracionamento..."
            value={newFractionnementHolder.porcentagem}
            handleChange={(value) =>
              setNewFractionnementHolder((prev) => ({
                ...prev,
                porcentagem: value,
                valor: (value * infoHolder.total) / 100,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="PREVISÃO DE PAGAMENTO"
            labelClassName="text-sm tracking-tight"
            value={
              newFractionnementHolder.dataPrevisaoPagamento
                ? formatDate(newFractionnementHolder.dataPrevisaoPagamento)
                : undefined
            }
            handleChange={(value) =>
              setNewFractionnementHolder((prev) => ({
                ...prev,
                dataPrevisaoPagamento: formatDateInputChange(value),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE PAGAMENTO"
            labelClassName="text-sm tracking-tight"
            value={
              newFractionnementHolder.dataPagamento
                ? formatDate(newFractionnementHolder.dataPagamento)
                : undefined
            }
            handleChange={(value) =>
              setNewFractionnementHolder((prev) => ({
                ...prev,
                dataPagamento: formatDateInputChange(value),
              }))
            }
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          className="hover:bg-primary/70 rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out"
          onClick={() => addPayment()}
        >
          ADICIONAR
        </button>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-2">
        {infoHolder.pagamentos.map((payment, index) => (
          <PaymentCard
            key={index}
            payment={payment}
            paymentIndex={index}
            infoHolder={infoHolder}
            setInfoHolder={setInfoHolder}
            deletePayment={() => deletePayment(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Payments;

type PaymentCardProps = {
  payment: TExpense["pagamentos"][number];
  paymentIndex: number;
  infoHolder: TExpense;
  setInfoHolder: React.Dispatch<React.SetStateAction<TExpense>>;
  deletePayment: () => void;
};
function PaymentCard({
  payment,
  paymentIndex,
  infoHolder,
  setInfoHolder,
  deletePayment,
}: PaymentCardProps) {
  function updateFractionnementIndex({ info }: { info: TExpense["pagamentos"][number] }) {
    const fractionnements = [...infoHolder.pagamentos];
    fractionnements[paymentIndex] = { ...info };
    return setInfoHolder((prev) => ({ ...prev, pagamentos: fractionnements }));
  }
  return (
    <div className={`border-primary/60 flex w-full flex-col rounded-md border p-2 shadow-xs`}>
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xs leading-none font-black tracking-tight lg:text-sm">
            FRAÇÃO DE {formatDecimalPlaces(payment.porcentagem)}%
          </h1>
          <h1 className="bg-primary/80 rounded-full px-2 py-1 text-[0.65rem] font-medium text-white lg:text-xs">
            {formatToMoney((infoHolder.total * payment.porcentagem) / 100)}
          </h1>
          <button
            onClick={() => deletePayment()}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <MdDelete style={{ color: "red" }} />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="VALOR"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui o valor do fracionamento..."
            value={payment.valor || null}
            handleChange={(value) =>
              updateFractionnementIndex({
                info: { ...payment, valor: value, porcentagem: (value / infoHolder.total) * 100 },
              })
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="PORCENTAGEM"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui a porcentagem do fracionamento..."
            value={payment.porcentagem}
            handleChange={(value) =>
              updateFractionnementIndex({
                info: { ...payment, porcentagem: value, valor: (value * infoHolder.total) / 100 },
              })
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="PREVISÃO DE PAGAMENTO"
            labelClassName="text-sm tracking-tight"
            value={
              payment.dataPrevisaoPagamento ? formatDate(payment.dataPrevisaoPagamento) : undefined
            }
            handleChange={(value) =>
              updateFractionnementIndex({
                info: { ...payment, dataPrevisaoPagamento: formatDateInputChange(value) },
              })
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE PAGAMENTO"
            labelClassName="text-sm tracking-tight"
            value={payment.dataPagamento ? formatDate(payment.dataPagamento) : undefined}
            handleChange={(value) =>
              updateFractionnementIndex({
                info: { ...payment, dataPagamento: formatDateInputChange(value) },
              })
            }
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-wrap items-center justify-start gap-2">
        <div className="flex items-center gap-2">
          <BsCalendar color={"#ffc300"} />
          <p className="text-foreground text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            PREVISTO PARA {formatDateAsLocale(payment.dataPrevisaoPagamento)}
          </p>
        </div>
        {payment.dataPagamento ? (
          <div className="flex items-center gap-2">
            <BsCalendarCheck color={"#76c893"} />
            <p className="text-foreground text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
              RECEBIDO EM {formatDateAsLocale(payment.dataPagamento)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
