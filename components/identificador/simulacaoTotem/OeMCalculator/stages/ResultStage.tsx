import { getOeMInvestimentByModuleQty, getUFVSystemInvestmentByEnergyBill } from '@/utils/totem-simulation/helpers'
import Image from 'next/image'
import React from 'react'
import AmpereWhiteLogo from '@/utils/svgs/logo-texto-branco-vertical.svg'
import { MdEmail, MdOutlineRestartAlt } from 'react-icons/md'
import { formatToMoney } from '@/utils/constants'
import { FaLocationDot } from 'react-icons/fa6'
import { TbAlertTriangleFilled, TbWorld } from 'react-icons/tb'
import { FaCheck, FaInstagram, FaPhone } from 'react-icons/fa'
import { BsCheck2All, BsCheckCircleFill, BsPatchCheckFill } from 'react-icons/bs'
import { VscChromeClose } from 'react-icons/vsc'
import { BiSolidError } from 'react-icons/bi'

type ResultStageProps = {
  nome: string
  numModulos: number
  potenciaPico: number | null
  resetSimulation: () => void
}
function ResultStage({ nome, numModulos, potenciaPico, resetSimulation }: ResultStageProps) {
  const { simpleMaintenance, sunPlan, sunPlusPlan } = getOeMInvestimentByModuleQty(numModulos)
  const plans = [
    {
      id: '',
      nome: 'MANUTENÇÃO SIMPLES',
      valor: simpleMaintenance,
      descricao: 'Serviço de manutenção simples.',
      intervalo: {
        tipo: 'ANUAL',
        espacamento: 1,
      },
      descritivo: [
        {
          descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS',
        },
        {
          descricao: 'MANUTENÇÃO ELÉTRICA DOS INVERSORES E QUADROS ELÉTRICOS',
        },
        {
          descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
        },
      ],
    },
    {
      id: '',
      nome: 'PLANO SOL',
      valor: sunPlan,
      descricao: 'Nosso plano de operação e manutenção básico.',
      intervalo: {
        tipo: 'ANUAL',
        espacamento: 1,
      },
      descritivo: [
        {
          descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS',
        },
        {
          descricao: 'MANUTENÇÃO ELÉTRICA DOS INVERSORES E QUADROS ELÉTRICOS',
        },
        {
          descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
        },
        {
          descricao: 'DISTRIBUIÇÃO DE CRÉDITOS (2x)',
        },
      ],
    },
    {
      id: '',
      nome: 'PLANO SOL PLUS',
      valor: sunPlusPlan,
      descricao: 'Nosso plano de operação e manutenção premium.',
      intervalo: {
        tipo: 'ANUAL',
        espacamento: 1,
      },
      descritivo: [
        {
          descricao: 'LIMPEZA DOS MÓDULOS FOTOVOLTAICOS (2x)',
        },
        {
          descricao: 'MANUTENÇÃO ELÉTRICA DOS INVERSORES E QUADROS ELÉTRICOS (2x)',
        },
        {
          descricao: 'REAPERTO DAS CONEXÕES ELÉTRICAS',
        },
        {
          descricao: 'DISTRIBUIÇÃO DE CRÉDITOS (4x)',
        },
      ],
    },
  ]

  const potencialProblems = [
    'Redução do desempenho de geração.',
    'Degradação de componentes e redução da vida útil dos equipamentos.',
    'Problemas com conexão de cabeamentos e consequente interrupção de funcionamento.',
    'Risco de segurança por falhas elétricas ou mecânicas.',
    'Perda de garantia dos equipamentos junto aos fornecedores.',
  ]

  const benefits = [
    'Maximização os rendimentos da sua usina fotovoltaica.',
    'Prolongação da vida útil dos equipamentos.',
    'Reduza o risco de gastos inesperados com reparos e afins.',
    'Tenha a segurança de ter seu sistema operado com as melhores práticas por profissionais capacitados.',
    'Adquirindo nossos planos, tenha acesso direto à uma equipe de profissionais especializados pronta pra atender você.',
  ]

  function getEstimatedPossibleLoss({ moduleQty, peakPower }: { moduleQty: number; peakPower: number | null }) {
    const STANDARD_MODULE_POWER = 450
    const STANDARD_EFFICIENCE = 90
    const STANDARD_GEN_FACTOR = 127
    const STANDARD_ENERGY_TARIFF = 0.9
    const effectivePeakPower = peakPower ? peakPower : (moduleQty * STANDARD_MODULE_POWER) / 1000
    const estimatedGeneration = effectivePeakPower * STANDARD_GEN_FACTOR
    console.log(estimatedGeneration)
    const annualLoss = 12 * (1 - STANDARD_EFFICIENCE / 100) * estimatedGeneration * STANDARD_ENERGY_TARIFF

    return annualLoss
  }
  return (
    <div className={`flex grow flex-col bg-white font-raleway`}>
      <div className="flex h-[100px] w-full items-center justify-center self-stretch bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
        <div className="flex w-[90] flex-col items-center justify-center">
          {/* <img src={Logo} style={{ width: "100%" }} /> */}
          <Image src={AmpereWhiteLogo} quality={100} height={90} width={90} alt="LOGO" style={{ objectFit: 'cover' }} />
        </div>
      </div>
      <div className="flex w-full grow flex-col">
        <div className="my-2 flex w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
          <button
            onClick={() => resetSimulation()}
            className="flex cursor-pointer items-center gap-2 rounded bg-[rgba(58,181,74,255)] p-2 px-4 font-bold text-white duration-300 ease-in-out hover:scale-105 hover:bg-green-400"
          >
            <MdOutlineRestartAlt style={{ fontSize: '25px' }} />
            <p>NOVA SIMULAÇÃO</p>
          </button>
        </div>
        <div className="my-3 flex w-full flex-col">
          <h1 className="text-center font-bold tracking-tight">
            <strong className="text-[#15599a]">{nome}</strong>, a manutenção e limpeza de um sistema fotovoltaico é essencial para garantir o seu
            pleno funcionamento, de forma que você obtenha o melhor do seu investimento.
          </h1>
          <div className="flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
            <div className="flex h-full w-full grow flex-col self-center rounded-md border border-red-600 lg:w-1/2">
              <div className="flex w-full items-center gap-1 rounded-bl-md rounded-br-md bg-red-600 p-3">
                <h1 className="w-full text-center text-[0.7rem] font-bold text-white">POTÊNCIAIS PROBLEMAS CAUSADOS PELA FALTA DE MANUTENÇÃO</h1>
              </div>
              <div className="flex w-full flex-col gap-2 p-3">
                {potencialProblems.map((problem, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-red-600 p-1 text-red-600 lg:h-[25px] lg:min-h-[25px] lg:w-[25px] lg:min-w-[25px]">
                      <VscChromeClose size={12} />
                    </div>
                    <p className="text-xs tracking-tight text-gray-500 lg:text-base">{problem}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex h-full w-full grow flex-col self-center rounded-md border border-green-600 lg:w-1/2">
              <div className="flex w-full items-center gap-1 rounded-bl-md rounded-br-md bg-green-600 p-3">
                <h1 className="w-full text-center text-[0.7rem] font-bold text-white">BENEFÍCIOS DA MANUTENÇÃO E LIMPEZA</h1>
              </div>
              <div className="flex w-full flex-col gap-2 p-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-green-600 p-1 text-green-600 lg:h-[25px] lg:min-h-[25px] lg:w-[25px] lg:min-w-[25px]">
                      <FaCheck size={12} />
                    </div>
                    <p className="text-xs tracking-tight text-gray-500 lg:text-base">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="my-2 flex w-full flex-col">
            <h1 className="w-full text-center tracking-tight text-gray-500">
              A execução de uma manutenção e limpeza, para um sistema como o seu <strong className="text-[#fead41]">({numModulos} módulos)</strong> ,
              pode te fazer <strong className="text-green-600">recuperar um montante anual</strong> estimado de:
            </h1>
            <h1 className="w-full text-center text-xl font-black text-green-600">
              {formatToMoney(getEstimatedPossibleLoss({ moduleQty: numModulos, peakPower: potenciaPico }))}
            </h1>
          </div>
        </div>
        <div className="flex w-full items-center gap-1 rounded-bl-md rounded-br-md bg-blue-800 p-3">
          <h1 className="w-full text-center text-[0.7rem] font-bold text-white">CONHEÇA NOSSAS OPÇÕES PARA VOCÊ</h1>
        </div>
        <div className="flex h-fit w-full flex-wrap items-stretch justify-center gap-2 py-2 px-2">
          {plans.map((plan, index) => (
            <div key={index} className="flex w-[350px] flex-col rounded-lg border border-gray-500 bg-[#fff] p-6 shadow-lg">
              <div className="flex w-full items-center justify-between gap-2">
                <h1 className="text-lg font-black">{plan.nome}</h1>
              </div>
              <p className="w-full text-start text-xs  text-gray-500">{plan?.descricao || '...'}</p>
              <div className="my-4 flex w-full items-end justify-center gap-1">
                <h1 className="text-2xl font-black">{formatToMoney(plan.valor || 0)}</h1>
                <h1 className="text-xs font-light text-gray-500">/ {plan?.intervalo.tipo}</h1>
              </div>

              <div className="my-4 flex flex-grow flex-col gap-1">
                <h1 className="text-[0.6rem] tracking-tight text-gray-500">DESCRITIVO</h1>
                <div className="flex flex-grow flex-col gap-2">
                  {plan.descritivo.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <div className="w-fit">
                        <BsCheckCircleFill color="rgb(21,128,61)" size={15} />
                      </div>
                      <p className="text-xs font-medium tracking-tight">{d.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col">
        <h1 className="mt-2 w-full text-center text-lg font-black">SOBRE NÓS</h1>
        <div className="w-full self-center px-2 py-2 text-center text-sm font-medium tracking-tight text-gray-500 lg:w-[70%] lg:text-lg">
          A <strong className="text-[#fead41]">Ampère Energias</strong> é uma empresa que nasceu no Triangulo Mineiro, com a missão de ser a melhor
          empresa de soluções em energia do Brasil, oferecendo soluções completas e com qualidade para os nossos clientes, levando economia e
          qualidade, com praticidade e facilidade. A Ampère conta com{' '}
          <strong className="text-[#fead41]">
            mais de 1500 sistemas fotovoltaicos comercializados na região, sendo uma das maiores integradoras de sistemas fotovoltaicos de Minas
            Gerais.
          </strong>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-4 bg-[#15599a] p-4">
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
          <div className="flex items-center gap-1 text-white">
            <FaLocationDot size={20} />
            <p className="text-xs tracking-tight">Avenida Nove Nº 233, Centro - 38300-150 - Ituiutaba/MG</p>
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
  )
}

export default ResultStage
