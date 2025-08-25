import React, { useState } from 'react'
import SelectFloatingInput from './SelectFloatingInput'

function FormVisitaTecnicaOrcamentacao({ dados, setDados, uploadImages, images, setImages, sendStatus }) {
  const [imagesOK, setImagesOK] = useState(false)
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  function validateFields() {
    if (dados.tipoOrcamentacao == 'NÃO DEFINIDO' || dados.tipoOrcamentacao == null) {
      setMsg({
        text: 'Por favor, preencha o tipo de orçamentação.',
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
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">ORÇAMENTAÇÃO</span>
      <div className="mt-4 flex flex-wrap justify-around gap-2">
        <SelectFloatingInput
          label={'TIPO DE ORÇAMENTAÇÃO'}
          editable={true}
          width={'450px'}
          value={dados.tipoOrcamentacao ? dados.tipoOrcamentacao : 'NÃO DEFINIDO'}
          options={[
            { label: 'PADRÃO', value: 'PADRÃO' },
            { label: 'BARRACÃO COM TELHA', value: 'BARRACÃO COM TELHA' },
            { label: 'BARRACÃO SEM TELHA', value: 'BARRACÃO SEM TELHA' },
            { label: 'SUBESTAÇÃO', value: 'SUBESTAÇÃO' },
            {
              label: 'INFRAESTRUTURA ELÉTRICA',
              value: 'INFRAESTRUTURA ELÉTRICA',
            },
            {
              label: 'OUTRO (INDIQUE NA DESCRIÇÃO)',
              value: 'OUTRO (INDIQUE NA DESCRIÇÃO)',
            },
            { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
          ]}
          handleChange={(value) => setDados({ ...dados, tipoOrcamentacao: value })}
        />
      </div>
      <div className="flex w-full flex-col items-center text-sm lg:text-base">
        <span className="font-raleway text-center text-sm font-bold uppercase">DESCRIÇÃO PARA ORÇAMENTAÇÃO</span>
        <input
          className={`text-primary/80 w-full text-center text-xs uppercase outline-hidden`}
          value={dados.descricaoOrcamentacao}
          placeholder={'DESCREVA AQUI DETALHES DA ORÇAMENTAÇÃO'}
          onChange={(e) =>
            setDados({
              ...dados,
              descricaoOrcamentacao: e.target.value.toUpperCase(),
            })
          }
          type="text"
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="flex w-fit flex-col items-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="contaDeEnergia">
            ARQUIVOS P/ AUXÍLIO DA ORÇAMENTAÇÃO
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
                    [`orcamentacao${index + 1}-`]: {
                      title: `ORÇAMENTAÇÃO ARQUIVO ${index + 1}`,
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
      {msg.text && <p className={`text-center text-sm italic ${msg.color}`}>{msg.text}</p>}
      <div className="mt-3 flex items-center justify-center">
        <button
          disabled={sendStatus == 'loading'}
          onClick={handleSend}
          className="disabled:bg-primary/60 w-fit rounded bg-[#fead61] p-2 text-center font-bold hover:bg-[#15599a] hover:text-white"
        >
          {sendStatus == 'loading' ? 'CARREGANDO' : 'ENVIAR FORMULÁRIO'}
        </button>
      </div>
    </div>
  )
}

export default FormVisitaTecnicaOrcamentacao
