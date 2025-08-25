import React, { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import axios from 'axios'
import { setCookie } from 'nookies'
import { BsFillSunFill } from 'react-icons/bs'
import { fileTypes } from '../../utils/constants'
import { storage } from '../../utils/services/firebase/firebase-storage'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/methods/handlers'
import { createManyFileReferences } from '../../utils/methods/mutation/crm/file-references'

function EtapaLancamentoCabosConexos({ session, next, order }) {
  const [checkCableLayingStage, setCheckCableLayingStage] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [files, setFiles] = useState({})

  // Validating Fields
  function validateStage() {
    if (!checkCableLayingStage) {
      toast.error('Por favor, preencha sobre a conferência de execução dos procedimentos dessa etapa.')

      return false
    }
    if (!files.fotoCabeamentoLaje) {
      toast.error('Por favor, anexe fotos/filmages do cabeamento CA lançado na laje.')
      return false
    }
    if (!files.fotoConexaoSistemaRede) {
      toast.error('Por favor, anexe foto(s) da conexão do sistema solar com a rede elétrica do cliente (no quadro, ou, se foi necessário, no ramal).')

      return false
    }

    return true
  }

  async function uploadFiles() {
    var holder
    var links = []
    try {
      if (files.fotoCabeamentoLaje) {
        for (let i = 0; i < files.fotoCabeamentoLaje.length; i++) {
          let file = files.fotoCabeamentoLaje.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoCabeamentoLaje${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          const size = res.metadata.size
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTO/FILMAGEM DO CABEAMENTO CA LANÇADO (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
            size,
          })
        }
      }
      if (files.fotoConexaoSistemaRede) {
        for (let i = 0; i < files.fotoConexaoSistemaRede.length; i++) {
          let file = files.fotoConexaoSistemaRede.item(i)
          var imageRef = ref(storage, `clientes/${order.favorecido?.nome}/fotoConexaoSistemaRede${i + 1}`)
          let res = await uploadBytes(imageRef, file)
          const size = res.metadata.size
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          links.push({
            title: `FOTO/FILMAGEM CONEXÃO SISTEMA-REDE (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
            size,
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
        const fileReferences = links.map((l) => ({
          titulo: l.title,
          categorias: ['SERVIÇOS'],
          formato: l.format,
          url: l.link,
          tamanho: l.size,
          idProjeto: order.projeto?.id,
          idOrdemServico: order._id,

          autor: { id: session?.user.id, nome: session?.user.nome, avatar_url: session?.user.avatar_url },
          dataInsercao: new Date().toISOString(),
        }))
        await createManyFileReferences({ info: fileReferences })

        // if (order.projeto?.id) await updateUser({ links: links, projectId: order.projeto.id })
        toast.dismiss(loadingToastId)
        toast.success('Arquivos enviados com sucesso!')
        setCookie(null, `STAGE-${order._id}`, '3')
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
      <div className="flex flex-col items-center justify-between bg-[#fead61] p-2 text-white">
        <h1 className="w-full text-center font-bold">ETAPA LANÇAMENTO DOS CABOS CC E CA E SUAS CONEXÕES</h1>
        <p className="text-primary/80 text-xs font-bold italic">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO <strong className="text-[#15599a]">NOTECAM</strong>.)
        </p>
      </div>
      <div className="border-primary/20 my-2 flex flex-col items-center gap-y-2 border-y py-2">
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">LANÇAMENTO DE CABOS, FIXAÇÃO DE ROLDANAS, ELETRODUTOS, MANGUEIRA HIPERFLEX E ESTICAR O CABEAMENTO</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">APÓS CONCLUÍDO O LANÇAMENTO DOS CABOS, VEM A PARTE DE LIGAÇÃO DOS EQUIPAMENTOS</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">
            FAZER INSPEÇÃO VISUAL DE TODAS AS CONEXÕES, CC, CA E PRINCIPALMENTE OS TERRAS DO INVERSOR INTERNO E EXTERNA ,STRING E DPSs SE ESTÃO FEITAS
          </p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">FAZER CONFERENCIA DOS APERTOS DE TODOS OS BORNES DE CONEXÕES</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">CONEXÃO CORRETA DOS CABOS DE CORRENTE ALTERNADA E DE CORRENTE CONTINUA (CORES E CONECTORES)</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">CONEXÃO DOS CABOS DE CORRENTE ALTERNADA SEMPRE NA REDE MESTRE DO PADRÃO</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">
            CONEXÃO DOS CABOS DE CORRENTE ALTERNADA SEMPRE COM CONECTORES CORRETOS PARA CONEXÃO, CONECTORES DE PERFURAÇÃO OU BIMETÁLICO QUANDO HOUVER
            NECESSIDADE
          </p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">
            QUANDO USAR CONECTORES BIMETÁLICO PARA CONEXÃO COM A REDE, FAZER O ISOLAMENTO CORRETO, 1° ETAPA PASSAR UMA CAMADA DE FITA DE BAIXA TENSÃO,
            2° ETAPA CAMADA DE FITA DE ALTA TENSÃO E POR ULTIMO 3° ETAPA CAMADA DE FITA DE BAIXA TENSÃO
          </p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">SEMPRE OBSERVAR SE OS CABOS NÃO SE DANIFICOU DURANTE O PROCESSO, DANIFICOU FAZER A SUBSTITUIÇÃO</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">CONEXÕES DOS CABOS DE CORRENTE CONTINUA USAR CONECTORES MC4 E CHAVES APROPRIADAS</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">
            FAZER INSPEÇÃO VISUAL SE TODAS AS CONEXÕES ESTÃO CORRETAS, SE ESTÃO ISOLADAS CORRETAMENTE, E SE OS CONECTORES DE PERFURAÇÃO QUEBRARAM OS
            PARAFUSOS E ISOLAR A PONTA DO CABO DE DERIVAÇÃO
          </p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">FAZER A CONEXÃO DO TERRA DOS TRILHO</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">FAZER UMA INSPEÇÃO VISUAL DE TODO O PROCESSO COM A FINALIDADE DE VERIFICAR SE TUDO ESTA CORRETO</p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">
            DURANTE TODO PROCESSO DE MONTAGEM TANTO DOS MÓDULOS, LANÇAMENTO DE CABOS OU MONTAGEM MECÂNICA, DEIXAR CEM PORCENTO AS FERRAMENTAS
            ORGANIZADAS, NÃO DEIXAR FERRAMENTAS ESPALHAS POR TODA A CASA DO CLIENTE, ISSO ACONTECE MUITO
          </p>
        </div>
        <div className="grid w-full grid-cols-10 gap-2 lg:w-[60%]">
          <BsFillSunFill style={{ color: '#fead61', fontSize: '25px' }} />
          <p className="col-span-9 font-medium">AO FINAL DE TODO DIA DE OBRA FAZER LISTA DE MATERIAL PARA O DIA SEGUINTE</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input type={'checkbox'} checked={checkCableLayingStage} onChange={(e) => setCheckCableLayingStage(e.target.checked)} />
      </div>
      <h1 className="mt-5 w-full text-center text-lg font-bold text-[#fead61]">FOTOS/FILMAGENS</h1>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex w-fit flex-col items-center">
          <label className="ml-2 text-center font-bold text-[#15599a]">
            FOTOS/FILMAGEM DO CABEAMENTO LANÇADO NA LAJE (ROLDANAS FIXADAS, ELETRODUTOS, MANGUEIRA HIPERFLEX, ETC)
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {files.fotoCabeamentoLaje ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">
                    {files.fotoCabeamentoLaje.length == 1 ? files.fotoCabeamentoLaje[0].name : `${files.fotoCabeamentoLaje[0].name}...`}
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
                  fotoCabeamentoLaje: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="flex w-fit flex-col items-center">
          <label className="ml-2 text-center font-bold text-[#15599a]">
            FOTOS/FILMAGEM DA CONEXÃO DO SISTEMA COM A REDE DO CLIENTE (NO QUADRO OU RAMAL)
          </label>
          <div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
            <div className="absolute">
              {files.fotoConexaoSistemaRede ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-center font-normal text-gray-400">
                    {files.fotoConexaoSistemaRede.length == 1 ? files.fotoConexaoSistemaRede[0].name : `${files.fotoConexaoSistemaRede[0].name}...`}
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
                  fotoConexaoSistemaRede: e.target.files,
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
          className="disabled:bg-primary/60 rounded border border-[#15599a] p-2 font-bold text-[#15599a] duration-500 ease-in-out hover:scale-105 hover:bg-[#15599a] hover:text-white disabled:text-white disabled:opacity-70"
        >
          PRÓXIMO
        </button>
      </div>
    </div>
  )
}

export default EtapaLancamentoCabosConexos
