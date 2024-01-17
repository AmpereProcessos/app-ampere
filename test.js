const dayjs = require('dayjs')
const z = require('zod')

function getFirstDayOfYearString({ year, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  var firstDay = currentDate.startOf('year')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
function getFirstDayOfMonth({ year, month, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.startOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}
function getLastDayOfMonth({ year, month, resetHour = true }) {
  var currentDate = dayjs()
  if (year) currentDate = currentDate.set('year', year)
  if (month) currentDate = currentDate.set('month', month - 1)
  var firstDay = currentDate.endOf('month')
  if (resetHour) firstDay = firstDay.subtract(3, 'hour')
  return firstDay.toISOString()
}

const initialYear = 2020
const currentYear = 2024
const arr = Array.from({ length: currentYear - initialYear + 1 }, (_, index) => initialYear + index)
const max = Math.max.apply(null, arr)
console.log(max)

const obj = {
  'jornada.assDocumentacoes': 'PENDENTE ASS.DOCUMENTOS',
  'jornada.boasVindas': 'PENDENTE BOAS VINDAS',
  'jornada.compraDoKit': 'PENDENTE COMPRA DO KIT',
  'jornada.entregaDoKit': 'PENDENTE ENTREGA DO KIT',
  'jornada.entregaTecnica': 'PENDENTE ENTREGA TÉCNICA',
  'jornada.instalacaoAgendada': 'PENDENTE INSTALAÇÃO AGENDADA',
  'jornada.instalacaoRealizada': 'PENDENTE INSTALAÇÃO REALIZADA',
  'jornada.jornadaConcluida': 'JORNADA NÃO CONCLUÍDA',
  'jornada.nfFaturada': 'PENDENTE NF FATURADA',
  'jornada.prevChegada': 'PENDENTE PREVISÃO DE CHEGADA',
  'jornada.respConcessionaria': 'PENDENTE RESP.CONCESSIONÁRIA',
  'jornada.sistemaLigado': 'PENDENTE SISTEMA LIGADO',
  'jornada.vistoriaConcessionaria': 'PENDENTE VISTORIA',
}

const Options = Object.entries(obj).map(([key, value], index) => {
  return { id: index + 1, label: value, value: key }
})

console.log(Options)
