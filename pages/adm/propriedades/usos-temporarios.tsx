import ViewPropertyUsage from "@/components/identificador/propriedades/ViewPropertyUsage";
import DateInput from "@/components/inputs/Date";
import MultipleSelectWithImages from "@/components/inputs/MultipleSelectWithImages";
import SelectInput from "@/components/inputs/Select";
import { useSession } from "@/components/providers/SessionProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { PROPERTY_METADATA_TYPES_CONFIG } from "@/lib/properties";
import { cn } from "@/lib/utils";
import type { TGetPropertyTemporaryUsagesDefaultOutput } from "@/pages/api/propriedades/uso-temporario";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import {
  usePropertyTemporaryUsages,
  useSimplifiedProperties,
} from "@/utils/methods/query/properties";
import { renderIconWithClassNames } from "@/utils/methods/rendering";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Code, Eye, Link as LinkIcon, Plus, Timer } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { BsCalendarCheck, BsCalendarPlus } from "react-icons/bs";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";

function TemporaryUsages() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  return <TemporaryUsagesContent session={session} />;
}

export default TemporaryUsages;

type TemporaryUsagesContentProps = {
  session: TAuthSession;
};
function TemporaryUsagesContent({ session: _session }: TemporaryUsagesContentProps) {
  const { data, isLoading, isError, isSuccess, queryParams, updateQueryParams } =
    usePropertyTemporaryUsages({});
  const { data: simplifiedProperties } = useSimplifiedProperties({});
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false);
  const [viewPropertyUsageId, setViewPropertyUsageId] = useQueryState(
    "propertyUsageId",
    parseAsString,
  );
  return (
    <div className="flex h-full w-full grow flex-col gap-6 p-6">
      <div className="border-border flex w-full flex-col gap-3 border-b pb-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              USOS TEMPORÁRIOS DE PROPRIEDADES
            </p>
            <p className="text-foreground text-sm tracking-tight">
              {data?.length || "..."} registros encontrados
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

        <motion.div
          initial={{ scale: 0.95, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 flex w-full flex-col gap-y-2"
        >
          <Input
            placeholder="PESQUISAR POR PROPRIEDADE/RESPONSÁVEL..."
            value={queryParams.search || ""}
            onChange={(e) => updateQueryParams({ search: e.target.value })}
            className="grow rounded-xl p-2 text-xs"
          />
          <div className="flex flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
            <div className="w-full lg:w-[300px]">
              <MultipleSelectWithImages
                label="PROPRIEDADES"
                labelClassName="text-[0.6rem]"
                holderClassName="text-xs p-2 min-h-[34px]"
                selected={queryParams.propertyIds}
                options={
                  simplifiedProperties?.map((property) => ({
                    id: property._id,
                    label: `${property.nome} (${property.identificador})`,
                    value: property._id,
                    url: property.imagemUrl ?? undefined,
                  })) || []
                }
                handleChange={(value) => updateQueryParams({ propertyIds: value as string[] })}
                onReset={() => updateQueryParams({ propertyIds: [] })}
                resetOptionLabel="TODAS AS PROPRIEDADES"
                width="100%"
              />
            </div>

            <div className="w-full lg:w-[300px]">
              <SelectInput
                options={[
                  { id: 1, value: "dataInicio", label: "DATA DE INÍCIO" },
                  { id: 2, value: "dataFim", label: "DATA DE FIM" },
                ]}
                labelClassName="text-[0.6rem]"
                holderClassName="text-xs p-2 min-h-[34px]"
                label={"TIPO DE USO"}
                value={queryParams.periodType}
                selectedItemLabel={"NÃO DEFINIDO"}
                handleChange={(value) =>
                  updateQueryParams({ periodType: value as "dataInicio" | "dataFim" })
                }
                onReset={() => updateQueryParams({ periodType: "dataInicio" })}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-[300px]">
              <DateInput
                label="DATA INICIAL"
                labelClassName="text-[0.6rem]"
                holderClassName="text-xs p-2 min-h-[34px]"
                value={queryParams.periodAfter?.slice(0, 10)}
                handleChange={(value) =>
                  updateQueryParams({
                    periodAfter: value ? new Date(value).toISOString() : undefined,
                  })
                }
                width="100%"
              />
            </div>
            <div className="w-full lg:w-[300px]">
              <DateInput
                label="DATA FINAL"
                labelClassName="text-[0.6rem]"
                holderClassName="text-xs p-2 min-h-[34px]"
                value={queryParams.periodBefore?.slice(0, 10)}
                handleChange={(value) =>
                  updateQueryParams({
                    periodBefore: value ? new Date(value).toISOString() : undefined,
                  })
                }
                width="100%"
              />
            </div>
            <div className="w-full lg:w-[300px]">
              <SelectInput
                label="STATUS"
                labelClassName="text-[0.6rem]"
                holderClassName="text-xs p-2 min-h-[34px]"
                value={queryParams.type}
                options={[
                  { id: 1, value: "all", label: "TODOS" },
                  { id: 2, value: "open", label: "EM ABERTO" },
                  { id: 3, value: "closed", label: "FINALIZADOS" },
                ]}
                selectedItemLabel={"NÃO DEFINIDO"}
                handleChange={(value) =>
                  updateQueryParams({ type: value as "all" | "open" | "closed" })
                }
                onReset={() => updateQueryParams({ type: "all" })}
                width="100%"
              />
            </div>
          </div>
        </motion.div>
        <div className="flex w-full items-center justify-end">
          <Button variant={"link"} asChild>
            <Link href={"/adm/propriedades"}>PROPRIEDADES</Link>
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar usos temporários..." /> : null}
        {isSuccess ? (
          data.length > 0 ? (
            data.map((usage) => (
              <TemporaryUsageCard
                key={usage._id as any}
                usage={usage as any}
                handleClick={(id) => setViewPropertyUsageId(id)}
              />
            ))
          ) : (
            <p className="text-foreground w-full text-center font-medium italic">
              Nenhum uso temporário encontrado.
            </p>
          )
        ) : null}
      </div>
      {viewPropertyUsageId ? (
        <ViewPropertyUsage
          usageId={viewPropertyUsageId}
          closeModal={() => setViewPropertyUsageId(null)}
        />
      ) : null}
    </div>
  );
}

function TemporaryUsageCard({
  usage,
  handleClick,
}: {
  usage: TGetPropertyTemporaryUsagesDefaultOutput[number];
  handleClick: (id: string) => void;
}) {
  const isOpen = !usage.dataFim;
  const statusBadge = isOpen ? (
    <Badge className="bg-yellow-200 font-bold text-yellow-800">
      <Timer className="h-3 w-3" /> EM ABERTO
    </Badge>
  ) : (
    <Badge className="bg-green-200 font-bold text-green-800">
      <CheckCircle2 className="h-3 w-3" /> FINALIZADO
    </Badge>
  );

  const vehicleInfo =
    usage.metadados.tipo === "USO DE VEÍCULO" ? (
      <div className="flex items-center gap-1">
        <Badge
          className={cn(
            PROPERTY_METADATA_TYPES_CONFIG.VEÍCULO.stylingClassName,
            "rounded-full text-[0.65rem]",
          )}
        >
          {renderIconWithClassNames(
            PROPERTY_METADATA_TYPES_CONFIG.VEÍCULO.icon,
            "h-4 w-4 min-w-4 min-h-4",
          )}
          {PROPERTY_METADATA_TYPES_CONFIG.VEÍCULO.name}
        </Badge>
        <div className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <p className="text-xs font-medium tracking-tight">
            KM INICIAL: {usage.metadados.kmInicial}
          </p>
          {usage.metadados.kmFinal ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <p className="text-xs font-medium tracking-tight">
                KM FINAL: {usage.metadados.kmFinal}
              </p>
            </>
          ) : null}
        </div>
      </div>
    ) : null;

  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm leading-none font-bold tracking-tight">{usage.propriedade.nome}</p>
          <div className={cn("flex items-center gap-1")}>
            <Code className="h-4 w-4" />
            <p className="text-xs font-medium tracking-tight">{usage.propriedade.identificador}</p>
          </div>
          {vehicleInfo}
          {usage.arquivos.length > 0 ? (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              <p className="text-xs font-medium tracking-tight">{usage.arquivos.length} ARQUIVOS</p>
            </div>
          ) : null}
        </div>
        {statusBadge}
      </div>
      <div className="flex w-full flex-col items-center justify-between sm:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <BsCalendarPlus className="h-4 w-4" />
            <p className="text-xs font-medium tracking-tight">
              INÍCIO: {formatDateAsLocale(usage.dataInicio || usage.dataInsercao) || "N/A"}
            </p>
          </div>
          {usage.dataFim ? (
            <div className="flex items-center gap-2">
              <BsCalendarCheck className="h-4 w-4 text-green-600" />
              <p className="text-xs font-medium tracking-tight">
                FIM: {formatDateAsLocale(usage.dataFim) || "N/A"}
              </p>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            {usage.responsaveis.map((resp) => (
              <div key={resp.id} className="flex items-center gap-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={resp.avatar_url ?? undefined} />
                  <AvatarFallback>{formatNameAsInitials(resp.nome)}</AvatarFallback>
                </Avatar>
                <p className="text-foreground text-xs font-medium">{resp.nome}</p>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant={"ghost"}
          className="flex items-center gap-1 px-2 py-1"
          size={"fit"}
          onClick={() => handleClick(usage._id)}
        >
          <Eye size={16} />
          <p className="text-foreground text-sm font-semibold">VISUALIZAR</p>
        </Button>
      </div>
    </div>
  );
}
