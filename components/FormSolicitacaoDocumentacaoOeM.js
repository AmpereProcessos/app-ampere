import React, { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { fileTypes } from '../utils/constants'
import { storage } from '../utils/services/firebase/firebase-storage'
function FormSolicitacaoDocumentacaoOeM({ dados, setDados, voltar, avancar }) {
  const savingRef = dados.nomeDoProjeto ? `clientes/${dados.nomeDoProjeto}` : `formSolicitacao/${dados.nomeDoContrato}`

  const [images, setImages] = useState({})
  const [imagesMsg, setImagesMsg] = useState({
    text: '',
    color: '',
  })
  const [allChecked, setAllChecked] = useState(false)

  function validateDocuments() {
    if (!images.propostaComercial) {
      setImagesMsg({
        text: 'Por favor, anexe o arquivo da proposta comercial.',
        color: 'text-red-500',
      })
      return false
    }
    if (!images.documentoComFoto) {
      setImagesMsg({
        text: 'Por favor, anexe um documento com foto do cliente.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDaInstalacao == 'URBANO' && dados.tipoDeServico != 'OPERAÇÃO E MANUTENÇÃO' && !images.iptu) {
      setImagesMsg({
        text: 'Por favor, anexe o arquivo do IPTU.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDaInstalacao == 'RURAL' && !images.car) {
      setImagesMsg({
        text: 'Por favor, anexe o arquivo do CAR.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDaInstalacao == 'RURAL' && !images.matricula) {
      setImagesMsg({
        text: 'Por favor, anexe o arquivo da matricula.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDoTitular == 'PESSOA JURIDICA' && !images.contratoSocial) {
      setImagesMsg({
        text: 'Por favor, anexe o contrato social.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDoTitular == 'PESSOA JURIDICA' && !images.cartaoCnpj) {
      setImagesMsg({
        text: 'Por favor, anexe o cartão CNPJ.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDoTitular == 'PESSOA JURIDICA' && !images.comprovanteEnderecoRepresentante) {
      setImagesMsg({
        text: 'Por favor, anexe o comprovante de endereço do representante legal.',
        color: 'text-red-500',
      })
      return false
    }
    if (dados.tipoDoTitular == 'PESSOA JURIDICA' && !images.documentoComFotoSocios) {
      setImagesMsg({
        text: 'Por favor, anexe o documento com foto dos sócios (se necessário, junte-os em um único PDF).',
        color: 'text-red-500',
      })
      return false
    }
    setImagesMsg({ text: '', color: '' })
    return true
  }
  async function uploadDocs() {
    if (validateDocuments()) {
      var holder
      var links = []
      setImagesMsg({
        text: 'Processando...',
        color: 'text-[#15599a]',
      })
      try {
        if (images.propostaComercial) {
          var imageRef = ref(storage, `${savingRef}/propostaComercial${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.propostaComercial)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'PROPOSTA COMERCIAL',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.documentoComFoto) {
          var imageRef = ref(storage, `${savingRef}/documentoComFoto${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.documentoComFoto)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'DOCUMENTO COM FOTO',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.iptu) {
          var imageRef = ref(storage, `${savingRef}/iptu${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.iptu)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'IPTU',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.car) {
          var imageRef = ref(storage, `${savingRef}/car${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.car)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'IPTU',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.matricula) {
          var imageRef = ref(storage, `${savingRef}/matricula${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.matricula)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'IPTU',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.contratoSocial) {
          var imageRef = ref(storage, `${savingRef}/contratoSocial${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.contratoSocial)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'CONTRATO SOCIAL',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.cartaoCnpj) {
          var imageRef = ref(storage, `${savingRef}/cartaoCnpj${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.cartaoCnpj)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'CARTÃO CNPJ',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.comprovanteEnderecoRepresentante) {
          var imageRef = ref(storage, `${savingRef}/comprovanteEnderecoRepresentante${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.comprovanteEnderecoRepresentante)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'COMPROVANTE DE ENDEREÇO DO REPRESENTANTE',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
        if (images.documentoComFotoSocios) {
          var imageRef = ref(storage, `${savingRef}/documentoComFotoSocios${(Math.random() * 10000).toFixed(0)}`)
          let res = await uploadBytes(imageRef, images.documentoComFotoSocios)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: 'DOCUMENTO COM FOTO DOS SÓCIOS',
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      } catch (error) {
        holder == 'ERRO'
        setImagesMsg({
          text: 'Houve um erro no envio das imagens. Por favor, tente novamente.',
          color: 'text-green-500',
        })
      }
      if (holder === undefined) {
        setAllChecked(true)
        setDados({ ...dados, links: links })
        setImagesMsg({ text: 'Imagens enviadas!', color: 'text-green-500' })
      }
    }
  }
  console.log('DOC OEM', dados)
  console.log(dados.tipoDaInstalacao)
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DOCUMENTAÇÃO</span>
      <div className="mt-2 flex flex-wrap justify-around gap-2">
        <div className="flex w-fit flex-col items-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            PROPOSTA COMERCIAL ATUALIZADA
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.propostaComercial ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.propostaComercial.name}</span>
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
                  propostaComercial: e.target.files[0],
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center">
          <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
            DOCUMENTO COM FOTO
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {images.documentoComFoto ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">{images.documentoComFoto.name}</span>
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
                  documentoComFoto: e.target.files[0],
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        {dados.tipoDaInstalacao == 'URBANO' && dados.tipoDeServico != 'OPERAÇÃO E MANUTENÇÃO' && (
          <>
            <div className="flex w-fit flex-col items-center">
              <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
                IPTU
              </label>
              <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
                <div className="absolute">
                  {images.iptu ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">{images.iptu.name}</span>
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
                      iptu: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </>
        )}
        {dados.tipoDaInstalacao == 'RURAL' && (
          <>
            <div className="flex w-fit flex-col items-center">
              <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
                CAR
              </label>
              <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
                <div className="absolute">
                  {images.car ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">{images.car.name}</span>
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
                      car: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="flex w-fit flex-col items-center">
              <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
                MATRÍCULA
              </label>
              <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
                <div className="absolute">
                  {images.matricula ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">{images.matricula.name}</span>
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
                      matricula: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </>
        )}
        {dados.tipoDoTitular == 'PESSOA JURIDICA' && (
          <>
            <div className="flex w-fit flex-col items-center">
              <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
                CONTRATO SOCIAL
              </label>
              <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
                <div className="absolute">
                  {images.contratoSocial ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">{images.contratoSocial.name}</span>
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
                      contratoSocial: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="flex w-fit flex-col items-center">
              <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
                CARTÃO CNPJ
              </label>
              <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
                <div className="absolute">
                  {images.cartaoCnpj ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">{images.cartaoCnpj.name}</span>
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
                      cartaoCnpj: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="flex w-fit flex-col items-center">
              <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
                COMPROVANTE DE ENDEREÇO - REPRESENTANTE LEGAL
              </label>
              <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
                <div className="absolute">
                  {images.comprovanteEnderecoRepresentante ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">{images.comprovanteEnderecoRepresentante.name}</span>
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
                      comprovanteEnderecoRepresentante: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="flex w-fit flex-col items-center">
              <label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
                DOCUMENTO COM FOTO DE TODOS OS SÓCIOS
              </label>
              <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
                <div className="absolute">
                  {images.documentoComFotoSocios ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-center font-normal text-gray-400">{images.documentoComFotoSocios.name}</span>
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
                      documentoComFotoSocios: e.target.files[0],
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </>
        )}
      </div>
      {imagesMsg.text && <p className={`text-center italic ${imagesMsg.color}`}>{imagesMsg.text}</p>}
      <div className="mt-2 flex justify-center gap-2">
        <button onClick={voltar} className="rounded bg-[#15599a] p-2 font-bold text-white">
          VOLTAR
        </button>
        {allChecked ? (
          <button onClick={avancar} className="w-fit rounded bg-[#fead61] p-2 text-center font-bold hover:bg-[#15599a] hover:text-white">
            PRÓXIMA ETAPA
          </button>
        ) : (
          <button onClick={uploadDocs} className="rounded bg-[#fead61] p-2 font-bold hover:bg-[#15599a] hover:text-white">
            ENVIAR DOCUMENTOS
          </button>
        )}
      </div>
    </div>
  )
}

export default FormSolicitacaoDocumentacaoOeM
