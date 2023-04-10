import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Logo from "../../utils/whitelogoHD.png";
import LoadingPage from "../../components/utils/LoadingPage";
import Image from "next/image";
import Link from "next/link";

function RelatorioEstoque() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [materials, setMaterials] = useState();
  function getMateriais() {
    axios.get("/api/almoxarifado/materiais").then((res) => {
      setMaterials(res.data);
    });
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("Almoxarifado")) {
      if (!materials) {
        getMateriais();
      }
    } else {
      if (session?.user) router.push("/");
    }
  }, []);
  console.log(materials);
  if (status == "loading") return <LoadingPage />;
  return (
    <div className="w-[21cm] h-[29.7cm] p-4 px-4 flex flex-col">
      <div className="grid items-center grid-cols-3 w-full my-2 px-2">
        <div></div>
        <h1 className="text-center font-bold text-xl">RELATÓRIO DE ESTOQUE</h1>
        <Link href={"/almoxarifado/estoque"}>
          <div className="flex items-center justify-end cursor-pointer">
            <Image height={60} width={60} src={Logo} />
          </div>
        </Link>
      </div>
      <div className="w-full grow flex flex-col">
        <div className="grid grid-cols-6 gap-x-2 border-b bg-gray-800 w-full">
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">
            INDEX
          </p>
          <p className="text-sm col-span-4 font-medium text-white px-6 py-4 text-center">
            NOME
          </p>
          <p className="text-sm col-span-1 font-medium text-white px-6 py-4 text-center">
            QTDE
          </p>
        </div>
        {materials && materials?.length
          ? materials.map((material, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-x-2 border-b border-x border-gray-700"
              >
                <p className="col-span-1 py-4 text-center whitespace-nowrap text-xs font-medium text-gray-900">
                  {index + 1}
                </p>
                <p className="text-sm col-span-4 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                  {material.nome}
                </p>
                <p className="text-sm col-span-1 text-gray-900 font-medium px-6 py-4 text-center whitespace-nowrap">
                  {material.qtde}
                </p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default RelatorioEstoque;
