import React from 'react'
import Image from 'next/image'
import Logo from '../utils/whitelogoHD.png'
import Assinatura from '../utils/assinatura.jpg'
import dayjs from 'dayjs'
import { formatToMoney } from '../utils/constants'
import { GeneralTechnicalAnalysisSchema } from '../utils/schemas/technical-analysis'
function LaudoSimplesRural({ analysis }) {
  function getAdditionalCostsSum(custos) {
    const sum = custos.reduce((acc, current) => {
      const total = current.total ? current.total : current.qtde * current.custoUnitario
      return total + acc
    }, 0)
    return sum
  }
  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-around items-center border border-t-0 border-black py-2 mt-2">
          <h1 className="font-bold uppercase text-[#15599a]">LAUDO TÉCNICO COMERCIAL - RURAL</h1>
          <div className="w-[47px] h-[47px]">
            <Image style={{ width: '47px', height: '47px' }} src={Logo} />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border-x border-black">INFORMAÇÕES DO CLIENTE</h1>
          <div className="flex">
            <div className="grid grid-rows-5 w-[60%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">CLIENTE</p>
                <p className="text-center text-xs border-r border-black">{analysis.nome}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">REPRESENTANTE</p>
                <p className="text-center text-xs border-r border-black">{analysis.requerente.apelido || analysis.requerente.nomeCRM}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">ENDEREÇO</p>
                <p className="text-center text-xs border-r border-black">{analysis.localizacao.endereco}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">BAIRRO</p>
                <p className="text-center text-xs border-r border-black">{analysis.localizacao.bairro}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">DATA DA VISITA</p>
                <p className="text-center text-xs border-r border-black">{dayjs().format('DD/MM/YY')}</p>
              </div>
            </div>
            <div className="grid grid-rows-5 w-[40%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">TELEFONE</p>
                <p className="text-center text-xs border-r border-black">-</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">Nº DE PROJETO</p>
                <p className="text-center text-xs border-r border-black">{analysis.projeto.identificador}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">NÚMERO</p>
                <p className="text-center text-xs border-r border-black">{analysis.localizacao.numeroOuIdentificador}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">MUNICÍPIO</p>
                <p className="text-center text-xs border-r border-black">{analysis.localizacao.cidade}</p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="text-center text-xs border-r border-black">TIPO DE SOLICITAÇÃO</p>
                <p className="text-center text-xs border-r border-black">{analysis.tipoSolicitacao}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
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
                    <p className="bg-gray-200 text-center text-[0.6rem] font-bold p-1">TOPOLOGIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.detalhes.topologia}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-[0.6rem] font-bold p-1">QUANTIDADE</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-[0.6rem] font-bold p-1">MARCA DO INVERSOR</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.inversor.modelo}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-[0.6rem] font-bold p-1">POTÊNCIA</p>
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
                    <p className="bg-gray-200 text-center text-[0.6rem] font-bold p-1">QUANTIDADE</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.modulos.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-[0.6rem] font-bold p-1">POTÊNCIA</p>
                    <p className="text-center text-[0.6rem] font-bold p-1">{analysis.equipamentos.modulos.potencia}</p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-[0.6rem] font-bold p-1 w-[50%]">MARCA DOS MÓDULOS</p>
                <p className="text-center text-[0.6rem] font-bold p-1 w-[50%]">{analysis.equipamentos.modulos.modelo}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-b-0 border-black">VISUALIZAÇÃO DO PROJETO</h1>
          <div className="h-[600px] flex items-center border border-black">
            {analysis.desenho.url ? (
              <div className="w-[793.7px] h-full">
                <Image width={'793px'} height={'560px'} src={analysis.desenho.url} objectFit="fill" alt="Picture of the author" />
              </div>
            ) : (
              <div className="w-[793.7px] h-full flex items-center justify-center">
                <p className="italic font-bold text-gray-500">Oops, parece que não há nenhum desenho vinculado para essa análise...</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border border-black">CUSTOS ADICIONAIS</h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-10 border-b border-black bg-[#fead61]">
              <p className="text-center text-xs font-bold col-span-3 border-r border-black p-1 text-white">DESCRIÇÃO</p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1 text-white">QUANTIDADE</p>
              <p className="text-center text-xs font-bold col-span-1 border-r border-black p-1 text-white">GRANDEZA</p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1 text-white">VALOR</p>
              <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1 text-white">TOTAL</p>
            </div>
            {analysis.custos?.length > 0 ? (
              analysis.custos.map((cost, index) => (
                <div key={index} className="grid grid-cols-10 border-b border-black">
                  <p className="text-center text-xs font-bold col-span-3 border-r border-black p-1">{cost.descricao}</p>
                  <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1">{cost.qtde}</p>
                  <p className="text-center text-xs font-bold col-span-1 border-r border-black p-1">{cost.grandeza}</p>
                  <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1">{formatToMoney(cost.custoUnitario)}</p>
                  <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1">
                    {cost.total ? formatToMoney(cost.total) : formatToMoney(cost.qtde * cost.custoUnitario)}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[50px] border-b border-r border-black italic">SEM CUSTOS ADICIONAIS</div>
            )}
          </div>
          <div className="grid grid-cols-10">
            <div className="bg-[#15599a] text-white font-bold flex justify-center items-center text-center col-span-3 border border-black border-t-0 border-l-0">
              VALOR PARA AJUSTE NA PROPOSTA COMERCIAL
            </div>
            <div className="flex flex-col col-span-7 h-full">
              <div className="grid grid-cols-7  border-b border-black">
                <div className="col-span-5 bg-[#fead61] text-white text-center p-1 font-bold border-r border-black">VALOR À VISTA</div>
                <div className="col-span-2 bg-[#fead61] text-white text-center p-1 font-bold border-r border-black">
                  R$ {analysis.custos ? getAdditionalCostsSum(analysis.custos).toFixed(2).replace('.', ',') : '-'}
                </div>
              </div>
              <div className="grid grid-cols-7  border-b border-black">
                <div className="col-span-5 bg-[#15599a] text-white text-center p-1 font-bold border-r border-black">VALOR FINANCIAMENTO</div>
                <div className="col-span-2 bg-[#15599a] text-white text-center p-1 font-bold border-r border-black">
                  R$ {analysis.custos ? (getAdditionalCostsSum(analysis.custos) * 1.175).toFixed(2).replace('.', ',') : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="bg-[#15599a] text-white text-center text-sm font-bold border border-black border-t-0">SERVIÇOS EXTRAS</h1>
          <div className="grid grid-cols-2 border-b border-black">
            <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">REALIMENTAR</p>
            <p className="text-xxs text-center border-r border-black">{analysis.servicosAdicionais.realimentar ? 'SIM' : 'NÃO'}</p>
          </div>
          <div className="flex">
            <div className="grid grid-rows-4 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">CASA DE MÁQUINAS</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.casaDeMaquinas ? analysis.servicosAdicionais.casaDeMaquinas : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">INSTALAÇÃO INTERNET</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.roteador ? analysis.servicosAdicionais.roteador : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">INSTALAÇÃO DE ALAMBRADO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.alambrado ? analysis.servicosAdicionais.alambrado : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">TERRAPLANAGEM USINA DE SOLO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.terraplanagem ? analysis.servicosAdicionais.terraplanagem : '-'}
                </p>
              </div>
            </div>
            <div className="grid grid-rows-4 w-[50%]">
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">CONSTRUÇÃO DE BARRACÃO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.barracao ? analysis.servicosAdicionais.barracao : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">REDE PARA INTERLIGAR FAZENDA</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.redeReligacao ? analysis.servicosAdicionais.redeReligacao : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">BRITAGEM</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.britagem ? analysis.servicosAdicionais.britagem : '-'}
                </p>
              </div>
              <div className="grid grid-cols-2 border-b border-black">
                <p className="bg-gray-200 font-bold text-xxs text-center border-r border-black">LIMPEZA DO LOCAL USINA DE SOLO</p>
                <p className="text-xxs text-center border-r border-black">
                  {analysis.servicosAdicionais.limpezaLocal ? analysis.servicosAdicionais.limpezaLocal : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="bg-[#fead61] text-white text-center font-bold border border-black border-t-0">DESCRITIVO DO PROJETO</h1>
          <div className="flex flex-col text-xs justify-center items-center border border-black border-t-0 min-h-[60px] text-center">
            {analysis.descritivo?.length > 0 ? (
              analysis.descritivo?.map((item, index) => (
                <div key={index} className="flex w-full flex-col mb-1">
                  <div className="flex w-full items-center justify-between">
                    <div className="w-full flex items-center justify-center gap-2 bg-black text-white">
                      <MdTopic />
                      <h1 className=" leading-none tracking-tight font-bold  text-sm">{item.topico}</h1>
                    </div>
                  </div>

                  <p className="w-full text-center text-xs text-gray-500 mt-1">{item.descricao}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-center h-full italic text-gray-600">SEM DESCRITIVO</div>
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold">RESPOSTA DA VISITA TÉCNICA</h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-2">
              <div className="grid col-span-2 grid-cols-2 border-b border-black">
                <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">ESPAÇO PARA PROJETO</p>
                <p className="font-bold text-center text-sm py-1 border-r border-black">{analysis.conclusao.espaco ? 'SIM' : 'NÃO'}</p>
              </div>
              <div className="grid grid-rows-3">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">PADRÃO</p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    {analysis.conclusao.padrao ? analysis.conclusao.padrao : '-'}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">ESTRUTURA DE INCLINAÇÃO</p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    {analysis.conclusao.inclinacao ? analysis.conclusao.inclinacao : '-'}
                  </p>
                </div>
              </div>
              <div className="grid grid-rows-3">
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">POSSUI SOMBRA?</p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    {analysis.conclusao.sombreamento ? 'É AFETADO' : 'NÃO É AFETADO'}
                  </p>
                </div>
                <div className="grid grid-cols-2 border-b border-black">
                  <p className="bg-[#fead61] font-bold text-white text-center text-sm py-1 border-r border-black">ESTRUTURA CIVIL</p>
                  <p className="font-bold text-center text-sm py-1 border-r border-black">
                    {analysis.conclusao.estrutura ? analysis.conclusao.estrutura : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="bg-[#15599a] text-white text-center font-bold border border-black border-t-0">CONCLUSÃO</h1>
          <div className="flex text-xs justify-center items-center border border-black border-t-0 h-[60px] text-center p-2">
            {analysis.conclusao.observacoes ? analysis.conclusao.observacoes : '-'}
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
            <p className="text-xxs text-center">ASSINATURA DIRETOR DE ENGENHARIA</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xxs text-start ml-2">Realizado por:</p>
            <hr className="mt-8 border-t-2 border-black" />
            <p className="text-xxs text-center">ASSINATURA TÉCNICO RESPONSÁVEL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaudoSimplesRural
