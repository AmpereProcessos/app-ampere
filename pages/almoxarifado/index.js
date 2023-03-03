import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function GestaoAlmoxarifado() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  useEffect(() => {
    if (
      !session?.user.accessibleRoutes.includes("Obras") &&
      !session?.user.accessibleRoutes.includes("Almoxarifado")
    ) {
      router.push("/");
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="flex flex-col grow p-6 w-full">
        <div className="flex flex-col mt-5">
          <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
            Áreas de controle
          </h1>
          <div className="flex gap-4 mt-5 flex-wrap w-full">
            <Link href="/almoxarifado/formularios">
              <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
                <h1 className="text-center uppercase font-raleway">
                  Formulários
                </h1>
              </div>
            </Link>
            <Link href="/almoxarifado/estoque">
              <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
                <h1 className="text-center uppercase font-raleway">ESTOQUE</h1>
              </div>
            </Link>
            <Link href="/obras/conferenciaMaterial">
              <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
                <h1 className="text-center uppercase font-raleway">
                  Conferência de Material
                </h1>
              </div>
            </Link>
            <Link href="/almoxarifado/separacao">
              <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
                <h1 className="text-center uppercase font-raleway">
                  PROJETOS P/SEPARAÇÃO
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default GestaoAlmoxarifado;
