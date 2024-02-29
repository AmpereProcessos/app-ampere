import React from 'react'
import Image from 'next/image'
import Logo from '../utils//images/logo-texto-azul-vertical.png'
import fatorDeGeracaoPorOrientacao from '../utils/jsons/fatores-geracao.json'
import Assinatura from '../utils/images/signature-diogo.jpg'
import dayjs from 'dayjs'
import { Bar, BarChart, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts'
import { getGenFactorByOrientation } from '../utils/methods/shared'
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
    <div className="h-[29.7cm] w-[21cm]">
      <div className="flex h-full w-full flex-col">
        <div className="mt-2 flex w-full items-center justify-around border border-t-0 border-black py-2">
          <h1 className="font-bold uppercase text-[#15599a]">LAUDO TÉCNICO - URBANO</h1>
          <div className="h-[47px] w-[47px]">
            <Image style={{ width: '47px', height: '47px' }} src={Logo} />
          </div>
        </div>
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
        <div className="mt-6 flex flex-col">
          <h1 className="bg-[#15599a] text-center text-sm font-bold text-white">EQUIPAMENTOS</h1>
          <div className="flex">
            <div className="flex h-full w-[20%] items-center justify-center bg-[#15599a] text-center font-bold text-white">
              DESCRIÇÃO DO SISTEMA FOTOVOLTAICO
            </div>
            <div className="flex w-[80%] flex-col">
              <h1 className="border border-b-0 border-black  bg-[#fead61] text-center font-raleway  text-sm font-bold text-white">INVERSORES</h1>
              <div className="flex border border-b-0 border-black">
                <div className="flex w-[50%] flex-col">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">TOPOLOGIA</p>
                    <p className="text-center text-xxs font-bold">{analysis.detalhes.topologia}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">QUANTIDADE</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.inversor.qtde}</p>
                  </div>
                </div>
                <div className="flex w-[50%] flex-col">
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
              <h1 className="border border-b-0 border-black  bg-[#fead61] text-center font-raleway  text-sm font-bold text-white">
                MÓDULOS FOTOVOLTÁICOS
              </h1>
              <div className="flex  border border-b-0 border-black">
                <div className="flex w-[50%] flex-col">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">QUANTIDADE</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.modulos.qtde}</p>
                  </div>
                </div>
                <div className="flex w-[50%] flex-col">
                  <div className="grid grid-cols-2">
                    <p className="bg-gray-200 text-center text-xxs font-bold">POTÊNCIA</p>
                    <p className="text-center text-xxs font-bold">{analysis.equipamentos.modulos.potencia}</p>
                  </div>
                </div>
              </div>
              <div className="flex  border border-black">
                <p className="w-[50%] bg-gray-200 text-center text-xxs font-bold">MARCA DOS MÓDULOS</p>
                <p className="w-[50%] text-center text-xxs font-bold">{analysis.equipamentos.modulos.modelo}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <h1 className="border border-b-0 border-black bg-[#15599a] text-center text-sm font-bold text-white">VISUALIZAÇÃO DO PROJETO</h1>
          <div className="flex h-[600px] items-center border border-black">
            {analysis.desenho.url ? (
              <div className="h-full w-[793.7px]">
                <Image width={'793px'} height={'560px'} src={analysis.desenho.url} objectFit="fill" alt="Picture of the author" />
              </div>
            ) : (
              <div className="flex h-full w-[793.7px] items-center justify-center">
                <p className="font-bold italic text-gray-500">Oops, parece que não há nenhum desenho vinculado para essa análise...</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          <h1 className="border border-black bg-[#15599a] text-center text-sm font-bold text-white">CUSTOS ADICIONAIS</h1>
          <div className="flex flex-col">
            <div className="grid grid-cols-10 border-b border-black bg-[#fead61]">
              <p className="col-span-3 border-r border-black p-1 text-center text-xs font-bold text-white">DESCRIÇÃO</p>
              <p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold text-white">QUANTIDADE</p>
              <p className="col-span-1 border-r border-black p-1 text-center text-xs font-bold text-white">GRANDEZA</p>
              <p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold text-white">VALOR</p>
              <p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold text-white">TOTAL</p>
            </div>
            {analysis.custos?.length > 0 ? (
              analysis.custos.map((cost, index) => (
                <div key={index} className="grid grid-cols-10 border-b border-black">
                  <p className="col-span-3 border-r border-black p-1 text-center text-xs font-bold">{cost.descricao}</p>
                  <p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold">{cost.qtde}</p>
                  <p className="col-span-1 border-r border-black p-1 text-center text-xs font-bold">{cost.grandeza}</p>
                  <p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold">
                    {formatToMoney(cost.custoUnitario / (1 - margemLucro))}
                  </p>
                  <p className="col-span-2 border-r border-black p-1 text-center text-xs font-bold">
                    {cost.total ? formatToMoney(cost.total / (1 - margemLucro)) : formatToMoney((cost.qtde * cost.custoUnitario) / (1 - margemLucro))}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex h-[50px] items-center justify-center border-b border-r border-black italic">SEM CUSTOS ADICIONAIS</div>
            )}
          </div>
          <div className="grid grid-cols-10">
            <div className="col-span-3 flex items-center justify-center border border-t-0 border-l-0 border-black bg-[#15599a] text-center font-bold text-white">
              VALOR PARA AJUSTE NA PROPOSTA COMERCIAL
            </div>
            <div className="col-span-7 flex h-full flex-col">
              <div className="grid grid-cols-7  border-b border-black">
                <div className="col-span-5 border-r border-black bg-[#fead61] p-1 text-center font-bold text-white">VALOR À VISTA</div>
                <div className="col-span-2 border-r border-black bg-[#fead61] p-1 text-center font-bold text-white">
                  R$ {analysis.custos ? getAdditionalCostsSum(analysis.custos).toFixed(2).replace('.', ',') : '-'}
                </div>
              </div>
              <div className="grid grid-cols-7  border-b border-black">
                <div className="col-span-5 border-r border-black bg-[#15599a] p-1 text-center font-bold text-white">VALOR FINANCIAMENTO</div>
                <div className="col-span-2 border-r border-black bg-[#15599a] p-1 text-center font-bold text-white">
                  R$ {analysis.custos ? getAdditionalCostsSum(analysis.custos, true).toFixed(2).replace('.', ',') : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <h1 className="border border-black bg-[#15599a] text-center text-sm font-bold  text-white">ESTUDO DE GERAÇÃO - DESVIO AZIMUTAL</h1>
          <div className="grid grid-cols-2">
            <div className="grid-rows-5">
              <div className="grid grid-cols-3 border-b border-black">
                <p className="border-r border-black bg-[#15599a] p-1 text-center text-xs font-bold text-white">ORIENTAÇÃO</p>
                <p className="border-r border-black bg-[#15599a] p-1 text-center text-xs font-bold text-white">QTDE PLACAS</p>
                <p className="border-r border-black bg-[#15599a] p-1 text-center text-xs font-bold text-white">GERAÇÃO</p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">NORTE</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.norte ? analysis.alocacaoModulos.norte : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">NORDESTE</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.nordeste ? analysis.alocacaoModulos.nordeste : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">LESTE</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.leste ? analysis.alocacaoModulos.leste : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">SUDESTE</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.sudeste ? analysis.alocacaoModulos.sudeste : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
                <p className="border-r border-black bg-[#15599a] p-1 text-center text-xs font-bold text-white">ORIENTAÇÃO</p>
                <p className="border-r border-black bg-[#15599a] p-1 text-center text-xs font-bold text-white">QTDE PLACAS</p>
                <p className="border-r border-black bg-[#15599a] p-1 text-center text-xs font-bold text-white">GERAÇÃO</p>
              </div>
              <div className="grid grid-cols-3 border-b border-black">
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">SUL</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.sul ? analysis.alocacaoModulos.sul : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">SUDOESTE</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.sudoeste ? analysis.alocacaoModulos.sudoeste : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">OESTE</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.oeste ? analysis.alocacaoModulos.oeste : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
                <p className="border-r border-black bg-[#fead61] text-center text-xs font-bold italic text-white">NOROESTE</p>
                <p className="border-r border-black text-center text-xs font-bold">
                  {analysis.alocacaoModulos.noroeste ? analysis.alocacaoModulos.noroeste : '-'}
                </p>
                <p className="border-r border-black text-center text-xs font-bold">
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
            <div className="col-span-4 border-r border-black bg-[#15599a] py-1 text-center text-xs font-bold italic text-white">
              GERAÇÃO PROPOSTA COMERCIAL
            </div>
            <div className="col-span-2 border-r border-black py-1 text-center text-xs font-bold">{getProposedGen()} kWh</div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="col-span-4 border-r border-black bg-[#fead61] py-1 text-center text-xs font-bold italic text-white">
              GERAÇÃO PREVISTA TOTAL
            </div>
            <div className="col-span-2 border-r border-black py-1 text-center text-xs font-bold">{getCorrectedGen()} kWh</div>
          </div>
          <div className="grid grid-cols-6 border-b border-black">
            <div className="col-span-4 border-r border-black bg-[#15599a] py-1 text-center text-xs font-bold italic text-white">
              PERCENTUAL DE GERAÇÃO DEVIDO AO DESVIO AZIMUTAL
            </div>
            <div className="col-span-2 border-r border-black py-1 text-center text-xs font-bold">
              {getProposedGen() / getCorrectedGen() < 1
                ? ((getCorrectedGen() / getProposedGen()) * 100).toFixed(2).replace('.', ',')
                : ((getCorrectedGen() / getProposedGen()) * 100).toFixed(2).replace('.', ',')}
              %
            </div>
          </div>
        </div>
        <div className="my-2 flex flex-col items-center">
          <h1 className="text-center font-bold text-[#15599a]">VISUALIZAÇÃO GRÁFICA</h1>
          <div className="h-[300px] w-[600px]">
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
        <div className="mt-2 flex flex-col">
          <h1 className="border border-t-0 border-black bg-[#fead61] text-center font-bold text-white">DESCRITIVO DO PROJETO</h1>
          <div className="flex min-h-[60px] flex-col items-center justify-center border border-t-0 border-black text-center text-xs">
            {analysis.descritivo?.length > 0 ? (
              analysis.descritivo?.map((item, index) => (
                <div key={index} className="mb-1 flex w-full flex-col">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex w-full items-center justify-center gap-2 bg-black text-white">
                      <MdTopic />
                      <h1 className=" text-sm font-bold leading-none  tracking-tight">{item.topico}</h1>
                    </div>
                  </div>

                  <p className="mt-1 w-full text-center text-xs text-gray-500">{item.descricao}</p>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-center italic text-gray-600">SEM DESCRITIVO</div>
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col">
          <h1 className="border border-t-0 border-black bg-[#15599a] text-center font-bold text-white">CONCLUSÃO</h1>
          <div className="flex h-[60px] items-center justify-center border border-t-0 border-black p-2 text-center text-xs">
            {analysis.conclusao.observacoes ? analysis.conclusao.observacoes : '-'}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4">
          <div className="flex flex-col">
            <p className="ml-2 text-start text-xxs">Autorizado por:</p>
            <div className="flex w-full items-center justify-center">
              <div className="flex w-[97px] items-center  justify-center text-center">
                <Image src={Assinatura} />
              </div>
            </div>

            <hr className="border-t-2 border-black" />
            <p className="text-center text-xxs">ASSINATURA DIRETOR DE ENGENHARIA</p>
          </div>
          <div className="flex flex-col">
            <p className="ml-2 text-start text-xxs">Realizado por:</p>
            <hr className="mt-8 border-t-2 border-black" />
            <p className="text-center text-xxs">ASSINATURA TÉCNICO RESPONSÁVEL</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LaudoIntermediarioUrbano
