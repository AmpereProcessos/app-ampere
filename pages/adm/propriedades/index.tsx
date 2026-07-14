import EditProperty from "@/components/identificador/propriedades/EditProperty";
import NewProperty from "@/components/identificador/propriedades/NewProperty";
import PropertyCard from "@/components/identificador/propriedades/PropertyCard";
import DateIntervalInput from "@/components/inputs/DateIntervalInput";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { getExcelFromJSON } from "@/lib/excel-utils";
import { PROPERTY_METADATA_TYPES_CONFIG } from "@/lib/properties";
import { cn } from "@/lib/utils";
import type { TGetPropertiesDefaultOutput } from "@/pages/api/propriedades";
import { SlideMotionVariants } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useProperties, usePropertiesStats } from "@/utils/methods/query/properties";
import { renderIconWithClassNames } from "@/utils/methods/rendering";
import type { TProperty } from "@/utils/schemas/properties";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Car, ChartArea, Download, Eye, File, Landmark, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

type TEditModal = {
  id: string | null;
  isOpen: boolean;
};

function Properties() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  return <PropertiesContent session={session} />;
}

export default Properties;

type PropertiesContentProps = {
  session: TAuthSession;
};
function PropertiesContent({ session }: PropertiesContentProps) {
  const {
    data: properties,
    isLoading,
    isError,
    isSuccess,
    filters,
    updateFilters,
  } = useProperties({ initialFilters: { includeOpenUsages: true } });
  const [newPropertyModalIsOpen, setNewPropertyModalIsOpen] = useState<boolean>(false);
  const [editPropertyModal, setEditPropertyModal] = useState<TEditModal>({
    id: null,
    isOpen: false,
  });

  const statusOptions = [
    { label: "TODOS", value: "all" },
    { label: "SOMENTE ATIVOS", value: "active-only" },
    { label: "SOMENTE INATIVOS", value: "inactive-only" },
  ];
  function handleExportToExcel(properties: TGetPropertiesDefaultOutput | undefined) {
    if (!properties) return toast.error("Nenhuma propriedade encontrada para exportar.");
    const excelData = properties.map((property) => ({
      NOME: property.nome,
      IDENTIFICADOR: property.identificador,
      TIPO: property.metadados.tipo,
      "KM INICIAL": property.metadados.kmInicial,
      "KM ACUMULADO": property.metadados.kmAcumulado,
      "KM PROXIMA REVISAO": property.metadados.kmProximaRevisao,
      REVISOES: property.metadados.revisoes
        .map(
          (revision) =>
            `Revisão em ${revision.km}km, feita em ${formatDateAsLocale(revision.data)}.`,
        )
        .join("\n"),
      "DATA DE INSERÇÃO": property.dataInsercao,
      ANOTAÇÕES: property.anotacoes,
      "IMAGEM URL": property.imagemUrl ?? "N/A",
      "LINK DE USO TEMPORÁRIO": `${process.env.NEXT_PUBLIC_APP_URL}/publico/uso-temporario-propriedade/${property._id}`,
    }));
    getExcelFromJSON(excelData, "propriedades");
  }
  return (
    <div className="flex h-full w-full grow flex-col gap-6 p-6">
      <div className="border-border flex w-full flex-col gap-3 border-b pb-1">
        <div className="flex flex-col items-center justify-between">
          <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              CONTROLE DE PROPRIEDADES
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={() => handleExportToExcel(properties)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button type="button" onClick={() => setNewPropertyModalIsOpen(true)}>
                CADASTRAR PROPRIEDADE
              </Button>
            </div>
          </div>

          <motion.div
            variants={SlideMotionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mt-4 flex w-full flex-col gap-y-2"
          >
            <div className="flex w-full flex-col gap-y-2">
              <div className="border-border flex w-full items-center gap-2 rounded-lg border p-2">
                <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full">
                  <Search className="h-4 min-h-4 w-4 min-w-4" />
                </div>
                <input
                  placeholder="PESQUISAR PROPRIEDADE..."
                  value={filters.search || ""}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="grow text-xs ring-0 outline-hidden placeholder:font-medium focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="flex w-full items-center justify-start gap-2">
                <h1 className="text-foreground text-sm font-medium">TIPOS DE PROPRIEDADE</h1>
                {Object.entries(PROPERTY_METADATA_TYPES_CONFIG).map(([type, config]) => (
                  <Button
                    key={type}
                    variant={"ghost"}
                    size={"fit"}
                    className={cn("flex items-center gap-2 px-2 py-1", config.stylingClassName, {
                      "opacity-100": filters.metadataTypes.includes(
                        type as TProperty["metadados"]["tipo"],
                      ),
                      "bg-primary/20": !filters.metadataTypes.includes(
                        type as TProperty["metadados"]["tipo"],
                      ),
                    })}
                    onClick={() =>
                      updateFilters({
                        metadataTypes: filters.metadataTypes.includes(
                          type as TProperty["metadados"]["tipo"],
                        )
                          ? filters.metadataTypes.filter((t) => t !== type)
                          : [...filters.metadataTypes, type as TProperty["metadados"]["tipo"]],
                      })
                    }
                  >
                    {renderIconWithClassNames(config.icon, "h-4 w-4")}
                    <p className="text-sm">{config.name}</p>
                  </Button>
                ))}
              </div>
              <div className="flex w-full items-center justify-start gap-2">
                <h1 className="text-foreground text-sm font-medium">STATUS DA PROPRIEDADE</h1>
                {statusOptions.map((status) => (
                  <Button
                    key={status.value}
                    variant={"ghost"}
                    size={"fit"}
                    className={cn("flex items-center gap-2 px-2 py-1", {
                      "opacity-100 bg-primary text-primary-foreground":
                        filters.status === status.value,
                      "bg-primary/20": filters.status !== status.value,
                    })}
                    onClick={() =>
                      updateFilters({
                        status:
                          filters.status === status.value
                            ? null
                            : (status.value as "all" | "active-only" | "inactive-only"),
                      })
                    }
                  >
                    <p className="text-sm">{status.label}</p>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant={"link"} asChild>
            <Link href={"/adm/propriedades/usos-temporarios-pdf-qr-codes"}>PDF QR CODES</Link>
          </Button>
          <Button variant={"link"} asChild>
            <Link href={"/adm/propriedades/usos-temporarios"}>USOS TEMPORÁRIOS</Link>
          </Button>
        </div>
      </div>
      <PropertiesStats />
      <div className="flex w-full flex-col gap-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar propriedades..." /> : null}
        {isSuccess ? (
          properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                openModal={(id) => setEditPropertyModal({ id: id, isOpen: true })}
              />
            ))
          ) : (
            <div className="flex w-full items-center justify-center gap-2">
              <p className="text-foreground w-full text-center font-medium italic">
                Nenhuma propriedade para os parâmetros estabelecidos.
              </p>
            </div>
          )
        ) : null}
      </div>
      {editPropertyModal.id && editPropertyModal.isOpen ? (
        <EditProperty
          propertyId={editPropertyModal.id}
          session={session}
          closeModal={() => setEditPropertyModal({ id: null, isOpen: false })}
        />
      ) : null}
      {newPropertyModalIsOpen ? (
        <NewProperty session={session} closeModal={() => setNewPropertyModalIsOpen(false)} />
      ) : null}
    </div>
  );
}

function PropertiesStats() {
  const [showStats, setShowStats] = useState<boolean>(false);
  const {
    data: stats,
    isLoading,
    isError,
    isSuccess,
    queryParams,
    updateQueryParams,
  } = usePropertiesStats({});

  return (
    <div className="border-border flex w-full flex-col gap-2 rounded-xl border p-3 shadow-xs">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartArea className="h-4 min-h-4 w-4 min-w-4" />
          <h1 className="text-xs font-medium tracking-tight uppercase">ESTATÍSTICAS</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"fit"}
            className={cn("rounded-full p-1", {
              "bg-primary/80 text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground":
                showStats,
              "hover:bg-primary/20 bg-transparent": !showStats,
            })}
            onClick={() => setShowStats(!showStats)}
          >
            <Eye className="h-4 min-h-4 w-4 min-w-4" />
          </Button>
          <DateIntervalInput
            labelClassName="text-xs font-medium leading-none tracking-tight"
            className="h-fit border-none p-0 px-2 py-0.5 shadow-none"
            value={{
              after: queryParams.after ? new Date(queryParams.after) : undefined,
              before: queryParams.before ? new Date(queryParams.before) : undefined,
            }}
            handleChange={(v) =>
              updateQueryParams({
                after: v.after ? v.after.toISOString() : undefined,
                before: v.before ? v.before.toISOString() : undefined,
              })
            }
          />
        </div>
      </div>
      <AnimatePresence>
        {showStats ? (
          <motion.div
            variants={SlideMotionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row"
          >
            <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-medium tracking-tight uppercase">PROPRIEDADES</h1>
                <Landmark className="h-4 min-h-4 w-4 min-w-4" />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{stats?.totalPropriedades}</div>
              </div>
            </div>
            <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-medium tracking-tight uppercase">
                  VEÍCULOS COM REVISÃO PENDENTE
                </h1>
                <Car className="h-4 min-h-4 w-4 min-w-4 text-yellow-700" />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">
                  {stats?.veiculosRevisaoPendente}
                </div>
              </div>
            </div>
            <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-medium tracking-tight uppercase">
                  VEÍCULOS COM REVISÃO ATRASADA
                </h1>
                <Car className="h-4 min-h-4 w-4 min-w-4 text-red-700" />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">
                  {stats?.veiculosRevisaoAtrasada}
                </div>
              </div>
            </div>
            <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-medium tracking-tight uppercase">
                  USOS TEMPORÁRIOS EM ANDAMENTO
                </h1>
                <Calendar className="h-4 min-h-4 w-4 min-w-4 text-blue-700" />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">
                  {stats?.usosTemporariosAbertos}
                </div>
              </div>
            </div>
            <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-medium tracking-tight uppercase">
                  USOS TEMPORÁRIOS FINALIZADOS
                </h1>
                <Calendar className="h-4 min-h-4 w-4 min-w-4 text-green-700" />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">
                  {stats?.usosTemporariosFinalizados}
                </div>
              </div>
            </div>
            <div className="bg-background border-border flex w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/6">
              <div className="flex items-center justify-between">
                <h1 className="text-xs font-medium tracking-tight uppercase">
                  USOS TEMPORÁRIOS INICIADOS
                </h1>
                <Calendar className="h-4 min-h-4 w-4 min-w-4 text-blue-700" />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">
                  {stats?.usosTemporariosIniciados}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
