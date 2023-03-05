import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function GestaoDeObras() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [stats, setStats] = useState({});
  function getStats() {
    axios
      .get("/api/gestaoDeObras/estatisticas")
      .then((res) => setStats(res.data));
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("Obras")) {
      getStats();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="flex flex-col grow p-6 w-full">
        <div className="flex flex-col">
          <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
            PENDÊNCIAS
          </h1>
          <div className="grid grid-rows-6 grid-cols-1  lg:grid-cols-6 lg:grid-rows-1 gap-3">
            <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">PADRÕES</h1>
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {stats.padroes && stats.padroes.total}
              </p>
              <p className="text-center text-gray-600">
                PAGOS:{" "}
                <strong className="text-red-500">
                  {stats.padroes && stats.padroes.parcial}
                </strong>
              </p>
            </div>
            <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">ESTRUTURAS</h1>
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {stats.estruturas && stats.estruturas.total}
              </p>
              <p className="text-center text-gray-600">
                PAGOS:{" "}
                <strong className="text-red-500">
                  {stats.estruturas && stats.estruturas.parcial}
                </strong>
              </p>
            </div>
            <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">OBRAS</h1>
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {stats.obras && stats.obras.total}
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-center text-gray-600">
                  ENTREGUES:{" "}
                  <strong className="text-red-500">
                    {stats.obras && stats.obras.parcial}
                  </strong>
                </p>
                <p className="text-center text-gray-600">
                  PARA SEPARAR:
                  <strong className="text-red-500">
                    {stats.obras && stats.obras.separacaoPendente}
                  </strong>
                </p>
              </div>
            </div>
            <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">COMPRAS A FAZER</h1>
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {stats.compras && stats.compras.total}
              </p>
              <p className="text-center text-gray-600">
                ENTREGUES:{" "}
                <strong className="text-red-500">
                  {stats.compras && stats.compras.parcial}
                </strong>
              </p>
            </div>
            <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">
                  PROJETOS COM OS aberta
                </h1>
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {stats.oss && stats.oss.total}
              </p>
            </div>
            <div className="flex flex-col p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <div className="flex justify-between">
                <h1 className="uppercase text-gray-600">
                  OBSERVAÇÕES A PREENCHER
                </h1>
              </div>
              <p className="grow text-center text-2xl font-bold text-[#fead61] flex items-center justify-center">
                {stats.obras && stats.obras.obsPendente}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
            Áreas de controle
          </h1>
          <div className="flex gap-4 mt-5 flex-wrap w-full">
            <Link href="/obras/controlePadroes">
              <div className="flex flex-col justify-center cursor-pointer grow w-full lg:min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
                <h1 className="text-center uppercase font-raleway">
                  Controle de Padrões
                </h1>
              </div>
            </Link>
            <Link href="/obras/controleEstruturas">
              <div className="flex flex-col justify-center cursor-pointer grow w-full lg:min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
                <h1 className="text-center uppercase font-raleway">
                  Controle de Estruturas
                </h1>
              </div>
            </Link>
            <Link href="/obras/conferenciaMaterial">
              <div className="flex flex-col justify-center cursor-pointer grow w-full lg:min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
                <h1 className="text-center uppercase font-raleway">
                  Conferência de Material
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default GestaoDeObras;
