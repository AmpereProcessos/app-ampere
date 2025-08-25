import React, { useState } from 'react'
import NumberFloatingInput from './NumberFloatingInput'
import SelectFloatingInput from './SelectFloatingInput'
import TextFloatingInput from './TextFloatingInput'
import { MdOutlineAddCircle } from 'react-icons/md'
import { FiDelete } from 'react-icons/fi'

function FormVisitaTecnicaDois({ dados, setDados, images, setImages, avancar, voltar }) {
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })

  const [paInfo, setPAInfo] = useState({
    tipoDisjuntor: 'NÃO DEFINIDO',
    amperagem: 'NÃO DEFINIDO',
    numeroMedidor: '',
  })
  const [paArr, setPAArr] = useState([])
  const [paMsg, setPAMsg] = useState({
    text: '',
    color: '',
  })
  function addPA() {
    if (paInfo.tipoDisjuntor == 'NÃO DEFINIDO') {
      setPAMsg({
        text: 'Por favor, preencha a tipo do disjuntor do padrão.',
        color: 'text-red-500',
      })
      return
    }
    // if (paInfo.amperagem == "NÃO DEFINIDO") {
    //   setPAMsg({
    //     text: "Por favor, preencha a amperagem.",
    //     color: "text-red-500",
    //   });
    //   return;
    // }
    if (paInfo.numeroMedidor.trim().length < 3) {
      setPAMsg({
        text: 'Por favor, preencha um número de medidor válido.',
        color: 'text-red-500',
      })
      return
    }

    var paArrCopy = [...paArr]
    paArrCopy.push(paInfo)
    setPAArr(paArrCopy)

    var tipoArr = paArrCopy.map((i) => i.tipoDisjuntor)
    var amperagemArr = paArrCopy.map((i) => i.amperagem)
    var numeroMedidorArr = paArrCopy.map((i) => i.numeroMedidor)

    var joinedTipo = tipoArr.join('/')
    var joinedAmperagem = amperagemArr.join('/')
    var joinedNumeroMedidor = numeroMedidorArr.join('/')

    setDados((prev) => ({
      ...prev,
      tipoDisjuntor: joinedTipo,
      amperagem: joinedAmperagem,
      numeroMedidor: joinedNumeroMedidor,
    }))
    setPAInfo({
      tipoDisjuntor: 'NÃO DEFINIDO',
      amperagem: 'NÃO DEFINIDO',
      numeroMedidor: '',
    })
    setPAMsg({ text: '', color: '' })
  }

  function validateFields() {
    if (dados.amperagem == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha a amperagem.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDisjuntor == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o tipo do disjuntor.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.numeroMedidor.trim().length < 5) {
      setMsg({
        text: 'Por favor, preencha o número do medidor.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.ramalEntrada == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o ramal de entrada.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.ramalSaida == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o ramal de saida.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoPadrao == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha a posição padrão em relação a casa do cliente.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoPadrao) {
      setMsg({
        text: 'Por favor, anexe a foto do padrão',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoDisjuntor) {
      setMsg({
        text: 'Por favor, anexe a foto do disjuntor',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoCabosPadrao) {
      setMsg({
        text: 'Por favor, anexe a foto dos cabos do padrão',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoTrafo) {
      setMsg({
        text: 'Por favor, anexe a foto do transformador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoLocalizacaoTrafo) {
      setMsg({
        text: 'Por favor, anexe a foto da localização do transformador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoNumeroTrafo) {
      setMsg({
        text: 'Por favor, anexe a foto do número do transformador.',
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
  console.log(dados)
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] p-4 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">PADRÃO</span>
      <div className="flex w-full flex-col pb-4">
        <h1 className="text-center text-sm text-[#fead61] italic">Agora você pode adicionar, em casos de padrões conjugados, uma lista de itens.</h1>
        <p className="text-primary/60 text-center text-sm italic">
          Preencha as informalões e clique no <strong className="text-green-500">ícone</strong> para adicionar itens a lista.
        </p>
        <div className="mt-6 flex items-center gap-2">
          <div className="w-[30%]">
            <SelectFloatingInput
              label={'TIPO DO DISJUNTOR'}
              editable={true}
              width={'450px'}
              value={paInfo.tipoDisjuntor}
              options={[
                { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                { label: 'MONOFÁSICO', value: 'MONOFÁSICO' },
                { label: 'BIFÁSICO', value: 'BIFÁSICO' },
                { label: 'TRIFÁSICO', value: 'TRIFÁSICO' },
                { label: 'PADRÃO CONJUGADO', value: 'PADRÃO CONJUGADO' },
              ]}
              handleChange={(value) => setPAInfo((prev) => ({ ...prev, tipoDisjuntor: value }))}
            />
          </div>
          <div className="w-[30%]">
            <SelectFloatingInput
              label={'AMPERAGEM'}
              editable={true}
              width={'450px'}
              value={paInfo.amperagem}
              options={[
                { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                { label: '40A', value: '40A' },
                { label: '50A', value: '50A' },
                { label: '60A', value: '60A' },
                { label: '63A', value: '63A' },
                { label: '70A', value: '70A' },
                { label: '90A', value: '90A' },
                { label: '100A', value: '100A' },
                { label: '200A', value: '200A' },
                { label: 'PADRÃO CONJUGADO', value: 'PADRÃO CONJUGADO' },
              ]}
              handleChange={(value) => setPAInfo((prev) => ({ ...prev, amperagem: value }))}
            />
          </div>
          <div className="w-[30%]">
            <TextFloatingInput
              label={'NÚMERO DO MEDIDOR'}
              editable={true}
              width={'450px'}
              value={paInfo.numeroMedidor}
              handleChange={(value) => setPAInfo((prev) => ({ ...prev, numeroMedidor: value }))}
            />
          </div>
          <div className="w-[10%]">
            <button
              onClick={addPA}
              className="flex h-fit cursor-pointer items-center justify-center rounded bg-green-300 p-2 text-white hover:bg-green-500"
            >
              <MdOutlineAddCircle style={{ fontSize: '15px' }} />
            </button>
          </div>
        </div>
        {paMsg.text ? <p className={`text-center ${paMsg.color} text-sm italic`}>{paMsg.text}</p> : null}
        {paArr.length > 0 ? (
          paArr.map((x, index) => (
            <div key={index} className="my-1 flex items-center justify-around">
              <p className="w-[30%] text-xs font-bold">{x.tipoDisjuntor}</p>
              <p className="w-[30%] text-xs font-bold">{x.amperagem}</p>
              <p className="w-[30%] text-xs font-bold">{x.numeroMedidor}</p>
              <div className="w-[10%]">
                <button
                  onClick={() => {
                    let arr = paArr
                    arr.splice(index, 1)
                    let tipoArr = arr.map((i) => i.tipoDisjuntor)
                    let amperagemArr = arr.map((i) => i.amperagem)
                    let numeroMedidorArr = arr.map((i) => i.numeroMedidor)

                    let joinedTipo = tipoArr.join('/')
                    let joinedAmperagem = amperagemArr.join('/')
                    let joinedNumeroMedidor = numeroMedidorArr.join('/')
                    setDados({
                      ...dados,
                      tipoDisjuntor: joinedTipo,
                      amperagem: joinedAmperagem,
                      tipoDisjuntor: joinedNumeroMedidor,
                    })
                    setPAArr([...arr])
                  }}
                  className="rounded bg-red-500 p-1"
                >
                  <FiDelete style={{ fontSize: '15px' }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-primary/60 text-center italic">Sem padrões adicionados...</p>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-around gap-2">
        {/* <TextFloatingInput
          label={"PARA PADRÕES CONJUGADOS"}
          placeholder="ESCREVA: CAIXA 1 - APD1111111 - 40A MONOFÁSICO/ CAIXA 2 - APD222222 - 60A BIFÁSICO ..."
          editable={true}
          width={"450px"}
          value={dados.infoPadraoConjugado}
          handleChange={(value) =>
            setDados({ ...dados, infoPadraoConjugado: value.toUpperCase() })
          }
        /> */}
        <SelectFloatingInput
          label={'RAMAL DE ENTRADA'}
          editable={true}
          width={'450px'}
          value={dados.ramalEntrada}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: 'AÉREO', value: 'AÉREO' },
            { label: 'SUBTERRÂNEO', value: 'SUBTERRÂNEO' },
          ]}
          handleChange={(value) => setDados({ ...dados, ramalEntrada: value })}
        />
        <SelectFloatingInput
          label={'RAMAL DE SAÍDA'}
          editable={true}
          width={'450px'}
          value={dados.ramalSaida}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: 'AÉREO', value: 'AÉREO' },
            { label: 'SUBTERRÂNEO', value: 'SUBTERRÂNEO' },
          ]}
          handleChange={(value) => setDados({ ...dados, ramalSaida: value })}
        />
        <SelectFloatingInput
          label={'EM RELAÇÃO A CASA DO CLIENTE, O PADRÃO ESTÁ:'}
          editable={true}
          width={'450px'}
          value={dados.tipoPadrao}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            {
              label: 'CONTRA À REDE - POSTE DO OUTRO LADO DA RUA',
              value: 'CONTRA À REDE - POSTE DO OUTRO LADO DA RUA',
            },
            {
              label: 'À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA',
              value: 'À FAVOR DA REDE - POSTE DO MESMO LADO DA RUA',
            },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoPadrao: value })}
        />
        <NumberFloatingInput
          label={'NÚMERO DO POSTE (SOMENTE P/GOIÁS)'}
          editable={true}
          width={'450px'}
          value={dados.numeroPoste ? dados.numeroPoste : ''}
          handleChange={(value) => setDados({ ...dados, numeroPoste: Number(value) })}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-around gap-2">
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DO PADRÃO
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoPadrao ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoPadrao.file.name}</span>
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
                  fotoPadrao: {
                    title: 'FOTO DO PADRÃO',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DO DISJUNTOR
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoDisjuntor ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoDisjuntor.file.name}</span>
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
                  fotoDisjuntor: {
                    title: 'FOTO DO DISJUNTOR',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DOS CABOS DO PADRÃO
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoCabosPadrao ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoCabosPadrao.file.name}</span>
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
                  fotoCabosPadrao: {
                    title: 'FOTO DOS CABOS DO PADRÃO',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DO POSTE (SOMENTE P/ GOIÁS)
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoPoste ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoPoste.file.name}</span>
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
                  fotoPoste: {
                    title: 'FOTO DO POSTE',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
      </div>
      <h1 className="mt-4 w-full text-center font-bold text-[#fead61]">TRANSFORMADOR</h1>
      <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DO TRANSFORMADOR
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoTrafo ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoTrafo.file.name}</span>
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
                  fotoTrafo: {
                    title: 'FOTO DO TRANSFORMADOR',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DA LOCALIZAÇÃO DO TRANSFORMADOR
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoLocalizacaoTrafo ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoLocalizacaoTrafo.file.name}</span>
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
                  fotoLocalizacaoTrafo: {
                    title: 'FOTO DA LOCALIZAÇÃO DO TRAFO',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DO NÚMERO DO TRANSFORMADOR
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoNumeroTrafo ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoNumeroTrafo.file.name}</span>
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
                  fotoNumeroTrafo: {
                    title: 'FOTO DO NÚMERO DO TRANSFORMADOR',
                    file: e.target.files[0],
                  },
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
            />
          </div>
        </div>
      </div>
      {msg.text && <p className={`my-2 text-center text-sm italic ${msg.color}`}>{msg.text}</p>}
      <div className="mt-2 flex items-center justify-center gap-2">
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

export default FormVisitaTecnicaDois
