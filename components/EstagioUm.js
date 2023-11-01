import React, { useState } from 'react'

function EstagioUm({ next, infoHolder, setInfoHolder }) {
  const [err, setErr] = useState('')
  function validateFields() {
    if (infoHolder.valorFatura < 30) {
      setErr('Oops, valor de fatura inválido. Por favor, confira o valor preenchido.')
    } else {
      setErr('')
      return true
    }
  }
  function goNext() {
    if (validateFields()) {
      next()
    }
  }
  return (
    <div className="flex flex-col h-[400px] w-full">
      <div className="flex flex-col items-center text-center h-[300px]">
        <div className="flex flex-col justify-center items-center w-[300px] lg:w-[350px] h-[146px]">
          <div className="w-full leading-none relative">
            <p className="font-normal inline m-0 text-[19px] leading-[1.2] text-[rgba(79,88,96,1)]">
              Simule a economia que você terá com um{' '}
              <strong className="font-black inline m-0 text-[19px] leading-[1.2] text-[rgba(21,89,154,1)]">Sistema Ampère de Energia Solar</strong>!
            </p>
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center font-normal w-[300px] lg:w-[350px] h-[300px]">
          <div className="w-full flex items-center text-[rgba(79,88,96,1)] ">
            <p className="m-0 w-[365px] text-[15px] leading-[1.2]">Qual o valor da sua conta de energia?</p>
          </div>
          <div className="w-full text-[rgba(3,11,19,1)]">
            <div className={`${err ? 'bg-red-200 border border-red-500' : 'bg-white'}  flex items-center rounded-lg p-3 shadow-sm`}>
              <p className="m-0 text-[19px] leading-[1.2]">R$</p>
              <input
                value={infoHolder.valorFatura}
                type={'number'}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) {
                    setInfoHolder({ ...infoHolder, valorFatura: 0 })
                  } else {
                    setErr('')
                    setInfoHolder({
                      ...infoHolder,
                      valorFatura: Number(e.target.value),
                    })
                  }
                }}
                className={`bg-transparent outline-none flex-grow text-center`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-white text-center font-black h-[100px]">
        {err ? <p className="text-center italic text-red-500">{err}</p> : null}
        <div className="w-full">
          <div className="flex-1 flex flex-col justify-center items-center flex-grow rounded-lg p-3 bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] hover:scale-[1.02] duration-300">
            <p onClick={() => goNext()} className="w-full m-0 text-[19px] leading-[1.2] cursor-pointer">
              Próximo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstagioUm
