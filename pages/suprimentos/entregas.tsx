import * as Dialog from '@radix-ui/react-dialog'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { formatDateAsLocale, formatLocation } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useProjectsInDelivery } from '@/utils/methods/query/supply'
import { TProjectDTO } from '@/utils/schemas/projects'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { BsCalendarEvent, BsCloudUploadFill, BsTruck } from 'react-icons/bs'
import { FaIndustry, FaPhone, FaUser } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { VscChromeClose } from 'react-icons/vsc'
import DateInput from '@/components/inputs/Date'
import { fileTypes, formatDate, formatLongString, GeneralVisibleHiddenExitMotionVariants, getFileTypeTitle, isFileImage } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/utils/services/firebase/firebase-storage'
import { uploadFile } from '@/utils/methods/firebase'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useQueryClient } from 'react-query'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import TextInput from '@/components/inputs/Text'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import { deliveryStatus } from '@/utils/select-options'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }))
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }))
function DeliveriesPage() {
  const { data: session, status } = useSession({ required: true })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)
  const [menuIsOpen, setMenuIsOpen] = useState<{ id: string | null; name: string | null; isOpen: boolean }>({ id: null, name: null, isOpen: false })
  const { data: projects, isLoading, isError, isSuccess, error, filters, setFilters } = useProjectsInDelivery()
  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">PROJETOS EM PROCESSO DE ENTREGA</p>
          </div>
          {dropdownMenuVisible ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {dropdownMenuVisible ? (
          <motion.div
            key={'editor'}
            variants={GeneralVisibleHiddenExitMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
          >
            <h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
            <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
              <TextInput
                label="NOME DO PROJETO"
                value={filters.search}
                handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                placeholder="Filtro pelo nome do projeto..."
              />
              <MultipleSelectInput
                label="STATUS DE ENTREGA"
                selected={filters.deliveryStatus}
                handleChange={(value) => setFilters((prev) => ({ ...prev, deliveryStatus: value as string[] }))}
                options={deliveryStatus}
                onReset={() => setFilters((prev) => ({ ...prev, deliveryStatus: [] }))}
                selectedItemLabel="NÃO DEFINIDO"
              />
              <MultipleSelectInput
                label="CIDADE"
                selected={filters.cities}
                handleChange={(value) => setFilters((prev) => ({ ...prev, cities: value as string[] }))}
                options={AllCities}
                onReset={() => setFilters((prev) => ({ ...prev, cities: [] }))}
                selectedItemLabel="NÃO DEFINIDO"
              />
              <MultipleSelectInput
                label="ESTADOS"
                selected={filters.ufs}
                handleChange={(value) => setFilters((prev) => ({ ...prev, ufs: value as string[] }))}
                options={AllStates}
                onReset={() => setFilters((prev) => ({ ...prev, ufs: [] }))}
                selectedItemLabel="NÃO DEFINIDO"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex w-full flex-col gap-2 py-4">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(projects)} /> : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                handleClick={(id) => setMenuIsOpen({ id, name: project.nomeDoContrato, isOpen: true })}
              />
            ))
          ) : (
            <p className="w-full text-center tracking-tight text-gray-500">Nenhum projeto em processo de entrega encontrado.</p>
          )
        ) : null}
      </div>
      {menuIsOpen.id && menuIsOpen.isOpen && menuIsOpen.name ? (
        <AcknowledgeDeliveryMenu
          projectId={menuIsOpen.id}
          projectName={menuIsOpen.name}
          closeModal={() => setMenuIsOpen({ id: null, name: null, isOpen: false })}
        />
      ) : null}
    </div>
  )
}

export default DeliveriesPage

type ProjectCardProps = {
  project: TProjectDTO
  handleClick: (id: string) => void
}
function ProjectCard({ project, handleClick }: ProjectCardProps) {
  function getDeliveryStatusTag(status: TProjectDTO['compra']['statusEntrega']) {
    if (status == 'AGUARDANDO COMPRA') return <h1 className="min-w-fit rounded-lg bg-orange-600 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>
    if (status == 'EM ROTA') return <h1 className="min-w-fit rounded-lg bg-blue-600 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>
    if (status == 'ENTREGUE') return <h1 className="min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>
    if (status == 'CANCELADO') return <h1 className="min-w-fit rounded-lg bg-red-500 px-2 py-0.5 text-[0.5rem] text-white">{status}</h1>
    return <h1 className="min-w-fit rounded-lg bg-gray-500 px-2 py-0.5 text-[0.5rem] text-white">NÃO DEFINIDO</h1>
  }
  return (
    <div className="flex w-full flex-col gap-1 rounded border border-gray-500 p-2">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <h1 className="rounded-lg bg-black px-2 py-0.5 text-center text-[0.65rem] font-bold text-white">{project.qtde}</h1>
          <p className="text-sm font-bold leading-none tracking-tight">{project.nomeDoContrato}</p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <FaUser width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.vendedor?.nome}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaPhone width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.telefone}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
              {formatLocation({
                location: {
                  uf: project.uf,
                  cidade: project.cidade,
                  cep: project.cep?.toString(),
                  bairro: project.bairro,
                  endereco: project.logradouro,
                  numeroOuIdentificador: project.numeroResidencia?.toString(),
                },
              })}
            </h1>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <FaIndustry width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">FORNECEDOR</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{project.compra?.fornecedor || 'NÃO DEFINIDO'}</h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarEvent width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO DE ENTREGA</h1>
            <h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
              {formatDateAsLocale(project.compra.previsaoEntrega) || 'NÃO POSSUI'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsTruck width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">ENTREGA</h1>
            {getDeliveryStatusTag(project.compra.statusEntrega)}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => handleClick(project._id)}
          className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary"
        >
          <Pencil width={10} height={10} />
          <p>ACUSAR RECEBIMENTO</p>
        </button>
      </div>
    </div>
  )
}

type AcknowledgeDeliveryMenuProps = {
  projectId: string
  projectName: string
  closeModal: () => void
}
type TAcknowlegdeDeliveryInfo = {
  deliveryDate: string | null
  files: {
    file: File
    previewUrl: string | null
    type: string | null
  }[]
}

function AcknowledgeDeliveryMenu({ projectId, projectName, closeModal }: AcknowledgeDeliveryMenuProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TAcknowlegdeDeliveryInfo>({
    deliveryDate: null,
    files: [],
  })

  async function handleUploads(files: TAcknowlegdeDeliveryInfo['files']) {
    var links: { title: string; link: string; category: string; format: string }[] = []
    const uploadPromises = files.map(async (file, index) => {
      const datetime = new Date().toISOString()
      const storageStr =
        files.length > 1
          ? `clientes/${projectId}-${projectName}/entrega-{${index + 1}}-${datetime}`
          : `clientes/${projectId}-${projectName}/entrega-${datetime}`
      var fileRef = ref(storage, storageStr)
      const uploadResponse = await uploadBytes(fileRef, file.file)
      const url = await getDownloadURL(ref(storage, uploadResponse.metadata.fullPath))
      const format =
        uploadResponse.metadata.contentType && fileTypes[uploadResponse.metadata.contentType]
          ? fileTypes[uploadResponse.metadata.contentType].title
          : 'INDEFINIDO'
      links.push({
        title: files.length > 1 ? `ENTREGA (${index + 1})` : 'ENTREGA',
        link: url,
        category: 'links.equipamentos',
        format: format,
      })
    })

    await Promise.all(uploadPromises)

    return links
  }
  async function handleAcknowledgeDelivery(info: TAcknowlegdeDeliveryInfo) {
    try {
      if (!info.deliveryDate) throw new Error('Preencha a data de entrega.')
      const links = await handleUploads(info.files)

      // Updating project files
      await axios.put(`/api/projects/update/${projectId}`, {
        operation: {
          $push: {
            [`links.equipamentos`]: {
              $each: links,
            },
          },
          $set: {
            'compra.statusEntrega': 'ENTREGUE',
            'compra.dataEntrega': info.deliveryDate,
          },
        },
      })
      return 'Reconhecimento de entrega feito com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate, isLoading } = useMutationWithFeedback({
    mutationKey: ['acknowlegde-delivery'],
    mutationFn: async () => handleAcknowledgeDelivery(infoHolder),
    queryClient: queryClient,
    affectedQueryKey: ['projects-in-delivery'],
  })
  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-primary/70 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[80%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-[10px] lg:h-[60%] lg:w-[40%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-sm font-bold lg:text-xl">ACUSAR ENTREGA</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <DateInput
              label="DATA DE ENTREGA"
              value={formatDate(infoHolder.deliveryDate)}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, deliveryDate: formatDateInputChange(value) }))}
              width="100%"
            />
            <h1 className="text-center text-sm tracking-tight">ARQUIVOS</h1>
            <div className="flex w-full flex-col gap-2">
              <div className="relative flex w-full items-center justify-center">
                <label
                  htmlFor="dropzone-file"
                  className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-[#fff] hover:bg-primary/10 dark:bg-[#121212]"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5 text-primary">
                    <BsCloudUploadFill color={'rgb(31,41,55)'} size={50} />
                    <p>Clique para escolher um ou mais arquivos ou os arraste para a àrea demarcada</p>
                  </div>
                  <input
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files)
                        const attachments = files.map((file) => ({
                          file: file,
                          previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null,
                          type: file.type,
                        }))
                        return setInfoHolder((prev) => ({ ...prev, files: [...prev.files, ...attachments] }))
                      } else return
                    }}
                    multiple={true}
                    id="dropzone-file"
                    type="file"
                    className="absolute h-full w-full opacity-0"
                  />
                </label>
              </div>
              <div className="flex w-full flex-wrap items-start justify-center gap-4">
                {infoHolder.files
                  .filter((a) => !!a.file)
                  .map((attachment, index) => (
                    <div key={index} className="flex h-[180px] w-[150px] flex-col rounded border border-primary/50">
                      <div className="relative flex h-[150px] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
                        {attachment.previewUrl ? (
                          <Image src={attachment.previewUrl} alt={attachment.file?.name || ''} fill={true} />
                        ) : (
                          <h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">
                            {getFileTypeTitle(attachment.type || '')}
                          </h1>
                        )}
                      </div>
                      <div className="h-[30px] rounded rounded-tl-none rounded-tr-none bg-primary p-2 text-center text-[0.55rem] font-bold text-primary-foreground">
                        {formatLongString(attachment.file?.name || '', 15)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-end">
            <LoadingButton loading={isLoading} onClick={() => mutate()} type="button">
              RECONHECER ENTREGA
            </LoadingButton>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
