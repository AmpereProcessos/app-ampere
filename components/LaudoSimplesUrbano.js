import React from "react";
import Image from "next/image";
import Logo from "../utils/whitelogoHD.png";
import Assinatura from "../utils/assinatura.jpg";
import dayjs from "dayjs";
function LaudoSimplesUrbano({ info }) {
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-around items-center border border-t-0 border-black py-2 mt-2">
          <h1 className="font-bold uppercase text-[#15599a]">
            LAUDO COMERCIAL - URBANO
          </h1>
          <div className="w-[47px] h-[47px]">
            <Image style={{ width: "47px", height: "47px" }} src={Logo} />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">
            CADASTRO
          </h1>
          <div className="flex">
            <div className="grid grid-rows-6 w-[60%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  CLIENTE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.nomeDoCliente}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  REPRESENTANTE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.nomeVendedor}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  ENDEREÇO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.logradouro}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  BAIRRO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.bairro}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  DATA DA VISITA
                </p>
                <p className="text-center text-xs border-r border-black">
                  {dayjs().format("DD/MM/YYYY")}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TIPO DE SOLICITAÇÃO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.tipoDeSolicitacao}
                </p>
              </div>
            </div>
            <div className="grid grid-rows-6 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TELEFONE
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.telefoneDoCliente}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  Nº DE PROJETO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.codigoSVB}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  NÚMERO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.numeroResidencia}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  MUNICÍPIO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.cidade}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  PRAZO LAUDO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {/\(([^)]+)\)/.exec(info.tipoDeLaudo)[1]}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TIPO DE LAUDO
                </p>
                <p className="text-center text-xs border-r border-black">
                  {info.tipoDeLaudo.split("(")[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold">
            ESTRUTURA FOTOVOLTAICA
          </h1>
          <div className="flex">
            <div className="w-[20%] h-full flex justify-center items-center bg-[#15599a] text-center text-white font-bold">
              DESCRIÇÃO DO SISTEMA FOTOVOLTAICO
            </div>
            <div className="w-[80%] flex flex-col">
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                INVERSORES
              </h1>
              <div className="flex border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      TOPOLOGIA
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.tipoInversor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.qtdeInversor}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      MARCA DO INVERSOR
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.marcaInversor}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      POTÊNCIA
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.potInversor}
                    </p>
                  </div>
                </div>
              </div>
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      QUANTIDADE
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.qtdeModulos}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold">
                      POTÊNCIA
                    </p>
                    <p className="text-center text-xs font-bold">
                      {info.potModulos}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-xs font-bold w-[50%]">
                  MARCA DOS MÓDULOS
                </p>
                <p className="text-center text-xs font-bold w-[50%]">
                  {info.marcaModulos}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-black">
            CUSTOS ADICIONAIS
          </h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-10 border-b border-black">
              <p className="text-center text-xs font-bold col-span-3 border-r border-black">
                DESCRIÇÃO
              </p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                QUANTIDADE
              </p>
              <p className="text-center text-xs font-bold col-span-1 border-r border-black">
                GRANDEZA
              </p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                VALOR
              </p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                TOTAL
              </p>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-10 border-b border-black">
                <p className="text-center text-xs font-bold col-span-3 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-1 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  R$ -
                </p>
              </div>
              <div className="grid grid-cols-10 border-b border-black">
                <p className="text-center text-xs font-bold col-span-3 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-1 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  R$ -
                </p>
              </div>
              <div className="grid grid-cols-10 border-b border-black">
                <p className="text-center text-xs font-bold col-span-3 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-1 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  -
                </p>
                <p className="text-center text-xs font-bold col-span-2 border-r border-black">
                  R$ -
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-10">
            <div className="bg-[#15599a] text-white font-bold flex justify-center items-center text-center col-span-3 border border-black border-t-0 border-l-0">
              VALOR PARA AJUSTE NA PROPOSTA COMERCIAL
            </div>
            <div className="flex flex-col col-span-7 h-full">
              <div className="flex border-b border-black">
                <div className="w-[75%] bg-[#fead61] text-white text-center p-1 font-bold border-r border-black">
                  VALOR À VISTA
                </div>
                <div className="w-[25%] bg-[#fead61] text-white text-center p-1 font-bold border-r border-black">
                  R$ -
                </div>
              </div>
              <div className="flex border-b border-black">
                <div className="w-[75%] bg-[#15599a] text-white text-center p-1 font-bold border-r border-black">
                  VALOR FINANCIAMENTO
                </div>
                <div className="w-[25%] bg-[#15599a] text-white text-center p-1 font-bold border-r border-black">
                  R$ -
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold">
            RESPOSTA VISITA TÉCNICA
          </h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-2">
              <div className="grid grid-rows-3">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">
                    PADRÃO
                  </p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    -
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">
                    ESPAÇO PARA PROJETO
                  </p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    -
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">
                    ESTRUTURA DE INCLINAÇÃO
                  </p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    -
                  </p>
                </div>
              </div>
              <div className="grid grid-rows-3">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">
                    POSSUI SOMBRA?
                  </p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    -
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">
                    MADEIRAMENTO
                  </p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    -
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">
                    EXPLICAÇÃO DETALHADA
                  </p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="bg-[#15599a] text-white text-center font-bold border border-black border-t-0">
            CONCLUSÃO
          </h1>
          <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[60px] text-center p-2">
            Laboris et minim quis et nisi ea est reprehenderit elit. Eu duis
            velit consequat cillum qui eiusmod id sunt. Proident laboris
            exercitation labore est culpa incididunt tempor commodo nisi esse
            irure. Aute qui incididunt incididunt proident magna.
          </div>
        </div>
        <div className="mt-2 grid gap-x-4 grid-cols-2">
          <div className="flex flex-col">
            <p className="text-xxs text-start ml-2">Autorizado por:</p>
            <div className="w-full flex justify-center items-center">
              <div className="w-[97px] flex justify-center  items-center text-center">
                <Image src={Assinatura} />
              </div>
            </div>

            <hr className="border-t-2 border-black" />
            <p className="text-xxs text-center">
              ASSINATURA DIRETOR DE ENGENHARIA
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xxs text-start ml-2">Realizado por:</p>
            <hr className="mt-8 border-t-2 border-black" />
            <p className="text-xxs text-center">
              ASSINATURA TÉCNICO RESPONSÁVEL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaudoSimplesUrbano;
