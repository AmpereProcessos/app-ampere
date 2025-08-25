import React, { useState } from 'react'
import SelectFloatingInput from './SelectFloatingInput'

function FormVisitaTecnicaDesenho({ dados, setDados, images, setImages, uploadImages, sendStatus }) {
  const [imagesOK, setImagesOK] = useState(false)
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  function validateFields() {
    if (dados.tipoDesenho == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o tipo de desenho a ser requisitado.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.localizacaoInstalacao?.trim().length < 5) {
      setMsg({
        text: 'Por favor, preencha uma localização válida',
        color: 'text-red-500',
      })
      return false
    }
    setMsg({ text: '', color: '' })
    return true
  }
  function handleSend() {
    if (validateFields()) {
      uploadImages()
    }
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] p-4 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DESENHO PERSONALIZADO</span>
      <div className="flex w-full flex-col items-center text-sm lg:text-base">
        <span className="font-raleway text-center text-sm font-bold uppercase">OBSERVAÇÕES PERTINENTES</span>
        <input
          className={`text-primary/80 w-full text-center text-xs outline-hidden`}
          value={dados.obsDesenho}
          placeholder={'DEIXE AQUI OBSERVAÇÕES SOBRE ESSA SOLICITAÇÃO'}
          onChange={(e) =>
            setDados({
              ...dados,
              obsDesenho: e.target.value,
            })
          }
          type="text"
        />
      </div>
      <div className="mt-4 flex items-center justify-center">
        <SelectFloatingInput
          label="TIPO DE DESENHO"
          editable={true}
          width={'450px'}
          value={dados.tipoDesenho ? dados.tipoDesenho : 'NÃO DEFINIDO'}
          options={[
            { label: 'SOLAR EDGE DESIGN', value: 'SOLAR EDGE DESIGN' },
            { label: 'REVIT 3D', value: 'REVIT 3D' },
            { label: 'AUTOCAD 2D', value: 'AUTOCAD 2D' },
            {
              label: 'APENAS VIABILIDADE DE ESPAÇO',
              value: 'APENAS VIABILIDADE DE ESPAÇO',
            },
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoDesenho: value })}
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="flex w-fit flex-col items-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="contaDeEnergia">
            FOTOS DO LOCAL DA INSTALAÇÃO
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {imagesOK ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">ARQUIVOS ADICIONADOS</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block font-normal text-gray-400">Adicione o arquivo aqui...</span>
                </div>
              )}
            </div>
            <input
              onChange={(e) => {
                let obj = {}
                Array.prototype.forEach.call(e.target.files, function (file, index) {
                  obj = {
                    ...obj,
                    [`localInstalacao${index + 1}-`]: {
                      title: `LOCAL DE INSTALAÇÃO ARQUIVO ${index + 1}`,
                      file: file,
                    },
                  }
                })
                setImagesOK(true)
                setImages({ ...images, ...obj })
                /*e.target.files.forEach((value, index) => {
                  obj = { ...obj, [`${index + 1}desenho`]: value };
                });*/
              }}
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
              multiple={true}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center text-sm lg:text-base">
        <span className="font-raleway text-center text-sm font-bold uppercase">LOCALIZAÇÃO DO LOCAL DE INSTALAÇÃO</span>
        <input
          className={`text-primary/80 w-full text-center text-xs outline-hidden`}
          value={dados.localizacaoInstalacao}
          placeholder={'DESCREVA AQUI DETALHES DA ORÇAMENTAÇÃO'}
          onChange={(e) =>
            setDados({
              ...dados,
              localizacaoInstalacao: e.target.value,
            })
          }
          type="text"
        />
      </div>
      {msg.text && <p className={`text-center text-sm italic ${msg.color}`}>{msg.text}</p>}
      <div className="mt-3 flex items-center justify-center">
        <button
          onClick={handleSend}
          disabled={sendStatus == 'loading'}
          className="disabled:bg-primary/60 w-fit rounded bg-[#fead61] p-2 text-center font-bold hover:bg-[#15599a] hover:text-white"
        >
          {sendStatus == 'loading' ? 'CARREGANDO' : 'ENVIAR FORMULÁRIO'}
        </button>
      </div>
    </div>
  )
}

export default FormVisitaTecnicaDesenho
