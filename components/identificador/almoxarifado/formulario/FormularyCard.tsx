import { Button } from "@/components/ui/button";
import Avatar from "@/components/utils/Avatar";
import { cn } from "@/lib/utils";
import type { TGetWarehouseFormulariesOutputDefault } from "@/pages/api/almoxarifado/formularios/index-two";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import type { TNewWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import { FileTextIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BsCalendar2Check, BsCalendarPlus } from "react-icons/bs";
import { FaCity, FaUsers } from "react-icons/fa";
import { FaDiamond } from "react-icons/fa6";

type FormularyCardProps = {
  formulary: TGetWarehouseFormulariesOutputDefault["warehouseForms"][number];
  openModal: (id: string) => void;
};
function FormularyCard({ formulary, openModal }: FormularyCardProps) {
  return (
    <div className="border-primary/20 flex w-full flex-col rounded-md border p-3 lg:w-[450px]">
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => openModal(formulary._id)}
          className="cursor-pointer text-xs leading-none font-black tracking-tight hover:text-cyan-500 lg:text-sm"
        >
          {formulary.titulo || "NÃO DEFINIDO"}
        </button>
        <div
          className={cn("flex min-w-fit items-center gap-2 rounded-full px-2 py-1", {
            "bg-green-600": formulary.dataEfetivacao,
            "bg-blue-600": !formulary.dataEfetivacao,
          })}
        >
          <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">
            {formulary.dataEfetivacao ? "FINALIZADO" : "EM ABERTO"}
          </h1>
        </div>
      </div>

      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaDiamond />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {formulary.categoria}
          </p>
        </div>
        {formulary.dataEfetivacao ? (
          <div className="flex items-center gap-2">
            <BsCalendar2Check color="rgb(22,101,52)" />
            <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
              {formatDateAsLocale(formulary.dataEfetivacao, true)}
            </p>
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaCity />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {formulary.localizacao.cidade}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaUsers color={"rgb(30,64,175)"} />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {formulary.responsaveis}
          </p>
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <BsCalendarPlus />
          <p className="text-primary/60 text-xs font-medium">
            {formatDateAsLocale(formulary.dataInsercao, true)}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="fit"
            className="flex items-center gap-1 p-2 rounded-full"
            asChild
          >
            <Link href={`/almoxarifado/formularios/pdf/${formulary._id}`}>
              <FileTextIcon className="w-4 h-4 min-w-4 min-h-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-2">
            <Avatar
              url={formulary.autor.avatar_url}
              width={25}
              height={25}
              fallback={formatNameAsInitials(formulary.autor.nome)}
            />
            <p className="text-primary/60 text-xs font-medium">{formulary.autor.nome}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularyCard;
