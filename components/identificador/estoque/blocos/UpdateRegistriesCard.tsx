import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { isValidNumber } from "@/utils/methods/validating";
import type { TMaterialUpdateRegistryDTO } from "@/utils/schemas/material-updates-registry";
import { ArrowRight, Box, DollarSign, FileStack, ShoppingCart } from "lucide-react";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsCalendarPlus, BsCartPlusFill } from "react-icons/bs";
import { FaLongArrowAltRight } from "react-icons/fa";
import { ImArrowDown, ImArrowUp } from "react-icons/im";

type UpdateRegistriesCardProps = {
  registry: TMaterialUpdateRegistryDTO;
  showMaterialName?: boolean;
};
function UpdateRegistriesCard({ registry, showMaterialName = false }: UpdateRegistriesCardProps) {
  console.log("REGISTRY AUTHOR", registry.autor);
  return (
    <div className="w-full flex flex-col gap-2 rounded-md border border-border p-3">
      <div className="flex w-full items-center justify-between gap-2 flex-col lg:flex-row">
        <div className="flex items-center gap-2 flex-col lg:flex-row">
          <div className="flex items-center gap-1">
            {registry.tipo === "ENTRADA" ? (
              <ShoppingCart className="h-4 min-h-4 w-4 min-w-4" />
            ) : null}
            {registry.tipo === "RETIRADA" ? (
              <ImArrowUp className="h-4 min-h-4 w-4 min-w-4" />
            ) : null}
            {registry.tipo === "DEVOLUÇÃO" ? (
              <ImArrowDown className="h-4 min-h-4 w-4 min-w-4" />
            ) : null}
            {registry.tipo === "ALTERAÇÃO MANUAL" ? (
              <AiFillEdit className="h-4 min-h-4 w-4 min-w-4" />
            ) : null}
            <h1 className="text-xs leading-none font-black tracking-tight lg:text-sm">
              {registry.tipo}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <BsCalendarPlus className="h-4 min-h-4 w-4 min-w-4" />
              <p className="text-foreground text-xs font-medium">
                {formatDateAsLocale(registry.dataInsercao, true)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Avatar className="h-5 min-h-5 w-5 min-w-5">
                <AvatarImage src={registry.autor?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {formatNameAsInitials(registry.autor?.nome ?? "NA")}
                </AvatarFallback>
              </Avatar>
              <p className="text-foreground text-xs font-medium">{registry.autor?.nome}</p>
            </div>
          </div>
        </div>
        {registry.formulario ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="fit" variant="ghost" className="flex items-center gap-1">
                <FileStack className="h-4 min-h-4 w-4 min-w-4" />
                <h1 className="text-[0.65rem] leading-none tracking-tight">
                  {registry.formulario.titulo}
                </h1>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>FORMULÁRIO DE ALMOXARIFADO</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
        {registry.compra ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="fit" variant="ghost" className="flex items-center gap-1">
                <ShoppingCart className="h-4 min-h-4 w-4 min-w-4" />
                <h1 className="text-[0.65rem] leading-none tracking-tight">
                  {registry.compra.titulo}
                </h1>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>COMPRA DE ALMOXARIFADO</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      {showMaterialName ? (
        <h1 className="my-2 w-full text-center text-[0.65rem] font-medium tracking-tight text-blue-500">
          {registry.material.nome}
        </h1>
      ) : null}
      <div className="w-full flex items-center flex-wrap gap-3">
        {isValidNumber(registry.qtdeAnterior) && isValidNumber(registry.qtdeNovo) ? (
          <div
            className={cn("flex items-center gap-1 px-2 py-1 rounded-lg", {
              "bg-green-200 text-green-700":
                (registry.qtdeAnterior as number) < (registry.qtdeNovo as number),
              "bg-red-200 text-red-700":
                (registry.qtdeAnterior as number) > (registry.qtdeNovo as number),
            })}
          >
            <Box className="h-4 min-h-4 w-4 min-w-4" />
            <h1 className="text-[0.65rem] tracking-tight font-medium">
              ALTERAÇÃO DE QUANTIDADE DE:{" "}
              <strong>{formatDecimalPlaces(registry.qtdeAnterior as number)}</strong> PARA:{" "}
              <strong>{formatDecimalPlaces(registry.qtdeNovo as number)}</strong>
            </h1>
          </div>
        ) : registry.alteracao ? (
          <div
            className={cn("flex items-center gap-1 px-2 py-1 rounded-lg", {
              "bg-green-200 text-green-700": registry.alteracao > 0,
              "bg-red-200 text-red-700": registry.alteracao < 0,
            })}
          >
            <Box className="h-4 min-h-4 w-4 min-w-4" />
            <h1 className="text-[0.65rem] font-medium">
              ALTERAÇÃO DE QUANTIDADE DE:{formatDecimalPlaces(registry.alteracao)}
            </h1>
          </div>
        ) : null}
        {isValidNumber(registry.precoAnterior) &&
        isValidNumber(registry.precoNovo) &&
        registry.precoAnterior !== registry.precoNovo ? (
          <div
            className={cn("flex items-center gap-1 px-2 py-1 rounded-lg", {
              "bg-green-200 text-green-700":
                (registry.precoAnterior as number) < (registry.precoNovo as number),
              "bg-red-200 text-red-700":
                (registry.precoAnterior as number) < (registry.precoNovo as number),
            })}
          >
            <DollarSign className="h-4 min-h-4 w-4 min-w-4" />
            <h1 className="text-[0.65rem] tracking-tight font-medium">
              ALTERAÇÃO DE PREÇO DE: {formatToMoney(registry.precoAnterior as number)} PARA:{" "}
              {formatToMoney(registry.precoNovo as number)}
            </h1>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UpdateRegistriesCard;
