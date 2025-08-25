import dayjs from 'dayjs'
import React, { useState } from 'react'
import { BsPatchCheckFill } from 'react-icons/bs'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoIosSend } from 'react-icons/io'

function CotacaoCard({ info, addToSolarMarket }) {
  const [infoHolder, setInfoHolder] = useState(info)
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)
  return (
    <div className="flex w-full flex-col rounded border border-[#15599a] p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-md text-primary/60 font-bold">
            {infoHolder.dataDeCotacao ? dayjs(infoHolder.dataDeCotacao).add(4, 'hours').format('DD/MM/YYYY') : null}
          </h1>
          <h1 className="text-xl font-bold text-[#15599a]">
            {infoHolder.nomeDoKit} - ({infoHolder.codigo})
          </h1>
          <h1 className="font-bold text-[#fead61]">{infoHolder.fornecedor}</h1>
          <h1 className="font-bold text-green-500">{infoHolder.potPico?.toFixed(2).replace('.', ',')} kWp</h1>
        </div>
        <div className="flex items-center gap-2">
          {!info.kitCriadoSVB ? (
            <button onClick={() => addToSolarMarket(info)} className="mt-2 rounded-lg bg-blue-200 p-1 hover:bg-blue-600 hover:text-white">
              <IoIosSend style={{ fontSize: '25px' }} />
            </button>
          ) : (
            <BsPatchCheckFill
              style={{
                fontSize: '20px',
                color: 'rgb(21 128 61)',
                marginLeft: '10px',
              }}
            />
          )}

          <h1 className="font-bold text-[#15599a]">R$ {infoHolder.valorDoKit.toFixed(2).replace('.', ',')}</h1>
          {dropdownMenuVisible ? (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
      </div>
      {dropdownMenuVisible ? (
        <div className="border-primary/20 mt-2 flex w-full flex-col border-t pt-2">
          <div className="flex w-full flex-col">
            <h1 className="w-full border border-black bg-black text-center font-bold text-white">MÓDULOS</h1>
            <div className="grid grid-cols-3 items-center border-x border-b border-black">
              <h1 className="bg-primary/60 border-r border-white p-1 text-center font-bold text-white">QTDE</h1>
              <h1 className="bg-primary/60 border-r border-white p-1 text-center font-bold text-white">FABRICANTE</h1>
              <h1 className="bg-primary/60 p-1 text-center font-bold text-white">MODELO</h1>
            </div>
            <div className="grid grid-cols-3 items-center border-x border-black">
              <h1 className="text-primary/80 border-r border-black p-1 text-center font-bold">{info.qtdeModulo}</h1>
              <h1 className="text-primary/80 border-r border-black p-1 text-center font-bold">{info.marcaModulo}</h1>
              <h1 className="text-primary/80 p-1 text-center font-bold">{info.descModulo}</h1>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <h1 className="w-full border border-black bg-black text-center font-bold text-white">INVERSORES</h1>
            <div className="grid grid-cols-3 items-center border-x border-b border-black">
              <h1 className="bg-primary/60 border-r border-white p-1 text-center font-bold text-white">QTDE</h1>
              <h1 className="bg-primary/60 border-r border-white p-1 text-center font-bold text-white">FABRICANTE</h1>
              <h1 className="bg-primary/60 p-1 text-center font-bold text-white">MODELO</h1>
            </div>
            {info.inversores?.map((inversor, index) => (
              <div key={index} className="grid grid-cols-3 items-center border-x border-black">
                <h1 className="text-primary/80 border-r border-black p-1 text-center font-bold">{inversor.qtde}</h1>
                <h1 className="text-primary/80 border-r border-black p-1 text-center font-bold">{inversor.marca}</h1>
                <h1 className="text-primary/80 p-1 text-center font-bold">{inversor.modelo}</h1>
              </div>
            ))}
          </div>
          <div className="flex w-full flex-col">
            <h1 className="w-full border border-black bg-black text-center font-bold text-white">COMPONENTES</h1>
            <div className="grid grid-cols-3 items-center border-x border-b border-black">
              <h1 className="bg-primary/60 border-r border-white p-1 text-center font-bold text-white">QTDE</h1>
              <h1 className="bg-primary/60 border-r border-white p-1 text-center font-bold text-white">INSUMO</h1>
              <h1 className="bg-primary/60 p-1 text-center font-bold text-white">TIPO</h1>
            </div>
            {info.componentes?.map((componente, index) => (
              <div key={index} className="grid grid-cols-3 items-center border-x border-b border-black">
                <h1 className="text-primary/80 border-r border-black p-1 text-center font-bold">{componente.qtde}</h1>
                <h1 className="text-primary/80 border-r border-black p-1 text-center font-bold">{componente.insumo}</h1>
                <h1 className="text-primary/80 p-1 text-center font-bold">{componente.tipo}</h1>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CotacaoCard
