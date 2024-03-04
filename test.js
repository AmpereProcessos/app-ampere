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

const responsibles = ['6318db05929e9f8731d8d9bb']

const property = {
  _id: {
    $oid: '65e5cd9b1864791818841ce9',
  },
  nome: 'CAMISAS M',
  identificador: 'M341329141',
  quantidade: 15,
  tags: ['UNIFORMES'],
  autor: {
    id: '6318db05929e9f8731d8d9bb',
    nome: 'Lucas Fernandes',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2F(6318db05929e9f8731d8d9bb)%20avatar-_l_u_c_a_s_%20_f_e_r_n_a_n_d_e_s_%20-%202024-03-01T14%3A07%3A00.625Z?alt=media&token=435e3f4e-8f9a-431a-85cc-a77e797180cd',
  },
  responsaveis: [
    {
      id: '6318db05929e9f8731d8d9bb',
      nome: 'Lucas Fernandes',
      avatar_url:
        'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2F(6318db05929e9f8731d8d9bb)%20avatar-_l_u_c_a_s_%20_f_e_r_n_a_n_d_e_s_%20-%202024-03-01T14%3A07%3A00.625Z?alt=media&token=435e3f4e-8f9a-431a-85cc-a77e797180cd',
      quantidade: 3,
      dataRecebimento: '2024-03-04T13:32:38.320Z',
    },
    {
      id: '631f832a5ba9ffa2a4cb8369',
      nome: 'Matheus Oliveira',
      avatar_url:
        'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2FavatarMatheus.jpg?alt=media&token=adb60500-22e6-4c1d-908f-72e3279fc641',
      quantidade: 10,
      dataRecebimento: '2024-03-04T13:49:07.740Z',
    },
    {
      id: '632cb56b2410c7c32dfcb8b8',
      nome: 'Gabriel Martins',
      avatar_url:
        'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-suporte_amp%C3%A8re?alt=media&token=aabf5e39-8cee-43b9-a0a3-ed2577b0c4d3',
      quantidade: 2,
      dataRecebimento: '2024-03-04T13:49:25.683Z',
    },
  ],
  dataInsercao: '2024-03-04T13:32:38.318Z',
}

console.log(property.responsaveis.some((r) => responsibles.includes(r.id)))
