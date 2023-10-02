import React, { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { fileTypes } from '../utils/constants'
import { storage } from '../utils/firebase'
import toast from 'react-hot-toast'
import { updateServiceOrder } from '../utils/methods/mutation/serviceOrders'
import { useQueryClient } from 'react-query'
import axios from 'axios'
import { getErrorMessage } from '../utils/methods/handlers'
function ConferenciaManPreventivaOS({ order, closeModal, queryKey }) {
  const queryClient = useQueryClient()
  const [finishInProgress, setFinishInProgress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [infoHolder, setInfo] = useState({
    testesCCeCA: false,
    conferenciaConectores: false,
    conferenciaGrampos: false,
    revisaoMadeiramento: false,
    anotacoes: '',
  })
  const [images, setImages] = useState({})

  const [msg, setMsg] = useState({ text: '', color: '' })

  function validateOSClosing() {
    if (!infoHolder.testesCCeCA) {
      toast.error('Por favor, preencha a execução dos testes CC e CA.')

      setLoading(false)
      return false
    }
    if (!infoHolder.conferenciaConectores) {
      toast.error('Por favor, preencha a execução da conferência dos conectores.')

      setLoading(false)
      return false
    }
    if (!infoHolder.conferenciaGrampos) {
      toast.error('Por favor, preencha a execução da conferência dos grampos.')

      setLoading(false)
      return false
    }
    if (!infoHolder.revisaoMadeiramento) {
      toast.error('Por favor, preencha a execução da revisão do madeiramento.')

      setLoading(false)
      return false
    }
    if (!images.paineisPreLimpeza) {
      toast.error('Por favor, adicione foto(s) dos painéis pré-limpeza.')

      setLoading(false)
      return false
    }
    if (!images.paineisPosLimpeza) {
      toast.error('Por favor, adicione foto(s) dos painéis pós-limpeza.')

      setLoading(false)
      return false
    }
    if (!images.kitInversor) {
      toast.error('Por favor, adicione foto(s) do quadro(s), string box (se houver) e inversor(res).')

      setLoading(false)
      return false
    }
    if (!images.infraEletromecanica) {
      toast.error('Por favor, adicione foto(s) da infraestrutura eletromecânica.')

      setLoading(false)
      return false
    }
    if (!images.sistemaLigado) {
      toast.error('Por favor, adicione foto(s) do sistema ligado.')

      setLoading(false)
      return false
    }
    if (!images.termoAssinado) {
      toast.error('Por favor, adicione foto(s) do termo assinado.')

      setLoading(false)
      return false
    }

    return true
  }
  async function uploadFiles() {
    var links = []
    try {
      if (images.paineisPreLimpeza) {
        for (let i = 0; i < images.paineisPreLimpeza.length; i++) {
          let file = images.paineisPreLimpeza.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/paineisPreLimpeza${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `PAINÉIS PRÉ-LIMPEZA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.irregularidades) {
        for (let i = 0; i < images.irregularidades.length; i++) {
          let file = images.irregularidades.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/irregularidades${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `IRREGULARIDADES (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.paineisPosLimpeza) {
        for (let i = 0; i < images.paineisPosLimpeza.length; i++) {
          let file = images.paineisPosLimpeza.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/paineisPosLimpeza${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `PAINÉIS PÓS-LIMPEZA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.irregularidadesCorrigidas) {
        for (let i = 0; i < images.irregularidadesCorrigidas.length; i++) {
          let file = images.irregularidadesCorrigidas.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/irregularidadesCorrigidas${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `IRREGULARIDADES CORRIGIDAS (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.kitInversor) {
        for (let i = 0; i < images.kitInversor.length; i++) {
          let file = images.kitInversor.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/kitInversor${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `KIT INVERSOR (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.infraEletromecanica) {
        for (let i = 0; i < images.infraEletromecanica.length; i++) {
          let file = images.infraEletromecanica.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/infraEletromecanica${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `INFRAELETROMECÂNICA LIMPA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.testesCorrenteCAeCC) {
        for (let i = 0; i < images.testesCorrenteCAeCC.length; i++) {
          let file = images.testesCorrenteCAeCC.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/testesCorrenteCAeCC${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `TESTES DE CORRENTE CA E CC (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.sistemaLigado) {
        for (let i = 0; i < images.sistemaLigado.length; i++) {
          let file = images.sistemaLigado.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/sistemaLigado${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `SISTEMA LIGADO (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.ordemServicoAssinada) {
        for (let i = 0; i < images.ordemServicoAssinada.length; i++) {
          let file = images.ordemServicoAssinada.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/ordemServicoAssinada${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `OS ASSINADA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.conferenciaCabosSolares) {
        for (let i = 0; i < images.conferenciaCabosSolares.length; i++) {
          let file = images.conferenciaCabosSolares.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/conferenciaCabosSolares${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `CONFERÊNCIA DOS CABOS SOLARES (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.conferenciaCabosCA) {
        for (let i = 0; i < images.conferenciaCabosCA.length; i++) {
          let file = images.conferenciaCabosCA.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/conferenciaCabosCA${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `CONFERÊNCIA CABOS CA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.conferenciaConectores) {
        for (let i = 0; i < images.conferenciaConectores.length; i++) {
          let file = images.conferenciaConectores.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/conferenciaConectores${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `CONFERÊNCIA CONECTORES (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.reapertoGrampos) {
        for (let i = 0; i < images.reapertoGrampos.length; i++) {
          let file = images.reapertoGrampos.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/reapertoGrampos${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `REAPERTO DOS GRAMPOS (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.conferenciaMadeiramento) {
        for (let i = 0; i < images.conferenciaMadeiramento.length; i++) {
          let file = images.conferenciaMadeiramento.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/conferenciaMadeiramento${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `CONFERÊNCIA DO MADEIRAMENTO (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.medidorConsumida) {
        for (let i = 0; i < images.medidorConsumida.length; i++) {
          let file = images.medidorConsumida.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/medidorConsumida${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `MEDIDOR (03) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.medidorInjetada) {
        for (let i = 0; i < images.medidorInjetada.length; i++) {
          let file = images.medidorInjetada.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/medidorInjetada${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `MEDIDOR (103) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.testeDAgua) {
        for (let i = 0; i < images.testeDAgua.length; i++) {
          let file = images.testeDAgua.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/testeDAgua${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `TESTE D'ÁGUA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.configuracaoConcluida) {
        for (let i = 0; i < images.configuracaoConcluida.length; i++) {
          let file = images.configuracaoConcluida.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/configuracaoConcluida${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `CONFIGURAÇÃO CONCLUIDA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (images.termoAssinado) {
        for (let i = 0; i < images.termoAssinado.length; i++) {
          let file = images.termoAssinado.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido.nome}/termoAssinado${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `TERMO ASSINADO (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      return links
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.dismiss()
      toast.error(msg)
      throw error
    }
  }
  async function updateProject({ links, projectId }) {
    try {
      await axios.put(`/api/projects/update/${projectId}`, {
        operation: {
          $push: {
            'links.manutencaoPreventiva': {
              $each: links,
            },
          },
        },
      })
      return
    } catch (error) {
      throw error
    }
  }
  async function finishOS() {
    setFinishInProgress(true)
    if (validateOSClosing()) {
      const loadingToastId = toast.loading('Processando...')
      try {
        let links = await uploadFiles()
        const currentDateTime = new Date().toISOString()
        await updateServiceOrder({
          info: { dataEfetivacao: currentDateTime, anotacoes: infoHolder.anotacoes },
          invalidateKey: queryKey,
          orderId: order._id,
          queryClient: queryClient,
        })
        if (order.projeto?.id) await updateProject({ links: links, projectId: order.projeto.id })
        toast.dismiss(loadingToastId)
        toast.success('Ordem de Serviço finalizada com sucesso !')
        closeModal()
      } catch (error) {
        setFinishInProgress(false)
        toast.dismiss(loadingToastId)
        const msg = getErrorMessage(error)
        toast.error(msg)
      }
    }
  }

  console.log(infoHolder)
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center font-bold text-[#15599a]">CONFERÊNCIA DE FECHAMENTO DA OS</h1>
      <div className="flex flex-col w-full mt-3 gap-2">
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.testesCCeCA}
            onChange={(e) => setInfo({ ...infoHolder, testesCCeCA: e.target.checked })}
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">TESTES E CONFERÊNCIAS CA E CC FEITOS ?</label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.conferenciaConectores}
            onChange={(e) =>
              setInfo({
                ...infoHolder,
                conferenciaConectores: e.target.checked,
              })
            }
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">CONFERÊNCIA DOS CONECTORES FEITA ?</label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.conferenciaGrampos}
            onChange={(e) => setInfo({ ...infoHolder, conferenciaGrampos: e.target.checked })}
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            CONFERÊNCIA DOS GRAMPOS (FINAL E/OU INTERMEDIÁRIOS) FEITA ?
          </label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.revisaoMadeiramento}
            onChange={(e) => setInfo({ ...infoHolder, revisaoMadeiramento: e.target.checked })}
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">REVISAO DO MADEIRAMENTO FEITA ?</label>
        </div>
        <div className="flex gap-2 justify-around flex-wrap">
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="padraoMontado">
              FOTO DOS PAINÉIS AINDA SUJOS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.paineisPreLimpeza ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.paineisPreLimpeza.length == 1 ? images.paineisPreLimpeza[0].name : `${images.paineisPreLimpeza[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) => {
                  setImages({
                    ...images,
                    paineisPreLimpeza: e.target.files,
                  })
                }}
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="irregularidades">
              FOTO DE IRREGULARIDADES, SE HOUVER
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.irregularidades ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.irregularidades.length == 1 ? images.irregularidades[0].name : `${images.irregularidades[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    irregularidades: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DOS PAINEIS LIMPOS</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.paineisPosLimpeza ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.paineisPosLimpeza.length == 1 ? images.paineisPosLimpeza[0].name : `${images.paineisPosLimpeza[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    paineisPosLimpeza: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DAS IRREGULARIDADES CORRIGIDAS, SE HOUVER</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.irregularidadesCorrigidas ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.irregularidadesCorrigidas.length == 1
                        ? images.irregularidadesCorrigidas[0].name
                        : `${images.irregularidadesCorrigidas[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    irregularidadesCorrigidas: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DO(S) QUADRO(S), STRING BOX (QUANDO HOUVER) E INVERSOR(ES)</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.kitInversor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.kitInversor.length == 1 ? images.kitInversor[0].name : `${images.kitInversor[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    kitInversor: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DA INFRAESTRUTURA ELETROMECANICA LIMPA</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.infraEletromecanica ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.infraEletromecanica.length == 1 ? images.infraEletromecanica[0].name : `${images.infraEletromecanica[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    infraEletromecanica: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DOS TESTES DE CORRENTE CC E CA</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.testesCorrenteCAeCC ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.testesCorrenteCAeCC.length == 1 ? images.testesCorrenteCAeCC[0].name : `${images.testesCorrenteCAeCC[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    testesCorrenteCAeCC: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DO SISTEMA LIGADO</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.sistemaLigado ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.sistemaLigado.length == 1 ? images.sistemaLigado[0].name : `${images.sistemaLigado[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    sistemaLigado: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DA ORDEM ASSINADA</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.ordemServicoAssinada ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.ordemServicoAssinada.length == 1 ? images.ordemServicoAssinada[0].name : `${images.ordemServicoAssinada[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    ordemServicoAssinada: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DO TERMO ASSINADO PELO CLIENTE</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.termoAssinado ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.termoAssinado.length == 1 ? images.termoAssinado[0].name : `${images.termoAssinado[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    termoAssinado: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO CONFERÊNCIA CABOS SOLARES</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.conferenciaCabosSolares ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.conferenciaCabosSolares.length == 1
                        ? images.conferenciaCabosSolares[0].name
                        : `${images.conferenciaCabosSolares[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    conferenciaCabosSolares: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO CONFERÊNCIA DOS CABOS CA</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.conferenciaCabosCA ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.conferenciaCabosCA.length == 1 ? images.conferenciaCabosCA[0].name : `${images.conferenciaCabosCA[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    conferenciaCabosCA: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO CONFERÊNCIA DOS MC4</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.conferenciaConectores ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.conferenciaConectores.length == 1 ? images.conferenciaConectores[0].name : `${images.conferenciaConectores[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    conferenciaConectores: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO REAPERTO DOS GRAMPOS</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.reapertoGrampos ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.reapertoGrampos.length == 1 ? images.reapertoGrampos[0].name : `${images.reapertoGrampos[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    reapertoGrampos: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO CONFERÊNCIA DO MADEIRAMENTO</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.conferenciaMadeiramento ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.conferenciaMadeiramento.length == 1
                        ? images.conferenciaMadeiramento[0].name
                        : `${images.conferenciaMadeiramento[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    conferenciaMadeiramento: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DO MEDIDOR (03)</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.medidorConsumida ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.medidorConsumida.length == 1 ? images.medidorConsumida[0].name : `${images.medidorConsumida[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    medidorConsumida: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DO MEDIDOR (103)</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.medidorInjetada ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.medidorInjetada.length == 1 ? images.medidorInjetada[0].name : `${images.medidorInjetada[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    medidorInjetada: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">VÍDEO TESTE D ÁGUA</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.testeDAgua ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.testeDAgua.length == 1 ? images.testeDAgua[0].name : `${images.testeDAgua[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    testeDAgua: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .mp4"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold">PRINT DA CONFIGURAÇÃO CONCLUIDA (SE NECESSÁRIA)</label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.configuracaoConcluida ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">
                      {images.configuracaoConcluida.length == 1 ? images.configuracaoConcluida[0].name : `${images.configuracaoConcluida[0].name}...`}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">Adicione o arquivo aqui...</span>
                  </div>
                )}
              </div>
              <input
                onChange={(e) =>
                  setImages({
                    ...images,
                    configuracaoConcluida: e.target.files,
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                multiple={true}
                accept=".png, .jpeg, .mp4"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-center text-[#15599a] font-bold">ANOTAÇÕES DA OS</h1>
          <textarea
            value={infoHolder.anotacoes}
            onChange={(e) =>
              setInfo({
                ...infoHolder,
                anotacoes: e.target.value.toUpperCase(),
              })
            }
            className={'outline-none border text-xs border-gray-200 p-2 w-full lg:w-[600px] text-center resize-none min-h-[200px]'}
          />
        </div>
      </div>

      <div className="my-2 flex items-center justify-center mt-6">
        <button
          disabled={finishInProgress}
          onClick={finishOS}
          className="border border-[#15599a] text-[#15599a] font-bold hover:text-white hover:bg-[#15599a] p-2 rounded hover:scale-105 ease-in-out duration-500 disabled:bg-gray-500 disabled:text-white disabled:opacity-70"
        >
          FINALIZAR OS
        </button>
      </div>
    </div>
  )
}

export default ConferenciaManPreventivaOS
