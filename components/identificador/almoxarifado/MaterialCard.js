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
      className="flex  gap-2  w-full lg:w-[400px] h-[160px]  lg:h-[150px] shadow-sm cursor-pointer border border-gray-300  hover:bg-blue-100 rounded-md"
    >
      <div className={`h-full w-[7px] ${getBarColor({ qty: material.qtde, minQty: material.qtdeMinima })} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex flex-col w-full grow p-6">
        <h1 className="text-sm lg:text-base font-bold tracking-tight leading-none">{material.nome}</h1>
        <p className="font-medium tracking-tight leading-none text-xs text-gray-500 mt-1">
          {material.nomeTecnico ? material.nomeTecnico : 'NÃO DEFINIDO'}
        </p>
        <div className="w-full flex items-center justify-center gap-2 mt-1">
          <FaMapMarkerAlt color="rgb(59,130,24)" />
          <p className="text-sm text-gray-500 font-medium">{material.localizacao || 'NÃO DEFINIDO'}</p>
        </div>
        <div className="w-full flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <FaBox color="#fead41" />
            <p className="text-xs text-gray-700 text-center">
              {material.qtde || '-'} {material.grandeza}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ImPriceTag color="rgb(34,197,94)" />
            <p className="text-xs text-gray-700 text-center">{material.preco >= 0 ? formatToMoney(material.preco) : 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 italic">
          <AiFillWarning color="rgb(239,68,68)" />
          <p className="text-gray-500 text-xs">
            MÍNIMO DE: <strong className="text-red-500">{material.qtdeMinima ? material.qtdeMinima : 'N/A'}</strong>{' '}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MaterialCard
