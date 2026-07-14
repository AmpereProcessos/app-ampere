import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/utils/icons";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { cn } from "@/lib/utils";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useFinancesFinancialAccounts } from "@/utils/methods/query/finances";
import { formatDateForInputValue, formatDateInputChange } from "@/utils/methods/shared";
import { isValidNumber } from "@/utils/methods/validating";
import {
  FinancialAccountTypeOptions,
  FinancialTransactionPaymentMethodsOptions,
  FinancialTransactionTypeOptions,
} from "@/utils/select-options";
import { TUseAccountingEntryState } from "@/utils/state/accounting-entry";
import { AlertCircle, ArrowRightLeft, CheckCircle2, Clock, PencilIcon, Tags } from "lucide-react";
import { useMemo, useState } from "react";
import { BsCalendar, BsCalendarCheck } from "react-icons/bs";
import { AddMultiFinancialTransactionsMenu } from "./add-multi-financial-transactions-menu";

type FinancialTransactionsBlockProps = {
  entryTotalValue: number;
  entryFinancialTransactions: TUseAccountingEntryState["state"]["entryFinancialTransactions"];
  addFinancialTransaction: TUseAccountingEntryState["addFinancialTransaction"];
  updateFinancialTransaction: TUseAccountingEntryState["updateFinancialTransaction"];
  removeFinancialTransaction: TUseAccountingEntryState["removeFinancialTransaction"];
  redefineFinancialTransactions: TUseAccountingEntryState["redefineFinancialTransactions"];
};

export default function FinancialTransactionsBlock({
  entryTotalValue,
  entryFinancialTransactions,
  addFinancialTransaction,
  updateFinancialTransaction,
  removeFinancialTransaction,
  redefineFinancialTransactions,
}: FinancialTransactionsBlockProps) {
  const [newFinancialTransactionModalIsOpen, setNewFinancialTransactionModalIsOpen] =
    useState(false);
  const [addMultiMenuIsOpen, setAddMultiMenuIsOpen] = useState(false);
  const [editingTransactionIndex, setEditingTransactionIndex] = useState<number | null>(null);
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="TRANSACÕES FINANCEIRAS"
      sectionTitleIcon={<ArrowRightLeft size={15} />}
    >
      <div className="w-full flex flex-wrap items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setAddMultiMenuIsOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusIcon width={14} height={14} />
          MÚLTIPLAS
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setNewFinancialTransactionModalIsOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusIcon width={14} height={14} />
          ADICIONAR
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {entryFinancialTransactions.length > 0 ? (
          entryFinancialTransactions.map((transaction, index) => {
            if (transaction.deletar) return null;
            return (
              <TransactionCard
                key={index}
                transaction={transaction}
                onEditClick={() => setEditingTransactionIndex(index)}
              />
            );
          })
        ) : (
          <p className="text-foreground w-full text-center text-xs font-medium italic">
            Nenhuma transação financeira adicionada.
          </p>
        )}
      </div>
      {addMultiMenuIsOpen ? (
        <AddMultiFinancialTransactionsMenu
          entryTotalValue={entryTotalValue}
          onCommit={(rows) => {
            redefineFinancialTransactions([...entryFinancialTransactions, ...rows]);
            setAddMultiMenuIsOpen(false);
          }}
          closeMenu={() => setAddMultiMenuIsOpen(false)}
        />
      ) : null}
      {newFinancialTransactionModalIsOpen ? (
        <FinancialTransactionMenu
          initialTransaction={undefined}
          commitFinancialTransaction={(transaction) => {
            addFinancialTransaction(transaction);
            setNewFinancialTransactionModalIsOpen(false);
          }}
          closeMenu={() => setNewFinancialTransactionModalIsOpen(false)}
        />
      ) : null}
      {isValidNumber(editingTransactionIndex) ? (
        <FinancialTransactionMenu
          initialTransaction={entryFinancialTransactions[editingTransactionIndex as number]}
          commitFinancialTransaction={(transaction) => {
            updateFinancialTransaction({
              index: editingTransactionIndex as number,
              changes: transaction,
            });
            setEditingTransactionIndex(null);
          }}
          closeMenu={() => setEditingTransactionIndex(null)}
        />
      ) : null}
    </ResponsiveDialogDrawerSection>
  );
}

type TransactionCardProps = {
  transaction: TUseAccountingEntryState["state"]["entryFinancialTransactions"][number];
  onEditClick: () => void;
};

function TransactionCard({ transaction, onEditClick }: TransactionCardProps) {
  const typeConfig = useMemo(
    () => FinancialTransactionTypeOptions.find((o) => o.value === transaction.tipo) ?? null,
    [transaction.tipo],
  );

  const isEffective = !!transaction.dataEfetivacao;
  const isOverdue =
    !isEffective && !!transaction.dataPrevisao && new Date(transaction.dataPrevisao) < new Date();
  const statusConfig = useMemo(() => {
    return {
      label: isEffective ? "EFETIVADA" : isOverdue ? "EM ATRASO" : "PENDENTE",
      className: isEffective
        ? "bg-green-100 text-green-700"
        : isOverdue
          ? "bg-red-100 text-red-700"
          : "bg-blue-100 text-blue-700",
      icon: isEffective ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : isOverdue ? (
        <AlertCircle className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      ),
    };
  }, [isEffective, isOverdue]);

  const paymentMethodConfig = useMemo(() => {
    return (
      FinancialTransactionPaymentMethodsOptions.find((o) => o.value === transaction.metodo) ?? null
    );
  }, [transaction.metodo]);

  const financialAccountTypeConfig = useMemo(() => {
    return (
      FinancialAccountTypeOptions.find((o) => o.value === transaction.contaFinanceira?.tipo) ?? null
    );
  }, [transaction.contaFinanceira?.tipo]);

  return (
    <div className="bg-card border-border flex w-full flex-col gap-1.5 rounded-xl border px-3 py-4 shadow-2xs">
      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 flex-wrap">
          {typeConfig ? (
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[0.65rem]",
                typeConfig.colors.background,
                typeConfig.colors.text,
              )}
            >
              {typeConfig.icon}
            </span>
          ) : null}
          <h1 className="text-xs font-bold tracking-tight lg:text-sm">
            {transaction.titulo || "TÍTULO NÃO DEFINIDO"}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[0.65rem]",
              statusConfig.className,
            )}
          >
            {statusConfig.icon}
          </span>
          <span className="text-sm font-semibold">{formatToMoney(transaction.valor)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {transaction.contaFinanceira ? (
          <span className={cn("flex items-center gap-1.5 text-[0.65rem]")}>
            {financialAccountTypeConfig?.icon}
            {transaction.contaFinanceira.nome}
          </span>
        ) : null}
        {paymentMethodConfig ? (
          <span className={cn("flex items-center gap-1.5 text-[0.65rem]")}>
            {paymentMethodConfig.icon}
            {paymentMethodConfig.label}
          </span>
        ) : null}

        {transaction.totalParcelas && transaction.totalParcelas > 1 ? (
          <span className="text-[0.65rem] text-muted-foreground">
            Parcela {transaction.parcela}/{transaction.totalParcelas}
          </span>
        ) : null}
      </div>

      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {transaction.dataEfetivacao ? (
            <div className={cn("flex items-center gap-1.5 text-[0.65rem] font-bold text-primary")}>
              <BsCalendarCheck className="w-3 min-w-3 h-3 min-h-3 text-green-600" />
              <p className="text-xs font-medium tracking-tight uppercase">
                EFETIVADA: {formatDateAsLocale(transaction.dataEfetivacao)}
              </p>
            </div>
          ) : transaction.dataPrevisao ? (
            <div className={cn("flex items-center gap-1.5 text-[0.65rem] font-bold text-primary")}>
              <BsCalendar className="w-3 min-w-3 h-3 min-h-3 text-amber-600" />
              <p className="text-xs font-medium tracking-tight uppercase">
                PREVISÃO: {formatDateAsLocale(transaction.dataPrevisao)}
              </p>
            </div>
          ) : null}
        </div>
        <Button
          size={"xs"}
          variant={"ghost"}
          className="flex items-center gap-1"
          onClick={onEditClick}
        >
          <PencilIcon className="w-4 h-4" />
          EDITAR
        </Button>
      </div>
    </div>
  );
}

type FinancialTransactionMenuProps = {
  initialTransaction?: TUseAccountingEntryState["state"]["entryFinancialTransactions"][number];
  commitFinancialTransaction: (
    transaction: TUseAccountingEntryState["state"]["entryFinancialTransactions"][number],
  ) => void;
  closeMenu: () => void;
};
function FinancialTransactionMenu({
  initialTransaction,
  commitFinancialTransaction,
  closeMenu,
}: FinancialTransactionMenuProps) {
  const { data: financialAccountsData } = useFinancesFinancialAccounts({
    initialParams: { activeOnly: true },
  });

  const options = useMemo(() => {
    return (
      financialAccountsData?.accounts.map((account) => ({
        id: account.id,
        value: account.id,
        label: account.nome,
      })) ?? []
    );
  }, [financialAccountsData]);
  const [financialTransactionHolder, setFinancialTransactionHolder] = useState<
    TUseAccountingEntryState["state"]["entryFinancialTransactions"][number]
  >(
    initialTransaction ?? {
      titulo: "",
      tipo: "ENTRADA",
      valor: 0,
      dataPrevisao: new Date().toISOString(),
      dataEfetivacao: null,
      metodo: "PIX",
      contaFinanceira: {
        id: "",
        nome: "",
        tipo: "BANCO",
      },
      dataInsercao: new Date().toISOString(),
    },
  );
  return (
    <ResponsiveDialogDrawer
      menuTitle={initialTransaction ? "EDITAR TRANSACÃO FINANCEIRA" : "NOVA TRANSACÃO FINANCEIRA"}
      menuDescription={
        initialTransaction
          ? "Preencha os campos abaixo para editar a transação financeira."
          : "Preencha os campos abaixo para adicionar uma nova transação financeira."
      }
      menuActionButtonText={
        initialTransaction ? "ATUALIZAR TRANSACÃO FINANCEIRA" : "ADICIONAR TRANSACÃO FINANCEIRA"
      }
      menuCancelButtonText="CANCELAR"
      actionFunction={() => commitFinancialTransaction(financialTransactionHolder)}
      actionIsPending={false}
      stateIsLoading={false}
      closeMenu={closeMenu}
    >
      <TextInput
        label="TÍTULO"
        placeholder="Preencha o título da transação financeira..."
        value={financialTransactionHolder.titulo}
        handleChange={(value) =>
          setFinancialTransactionHolder((prev) => ({ ...prev, titulo: value }))
        }
        width="100%"
      />
      <SelectInput
        label="TIPO"
        value={financialTransactionHolder.tipo}
        handleChange={(value) =>
          setFinancialTransactionHolder((prev) => ({ ...prev, tipo: value as typeof prev.tipo }))
        }
        options={FinancialTransactionTypeOptions.map((option) => ({
          id: option.id,
          value: option.value,
          label: option.label,
        }))}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() =>
          setFinancialTransactionHolder((prev) => ({
            ...prev,
            tipo: FinancialTransactionTypeOptions[0].value,
          }))
        }
        width="100%"
      />

      <NumberInput
        label="VALOR"
        value={financialTransactionHolder.valor}
        handleChange={(value) =>
          setFinancialTransactionHolder((prev) => ({ ...prev, valor: value }))
        }
        placeholder="Preencha o valor da transação..."
        width="100%"
      />
      <SelectInput
        label="MÉTODO"
        value={financialTransactionHolder.metodo}
        handleChange={(value) =>
          setFinancialTransactionHolder((prev) => ({
            ...prev,
            metodo: value as typeof prev.metodo,
          }))
        }
        options={FinancialTransactionPaymentMethodsOptions.map((option) => ({
          id: option.id,
          value: option.value,
          label: option.label,
        }))}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => setFinancialTransactionHolder((prev) => ({ ...prev, metodo: "A DEFINIR" }))}
        width="100%"
      />
      <DateInput
        label="DATA DE PREVISÃO"
        value={formatDateForInputValue(financialTransactionHolder.dataPrevisao)}
        handleChange={(value) =>
          setFinancialTransactionHolder((prev) => ({
            ...prev,
            dataPrevisao: formatDateInputChange(value, "string") || prev.dataPrevisao,
          }))
        }
        width="100%"
      />
      <DateInput
        label="DATA DE EFETIVAÇÃO"
        value={formatDateForInputValue(financialTransactionHolder.dataEfetivacao)}
        handleChange={(value) =>
          setFinancialTransactionHolder((prev) => ({
            ...prev,
            dataEfetivacao: formatDateInputChange(value, "string"),
          }))
        }
        width="100%"
      />
      <SelectInput
        label="CONTA FINANCEIRA"
        value={financialTransactionHolder.contaFinanceira.id}
        handleChange={(value) => {
          const selectedAccount = financialAccountsData?.accounts.find(
            (account) => account.id === value,
          );
          if (!selectedAccount) {
            return setFinancialTransactionHolder((prev) => ({
              ...prev,
              contaFinanceira: { id: "", nome: "", tipo: "BANCO" },
            }));
          }
          setFinancialTransactionHolder((prev) => ({
            ...prev,
            contaFinanceira: {
              id: selectedAccount.id,
              nome: selectedAccount.nome,
              tipo: selectedAccount.tipo,
            },
          }));
        }}
        options={options}
        selectedItemLabel="NÃO DEFINIDA"
        onReset={() =>
          setFinancialTransactionHolder((prev) => ({
            ...prev,
            contaFinanceira: { id: "", nome: "", tipo: "BANCO" },
          }))
        }
        width="100%"
      />

      <ResponsiveDialogDrawerSection
        sectionTitleText="COMPLEMENTOS"
        sectionTitleIcon={<Tags size={15} />}
      >
        <NumberInput
          label="PARCELA"
          value={financialTransactionHolder.parcela ?? 0}
          handleChange={(value) =>
            setFinancialTransactionHolder((prev) => ({
              ...prev,
              parcela: value > 0 ? value : null,
            }))
          }
          placeholder="Informe o número da parcela..."
          width="100%"
        />
        <NumberInput
          label="TOTAL DE PARCELAS"
          value={financialTransactionHolder.totalParcelas ?? 0}
          handleChange={(value) =>
            setFinancialTransactionHolder((prev) => ({
              ...prev,
              totalParcelas: value > 0 ? value : null,
            }))
          }
          placeholder="Informe o total de parcelas..."
          width="100%"
        />
      </ResponsiveDialogDrawerSection>
    </ResponsiveDialogDrawer>
  );
}
