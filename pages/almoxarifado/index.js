import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
function GestaoAlmoxarifado({ credentials, setCredentials }) {
  const router = useRouter();
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (
        !storedCredentials.accessibleRoutes.includes("Obras") &&
        !storedCredentials.accessibleRoutes.includes("Almoxarifado")
      ) {
        router.push("/");
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (
          !credentials.accessibleRoutes.includes("Obras") &&
          !storedCredentials.accessibleRoutes.includes("Almoxarifado")
        ) {
          router.push("/");
        }
      }
    }
  }, []);
  return (
    <div className="flex flex-col grow p-6 w-full">
      <div className="flex flex-col mt-5">
        <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
          Áreas de controle
        </h1>
        <div className="flex gap-4 mt-5 flex-wrap w-full">
          <Link href="/almoxarifado/formularios">
            <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Formulários
              </h1>
            </div>
          </Link>
          <Link href="/almoxarifado/estoque">
            <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">ESTOQUE</h1>
            </div>
          </Link>
          <Link href="/obras/conferenciaMaterial">
            <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Conferência de Material
              </h1>
            </div>
          </Link>
          <Link href="/almoxarifado/separacao">
            <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
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

export default GestaoAlmoxarifado;
