import React from "react";
import Image from "next/image";
import Logo from "../utils/whitelogoHD.png";
import Assinatura from "../utils/assinatura.jpg";
import dayjs from "dayjs";
function LaudoFormularioVisitaRural({ info }) {
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">
            CADASTRO
          </h1>
          <div className="flex">
            <div className="grid grid-rows-6 w-[60%]">
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  CLIENTE
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.nomeDoCliente}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  REPRESENTANTE
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.nomeVendedor}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  ENDEREÇO
                </div>
                <div
                  className={`flex justify-center items-center ${
                    info.logradouro.length > 37 ? "text-xxs" : "text-xs"
                  } border-r border-black`}
                >
                  {info.logradouro}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  BAIRRO
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.bairro}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  DATA DA VISITA
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {dayjs().format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TIPO DE SOLICITAÇÃO
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.tipoDeSolicitacao}
                </div>
              </div>
            </div>
            <div className="grid grid-rows-6 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TELEFONE
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.telefoneDoCliente}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  Nº DE PROJETO
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.codigoSVB}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  NÚMERO
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.numeroResidencia}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  MUNICÍPIO
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.cidade}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  PRAZO LAUDO
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {/\(([^)]+)\)/.exec(info.tipoDeLaudo)[1]}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-black h-[40px]">
                <div className="flex justify-center items-center bg-[#fead61] text-white font-bold text-xs border-r border-black">
                  TIPO DE LAUDO
                </div>
                <div className="flex justify-center items-center text-xs border-r border-black">
                  {info.tipoDeLaudo.split("(")[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
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
          <div className="flex mt-1 border border-black">
            <h1 className="w-[20%] border-r border-black text-xs font-bold text-center">
              OBSERVAÇÕES SOBRE A VISITA
            </h1>
            <div className="w-[80%] h-full"></div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">
            PADRÃO
          </h1>
          <div className="flex w-full border border-black border-t-0">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black font-bold p-1">
              RAMAL DE ENTRADA
            </h1>
            <div className="grid grid-cols-9 w-[80%]">
              <h1 className="text-center text-xs col-span-2 border-r border-black p-1">
                SUBTERRÂNEO
              </h1>
              <h1 className="text-center text-xs col-span-1 border-r border-black p-1">
                AÉREO
              </h1>
              <h1 className="text-center text-xs bg-gray-200 col-span-3 border-r border-black p-1 font-bold">
                INFORMAÇÕES DE SAÍDA
              </h1>
              <h1 className="text-center text-xs col-span-2 border-r border-black p-1">
                SUBTERRÂNEO
              </h1>
              <h1 className="text-center text-xs col-span-1 p-1">AÉREO</h1>
            </div>
          </div>
          <div className="flex w-full border border-black">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black font-bold p-1">
              AMPERAGEM
            </h1>
            <div className="grid grid-cols-9 w-[80%]">
              <h1 className="text-end text-xs col-span-3 border-r border-black p-1">
                {"                 "}AMPÈRES
              </h1>
              <h1 className="text-center text-xs bg-gray-200 col-span-3 border-r border-black p-1 font-bold">
                TIPO DO DISJUNTOR
              </h1>
              <div className="flex items-center col-span-3">
                <h1 className="text-end text-xs border-r border-black p-1">
                  MONOFÁSICO
                </h1>
                <h1 className="text-end text-xs border-r border-black p-1">
                  BIFÁSICO
                </h1>
                <h1 className="text-end text-xs border-black p-1">TRIFÁSICO</h1>
              </div>
            </div>
          </div>
          <div className="flex w-full border border-black border-t-0">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black font-bold p-1">
              Nº DO MEDIDOR
            </h1>
            <div className="grid grid-cols-9 w-[80%]">
              <h1 className="text-end text-xs col-span-3 border-r border-black p-1"></h1>
              <h1 className="text-center text-xs bg-gray-200 col-span-3 border-r border-black p-1 font-bold">
                MODELO DA CAIXA
              </h1>
              <h1 className="text-end text-xs border-black p-1">CM-</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">
            OBRAS
          </h1>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border-x border-t border-black">
            ESTRUTURA DE MONTAGEM
          </h1>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-r-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">
                TELHA RESERVA
              </h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">
                  SIM
                </h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border border-black">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">
                TIPO DA ESTRUTURA
              </h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">
                  FERRO
                </h1>
                <h1 className="text-center text-xs">MADEIRA</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0 border-r-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">
                QTDE DE TELHAS RESERVAS
              </h1>
              <div className=" w-[40%]"></div>
            </div>
            <div className="flex border border-black border-t-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">
                ORIENTAÇÃO DO TELHADO
              </h1>
              <div className="w-[40%]"></div>
            </div>
          </div>
          <div className="flex border border-black border-t-0">
            <div className="w-[30%] flex items-center justify-center text-center text-xs border-r border-black bg-gray-200 font-bold">
              TIPO DA TELHA
            </div>
            <div className="grid grid-rows-2 grid-cols-7 w-[70%]">
              <h1 className="text-center text-xs border-r border-b border-black">
                AMERICANA
              </h1>
              <h1 className="text-center text-xs border-r border-b border-black">
                ETHERNIT
              </h1>
              <h1 className="text-center text-xs border-r border-b border-black">
                CIMENTO
              </h1>
              <h1 className="text-center text-xs border-r border-b border-black">
                PORTUGUESA
              </h1>
              <h1 className="text-center text-xs border-r border-b border-black">
                ROMANA
              </h1>
              <h1 className="text-center text-xs border-r border-b border-black">
                CAPA+BICA
              </h1>
              <h1 className="text-center text-xs border-b border-black">
                ZINCO
              </h1>
              <h1 className="text-center text-xs border-r border-black">
                SANDUÍCHE
              </h1>
              <h1 className="text-center text-xs border-r border-black">
                FRANCESA
              </h1>
              <h1 className="text-center text-xs border-r border-black">
                PINTADA
              </h1>
              <h1 className="text-center text-xs border-r border-black">
                ESPECIAL
              </h1>
              <h1 className="text-center text-xs border-r border-black">
                VER FOTO
              </h1>
              <h1 className="text-center text-xs border-r border-black">N/A</h1>
              <h1 className="text-center text-xs">AMERICANA</h1>
            </div>
          </div>
          <div className="flex border border-black border-t-0">
            <h1 className="w-[30%] flex items-center justify-center text-center text-xs border-r border-black bg-gray-200 font-bold">
              TIPO DE EDIFICAÇÃO
            </h1>
            <div className="w-[70%] grid grid-cols-11">
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">
                COLONIAL
              </div>
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">
                BARRACÃO
              </div>
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">
                CAIXOTE
              </div>
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">
                SOLO
              </div>
              <div className="text-center flex items-center justify-center text-xs col-span-3">
                BARRACÃO A SER CONSTRUÍDO
              </div>
            </div>
          </div>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border-x border-black">
            INFRAESTRUTURA ELÉTRICA
          </h1>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0 border-r-0">
              <div className="w-[60%] text-center flex items-center justify-center bg-gray-200 text-xs border-r border-black font-bold">
                ADAPTAÇÃO NO QGBT
              </div>
              <div className="grid grid-cols-3 w-[40%]">
                <div className="text-center flex items-center justify-center text-xs border-r border-black">
                  TRILHO
                </div>
                <div className="text-center flex items-center justify-center text-xs border-r border-black">
                  CORTE
                </div>
                <div className="text-center flex items-center justify-center text-xs">
                  NÃO
                </div>
              </div>
            </div>
            <div className="flex border border-black border-t-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">
                PARADE DE FIXAÇÃO DOS EQUIPAMENTOS
              </h1>
              <div className="grid grid-cols-2 w-[40%]">
                <div className="text-center flex items-center justify-center text-xs border-r border-black">
                  ALVENARIA
                </div>
                <div className="text-center flex items-center justify-center text-xs">
                  OUTRO
                </div>
              </div>
            </div>
          </div>
          <div className="flex border border-black border-t-0">
            <h1 className="w-[30%] text-center text-xs bg-gray-200 border-r border-black font-bold">
              LOCAL DE INSTALAÇÃO DOS EQUIPAMENTOS
            </h1>
            <div className="w-[70%]"></div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0 border-r-0">
              <h1 className="w-[60%] text-center text-xs bg-gray-200 font-bold border-r border-black">
                DISTÂNCIA DO SISTEMA AO QGBT
              </h1>
              <h1 className="w-[40%] text-end text-xs pr-2">METROS</h1>
            </div>
            <div className="flex border border-black border-t-0">
              <h1 className="w-[60%] text-center text-xs bg-gray-200 font-bold border-r border-black">
                DISTÂNCIA DO ROTEADOR AO INVERSOR
              </h1>
              <h1 className="w-[40%] text-end text-xs pr-2">METROS</h1>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0">
              <h1 className="text-center font-bold bg-gray-200 w-[60%] text-xs border-r border-black">
                CASA DE MÁQUINAS
              </h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">
                  SIM
                </h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border-black border border-l-0 border-t-0">
              <h1 className="text-center font-bold bg-gray-200 w-[60%] text-xs border-r border-black">
                REDE PARA INTERLIGAR FAZENDA
              </h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">
                  SIM
                </h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0">
              <h1 className="text-center font-bold bg-gray-200 w-[60%] text-xs border-r border-black">
                INSTALAÇÃO INTERNET
              </h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">
                  SIM
                </h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border-black border border-l-0 border-t-0">
              <h1 className="text-center font-bold bg-gray-200 w-[60%] text-xs border-r border-black">
                CONSTRUÇÃO DE BARRACÃO
              </h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">
                  SIM
                </h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
          </div>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border-x border-black border-t-0">
            OBSERVAÇÕES
          </h1>
          <div className="border border-black border-t-0 h-[200px]"></div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-black">
            CHECKLIST DE FOTOS E LOCALIZAÇÕES
          </h1>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border border-black border-t-0 border-b-0">
            PADRÃO
          </h1>
          <div className="grid grid-cols-3 grid-rows-2 border border-black border-b-0">
            <div className="flex border-b border-black">
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[20%] border-r border-black">
                1
              </div>
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[60%] border-r border-black">
                FOTO DO PADRÃO DE ENTRADA
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                2
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DO DISJUNTOR
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                3
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DO RAMAL DE ENTRADA
              </div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                4
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                LOCALIZAÇÃO DO PADRÃO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                5
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO GERAL DO PADRÃO ATÉ A RESIDÊNCIA
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                6
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DO MEDIDOR
              </div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
          </div>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border border-black border-t-0">
            TRANSFORMADOR
          </h1>
          <div className="grid grid-cols-3">
            <div className="flex border-b border-black">
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[20%] border-r border-black">
                1
              </div>
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[60%] border-r border-black">
                LOCALIZAÇÃO TRAFO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                2
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                Nº DO TRANSFORMADOR
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                3
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DO TRANSFORMADOR
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
          </div>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border border-black border-t-0 border-b-0">
            MONTAGEM
          </h1>
          <div className="grid grid-cols-3 grid-rows-3 border border-black">
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center w-[20%] border-r border-black">
                1
              </div>
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[60%] border-r border-black">
                FOTO DO TELHADO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                2
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DO LOCAL DE MONTAGEM(SOLO)
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                3
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FILMAGEM GERAL
              </div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                4
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DA FACHADA
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                5
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                LOCALIZAÇÃO DA RESIDÊNCIA
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                6
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                LOCALIZAÇÃO DAS PLACAS(SOLO)
              </div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                7
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO LOCAL DO INVERSOR
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                8
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTOS GERAIS
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black border-r-0">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">
                9
              </div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTOS DA ESTRUTURA TELHADO
              </div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
          </div>
          <h1 className="bg-[#15599a] text-white text-xs text-center font-bold border border-black border-t-0">
            GOIÁS
          </h1>
          <div className="grid grid-cols-3 grid-rows-2">
            <div className="flex border-b border-black">
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[80%] border-r border-black">
                Nº POSTE DE DERIVAÇÃO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[80%] border-r border-black">
                LOCAL DE ATERRAMENTO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[80%] border-r border-black">
                POTÊNCIA DO TRANSFORMADOR
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[80%] border-r border-black">
                LOCALIZAÇÃO POSTE DERIVAÇÃO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[80%] border-r border-black">
                CHAVE FUSÍVEL
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[80%] border-r border-black">
                NºPOSTE DO TRANSFORMADOR
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="text-[#15599a] text-sm text-center font-bold border border-black">
            DESENHO TÉCNICO
          </h1>
          <h1 className="bg-[#15599a] text-white text-xs text-center font-bold border border-black border-t-0">
            OBSERVAÇÕES
          </h1>
          <div className="h-[500px] border border-t-0 border-black mb-2"></div>
        </div>
      </div>
    </div>
  );
}

export default LaudoFormularioVisitaRural;
