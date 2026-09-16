const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(file, stubs = {}) {
  const module = { exports: {} }
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText
  new Function('require', 'module', 'exports', code)((id) => (id in stubs ? stubs[id] : require(id)), module, module.exports)
  return module.exports
}

const rules = load('labor-cost.ts', {
  '@/utils/schemas/labor-costs': { LABOR_COST_METADATA_KEY: 'custo-mao-de-obra' },
})
const schemas = load('../../utils/schemas/labor-costs.ts', {
  './users': {
    AuthorSchema: require('zod').z.object({
      id: require('zod').z.string(),
      nome: require('zod').z.string(),
      avatar_url: require('zod').z.string().optional().nullable(),
    }),
  },
})

function order({ modules = 8, inverters = 2, responsibleIds = [], team = '' } = {}) {
  return {
    categoria: 'MONTAGEM',
    responsavel: { nome: team, tipo: 'INTERNO' },
    responsaveis: responsibleIds.map((id) => ({ id, nome: id })),
    equipamentos: {
      modulos: { qtde: modules },
      inversor: { qtde: inverters },
    },
  }
}

const internalConfiguration = {
  _id: 'internal-config',
  ativo: true,
  padrao: true,
  sujeito: { tipo: 'EQUIPE', chave: 'equipe-interna', nome: 'Equipe interna' },
  regra: {
    modelo: 'EQUIPE_INTERNA_DIARIA',
    valorDiaria: 560.24,
    faixas: [
      { minimoModulos: 2, maximoModulos: 8, dias: 1 },
      { minimoModulos: 9, maximoModulos: 16, dias: 2 },
    ],
  },
}

const contractorConfiguration = {
  _id: 'contractor-config',
  ativo: true,
  padrao: false,
  sujeito: { tipo: 'USUARIO', id: 'contractor', nome: 'Prestador' },
  regra: {
    modelo: 'TERCEIRO_POR_EQUIPAMENTO',
    valorPorModulo: 50,
    valorPorInversor: 50,
    excecoes: [{ quantidadeModulos: 4, valorFixo: 350 }],
  },
}

test('calcula uma diária interna para 2 a 8 módulos', () => {
  const result = rules.calculateLaborCost({
    serviceOrder: order({ modules: 8 }),
    configurations: [internalConfiguration],
    calculatedAt: '2026-01-01T00:00:00.000Z',
  })
  assert.equal(result.status, 'CALCULATED')
  assert.equal(result.total, 560.24)
  assert.equal(result.items[0].qtde, 1)
  assert.equal(result.metadata.natureza, 'APROPRIACAO_INTERNA')
})

test('calcula duas diárias internas para 9 a 16 módulos', () => {
  const result = rules.calculateLaborCost({
    serviceOrder: order({ modules: 12 }),
    configurations: [internalConfiguration],
  })
  assert.equal(result.status, 'CALCULATED')
  assert.equal(result.total, 1120.48)
  assert.equal(result.items[0].qtde, 2)
})

test('calcula terceiro por módulos e inversores', () => {
  const result = rules.calculateLaborCost({
    serviceOrder: order({ modules: 12, inverters: 3, responsibleIds: ['contractor'] }),
    configurations: [internalConfiguration, contractorConfiguration],
  })
  assert.equal(result.status, 'CALCULATED')
  assert.equal(result.total, 750)
  assert.equal(result.items.length, 2)
  assert.equal(result.metadata.natureza, 'SERVICO_TERCEIRO')
})

test('a exceção de quantidade substitui a fórmula normal', () => {
  const result = rules.calculateLaborCost({
    serviceOrder: order({ modules: 4, inverters: 1, responsibleIds: ['contractor'] }),
    configurations: [internalConfiguration, contractorConfiguration],
  })
  assert.equal(result.status, 'CALCULATED')
  assert.equal(result.total, 350)
  assert.equal(result.items.length, 1)
  assert.equal(result.metadata.calculo.excecaoAplicada.valorFixo, 350)
})

test('não escolhe silenciosamente entre dois terceiros configurados', () => {
  const secondContractor = {
    ...contractorConfiguration,
    _id: 'second-config',
    sujeito: { tipo: 'USUARIO', id: 'second', nome: 'Segundo prestador' },
  }
  const result = rules.calculateLaborCost({
    serviceOrder: order({ responsibleIds: ['contractor', 'second'] }),
    configurations: [contractorConfiguration, secondContractor],
  })
  assert.equal(result.status, 'AMBIGUOUS_CONFIGURATION')
})

test('retorna ausência de faixa sem inventar custo acima de 16 módulos', () => {
  const result = rules.calculateLaborCost({
    serviceOrder: order({ modules: 17 }),
    configurations: [internalConfiguration],
  })
  assert.equal(result.status, 'MISSING_DATA')
})

test('valida o snapshot estruturado do cálculo nos metadados', () => {
  const calculation = rules.calculateLaborCost({
    serviceOrder: order({ modules: 12, inverters: 3, responsibleIds: ['contractor'] }),
    configurations: [contractorConfiguration],
    calculatedAt: '2026-01-01T00:00:00.000Z',
  })
  assert.equal(calculation.status, 'CALCULATED')
  assert.equal(schemas.LaborCostMetadataSchema.safeParse(calculation.metadata).success, true)
})

test('rejeita metadados com uma chave não suportada', () => {
  const parsed = schemas.ExpenseMetadataSchema.safeParse({
    chave: 'custo-generico',
    versao: 1,
  })
  assert.equal(parsed.success, false)
})
