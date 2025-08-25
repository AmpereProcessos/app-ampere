import React, { useState } from 'react'

import estadosCidades from '../utils/jsons/estados-cidades.json'
import Select from 'react-select'
function EstagioDois({ next, infoHolder, setInfoHolder }) {
  const [err, setErr] = useState({ field: null, text: '' })
  function validateFields() {
    if (!infoHolder.uf) {
      setErr({
        field: 'UF',
        text: 'Oops, o Estado preenchido é inválido. Por favor, preencha um Estado ou UF válido.',
      })
      return false
    }
    if (!infoHolder.cidade) {
      setErr({
        field: 'CIDADE',
        text: 'Oops, a cidade preenchida é inválida. Por favor, preencha uma cidade válida.',
      })
      return false
    } else {
      setErr({
        field: null,
        text: '',
      })
      return true
    }
  }
  function goNext() {
    if (validateFields()) {
      next()
    }
  }
  return (
    <div className="flex h-[400px] w-full flex-col">
      <div className="flex h-[300px] w-full flex-1 grow flex-col items-center justify-center gap-3 self-stretch text-left font-normal text-[rgba(79,88,96,1)]">
        <div className="flex h-[200px] flex-col">
          <div className="flex w-[300px] flex-col items-center justify-center gap-1 lg:w-[350px]">
            <div className="flex w-full items-start self-stretch">
              <div>
                <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Selecione seu estado</p>
              </div>
            </div>
            <div className="w-full">
              <Select
                placeholder="ESTADO"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: err.field == 'UF' ? 'red' : 'gray',
                  }),
                }}
                options={estadosCidades.map((item) => {
                  return { label: item.nome, value: item.sigla }
                })}
                onChange={(item) => setInfoHolder({ ...infoHolder, uf: item.value })}
              />
              {/* <select
                type={"text"}
                value={infoHolder.uf}
                onChange={(e) => {
                  setInfoHolder({
                    ...infoHolder,
                    uf: e.target.value.toUpperCase(),
                    cidade: estadosCidades.filter(
                      (x) => x.sigla == e.target.value
                    )[0],
                  });
                }}
                className={`flex-1 ${
                  err.field == "UF"
                    ? "bg-red-200 border border-red-500"
                    : "bg-background"
                }  outline-hidden rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]`}
              >
                {estadosCidades.map((x) => (
                  <option value={x.sigla} key={x.sigla}>
                    {x.nome}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
          <div className="flex w-[300px] flex-col items-center justify-center gap-1 lg:w-[350px]">
            <div className="flex w-full items-start self-stretch">
              <div>
                <p className="m-0 w-[300px] text-[15px] leading-[1.2] lg:w-[350px]">Selecione sua cidade</p>
              </div>
            </div>
            <div className="w-full">
              <Select
                placeholder="CIDADE"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: err.field == 'CIDADE' ? 'red' : 'gray',
                  }),
                }}
                options={
                  infoHolder.uf
                    ? estadosCidades
                        .filter((x) => x.sigla == infoHolder.uf)[0]
                        .cidades.map((cidade, index) => {
                          return { label: cidade, value: cidade }
                        })
                    : []
                }
                onChange={(item) => setInfoHolder({ ...infoHolder, cidade: item.value })}
              />
              {/* <select
                value={infoHolder.cidade}
                onChange={(e) =>
                  setInfoHolder({
                    ...infoHolder,
                    cidade: e.target.value.toUpperCase(),
                  })
                }
                className={`flex-1 ${
                  err.field == "CIDADE"
                    ? "bg-red-200 border border-red-500"
                    : "bg-background"
                } outline-hidden rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]`}
              >
                {infoHolder.uf ? (
                  estadosCidades
                    .filter((x) => x.sigla == infoHolder.uf)[0]
                    .cidades.map((cidade, index) => (
                      <option value={cidade} key={index}>
                        {cidade}
                      </option>
                    ))
                ) : (
                  <option></option>
                )}
              </select> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[100px] w-full flex-col items-center justify-center gap-4 self-stretch text-center font-black text-white">
        {err.text ? <p className="text-center text-red-500 italic">{err.text}</p> : null}
        <div className="w-full">
          <div className="flex flex-1 grow flex-col items-center justify-center rounded-lg bg-linear-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] p-3 duration-300 hover:scale-[1.02]">
            <p onClick={() => goNext()} className="m-0 w-full cursor-pointer text-[19px] leading-[1.2]">
              Próximo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstagioDois
