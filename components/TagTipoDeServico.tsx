import { cn } from '../lib/utils'
import React from 'react'
export function getServiceTypeTagColor(type) {
  var obj = {
    'SISTEMA FOTOVOLTAICO': {
      combination: 'bg-[#15599a] text-[#fead61]',
    },
    'SISTEMA FOTOVOLTAICO (OFF GRID)': {
      combination: 'bg-[#fead61] text-[#15599a]',
    },
    'AUMENTO DE SISTEMA FOTOVOLTAICO': {
      combination: 'bg-green-500 text-white',
    },
    'BOMBA SOLAR': {
      combination: 'bg-[#000066] text-white',
    },
    'OPERAÇÃO E MANUTENÇÃO': {
      combination: 'bg-[#8604c2] text-white',
    },
    'SUBESTAÇÃO DE ENERGIA': {
      combination: 'bg-[#e6e6e6] text-[#15599a]',
    },
    'SEGURO DE SISTEMA FOTOVOLTAICO': {
      combination: 'bg-[#b990e7] text-white',
    },
  }
  return obj[type] ? obj[type].combination : 'bg-black text-white'
}
function TagTipoDeServico({ tipoDeServico }) {
  function getCombination(type: string) {
    if (type == 'SISTEMA FOTOVOLTAICO') return 'bg-[#15599a] text-[#fead61]'
    if (type == 'SISTEMA FOTOVOLTAICO (OFF GRID)') return 'bg-[#fead61] text-[#15599a]'
    if (type == 'AUMENTO DE SISTEMA FOTOVOLTAICO') return 'bg-green-500 text-white'
    if (type == 'BOMBA SOLAR') return 'bg-[#000066] text-white'
    if (type == 'OPERAÇÃO E MANUTENÇÃO') return 'bg-[#8604c2] text-white'
    if (type == 'SUBESTAÇÃO DE ENERGIA') return 'bg-[#e6e6e6] text-[#15599a]'
    if (type == 'SEGURO DE SISTEMA FOTOVOLTAICO') return 'bg-[#b990e7] text-white'
    if (type == 'MONITORAMENTO') return 'bg-[#08A89F] text-white'
    return 'bg-black text-white'
  }
  return (
    <div className={cn('w-full rounded-br-lg rounded-bl-lg text-center text-xs font-bold', getCombination(tipoDeServico))}>
      {tipoDeServico ? tipoDeServico : 'NÃO DEFINIDO'}
    </div>
  )
}

export default TagTipoDeServico
