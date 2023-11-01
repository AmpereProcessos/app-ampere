import React from 'react'
import Image from 'next/image'
import Logo from '../utils//images/logo-texto-azul-vertical.png'
import Assinatura from '../utils/images/signature-diogo.jpg'
import dayjs from 'dayjs'
import { GeneralTechnicalAnalysisSchema } from '../utils/schemas/technical-analysis'
function LaudoFormularioVisitaUrbano({ analysis }) {
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">INFORMAÇÕES DO CLIENTE</h1>
          <div className="flex">
            <div className="grid grid-rows-5 w-[60%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">CLIENTE</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.nome}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">REPRESENTANTE</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.requerente.apelido || analysis.requerente.nomeCRM}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">ENDEREÇO</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.localizacao.endereco}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">BAIRRO</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.localizacao.bairro}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">DATA DA VISITA</p>
                <p className="text-center text-xs border-r p-1 border-black">{dayjs().format('DD/MM/YYYY')}</p>
              </div>
            </div>
            <div className="grid grid-rows-5 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">TELEFONE</p>
                <p className="text-center text-xs border-r p-1 border-black">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">Nº DE PROJETO</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.projeto.identificador || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">NÚMERO</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.localizacao.numeroOuIdentificador}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">MUNICÍPIO</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.localizacao.cidade}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center bg-[#fead61] text-white font-bold text-xs border-r p-1 border-black">TIPO DE SOLICITAÇÃO</p>
                <p className="text-center text-xs border-r p-1 border-black">{analysis.tipoSolicitacao}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold">EQUIPAMENTOS</h1>
          <div className="flex">
            <div className="w-[20%] h-full flex justify-center items-center bg-[#15599a] text-center text-white font-bold">
              DESCRIÇÃO DO SISTEMA FOTOVOLTAICO
            </div>
            <div className="w-[80%] flex flex-col">
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">INVERSORES</h1>
              <div className="flex border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">TOPOLOGIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.detalhes.topologia}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">QUANTIDADE</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">MARCA DO INVERSOR</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.modelo}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">POTÊNCIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.potencia}</p>
                  </div>
                </div>
              </div>
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">QUANTIDADE</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.modulos.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xs font-bold p-1">POTÊNCIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.modulos.potencia}</p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-xs font-bold p-1 w-[50%]">MARCA DOS MÓDULOS</p>
                <p className="text-center text-[0.6rem] font-bold p-1 w-[50%]">{analysis.equipamentos.modulos.modelo}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">PADRÃO</h1>
          <div className="flex w-full border border-black">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black p-1 font-bold">PADRÃO ESTÁ</h1>
            <div className="grid grid-cols-2 w-[80%]">
              <h1 className="text-center text-xs border-r border-black p-1">CONTRA A REDE</h1>
              <h1 className="text-center text-xs p-1">A FAVOR DA REDE</h1>
            </div>
          </div>
          <div className="flex w-full border border-black border-t-0">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black font-bold p-1">RAMAL DE ENTRADA</h1>
            <div className="grid grid-cols-9 w-[80%]">
              <h1 className="text-center text-xs col-span-2 border-r border-black p-1">SUBTERRÂNEO</h1>
              <h1 className="text-center text-xs col-span-1 border-r border-black p-1">AÉREO</h1>
              <h1 className="text-center text-xs bg-gray-200 col-span-3 border-r border-black p-1 font-bold">INFORMAÇÕES DE SAÍDA</h1>
              <h1 className="text-center text-xs col-span-2 border-r border-black p-1">SUBTERRÂNEO</h1>
              <h1 className="text-center text-xs col-span-1 p-1">AÉREO</h1>
            </div>
          </div>
          <div className="flex w-full border border-black border-t-0">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black font-bold p-1">BITOLA SAÍDA DOS CABOS E TUBO</h1>
            <div className="grid grid-cols-9 w-[80%]">
              <h1 className="text-end text-xs col-span-3 border-r border-black p-1">{'                 '}MM²</h1>
              <h1 className="text-center text-xs bg-gray-200 col-span-3 border-r border-black p-1 font-bold">ALTURA DO MURO</h1>
              <h1 className="text-end text-xs col-span-3 p-1">{'                 '}METROS</h1>
            </div>
          </div>
          <h1 className="bg-[#15599a] text-white text-xs text-center font-bold border-x border-black">CAIXA ÚNICA</h1>
          <div className="flex w-full border border-black">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black font-bold p-1">AMPERAGEM</h1>
            <div className="grid grid-cols-9 w-[80%]">
              <h1 className="text-end text-xs col-span-3 border-r border-black p-1">{'                 '}AMPÈRES</h1>
              <h1 className="text-center text-xs bg-gray-200 col-span-3 border-r border-black p-1 font-bold">TIPO DO DISJUNTOR</h1>
              <div className="flex items-center col-span-3">
                <h1 className="text-end text-xs border-r border-black p-1">MONOFÁSICO</h1>
                <h1 className="text-end text-xs border-r border-black p-1">BIFÁSICO</h1>
                <h1 className="text-end text-xs border-black p-1">TRIFÁSICO</h1>
              </div>
            </div>
          </div>
          <div className="flex w-full border border-black border-t-0">
            <h1 className="text-center text-xs bg-gray-200 w-[20%] border-r border-black font-bold p-1">Nº DO MEDIDOR</h1>
            <div className="grid grid-cols-9 w-[80%]">
              <h1 className="text-end text-xs col-span-3 border-r border-black p-1"></h1>
              <h1 className="text-center text-xs bg-gray-200 col-span-3 border-r border-black p-1 font-bold">MODELO DA CAIXA</h1>
              <h1 className="text-end text-xs border-black p-1">CM-</h1>
            </div>
          </div>
          <h1 className="bg-[#15599a] text-white text-xs text-center font-bold border-x border-black">CAIXAS AGRUPADAS</h1>
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-10 border border-black">
              <div className="bg-gray-200 text-center col-span-1 text-xs font-bold flex items-center justify-center border-r border-black">
                NºCAIXA
              </div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black">
                AMPERAGEM
              </div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black">
                MONO/BI/TRI
              </div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black">
                NºMEDIDOR
              </div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black">
                MODELO CAIXA
              </div>
              <div className="bg-gray-200 text-center col-span-1 text-xs font-bold flex items-center justify-center">BITOLA DE SAÍDA</div>
            </div>
            <div className="grid grid-cols-10 border border-black border-t-0">
              <div className="text-center col-span-1 text-xs font-bold flex items-center justify-center border-r border-black">CAIXA 1</div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-start pl-3 border-r border-black">CM-</div>
              <div className="text-end col-span-1 text-xs font-bold flex items-end justify-end pr-1 w-full">MM²</div>
            </div>
            <div className="grid grid-cols-10 border border-black border-t-0">
              <div className="text-center col-span-1 text-xs font-bold flex items-center justify-center border-r border-black">CAIXA 2</div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-start pl-3 border-r border-black">CM-</div>
              <div className="text-end col-span-1 text-xs font-bold flex items-end justify-end pr-1 w-full">MM²</div>
            </div>
            <div className="grid grid-cols-10 border border-black border-t-0">
              <div className="text-center col-span-1 text-xs font-bold flex items-center justify-center border-r border-black">CAIXA 3</div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-start pl-3 border-r border-black">CM-</div>
              <div className="text-end col-span-1 text-xs font-bold flex items-end justify-end pr-1 w-full">MM²</div>
            </div>
            <div className="grid grid-cols-10 border border-black border-t-0">
              <div className="text-center col-span-1 text-xs font-bold flex items-center justify-center border-r border-black">CAIXA 4</div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-start pl-3 border-r border-black">CM-</div>
              <div className="text-end col-span-1 text-xs font-bold flex items-end justify-end pr-1 w-full">MM²</div>
            </div>
            <div className="grid grid-cols-10 border border-black border-t-0">
              <div className="text-center col-span-1 text-xs font-bold flex items-center justify-center border-r border-black">CAIXA 5</div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="text-center col-span-2 text-xs font-bold flex items-center justify-start pl-3 border-r border-black">CM-</div>
              <div className="text-end col-span-1 text-xs font-bold flex items-end justify-end pr-1 w-full">MM²</div>
            </div>
            <div className="grid grid-cols-10 border border-black border-t-0">
              <div className="bg-gray-200 text-center col-span-1 text-xs font-bold flex items-center justify-center border-r border-black">GERAL</div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="bg-gray-200 text-center col-span-2 text-xs font-bold flex items-center justify-center border-r border-black"></div>
              <div className="bg-gray-200 text-end col-span-1 text-xs font-bold flex items-center justify-center"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">OBRAS</h1>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border-x border-t border-black">ESTRUTURA DE MONTAGEM</h1>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-r-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">TELHA RESERVA</h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border border-black">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">TIPO DA ESTRUTURA</h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">FERRO</h1>
                <h1 className="text-center text-xs">MADEIRA</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0 border-r-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">QTDE DE TELHAS RESERVAS</h1>
              <div className=" w-[40%]"></div>
            </div>
            <div className="flex border border-black border-t-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">ORIENTAÇÃO DO TELHADO</h1>
              <div className="w-[40%]"></div>
            </div>
          </div>
          <div className="flex border border-black border-t-0">
            <div className="w-[30%] flex items-center justify-center text-center text-xs border-r border-black bg-gray-200 font-bold">
              TIPO DA TELHA
            </div>
            <div className="grid grid-rows-2 grid-cols-7 w-[70%]">
              <h1 className="text-center text-xs border-r border-b border-black">AMERICANA</h1>
              <h1 className="text-center text-xs border-r border-b border-black">ETHERNIT</h1>
              <h1 className="text-center text-xs border-r border-b border-black">CIMENTO</h1>
              <h1 className="text-center text-xs border-r border-b border-black">PORTUGUESA</h1>
              <h1 className="text-center text-xs border-r border-b border-black">ROMANA</h1>
              <h1 className="text-center text-xs border-r border-b border-black">CAPA+BICA</h1>
              <h1 className="text-center text-xs border-b border-black">ZINCO</h1>
              <h1 className="text-center text-xs border-r border-black">SANDUÍCHE</h1>
              <h1 className="text-center text-xs border-r border-black">FRANCESA</h1>
              <h1 className="text-center text-xs border-r border-black">PINTADA</h1>
              <h1 className="text-center text-xs border-r border-black">ESPECIAL</h1>
              <h1 className="text-center text-xs border-r border-black">VER FOTO</h1>
              <h1 className="text-center text-xs border-r border-black">N/A</h1>
              <h1 className="text-center text-xs">AMERICANA</h1>
            </div>
          </div>
          <div className="flex border border-black border-t-0">
            <h1 className="w-[30%] flex items-center justify-center text-center text-xs border-r border-black bg-gray-200 font-bold">
              TIPO DE EDIFICAÇÃO
            </h1>
            <div className="w-[70%] grid grid-cols-11">
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">COLONIAL</div>
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">BARRACÃO</div>
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">CAIXOTE</div>
              <div className="text-center flex items-center justify-center text-xs border-r border-black col-span-2">SOLO</div>
              <div className="text-center flex items-center justify-center text-xs col-span-3">BARRACÃO A SER CONSTRUÍDO</div>
            </div>
          </div>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border-x border-black">INFRAESTRUTURA ELÉTRICA</h1>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-r-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">ESPAÇO NO QGBT</h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border border-black">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">DPS NO QGBT</h1>
              <div className="grid grid-cols-2 w-[40%]">
                <h1 className="text-center text-xs border-r border-black">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0 border-r-0">
              <div className="w-[60%] text-center flex items-center justify-center bg-gray-200 text-xs border-r border-black font-bold">
                ADAPTAÇÃO NO QGBT
              </div>
              <div className="grid grid-cols-3 w-[40%]">
                <div className="text-center flex items-center justify-center text-xs border-r border-black">TRILHO</div>
                <div className="text-center flex items-center justify-center text-xs border-r border-black">CORTE</div>
                <div className="text-center flex items-center justify-center text-xs">NÃO</div>
              </div>
            </div>
            <div className="flex border border-black border-t-0">
              <h1 className="w-[60%] text-center bg-gray-200 text-xs border-r border-black font-bold">PARADE DE FIXAÇÃO DOS EQUIPAMENTOS</h1>
              <div className="grid grid-cols-2 w-[40%]">
                <div className="text-center flex items-center justify-center text-xs border-r border-black">ALVENARIA</div>
                <div className="text-center flex items-center justify-center text-xs">OUTRO</div>
              </div>
            </div>
          </div>
          <div className="flex border border-black border-t-0">
            <h1 className="w-[30%] text-center text-xs bg-gray-200 border-r border-black font-bold">LOCAL DE INSTALAÇÃO DOS EQUIPAMENTOS</h1>
            <div className="w-[70%]"></div>
          </div>
          <div className="flex border border-black border-t-0">
            <h1 className="w-[30%] text-center text-xs bg-gray-200 border-r border-black font-bold">INFRA P/ LANÇAMENTO DE CABOS</h1>
            <div className="w-[70%]">
              <h1 className="w-[29%] text-center text-xs border-r border-black">KIT NORMAL</h1>
              <div className="w-[70%]"></div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-black border-t-0 border-r-0">
              <h1 className="w-[60%] text-center text-xs bg-gray-200 font-bold border-r border-black">DISTÂNCIA DO SISTEMA AO QGBT</h1>
              <h1 className="w-[40%] text-end text-xs pr-2">METROS</h1>
            </div>
            <div className="flex border border-black border-t-0">
              <h1 className="w-[60%] text-center text-xs bg-gray-200 font-bold border-r border-black">DISTÂNCIA DO ROTEADOR AO INVERSOR</h1>
              <h1 className="w-[40%] text-end text-xs pr-2">METROS</h1>
            </div>
          </div>
          <h1 className="bg-[#fead61] text-white text-xs text-center font-bold border-x border-black border-t-0">OBSERVAÇÕES</h1>
          <div className="border border-black border-t-0 h-[200px]"></div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-black">CHECKLIST DE FOTOS E LOCALIZAÇÕES</h1>
          <div className="grid grid-cols-3 grid-rows-3 border border-black">
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center w-[20%] border-r border-black">1</div>
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[60%] border-r border-black">FOTO DA FACHADA</div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">2</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">FOTO DO PADRÃO</div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">3</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">FOTO DO DISJUNTOR</div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">4</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DO QUADRO(QDG)
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">5</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DO LOCAL DO EQUIPAMENTO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">6</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">FOTO DO TELHADO</div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">7</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                FOTO DA ESTRUTURA DO TELHADO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">8</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                LOCALIZAÇÃO DA RESIDÊNCIA
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black border-r-0">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[20%] border-r border-black">9</div>
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[60%] border-r border-black">
                LOCALIZAÇÃO DO TRANSFORMADOR
              </div>
              <div className="text-center text-xs w-[20%]"></div>
            </div>
          </div>
          <h1 className="bg-[#15599a] text-white text-xs text-center font-bold border border-black border-t-0">GOIÁS</h1>
          <div className="grid grid-cols-3">
            <div className="flex border-b border-black">
              <div className="text-center text-xs bg-gray-200 flex items-center justify-center w-[80%] border-r border-black">
                FOTO DO POSTE DE DERIVAÇÃO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[80%] border-r border-black">
                NÚMERO E LOCALIZAÇÃO DO POSTE
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="text-center bg-gray-200 flex items-center justify-center text-xs w-[80%] border-r border-black">
                FOTO DO LOCAL DE ATERRAMENTO
              </div>
              <div className="text-center text-xs w-[20%] border-r border-black"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="text-[#15599a] text-sm text-center font-bold border border-black">DESENHO TÉCNICO</h1>
          <h1 className="bg-[#15599a] text-white text-xs text-center font-bold border border-black border-t-0">OBSERVAÇÕES</h1>
          <div className="h-[100px] border border-t-0 border-black mb-2"></div>
        </div>
      </div>
    </div>
  )
}

export default LaudoFormularioVisitaUrbano
