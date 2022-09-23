import React from "react";
import { ImSad2 } from "react-icons/im";
import Link from "next/link";
function AccessDenied() {
  return (
    <div className="p-6 bg-[#15599a] flex justify-center items-center">
      <div className="flex flex-col items-center">
        <ImSad2 style={{ color: "white", fontSize: "30px" }} />
        <p className="text-white text-2xl text-center">Acesso não permitido</p>
        <Link href="/">
          <p className="text-cyan-400 underline cursor-pointer">
            Clique aqui para voltar ao Home
          </p>
        </Link>
      </div>
    </div>
  );
}

export default AccessDenied;
