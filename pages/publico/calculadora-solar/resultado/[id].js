import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import LogoSemTexto from '../../../../utils/images/logo-semtexto-branco.png'
import Logo from '../../../../utils/images/logo-texto-branco.png'
import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../../utils/services/mongodb/inside-sales'
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
        <p className="text-primary/80 m-0 inline text-xl leading-[1.2]">
          Olá <strong className="text-[#15599a]">{clientName}</strong>, tudo bem ?
        </p>
      )
    }
    if (currentHour > 5 && currentHour < 12) {
      return (
        <p className="text-primary/80 m-0 inline text-xl leading-[1.2]">
          Bom dia <strong className="text-[#15599a]">{clientName}</strong>, tudo bem ?
        </p>
      )
    }
    if (currentHour > 12 && currentHour < 19) {
      return (
        <p className="text-primary/80 m-0 inline text-xl leading-[1.2]">
          Boa tarde <strong className="text-[#15599a]">{clientName}</strong>, tudo bem ?
        </p>
      )
    }
    if (currentHour > 19 && currentHour <= 23) {
      return (
        <p className="text-primary/80 m-0 inline text-xl leading-[1.2]">
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
      <div className={`bg-background flex grow flex-col font-['Raleway']`}>
        <div className="flex h-[82px] w-full items-center justify-center self-stretch bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
          <div className="flex w-[80px] flex-col items-center justify-center">
            {/* <img src={Logo} style={{ width: "100%" }} /> */}
            <Image src={Logo} blurDataURL="image.com" quality={100} height={50} width={50} alt="LOGO" style={{ objectFit: 'cover' }} />
          </div>
        </div>
        <div className="flex w-[90%] flex-col justify-center gap-2 self-center px-4 py-12">
          <div className="relative flex w-full flex-col items-start gap-4 leading-none">
            <h1 className="text-lg font-black">{props.nome},</h1>
            <p className="text-sm font-medium lg:text-lg">Com os dados que nos passou, criamos uma estimativa de projeto para você.</p>
          </div>
          <p className="mt-4 text-sm font-medium lg:text-lg">
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
          <p className="text-sm font-medium lg:text-lg">
            O investimento aproximado para esse projeto é de {props.valorInvestido ? formatToMoney(props.valorInvestido) : ''}.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 lg:flex-row">
            <div className="border-primary/60 flex min-h-[65px] w-full flex-col rounded-lg border bg-gray-200 p-2 shadow-md lg:w-1/3">
              <h1 className="text-[16px] tracking-tight">Geração mensal aproximada</h1>
              <div className="flex items-end justify-center gap-1">
                <h1 className="font-raleway flex items-end justify-end text-[35px] font-black lg:text-[40px]">
                  {props.energiaGerada.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
                <p className="text-primary/70 mb-1 flex grow-0 items-end justify-center text-sm">KWh</p>
              </div>
            </div>
            <div className="border-primary/60 flex min-h-[65px] w-full flex-col rounded-lg border bg-gray-200 p-2 shadow-md lg:w-1/3">
              <h1 className="text-[16px] tracking-tight">Investimento aproximado</h1>
              <div className="flex items-start justify-center gap-1">
                <p className="text-primary/70 mt-2 flex grow-0 items-end justify-center text-sm">R$</p>
                <h1 className="font-raleway flex items-end justify-end text-[35px] font-black lg:text-[40px]">
                  {props.valorInvestido.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div>
            <div className="border-primary/60 flex min-h-[65px] w-full flex-col rounded-lg border bg-gray-200 p-2 shadow-md lg:w-1/3">
              <h1 className="text-[16px] tracking-tight">Placas necessárias ({props.potModulos} Wp)</h1>
              <div className="flex items-start justify-center gap-1">
                <h1 className="font-raleway flex items-end justify-end text-[35px] font-black lg:text-[40px]">
                  {props.numModulos.toLocaleString('pt-br', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </h1>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-green-800 lg:text-[35px]">Formas de Pagamento</h1>
          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
            <div className="flex w-full flex-col lg:w-1/3">
              <h1 className="font-bold text-green-800">Financiamento bancário</h1>
              <div className="border-primary/60 flex min-h-[90px] w-full flex-col rounded-lg border bg-[rgba(58,181,74,255)] p-2 shadow-md">
                <h1 className="text-[16px] tracking-tight text-gray-200">
                  <strong className="text-white">60</strong> parcelas de:
                </h1>
                <div className="flex items-start justify-center gap-1">
                  <p className="text-primary/20 mt-2 flex grow-0 items-end justify-center text-sm">R$</p>
                  <h1 className="font-raleway flex items-end justify-end text-[35px] font-black text-white lg:text-[40px]">
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
              <div className="border-primary/60 flex min-h-[90px] w-full flex-col rounded-lg border bg-[rgba(58,181,74,255)] p-2 shadow-md">
                <h1 className="text-[16px] tracking-tight text-gray-200">
                  <strong className="text-white">12</strong> parcelas de:
                </h1>
                <div className="flex items-start justify-center gap-1">
                  <p className="text-primary/20 mt-2 flex grow-0 items-end justify-center text-sm">R$</p>
                  <h1 className="font-raleway flex items-end justify-end text-[35px] font-black text-white lg:text-[40px]">
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
              <div className="border-primary/20 flex min-h-[90px] w-full flex-col items-center justify-center rounded-lg border bg-gray-200 p-2 text-xs font-semibold shadow-md lg:text-sm">
                *Todos os valores apresentados nessa simulação são estimativas, podendo, desse modo, variar de acordo com condições externas. Para
                valores reais, consultar com especialistas.*
              </div>
            </div>
          </div>
          <h1 className="text-primary/60 text-xl font-bold lg:text-[35px]">Economia e Retorno</h1>
          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
            <div className="border-primary/60 flex min-h-[50px] w-full flex-col rounded-lg border bg-gray-200 p-2 py-1 shadow-md lg:w-1/2">
              <h1 className="text-[16px] tracking-tight">Sua economia ao longo do ano será de:</h1>
              <div className="flex items-start justify-center gap-2">
                <p className="text-primary/70 mt-2 flex grow-0 items-end justify-center text-sm">R$</p>
                <h1 className="font-raleway flex items-end justify-end text-[35px] font-black lg:text-[40px]">
                  {props.economiaAnual.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div>

            <div className="border-primary/60 flex min-h-[50px] w-full flex-col rounded-lg border bg-gray-200 p-2 py-1 shadow-md lg:w-1/2">
              <h1 className="text-[16px] tracking-tight">Tempo de retorno do investimento</h1>
              <div className="flex items-end justify-center gap-2">
                <p className="font-raleway text-[35px] font-black lg:text-[40px]">{beautifyNumberAsString(props.anosCompletosPayback)}</p>
                <p className="mb-1">anos e</p>
                <p className="font-raleway text-[35px] font-black lg:text-[40px]">{beautifyNumberAsString(props.mesesCompletosPayback)}</p>
                <p className="mb-1">meses</p>
              </div>
            </div>
          </div>
          <h1 className="text-sm font-medium lg:text-lg">Mas não é só isso...</h1>
          <h1 className="text-sm font-medium lg:text-lg">
            Ter um Sistema Ampère em sua casa não é apenas uma escolha econômica e ambientalmente consciente, mas também um símbolo de status na
            sociedade.
          </h1>
          <h1 className="text-sm font-medium lg:text-lg">
            Ao optar por nossa empresa, você está escolhendo a qualidade e a segurança que só uma marca forte, que oferece 1 ano de garantia da
            instalação e possui mais de 2.000 clientes no portfólio como a nossa, pode oferecer.
          </h1>
          <h1 className="text-sm font-medium lg:text-lg">
            Aqui seu projeto passa por mais de 10 engenheiros antes de chegar até você, desde o atendimento até o suporte técnico após a instalação!
          </h1>
          <div className="justify center flex w-full gap-4">
            <h1 className="text-sm font-medium lg:text-lg">
              <strong>{props.nome}</strong>, aguardamos seu contato no telefone <strong className="text-[#fead41]">(34) 3700-7001</strong> !
            </h1>
          </div>
        </div>
        <div className="flex h-[175px] w-full flex-col items-center justify-center gap-2 bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] px-10">
          <div className="flex flex-col items-center justify-center gap-3 lg:flex-row">
            <div className="relative h-[80px] w-[80px]">
              <Image src={Logo} quality={100} fill={true} alt="LOGO" />
            </div>
            <div className="flex flex-col items-center gap-1 lg:flex-row">
              <p className="text-center font-medium text-white">A energia que move o mundo</p>
              <p className="font-black text-[#fead41]">vem de você !</p>
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

  moduleQty = Math.ceil((energyConsumption * 1000) / (120 * 555))
  modulePower = 555
  effectivePeakPower = (moduleQty * modulePower) / 1000
  investiment = effectivePeakPower * 3000

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
