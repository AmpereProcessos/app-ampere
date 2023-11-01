import React, { useState } from 'react'
import { BsFillSunFill } from 'react-icons/bs'
import { VscDebugBreakpointLog } from 'react-icons/vsc'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import axios from 'axios'
import { destroyCookie, setCookie } from 'nookies'
import { fileTypes, cidadesGoias } from '../../utils/constants'
import { storage } from '../../utils/services/firebase/firebase-storage'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/methods/handlers'
import { updateServiceOrder } from '../../utils/methods/mutation/serviceOrders'
import { useQueryClient } from 'react-query'

function EtapaFinalizacao({ closeModal, order, queryKey }) {
  const queryClient = useQueryClient()
  const [checkFinishingStage, setCheckFinishingStage] = useState(false)
  const [files, setFiles] = useState({})
  const [finishInProgress, setFinishInProgress] = useState(false)

  // Validating Fields
  function validateStage() {
    if (!checkFinishingStage) {
      toast.error('Por favor, preencha sobre a conferência de execução dos procedimentos dessa etapa.')

      return false
    }
    if (!files.filmagemTesteAguaDoTelhado) {
      toast.error('Por favor, anexe a filmagem do teste de água (visto do telhado).')

      return false
    }
    if (!files.filmagemPosTesteAguaNaLaje) {
      toast.error('Por favor, anexe a filmagem do teste de água (visto da laje).')

      return false
    }
    if (!files.fotoDataloggerPosConfig) {
      toast.error('Por favor, anexe foto(s) do datalogger/dtu/antena pós configuração.')

      return false
    }
    if (cidadesGoias.includes(order?.localizacao?.cidade)) {
      if (!files.fotoMedicoesStrings) {
        toast.error('Por favor, anexe foto(s) das medições de corrente e tensão CC de todas as strings.')

        return false
      }
      if (!files.fotoMedicoesCAEntrada) {
        toast.error('Por favor, anexe foto(s) das medições de tensão CA fase e linha na entrada de energia.')

        return false
      }
      if (!files.fotoMedicoesCADisjuntorAntes) {
        toast.error('Por favor, anexe foto(s) das medições de tensão CA fase e linha no quadro antes do disjuntor.')

        return false
      }
      if (!files.fotoMedicoesCADisjuntorDepois) {
        toast.error('Por favor, anexe foto(s) das medições de tensão CA fase e linha no quadro depois do disjuntor.')

        return false
      }
    }

    return true
  }

  async function uploadFiles() {
    var holder
    var links = []
    try {
      if (files.filmagemTesteAguaDoTelhado) {
        for (let i = 0; i < files.filmagemTesteAguaDoTelhado.length; i++) {
          let file = files.filmagemTesteAguaDoTelhado.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/filmagemTesteAguaDoTelhado${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FILMAGEM TESTE DA ÁGUA (VISTO DO TELHADO) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (files.filmagemPosTesteAguaNaLaje) {
        for (let i = 0; i < files.filmagemPosTesteAguaNaLaje.length; i++) {
          let file = files.filmagemPosTesteAguaNaLaje.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/filmagemPosTesteAguaNaLaje${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FILMAGEM PÓS TESTE DA ÁGUA (VISTO Da LAJE) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (files.fotoDataloggerPosConfig) {
        for (let i = 0; i < files.fotoDataloggerPosConfig.length; i++) {
          let file = files.fotoDataloggerPosConfig.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoDataloggerPosConfig${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTO/FILMAGEM DO DATALOGGER PÓS-CONFIG (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (files.fotoMedicoesStrings) {
        for (let i = 0; i < files.fotoMedicoesStrings.length; i++) {
          let file = files.fotoMedicoesStrings.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoMedicoesStrings${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTOS MEDIÇÕES DE TENSÃO E CORRENTE - STRING (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (files.fotoMedicoesCAEntrada) {
        for (let i = 0; i < files.fotoMedicoesCAEntrada.length; i++) {
          let file = files.fotoMedicoesCAEntrada.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoMedicoesCAEntrada${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTOS MEDIÇÕES TENSÃO CA FASE E LINHA (ENTRADA) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (files.fotoMedicoesCADisjuntorAntes) {
        for (let i = 0; i < files.fotoMedicoesCADisjuntorAntes.length; i++) {
          let file = files.fotoMedicoesCADisjuntorAntes.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoMedicoesCADisjuntorAntes${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTOS MEDIÇÕES TENSÃO CA FASE E LINHA (ANTES DO DISJUNTOR) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
          })
        }
      }
      if (files.fotoMedicoesCADisjuntorDepois) {
        for (let i = 0; i < files.fotoMedicoesCADisjuntorDepois.length; i++) {
          let file = files.fotoMedicoesCADisjuntorDepois.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoMedicoesCADisjuntorDepois${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTOS MEDIÇÕES TENSÃO CA FASE E LINHA (DEPOIS DO DISJUNTOR) (${i + 1})`,
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
  async function updateUser({ links, projectId }) {
    if (links.length >= 1) {
      try {
        const currentDateTime = new Date().toISOString()
        await updateServiceOrder({
          info: { dataEfetivacao: currentDateTime },
          invalidateKey: queryKey,
          orderId: order._id,
          queryClient: queryClient,
        })
        if (order.projeto?.id)
          await axios.put(`/api/projects/update/${projectId}`, {
            operation: {
              $push: {
                'links.montagem': {
                  $each: links,
                },
              },
            },
          })
      } catch (error) {
        toast.dismiss()
        const msg = getErrorMessage(error)
        toast.error(msg)
        return
      }
    }
  }
  async function finishOS() {
    if (validateStage()) {
      const loadingToastId = toast.loading('Processando...')
      setFinishInProgress(true)
      try {
        let links = await uploadFiles()
        await updateUser({ links: links, projectId: order.projeto?.id })
        toast.dismiss(loadingToastId)
        toast.success('Ordem de Serviço finalizada com sucesso !')
        destroyCookie(null, `STAGE-${order._id}`)
        closeModal()
      } catch (error) {
        toast.dismiss(loadingToastId)
        const msg = getErrorMessage(error)
        toast.error(msg)
        setFinishInProgress(false)
      }
    }
  }
  return (
    <div className="w-full flex flex-col my-2">
      <div className="flex flex-col bg-[#fead61] text-white items-center justify-between rounded-sm p-2">
        <h1 className="text-center font-bold w-full">ETAPA FINALIZAÇÃO DE OBRA</h1>
        <h1 className="text-xs font-bold text-gray-600 text-center">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO <strong className="text-[#15599a]">NOTECAM</strong>.)
        </h1>
      </div>
      <div className="flex flex-col gap-y-2 items-center my-2 py-2 border-y border-gray-200">
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex items-center self-center gap-2 font-bold">
            <VscDebugBreakpointLog style={{ color: '#15599a', fontSize: '25px' }} />
            <p className="text-gray-900">ANTES DE DESCER DO TELHADO</p>
          </div>
          <div className="flex flex-col items-center pl-5 mt-2">
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">CONFERIR SE RETIROU TODA A SOBRA DE MATERIAIS</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">ANTES DE DESCER DO TELHADO CONFERIR SE RETIROU TODAS AS FERRAMENTAS</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">ANTES DE DESCER DO TELHADO CONFERIR SE RETIROU TODO O LIXO</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">ANTES DE DESCER DO TELHADO RETIRAR TODAS AS TELHAS QUEBRADAS</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">ANTES DE DESCER DO TELHADO CONFERIR SE NÃO FICOU TELHAS ABERTAS</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">ANTES DE DESCER DO TELHADO FAZER INSPEÇÃO VISUAL SE TUDO ESTA CORRETO</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">ANTES DE SAIR DA LAJE</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />{' '}
              <p className="col-span-9 font-medium">CONFERIR SE RETIROU TODA A SOBRA DE MATERIAIS</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">CONFERIR SE RETIROU TODAS AS FERRAMENTAS</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">CONFERIR SE TODO O LIXO DA AMPÉRE FOI RETIRADO</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">FAZER INSPEÇÃO VISUAL SE TUDO ESTA CORRETO</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex items-center self-center gap-2 font-bold">
            <VscDebugBreakpointLog style={{ color: '#15599a', fontSize: '25px' }} />
            <p className="text-gray-900">LOCAL DOS INVERSORES</p>
          </div>
          <div className="flex flex-col items-center pl-5 mt-2">
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">CONFERIR SE TODA A SOBRA DE MATERIAL FORAM RETIRADAS DO LOCAL DE MONTAGEM DOS INVERSORES</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">CONFERIR SE TODAS AS FERRAMENTAS FORAM RETIRADAS DO LOCAL DA INSTALAÇÃO DOS INVERSORES</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">CONFERIR SE TODO O LIXO FOI RETIRADO DO LOCAL DA INSTALAÇÃO DOS INVERSORES</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">
                NO TÉRMINO DA MONTAGEM DOS INVERSORES, LAVAR AS MÃOS E PANOS DE LIMPEZA E REALIZAR A HIGIENIZAÇÃO DOS INVERSORES, QDG, STRING, CANOS E
                CONDULETES
              </p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">
                FAZER INSPEÇÃO VISUAL NO LOCAL DA MONTAGEM DOS INVERSORES SE ESTA TUDO CORRETO, LEMBRE-SE QUE A MONTAGEM DOS INVERSORES SÃO A VITRINE
                DA AMPÉRE
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex items-center self-center gap-2 font-bold">
            <VscDebugBreakpointLog style={{ color: '#15599a', fontSize: '25px' }} />
            <p className="text-gray-900">CASA DO CLIENTE GERAL</p>
          </div>
          <div className="flex flex-col items-center pl-5 mt-2">
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">
                CERTIFICAR-SE QUE TODOS OS LIXOS DE TODAS AS ETAPAS FORAM RETIRADOS E DESCARTADOS NOS SEUS DEVIDOS LUGARES
              </p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">CONFERIR SE PLACA DE GERAÇÃO FOI INSTALADA</p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">
                ANTES DE SAIR DA CASA DO CLIENTE FAZER UMA ULTIMA INSPEÇÃO VISUAL PRA VERIFICAR SE TUDO ESTÁ CORRETO
              </p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">
                ANTES DE SAIR DA CASA DO CLIENTE PERGUNTAR SE ESTA TUDO CORRETO OU SE PODEMOS FAZER MAIS ALGUMA COISA POR ELE
              </p>
            </div>
            <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
              <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
              <p className="col-span-9 font-medium">
                DESPEDIR-SE DO CLIENTE E FALAR PRA ELE QUE O ENGENHEIRO RESPONSÁVEL VAI FAZER UMA INSPEÇÃO E CONFIGURAÇÕES E AJUSTES FINAIS SE HOUVER
                NECESSIDADE
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input type={'checkbox'} checked={checkFinishingStage} onChange={(e) => setCheckFinishingStage(e.target.checked)} />
      </div>
      <h1 className="text-center  w-full text-[#fead61] font-bold mt-5 text-lg">FOTOS/FILMAGENS</h1>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">FILMAGEM DO TESTE DE ÁGUA (VISTO DO TELHADO)</label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.filmagemTesteAguaDoTelhado ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.filmagemTesteAguaDoTelhado.length == 1
                      ? files.filmagemTesteAguaDoTelhado[0].name
                      : `${files.filmagemTesteAguaDoTelhado[0].name}...`}
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
                setFiles({
                  ...files,
                  filmagemTesteAguaDoTelhado: e.target.files,
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
          <label className="ml-2 text-center text-[#15599a] font-bold">FILMAGEM DO PÓS TESTE DE ÁGUA (VISTO DA LAJE)</label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.filmagemPosTesteAguaNaLaje ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.filmagemPosTesteAguaNaLaje.length == 1
                      ? files.filmagemPosTesteAguaNaLaje[0].name
                      : `${files.filmagemPosTesteAguaNaLaje[0].name}...`}
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
                setFiles({
                  ...files,
                  filmagemPosTesteAguaNaLaje: e.target.files,
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
          <label className="ml-2 text-center text-[#15599a] font-bold">FOTO/FILMAGEM DA ANTENA/DATALOGGER/DTU PÓS-CONFIGURAÇÃO</label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoDataloggerPosConfig ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoDataloggerPosConfig.length == 1
                      ? files.fotoDataloggerPosConfig[0].name
                      : `${files.fotoDataloggerPosConfig[0].name}...`}
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
                setFiles({
                  ...files,
                  fotoDataloggerPosConfig: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .mp4"
            />
          </div>
        </div>
        {cidadesGoias.includes(order?.localizacao?.cidade) && (
          <>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">FOTO DAS MEDIÇÕES DE CORRENTE E TENSÃO CC DE TODAS AS STRINGS</label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesStrings ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesStrings.length == 1 ? files.fotoMedicoesStrings[0].name : `${files.fotoMedicoesStrings[0].name}...`}
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
                    setFiles({
                      ...files,
                      fotoMedicoesStrings: e.target.files,
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
              <label className="ml-2 text-center text-[#15599a] font-bold">FOTOS DE TENSÃO CA FASE E LINHA NA ENTRADA DE ENERGIA</label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesCAEntrada ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesCAEntrada.length == 1 ? files.fotoMedicoesCAEntrada[0].name : `${files.fotoMedicoesCAEntrada[0].name}...`}
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
                    setFiles({
                      ...files,
                      fotoMedicoesCAEntrada: e.target.files,
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
              <label className="ml-2 text-center text-[#15599a] font-bold">FOTOS DE TENSÃO CA FASE E LINHA NO QUADRO CA ANTES DO DISJUNTOR</label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesCADisjuntorAntes ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesCADisjuntorAntes.length == 1
                          ? files.fotoMedicoesCADisjuntorAntes[0].name
                          : `${files.fotoMedicoesCADisjuntorAntes[0].name}...`}
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
                    setFiles({
                      ...files,
                      fotoMedicoesCADisjuntorAntes: e.target.files,
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
              <label className="ml-2 text-center text-[#15599a] font-bold">FOTOS DE TENSÃO CA FASE E LINHA NO QUADRO CA DEPOIS DO DISJUNTOR</label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesCADisjuntorDepois ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesCADisjuntorDepois.length == 1
                          ? files.fotoMedicoesCADisjuntorDepois[0].name
                          : `${files.fotoMedicoesCADisjuntorDepois[0].name}...`}
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
                    setFiles({
                      ...files,
                      fotoMedicoesCADisjuntorDepois: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .mp4"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-center mt-4">
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

export default EtapaFinalizacao
