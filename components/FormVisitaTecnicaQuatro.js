import React, { useState } from 'react'
import SelectInput from './SelectInput'
import TextInput from './TextInput'

function FormVisitaTecnicaQuatro({ dados, setDados, images, setImages, uploadImages, sendStatus }) {
  const [msg, setMsg] = useState({ text: '', color: '' })
  console.log(images)
  function validateFields() {
    if (dados.localInstalacaoInversor == '' || dados.localInstalacaoInversor == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o local de instalação do inversor.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.distanciaInversorRoteador == '' || dados.distanciaInversorRoteador == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha a distância do inversor até o roteador.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoFaixada) {
      setMsg({
        text: 'Por favor, anexe a foto da faixada',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoLocalInstalacao) {
      setMsg({
        text: 'Por favor, anexe a foto do local da instalação.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.fotoQuadroDistribuicao) {
      setMsg({
        text: 'Por favor, anexe a foto do quadro de distribuição.',
        color: 'text-red-500',
      })
      return false
    }
    return true
  }
  function goToNext() {
    if (validateFields()) {
      setMsg({ text: '', color: '' })
      uploadImages()
    }
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] p-4 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">INSTALAÇÃO</span>
      <div className="mt-2 flex flex-wrap items-center justify-around gap-2">
        <SelectInput
          label={'LOCAL DE INSTALAÇÃO DO INVERSOR'}
          editable={true}
          value={dados.localInstalacaoInversor ? dados.localInstalacaoInversor : 'NÃO DEFINIDO'}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: 'MICRO-INVERSOR', value: 'MICRO-INVERSOR' },
            { label: 'LAVANDERIA', value: 'LAVANDERIA' },
            { label: 'VARANDA', value: 'VARANDA' },
            { label: 'GARAGEM', value: 'GARAGEM' },
            {
              label: 'OUTRO(DESCREVA EM OBSERVAÇÕES)',
              value: 'OUTRO(DESCREVA EM OBSERVAÇÕES)',
            },
          ]}
          handleChange={(value) => setDados({ ...dados, localInstalacaoInversor: value })}
        />
        <SelectInput
          label={'DISTÂNCIA MÉDIA DO SISTEMA FOTOVOLTAICO ATÉ O QUADRO DE DISTRIBUIÇÃO'}
          editable={true}
          value={dados.distanciaSistemaQuadro}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: '5 METROS', value: '5 METROS' },
            { label: '10 METROS', value: '10 METROS' },
            { label: '15 METROS', value: '15 METROS' },
            { label: '20 METROS', value: '20 METROS' },
            { label: '25 METROS', value: '25 METROS' },
            { label: '30 METROS', value: '30 METROS' },
          ]}
          handleChange={(value) => setDados({ ...dados, distanciaSistemaQuadro: value })}
        />
        <SelectInput
          label={'DISTÂNCIA MÉDIA DO INVERSOR ATÉ O ROTEADOR'}
          editable={true}
          value={dados.distanciaInversorRoteador}
          options={[
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            { label: '5 METROS', value: '5 METROS' },
            { label: '10 METROS', value: '10 METROS' },
            { label: '15 METROS', value: '15 METROS' },
            { label: '20 METROS', value: '20 METROS' },
          ]}
          handleChange={(value) => setDados({ ...dados, distanciaInversorRoteador: value })}
        />
        <TextInput
          label={'LOCAL DO ATERRAMENTO DO SISTEMA (SOMENTE P/GOIÁS)'}
          editable={true}
          value={dados.localAterramento ? dados.localAterramento : ''}
          handleChange={(value) => setDados({ ...dados, localAterramento: value.toUpperCase() })}
        />
      </div>
      <div className="mt-2 flex w-full flex-col items-center self-center px-2">
        <span className="font-raleway text-center text-sm font-bold uppercase">OBSERVAÇÕES SOBRE A INSTALAÇÃO</span>
        <textarea
          placeholder={'Descrição aqui..'}
          value={dados.obsInstalacao}
          onChange={(e) => setDados({ ...dados, obsInstalacao: e.target.value })}
          className="border-primary/80 h-[80px] w-full resize-none border bg-gray-200 p-2 text-center outline-hidden"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-around gap-2">
        <div className="flex w-fit flex-col items-center self-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            FOTO DA FACHADA
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoFaixada ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoFaixada.file.name}</span>
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
                  fotoFaixada: {
                    title: 'FOTO DA FACHADA',
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
            FOTO DO LOCAL DA INSTALAÇÃO DO INVERSOR OU NOVO LOCAL QUADRO DE DISTRIBUIÇÃO
          </label>
          <p className="text-center text-xs">CASO O QUADRO NÃO TENHA ESPAÇO TIRE UMA FOTO DO LOCAL NOVO DE INSTALAÇÃO</p>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoLocalInstalacao ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoLocalInstalacao.file.name}</span>
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
                  fotoLocalInstalacao: {
                    title: 'FOTO DO LOCAL DE INSTALAÇÃO DO INVERSOR',
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
            FOTO DO QUADRO DE DISTRIBUIÇÃO
          </label>
          <p className="text-center text-xs">TIRE A FOTO COM A TAMPA ABERTA PARA VISUALIZAR ESPAÇO DOS DISJUNTORES</p>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoQuadroDistribuicao ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoQuadroDistribuicao.file.name}</span>
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
                  fotoQuadroDistribuicao: {
                    title: 'FOTO DO QUADRO DE DISTRIBUIÇÃO',
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
            FOTO DO ATERRAMENTO
          </label>
          <p className="text-center text-xs">SOMENTE P/ GOIÁS</p>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.fotoAterramento ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.fotoAterramento.file.name}</span>
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
                  fotoAterramento: {
                    title: 'FOTO DO ATERRAMENTO',
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
      {msg.text && <p className={`text-center text-sm italic ${msg.color}`}>{msg.text}</p>}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={goToNext}
          disabled={sendStatus == 'loading'}
          className="disabled:bg-primary/60 rounded bg-[#fead61] p-2 font-bold hover:bg-[#15599a] hover:text-white"
        >
          {sendStatus == 'loading' ? 'CARREGANDO' : 'ENVIAR FORMULÁRIO'}
        </button>
      </div>
    </div>
  )
}

export default FormVisitaTecnicaQuatro
