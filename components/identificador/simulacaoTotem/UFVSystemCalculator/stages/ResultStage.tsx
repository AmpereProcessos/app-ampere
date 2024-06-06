import { getUFVSystemInvestmentByEnergyBill } from '@/utils/totem-simulation/helpers'
import Image from 'next/image'
import React from 'react'
import AmpereWhiteLogo from '@/utils/svgs/logo-texto-branco-vertical.svg'
import { MdOutlineRestartAlt } from 'react-icons/md'
import { formatToMoney } from '@/utils/constants'

type ResultStageProps = {
  nome: string
  valorFaturaEnergia: number
  resetSimulation: () => void
}
function ResultStage({ nome, valorFaturaEnergia, resetSimulation }: ResultStageProps) {
  function beutifyNumberAsString(number: number) {
    if (number < 10) return `0${number}`
    else return number
  }
  const props = getInfo(Number(valorFaturaEnergia))
  return (
    <div className={`flex grow flex-col bg-white font-raleway`}>
      <div className="flex h-[82px] w-full items-center justify-center self-stretch bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
        <div className="flex w-[80px] flex-col items-center justify-center">
          {/* <img src={Logo} style={{ width: "100%" }} /> */}
          <Image src={AmpereWhiteLogo} quality={100} height={50} width={50} alt="LOGO" style={{ objectFit: 'cover' }} />
        </div>
      </div>
      <div className="flex w-[90%] flex-col justify-center gap-2 self-center px-4 py-12">
        <div className="flex w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
          <button
            onClick={() => resetSimulation()}
            className="flex cursor-pointer items-center gap-2 rounded bg-[rgba(58,181,74,255)] p-2 px-4 font-bold text-white duration-300 ease-in-out hover:scale-105 hover:bg-green-400"
          >
            <MdOutlineRestartAlt style={{ fontSize: '25px' }} />
            <p>Nova simulação</p>
          </button>
        </div>
        <div className="relative flex w-full flex-col items-start gap-4 leading-none">
          <h1 className="text-lg font-black">{nome},</h1>
          <p className="text-lg font-medium">Com os dados que nos passou, criamos uma estimativa de projeto para você.</p>
        </div>
        <p className="mt-4 text-lg font-medium">
          De acordo com seu consumo, sugerimos uma geração mensal de {props.energiaGerada.toFixed(2).replace('.', ',')} kWh, que pode ser alcançada
          com {props.numModulos} placas de {props.potModulos} Wp.
        </p>
        {/* <div className="flex flex-col items-center">
            <div>
              <FaSolarPanel size={"50px"} color="#fead41" />
            </div>
            <p className="font-black text-[#15599a]">
              {props.numModulos} placas de 550 Wp
            </p>
          </div> */}
        <p className="text-lg font-medium">
          O investimento aproximado para esse projeto é de {props.valorInvestido ? formatToMoney(props.valorInvestido) : ''}.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 lg:flex-row">
          <div className="flex min-h-[65px] w-full flex-col rounded-lg border border-gray-500 bg-gray-200 p-2 shadow-md lg:w-1/3">
            <h1 className="text-[16px] tracking-tight ">Geração mensal aproximada</h1>
            <div className="flex items-end justify-center gap-1">
              <h1 className="flex items-end justify-end font-raleway text-[35px] font-black lg:text-[40px]">
                {props.energiaGerada.toLocaleString('pt-br', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>
              <p className="mb-1 flex flex-grow-0 items-end justify-center text-sm text-gray-700">KWh</p>
            </div>
          </div>
          <div className="flex min-h-[65px] w-full flex-col rounded-lg border border-gray-500 bg-gray-200 p-2 shadow-md lg:w-1/3">
            <h1 className="text-[16px] tracking-tight ">Investimento aproximado</h1>
            <div className="flex items-start justify-center gap-1">
              <p className="mt-2 flex flex-grow-0 items-end justify-center text-sm text-gray-700">R$</p>
              <h1 className="flex items-end justify-end font-raleway text-[35px] font-black lg:text-[40px]">
                {props.valorInvestido.toLocaleString('pt-br', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>
            </div>
          </div>
          <div className="flex min-h-[65px] w-full flex-col rounded-lg border border-gray-500 bg-gray-200 p-2 shadow-md lg:w-1/3">
            <h1 className="text-[16px] tracking-tight ">Placas necessárias ({props.potModulos} Wp)</h1>
            <div className="flex items-start justify-center gap-1">
              <h1 className="flex items-end justify-end font-raleway text-[35px] font-black lg:text-[40px]">
                {props.numModulos.toLocaleString('pt-br', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </h1>
            </div>
          </div>
        </div>
        <h1 className="text-[35px] font-bold text-green-800">Formas de Pagamento</h1>
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
          <div className="flex w-full flex-col lg:w-1/3">
            <h1 className="font-bold text-green-800">Financiamento bancário</h1>
            <div className="flex min-h-[90px] w-full flex-col rounded-lg border border-gray-500 bg-[rgba(58,181,74,255)] p-2 shadow-md">
              <h1 className="text-[16px] tracking-tight text-gray-200">
                <strong className="text-white">60</strong> parcelas de:
              </h1>
              <div className="flex items-start justify-center gap-1">
                <p className="mt-2 flex flex-grow-0 items-end justify-center text-sm text-gray-100">R$</p>
                <h1 className="flex items-end justify-end font-raleway text-[35px] font-black text-white lg:text-[40px]">
                  {props.parcelaFinanciamento.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col lg:w-1/3">
            <h1 className="font-bold text-green-800">Cartão de Crédito</h1>
            <div className="flex min-h-[90px] w-full flex-col rounded-lg border border-gray-500 bg-[rgba(58,181,74,255)] p-2 shadow-md">
              <h1 className="text-[16px] tracking-tight text-gray-200">
                <strong className="text-white">12</strong> parcelas de:
              </h1>
              <div className="flex items-start justify-center gap-1">
                <p className="mt-2 flex flex-grow-0 items-end justify-center text-sm text-gray-100">R$</p>
                <h1 className="flex items-end justify-end font-raleway text-[35px] font-black text-white lg:text-[40px]">
                  {props.parcelaCartao.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col lg:w-1/3">
            <h1 className="font-bold">Observações</h1>
            <div className="flex min-h-[90px] w-full flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-200 p-2 text-xs font-semibold shadow-md lg:text-sm">
              *Todos os valores apresentados nessa simulação são estimativas, podendo, desse modo, variar de acordo com condições externas. Para
              valores reais, consultar com especialistas.*
            </div>
          </div>
        </div>
        <h1 className="text-[35px] font-bold text-gray-500">Economia e Retorno</h1>
        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
          <div className="flex min-h-[50px] w-full flex-col rounded-lg border  border-gray-500 bg-gray-200 p-2 py-1 shadow-md lg:w-1/2">
            <h1 className="text-[16px] tracking-tight">Sua economia ao longo do ano será de:</h1>
            <div className="flex items-start justify-center gap-2">
              <p className="mt-2 flex flex-grow-0 items-end justify-center text-sm text-gray-700">R$</p>
              <h1 className="flex items-end justify-end font-raleway text-[35px] font-black lg:text-[40px]">
                {props.economiaAnual.toLocaleString('pt-br', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>
            </div>
          </div>

          <div className="flex min-h-[50px] w-full flex-col rounded-lg border  border-gray-500 bg-gray-200 p-2 py-1 shadow-md lg:w-1/2">
            <h1 className="text-[16px] tracking-tight">Tempo de retorno do investimento</h1>
            <div className="flex items-end justify-center gap-2">
              <p className="font-raleway text-[35px] font-black lg:text-[40px]">{beutifyNumberAsString(props.anosCompletosPayback)}</p>
              <p className="mb-1">anos e</p>
              <p className="font-raleway text-[35px] font-black lg:text-[40px]">{beutifyNumberAsString(props.mesesCompletosPayback)}</p>
              <p className="mb-1">meses</p>
            </div>
          </div>
        </div>
        <h1 className="text-lg font-medium">Mas não é só isso...</h1>
        <h1 className="text-lg font-medium">
          Ter um Sistema Ampère em sua casa não é apenas uma escolha econômica e ambientalmente consciente, mas também um símbolo de status na
          sociedade.
        </h1>
        <h1 className="text-lg font-medium">
          Ao optar por nossa empresa, você está escolhendo a qualidade e a segurança que só uma marca forte, que oferece 5 anos de garantia da
          instalação e possui mais de 1.500 clientes no portfólio como a nossa, pode oferecer.
        </h1>
        <h1 className="text-lg font-medium">
          Aqui seu projeto passa por mais de 10 engenheiros antes de chegar até você, desde o atendimento até o suporte técnico após a instalação!
        </h1>
        <div className="justify center flex w-full gap-4">
          <h1 className="text-lg font-medium">
            <strong>{nome}</strong>, aguardamos seu contato no telefone <strong className="text-[#fead41]">(34) 3700-7001</strong> !
          </h1>
        </div>
      </div>
      <div className="flex h-[175px] w-full flex-col items-center justify-center gap-2 bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] px-10">
        <div className="flex items-center justify-center gap-3">
          <div className="flex w-[80px] flex-col items-center justify-center">
            {/* <img src={Logo} style={{ width: "100%" }} /> */}
            <Image src={AmpereWhiteLogo} quality={100} height={40} width={40} alt="LOGO" style={{ objectFit: 'cover' }} />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full leading-none">
              <p className="m-0 inline text-[15px] font-normal leading-[1.2] text-white">A energia que move o mundo</p>
              <p className="m-0 inline text-xs font-normal leading-[1.2] text-white"> </p>
              <p className="m-0 inline text-[15px] font-black leading-[1.2] text-[rgba(254,173,65,1)]">vem de você</p>
              <p className="m-0 inline text-xs font-normal leading-[1.2] text-white">!</p>
            </div>
          </div>
        </div>
        {/* <div className="w-full flex items-center justify-center gap-3">
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
        </div> */}
      </div>
    </div>
  )
}

export default ResultStage

function getInstallmentsValue(financedValue: number, rate: number, monthNumber: number) {
  let numerator = financedValue * rate
  let denominator = 1 - Math.pow(1 + rate, -monthNumber)
  return Number((numerator / denominator).toFixed(2))
}
function getInfo(billValue: number) {
  const energyConsumption = Number(Number((billValue / 0.85).toFixed(2)))

  const { moduleQty, modulePower, investiment, effectivePeakPower } = getUFVSystemInvestmentByEnergyBill(billValue)

  // if (suggestedKit) {
  //   moduleQty = suggestedKit.qtdeModulos;
  //   modulePower = suggestedKit.potModulos;
  //   investiment = suggestedKit.preco;
  //   effectivePeakPower = suggestedKit.potenciaPico / 1000;
  // } else {
  // }

  let economiaAnual = Number(Number((effectivePeakPower * 120 * 12 * 0.85).toFixed(2)))

  let anosCompletosPayback = Number(((investiment - (investiment % economiaAnual)) / economiaAnual).toFixed(0))
  let mesesCompletosPayback = Math.ceil(((investiment % economiaAnual) / economiaAnual) * 12)

  if (mesesCompletosPayback == 12) {
    anosCompletosPayback = Number(anosCompletosPayback) + 1

    mesesCompletosPayback = 0
  }
  let parcelaFinanciamento = getInstallmentsValue(investiment, 0.02, 60)

  // Fórmula das prestações fixas: https://www3.bcb.gov.br/CALCIDADAO/publico/exibirMetodologiaFinanciamentoPrestacoesFixas.do?method=exibirMetodologiaFinanciamentoPrestacoesFixas

  let parcelaCartao = Number(((investiment * 1.15) / 12).toFixed(2))
  return {
    energiaNecessaria: energyConsumption,
    energiaGerada: effectivePeakPower * 120,
    numModulos: moduleQty,
    potModulos: modulePower,
    potPico: effectivePeakPower,
    economiaAnual,
    valorInvestido: investiment,
    anosCompletosPayback,
    mesesCompletosPayback,
    parcelaFinanciamento,
    parcelaCartao,
  }
}
