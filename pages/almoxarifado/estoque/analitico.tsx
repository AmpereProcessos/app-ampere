import MaterialBlock from "@/components/identificador/almoxarifado/estoque/MaterialBlock";
import SupplyAnalyticsView from "@/components/identificador/suprimentos/SupplyAnalyticsView";
import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import { formatToMoney, SlideMotionVariants } from "@/utils/constants";
import { useMaterialsDatabase, useStockAnalytics } from "@/utils/methods/query/materials";
import { endOfDay, startOfDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { IoMdAlert, IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AnalyticsPage() {
  return (
    <main className="flex min-w-0 grow flex-col p-4 md:p-6">
      <Tabs defaultValue="supply" className="min-w-0">
        <div className="mb-6 flex flex-col gap-3 border-b pb-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-black tracking-tight text-[#15599a]">ANALÍTICO</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Indicadores operacionais do estoque e de suprimentos.
            </p>
          </div>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="supply" className="flex-1 md:flex-none">
              Custos e compras
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex-1 md:flex-none">
              Posição do estoque
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="supply" className="mt-0">
          <SupplyAnalyticsView />
        </TabsContent>
        <TabsContent value="stock" className="mt-0">
          <StockPositionAnalytics />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function StockPositionAnalytics() {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
  const {
    data: materialsResult,
    isLoading,
    isError,
    isSuccess,
    filters,
    updateFilters,
  } = useMaterialsDatabase();
  const { data: stockAnalytics } = useStockAnalytics();
  const materials = materialsResult?.materials || [];
  const materialsMatched = materialsResult?.materialsMatched || 0;
  const materialsShowing = materials.length;
  const totalPages = materialsResult?.totalPages || 0;
  return (
    <div className="flex grow flex-col">
      <div className="border-border flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              ANÁLISE DE ESTOQUE
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
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">MATERIAIS</h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{stockAnalytics?.totalItens}</div>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">VALOR DO ESTOQUE</h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {formatToMoney(stockAnalytics?.valorTotalEstoque || 0)}{" "}
              </div>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">ABAIXO DO MÍNIMO</h1>
              <IoMdAlert />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {stockAnalytics?.itensAbaixoMinimo}
              </div>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">ACIMA DO MÁXIMO</h1>
              <IoMdAlert />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {stockAnalytics?.itensAcimaMaximo}
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div
              variants={SlideMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4 flex w-full flex-col gap-y-2"
            >
              <div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
                <TextInput
                  label={"NOME"}
                  value={filters.name}
                  placeholder={"Digite o nome do material..."}
                  handleChange={(value) => updateFilters({ name: value })}
                />

                <div className="flex w-full items-end gap-2 lg:w-[410px]">
                  <div className="min-w-0 grow">
                    <DateIntervalInput
                      label="PERÍODO DE INSERÇÃO"
                      numberOfMonths={1}
                      value={{
                        after: filters.period.after ? new Date(filters.period.after) : undefined,
                        before: filters.period.before ? new Date(filters.period.before) : undefined,
                      }}
                      handleChange={({ after, before }) =>
                        updateFilters({
                          page: 1,
                          period: {
                            field: after || before ? "dataInsercao" : null,
                            after: after ? startOfDay(after).toISOString() : null,
                            before: before ? endOfDay(before).toISOString() : null,
                          },
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!filters.period.after && !filters.period.before}
                    onClick={() =>
                      updateFilters({
                        page: 1,
                        period: { field: null, after: null, before: null },
                      })
                    }
                    className="border-border text-foreground hover:bg-muted focus-visible:ring-ring h-[46.6px] rounded-md border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    LIMPAR
                  </button>
                </div>

                <div className="w-full lg:w-[250px]">
                  <NumberInput
                    label="MENOS QUE"
                    placeholder="Filtrar por menos quantidade que..."
                    value={filters.quantity.lessThan || 0}
                    handleChange={(value) => updateFilters({ quantity: { lessThan: value } })}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <NumberInput
                    label="MAIS QUE"
                    placeholder="Filtrar por mais quantidade que..."
                    value={filters.quantity.greaterThan || 0}
                    handleChange={(value) => updateFilters({ quantity: { greaterThan: value } })}
                    width="100%"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => updateFilters({ minimumUndefined: !filters.minimumUndefined })}
                  className={`rounded-md border border-gray-400 ${
                    filters.minimumUndefined
                      ? "bg-gray-400 text-white"
                      : "bg-transparent text-gray-400"
                  } h-[49px] px-4 py-1 text-sm font-bold text-white`}
                >
                  MÍNIMO INDEFINIDO
                </button>
                <button
                  type="button"
                  onClick={() => updateFilters({ maximumUndefined: !filters.maximumUndefined })}
                  className={`rounded-md border border-gray-400 ${
                    filters.maximumUndefined
                      ? "bg-gray-400 text-white"
                      : "bg-transparent text-gray-400"
                  } h-[49px] px-4 py-1 text-sm font-bold text-white`}
                >
                  MÁXIMO INDEFINIDO
                </button>
                <button
                  type="button"
                  onClick={() => updateFilters({ belowMinimum: !filters.belowMinimum })}
                  className={`rounded-md border border-red-400 ${
                    filters.belowMinimum ? "bg-red-400 text-white" : "bg-transparent text-red-400"
                  } h-[49px] px-4 py-1 text-sm font-bold text-white`}
                >
                  ABAIXO DO MÍNIMO
                </button>
                <button
                  type="button"
                  onClick={() => updateFilters({ aboveMaximum: !filters.aboveMaximum })}
                  className={`rounded-md border border-orange-400 ${
                    filters.aboveMaximum
                      ? "bg-orange-400 text-white"
                      : "bg-transparent text-orange-400"
                  } h-[49px] px-4 py-1 text-sm font-bold text-white`}
                >
                  ACIMA DO MÁXIMO
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <GeneralPaginationComponent
        activePage={filters.page}
        queryLoading={isLoading}
        selectPage={(page) => updateFilters({ page })}
        totalPages={totalPages}
        itemsMatchedText={`Foram encontrados ${materialsMatched} materiais.`}
        itemsShowingText={`Monstrando ${materialsShowing} materiais.`}
      />
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={"Erro ao carregar materiais."} /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-col gap-2 pt-2">
          {materials?.map((material) => (
            <MaterialBlock key={material._id} material={material} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AnalyticsPage;
