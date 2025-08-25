import axios from 'axios'
import dayjs from 'dayjs'
import { useSession } from '../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import React, { useContext, useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import Select from 'react-select'
import { cidadesAtendidas, tiposDeServico, vendedores } from '../../utils/constants'
import { AnimatePresence, motion } from 'framer-motion'
import { FaUserAlt } from 'react-icons/fa'
import { allSellers } from '../../utils/select-options'
function renderShowClientsButtonStyles(show) {
  if (!show) return 'bg-primary/20 text-primary/20 border border-primary/20 hover:bg-blue-100 dark:hover:bg-primary/10 hover:text-blue-400'
  else return 'bg-blue-100 text-blue-400 hover:bg-primary/20 hover:text-primary/20 border border-primary/20'
}

function Acompanhamento() {
  const router = useRouter()
  const { session, status } = useSession({ required: true })
  const [showClientsNames, setShowClientsNames] = useState(false)
  const [info, setInfo] = useState([])
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
    field1: null,
    field2: null,
  })
  const [filters, setFilters] = useState({
    vendedorFilter: [],
    cidadeFilter: [],
    tipoDeServicoFilter: [],
    regionalFilter: 'GERAL',
    tipoVendaFilter: 'GERAL',
  })
  function getInfo() {
    axios.get('/api/report').then((res) => setInfo(res.data))
  }
  function getPotenciaVendida() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.contrato.status == 'ASSINADO')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    var sum = 0
    for (let i = 0; i < filteredArr.length; i++) {
      let pot = !isNaN(filteredArr[i].sistema?.potPico) ? filteredArr[i].sistema.potPico : 0
      sum = sum + Number(pot)
    }
    return sum.toFixed(2)
  }
  function getPotenciaHomologada() {
    var filteredArr = info
    filteredArr = filteredArr.filter(
      (x) => x.homologacao.acesso.dataResposta != null && x.homologacao.acesso.dataResposta != undefined && x.homologacao.acesso.dataResposta != '-'
    )
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    var sum = 0
    for (let i = 0; i < filteredArr.length; i++) {
      let pot = !isNaN(filteredArr[i].sistema?.potPico) ? filteredArr[i].sistema.potPico : 0
      sum = sum + Number(pot)
    }
    return sum.toFixed(2)
  }
  function getPotenciaInstalada() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.obra?.statusDaObra == 'CONCLUIDA')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    var sum = 0
    for (let i = 0; i < filteredArr.length; i++) {
      let pot = !isNaN(filteredArr[i].sistema?.potPico) ? filteredArr[i].sistema.potPico : 0
      sum = sum + Number(pot)
    }
    return sum.toFixed(2)
  }
  function getObrasFinalizadas() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.obra?.statusDaObra == 'CONCLUIDA')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    return filteredArr.length
  }
  function getTempoMedioDeAprovacao() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.homologacao.status != 'CANCELADO' && x.obra.statusDaObra != 'OBRA CANCELADA')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    var sum = 0
    for (let i = 0; i < filteredArr.length; i++) {
      let diff = dayjs(filteredArr[i].homologacao.acesso.dataResposta).diff(filteredArr[i].homologacao.acesso.dataSolicitacao, 'day')
      if (isNaN(diff)) {
        sum = sum
      } else {
        sum = sum + diff
      }
    }

    return (sum / filteredArr.length).toFixed(2)
  }

  function getTempoMedioDeInstalacao() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.obra?.statusDaObra == 'CONCLUIDA')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    var sum = 0
    for (let i = 0; i < filteredArr.length; i++) {
      let diff = dayjs(filteredArr[i].obra.saida).diff(filteredArr[i].obra.entrada, 'day')
      if (isNaN(diff)) {
        sum = sum
      } else {
        sum = sum + diff
      }
    }
    return (sum / filteredArr.length).toFixed(2)
  }
  function getNps() {
    var filteredArr = info
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    let promotores = filteredArr.filter((x) => x.nps >= 9)
    let detratores = filteredArr.filter((x) => x.nps != null && x.nps <= 6)
    let consultasTotais = filteredArr.filter((x) => x.nps != null && x.nps >= 0 && x.nps <= 10)
    return (((promotores.length - detratores.length) * 100) / consultasTotais.length).toFixed(2)
  }
  function getTotalVendido() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.contrato?.status == 'ASSINADO')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    var totalSum = 0
    for (var i = 0; i < filteredArr.length; i++) {
      let projeto = !isNaN(filteredArr[i].sistema?.valorProjeto) ? filteredArr[i].sistema.valorProjeto : 0
      let padrao = !isNaN(filteredArr[i].padrao?.valor) ? filteredArr[i].padrao?.valor : 0
      let estrutura = !isNaN(filteredArr[i].estruturaPersonalizada?.valor) ? filteredArr[i].estruturaPersonalizada.valor : 0
      let oem = !isNaN(filteredArr[i].oem?.valor) ? filteredArr[i].oem.valor : 0
      console.log(filteredArr[i].nomeDoContrato, projeto, padrao, estrutura, oem)
      totalSum = Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura) + Number(oem)
    }
    return {
      total: totalSum,
      ticketMedio: Number((totalSum / filteredArr.length).toFixed(2)),
      vendas: filteredArr.length,
    }
  }
  function getCustos() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.contrato.status == 'ASSINADO')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }
    var sumValorDoKit = 0
    var sumCustoInsumos = 0
    var sumPrevInsumos = 0
    var countCustoNotInformed = 0
    for (let i = 0; i < filteredArr.length; i++) {
      let valorDoKit = !isNaN(filteredArr[i].compra?.valorDoKit) ? filteredArr[i].compra.valorDoKit : 0
      let prevInsumos = !isNaN(filteredArr[i].material?.previsaoCustos) ? filteredArr[i].material.previsaoCustos : 0
      let custoInsumos = !isNaN(filteredArr[i].material?.efetivoCustos) ? filteredArr[i].material.efetivoCustos : 0
      // if (isNaN(filteredArr[i].material?.efetivoCustos)) {
      //   countCustoNotInformed = countCustoNotInformed + 1;
      //   console.log(filteredArr[i].material?.efetivoCustos);
      // }

      sumValorDoKit = sumValorDoKit + valorDoKit
      sumCustoInsumos = sumCustoInsumos + custoInsumos
      sumPrevInsumos = sumPrevInsumos + prevInsumos
    }
    return {
      totalValorDoKit: sumValorDoKit,
      totalPrevCustos: sumPrevInsumos,
      totalEfetivoCustos: sumCustoInsumos,
      // porcentagemCustoNaoPreenchido: countCustoNotInformed / filteredArr.length,
    }
  }
  function renderClients() {
    var filteredArr = info
    filteredArr = filteredArr.filter((x) => x.homologacao.status != 'CANCELADO' && x.obra.statusDaObra != 'OBRA CANCELADA')
    if (dateFilter.after && dateFilter.before && dateFilter.field1 != null) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter(
        (x) => x[dateFilter.field1][dateFilter.field2] >= dateFilter.after && x[dateFilter.field1][dateFilter.field2] <= dateFilter.before
      )
    }
    if (filters.tipoVendaFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      if (filters.tipoVendaFilter == 'SOMENTE VENDEDOR') {
        filteredArr = filteredArr.filter((item) => !item.insider)
      }
      if (filters.tipoVendaFilter == 'ATRAVÉS DE INSIDE') {
        filteredArr = filteredArr.filter((item) => item.insider != null && item.insider != 'NÃO DEFINIDO')
      }
    }
    if (filters.vendedorFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.vendedorFilter.includes(call.vendedor.nome))
    }
    if (filters.cidadeFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((call) => filters.cidadeFilter.includes(call.cidade))
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((item) => filters.tipoDeServicoFilter.includes(item.tipoDeServico))
    }
    if (filters.regionalFilter != 'GERAL') {
      if (!filteredArr) filteredArr = info
      filteredArr = filteredArr.filter((x) => x.regional == filters.regionalFilter)
    }

    return (
      <div className="flex w-full flex-col">
        <h1 className="text-center font-medium text-[#fead61]">
          {filteredArr.length > 1 ? `${filteredArr.length} CLIENTES` : `${filteredArr.length} CLIENTE`}
        </h1>
        {filteredArr.map((item, index) => (
          <div key={index} className="flex w-full items-center gap-2 py-1 font-medium">
            <FaUserAlt style={{ color: '#15599a' }} />
            <h1>{item.nomeDoContrato}</h1>
          </div>
        ))}
      </div>
    )
  }
  useEffect(() => {
    if (session) {
      const userHasAcess = !!session?.user.permissoes.gestao.visualizarResultados
      if (userHasAcess) return getInfo()
      else router.push('/')
    }
  }, [session])

  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="border-primary/20 flex flex-col items-center border-b py-2">
        <h1 className="font-raleway text-2xl font-bold text-[#15599a]">RESULTADOS AMPÈRE</h1>
        <div className="flex items-center justify-around gap-2 py-2">
          <Select
            isMulti
            placeholder="VENDEDORES"
            onChange={(e) =>
              setFilters({
                ...filters,
                vendedorFilter: e.map((x) => x.value),
              })
            }
            options={allSellers.map((vendedor) => {
              return { label: vendedor.label, value: vendedor.value }
            })}
          />
          <Select
            isMulti
            placeholder="CIDADES"
            onChange={(e) =>
              setFilters({
                ...filters,
                cidadeFilter: e.map((x) => x.value),
              })
            }
            options={cidadesAtendidas.map((cidade) => {
              return { label: cidade, value: cidade }
            })}
          />
          <Select
            isMulti
            placeholder="TIPO DE SERVIÇO"
            onChange={(e) =>
              setFilters({
                ...filters,
                tipoDeServicoFilter: e.map((x) => x.value),
              })
            }
            options={tiposDeServico.map((tipo) => tipo)}
          />
          <select
            value={filters.regionalFilter}
            onChange={(e) => setFilters({ ...filters, regionalFilter: e.target.value })}
            className="text-primary/80 border-primary/20 h-[36px] rounded-sm border p-2 text-center font-semibold outline-hidden"
          >
            <option value={'GERAL'}>GERAL</option>
            <option value={'REGIONAL ITUIUTABA'}>REGIONAL ITUIUTABA</option>
            <option value={'REGIONAL UBERLÂNDIA'}>REGIONAL UBERLÂNDIA</option>
          </select>
          <select
            value={filters.tipoVendaFilter}
            onChange={(e) => setFilters({ ...filters, tipoVendaFilter: e.target.value })}
            className="text-primary/80 border-primary/20 h-[36px] rounded-sm border p-2 text-center font-semibold outline-hidden"
          >
            <option value={'GERAL'}>VENDAS GERAIS</option>
            <option value={'SOMENTE VENDEDOR'}>SOMENTE VENDEDOR</option>
            <option value={'ATRAVÉS DE INSIDE'}>ATRAVÉS DE INSIDE</option>
          </select>
          <div className="hidden gap-x-2 lg:flex">
            <div className="flex w-fit flex-col items-center">
              <span className="font-raleway text-center text-sm font-bold uppercase">Depois de:</span>
              <input
                className="text-primary/80 w-full text-center text-xs uppercase outline-hidden"
                type="date"
                value={dateFilter.after && new Date(dateFilter.after).toISOString().slice(0, 10)}
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    after: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>
            <div className="flex w-fit flex-col items-center">
              <span className="font-raleway text-center text-sm font-bold uppercase">Antes de:</span>
              <input
                className="text-primary/80 w-full text-center text-xs uppercase outline-hidden"
                type="date"
                value={dateFilter.before && new Date(dateFilter.before).toISOString().slice(0, 10)}
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    before: isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>
            <Select
              isMulti={false}
              placeholder={'CAMPO DE FILTRO'}
              options={[
                { label: 'SAÍDA DE OBRA', value: 'obra.saida' },
                {
                  label: 'DATA DO PARECER',
                  value: 'homologacao.acesso.dataResposta',
                },
                { label: 'ASS.CONTRATO', value: 'contrato.dataAssinatura' },
                { label: 'DATA DE PAGAMENTO', value: 'compra.dataPagamento' },
                { label: 'NÃO DEFINIDO', value: null },
              ]}
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  field1: e.value != null ? e.value.split('.')[0] : null,
                  field2: e.value != null ? e.value.split('.')[1] : null,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end py-2">
        <button
          onClick={() => setShowClientsNames((prev) => !prev)}
          className={`flex items-center gap-2 rounded p-1 font-medium ${renderShowClientsButtonStyles(showClientsNames)}`}
        >
          <p>MOSTRAR CLIENTES</p>
          {showClientsNames ? <AiFillEye /> : <AiFillEyeInvisible />}
        </button>
      </div>
      <AnimatePresence>
        {showClientsNames ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 border-primary/20 flex h-fit max-h-[400px] w-full flex-col self-center overflow-y-auto border p-2 lg:w-[50%]"
          >
            {renderClients()}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid w-full grid-cols-1 grid-rows-10 gap-y-2 lg:grid-cols-10 lg:grid-rows-1 lg:gap-x-3">
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">Obras finalizadas</h1>
          </div>
          <p className="flex grow items-center justify-center text-center text-2xl font-bold text-[#fead61]">{getObrasFinalizadas()} obras</p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">Potência Pico instalada</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{getPotenciaInstalada()} kWp</p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">Potência Pico homologada</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{getPotenciaHomologada()} kWp</p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">TEMPO MÉDIO PARA INSTALAÇÃO</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{getTempoMedioDeInstalacao()} dias</p>
        </div>
        <div className="bg-background border-primary/20 col-span-2 flex h-[250px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">TEMPO MÉDIO DE APROVAÇÃO</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#fead61]">{getTempoMedioDeAprovacao()} dias</p>
        </div>
      </div>
      <div className="grid grid-cols-1 grid-rows-5 gap-x-3 lg:grid-cols-5 lg:grid-rows-1">
        <div className="col-span- bg-background border-primary/20 flex h-[300px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">Nº DE VENDAS</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#15599a]">{getTotalVendido().vendas}</p>
        </div>
        <div className="col-span- bg-background border-primary/20 flex h-[300px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">Potência Pico Vendida</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#15599a]">{getPotenciaVendida()} kWp</p>
        </div>
        <div className="bg-background border-primary/20 col-span-1 flex h-[300px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">TOTAL VENDIDO</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#15599a]">
            R$ {getTotalVendido().total.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-background border-primary/20 col-span-1 flex h-[300px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">TICKET MÉDIO</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#15599a]">
            R$ {getTotalVendido().ticketMedio.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-background border-primary/20 col-span-1 flex h-[300px] flex-col border p-4 shadow-xl">
          <h1 className="text-primary/80 text-center text-xl">NPS</h1>
          <div className="flex grow items-center justify-center">
            <div className="h-[150px] w-[150px]">
              <CircularProgressbar
                styles={buildStyles({
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: 'butt',
                  // Text size
                  textSize: '12px',
                  // How long animation takes to go from one percentage to another, in seconds
                  pathTransitionDuration: 0.5,

                  // Can specify path transition in more detail, or remove it entirely
                  // pathTransition: 'none',

                  // Colors
                  pathColor: `#15599a`,
                  textColor: '#15599a',
                  trailColor: '#d6d6d6',
                  backgroundColor: '#3e98c7',
                })}
                value={Number(getNps())}
                text={`${getNps()}%`}
                strokeWidth={6}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 grid-rows-2 gap-x-3 lg:grid-cols-2 lg:grid-rows-1">
        <div className="col-span- bg-background border-primary/20 flex h-[300px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">TOTAL PAGO EM KITS</h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#15599a]">
            R$ {getCustos().totalValorDoKit.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="col-span- bg-background border-primary/20 flex h-[300px] flex-col border p-4 shadow-xl">
          <div className="flex justify-between">
            <h1 className="text-primary/80 uppercase">TOTAL GASTOS EM INSUMOS</h1>
            <h1 className={`font-bold ${getCustos().totalEfetivoCustos / getCustos().totalPrevCustos > 1 ? 'text-red-500' : 'text-green-500'}`}>
              {((getCustos().totalEfetivoCustos * 100) / getCustos().totalPrevCustos).toFixed(2).replace('.', ',')} %
            </h1>
          </div>
          <p className="flex grow items-center justify-center text-2xl font-bold text-[#15599a]">
            R$ {getCustos().totalEfetivoCustos.toLocaleString('pt-BR')}
          </p>
          <div className="flex flex-col">
            {/* <p>
                PORCENTAGEM DE NÃO PREENCHIMENTO:{" "}
                <strong>
                  {(getCustos().porcentagemCustoNaoPreenchido * 100).toFixed()}%
                </strong>
              </p> */}
            <p>
              TOTAL PREVISTO EM INSUMOS <strong className="text-[#fead61]">R$ {getCustos().totalPrevCustos.toLocaleString('pt-BR')}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Acompanhamento
