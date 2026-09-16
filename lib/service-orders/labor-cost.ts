import type { TExpenseItem } from '@/utils/schemas/expenses'
import { LABOR_COST_METADATA_KEY, type TLaborCostConfigurationDTO, type TLaborCostMetadata } from '@/utils/schemas/labor-costs'
import type { TServiceOrder } from '@/utils/schemas/service-order'

export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export function normalizeLaborCostTeamKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type TLaborCostCalculationSuccess = {
  status: 'CALCULATED'
  total: number
  items: TExpenseItem[]
  metadata: TLaborCostMetadata
  configuration: TLaborCostConfigurationDTO
}

export type TLaborCostCalculationFailure = {
  status: 'UNSUPPORTED_CATEGORY' | 'MISSING_DATA' | 'NO_CONFIGURATION' | 'AMBIGUOUS_CONFIGURATION'
  message: string
}

export type TLaborCostCalculationResult = TLaborCostCalculationSuccess | TLaborCostCalculationFailure

export function resolveLaborCostConfiguration({
  serviceOrder,
  configurations,
}: {
  serviceOrder: TServiceOrder
  configurations: TLaborCostConfigurationDTO[]
}): TLaborCostConfigurationDTO | TLaborCostCalculationFailure {
  const activeConfigurations = configurations.filter((configuration) => configuration.ativo)
  const responsibleIds = new Set(serviceOrder.responsaveis.map((responsible) => responsible.id))
  const userConfigurations = activeConfigurations.filter(
    (configuration) => configuration.sujeito.tipo === 'USUARIO' && responsibleIds.has(configuration.sujeito.id)
  )

  if (userConfigurations.length > 1) {
    return {
      status: 'AMBIGUOUS_CONFIGURATION',
      message: 'Há mais de uma configuração de terceiro aplicável. Selecione o custo manualmente.',
    }
  }
  if (userConfigurations.length === 1) return userConfigurations[0]

  const teamKey = normalizeLaborCostTeamKey(serviceOrder.responsavel.nome || '')
  const teamConfiguration = activeConfigurations.find(
    (configuration) => configuration.sujeito.tipo === 'EQUIPE' && configuration.sujeito.chave === teamKey
  )
  if (teamConfiguration) return teamConfiguration

  const defaultConfigurations = activeConfigurations.filter(
    (configuration) => configuration.padrao && configuration.sujeito.tipo === 'EQUIPE' && configuration.regra.modelo === 'EQUIPE_INTERNA_DIARIA'
  )
  if (defaultConfigurations.length > 1) {
    return {
      status: 'AMBIGUOUS_CONFIGURATION',
      message: 'Há mais de uma configuração interna padrão ativa.',
    }
  }
  if (defaultConfigurations.length === 1) return defaultConfigurations[0]

  return {
    status: 'NO_CONFIGURATION',
    message: 'Nenhuma configuração de custo foi encontrada para os responsáveis ou equipe.',
  }
}

export function calculateLaborCost({
  serviceOrder,
  configurations,
  calculatedAt = new Date().toISOString(),
}: {
  serviceOrder: TServiceOrder
  configurations: TLaborCostConfigurationDTO[]
  calculatedAt?: string
}): TLaborCostCalculationResult {
  if (serviceOrder.categoria !== 'MONTAGEM') {
    return {
      status: 'UNSUPPORTED_CATEGORY',
      message: 'O cálculo automático está disponível apenas para ordens de montagem.',
    }
  }

  const moduleQuantity = Number(serviceOrder.equipamentos.modulos.qtde || 0)
  if (!Number.isInteger(moduleQuantity) || moduleQuantity <= 0) {
    return {
      status: 'MISSING_DATA',
      message: 'Informe a quantidade de módulos para calcular a mão de obra.',
    }
  }

  const resolved = resolveLaborCostConfiguration({ serviceOrder, configurations })
  if (!('regra' in resolved)) return resolved

  if (resolved.regra.modelo === 'EQUIPE_INTERNA_DIARIA' && resolved.sujeito.tipo === 'EQUIPE') {
    const range = resolved.regra.faixas.find((item) => moduleQuantity >= item.minimoModulos && moduleQuantity <= item.maximoModulos)
    if (!range) {
      return {
        status: 'MISSING_DATA',
        message: 'Não há faixa interna configurada para essa quantidade de módulos.',
      }
    }

    const total = roundMoney(range.dias * resolved.regra.valorDiaria)
    const items: TExpenseItem[] = [
      {
        descricao: 'DIÁRIA DA EQUIPE INTERNA',
        unidade: 'DIA',
        qtde: range.dias,
        preco: resolved.regra.valorDiaria,
      },
    ]
    return {
      status: 'CALCULATED',
      total,
      items,
      configuration: resolved,
      metadata: {
        chave: LABOR_COST_METADATA_KEY,
        versao: 1,
        natureza: 'APROPRIACAO_INTERNA',
        calculo: {
          modelo: 'equipe-interna-diaria',
          configuracao: {
            id: resolved._id,
            tipo: 'EQUIPE',
            chave: resolved.sujeito.chave,
            nome: resolved.sujeito.nome,
          },
          quantidadeModulos: moduleQuantity,
          faixa: { minimo: range.minimoModulos, maximo: range.maximoModulos },
          diasCalculados: range.dias,
          valorDiaria: resolved.regra.valorDiaria,
        },
        valorCalculado: total,
        calculadoEm: calculatedAt,
        ajuste: null,
      },
    }
  }

  if (resolved.regra.modelo === 'TERCEIRO_POR_EQUIPAMENTO' && resolved.sujeito.tipo === 'USUARIO') {
    const inverterQuantity = Number(serviceOrder.equipamentos.inversor.qtde || 0)
    if (!Number.isInteger(inverterQuantity) || inverterQuantity <= 0) {
      return {
        status: 'MISSING_DATA',
        message: 'Informe a quantidade de inversores para calcular o custo do terceiro.',
      }
    }

    const exception = resolved.regra.excecoes.find((item) => item.quantidadeModulos === moduleQuantity)
    const items: TExpenseItem[] = exception
      ? [
          {
            descricao: `MÃO DE OBRA - VALOR FECHADO PARA ${moduleQuantity} MÓDULOS`,
            unidade: 'SV',
            qtde: 1,
            preco: exception.valorFixo,
          },
        ]
      : [
          {
            descricao: 'CUSTO POR MÓDULOS',
            unidade: 'UN',
            qtde: moduleQuantity,
            preco: resolved.regra.valorPorModulo,
          },
          {
            descricao: 'CUSTO POR INVERSORES',
            unidade: 'UN',
            qtde: inverterQuantity,
            preco: resolved.regra.valorPorInversor,
          },
        ]
    const total = roundMoney(
      exception ? exception.valorFixo : moduleQuantity * resolved.regra.valorPorModulo + inverterQuantity * resolved.regra.valorPorInversor
    )
    return {
      status: 'CALCULATED',
      total,
      items,
      configuration: resolved,
      metadata: {
        chave: LABOR_COST_METADATA_KEY,
        versao: 1,
        natureza: 'SERVICO_TERCEIRO',
        calculo: {
          modelo: 'terceiro-por-equipamento',
          configuracao: {
            id: resolved._id,
            tipo: 'USUARIO',
            usuarioId: resolved.sujeito.id,
            nome: resolved.sujeito.nome,
          },
          quantidadeModulos: moduleQuantity,
          quantidadeInversores: inverterQuantity,
          valorPorModulo: resolved.regra.valorPorModulo,
          valorPorInversor: resolved.regra.valorPorInversor,
          excecaoAplicada: exception || null,
        },
        valorCalculado: total,
        calculadoEm: calculatedAt,
        ajuste: null,
      },
    }
  }

  return {
    status: 'NO_CONFIGURATION',
    message: 'A configuração encontrada não é compatível com o responsável selecionado.',
  }
}
