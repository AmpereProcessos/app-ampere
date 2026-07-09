import React, { useState } from "react";

import Logo from "@/utils/svgs/logo-texto-branco-vertical.svg";
import Image from "next/image";
import { AiFillInstagram, AiFillPhone } from "react-icons/ai";
import { TbWorld } from "react-icons/tb";
import { MdSecurity } from "react-icons/md";
import { FaSolarPanel } from "react-icons/fa";
import { BsSpeedometer2 } from "react-icons/bs";
import UFVSystemCalculationMainComponent from "@/components/identificador/simulacaoTotem/UFVSystemCalculator/MainComponent";
import OeMCalculationMainComponent from "@/components/identificador/simulacaoTotem/OeMCalculator/MainComponent";
import UFVInsuranceCalculationMainComponent from "@/components/identificador/simulacaoTotem/UFVInsuranceCalculator/MainComponent";
type TSimulationTypes = "ufv-system-calculator" | "ufv-insurance-calculator" | "ufv-oem-calculator";

function EventTotemSimulationPage() {
  const [type, setType] = useState<TSimulationTypes | null>(null);
  if (type == "ufv-system-calculator")
    return <UFVSystemCalculationMainComponent resetSimulation={() => setType(null)} />;
  if (type == "ufv-oem-calculator")
    return <OeMCalculationMainComponent resetSimulation={() => setType(null)} />;
  if (type == "ufv-insurance-calculator")
    return <UFVInsuranceCalculationMainComponent resetSimulation={() => setType(null)} />;
  return (
    <div
      className={`bg-background font-raleway flex h-full grow flex-col items-center overflow-clip`}
    >
      <div className="flex h-[120px] w-full items-center justify-center bg-[#15599a]">
        <div className="flex h-[90px] cursor-pointer items-center justify-center">
          <Image
            height={90}
            width={90}
            src={Logo}
            objectFit="fill"
            quality={100}
            alt="Logo da Ampère Energias"
          />
        </div>
      </div>
      <div className="flex w-[80%] grow flex-col justify-center p-6">
        <h1 className="my-2 w-full text-center text-xl font-black tracking-tight lg:text-3xl">
          {" "}
          SEJA BEM VINDO AO TOTEM DE SIMULAÇÃO DA AMPÈRE ENERGIAS !
        </h1>
        <p className="text-foreground mb-3 w-full text-center text-base tracking-tight lg:text-xl">
          Dentre as opções abaixo, selecione a modalidade que gostaria de simular.
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <button
            onClick={() => setType("ufv-system-calculator")}
            className="group flex w-full flex-col items-center gap-2 rounded border-2 border-[#15599a] px-6 py-6 duration-300 ease-out hover:bg-[#15599a] lg:w-[80%]"
          >
            <h1 className="text-lg font-bold text-[#15599a] duration-300 ease-in-out group-hover:text-white dark:text-[#fead41]">
              CALCULADORA DE ENERGIA SOLAR
            </h1>
            <h1 className="text-[#15599a] group-hover:text-white dark:text-[#fead41]">
              <FaSolarPanel size={50} />
            </h1>
            <p className="text-foreground w-full tracking-tight duration-300 ease-in-out group-hover:text-gray-50">
              Descubra o valor estimado para seu novo sistema fotovoltaico. Clique aqui e começa já
              a economizar.
            </p>
          </button>
          <button
            onClick={() => setType("ufv-insurance-calculator")}
            className="group flex w-full flex-col items-center gap-2 rounded border-2 border-[#15599a] px-6 py-6 duration-300 ease-out hover:bg-[#15599a] lg:w-[80%]"
          >
            <h1 className="text-lg font-bold text-[#15599a] duration-300 ease-in-out group-hover:text-white dark:text-[#fead41]">
              CALCULADORA DE SEGURO SOLAR
            </h1>
            <h1 className="text-[#15599a] group-hover:text-white dark:text-[#fead41]">
              <MdSecurity size={50} />
            </h1>
            <p className="text-foreground w-full tracking-tight duration-300 ease-in-out group-hover:text-gray-50">
              Descubra o valor estimado pra segurar o seu sistema fotovoltaico.
            </p>
          </button>
          <button
            onClick={() => setType("ufv-oem-calculator")}
            className="group flex w-full flex-col items-center gap-2 rounded border-2 border-[#15599a] px-6 py-6 duration-300 ease-out hover:bg-[#15599a] lg:w-[80%]"
          >
            <h1 className="text-lg font-bold text-[#15599a] duration-300 ease-in-out group-hover:text-white dark:text-[#fead41]">
              CALCULADORA DE MANUTENÇÃO E LIMPEZA
            </h1>
            <h1 className="text-[#15599a] group-hover:text-white dark:text-[#fead41]">
              <BsSpeedometer2 size={50} />
            </h1>
            <p className="text-foreground w-full tracking-tight duration-300 ease-in-out group-hover:text-gray-50">
              Descubra o valor para obter nossos planos de operação e manutenção. Clique aqui e
              garanta a máxima eficiência do seu investimento.
            </p>
          </button>
        </div>
      </div>

      <div className="flex h-[200px] w-full flex-col items-center justify-center gap-2 bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] px-10">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-center font-black text-white">
            A energia que move o mundo{"  "}
            <strong className="text-[rgba(254,173,65,1)]"> vem de você</strong>!
          </h1>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex items-center gap-1 text-white">
            <AiFillInstagram size="35px" />
            <p>@ampereenergias</p>
          </div>
          <div className="flex items-center gap-1 text-white">
            <AiFillPhone size="35px" />
            <p>(34) 3700-7001</p>
          </div>
          <div className="flex items-center gap-1 text-white">
            <TbWorld size="35px" />
            <p>ampereenergias.com.br</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTotemSimulationPage;
