import ErrorComponent from '@/components/utils/ErrorComponent'
import { TProject } from '@/utils/schemas/projects'
import { TUser } from '@/utils/schemas/users'
import connectToAdministrationDatabase from '@/utils/services/mongodb/administration'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Collection, Db, ObjectId } from 'mongodb'
import { GetServerSidePropsContext } from 'next'
import { Session } from 'next-auth'
import React, { useState } from 'react'

import ApplicantBlock from '@/components/identificador/crm-homologacoes/ApplicantBlock'
import HolderInformation from '@/components/identificador/crm-homologacoes/HolderInformation'
import InstallationInformation from '@/components/identificador/crm-homologacoes/InstallationInformation'
import LocationInformation from '@/components/identificador/crm-homologacoes/LocationInformation'
import EquipmentsComposition from '@/components/identificador/crm-homologacoes/EquipmentsComposition'
import AttachFiles from '@/components/identificador/crm-homologacoes/AttachFiles'
import { TFileHolder, TFileReference } from '@/utils/schemas/crm/file-reference.schema'
import { THomologation } from '@/utils/schemas/crm/homologation.schema'
import { useQueryClient } from '@tanstack/react-query'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import toast from 'react-hot-toast'
import { createHomologation } from '@/utils/methods/mutation/crm/homologations'
import { createManyFileReferences } from '@/utils/methods/mutation/crm/file-references'
import { uploadFile } from '@/utils/methods/firebase'
import { getMetadata, ref } from 'firebase/storage'
import { storage } from '@/utils/services/firebase/firebase-storage'
import { fileTypes } from '@/utils/constants'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { BsFillClipboardCheckFill } from 'react-icons/bs'

type TProjectForHomologationDTO = {
  _id: string
  nomeDoContrato: TProject['nomeDoContrato']
  idProjetoCRM: TProject['idProjetoCRM']
}

type HomologationPublicFormularyProps = {
  projectJSON: string
  sessionJSON: string
  error: string | null | undefined
}
function HomologationPublicFormulary({ projectJSON, sessionJSON, error }: HomologationPublicFormularyProps) {
  if (error) return <ErrorComponent msg={error} />
  const project: TProjectForHomologationDTO = JSON.parse(projectJSON)
  const session: Session = JSON.parse(sessionJSON)
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<THomologation>({
    status: 'PENDENTE',
    idParceiro: '',
    pendencias: {},
    distribuidora: '',
    idProposta: null,
    requerente: {
      id: session.user.id,
      nome: session.user.nome,
      apelido: session.user.nome,
      contato: session.user.telefone || '',
      avatar_url: session.user.avatar_url,
    },
    oportunidade: {
      id: project.idProjetoCRM || '',
      nome: project.nomeDoContrato,
    },
    titular: {
      nome: '',
      identificador: '',
      contato: '',
    },
    equipamentos: [],
    localizacao: {
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
      complemento: '',
      // distancia: z.number().optional().nullable(),
    },
    instalacao: {
      numeroInstalacao: '',
      numeroCliente: '',
      grupo: 'RESIDENCIAL',
      dependentes: [],
    },
    documentacao: {
      formaAssinatura: 'FÍSICA',
      dataLiberacao: null,
      dataAssinatura: null,
    },
    acesso: {
      codigo: '',
      dataSolicitacao: null,
      dataResposta: null,
    },
    atualizacoes: [],
    vistoria: {
      dataSolicitacao: null,
      dataEfetivacao: null,
    },
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  const [files, setFiles] = useState<TFileHolder>({})

  async function handleUploadFiles({ files, homologationId }: { files: TFileHolder; homologationId: string }) {
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
            idParceiro: '',
            idHomologacao: homologationId,
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
          const vinculationId = homologationId
          // Uploading file to Firebase and getting url and format
          const { url, format, size } = await uploadFile({ file: file, fileName: formattedFileName, vinculationId: vinculationId, prefix: '' })
          const link: TFileReference = {
            idParceiro: '',
            idHomologacao: homologationId,
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

  async function requestHomologation({ info, files }: { info: THomologation; files: TFileHolder }) {
    try {
      // Creating the homologation document in db via api call
      const creationLoadingToastId = toast.loading('Criando homologação...')
      const insertedHomologationId = await createHomologation({ info, returnId: true })
      toast.dismiss(creationLoadingToastId)
      // Generating the file references for homologation
      const fileUploadLoadingToastId = toast.loading('Subindo arquivos...')
      const links = await handleUploadFiles({ files: files, homologationId: insertedHomologationId })
      // Inserting  file references
      const insertFileReferencesResponse = await createManyFileReferences({ info: links })
      toast.dismiss(fileUploadLoadingToastId)

      return 'Homologação requisitada com sucesso !'
    } catch (error) {
      toast.dismiss()
      throw error
    }
  }

  const {
    mutate: handleCreateHomologation,
    isPending,
    isError,
    isSuccess,
  } = useMutationWithFeedback({
    mutationKey: ['create-homologation'],
    mutationFn: requestHomologation,
    queryClient: queryClient,
    affectedQueryKey: ['homologations'], //['opportunity-homologations', opportunity?._id],
  })
  return (
    <div className="flex h-full w-full flex-col">
      {isPending ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={'Oops, houve um erro ao criar a análise técnica.'} /> : null}
      {isSuccess ? (
        <div className="flex w-full grow flex-col items-center justify-center gap-2 text-green-500">
          <BsFillClipboardCheckFill color="rgb(34,197,94)" size={35} />
          <p className="text-lg font-medium tracking-tight text-gray-500">Homologação requisitada com sucesso !</p>
        </div>
      ) : null}
      {!isPending && !isError && !isSuccess ? (
        <>
          <div className="flex w-full items-center justify-center border-b border-gray-500 bg-black p-2">
            <h1 className="text-center text-sm font-bold tracking-tight text-white">SOLICITAÇÃO DE ANÁLISE TÉCNICA P/ {project.nomeDoContrato}</h1>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {/* <ApplicantBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} /> */}
            <HolderInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <InstallationInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <LocationInformation infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <EquipmentsComposition infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
            <AttachFiles opportunityId={null} files={files} setFiles={setFiles} />
          </div>
          <div className="flex w-full items-center justify-end p-2">
            <button
              disabled={isPending}
              // @ts-ignore
              onClick={() => handleCreateHomologation({ info: infoHolder, files: files })}
              className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
            >
              SOLICITAR HOMOLOGAÇÃO
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default HomologationPublicFormulary

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

  const session: Session | null = user
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
