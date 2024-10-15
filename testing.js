const status = [
  'INDEFINIDO',
  'AGUARDANDO LIBERAÇÃO',
  'AGUARDANDO PAGAMENTO',
  'PENDÊNCIA COMERCIAL',
  'PENDÊNCIA OPERACIONAL',
  'PENDÊNCIA EXTERNA',
  'CONCLUÍDA',
]
console.log(status.map((s, index) => ({ id: index + 1, label: s, value: s })))
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

const x = {
  empresa: 'SIPAG',
  modalidade: 'COM ANTECIPAÇÃO',
  opcoes: [
    {
      descricao: 'VISA/MASTER',
      parcelas: {
        1: 3.41,
        2: 4.7,
        3: 5.59,
        4: 6.47,
        5: 7.37,
        6: 8.26,
        7: 9.5,
        8: 10.41,
        9: 11.32,
        10: 12.24,
        11: 13.16,
        12: 14.09,
      },
    },
    {
      descricao: 'ELO',
      parcelas: {
        1: 3.83,
        2: 5.13,
        3: 6.02,
        4: 6.91,
        5: 7.8,
        6: 8.71,
        7: 9.84,
        8: 10.75,
        9: 11.66,
        10: 12.59,
        11: 13.51,
        12: 14.44,
      },
    },
  ],
}

console.log(JSON.stringify(x))
