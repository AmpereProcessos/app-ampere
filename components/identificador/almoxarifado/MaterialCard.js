import React from 'react'
import { FaBox, FaMapMarkerAlt } from 'react-icons/fa'
import { formatToMoney } from '../../../utils/constants'
import { ImPriceTag } from 'react-icons/im'
import { AiFillWarning } from 'react-icons/ai'
function getBarColor({ qty, minQty }) {
  if (!minQty) return 'bg-blue-500'
  if (qty < minQty) return 'bg-red-500'
  if (qty - minQty < 50) return 'bg-orange-400'
  return 'bg-blue-500'
}
function MaterialCard({ material, handleClick }) {
  return (
    <div
      onClick={handleClick}
      className="border-primary/20 dark:hover:bg-primary/10 flex h-[160px] w-full cursor-pointer gap-2 rounded-md border shadow-xs hover:bg-blue-100 lg:h-[150px] lg:w-[400px]"
    >
      <div className={`h-full w-[7px] ${getBarColor({ qty: material.qtde, minQty: material.qtdeMinima })} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex w-full grow flex-col p-6">
        <h1 className="text-sm leading-none font-bold tracking-tight lg:text-base">{material.nome}</h1>
        <p className="text-primary/60 mt-1 text-xs leading-none font-medium tracking-tight">
          {material.nomeTecnico ? material.nomeTecnico : 'NÃO DEFINIDO'}
        </p>
        <div className="mt-1 flex w-full items-center justify-center gap-2">
          <FaMapMarkerAlt color="rgb(59,130,24)" />
          <p className="text-primary/60 text-sm font-medium">{material.localizacao || 'NÃO DEFINIDO'}</p>
        </div>
        <div className="mt-4 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBox color="#fead41" />
            <p className="text-primary/70 text-center text-xs">
              {material.qtde || '-'} {material.grandeza}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ImPriceTag color="rgb(34,197,94)" />
            <p className="text-primary/70 text-center text-xs">{material.preco >= 0 ? formatToMoney(material.preco) : 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 italic">
          <AiFillWarning color="rgb(239,68,68)" />
          <p className="text-primary/60 text-xs">
            MÍNIMO DE: <strong className="text-red-500">{material.qtdeMinima ? material.qtdeMinima : 'N/A'}</strong>{' '}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MaterialCard
