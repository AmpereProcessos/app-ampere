import ErrorComponent from "@/components/utils/ErrorComponent";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import EstruturaOS from "../../../components/EstruturaOS";
import OSCorretiva from "../../../components/OSCorretivaPDF";
import ServiceOrderPDF from "../../../components/OSMontagemPDF";
import PadraoOS from "../../../components/PadraoOS";
import PreventivaOS from "../../../components/PreventivaOS";
import LoadingPage from "../../../components/utils/LoadingPage";
import Logo from "../../../utils/images/logo-texto-azul-vertical.png";
import { useServiceOrderById } from "../../../utils/methods/query/service-orders";
function OSInfo() {
  const router = useRouter();

  const id = router?.query?.id as string;
  console.log("[INFO] ID: ", id);
  if (!id) return <ErrorComponent msg="ID não encontrado" />;

  return <OSInfoContent id={id} />;
}

export default OSInfo;

function OSInfoContent({ id }: { id: string }) {
  const { data, isLoading, isSuccess, isError } = useServiceOrderById({ id });

  console.log("[INFO] DATA: ", data);
  if (isLoading) return <LoadingPage />;
  if (isError)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-foreground w-full text-center italic">Oops, um erro ocorreu.</h1>
        <Link href="/">
          <p className="text-foreground cursor-pointer font-bold hover:text-cyan-500">
            Voltar à página principal
          </p>
        </Link>
      </div>
    );
  if (isSuccess && data)
    return (
      <>
        {data.categoria === "PADRÃO" && <PadraoOS order={data} />}
        {data.categoria === "MONTAGEM" && <ServiceOrderPDF order={data} />}
        {data.categoria === "MANUTENÇÃO PREVENTIVA" && <PreventivaOS order={data} />}
        {(data.categoria === "MANUTENÇÃO CORRETIVA" ||
          data.categoria === "OUTROS" ||
          data.categoria === "ESTRUTURA") && <OSCorretiva order={data} />}
      </>
    );
}
