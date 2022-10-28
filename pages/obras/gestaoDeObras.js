import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
function GestaoDeObras({ credentials, setCredentials }) {
  const router = useRouter();
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Obras")) {
        router.push("/");
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Obras")) {
          router.push("/");
        }
      }
    }
  }, []);
  return (
    <div className="flex flex-col bg-gray-100 grow p-6 w-full">
      <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
        Áreas de controle
      </h1>
      <div className="flex gap-4 mt-5 flex-wrap w-full">
        <Link href="/obras/controlePadroes">
          <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <h1 className="text-center uppercase font-raleway">
              Controle de Padrões
            </h1>
          </div>
        </Link>
        <Link href="/obras/controleEstruturas">
          <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <h1 className="text-center uppercase font-raleway">
              Controle de Estruturas
            </h1>
          </div>
        </Link>
        <Link href="/obras/conferenciaMaterial">
          <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <h1 className="text-center uppercase font-raleway">
              Conferência de Material
            </h1>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default GestaoDeObras;
