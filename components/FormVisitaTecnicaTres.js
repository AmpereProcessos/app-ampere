import React, { useState } from 'react'
import SelectInput from './SelectInput'
import TextInput from './TextInput'
import TipoTelhas from '../utils/images/tipos-telhas.png'
import Image from 'next/image'
function FormVisitaTecnicaTres({ dados, setDados, images, setImages, avancar, voltar }) {
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  function validateFields() {
    if (dados.estruturaMontagem == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha a estrutura de montagem.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoEstrutura == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o tipo da estrutura.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.estruturaMontagem == 'TELHADO CONVENCIONAL') {
      if (dados.tipoTelha == 'NÃO DEFINIDO') {
        setMsg({
          text: 'Por favor, preencha o tipo da telha.',
          color: 'text-red-500',
        })
        return false
      }
      if (dados.telhasReservas == 'NÃO DEFINIDO') {
        setMsg({
          text: 'Por favor, preencha sobre a existência de telhas reservas',
          color: 'text-red-500',
        })
        return false
      }
    }
    if (dados.orientacaoEstrutura.trim().length < 3) {
      setMsg({
        text: 'Por favor, preencha a orientação da estrutura/telhado.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoEstrutura) {
      setMsg({
        text: 'Por favor, anexe a foto da estrutura',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoTelhas) {
      setMsg({
        text: 'Por favor, anexe uma foto das telhas',
        color: 'text-red-500',
      })
      return false
    }
    setMsg({ text: '', color: '' })
    return true
  }
  function goToNext() {
    if (validateFields()) {
      avancar()
    }
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] p-4 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">ESTRUTURA</span>
      <div className="mt-2 flex flex-wrap items-center justify-around gap-2">
        <SelectInput
          label={'ESTRUTURA DE MONTAGEM'}
          editable={true}
          value={dados.estruturaMontagem}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: 'TELHADO CONVENCIONAL', value: 'TELHADO CONVENCIONAL' },
            { label: 'ESTRUTURA DE SOLO', value: 'ESTRUTURA SOLO' },
            { label: 'BARRACÃO PRONTO', value: 'BARRACÃO PRONTO' },
            {
              label: 'CONSTRUIR BARRACÃO OU ESTRUTURA PERSONALIZADA',
              value: 'CONSTRUIR BARRACÃO OU ESTRUTURA PERSONALIZADA',
            },
          ]}
          handleChange={(value) => setDados({ ...dados, estruturaMontagem: value })}
        />
        <SelectInput
          label={'TIPO DA ESTRUTURA'}
          editable={true}
          value={dados.tipoEstrutura}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: 'MADEIRA', value: 'MADEIRA' },
            { label: 'FERRO', value: 'FERRO' },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoEstrutura: value })}
        />
        <SelectInput
          label={'TIPO DA TELHA (EXEMPLO ABAIXO)'}
          editable={true}
          value={dados.tipoTelha}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: 'PORTUGUESA', value: 'PORTUGUESA' },
            { label: 'FRANCESA', value: 'FRANCESA' },
            { label: 'ROMANA', value: 'ROMANA' },
            { label: 'CIMENTO', value: 'CIMENTO' },
            { label: 'ETHERNIT', value: 'ETHERNIT' },
            { label: 'SANDUÍCHE', value: 'SANDUÍCHE' },
            { label: 'AMERICANA', value: 'AMERICANA' },
            { label: 'ZINCO', value: 'ZINCO' },
            { label: 'CAPE E BICA', value: 'CAPE E BICA' },
            { label: 'LAJE', value: 'LAJE' },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoTelha: value })}
        />
        <SelectInput
          label={'CLIENTE POSSUI TELHAS RESERVAS'}
          editable={true}
          value={dados.telhasReservas}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: 'SIM', value: 'SIM' },
            { label: 'NÃO', value: 'NÃO' },
          ]}
          handleChange={(value) => setDados({ ...dados, telhasReservas: value })}
        />
        <TextInput
          label={'LINK FOTOS DO DRONE'}
          editable={true}
          placeholder="TENDO MAIS DE UM TELHADO APTO ESCREVER MAIS DE UMA"
          normalCase={true}
          value={dados.fotosDrone}
          handleChange={(value) => setDados({ ...dados, fotosDrone: value })}
        />
        <TextInput
          label={'ORIENTAÇÃO DO TELHADO (EX:10°NORTE)'}
          placeholder="TENDO MAIS DE UM TELHADO APTO ESCREVER MAIS DE UMA"
          editable={true}
          value={dados.orientacaoEstrutura}
          handleChange={(value) => setDados({ ...dados, orientacaoEstrutura: value })}
        />
      </div>
      <div className="border-primary/20 my-3 flex h-[165px] w-[300px] items-center justify-center self-center border py-2 lg:h-[250px] lg:w-[450px]">
        <Image src={TipoTelhas} />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-around gap-2">
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DA ESTRUTURA DO TELHADO
          </label>
          <p className="text-center text-xs">TIRAR FOTO POR BAIXO DO TELHADO OU DA PONTA DAS TELHAS PARA VER A ESTRUTURA, SE É MADEIRA OU FERRO</p>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoEstrutura ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoEstrutura.file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setImages({
                  ...images,
                  fotoEstrutura: {
                    title: 'FOTO DA ESTRUTURA DO TELHADO',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DAS TELHAS
          </label>
          <p className="text-center text-xs">FOTO CLARA E EXPLICATICA PARA DESENHO TÉCNICO</p>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoTelhas ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoTelhas.file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setImages({
                  ...images,
                  fotoTelhas: {
                    title: 'FOTO DAS TELHAS',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
      </div>
      {msg.text && <p className={`my-2 text-center text-sm italic ${msg.color}`}>{msg.text}</p>}
      <div className="flex items-center justify-center gap-2">
        <button onClick={voltar} className="rounded bg-blue-300 p-2 font-bold hover:bg-blue-500 hover:text-white">
          VOLTAR
        </button>
        <button onClick={goToNext} className="rounded bg-[#fead61] p-2 font-bold hover:bg-[#15599a] hover:text-white">
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  )
}

export default FormVisitaTecnicaTres
