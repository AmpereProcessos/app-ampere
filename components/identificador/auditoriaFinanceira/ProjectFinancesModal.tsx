import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import type { TAuthSession } from "@/lib/authentication/types";
import financialAuditing, { type TProjectFinances } from "@/pages/api/stats/financial-auditing";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useProjectFinances } from "@/utils/methods/query/financial-auditing";
import Link from "next/link";
import React, { useState } from "react";
import { BsCalendarCheck, BsCode } from "react-icons/bs";
import {
  FaCashRegister,
  FaCity,
  FaExternalLinkAlt,
  FaSignature,
  FaSolarPanel,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { FaDiamond, FaHandHoldingDollar } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { ImPower } from "react-icons/im";
import { MdAttachMoney, MdSignalCellularAlt } from "react-icons/md";
import { RxDownload, RxUpload } from "react-icons/rx";
import { TbPercentage, TbTopologyFull } from "react-icons/tb";
import { VscChromeClose } from "react-icons/vsc";
import ExpenseRevenueListItem from "./ExpenseRevenueListItem";
import {
  AreaChart,
  ArrowDown,
  ArrowUp,
  Bolt,
  Code,
  LayoutGrid,
  MapPin,
  Percent,
  Plus,
  Signature,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NewRevenueMenu from "../receitas/NewRevenueMenu";
import NewExpense from "../despesas/modals/NewExpense";
import NewRevenue from "../receitas/modals/NewRevenue";

const PriceDescription = {
  kit: "KIT FOTOVOLTAICO",
  instalacao: "INSTALAÇÃO",
  maoDeObra: "MÃO DE OBRA",
  projeto: "CUSTOS DE PROJETO",
  venda: "CUSTOS DE VENDA",
  padrao: "ADEQUAÇÕES DE PADRÃO",
  estrutura: "ADEQUAÇÕES DE ESTRUTURA",
  extra: "OUTROS SERVIÇOS",
};

type ProjectFinancesModalProps = {
  projectId: string;
  closeModal: () => void;
  session: TAuthSession;
};

function getResults({
  expenses,
  revenues,
}: {
  expenses: TProjectFinances["despesasLista"];
  revenues: TProjectFinances["receitasLista"];
}) {
  if (!expenses || !revenues) return { receitas: 0, despesas: 0, resultado: 0, margem: 0 };
  const totalRevenues = revenues.reduce((acc, current) => acc + current.total, 0);
  const totalExpenses = expenses.reduce((acc, current) => acc + current.total, 0);
  return {
    receitas: totalRevenues,
    despesas: totalExpenses,
    resultado: totalRevenues - totalExpenses,
    margem: (totalRevenues - totalExpenses) / totalRevenues,
  };
}

function ProjectFinancesModal({ projectId, closeModal, session }: ProjectFinancesModalProps) {
  const [newRevenueMenuIsOpen, setNewRevenueMenuIsOpen] = useState<boolean>(false);
  const [newExpenseMenuIsOpen, setNewExpenseMenuIsOpen] = useState<boolean>(false);
  const { data: finances, isLoading, isSuccess, isError } = useProjectFinances({ id: projectId });
  const { receitas, despesas, resultado, margem } = getResults({
    expenses: finances?.despesasLista,
    revenues: finances?.receitasLista,
  });
  const costForecasts = finances?.previsaoDespesas
    ? Object.entries(finances.previsaoDespesas || {}).map(([key, value]) => ({
        identificador: PriceDescription[key as keyof typeof PriceDescription],
        ...value,
      }))
    : [];
  const costForecastsTotal = costForecasts.reduce((acc, current) => acc + current.custo, 0);
  return (
    <ResponsiveDialogDrawerViewOnly
      menuTitle="FINANÇAS DO PROJETO"
      menuDescription="Veja as finanças do projeto."
      menuCancelButtonText="FECHAR"
      stateIsLoading={isLoading}
      stateError={isError ? "Erro ao buscar finanças do projeto." : null}
      closeMenu={closeModal}
      dialogVariant="md"
    >
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={"Erro ao buscar finanças do projeto."} /> : null}
      {isSuccess ? (
        <>
          <div className="w-full flex items-center flex-col  gap-2">
            <div className="w-full flex items-center gap-1.5">
              <LayoutGrid className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">NOME DO CONTRATO</h3>
              <h3 className="text-sm font-semibold tracking-tight">{finances.nome}</h3>
            </div>
            <div className="w-full flex items-center gap-1.5">
              <Code className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">CÓDIGO</h3>
              <h3 className="text-sm font-semibold tracking-tight">{finances.identificador}</h3>
              {finances.idProjetoCRM ? (
                <Button
                  variant={"ghost"}
                  asChild
                  size="fit"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                >
                  <Link
                    href={`https://crm.ampereenergias.com.br/comercial/oportunidades/id/${finances.idProjetoCRM}`}
                  >
                    <FaExternalLinkAlt className="w-3 h-3 min-w-3 min-h-3" />
                    <p className="text-xs tracking-tight">VER NO CRM</p>
                  </Link>
                </Button>
              ) : null}
            </div>
            <div className="w-full flex items-center gap-1.5">
              <UserRound className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">NOME DO VENDEDOR</h3>
              <h3 className="text-sm font-semibold tracking-tight">{finances.vendedor}</h3>
            </div>
            <div className="w-full flex items-center gap-1.5">
              <MapPin className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">CIDADE</h3>
              <h3 className="text-sm font-semibold tracking-tight">{finances.cidade}</h3>
            </div>
            <div className="w-full flex items-center gap-1.5">
              <TbTopologyFull className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">TOPOLOGIA</h3>
              <h3 className="text-sm font-semibold tracking-tight">{finances.topologia}</h3>
            </div>
            <div className="w-full flex items-center gap-1.5">
              <FaSolarPanel className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">NÚMERO DE MÓDULOS</h3>
              <h3 className="text-sm font-semibold tracking-tight">{finances.qtdeModulos}</h3>
            </div>
            <div className="w-full flex items-center gap-1.5">
              <Bolt className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">POTÊNCIA</h3>
              <h3 className="text-sm font-semibold tracking-tight">{finances.potencia} kWp</h3>
            </div>
            <div className="w-full flex items-center gap-1.5">
              <Signature className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">ASSINATURA</h3>
              <h3 className="text-sm font-semibold tracking-tight">
                {formatDateAsLocale(finances.dataAssinatura)}
              </h3>
            </div>
            <div className="w-full flex items-center gap-1.5">
              <BsCalendarCheck className="h-4 min-h-4 w-4 min-w-4" />
              <h3 className="text-sm tracking-tighter text-muted-foreground">CONCLUÍDO EM</h3>
              <h3 className="text-sm font-semibold tracking-tight">
                {finances.dataConclusaoObra
                  ? formatDateAsLocale(finances.dataConclusaoObra)
                  : "NÃO DEFINIDO"}
              </h3>
            </div>
          </div>

          <div className="w-full flex items-center justify-center flex-col lg:flex-row gap-3">
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 px-3 py-3 rounded-xl bg-green-200 text-green-600">
              <div className="flex items-center gap-1.5">
                <ArrowUp className="h-4 min-h-4 w-4 min-w-4" />
                <p className="text-sm font-medium tracking-tight">RECEITAS</p>
              </div>
              <p className="w-full text-center font-bold tracking-wider">
                R$ {formatDecimalPlaces(receitas)}
              </p>
            </div>
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 px-3 py-3 rounded-xl bg-red-200 text-red-600">
              <div className="flex items-center gap-1.5">
                <ArrowDown className="h-4 min-h-4 w-4 min-w-4" />
                <p className="text-sm font-medium tracking-tight">DESPESAS</p>
              </div>
              <p className="w-full text-center font-bold tracking-wider">
                R$ {formatDecimalPlaces(despesas)}
              </p>
            </div>
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 px-3 py-3 rounded-xl bg-blue-200 text-blue-600">
              <div className="flex items-center gap-1.5">
                <AreaChart className="h-4 min-h-4 w-4 min-w-4" />
                <p className="text-sm font-medium tracking-tight">RESULTADO LÍQUIDO</p>
              </div>
              <p className="w-full text-center font-bold tracking-wider">
                R$ {formatDecimalPlaces(resultado)}
              </p>
            </div>
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 px-3 py-3 rounded-xl bg-secondary text-secondary-foreground">
              <div className="flex items-center gap-1.5">
                <Percent className="h-4 min-h-4 w-4 min-w-4" />
                <p className="text-sm font-medium tracking-tight">MARGEM DE LUCRO</p>
              </div>
              <p className="w-full text-center font-bold tracking-wider">
                {formatDecimalPlaces(margem * 100)}%
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <Button asChild className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
              <Link href={`/admin/auditoria-financeira/pdf/${projectId}`}>
                <FaExternalLinkAlt className="w-3 h-3 min-w-3 min-h-3" />
                <p className="text-xs tracking-tight">IR À PÁGINA DE RELATÓRIO</p>
              </Link>
            </Button>
          </div>
          <div className="w-full flex flex-col gap-3 p-3 rounded-lg bg-green-100 font-raleway">
            <div className="w-full flex items-center justify-between gap-3 border-b border-green-600 pb-2">
              <h3 className="text-sm font-bold text-green-600">RECEITAS</h3>
              <p className="text-sm font-semibold tracking-tight px-2 py-1 rounded-lg bg-green-600 text-white">
                TOTAL: R$ {formatDecimalPlaces(receitas)}
              </p>
            </div>
            <div className="flex w-full flex-col gap-1">
              {finances.receitasLista && finances.receitasLista.length > 0 ? (
                finances.receitasLista.map((revenue, index) => (
                  <ExpenseRevenueListItem
                    key={index.toString()}
                    session={session}
                    finance={revenue}
                    tag="REVENUE"
                  />
                ))
              ) : (
                <p className="text-foreground w-full text-center text-sm italic">
                  Não há receitas vinculadas ao projeto.
                </p>
              )}
            </div>
            <div className="w-full flex items-center justify-center">
              <Button
                onClick={() => setNewRevenueMenuIsOpen((prev) => !prev)}
                size="fit"
                variant="ghost"
                className="flex items-center gap-1 px-2 py-1 text-xs"
              >
                <Plus className="w-4 h-4 min-w-4 min-h-4" />
                ADICIONAR RECEITA
              </Button>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3 p-3 rounded-lg bg-red-100 font-raleway">
            <div className="w-full flex items-center justify-between gap-3 border-b border-red-600 pb-2">
              <h3 className="text-sm font-bold text-red-600">DESPESAS</h3>
              <p className="text-sm font-semibold tracking-tight px-2 py-1 rounded-lg bg-red-600 text-white">
                TOTAL: R$ {formatDecimalPlaces(despesas)}
              </p>
            </div>
            <div className="flex w-full flex-col gap-1">
              {finances.despesasLista && finances.despesasLista.length > 0 ? (
                finances.despesasLista.map((expense, index) => (
                  <ExpenseRevenueListItem
                    key={index.toString()}
                    session={session}
                    finance={expense}
                    tag="EXPENSE"
                  />
                ))
              ) : (
                <p className="text-foreground w-full text-center text-sm italic">
                  Não há despesas vinculadas ao projeto.
                </p>
              )}
            </div>
            <div className="w-full flex items-center justify-center">
              <Button
                onClick={() => setNewExpenseMenuIsOpen((prev) => !prev)}
                size="fit"
                variant="ghost"
                className="flex items-center gap-1 px-2 py-1 text-xs"
              >
                <Plus className="w-4 h-4 min-w-4 min-h-4" />
                ADICIONAR DESPESA
              </Button>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3 p-3 rounded-lg bg-secondary font-raleway">
            <div className="w-full flex items-center justify-between gap-3 border-b border-secondary-foreground pb-2">
              <h3 className="text-sm font-bold text-secondary-foreground">PREVISÃO DE CUSTOS</h3>
              <p className="text-sm font-semibold tracking-tight px-2 py-1 rounded-lg bg-secondary-foreground text-secondary">
                TOTAL: R$ {formatDecimalPlaces(costForecastsTotal)}
              </p>
            </div>
            {costForecasts.length > 0 ? (
              <div className="flex w-full flex-wrap justify-around gap-2">
                {costForecasts.map((forecast, index) => (
                  <div
                    key={index.toString()}
                    className="border-border flex w-full flex-col rounded-md border p-4 lg:w-[450px]"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <h1 className="text-xs leading-none font-black tracking-tight lg:text-sm">
                        {forecast.identificador}
                      </h1>
                      <div className="bg-primary/80 flex min-w-fit items-center gap-2 rounded-full px-2 py-1">
                        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">
                          {formatToMoney(forecast.custo)}
                        </h1>
                      </div>
                    </div>
                    <div className="mt-1 flex w-full flex-wrap items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TbPercentage size={15} color="#15599a" />
                        <p className="text-foreground text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
                          IMPOSTO: {formatDecimalPlaces(forecast.imposto * 100)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdSignalCellularAlt size={15} color="#fead41" />
                        <p className="text-foreground text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
                          MARGEM: {formatDecimalPlaces(forecast.margemLucro * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground w-full text-center text-sm italic">
                Não há previsão de custos vinculada ao projeto.
              </p>
            )}
          </div>
          {newRevenueMenuIsOpen ? (
            <NewRevenue
              session={session}
              initialState={{
                projeto: {
                  id: projectId,
                  nome: finances.nome,
                  identificador: finances.index,
                },
              }}
              closeModal={() => setNewRevenueMenuIsOpen(false)}
            />
          ) : null}
          {newExpenseMenuIsOpen ? (
            <NewExpense
              session={session}
              initialState={{
                projeto: {
                  id: projectId,
                  nome: finances.nome,
                  identificador: finances.index,
                },
              }}
              closeModal={() => setNewExpenseMenuIsOpen(false)}
            />
          ) : null}
        </>
      ) : null}
    </ResponsiveDialogDrawerViewOnly>
  );
}

export default ProjectFinancesModal;
