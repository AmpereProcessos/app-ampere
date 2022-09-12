import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { AiFillHome } from "react-icons/ai";
import { GiSolarPower } from "react-icons/gi";
import { HiFolder } from "react-icons/hi";
import { BsTools } from "react-icons/bs";
import { useRouter } from "next/router";
import { validateAuth } from "../../utils/functions";

const acessKey = "O&M";
function Oem({ credentials }) {
  {
    /*  const router = useRouter();
  useEffect(() => {
    if (!validateAuth(acessKey, credentials)) {
      router.push("/");
    }
  }, []); */
  }
  return (
    <div className="flex flex-col grow p-6 w-full">
      <h1 className="uppercase font-raleway text-3xl self-center text-[#15599b] mb-6 font-raleway font-bold">
        Serviços
      </h1>
      <div
        className={
          "grid h-full lg:grid-cols-3 lg:grid-rows-1 grid-rows-3 gap-x-2"
        }
      >
        <div className="cursor-pointer h-full">
          <Link href="/oem/proposes">
            <div className="flex items-center justify-center h-full bg-blue-500 hover:bg-blue-700 px-2 py-4">
              <HiFolder style={{ fontSize: "50px", color: "white" }} />
              <p className="text-white font-raleway font-semibold cursor-pointer">
                Controle de propostas O&M
              </p>
            </div>
          </Link>
        </div>

        <div className="cursor-pointer h-full">
          <Link href="/oem/serviceOrder">
            <div className="flex items-center justify-center bg-amber-400 hover:bg-amber-500 h-full px-2 py-4">
              <BsTools style={{ fontSize: "50px", color: "white" }} />
              <p className="text-white font-raleway font-semibold cursor-pointer">
                Controle OSs
              </p>
            </div>
          </Link>
        </div>
        <div className="cursor-pointer h-full">
          <Link href="/oem/projects">
            <div className="flex items-center justify-center bg-green-400 hover:bg-green-500 h-full px-2 py-4">
              <GiSolarPower style={{ fontSize: "50px", color: "white" }} />
              <p className="text-white font-raleway font-semibold cursor-pointer">
                Controle de Projetos
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Oem;
