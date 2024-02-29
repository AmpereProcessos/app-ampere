import React from 'react'
import Image from 'next/image'
import Logo from '../utils//images/logo-texto-azul-vertical.png'
import Assinatura from '../utils/images/signature-diogo.jpg'
import dayjs from 'dayjs'
function LaudoFormularioVisitaRural({ analysis }) {
  return (
    <div className="h-[29.7cm] w-[21cm]">
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-col">
          <h1 className="border-x border-black bg-[#15599a] text-center text-sm font-bold text-white">INFORMAÇÕES DO CLIENTE</h1>
          <div className="flex">
            <div className="grid w-[60%] grid-rows-5">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">CLIENTE</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.nome}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">REPRESENTANTE</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.requerente.apelido || analysis.requerente.nomeCRM}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">ENDEREÇO</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.endereco}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">BAIRRO</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.bairro}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">DATA DA VISITA</p>
                <p className="border-r border-black p-1 text-center text-xs">{dayjs().format('DD/MM/YYYY')}</p>
              </div>
            </div>
            <div className="grid w-[40%] grid-rows-5">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">TELEFONE</p>
                <p className="border-r border-black p-1 text-center text-xs">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">Nº DE PROJETO</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.projeto.identificador || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">NÚMERO</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.numeroOuIdentificador}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">MUNICÍPIO</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.localizacao.cidade}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="border-r border-black bg-[#fead61] p-1 text-center text-xs font-bold text-white">TIPO DE SOLICITAÇÃO</p>
                <p className="border-r border-black p-1 text-center text-xs">{analysis.tipoSolicitacao}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <h1 className="bg-[#15599a] text-center text-sm font-bold text-white">ESTRUTURA FOTOVOLTAICA</h1>
          <div className="flex">
            <div className="flex h-full w-[20%] items-center justify-center bg-[#15599a] text-center font-bold text-white">
              DESCRIÇÃO DO SISTEMA FOTOVOLTAICO
            </div>
            <div className="flex w-[80%] flex-col">
              <h1 className="border border-b-0 border-black  bg-[#fead61] text-center font-raleway  text-sm font-bold text-white">INVERSORES</h1>
              <div className="flex border border-b-0 border-black">
                <div className="flex w-[50%] flex-col">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 p-1 text-center text-xs font-bold">TOPOLOGIA</p>
                    <p className="p-1 text-center text-[0.6rem] font-bold">{analysis.detalhes.topologia}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 p-1 text-center text-xs font-bold">QUANTIDADE</p>
                    <p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.inversor.qtde}</p>
                  </div>
                </div>
                <div className="flex w-[50%] flex-col">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 p-1 text-center text-xs font-bold">MARCA DO INVERSOR</p>
                    <p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.inversor.modelo}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 p-1 text-center text-xs font-bold">POTÊNCIA</p>
                    <p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.inversor.potencia}</p>
                  </div>
                </div>
              </div>
              <h1 className="border border-b-0 border-black  bg-[#fead61] text-center font-raleway  text-sm font-bold text-white">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-b-0 border-black">
                <div className="flex w-[50%] flex-col">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 p-1 text-center text-xs font-bold">QUANTIDADE</p>
                    <p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.modulos.qtde}</p>
                  </div>
                </div>
                <div className="flex w-[50%] flex-col">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 p-1 text-center text-xs font-bold">POTÊNCIA</p>
                    <p className="p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.modulos.potencia}</p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="w-[50%] bg-gray-200 p-1 text-center text-xs font-bold">MARCA DOS MÓDULOS</p>
                <p className="w-[50%] p-1 text-center text-[0.6rem] font-bold">{analysis.equipamentos.modulos.modelo}</p>
              </div>
            </div>
          </div>
          <div className="mt-1 flex border border-black">
            <h1 className="w-[20%] border-r border-black text-center text-xs font-bold">OBSERVAÇÕES SOBRE A VISITA</h1>
            <div className="h-full w-[80%]"></div>
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <h1 className="border-x border-black bg-[#15599a] text-center text-sm font-bold text-white">PADRÃO</h1>
          <div className="flex w-full border border-t-0 border-black">
            <h1 className="w-[20%] border-r border-black bg-gray-200 p-1 text-center text-xs font-bold">RAMAL DE ENTRADA</h1>
            <div className="grid w-[80%] grid-cols-9">
              <h1 className="col-span-2 border-r border-black p-1 text-center text-xs">SUBTERRÂNEO</h1>
              <h1 className="col-span-1 border-r border-black p-1 text-center text-xs">AÉREO</h1>
              <h1 className="col-span-3 border-r border-black bg-gray-200 p-1 text-center text-xs font-bold">INFORMAÇÕES DE SAÍDA</h1>
              <h1 className="col-span-2 border-r border-black p-1 text-center text-xs">SUBTERRÂNEO</h1>
              <h1 className="col-span-1 p-1 text-center text-xs">AÉREO</h1>
            </div>
          </div>
          <div className="flex w-full border border-t-0 border-black">
            <h1 className="w-[20%] border-r border-black bg-gray-200 p-1 text-center text-xs font-bold">AMPERAGEM</h1>
            <div className="grid w-[80%] grid-cols-9">
              <h1 className="col-span-3 border-r border-black p-1 text-end text-xs">{'                 '}AMPÈRES</h1>
              <h1 className="col-span-3 border-r border-black bg-gray-200 p-1 text-center text-xs font-bold">TIPO DO DISJUNTOR</h1>
              <div className="col-span-3 flex items-center">
                <h1 className="border-r border-black p-1 text-end text-xs">MONOFÁSICO</h1>
                <h1 className="border-r border-black p-1 text-end text-xs">BIFÁSICO</h1>
                <h1 className="border-black p-1 text-end text-xs">TRIFÁSICO</h1>
              </div>
            </div>
          </div>
          <div className="flex w-full border border-t-0 border-black">
            <h1 className="w-[20%] border-r border-black bg-gray-200 p-1 text-center text-xs font-bold">Nº DO MEDIDOR</h1>
            <div className="grid w-[80%] grid-cols-9">
              <h1 className="col-span-3 border-r border-black p-1 text-end text-xs"></h1>
              <h1 className="col-span-3 border-r border-black bg-gray-200 p-1 text-center text-xs font-bold">MODELO DA CAIXA</h1>
              <h1 className="border-black p-1 text-end text-xs">CM-</h1>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <h1 className="border-x border-black bg-[#15599a] text-center text-sm font-bold text-white">OBRAS</h1>
          <h1 className="border-x border-t border-black bg-[#fead61] text-center text-xs font-bold text-white">ESTRUTURA DE MONTAGEM</h1>
          <div className="grid grid-cols-2">
            <div className="flex border border-r-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">TELHA RESERVA</h1>
              <div className="grid w-[40%] grid-cols-2">
                <h1 className="border-r border-black text-center text-xs">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">TIPO DA ESTRUTURA</h1>
              <div className="grid w-[40%] grid-cols-2">
                <h1 className="border-r border-black text-center text-xs">FERRO</h1>
                <h1 className="text-center text-xs">MADEIRA</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-t-0 border-r-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">QTDE DE TELHAS RESERVAS</h1>
              <div className=" w-[40%]"></div>
            </div>
            <div className="flex border border-t-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">ORIENTAÇÃO DO TELHADO</h1>
              <div className="w-[40%]"></div>
            </div>
          </div>
          <div className="flex border border-t-0 border-black">
            <div className="flex w-[30%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs font-bold">
              TIPO DA TELHA
            </div>
            <div className="grid w-[70%] grid-cols-7 grid-rows-2">
              <h1 className="border-r border-b border-black text-center text-xs">AMERICANA</h1>
              <h1 className="border-r border-b border-black text-center text-xs">ETHERNIT</h1>
              <h1 className="border-r border-b border-black text-center text-xs">CIMENTO</h1>
              <h1 className="border-r border-b border-black text-center text-xs">PORTUGUESA</h1>
              <h1 className="border-r border-b border-black text-center text-xs">ROMANA</h1>
              <h1 className="border-r border-b border-black text-center text-xs">CAPA+BICA</h1>
              <h1 className="border-b border-black text-center text-xs">ZINCO</h1>
              <h1 className="border-r border-black text-center text-xs">SANDUÍCHE</h1>
              <h1 className="border-r border-black text-center text-xs">FRANCESA</h1>
              <h1 className="border-r border-black text-center text-xs">PINTADA</h1>
              <h1 className="border-r border-black text-center text-xs">ESPECIAL</h1>
              <h1 className="border-r border-black text-center text-xs">VER FOTO</h1>
              <h1 className="border-r border-black text-center text-xs">N/A</h1>
              <h1 className="text-center text-xs">AMERICANA</h1>
            </div>
          </div>
          <div className="flex border border-t-0 border-black">
            <h1 className="flex w-[30%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs font-bold">
              TIPO DE EDIFICAÇÃO
            </h1>
            <div className="grid w-[70%] grid-cols-11">
              <div className="col-span-2 flex items-center justify-center border-r border-black text-center text-xs">COLONIAL</div>
              <div className="col-span-2 flex items-center justify-center border-r border-black text-center text-xs">BARRACÃO</div>
              <div className="col-span-2 flex items-center justify-center border-r border-black text-center text-xs">CAIXOTE</div>
              <div className="col-span-2 flex items-center justify-center border-r border-black text-center text-xs">SOLO</div>
              <div className="col-span-3 flex items-center justify-center text-center text-xs">BARRACÃO A SER CONSTRUÍDO</div>
            </div>
          </div>
          <h1 className="border-x border-black bg-[#fead61] text-center text-xs font-bold text-white">INFRAESTRUTURA ELÉTRICA</h1>
          <div className="grid grid-cols-2">
            <div className="flex border border-t-0 border-r-0 border-black">
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs font-bold">
                ADAPTAÇÃO NO QGBT
              </div>
              <div className="grid w-[40%] grid-cols-3">
                <div className="flex items-center justify-center border-r border-black text-center text-xs">TRILHO</div>
                <div className="flex items-center justify-center border-r border-black text-center text-xs">CORTE</div>
                <div className="flex items-center justify-center text-center text-xs">NÃO</div>
              </div>
            </div>
            <div className="flex border border-t-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">PARADE DE FIXAÇÃO DOS EQUIPAMENTOS</h1>
              <div className="grid w-[40%] grid-cols-2">
                <div className="flex items-center justify-center border-r border-black text-center text-xs">ALVENARIA</div>
                <div className="flex items-center justify-center text-center text-xs">OUTRO</div>
              </div>
            </div>
          </div>
          <div className="flex border border-t-0 border-black">
            <h1 className="w-[30%] border-r border-black bg-gray-200 text-center text-xs font-bold">LOCAL DE INSTALAÇÃO DOS EQUIPAMENTOS</h1>
            <div className="w-[70%]"></div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-t-0 border-r-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">DISTÂNCIA DO SISTEMA AO QGBT</h1>
              <h1 className="w-[40%] pr-2 text-end text-xs">METROS</h1>
            </div>
            <div className="flex border border-t-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">DISTÂNCIA DO ROTEADOR AO INVERSOR</h1>
              <h1 className="w-[40%] pr-2 text-end text-xs">METROS</h1>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-t-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">CASA DE MÁQUINAS</h1>
              <div className="grid w-[40%] grid-cols-2">
                <h1 className="border-r border-black text-center text-xs">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border border-l-0 border-t-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">REDE PARA INTERLIGAR FAZENDA</h1>
              <div className="grid w-[40%] grid-cols-2">
                <h1 className="border-r border-black text-center text-xs">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex border border-t-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">INSTALAÇÃO INTERNET</h1>
              <div className="grid w-[40%] grid-cols-2">
                <h1 className="border-r border-black text-center text-xs">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
            <div className="flex border border-l-0 border-t-0 border-black">
              <h1 className="w-[60%] border-r border-black bg-gray-200 text-center text-xs font-bold">CONSTRUÇÃO DE BARRACÃO</h1>
              <div className="grid w-[40%] grid-cols-2">
                <h1 className="border-r border-black text-center text-xs">SIM</h1>
                <h1 className="text-center text-xs">NÃO</h1>
              </div>
            </div>
          </div>
          <h1 className="border-x border-t-0 border-black bg-[#fead61] text-center text-xs font-bold text-white">OBSERVAÇÕES</h1>
          <div className="h-[200px] border border-t-0 border-black"></div>
        </div>
        <div className="mt-6 flex flex-col">
          <h1 className="border border-black bg-[#15599a] text-center text-sm font-bold text-white">CHECKLIST DE FOTOS E LOCALIZAÇÕES</h1>
          <h1 className="border border-t-0 border-b-0 border-black bg-[#fead61] text-center text-xs font-bold text-white">PADRÃO</h1>
          <div className="grid grid-cols-3 grid-rows-2 border border-b-0 border-black">
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">1</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                FOTO DO PADRÃO DE ENTRADA
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">2</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">FOTO DO DISJUNTOR</div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">3</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                FOTO DO RAMAL DE ENTRADA
              </div>
              <div className="w-[20%] text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">4</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                LOCALIZAÇÃO DO PADRÃO
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">5</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                FOTO GERAL DO PADRÃO ATÉ A RESIDÊNCIA
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">6</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">FOTO DO MEDIDOR</div>
              <div className="w-[20%] text-center text-xs"></div>
            </div>
          </div>
          <h1 className="border border-t-0 border-black bg-[#fead61] text-center text-xs font-bold text-white">TRANSFORMADOR</h1>
          <div className="grid grid-cols-3">
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">1</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">LOCALIZAÇÃO TRAFO</div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">2</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                Nº DO TRANSFORMADOR
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">3</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                FOTO DO TRANSFORMADOR
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
          </div>
          <h1 className="border border-t-0 border-b-0 border-black bg-[#fead61] text-center text-xs font-bold text-white">MONTAGEM</h1>
          <div className="grid grid-cols-3 grid-rows-3 border border-black">
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center">1</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">FOTO DO TELHADO</div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">2</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                FOTO DO LOCAL DE MONTAGEM(SOLO)
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">3</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">FILMAGEM GERAL</div>
              <div className="w-[20%] text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">4</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">FOTO DA FACHADA</div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">5</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                LOCALIZAÇÃO DA RESIDÊNCIA
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">6</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                LOCALIZAÇÃO DAS PLACAS(SOLO)
              </div>
              <div className="w-[20%] text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">7</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                FOTO LOCAL DO INVERSOR
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">8</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">FOTOS GERAIS</div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-r-0 border-black">
              <div className="flex w-[20%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">9</div>
              <div className="flex w-[60%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                FOTOS DA ESTRUTURA TELHADO
              </div>
              <div className="w-[20%] text-center text-xs"></div>
            </div>
          </div>
          <h1 className="border border-t-0 border-black bg-[#15599a] text-center text-xs font-bold text-white">GOIÁS</h1>
          <div className="grid grid-cols-3 grid-rows-2">
            <div className="flex border-b border-black">
              <div className="flex w-[80%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                Nº POSTE DE DERIVAÇÃO
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[80%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                LOCAL DE ATERRAMENTO
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[80%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                POTÊNCIA DO TRANSFORMADOR
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[80%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                LOCALIZAÇÃO POSTE DERIVAÇÃO
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[80%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">CHAVE FUSÍVEL</div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
            <div className="flex border-b border-black">
              <div className="flex w-[80%] items-center justify-center border-r border-black bg-gray-200 text-center text-xs">
                NºPOSTE DO TRANSFORMADOR
              </div>
              <div className="w-[20%] border-r border-black text-center text-xs"></div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <h1 className="border border-black text-center text-sm font-bold text-[#15599a]">DESENHO TÉCNICO</h1>
          <h1 className="border border-t-0 border-black bg-[#15599a] text-center text-xs font-bold text-white">OBSERVAÇÕES</h1>
          <div className="mb-2 h-[500px] border border-t-0 border-black"></div>
        </div>
      </div>
    </div>
  )
}

export default LaudoFormularioVisitaRural
