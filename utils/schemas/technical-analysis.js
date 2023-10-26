import { z } from 'zod'
import {
  inverterFixationOptions,
  roofTiles,
  structureTypes,
  technicalAnalysisPendencyCategories,
  technicalAnalysisSolicitationTypes,
  units,
} from '../select-options'

export const GeneralTechnicalAnalysisSchema = z.object({
  _id: z.string().optional(),
  nome: z.string(),
  status: z.string(), // create a list of options
  complexidade: z.union([z.literal('SIMPLES'), z.literal('INTERMEDIÁRIO'), z.literal('COMPLEXO')]),
  pendencias: z
    .array(
      z.object({
        categoria: z.enum(technicalAnalysisPendencyCategories.map((t) => t.value)),
        descricao: z.string(),
        responsavel: z.string().optional().nullable(),
        dataFinalizacao: z.string().optional().nullable(),
        finalizado: z.boolean(),
      })
    )
    .optional()
    .nullable(),
  anotacoes: z.string(), // anotações gerais para auxilio ao analista
  tipoSolicitacao: z
    .enum(technicalAnalysisSolicitationTypes.map((t) => t.value))
    .nullable()
    .optional(),
  observacoesSolicitacao: z.string().optional().nullable(), // observacoes da solicitação (por parte do vendedor)
  analista: z
    .object({
      id: z.union([z.string(), z.number()]).optional(),
      nome: z.string(),
      apelido: z.string(),
      avatar_url: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  requerente: z.object({
    idCRM: z.string().optional().nullable(),
    nomeCRM: z.string().optional().nullable(),
    apelido: z.string(),
    avatar_url: z.string().optional().nullable(),
    contato: z.string().optional().nullable(), // telefone
  }),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string(),
    identificador: z.string().optional().nullable(),
  }),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string().optional().nullable(),
    cidade: z.string(),
    bairro: z.string(),
    endereco: z.string(),
    numeroOuIdentificador: z.string(),
    distancia: z.number().optional().nullable(),
  }),
  equipamentos: z.object({
    modulos: z.object({
      modelo: z.string().nullable(),
      qtde: z.string().nullable(),
      potencia: z.string().nullable(),
    }),
    inversor: z.object({
      modelo: z.string().nullable(),
      qtde: z.string().nullable(),
      potencia: z.string().nullable(),
    }),
  }),
  padrao: z.array(
    z.object({
      alteracao: z.boolean(),
      tipo: z.union([z.literal('CONTRA À REDE'), z.literal('À FAVOR DA REDE')]),
      tipoEntrada: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]),
      tipoSaida: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]),
      amperagem: z.string(),
      ligacao: z.string(), // MONO BI TRI
      novaAmperagem: z.string().optional().nullable(),
      novaLigacao: z.string().optional().nullable(),
      codigoMedidor: z.string(),
      modeloCaixaMedidor: z.string(),
      codigoPosteDerivacao: z.string().optional().nullable(), // GO only
    })
  ),
  transformador: z.object({
    acopladoPadrao: z.boolean().optional().nullable(),
    codigo: z.string(),
    potencia: z.number(),
  }),
  execucao: z.object({
    observacoes: z.string().optional().nullable(),
    memorial: z
      .array(
        z.object({
          topico: z.string(), // avaliar telhado, adaptar qgbt, etc
          descricao: z.string(),
        })
      )
      .optional()
      .nullable(),
    espacoQGBT: z.boolean(),
  }),
  descritivo: z.array(z.object({ topico: z.string(), descricao: z.string() })),
  servicosAdicionais: z.object({
    alambrado: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    britagem: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    casaDeMaquinas: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    barracao: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    roteador: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    limpezaLocal: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    redeReligacao: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    terraplanagem: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    realimentar: z.boolean(),
  }),
  detalhes: z.object({
    concessionaria: z.string(),
    topologia: z
      .union([z.literal('MICRO-INVERSOR'), z.literal('INVERSOR')])
      .optional()
      .nullable(),
    materialEstrutura: z
      .union([z.literal('MADEIRA'), z.literal('FERRO')])
      .optional()
      .nullable(),
    tipoEstrutura: z.string(),
    tipoTelha: z
      .enum(roofTiles.map((t) => t.value))
      .optional()
      .nullable(),
    fixacaoInversores: z
      .enum(inverterFixationOptions.map((o) => o.value))
      .optional()
      .nullable(),
    imagensDrone: z.boolean(),
    imagensFachada: z.boolean(),
    imagensSatelite: z.boolean(),
    medicoes: z.boolean(),
    orientacao: z.string(),
    telhasReservas: z
      .union([z.literal('NÃO'), z.literal('SIM')])
      .optional()
      .nullable(),
  }),
  distancias: z.object({
    conexaoInternet: z.string(),
    cabeamentoCA: z.string(), // inversor ao padrão
    cabeamentoCC: z.string(), // modulos ao inversor
  }),
  locais: z.object({
    aterramento: z.string().optional().nullable(),
    inversor: z.string(), // instalação do inversor, varannda, garagem, etc
    modulos: z.string(), // instalação dos módulos, telhado, solo em x, solo em y, etc
  }),
  custos: z.array(
    z.object({
      categoria: z
        .union([z.literal('INSTALAÇÃO'), z.literal('PADRÃO'), z.literal('ESTRUTURA'), z.literal('OUTROS')])
        .optional()
        .nullable(),
      descricao: z.string(),
      qtde: z.number(),
      grandeza: z.enum(units.map((u) => u.value)),
      custoUnitario: z.number().optional().nullable(),
      total: z.number().optional().nullable(),
    })
  ),
  arquivos: z.array(
    z.object({
      descricao: z.string(),
      url: z.string(),
      formato: z.string(),
    })
  ),
  alocacaoModulos: z.object({
    leste: z.number().optional().nullable(),
    nordeste: z.number().optional().nullable(),
    noroeste: z.number().optional().nullable(),
    norte: z.number().optional().nullable(),
    oeste: z.number().optional().nullable(),
    sudeste: z.number().optional().nullable(),
    sudoeste: z.number().optional().nullable(),
    sul: z.number().optional().nullable(),
  }),
  desenho: z.object({
    observacoes: z.string(),
    tipo: z.string().optional().nullable(), //
    url: z.string().optional().nullable(),
  }),
  suprimentos: z
    .object({
      observacoes: z.string(),
      itens: z.array(
        z.object({
          descricao: z.string(),
          tipo: z.string(),
          qtde: z.number(),
          grandeza: z.string(),
        })
      ),
    })
    .optional()
    .nullable(),
  conclusao: z.object({
    // UTILIZADO PELOS VENDEDORES
    observacoes: z.string(),
    espaco: z.boolean(), // possui espaço pra execução
    inclinacao: z.boolean(), // necessitará estrutura de inclinação
    sombreamento: z.boolean(), // possui sombra
    padrao: z
      .union([z.literal('APTO'), z.literal('REFORMAR'), z.literal('TROCAR')])
      .optional()
      .nullable(),
    estrutura: z
      .union([z.literal('APTO'), z.literal('CONDENADO'), z.literal('REFORÇAR'), z.literal('AVALIAR NA EXECUÇÃO')])
      .optional()
      .nullable(),
  }),
  dataInsercao: z.string().datetime(),
  dataEfetivacao: z.string().datetime().optional().nullable(),
})
