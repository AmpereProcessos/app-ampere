import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import Link from "next/link";
import React from "react";
import { useSession } from "../../components/providers/SessionProvider";
import LoadingPage from "../../components/utils/LoadingPage";

import { Button } from "@/components/ui/button";
import CustomerSupportSVG from "@/utils/svgs/after-sales-customer-support.svg";
import TechnicalSupportSVG from "@/utils/svgs/after-sales-technical-support.svg";
import CommercialSupportSVG from "@/utils/svgs/comercial-support.svg";
import EngineeringSupportSVG from "@/utils/svgs/engineering-support.svg";
import Image from "next/image";
function Calls() {
  const { session, status } = useSession();
  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  return <CallsContent session={session} />;
}

export default Calls;

function CallsContent({ session }: { session: TAuthSession }) {
  return (
    <div className="flex w-full grow flex-col gap-6 p-6">
      <div className="border-border flex items-center gap-2 border-b pb-2">
        <p className="text-start text-2xl font-black text-[#15599a] uppercase">BANCO DE CHAMADOS</p>
      </div>
      <div className="flex w-full flex-wrap items-center justify-around gap-2">
        <Link href="/chamados/chamadosSuporte" className="h-fit w-full md:h-[280px] md:w-[600px]">
          <Button
            variant={"outline"}
            size={"fit"}
            className="bg-card border-border flex h-full w-full flex-col gap-2 rounded-lg border p-6"
          >
            <div className="relative mx-auto h-32 w-32">
              <Image src={TechnicalSupportSVG} alt="Suporte Técnico" fill />
            </div>
            <h1 className="text-center text-lg font-black text-wrap text-[#15599a] uppercase md:text-2xl dark:text-[#fead41]">
              Chamados de Suporte Técnico
            </h1>
            <p className="text-muted-foreground text-center text-sm tracking-tight text-wrap">
              Usinas fotovoltaicas não operacionais, inversores desconfigurados, garantias, falhas
              técnicas e outros problemas de funcionamento.
            </p>
          </Button>
        </Link>

        <Link href="/chamados/chamadosPosVenda" className="h-fit w-full md:h-[280px] md:w-[600px]">
          <Button
            variant={"outline"}
            size={"fit"}
            className="bg-card border-border flex h-full w-full flex-col gap-2 rounded-lg border p-6"
          >
            <div className="relative mx-auto h-32 w-32">
              <Image src={CustomerSupportSVG} alt="Suporte Pós-Venda" fill />
            </div>
            <h1 className="text-center text-lg font-black text-wrap text-[#15599a] uppercase md:text-2xl dark:text-[#fead41]">
              Chamados de Pós-Venda
            </h1>
            <p className="text-muted-foreground text-center text-sm tracking-tight text-wrap">
              Solicitações de rearranjo de distribuição de energia e suporte ao cliente após a
              venda.
            </p>
          </Button>
        </Link>

        <Link href="/chamados/chamadosPPS" className="h-fit w-full md:h-[280px] md:w-[600px]">
          <Button
            variant={"outline"}
            size={"fit"}
            className="bg-card border-border flex h-full w-full flex-col gap-2 rounded-lg border p-6"
          >
            <div className="relative mx-auto h-32 w-32">
              <Image src={CommercialSupportSVG} alt="Suporte Comercial" fill />
            </div>
            <h1 className="text-center text-lg font-black text-wrap text-[#15599a] uppercase md:text-2xl dark:text-[#fead41]">
              Chamados Comerciais
            </h1>
            <p className="text-muted-foreground text-center text-sm tracking-tight text-wrap">
              Propostas personalizadas, descontos, negociações comerciais e condições especiais.
            </p>
          </Button>
        </Link>

        <Link href="/chamados/chamadosProjetos" className="h-fit w-full md:h-[280px] md:w-[600px]">
          <Button
            variant={"outline"}
            size={"fit"}
            className="bg-card border-border flex h-full w-full flex-col gap-2 rounded-lg border p-6"
          >
            <div className="relative mx-auto h-32 w-32">
              <Image src={EngineeringSupportSVG} alt="Suporte de Engenharia" fill />
            </div>
            <h1 className="text-center text-lg font-black text-wrap text-[#15599a] uppercase md:text-2xl dark:text-[#fead41]">
              Chamados de Engenharia
            </h1>
            <p className="text-muted-foreground text-center text-sm tracking-tight text-wrap">
              Transferência de titularidade de instalação, rearranjo de créditos, diagramas
              elétricos e outras demandas de engenharia.
            </p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
