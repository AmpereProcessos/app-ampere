const dayjs = require('dayjs')

console.log(Math.round(dayjs('2020-11-12T08:00:00.000Z').diff('2019-11-13T08:00:00.000Z', 'days') / 365))
// const activeCreditors = [
//   'BRADESCO',
//   'CREDIPONTAL',
//   'BV FINANCEIRA',
//   'COOPACREDI',
//   'SOL FÁCIL',
//   'ITAÚ',
//   'SICREDI',
//   'CREDIPINHO',
//   'SICRED',
//   'SANTANDER',
//   null,
//   'SICOOB',
//   'SICOOB ARACOOP',
//   'OUTROS',
//   'MERCANTIL',
//   'BANCO DO BRASIL',
//   'CAIXA',
//   'SANTANDER AYMORE',
//   'CREDICAMPINA',
//   'ARACOOP',
// ]
// const serverCreditors = [
//   {
//     _id: '664393d50682736489908578',
//     identificador: 'CREDITOR',
//     valor: 'BV FINANCEIRA',
//   },
//   {
//     _id: '6643946c0682736489908579',
//     identificador: 'CREDITOR',
//     valor: 'BANCO DO BRASIL',
//   },
//   {
//     _id: '664394cd068273648990857a',
//     identificador: 'CREDITOR',
//     valor: 'BRADESCO',
//   },
//   {
//     _id: '664394d2068273648990857b',
//     identificador: 'CREDITOR',
//     valor: 'CAIXA',
//   },
//   {
//     _id: '664394fc068273648990857c',
//     identificador: 'CREDITOR',
//     valor: 'COOPACREDI',
//   },
//   {
//     _id: '66439500068273648990857d',
//     identificador: 'CREDITOR',
//     valor: 'CREDICAMPINA',
//   },
//   {
//     _id: '66439504068273648990857e',
//     identificador: 'CREDITOR',
//     valor: 'CREDIPONTAL',
//   },
//   {
//     _id: '66439509068273648990857f',
//     identificador: 'CREDITOR',
//     valor: 'SANTANDER',
//   },
//   {
//     _id: '6643950e0682736489908580',
//     identificador: 'CREDITOR',
//     valor: 'SOL FÁCIL',
//   },
//   {
//     _id: '664395120682736489908581',
//     identificador: 'CREDITOR',
//     valor: 'SICRED',
//   },
//   {
//     _id: '664395180682736489908582',
//     identificador: 'CREDITOR',
//     valor: 'SICOOB ARACOOP',
//   },
//   {
//     _id: '6643951d0682736489908583',
//     identificador: 'CREDITOR',
//     valor: 'SICOOB',
//   },
//   {
//     _id: '66a8e98fa152bdf3a1c53ac8',
//     identificador: 'CREDITOR',
//     valor: 'OUTROS',
//   },
// ]

// const missing = activeCreditors.filter((c) => !serverCreditors.map((c) => c.valor).includes(c)).map((x) => x)

// console.log(missing)
