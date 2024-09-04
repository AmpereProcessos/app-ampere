export type TDashboardStats = {
  instalacao: {
    anterior: {
      identificador: string
      valor: number
      contagem: number
    }
    atual: {
      identificador: string
      valor: number
      contagem: number
    }
  }
  homologacao: {
    anterior: {
      identificador: string
      tempoMedio: number
      potencia: number
    }
    atual: {
      identificador: string
      tempoMedio: number
      potencia: number
    }
  }
  suprimentos: {
    anterior: {
      identificador: string
      tempoMedio: number
    }
    atual: {
      identificador: string
      tempoMedio: number
    }
  }
  ranking: {
    primeiro: {
      nome: string
      potencia: number
    }
    segundo: {
      nome: string
      potencia: number
    }
    terceiro: {
      nome: string
      potencia: number
    }
    quarto: {
      nome: string
      potencia: number
    }
    quinto: {
      nome: string
      potencia: number
    }
  }
  meta: TCompanyGoalsResults
  nps: number
}

type TCompanyGoalsResultsItemValue = {
  TOTAL: number
  RANKING: {
    RESPONSAVEL: string
    TOTAL: number
  }[]
}
export type TCompanyGoalsResults = {
  'SISTEMA FOTOVOLTAICO': TCompanyGoalsResultsItemValue
  'OPERAÇÃO E MANUTENÇÃO': TCompanyGoalsResultsItemValue
  'INSIDE SALES': TCompanyGoalsResultsItemValue
  'SEGURO DE SISTEMA FOTOVOLTAICO': TCompanyGoalsResultsItemValue
  'CONSÓRCIO DE ENERGIA': TCompanyGoalsResultsItemValue
}

export type TSaleGraphStat = {
  IDENTIFICADOR: string
  VALOR: number
}

export type TBirthdayRecord = {
  nome: string
  dataNascimento: string
}
