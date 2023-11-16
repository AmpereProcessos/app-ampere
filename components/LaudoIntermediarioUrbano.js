import React from 'react'
import Image from 'next/image'
import Logo from '../utils//images/logo-texto-azul-vertical.png'
import fatorDeGeracaoPorOrientacao from '../utils/jsons/fatores-geracao.json'
import Assinatura from '../utils/images/signature-diogo.jpg'
import dayjs from 'dayjs'
import { Bar, BarChart, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts'
import { getGenFactorByOrientation } from '../utils/methods/shared'
import { GeneralTechnicalAnalysisSchema } from '../utils/schemas/technical-analysis'
import { formatToMoney, margemLucro, taxaImposto } from '../utils/constants'
import { MdTopic } from 'react-icons/md'
function LaudoIntermediarioUrbano({ analysis }) {
  function getAdditionalCostsSum(custos, addTaxes = false) {
    const sum = custos.reduce((acc, current) => {
      var total = 0
      if (addTaxes) {
        total = current.total
          ? current.total / (1 - (margemLucro + taxaImposto))
          : (current.qtde * current.custoUnitario) / (1 - (margemLucro + taxaImposto))
      } else {
        total = current.total ? current.total / (1 - margemLucro) : (current.qtde * current.custoUnitario) / (1 - margemLucro)
      }
      if (total) return acc + total
      return acc
    }, 0)
    return sum
  }
  function getCorrectedGen() {
    const { cidade, uf } = analysis.localizacao
    var cityFactor = fatorDeGeracaoPorOrientacao.find((genFactor) => genFactor.CIDADE == cidade && genFactor.UF == uf)
    if (!cityFactor) {
      cityFactor = fatorDeGeracaoPorOrientacao.find((genFactor) => genFactor.CIDADE == 'ITUIUTABA')
    }
    let norte = analysis.alocacaoModulos.norte
      ? (
          (Number(cityFactor['NORTE']) * analysis.alocacaoModulos.norte * getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
          1000
        ).toFixed(2)
      : 0
    let nordeste = analysis.alocacaoModulos.nordeste
      ? (
          (Number(cityFactor['NORDESTE']) * analysis.alocacaoModulos.nordeste * getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
          1000
        ).toFixed(2)
      : 0
    let leste = analysis.alocacaoModulos.leste
      ? (
          (Number(cityFactor['LESTE']) * analysis.alocacaoModulos.leste * getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
          1000
        ).toFixed(2)
      : 0
    let sudeste = analysis.alocacaoModulos.sudeste
      ? (
          (Number(cityFactor['SUDESTE']) * analysis.alocacaoModulos.sudeste * getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
          1000
        ).toFixed(2)
      : 0
    let sul = analysis.alocacaoModulos.sul
      ? ((Number(cityFactor['SUL']) * analysis.alocacaoModulos.sul * getAverageModulePower(analysis.equipamentos.modulos.potencia)) / 1000).toFixed(2)
      : 0
    let sudoeste = analysis.alocacaoModulos.sudoeste
      ? (
          (Number(cityFactor['SUDOESTE']) * analysis.alocacaoModulos.sudoeste * getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
          1000
        ).toFixed(2)
      : 0
    let oeste = analysis.alocacaoModulos.oeste
      ? (
          (Number(cityFactor['OESTE']) * analysis.alocacaoModulos.oeste * getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
          1000
        ).toFixed(2)
      : 0
    let noroeste = analysis.alocacaoModulos.noroeste
      ? (
          (Number(cityFactor['NOROESTE']) * analysis.alocacaoModulos.noroeste * getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
          1000
        ).toFixed(2)
      : 0
    console.log(norte, nordeste, leste, sudeste, sul, sudoeste, oeste, noroeste)
    return (
      Number(norte) +
      Number(nordeste) +
      Number(leste) +
      Number(sudeste) +
      Number(sul) +
      Number(sudoeste) +
      Number(oeste) +
      Number(noroeste)
    ).toFixed(2)
  }

  function getAverageModulePower(modPower) {
    const splittedPower = `${modPower}`.split('/')

    if (splittedPower.length > 1) {
      var total = 0
      for (let i = 0; i < splittedPower.length; i++) {
        const powerAsNumber = Number(splittedPower[i])
        if (isNaN(powerAsNumber)) total = total
        else total = total + powerAsNumber
      }

      return total / splittedPower.length
    } else {
      return Number(splittedPower[0])
    }
  }
  function getTotalModuleQtde(modQtde) {
    const splittedQty = `${modQtde}`.split('/')

    if (splittedQty.length > 1) {
      var total = 0
      for (let i = 0; i < splittedQty.length; i++) {
        const powerAsNumber = Number(splittedQty[i])
        if (isNaN(powerAsNumber)) total = total
        else total = total + powerAsNumber
      }

      return total
    } else {
      return Number(splittedQty[0])
    }
  }
  function getProposedGen() {
    const factor = getGenFactorByOrientation({
      city: analysis.localizacao.cidade,
      uf: analysis.localizacao.uf,
    })
    console.log('FATOR', factor)
    return (
      (getTotalModuleQtde(analysis.equipamentos.modulos.qtde) * getAverageModulePower(analysis.equipamentos.modulos.potencia) * factor) /
      1000
    ).toFixed(2)
  }

  return (
    <div className="w-[21cm] h-[29.7cm]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-around items-center border border-t-0 border-black py-2 mt-2">
          <h1 className="font-bold uppercase text-[#15599a]">LAUDO TÉCNICO - URBANO</h1>
          <div className="w-[47px] h-[47px]">
            <Image style={{ width: '47px', height: '47px' }} src={Logo} />
          </div>
        </div>
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
        <div className="flex flex-col mt-6">
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
                    <p className="bg-gray-200 text-center text-xxs font-bold">TOPOLOGIA</p>
                    <p className="text-center text-xxs font-bold">{analysis.detalhes.topologia}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">QUANTIDADE</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.inversor.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">MARCA DO INVERSOR</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.inversor.modelo}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">POTÊNCIA</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.inversor.potencia}</p>
                  </div>
                </div>
              </div>
              <h1 className="bg-[#fead61] text-white text-sm  text-center font-raleway font-bold  border border-black border-b-0">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-black border-b-0">
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">QUANTIDADE</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.modulos.qtde}</p>
                  </div>
                </div>
                <div className="flex flex-col w-[50%]">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">POTÊNCIA</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.modulos.potencia}</p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="bg-gray-200 text-center text-xxs font-bold w-[50%]">MARCA DOS MÓDULOS</p>
                <p className="text-center text-xxs font-bold w-[50%]">{analysis.equipamentos.modulos.modelo}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
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
        <div className="mt-2 flex flex-col">
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
                  <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1">
                    {formatToMoney(cost.custoUnitario / (1 - margemLucro))}
                  </p>
                  <p className="text-center text-xs font-bold col-span-2 border-r border-black p-1">
                    {cost.total ? formatToMoney(cost.total / (1 - margemLucro)) : formatToMoney((cost.qtde * cost.custoUnitario) / (1 - margemLucro))}
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
                  R$ {analysis.custos ? getAdditionalCostsSum(analysis.custos, true).toFixed(2).replace('.', ',') : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="bg-[#15599a] text-white text-sm text-center font-bold border  border-black">ESTUDO DE GERAÇÃO - DESVIO AZIMUTAL</h1>
          <div className="grid grid-cols-2">
            <div className="grid-rows-5">
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#15599a] font-bold text-white text-xs text-center p-1 border-r border-black">ORIENTAÇÃO</p>
                <p className="bg-[#15599a] font-bold text-white text-xs text-center p-1 border-r border-black">QTDE PLACAS</p>
                <p className="bg-[#15599a] font-bold text-white text-xs text-center p-1 border-r border-black">GERAÇÃO</p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">NORTE</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.norte ? analysis.alocacaoModulos.norte : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.norte
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'NORTE',
                        }) *
                          analysis.alocacaoModulos.norte *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)} kWh`
                    : ' - '}{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">NORDESTE</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.nordeste ? analysis.alocacaoModulos.nordeste : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.nordeste
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'NORDESTE',
                        }) *
                          analysis.alocacaoModulos.nordeste *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)} kWh`
                    : ' - '}{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">LESTE</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.leste ? analysis.alocacaoModulos.leste : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.leste
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'LESTE',
                        }) *
                          analysis.alocacaoModulos.leste *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)} kWh`
                    : '-'}{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">SUDESTE</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.sudeste ? analysis.alocacaoModulos.sudeste : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.sudeste
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'SUDESTE',
                        }) *
                          analysis.alocacaoModulos.sudeste *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)}`
                    : '-'}{' '}
                </p>
              </div>
            </div>
            <div className="grid-rows-5">
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#15599a] font-bold text-xs text-center text-white p-1 border-r border-black">ORIENTAÇÃO</p>
                <p className="bg-[#15599a] font-bold text-xs text-center text-white p-1 border-r border-black">QTDE PLACAS</p>
                <p className="bg-[#15599a] font-bold text-xs text-center text-white p-1 border-r border-black">GERAÇÃO</p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">SUL</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.sul ? analysis.alocacaoModulos.sul : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.sul
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'SUL',
                        }) *
                          analysis.alocacaoModulos.sul *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)} kWh`
                    : '-'}{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">SUDOESTE</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.sudoeste ? analysis.alocacaoModulos.sudoeste : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.sudoeste
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'SUDOESTE',
                        }) *
                          analysis.alocacaoModulos.sudoeste *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)} kWh`
                    : '-'}{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">OESTE</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.oeste ? analysis.alocacaoModulos.oeste : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.oeste
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'OESTE',
                        }) *
                          analysis.alocacaoModulos.oeste *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)} kWh`
                    : '-'}{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="bg-[#fead61] text-white italic font-bold text-center text-xs border-r border-black">NOROESTE</p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.noroeste ? analysis.alocacaoModulos.noroeste : '-'}
                </p>
                <p className="font-bold text-center text-xs border-r border-black">
                  {analysis.alocacaoModulos.noroeste
                    ? `${(
                        (getGenFactorByOrientation({
                          city: analysis.localizacao.cidade,
                          uf: analysis.localizacao.uf,
                          orientation: 'NOROESTE',
                        }) *
                          analysis.alocacaoModulos.noroeste *
                          getAverageModulePower(analysis.equipamentos.modulos.potencia)) /
                        1000
                      ).toFixed(2)} kWh`
                    : '-'}{' '}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="bg-[#15599a] italic text-white font-bold text-center col-span-4 text-xs border-r border-black py-1">
              GERAÇÃO PROPOSTA COMERCIAL
            </div>
            <div className="col-span-2 text-xs font-bold text-center border-r border-black py-1">{getProposedGen()} kWh</div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="bg-[#fead61] italic text-white font-bold text-center col-span-4 text-xs border-r border-black py-1">
              GERAÇÃO PREVISTA TOTAL
            </div>
            <div className="col-span-2 text-xs font-bold text-center border-r border-black py-1">{getCorrectedGen()} kWh</div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="bg-[#15599a] italic text-white font-bold text-center col-span-4 text-xs border-r border-black py-1">
              PERCENTUAL DE GERAÇÃO DEVIDO AO DESVIO AZIMUTAL
            </div>
            <div className="col-span-2 text-xs font-bold text-center border-r border-black py-1">
              {getProposedGen() / getCorrectedGen() < 1
                ? ((getCorrectedGen() / getProposedGen()) * 100).toFixed(2).replace('.', ',')
                : ((getCorrectedGen() / getProposedGen()) * 100).toFixed(2).replace('.', ',')}
              %
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center my-2">
          <h1 className="text-center font-bold text-[#15599a]">VISUALIZAÇÃO GRÁFICA</h1>
          <div className="w-[600px] h-[300px]">
            <ResponsiveContainer width="100%">
              <BarChart
                width={500}
                height={250}
                data={[
                  {
                    name: 'PROPOSTA',
                    PROPOSTO: getProposedGen(),
                    PREVISTO: 0,
                  },
                  {
                    name: 'PREVISTO',
                    PROPOSTO: 0,
                    PREVISTO: getCorrectedGen(),
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="kWh" />
                <Tooltip />
                <Legend />
                <Bar dataKey="PROPOSTO" fill="#15599a" unit={'kWh'}></Bar>
                <Bar dataKey="PREVISTO" fill="#fead61" unit={'kWh'}></Bar>
              </BarChart>
            </ResponsiveContainer>
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

export default LaudoIntermediarioUrbano
