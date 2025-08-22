import Budgeting from '@/components/identificador/analisesTecnicas/Solicitations/Budgeting'
import Drawing from '@/components/identificador/analisesTecnicas/Solicitations/Drawing'
import Inloco from '@/components/identificador/analisesTecnicas/Solicitations/InLoco'
import RemoteRural from '@/components/identificador/analisesTecnicas/Solicitations/RemoteRural'
import RemoteUrban from '@/components/identificador/analisesTecnicas/Solicitations/RemoteUrban'
import SolicitationTypeSelection from '@/components/identificador/analisesTecnicas/Stages/SolicitationTypeSelection'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { fileTypes } from '@/utils/constants'
import { uploadFile } from '@/utils/methods/firebase'
import { createManyFileReferences } from '@/utils/methods/mutation/crm/file-references'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createTechnicalAnalysis } from '@/utils/methods/mutation/technical-analysis'
import { TFileHolder, TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { TProject } from '@/utils/schemas/projects'
import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis'
import { TUser } from '@/utils/schemas/users'
import { storage } from '@/utils/services/firebase/firebase-storage'
import connectToAdministrationDatabase from '@/utils/services/mongodb/administration'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { useQueryClient } from '@tanstack/react-query'
import { getMetadata, ref } from 'firebase/storage'
import { Collection, Db, ObjectId } from 'mongodb'
import { GetServerSidePropsContext } from 'next'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsFillClipboardCheckFill } from 'react-icons/bs'

type TProjectForAnalysisDTO = {
  _id: string
  nomeDoContrato: TProject['nomeDoContrato']
  idProjetoCRM: TProject['idProjetoCRM']
}

type TechnicalAnalysisProps = {
  projectJSON: string
  sessionJSON: string
  error: string | null | undefined
}
function TechnicalAnalysis({ projectJSON, sessionJSON, error }: TechnicalAnalysisProps) {
  if (error) return <ErrorComponent msg={error} />
  const project: TProjectForAnalysisDTO = JSON.parse(projectJSON)
  const session: TAuthSession = JSON.parse(sessionJSON)
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TTechnicalAnalysis>({
    idParceiro: '65454ba15cf3e3ecf534b308',
    nome: '',
    status: 'PENDENTE', // create a list of options
    complexidade: null,
    arquivosAuxiliares: '', // link de fotos do drone, por exemplo
    pendencias: [],
    anotacoes: '', // anotações gerais para auxilio ao analista
    tipoSolicitacao: '',
    analista: null,
    requerente: {
      id: 'id-holder',
      nome: 'Requerente Publico',
      apelido: 'Requerente Indefinido',
      avatar_url: null,
      contato: '', // telefone
    },
    oportunidade: {
      id: project.idProjetoCRM || '',
      nome: project.nomeDoContrato,
      identificador: '',
    },
    localizacao: {
      cep: '',
      uf: null,
      cidade: null,
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
    },
    equipamentosAnteriores: [],
    equipamentos: [],
    padrao: [],
    transformador: {
      acopladoPadrao: false,
      codigo: '',
      potencia: 0,
    },
    execucao: {
      observacoes: '',
      memorial: null,
      espacoQGBT: false,
    },
    descritivo: [],
    servicosAdicionais: {
      alambrado: null,
      britagem: null,
      casaDeMaquinas: null,
      barracao: null,
      roteador: null,
      limpezaLocal: null,
      redeReligacao: null,
      terraplanagem: null,
      realimentar: false,
    },
    detalhes: {
      concessionaria: '',
      topologia: 'MICRO-INVERSOR',
      materialEstrutura: null,
      tipoEstrutura: null,
      tipoTelha: null,
      fixacaoInversores: null,
      imagensDrone: false,
      imagensFachada: false,
      imagensSatelite: false,
      medicoes: false,
      orientacao: '',
      telhasReservas: null,
    },
    distancias: {
      conexaoInternet: '',
      cabeamentoCA: '', // inversor ao padrão
      cabeamentoCC: '', // modulos ao inversor
    },
    locais: {
      aterramento: '',
      inversor: '', // instalação do inversor, varannda, garagem, etc
      modulos: '', // instalação dos módulos, telhado, solo em x, solo em y, etc
    },
    custos: [],
    alocacaoModulos: {
      leste: null,
      nordeste: null,
      noroeste: null,
      norte: null,
      oeste: null,
      sudeste: null,
      sudoeste: null,
      sul: null,
    },
    desenho: {
      observacoes: '',
      tipo: '', //
      url: '',
    },
    suprimentos: {
      observacoes: '',
      itens: [],
    },
    conclusao: {
      // UTILIZADO PELOS VENDEDORES
      observacoes: '',
      espaco: false, // possui espaço pra execução
      inclinacao: false, // necessitará estrutura de inclinação
      sombreamento: false, // possui sombra
      padrao: null,
      estrutura: null,
    },
    dataInsercao: new Date().toISOString(),
  })
  const [files, setFiles] = useState<TFileHolder>({})
  async function handleUploadFiles({ files, analysisId }: { files: TFileHolder; analysisId: string }) {
    var links: TFileReference[] = []
    try {
      const uploadPromises = Object.entries(files).map(async ([key, value]) => {
        const file = value
        if (!file) return
        if (typeof file == 'string') {
          const fileRef = ref(storage, file)
          const metaData = await getMetadata(fileRef)
          const format = metaData.contentType && fileTypes[metaData.contentType] ? fileTypes[metaData.contentType].title : 'INDEFINIDO'
          const link: TFileReference = {
            idParceiro: '65454ba15cf3e3ecf534b308',
            idAnaliseTecnica: analysisId,
            titulo: key,
            formato: format,
            url: file,
            tamanho: metaData.size,
            autor: {
              id: session.user.id,
              nome: session.user.nome,
              avatar_url: session.user.avatar_url,
            },
            dataInsercao: new Date().toISOString(),
          }
          links.push(link)
        }
        if (typeof file != 'string') {
          const formattedFileName = key.toLowerCase().replaceAll(' ', '_')
          const vinculationId = analysisId
          // Uploading file to Firebase and getting url and format
          const { url, format, size } = await uploadFile({ file: file, fileName: formattedFileName, vinculationId: vinculationId, prefix: 'saas' })
          const link: TFileReference = {
            idParceiro: '65454ba15cf3e3ecf534b308',
            idAnaliseTecnica: analysisId,
            titulo: key,
            formato: format,
            url: url,
            tamanho: size,
            autor: {
              id: session.user.id,
              nome: session.user.nome,
              avatar_url: session.user.avatar_url,
            },
            dataInsercao: new Date().toISOString(),
          }
          links.push(link)
        }
      })
      await Promise.all(uploadPromises)
      return links
    } catch (error) {
      throw error
    }
  }
  async function requestAnalysis({ info, files }: { info: TTechnicalAnalysis; files: TFileHolder }) {
    try {
      // Creating the technical analysis document in db via api call
      const creationLoadingToastId = toast.loading('Criando análise técnica...')
      const insertedAnalysisId = await createTechnicalAnalysis({ info, returnId: true })
      toast.dismiss(creationLoadingToastId)

      const fileUploadLoadingToastId = toast.loading('Subindo arquivos...')
      const links = await handleUploadFiles({ files: files, analysisId: insertedAnalysisId })
      const insertFileReferencesResponse = await createManyFileReferences({ info: links })
      toast.dismiss(fileUploadLoadingToastId)

      return 'Análise técnica requisitada com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const {
    mutate: handleRequestAnalysis,
    isPending,
    isError,
    isSuccess,
  } = useMutationWithFeedback({
    mutationKey: ['create-technical-analysis'],
    mutationFn: requestAnalysis,
    queryClient: queryClient,
    affectedQueryKey: ['technical-analysis'],
  })

  return (
    <div className="flex h-full w-full flex-col">
      {isPending ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={'Oops, houve um erro ao criar a análise técnica.'} /> : null}
      {isSuccess ? (
        <div className="flex w-full grow flex-col items-center justify-center gap-2 text-green-500">
          <BsFillClipboardCheckFill color="rgb(34,197,94)" size={35} />
          <p className="text-lg font-medium tracking-tight text-gray-500">Análise técnica requisitada com sucesso !</p>
        </div>
      ) : null}
      {!isPending && !isError && !isSuccess ? (
        <>
          <div className="flex w-full items-center justify-center border-b border-gray-500 bg-black p-2">
            <h1 className="text-center text-sm font-bold tracking-tight text-white">SOLICITAÇÃO DE ANÁLISE TÉCNICA P/ {project.nomeDoContrato}</h1>
          </div>
          <div className="flex w-full grow flex-col p-3">
            {!infoHolder.tipoSolicitacao ? (
              <SolicitationTypeSelection
                selectType={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    tipoSolicitacao: value,
                  }))
                }
              />
            ) : null}
            {infoHolder.tipoSolicitacao == 'ANÁLISE TÉCNICA REMOTA URBANA' || infoHolder.tipoSolicitacao == 'ANÁLISE TÉCNICA REMOTA' ? (
              <RemoteUrban
                session={session}
                activeProposalId={null}
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                resetSolicitationType={() =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    tipoSolicitacao: '',
                  }))
                }
                files={files}
                setFiles={setFiles}
                // @ts-ignore
                handleRequestAnalysis={handleRequestAnalysis}
              />
            ) : null}
            {infoHolder.tipoSolicitacao == 'ANÁLISE TÉCNICA REMOTA RURAL' ? (
              <RemoteRural
                session={session}
                activeProposalId={null}
                infoHolder={infoHolder}
                setInfoHolder={setInfoHolder}
                resetSolicitationType={() =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    tipoSolicitacao: '',
                  }))
                }
                files={files}
                setFiles={setFiles}
                // @ts-ignore
                handleRequestAnalysis={handleRequestAnalysis}
              />
            ) : null}
            {infoHolder.tipoSolicitacao == 'ANÁLISE TÉCNICA IN LOCO' ? (
              <Inloco
                infoHolder={infoHolder}
                activeProposalId={null}
                setInfoHolder={setInfoHolder}
                resetSolicitationType={() =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    tipoSolicitacao: '',
                  }))
                }
                files={files}
                setFiles={setFiles}
                // @ts-ignore
                handleRequestAnalysis={handleRequestAnalysis}
              />
            ) : null}
            {infoHolder.tipoSolicitacao == 'DESENHO PERSONALIZADO' ? (
              <Drawing
                infoHolder={infoHolder}
                activeProposalId={null}
                setInfoHolder={setInfoHolder}
                resetSolicitationType={() =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    tipoSolicitacao: '',
                  }))
                }
                files={files}
                setFiles={setFiles}
                // @ts-ignore
                handleRequestAnalysis={handleRequestAnalysis}
              />
            ) : null}
            {infoHolder.tipoSolicitacao == 'ORÇAMENTAÇÃO' ? (
              <Budgeting
                infoHolder={infoHolder}
                activeProposalId={null}
                setInfoHolder={setInfoHolder}
                resetSolicitationType={() =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    tipoSolicitacao: '',
                  }))
                }
                files={files}
                setFiles={setFiles}
                // @ts-ignore
                handleRequestAnalysis={handleRequestAnalysis}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default TechnicalAnalysis

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const projectId = query.projectId

  // Validating if ID provided in query is a valid ID
  if (!projectId || typeof projectId != 'string' || !ObjectId.isValid(projectId))
    return {
      props: {
        error: 'Oops, o ID de projeto solicitado é inválido.',
      },
    }
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'main')
  const admDb: Db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const projectsCollection: Collection<TProject> = db.collection('dados')
  const usersCollection: Collection<TUser> = admDb.collection('colaboradores')

  const project = await projectsCollection.findOne(
    { _id: new ObjectId(projectId) },
    {
      projection: {
        _id: 1,
        nomeDoContrato: 1,
        idProjetoCRM: 1,
      },
    }
  )
  const user = await usersCollection.findOne({ _id: new ObjectId(process.env.PUBLIC_USER_ID) })

  const session: TAuthSession | null = user
    ? {
        expires: '',
        user: {
          id: user._id.toString(),
          nome: user.usuario,
          email: user.email,
          telefone: user.telefone,
          avatar_url: user.avatar_url,
          visualizacao: user.visualizacao,
          permissoes: user.permissoes,
        },
      }
    : null
  if (!project)
    return {
      props: {
        error: 'Oops, nenhum projeto foi encontrado.',
      },
    }
  console.log(project)
  return {
    props: {
      projectJSON: JSON.stringify({ ...project }),
      sessionJSON: JSON.stringify(session),
    },
  }
}
