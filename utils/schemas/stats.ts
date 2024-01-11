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
  nps: number
}
export type TSaleGraphStat = {
  IDENTIFICADOR: string
  VALOR: number
}

export type TBirthdayRecord = {
  nome: string
  dataNascimento: string
}
