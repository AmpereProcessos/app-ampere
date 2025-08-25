import React, { useState } from 'react'
import { MdOutlineAddCircle } from 'react-icons/md'
import Select from 'react-select'
import NumberFloatingInput from '../../NumberFloatingInput'
import TextFloatingInput from '../../TextFloatingInput'

function AddMaterialFormulario({ materials, materialsFetching, addMaterial }) {
  const [mode, setMode] = useState('ESTOCÁVEIS') // ESTOCÁVEIS | NÃO ESTOCÁVEIS

  const [infoHolder, setInfoHolder] = useState({
    nome: '',
    id: null,
    qtdeSaida: null,
    qtdeEstoque: null,
    grandeza: '',
    precoUnit: null,
  })
  function resetState() {
    setInfoHolder({
      nome: '',
      id: null,
      qtdeSaida: null,
      grandeza: '',
      precoUnit: null,
    })
  }
  console.log(infoHolder)
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-center gap-2">
        <button
          onClick={() => {
            resetState()
            setMode('ESTOCÁVEIS')
          }}
          className={`w-fit rounded border border-[#15599a] p-2 text-center font-bold ${mode == 'ESTOCÁVEIS' ? 'bg-[#15599a] text-white' : 'bg-transparent text-[#15599a]'} `}
        >
          ESTOCÁVEIS
        </button>
        <button
          onClick={() => {
            resetState()
            setMode('NÃO ESTOCÁVEIS')
          }}
          className={`w-fit rounded border border-[#fead41] p-2 text-center font-bold ${mode == 'NÃO ESTOCÁVEIS' ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'} `}
        >
          NÃO ESTOCÁVEIS
        </button>
      </div>
      {mode == 'ESTOCÁVEIS' ? (
        <div className="mt-2 flex w-full flex-col items-center gap-4 lg:flex-row lg:gap-2">
          <div className="w-full lg:w-[50%]">
            <Select
              isMulti={false}
              placeholder="MATERIAL"
              styles={{
                control: (base, state) => ({
                  ...base,
                  width: '100%',
                  minHeight: '41px',
                }),
              }}
              onChange={(e) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  nome: e.value.nome,
                  id: e.value.id,
                  precoUnit: e.value.preco,
                  grandeza: e.value.grandeza,
                  qtdeEstoque: e.value.qtdeEstoque,
                }))
              }
              isLoading={materialsFetching}
              loadingMessage={'Carregando...'}
              options={materials?.map((material) => {
                return {
                  label: material.nome,
                  value: {
                    id: material._id,
                    nome: material.nome,
                    preco: material.preco,
                    grandeza: material.grandeza,
                    qtdeEstoque: material.qtde,
                  },
                }
              })}
            />
          </div>
          <input
            placeholder="QTDE"
            type="number"
            value={infoHolder.qtdeSaida}
            className="border-primary/20 h-[41px] w-full border text-center outline-hidden lg:w-[30%]"
            onChange={(e) =>
              setInfoHolder((prev) => ({
                ...prev,
                qtdeSaida: Number(e.target.value),
                qtdeDevolucao: 0,
              }))
            }
          />
          <div
            onClick={() => {
              if (addMaterial(infoHolder)) resetState()
              // addMaterial(infoHolder);
              // resetState();
            }}
            className="col-span-1 flex h-[41px] w-full cursor-pointer items-center justify-center rounded bg-green-300 font-bold text-white hover:bg-green-500 lg:w-[20%]"
          >
            <MdOutlineAddCircle style={{ fontSize: '25px' }} />
          </div>
        </div>
      ) : null}
      {mode == 'NÃO ESTOCÁVEIS' ? (
        <div className="mt-2 flex w-full flex-col items-center gap-4 lg:flex-row lg:gap-2">
          <div className="w-full lg:w-[50%]">
            <TextFloatingInput
              label={'NOME OU DESCRIÇÃO'}
              editable={true}
              value={infoHolder.nome}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
              width={'100%'}
              marginBottom={'0px'}
            />
          </div>
          <div className="w-full lg:w-[10%]">
            <TextFloatingInput
              label={'GRANDEZA'}
              editable={true}
              value={infoHolder.grandeza}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, grandeza: value }))}
              width={'100%'}
              marginBottom={'0px'}
            />
          </div>
          <div className="w-full lg:w-[10%]">
            <NumberFloatingInput
              label={'PREÇO UNITÁRIO'}
              editable={true}
              value={infoHolder.precoUnit}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  precoUnit: Number(value),
                }))
              }
              width={'100%'}
              marginBottom={'0px'}
            />
          </div>
          <div className="w-full lg:w-[10%]">
            <NumberFloatingInput
              label={'QUANTIDADE'}
              editable={true}
              value={infoHolder.qtdeSaida}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  qtdeSaida: Number(value),
                }))
              }
              width={'100%'}
              marginBottom={'0px'}
            />
          </div>
          <button
            onClick={() => {
              addMaterial(infoHolder)
            }}
            className="col-span-1 flex h-[41px] w-full cursor-pointer items-center justify-center rounded bg-green-300 font-bold text-white hover:bg-green-500 lg:w-[20%]"
          >
            <MdOutlineAddCircle style={{ fontSize: '25px' }} />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default AddMaterialFormulario
