import {
  getInsuranceInvestmentByReferenceValue,
  getOeMInvestimentByModuleQty,
  getUFVSystemInvestmentByEnergyBill,
} from "@/utils/totem-simulation/helpers";
import Image from "next/image";
import React from "react";
import AmpereWhiteLogo from "@/utils/svgs/logo-texto-branco-vertical.svg";
import { MdEmail, MdOutlineRestartAlt, MdReportProblem } from "react-icons/md";
import { formatToMoney } from "@/utils/constants";
import { FaLocationDot, FaSolarPanel } from "react-icons/fa6";
import { TbAlertTriangleFilled, TbCircleCheckFilled, TbWorld } from "react-icons/tb";
import { FaCheck, FaInstagram, FaPhone } from "react-icons/fa";
import { BsCheck2All, BsCheckCircleFill, BsPatchCheckFill } from "react-icons/bs";
import { VscChromeClose } from "react-icons/vsc";
import { BiSolidError } from "react-icons/bi";
import GroundSolarPlant from "@/utils/svgs/ground-solar-plant.svg";
import { IoMdCloseCircle } from "react-icons/io";
type ResultStageProps = {
  nome: string;
  valorReferencia: number;
  resetSimulation: () => void;
};
function ResultStage({ nome, valorReferencia, resetSimulation }: ResultStageProps) {
  const investiment = getInsuranceInvestmentByReferenceValue(valorReferencia);
  const activationByCategory = {
    "Sistema em Solo": 75,
    "Sistema em Telhado": 25,
    "Sistemas Rurais": 88,
    "Sistemas Urbanos": 12,
  };
  const activationCauses = {
    "Vendaval e Granizo": 72,
    "Roubo e Furto Qualificado": 16,
    "Danos Elétricos": 4,
    "Queda de Raio": 4,
  };
  const protectionDescription = [
    {
      label: "Defeitos de fabricação",
      additional: null,
      warranty: true,
      insurance: false,
    },
    {
      label: "Incêndio",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Explosão",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Queda de raio",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Vendaval",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Granizo",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Furacão",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Ciclone",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Impacto de veículos",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Inundação",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Alagamento",
      additional: null,
      warranty: false,
      insurance: true,
    },
    {
      label: "Roubo/Furto qualificado",
      additional: "(limitado a 50% do valor do projeto)",
      warranty: false,
      insurance: true,
    },
    {
      label: "Roubo/Furto qualificado",
      additional: "(limitado a 50% do valor do projeto)",
      warranty: false,
      insurance: true,
    },
    {
      label: "Danos elétricos",
      additional: "(limitado a 30% do valor do projeto)",
      warranty: false,
      insurance: true,
    },
    {
      label: "Despesas extras",
      additional: "(limitado a 5% do valor do projeto)",
      warranty: false,
      insurance: true,
    },
    {
      label: "Mão de obra do integrador",
      additional: "(em caso de sinistro) ",
      warranty: false,
      insurance: true,
    },
  ];

  return (
    <div className={`bg-background font-raleway flex grow flex-col`}>
      <div className="flex h-[100px] w-full items-center justify-center self-stretch bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
        <div className="flex w-[90] flex-col items-center justify-center">
          {/* <img src={Logo} style={{ width: "100%" }} /> */}
          <Image
            src={AmpereWhiteLogo}
            quality={100}
            height={90}
            width={90}
            alt="LOGO"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div className="flex w-full grow flex-col">
        <div className="my-2 flex w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
          <button
            onClick={() => resetSimulation()}
            className="flex cursor-pointer items-center gap-2 rounded bg-[rgba(58,181,74,255)] p-2 px-4 font-bold text-white duration-300 ease-in-out hover:scale-105 hover:bg-green-400"
          >
            <MdOutlineRestartAlt style={{ fontSize: "25px" }} />
            <p>NOVA SIMULAÇÃO</p>
          </button>
        </div>
        <div className="my-6 flex w-full flex-col lg:my-3">
          <h1 className="my-2 mb-6 px-4 text-center text-sm font-bold tracking-tight lg:text-base">
            <strong className="text-[#15599a]">{nome}</strong>, proteja seu investimento em energia
            solar com nosso seguro especializado para sistemas fotovoltaicos. Garantimos segurança,
            tranquilidade e continuidade operacional, independentemente dos imprevistos que possam
            surgir.
          </h1>
          <div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="flex h-full w-full grow flex-col self-center rounded-md border border-blue-600 lg:w-1/2">
              <div className="flex w-full items-center gap-1 rounded-br-md rounded-bl-md bg-blue-600 p-3">
                <h1 className="w-full text-center text-[0.7rem] font-bold text-white">
                  RANKING DE CAUSAS FREQUENTES DE ACIONAMENTO
                </h1>
              </div>
              <div className="flex w-full flex-col gap-2 p-3">
                {Object.entries(activationCauses).map(([key, value]) => (
                  <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                    <div className="flex items-center gap-1">
                      {/* <div className="flex h-[25px] min-h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full border-2 border-blue-600 p-1 text-blue-600 lg:h-[40px] lg:min-h-[40px] lg:w-[40px] lg:min-w-[40px]">
                      <FaSolarPanel size={25} />
                      </div> */}
                      <div className="flex items-center justify-center gap-2 rounded-full border-2 border-blue-600 p-1 text-blue-600">
                        <MdReportProblem size={25} />
                        <p className="text-xs font-bold uppercase lg:text-base">{key}</p>
                      </div>
                    </div>
                    <div className="flex h-[30px] w-full grow items-center justify-start rounded border border-black lg:w-fit">
                      <div
                        style={{ width: `${value}%`, minWidth: "20px", height: 30 }}
                        className="bg-primary text-primary-foreground flex items-center justify-center rounded-sm text-xs font-bold shadow-xs"
                      >
                        {value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex h-full w-full grow flex-col self-center rounded-md border border-orange-600 lg:w-1/2">
              <div className="flex w-full items-center gap-1 rounded-br-md rounded-bl-md bg-orange-600 p-3">
                <h1 className="w-full text-center text-[0.7rem] font-bold text-white">
                  ACIONAMENTOS POR CATEGORIA
                </h1>
              </div>
              <div className="flex w-full flex-col gap-2 p-3">
                {Object.entries(activationByCategory).map(([key, value]) => (
                  <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                    <div className="flex items-center gap-1">
                      {/* <div className="flex h-[35px] min-h-[35px] w-[35px] min-w-[35px] items-center justify-center rounded-full border-2 border-orange-600 p-1 text-orange-600 lg:h-[40px] lg:min-h-[40px] lg:w-[40px] lg:min-w-[40px]">
                      <FaSolarPanel size={25} />
                      </div>
                      <p className="font-bold">{key}</p> */}
                      <div className="flex items-center justify-center gap-2 rounded-full border-2 border-orange-600 p-1 text-orange-600">
                        <FaSolarPanel size={25} />
                        <p className="text-xs font-bold uppercase lg:text-base">{key}</p>
                      </div>
                    </div>
                    <div className="flex h-[30px] w-full grow items-center justify-start rounded border border-black lg:w-fit">
                      <div
                        style={{ width: `${value}%`, minWidth: "20px", height: 30 }}
                        className="bg-primary text-primary-foreground flex items-center justify-center rounded-sm text-xs font-bold shadow-xs"
                      >
                        {value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="my-2 flex w-full flex-col gap-2 px-2">
            <h1 className="text-foreground w-full text-center tracking-tight">
              Não corra riscos desnecessários. Invista na segurança do seu sistema fotovoltaico e
              tenha a certeza de que, independentemente do que aconteça, você está protegido com uma
              cobertura confiável e abrangente.
            </h1>
            <h1 className="text-foreground w-full text-center tracking-tight">
              Entenda como funciona nossa proteção:
            </h1>
            <div className="flex h-full w-full grow flex-col self-center rounded-md border border-black lg:w-[80%]">
              <div className="flex w-full items-center gap-1 rounded-br-md rounded-bl-md bg-black p-3">
                <h1 className="w-2/3 text-center text-xs font-bold text-white lg:text-sm">
                  PROTEÇÃO
                </h1>
                <h1 className="w-1/3 text-center text-xs font-bold text-white lg:text-sm">
                  GARANTIA
                </h1>
                <h1 className="w-1/3 text-center text-xs font-bold text-white lg:text-sm">
                  SEGURO
                </h1>
              </div>
              <div className="flex w-full flex-col gap-2 p-3">
                {protectionDescription.map((value) => (
                  <div className="flex w-full items-center gap-0 lg:gap-1">
                    <div className="flex w-2/3 flex-col items-center justify-center gap-1 lg:flex-row lg:justify-start">
                      <h1 className="text-center text-xs leading-none font-bold lg:text-sm">
                        {value.label}
                      </h1>
                      {value.additional ? (
                        <p className="text-foreground text-center text-xs leading-none font-light lg:text-sm">
                          {value.additional}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex w-1/3 items-center justify-center">
                      {value.warranty ? (
                        <TbCircleCheckFilled color="rgb(22,163,74)" />
                      ) : (
                        <IoMdCloseCircle color="rgb(220,38,38)" />
                      )}
                    </div>
                    <div className="flex w-1/3 items-center justify-center">
                      {value.insurance ? (
                        <TbCircleCheckFilled color="rgb(22,163,74)" />
                      ) : (
                        <IoMdCloseCircle color="rgb(220,38,38)" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-1 rounded-br-md rounded-bl-md bg-green-800 p-3">
          <h1 className="w-full text-center text-[0.7rem] font-bold text-white">INVESTIMENTO</h1>
        </div>
        <h1 className="text-foreground mt-2 w-full text-center tracking-tight">
          Não deixe que imprevistos comprometam a eficiência e a rentabilidade do seu sistema
          fotovoltaico.
        </h1>
        <h1 className="text-foreground w-full text-center tracking-tight">
          Adquira já o nosso seguro anual especializado por:
        </h1>
        <h1 className="w-full text-center text-2xl font-black text-green-600">
          {formatToMoney(investiment)} / anual
        </h1>
      </div>
      <div className="mt-6 flex w-full flex-col">
        <h1 className="w-full text-center text-lg font-black">SOBRE NÓS</h1>
        <div className="text-foreground w-full self-center px-2 py-2 text-center text-sm font-medium tracking-tight lg:w-[70%] lg:text-lg">
          A <strong className="text-[#fead41]">Ampère Energias</strong> é uma empresa que nasceu no
          Triangulo Mineiro, com a missão de ser a melhor empresa de soluções em energia do Brasil,
          oferecendo soluções completas e com qualidade para os nossos clientes, levando economia e
          qualidade, com praticidade e facilidade. A Ampère conta com{" "}
          <strong className="text-[#fead41]">
            mais de 1500 sistemas fotovoltaicos comercializados na região, sendo uma das maiores
            integradoras de sistemas fotovoltaicos de Minas Gerais.
          </strong>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-4 bg-[#15599a] p-4">
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
          <div className="flex items-center gap-1 text-white">
            <FaLocationDot size={20} />
            <p className="text-xs tracking-tight">
              Avenida Nove Nº 233, Centro - 38300-150 - Ituiutaba/MG
            </p>
          </div>
          <div className="flex items-center gap-1 text-white">
            <MdEmail size={20} />
            <p className="text-xs tracking-tight">comercial@ampereenergias.com.br</p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-around gap-2 lg:flex-row lg:gap-6">
          <div className="flex items-center gap-1 text-white">
            <TbWorld size={20} />
            <p className="text-xs tracking-tight">ampereenergias.com.br</p>
          </div>

          <div className="flex items-center gap-1 text-white">
            <FaInstagram size={20} />
            <p className="text-xs tracking-tight">@ampereenergias</p>
          </div>

          <div className="flex items-center gap-1 text-white">
            <FaPhone size={20} />
            <p className="text-xs tracking-tight">(34) 3700-7001</p>
          </div>
        </div>

        <h1 className="w-full text-center font-black text-white">
          A energia que movê o mundo <strong className="text-[#fead41]">vem de você !</strong>
        </h1>
      </div>
    </div>
  );
}

export default ResultStage;
