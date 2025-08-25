import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
function MaterialItem({ obj, setDados, dados, index, removeItem }) {
  const [message, setMessage] = useState('')
  return (
    <div className="flex w-full flex-col">
      <div className="grid grid-cols-9 items-center gap-3">
        <p className="text-primary/80 col-span-4 list-none text-center font-bold">{obj.nome}</p>
        <input
          type={'number'}
          disabled={true}
          className="border-primary/20 col-span-2 border p-1 text-center outline-hidden"
          value={obj.qtdeSaida ? obj.qtdeSaida : null}
          onChange={(e) => {
            let infoMaterial = dados.materiais
            infoMaterial[index].qtdeSaida = Number(e.target.value)
            setDados({
              ...dados,
              materiais: infoMaterial,
            })
          }}
        />
        <input
          type={'number'}
          disabled={dados.efetivado}
          className="border-primary/20 col-span-2 border p-1 text-center outline-hidden"
          value={obj.qtdeDevolucao ? obj.qtdeDevolucao : null}
          onChange={(e) => {
            let infoMaterial = dados.materiais
            console.log(e)
            if (Number(e.target.value) > infoMaterial[index].qtdeSaida) {
              setMessage('Número de devolução incompatível')
              infoMaterial[index].qtdeDevolucao = infoMaterial[index].qtdeSaida
              infoMaterial[index].diff = infoMaterial[index].qtdeSaida - Number(e.target.value)

              setDados({
                ...dados,
                materiais: infoMaterial,
              })
            } else if (Number(e.target.value) < 0) {
              infoMaterial[index].qtdeDevolucao = Math.abs(Number(e.target.value))
              infoMaterial[index].diff = infoMaterial[index].qtdeSaida - Math.abs(Number(e.target.value))
              setDados({
                ...dados,
                materiais: infoMaterial,
              })
            } else {
              setMessage('')
              infoMaterial[index].qtdeDevolucao = Number(e.target.value)
              infoMaterial[index].diff = infoMaterial[index].qtdeSaida - Number(e.target.value)
              setDados({
                ...dados,
                materiais: infoMaterial,
              })
            }
          }}
        />
        {dados.efetivado != true && (
          <div className="flex justify-center">
            <button
              className="col-span-1 self-center"
              onClick={() => {
                removeItem(obj, index)
              }}
            >
              <VscChromeClose style={{ color: 'red', fontSize: '15px' }} />
            </button>
          </div>
        )}
      </div>
      {message && <p className="text-center text-red-500 italic">{message}</p>}
    </div>
  )
}

export default MaterialItem
