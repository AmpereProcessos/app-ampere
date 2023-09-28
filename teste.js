function getObjectDifference(obj1, obj2, parentKey = '') {
  const diff = {}

  for (const key in obj2) {
    const currentKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof obj2[key] === 'object' && obj2[key] !== null) {
      if (Array.isArray(obj2[key])) {
        // Handle arrays
        if (!Array.isArray(obj1[key])) {
          diff[currentKey] = obj2[key]
        } else {
          diff[currentKey] = obj2[key]
        }
      } else {
        // Handle nested objects
        const nestedDiff = getObjectDifference(obj1[key], obj2[key], currentKey)
        Object.assign(diff, nestedDiff)
      }
    } else if (!obj1 || obj1[key] !== obj2[key]) {
      diff[currentKey] = obj2[key]
    }
  }

  return diff
}
const firstObject = {
  categoria: 'OUTROS',
  favorecido: {
    nome: 'OLIVEIRA & CAMPOS MOTO E PEÇAS LTDA (ANDREIA)',
  },
  projeto: {
    id: '6353ea37e559693d01d59dda',
    nome: 'OLIVEIRA & CAMPOS MOTO E PEÇAS LTDA (ANDREIA)',
    identificador: 18,
    tipo: 'SISTEMA FOTOVOLTAICO',
  },
  descricao: 'RETRABALHO NA ESTRUTURA',
  localizacao: {
    cep: '38.300-124',
    uf: 'MG',
    cidade: 'ITUIUTABA',
    bairro: 'CENTRO',
    endereco: 'AV DEZENOVE',
    numeroOuIdentificador: 527,
  },
  responsavel: {
    nome: 'EQUIPE 4-ERICK',
    tipo: 'INTERNO',
  },
  urgencia: 'NÃO DEFINIDO',
  periodo: {
    inicio: null,
    fim: null,
  },
  pagamento: {
    recebedor: null,
    valor: null,
  },
  cobranca: {
    pagador: null,
    valor: null,
  },
  autor: {
    id: '632cb56b2410c7c32dfcb8b8',
    nome: 'Gabriel Martins',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-suporte_amp%C3%A8re?alt=media&token=aabf5e39-8cee-43b9-a0a3-ed2577b0c4d3',
  },
  equipamentos: {
    modulos: {
      modelo: null,
      qtde: 28,
      potencia: 335,
    },
    inversor: {
      modelo: null,
      qtde: 0,
      potencia: 0,
    },
    disponivel: [
      { qtde: 1, descricao: 'TESTE 1' },
      { qtde: 2, descricao: 'TESTE 2' },
    ],
    retirada: null,
  },
  detalhes: {
    possuiTrafo: null,
    topologia: 'INVERSOR',
  },
  observacoes: 'Mudar equipamento de parede',
  dataEfetivacao: '2023-03-27T18:14:29.962Z',
  dataInsercao: '2023-03-22T19:31:22.575Z',
}
const secondObject = {
  categoria: 'MONTAGEM',
  favorecido: {
    nome: 'OLIVEIRA & CAMPOS MOTO E PEÇAS LTDA (ANDREIA)',
  },
  projeto: {
    id: '6353ea37e559693d01d59dda',
    nome: 'OLIVEIRA & CAMPOS MOTO E PEÇAS LTDA (ANDREIA)',
    identificador: 18,
    tipo: 'SISTEMA FOTOVOLTAICO',
  },
  descricao: 'TESTE',
  localizacao: {
    cep: '38.300-124',
    uf: 'MG',
    cidade: 'UBERLÂNDIA',
    bairro: 'CENTRO',
    endereco: 'AV DEZENOVE',
    numeroOuIdentificador: 527,
  },
  responsavel: {
    nome: 'EQUIPE 4-ERICK',
    tipo: 'INTERNO',
  },
  urgencia: 'NÃO DEFINIDO',
  periodo: {
    inicio: null,
    fim: null,
  },
  pagamento: {
    recebedor: null,
    valor: null,
  },
  cobranca: {
    pagador: null,
    valor: null,
  },
  autor: {
    id: '632cb56b2410c7c32dfcb8b8',
    nome: 'Gabriel Martins',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-suporte_amp%C3%A8re?alt=media&token=aabf5e39-8cee-43b9-a0a3-ed2577b0c4d3',
  },
  equipamentos: {
    modulos: {
      modelo: 'DAG',
      qtde: 28,
      potencia: 335,
    },
    inversor: {
      modelo: 'DEYE',
      qtde: 1,
      potencia: 10000,
    },
    disponivel: [
      { qtde: 1, descricao: 'TESTE 1' },
      { qtde: 5, descricao: 'TESTE 2' },
      { qtde: 10, descricao: 'TESTE 4' },
    ],
    retirada: null,
  },
  detalhes: {
    possuiTrafo: null,
    topologia: 'INVERSOR',
  },
  observacoes: 'OBS TESTE',
  dataEfetivacao: '2023-03-27T18:14:29.962Z',
  dataInsercao: '2023-03-22T19:31:22.575Z',
}
const diff = getObjectDifference(firstObject, secondObject)
console.log(diff)
