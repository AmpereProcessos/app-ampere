import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import LogoSemTexto from "../../../../utils/logoBrancoSemTexto.png";
import Logo from "../../../../utils/logoBranco.png";
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../../utils/insideSalesDb";
import FacebookPixel from "../../../../components/Head/facebook/pixel-1";
export default function Result(props) {
  console.log(props);
  function getGreetings(clientName) {
    let currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 5) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Olá <strong className="text-[#15599a]">{clientName}</strong>, tudo bem
          ?
        </p>
      );
    }
    if (currentHour > 5 && currentHour < 12) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Bom dia <strong className="text-[#15599a]">{clientName}</strong>, tudo
          bem ?
        </p>
      );
    }
    if (currentHour > 12 && currentHour < 19) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Boa tarde <strong className="text-[#15599a]">{clientName}</strong>,
          tudo bem ?
        </p>
      );
    }
    if (currentHour > 19 && currentHour <= 23) {
      return (
        <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
          Boa noite <strong className="text-[#15599a]">{clientName}</strong>,
          tudo bem ?
        </p>
      );
    }
  }
  function getReturnTimeString(years, months) {
    if (months == 0) {
      return `${years} anos`;
    } else {
      return `${years} anos e ${months} meses`;
    }
  }
  return (
    <div className={`bg-white flex flex-col grow font-['Raleway']`}>
      <FacebookPixel />
      <div className="w-full flex justify-center items-center self-stretch h-[82px] bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
        <div className="w-11 h-[46px]">
          <div className="w-11">
            <Image src={LogoSemTexto} />
          </div>
        </div>
      </div>
      <div className="px-4 py-12 w-full gap-6 flex flex-col justify-center items-center self-stretch">
        <div className="flex flex-col gap-4 w-full text-center leading-none relative">
          {getGreetings(props.nome)}
          <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
            Utilizamos dos dados que você nos passou na criação de uma
            estimativa de projeto para você.
          </p>
          {/* <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
            Ressaltamos que uma{" "}
            <strong className="text-[#15599a]">análise técnica</strong> é a
            melhor pedida na construção de{" "}
            <strong className="text-[#15599a]">
              um projeto perfeito para você
            </strong>{" "}
            e para suas necessidades. Então, venha conhecer um pouco mais sobre
            a Ampère Energias e moldar um projeto na sua medida, fale agora com
            nossos vendedores clicando no botão abaixo:
          </p> */}
          <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
            Venha conhecer mais sobre a Ampère Energias e criar um{" "}
            <strong className="text-[#15599a]">
              projeto perfeito pra você
            </strong>{" "}
            e <strong className="text-[#15599a]">personalizado</strong> para
            suas necessidades. Então, aproveite a fale agora com um dos nossos
            consultores clicando no botão abaixo:
          </p>
          <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-center text-white font-black">
            <a
              href={"https://linktr.ee/ampereenergias"}
              className="flex items-center hover:bg-green-600 hover:scale-110 duration-300 ease-in-out bg-green-500 font-bold cursor-pointer text-white p-2 px-4 rounded gap-2"
            >
              <FaWhatsapp style={{ fontSize: "25px" }} />
              <p>Falar com especialista</p>
            </a>
          </div>
          {/* <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
            <strong className="text-[#15599a] font-bold">
              {getGreetings(props.nome)}
            </strong>
            , fizemos uma simulação rápida, e nela constou que você precisará de{" "}
            <strong className="text-[#15599a] font-bold">
              {props.numModulos} placas de 550 Wp
            </strong>
            , totalizando uma geração mensal de{" "}
            <strong className="text-[#15599a] font-bold">
              {(props.potPico * 127).toFixed(2).replace(".", ",")} kWh.
            </strong>
          </p>
          <p className="text-xl inline m-0 leading-[1.2] text-gray-600">
            O investimento é de{" "}
            <strong className="text-[#15599a] font-bold">
              {props.valorInvestido
                ? `${props.valorInvestido.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}`
                : ""}
              !
            </strong>
          </p> */}
        </div>
        <div className="flex flex-col gap-4 w-full text-center leading-none relative">
          <p className="text-lg inline m-0 leading-[1.2] text-gray-600">
            De acordo com seu consumo, seria necessário uma geração mensal de{" "}
            <strong className="text-[#15599a] font-bold">
              {(props.potPico * 127).toFixed(2).replace(".", ",")} kWh,
            </strong>{" "}
            que pode ser alcançada com{" "}
            <strong className="text-[#15599a] font-bold">
              {props.numModulos} placas de 550 Wp
            </strong>
            .
          </p>
          <p className="text-lg inline m-0 leading-[1.2] text-gray-600">
            O investimento aproximado para esse projeto é de{" "}
            <strong className="text-[#15599a] font-bold">
              {props.valorInvestido
                ? `${props.valorInvestido.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}`
                : ""}
            </strong>
          </p>
        </div>
        <div className="px-4 py-12 w-full gap-6 flex flex-col justify-center items-center self-stretch bg-[rgba(13,53,92,1)] rounded-md">
          <div className="w-full text-center text-white">
            <div className="w-full leading-none relative">
              <p className="font-normal inline m-0 text-[23px] leading-[1.2]">
                <strong className="font-bold">Formas de pagamento</strong>
              </p>
            </div>
          </div>
          <div className="w-full gap-6 flex items-start self-stretch text-center text-white">
            <div className="flex-1 border-solid border-[0.5px] border-gray-100 flex justify-center items-center flex-grow rounded-lg p-3 h-[150px] lg:h-[120px] bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
              <div className="flex-1 h-full flex flex-col justify-between items-center flex-grow self-stretch">
                <div className="w-full h-full gap-3 flex flex-col justify-between items-center self-stretch">
                  <p className="w-full font-normal m-0 text-[15px] leading-[1.2]">
                    Você pode financiar seu sistema em até 60x de:
                  </p>
                  <p className="w-full font-black m-0 text-[23px] leading-[1.2]">
                    {props.parcelaFinanciamento
                      ? `${props.parcelaFinanciamento.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 border-solid border-[0.5px] border-gray-100 flex justify-between items-center flex-grow rounded-lg p-3 h-[150px] lg:h-[120px] bg-gradient-to-r from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
              <div className="flex-1 h-full flex flex-col justify-between items-center flex-grow self-stretch">
                <div className="w-full  h-full gap-3 flex flex-col justify-between items-center self-stretch">
                  <p className="w-full font-normal m-0 text-[15px] leading-[1.2]">
                    Você pode dividir seu sistema no cartão de crédito em até
                    12x de:
                  </p>
                  <p className="w-full font-black m-0 text-[23px] leading-[1.2]">
                    {props.parcelaCartao
                      ? `${props.parcelaCartao.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="w-full text-xs text-white text-center m-0 leading-[1.2] -mt-4">
            *Todos os valores apresentados nessa simulação são estimativas,
            podendo, desse modo, variar de acordo com condições externas. Para
            valores reais, consultar com especialistas.*
          </p>
          {/* <div className="w-full gap-4 text-left">
          <div className="flex-1 border-solid border flex justify-center items-center flex-grow rounded-lg p-4 drop-shadow-lg bg-gradient-to-tr from-[rgba(245,245,245,1)] to-[white] border-[rgba(174,_184,_204,_1.22)]">
            <div className="w-full leading-none relative flex flex-col items-center gap-4">
              <p className="font-black inline m-0 text-[19px] leading-[1.2] text-[rgba(21,89,154,1)]">
                Ou, você pode pagar seu sistema a vista com uma condição
                especial!
                <br />
              </p>
              <p className="font-normal inline m-0 text-[15px] leading-[1.2] text-[rgba(79,88,96,1)]">
                Caso esteja pensando em pagar seu sistema a vista, podemos
                chegar a uma negociação melhor para você.
              </p>
              <p className="font-normal inline m-0 text-[15px] leading-[1.2] text-[rgba(79,88,96,1)]">
                Para isso, fale gratuitamente com um de nossos especialistas
                clicando no botão abaixo!
              </p>
            </div>
          </div>
        </div>
        <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-center text-white font-black">
          <a
            href={"https://linktr.ee/ampereenergias"}
            className="flex items-center hover:bg-green-600 hover:scale-110 duration-300 ease-in-out bg-green-500 font-bold cursor-pointer text-white p-2 px-4 rounded gap-2"
          >
            <FaWhatsapp style={{ fontSize: "25px" }} />
            <p>Falar com especialista</p>
          </a>
        </div> */}
        </div>
        <div className="w-full gap-6 flex items-start justify-center self-stretch text-center text-white">
          <div className="flex-1 w-full lg:w-[400px] border-solid border flex justify-center items-center flex-grow rounded-lg p-3  h-[150px] lg:h-[120px] drop-shadow-lg bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] border-[rgba(174,_184,_204,_1.22)]">
            <div className="w-full flex flex-col justify-between items-center h-full">
              <p className=" font-normal m-0 text-[15px] leading-[1.2]">
                Com isso você irá economizar por ano:
              </p>
              <p className=" font-black m-0 text-[23px] leading-[1.2]">
                {props.economiaAnual
                  ? `${props.economiaAnual.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}`
                  : "-"}
              </p>
            </div>
          </div>
          <div className="flex-1 w-full lg:w-[400px] border-solid border flex justify-center items-center flex-grow rounded-lg p-3  h-[150px] lg:h-[120px] drop-shadow-lg bg-gradient-to-r from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] border-[rgba(174,_184,_204,_1.22)]">
            <div className="w-full flex flex-col justify-between items-center h-full">
              <p className="font-normal m-0 text-[15px] leading-[1.2]">
                E terá o retorno sobre seu investimento em:
              </p>
              <p className="font-black m-0 text-[23px] leading-[1.2]">
                {getReturnTimeString(
                  props.anosCompletosPayback,
                  props.mesesCompletosPayback
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full gap-4 text-left">
          <div className="flex-1 border-solid border flex justify-center items-center flex-grow rounded-lg p-4 drop-shadow-lg bg-gradient-to-tr from-[rgba(245,245,245,1)] to-[white] border-[rgba(174,_184,_204,_1.22)]">
            <div className="flex-1">
              <div className="w-full gap-3">
                <div className="flex flex-col gap-5 w-full leading-none relative items-start  lg:items-center">
                  <p className="font-black inline m-0 text-[19px] leading-[1.2] text-[rgba(21,89,154,1)]">
                    Mas não é só isso...
                  </p>
                  <p className="font-normal inline m-0 text-[15px] leading-[1.2] text-[rgba(79,88,96,1)]">
                    Ter um{" "}
                    <strong className="text-[#15599a] font-bold">
                      Sistema Ampère
                    </strong>{" "}
                    em sua casa não é apenas uma escolha econômica e
                    ambientalmente consciente, mas também um símbolo de{" "}
                    <strong className="text-[#15599a] font-bold">
                      status na sociedade.
                    </strong>
                  </p>
                  <p className="font-normal inline m-0 text-[15px] leading-[1.2] text-[rgba(79,88,96,1)]">
                    Ao optar por nossa empresa, você está escolhendo a qualidade
                    e a segurança que só uma marca forte, que oferece{" "}
                    <strong className="text-[#15599a] font-bold">
                      5 anos de garantia
                    </strong>{" "}
                    da instalação e possui{" "}
                    <strong className="text-[#15599a] font-bold">
                      mais de 1.500 clientes
                    </strong>{" "}
                    no portfólio como a nossa, pode oferecer.
                  </p>
                  <p className="font-normal inline m-0 text-[15px] leading-[1.2] text-[rgba(79,88,96,1)]">
                    Aqui seu projeto passa por{" "}
                    <strong className="text-[#15599a] font-bold">
                      mais de 10 engenheiros
                    </strong>{" "}
                    antes de chegar até você, desde o atendimento até o suporte
                    técnico após a instalação!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="w-full text-xl text-gray-600 text-center m-0 leading-[1.2]">
          <strong className="text-[#fead61]">{props.nome}</strong>, aguardamos
          seu contato!
        </p>
      </div>
      <div className="flex justify-center gap-3 px-10 w-full h-[100px] bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)]">
        <div className="flex flex-col justify-center items-center w-[80px]">
          <Image src={Logo} />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="w-full leading-none relative">
            <p className="font-normal text-white inline m-0 text-[15px] leading-[1.2]">
              A energia que move o mundo
            </p>
            <p className="text-xs font-normal text-white inline m-0 leading-[1.2]">
              {" "}
            </p>
            <p className="font-black inline m-0 text-[15px] leading-[1.2] text-[rgba(254,173,65,1)]">
              vem de você
            </p>
            <p className="text-xs font-normal text-white inline m-0 leading-[1.2]">
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("leads");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });

  function getInstallmentsValue(financedValue, rate, monthNumber) {
    let numerator = financedValue * rate;
    let denominator = 1 - Math.pow(1 + rate, -monthNumber);
    return Number((numerator / denominator).toFixed(2));
  }

  let info = JSON.parse(JSON.stringify(os));
  let nome = info.nome;
  let consumo = info.consumo;
  let energiaNecessaria = Number((consumo / 0.75).toFixed(2)); // onde 0.75 é o valor em R$ do kWh
  let numModulos = Math.ceil((energiaNecessaria * 1000) / (127 * 550)); // onde 127 é a média do fator de geração da região
  let potPico = (numModulos * 550) / 1000;
  let economiaAnual = Number((potPico * 127 * 12 * 0.75).toFixed(2));
  let valorInvestido = potPico * 3600; // onde 4500 é o valor em R$ do kWp
  let anosCompletosPayback = (
    (valorInvestido - (valorInvestido % economiaAnual)) /
    economiaAnual
  ).toFixed(0);
  let mesesCompletosPayback = Math.ceil(
    ((valorInvestido % economiaAnual) / economiaAnual) * 12
  );
  console.log(anosCompletosPayback, mesesCompletosPayback);
  if (mesesCompletosPayback == 12) {
    anosCompletosPayback = Number(anosCompletosPayback) + 1;
    console.log(Number(anosCompletosPayback));
    mesesCompletosPayback = 0;
  }
  let parcelaFinanciamento = getInstallmentsValue(valorInvestido, 0.02, 60);

  // Fórmula das prestações fixas: https://www3.bcb.gov.br/CALCIDADAO/publico/exibirMetodologiaFinanciamentoPrestacoesFixas.do?method=exibirMetodologiaFinanciamentoPrestacoesFixas

  let parcelaCartao = Number(((valorInvestido * 1.15) / 12).toFixed(2));
  // Pass data to the page via props
  return {
    props: {
      nome,
      consumo,
      energiaNecessaria,
      numModulos,
      potPico,
      economiaAnual,
      valorInvestido,
      anosCompletosPayback,
      mesesCompletosPayback,
      parcelaFinanciamento,
      parcelaCartao,
    },
  };
}
