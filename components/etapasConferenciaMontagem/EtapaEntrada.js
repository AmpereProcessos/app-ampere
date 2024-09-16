import React, { useState } from 'react'
import { BsFillSunFill } from 'react-icons/bs'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import axios from 'axios'
import { setCookie } from 'nookies'
import { fileTypes } from '../../utils/constants'
import { storage } from '../../utils/services/firebase/firebase-storage'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/methods/handlers'
function EtapaEntrada({ next, order }) {
  const [checkEnterStage, setCheckEnterStage] = useState(false)
  const [files, setFiles] = useState({})
  const [inProgress, setInProgress] = useState(false)
  function validateStage() {
    if (!checkEnterStage) {
      toast.error('Por favor, preencha a sobre a execução das conferências dessa etapa.')
      return false
    }
    if (!files.fotoConjuntoEscada) {
      toast.error('Por favor, anexa um foto do conjunto escada (escada amarrada, cones, corrente e placa de alerta).')
      return false
    }
    return true
  }
  async function updateUser({ links, projectId }) {
    if (links.length >= 1) {
      try {
        let { data } = await axios.put(`/api/projects/update/${projectId}`, {
          operation: {
            $push: {
              'links.montagem': {
                $each: links,
              },
            },
          },
        })
        return 'Arquivos vinculados ao projeto com sucesso !'
      } catch (error) {
        throw error
      }
    }
  }
  async function uploadFiles() {
    var holder
    var links = []
    try {
      if (files.fotoConjuntoEscada) {
        for (let i = 0; i < files.fotoConjuntoEscada.length; i++) {
          let file = files.fotoConjuntoEscada.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoConjuntoEscada${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTO CONJUNTO ESCADA (${i + 1})`,
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
  async function goNextStage() {
    if (validateStage()) {
      setInProgress(true)
      const loadingToastId = toast.loading('Processando...')
      try {
        let links = await uploadFiles()
        if (order.projeto?.id) await updateUser({ links: links, projectId: order.projeto.id })
        toast.dismiss(loadingToastId)
        toast.success('Arquivos enviados com sucesso !')
        setCookie(null, `STAGE-${order._id}`, '1')
        setInProgress(false)
        return next()
      } catch (error) {
        setInProgress(false)
        toast.dismiss(loadingToastId)
        const msg = getErrorMessage(error)
        toast.error(msg)
      }
    }
  }
  return (
    <div className="my-2 flex w-full flex-col">
      <div className="flex flex-col items-center justify-between bg-[#fead61] py-2 text-white">
        <h1 className="w-full text-center font-bold">ETAPA ENTRADA NA OBRA</h1>
        <p className="px-2 text-[0.6rem] font-bold italic text-gray-600 lg:text-xs">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO <strong className="text-[#15599a]">NOTECAM</strong>.)
        </p>
      </div>
      <div className="my-2 flex flex-col items-center gap-y-2 border-y border-gray-200 py-2">
        <div className="flex w-full items-center gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="font-medium">DESENHO DA MONTAGEM NO TELHADO EM MÃOS</p>
        </div>
        <div className="flex w-full items-center gap-2 lg:w-[60%]">
          <BsFillSunFill className="col-span-1" style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="font-medium">DIAGRAMA UNIFILAR EM MÃOS</p>
        </div>
        <div className="flex w-full items-center gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="font-medium">DESENHO DA MONTAGEM DO INVERSOR EM MÃOS</p>
        </div>
        <div className="flex w-full items-center gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="font-medium">CONFERÊNCIA DAS FERRAMENTAS NECESSÁRIAS FEITA</p>
        </div>
        <div className="flex w-full items-center gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="font-medium">EM POSSE DOS EPIs</p>
        </div>
        <div className="flex w-full items-center gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="font-medium">EM POSSE DA ESCADA</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input type={'checkbox'} checked={checkEnterStage} onChange={(e) => setCheckEnterStage(e.target.checked)} />
      </div>
      <h1 className="mt-5  w-full text-center text-lg font-bold text-[#fead61]">FOTOS/FILMAGENS</h1>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex w-fit flex-col items-center">
          <label className="ml-2 text-center font-bold text-[#15599a]">
            FOTO DO CONJUNTO ESCADA (ESCADA AMARRADA, CONES, CORRENTE E PLACA DE ALERTA)
          </label>
          <div className="relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2">
            <div className="absolute">
              {files.fotoConjuntoEscada ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">
                    {files.fotoConjuntoEscada.length == 1 ? files.fotoConjuntoEscada[0].name : `${files.fotoConjuntoEscada[0].name}...`}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block font-normal text-gray-400">Adicione o arquivo aqui...</span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setFiles({
                  ...files,
                  fotoConjuntoEscada: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <button
          disabled={inProgress}
          onClick={goNextStage}
          className="rounded border border-[#15599a] p-2 font-bold text-[#15599a] duration-500 ease-in-out disabled:bg-gray-500 disabled:text-white disabled:opacity-70 hover:scale-105 hover:bg-[#15599a] hover:text-white"
        >
          PRÓXIMO
        </button>
      </div>
    </div>
  )
}

export default EtapaEntrada
