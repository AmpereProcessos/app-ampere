import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
function GestaoDeObras({ credentials, setCredentials }) {
  const [stats, setStats] = useState({});
  function getStats() {
    axios
      .get("/api/gestaoDeObras/estatisticas")
      .then((res) => setStats(res.data));
  }
  const router = useRouter();
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Obras")) {
        router.push("/");
      } else {
        getStats();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Obras")) {
          router.push("/");
        } else {
          getStats();
        }
      }
    }
  }, []);
  console.log(stats);
  return (
    <div className="flex flex-col grow p-6 w-full">
      <div className="flex flex-col">
        <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
          PENDÊNCIAS
        </h1>
        <div className="grid grid-cols-5 gap-x-3">
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
            <p className="text-center text-gray-600">
              ENTREGUES:{" "}
              <strong className="text-red-500">
                {stats.obras && stats.obras.parcial}
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
    </div>
  );
}

export default GestaoDeObras;
