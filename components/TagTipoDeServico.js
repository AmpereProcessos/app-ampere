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
  return (
    <div className={`${getServiceTypeTagColor(tipoDeServico)} rounded-br-lg rounded-bl-lg text-center text-xs font-bold`}>
      {tipoDeServico ? tipoDeServico : 'NÃO DEFINIDO'}
    </div>
  )
}

export default TagTipoDeServico
