import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import LogoSemTexto from '../../../../utils/logoBrancoSemTexto.png'
import Logo from '../../../../utils/logoBranco.png'
import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../../utils/insideSalesDb'
import FacebookPixel from '../../../../components/Head/facebook/pixel-1'
import Head from 'next/head'
import AnalyticsScripts from '../../../../components/Head/analytics'
import { MdOutlineRestartAlt } from 'react-icons/md'
import { formatToMoney } from '../../../../utils/constants'
export default function Result(props) {
  console.log(props)
  function getGreetings(clientName) {
    let currentHour = new Date().getHours()

    if (currentHour >= 0 && currentHour < 5) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Olá <strong className="text-[#15599a]">{clientName}</strong>, tudo bem ?
        </p>
      )
    }
    if (currentHour > 5 && currentHour < 12) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Bom dia <strong className="text-[#15599a]">{clientName}</strong>, tudo bem ?
        </p>
      )
    }
    if (currentHour > 12 && currentHour < 19) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Boa tarde <strong className="text-[#15599a]">{clientName}</strong>, tudo bem ?
        </p>
      )
    }
    if (currentHour > 19 && currentHour <= 23) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Boa noite <strong className="text-[#15599a]">{clientName}</strong>, tudo bem ?
        </p>
      )
    }
  }
  function getReturnTimeString(years, months) {
    if (months == 0) {
      return `${years} anos`
    } else {
      return `${years} anos e ${months} meses`
    }
  }
  function beautifyNumberAsString(number) {
    if (number < 10) return `0${number}`
    else return number
  }
  return (
    <>
      <Head>
        <FacebookPixel />
        <AnalyticsScripts />
      </Head>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TVBGCSZT"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
      <div className={`bg-white flex flex-col grow font-['Raleway']`}>
        <div className="w-full flex justify-center items-center self-stretch h-[82px] bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
          <div className="flex flex-col justify-center items-center w-[80px]">
            {/* <img src={Logo} style={{ width: "100%" }} /> */}
            <Image src={Logo} blurDataURL="image.com" quality={100} height={50} width={50} alt="LOGO" style={{ objectFit: 'cover' }} />
          </div>
        </div>
        <div className="px-4 py-12 w-[90%] gap-2 flex flex-col justify-center self-center">
          <div className="flex flex-col gap-4 w-full items-start leading-none relative">
            <h1 className="text-lg font-black">{props.nome},</h1>
            <p className="text-lg font-medium">Com os dados que nos passou, criamos uma estimativa de projeto para você.</p>
          </div>
          <p className="text-lg font-medium mt-4">
            De acordo com seu consumo, sugerimos uma geração mensal de {props.energiaGerada.toFixed(2).replace('.', ',')} kWh, que pode ser alcançada
            com {props.numModulos} placas de 550 Wp.
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

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex flex-col p-2 bg-gray-200 min-h-[65px] border border-gray-500 shadow-md w-1/3 rounded-lg">
              <h1 className="tracking-tight text-[16px] ">Geração mensal aproximada</h1>
              <div className="flex items-end justify-center gap-1">
                <h1 className="font-black flex items-end justify-end text-[35px] lg:text-[40px] font-raleway">
                  {props.energiaGerada.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
                <p className="flex flex-grow-0 items-end justify-center text-sm text-gray-700 mb-1">KWh</p>
              </div>
            </div>
            <div className="flex flex-col p-2 bg-gray-200 min-h-[65px] border border-gray-500 shadow-md w-1/3 rounded-lg">
              <h1 className="tracking-tight text-[16px] ">Investimento aproximado</h1>
              <div className="flex items-start justify-center gap-1">
                <p className="flex flex-grow-0 items-end justify-center text-sm text-gray-700 mt-2">R$</p>
                <h1 className="font-black flex items-end justify-end text-[35px] lg:text-[40px] font-raleway">
                  {props.valorInvestido.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div>
            <div className="flex flex-col p-2 bg-gray-200 min-h-[65px] border border-gray-500 shadow-md w-1/3 rounded-lg">
              <h1 className="tracking-tight text-[16px] ">Placas necessárias ({props.potModulos} Wp)</h1>
              <div className="flex items-start justify-center gap-1">
                <h1 className="font-black flex items-end justify-end text-[35px] lg:text-[40px] font-raleway">
                  {props.numModulos.toLocaleString('pt-br', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </h1>
              </div>
            </div>
          </div>
          <h1 className="text-[35px] font-bold text-green-800">Formas de Pagamento</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col w-1/3">
              <h1 className="font-bold text-green-800">Financiamento bancário</h1>
              <div className="flex flex-col p-2 bg-[rgba(58,181,74,255)] min-h-[90px] border border-gray-500 shadow-md w-full rounded-lg">
                <h1 className="tracking-tight text-[16px] text-gray-200">
                  <strong className="text-white">60</strong> parcelas de:
                </h1>
                <div className="flex items-start justify-center gap-1">
                  <p className="flex flex-grow-0 items-end justify-center text-sm text-gray-100 mt-2">R$</p>
                  <h1 className="font-black flex items-end justify-end text-[35px] lg:text-[40px] font-raleway text-white">
                    {props.parcelaFinanciamento.toLocaleString('pt-br', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <h1 className="font-bold text-green-800">Cartão de Crédito</h1>
              <div className="flex flex-col p-2 bg-[rgba(58,181,74,255)] min-h-[90px] border border-gray-500 shadow-md w-full rounded-lg">
                <h1 className="tracking-tight text-[16px] text-gray-200">
                  <strong className="text-white">12</strong> parcelas de:
                </h1>
                <div className="flex items-start justify-center gap-1">
                  <p className="flex flex-grow-0 items-end justify-center text-sm text-gray-100 mt-2">R$</p>
                  <h1 className="font-black flex items-end justify-end text-[35px] lg:text-[40px] font-raleway text-white">
                    {props.parcelaCartao.toLocaleString('pt-br', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <h1 className="font-bold">Observações</h1>
              <div className="flex flex-col items-center justify-center p-2 bg-gray-200 min-h-[90px] border border-gray-300 shadow-md w-full rounded-lg font-semibold text-xs lg:text-sm">
                *Todos os valores apresentados nessa simulação são estimativas, podendo, desse modo, variar de acordo com condições externas. Para
                valores reais, consultar com especialistas.*
              </div>
            </div>
          </div>
          <h1 className="text-[35px] font-bold text-gray-500">Economia e Retorno</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col p-2 py-1 bg-gray-200  min-h-[50px] border border-gray-500 shadow-md rounded-lg w-1/2">
              <h1 className="tracking-tight text-[16px]">Sua economia ao longo do ano será de:</h1>
              <div className="flex items-start justify-center gap-2">
                <p className="flex flex-grow-0 items-end justify-center text-sm text-gray-700 mt-2">R$</p>
                <h1 className="font-black flex items-end justify-end text-[35px] lg:text-[40px] font-raleway">
                  {props.economiaAnual.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div>

            <div className="flex flex-col p-2 py-1 bg-gray-200  min-h-[50px] border border-gray-500 shadow-md rounded-lg w-1/2">
              <h1 className="tracking-tight text-[16px]">Tempo de retorno do investimento</h1>
              <div className="flex items-end justify-center gap-2">
                <p className="text-[35px] lg:text-[40px] font-black font-raleway">{beautifyNumberAsString(props.anosCompletosPayback)}</p>
                <p className="mb-1">anos e</p>
                <p className="text-[35px] lg:text-[40px] font-black font-raleway">{beautifyNumberAsString(props.mesesCompletosPayback)}</p>
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
          <div className="flex w-full justify center gap-4">
            <h1 className="text-lg font-medium">
              <strong>{props.nome}</strong>, aguardamos seu contato no telefone <strong className="text-[#fead41]">(34) 3700-7001</strong> !
            </h1>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 px-10 w-full h-[175px] bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col justify-center items-center w-[80px]">
              {/* <img src={Logo} style={{ width: "100%" }} /> */}
              <Image src={Logo} placeholder="blur" quality={100} height={40} width={40} alt="LOGO" style={{ objectFit: 'cover' }} />
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="w-full leading-none relative">
                <p className="font-normal text-white inline m-0 text-[15px] leading-[1.2]">A energia que move o mundo</p>
                <p className="text-xs font-normal text-white inline m-0 leading-[1.2]"> </p>
                <p className="font-black inline m-0 text-[15px] leading-[1.2] text-[rgba(254,173,65,1)]">vem de você</p>
                <p className="text-xs font-normal text-white inline m-0 leading-[1.2]">!</p>
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
    </>
  )
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id
  const db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection('leads')
  let os = await collection.findOne({
    _id: ObjectId(id),
  })

  function getInstallmentsValue(financedValue, rate, monthNumber) {
    let numerator = financedValue * rate
    let denominator = 1 - Math.pow(1 + rate, -monthNumber)
    return Number((numerator / denominator).toFixed(2))
  }

  let info = JSON.parse(JSON.stringify(os))
  const energyConsumption = Number(Number((info.consumo / 0.85).toFixed(2)))
  const suggestedPeakPower = Number(energyConsumption / 120)

  var moduleQty = 0
  var modulePower = 0
  var investiment = 0
  var effectivePeakPower = 0

  moduleQty = Math.ceil((energyConsumption * 1000) / (120 * 565))
  modulePower = 565
  effectivePeakPower = (moduleQty * modulePower) / 1000
  investiment = effectivePeakPower * 3600

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
    props: {
      nome: info.nome,
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
    },
  }
}
