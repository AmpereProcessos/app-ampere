import React, { useEffect, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { fileTypes } from '../utils/constants'
import { storage } from '../utils/firebase'
import Select from 'react-select'
import { MdOutlineAddCircle } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { updateServiceOrder } from '../utils/methods/mutation/serviceOrders'
import { getErrorMessage } from '../utils/methods/handlers'
function ConferenciaPadraoOS({ order, closeModal, queryKey }) {
  const queryClient = useQueryClient()
  const [finishInProgress, setFinishInProgress] = useState(false)
  const [infoHolder, setInfo] = useState({
    realimentacaoFeita: false,
    ramalPassado: false,
    anotacoes: '',
  })

  const [images, setImages] = useState({})

  const [msg, setMsg] = useState({ text: '', color: '' })

  function validateOSClosing() {
    if (!infoHolder.anotacoes || infoHolder.anotacoes?.trim().length < 5) {
      toast.error(
        'Por favor, adicione anotações acerca da OS, dificultades encontradas, se o ramal não foi passado, o tamanho de ramal a ser levado e afins.'
      )

      return false
    }
    if (!images.padraoMontado) {
      toast.error('Por favor, adicione uma foto do padrão montado.')

      return false
    }
    if (!images.ligacoesFeitas) {
      toast.error("'Por favor, adicione uma foto das ligações feitas.")

      return false
    }
    if (!images.disjuntor) {
      toast.error('Por favor, adicione uma foto do disjuntor do padrão pós-montagem.')

      return false
    }

    return true
  }
  async function uploadFiles() {
    var links = []
    try {
      if (images.padraoMontado) {
        var imageRef = ref(storage, `clientes/${order.favorecido.nome}/padraoMontado`)
        let res = await uploadBytes(imageRef, images.padraoMontado)
        let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
        links.push({
          title: 'PADRÃO MONTADO',
          link: url,
          format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
        })
      }
      if (images.ligacoesFeitas) {
        var imageRef = ref(storage, `clientes/${order.favorecido.nome}/ligacoesFeitas`)
        let res = await uploadBytes(imageRef, images.ligacoesFeitas)
        let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
        links.push({
          title: 'LIGAÇÕES FEITAS',
          link: url,
          format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
        })
      }
      if (images.disjuntor) {
        var imageRef = ref(storage, `clientes/${order.favorecido.nome}/disjuntorPadrao`)
        let res = await uploadBytes(imageRef, images.disjuntor)
        let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
        links.push({
          title: 'DISJUNTOR DO PADRÃO',
          link: url,
          format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
        })
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
            'links.padrao': {
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
      setFinishInProgress(true)
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

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-center font-bold text-[#15599a]">CONFERÊNCIA DE FECHAMENTO DA OS</h1>
      <div className="flex flex-col w-full mt-3 gap-2">
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.realimentacaoFeita}
            onChange={(e) => setInfo({ ...infoHolder, realimentacaoFeita: e.target.checked })}
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">REALIMENTAÇÃO FEITA ?</label>
        </div>
        <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-full justify-center p-2">
          <input
            checked={infoHolder.ramalPassado}
            onChange={(e) => setInfo({ ...infoHolder, ramalPassado: e.target.checked })}
            type="checkbox"
            value=""
            className="outline-none"
          />
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">RAMAL PASSADO ?</label>
        </div>
        <div className="flex gap-2 justify-around flex-wrap">
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="padraoMontado">
              FOTO DO PADRÃO MONTADO
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.padraoMontado ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">{images.padraoMontado.name}</span>
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
                    padraoMontado: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="ligacoesFeitas">
              FOTO DAS LIGAÇÕES FEITAS
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.ligacoesFeitas ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">{images.ligacoesFeitas.name}</span>
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
                    ligacoesFeitas: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
              />
            </div>
          </div>
          <div className="w-fit flex flex-col items-center">
            <label className="ml-2 text-center text-[#15599a] font-bold" htmlFor="ligacoesFeitas">
              FOTO DO DISJUNTOR
            </label>
            <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
              <div className="absolute">
                {images.disjuntor ? (
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal text-center">{images.disjuntor.name}</span>
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
                    disjuntor: e.target.files[0],
                  })
                }
                className="h-full w-full opacity-0"
                type="file"
                accept=".png, .jpeg, .pdf"
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

export default ConferenciaPadraoOS
