import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import TextareaInput from '@/components/inputs/TextareaInput'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MorphingPopover, MorphingPopoverContent, MorphingPopoverTrigger } from '@/components/ui/morphing-popover'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import type { TPosVendaCall } from '@/utils/schemas/pos-venda-calls'
import { usePosVendaCallStore } from '@/utils/state/pos-venda-call'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, BadgeDollarSign, File, Info, List, Plus } from 'lucide-react'
import type { TAuthSession } from '@/lib/authentication/types'
import { useState } from 'react'
import { BsCalendarPlus } from 'react-icons/bs'
import { MdAttachFile, MdDashboard } from 'react-icons/md'
import ProjectVinculationMenu from '../../projects/ProjectVinculationMenu'
import NumberInput from '@/components/inputs/Number'
import DateInput from '@/components/inputs/Date'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { useFileReferencesByCallId } from '@/utils/methods/query/crm/file-references'
import FileReferenceCard from '../../referencias-arquivos/FileReferenceCard'
import { cn } from '@/lib/utils'
import NewManyFileReferencesMenu from '../../referencias-arquivos/NewManyFileReferencesMenu'
import { useQueryClient } from '@tanstack/react-query'
import CheckboxInput from '@/components/inputs/Checkbox'

type PosVendaCallDataProps = {
  session: TAuthSession
  callId?: string
}
function PosVendaCallData({ session, callId }: PosVendaCallDataProps) {
  return (
    <div className="flex h-full w-full flex-col gap-6 px-4 py-2">
      <GeneralData />
      <Project />
      <PaymentData />
      <Updates session={session} />
      {callId ? <Attachments callId={callId} session={session} /> : null}
    </div>
  )
}

export default PosVendaCallData

function GeneralData() {
  const title = usePosVendaCallStore((state) => state.titulo)
  const status = usePosVendaCallStore((state) => state.status)
  const value = usePosVendaCallStore((state) => state.metadados.valor)
  const description = usePosVendaCallStore((state) => state.descricao)
  const updateCall = usePosVendaCallStore((state) => state.updateCall)

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-1">
          <Info className="min-w-4 min-h-4 h-4 w-4" />
          <h1 className="text-sm font-bold tracking-tight">INFORMAÇÕES GERAIS</h1>
        </div>
        <h3 className="w-full text-sm tracking-tight text-muted-foreground">Define aqui as informações gerais do chamado</h3>
      </div>

      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label={'TÍTULO'}
            placeholder={'Preencha o título do chamado'}
            value={title}
            handleChange={(value) => updateCall({ titulo: value })}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label={'STATUS'}
            value={status}
            selectedItemLabel={'NÃO DEFINIDO'}
            onReset={() => updateCall({ status: 'PENDENTE' })}
            options={[
              { id: 1, label: 'PENDENTE', value: 'PENDENTE' },
              { id: 2, label: 'AGUARDANDO PAGAMENTO', value: 'AGUARDANDO PAGAMENTO' },
              { id: 3, label: 'PAGO', value: 'PAGO' },
              { id: 4, label: 'CONCLUÍDO', value: 'CONCLUÍDO' },
            ]}
            handleChange={(value) => updateCall({ status: value })}
            width="100%"
          />
        </div>
      </div>
      <TextareaInput
        label={'DESCRIÇÃO'}
        placeholder={'Preencha a descrição, detalhes e informações do chamado'}
        value={description}
        handleChange={(value) => updateCall({ descricao: value })}
      />
    </div>
  )
}

function PaymentData() {
  const metadados = usePosVendaCallStore((state) => state.metadados)
  const updateCall = usePosVendaCallStore((state) => state.updateCall)

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-1">
          <BadgeDollarSign className="min-w-4 min-h-4 h-4 w-4" />
          <h1 className="text-sm font-bold tracking-tight">PAGAMENTO</h1>
        </div>
        <h3 className="w-full text-sm tracking-tight text-muted-foreground">Define aqui as informações de pagamento do chamado</h3>
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelTrue="CHAMADO COBRÁVEL"
            labelFalse="CHAMADO COBRÁVEL"
            checked={metadados.cobravel ?? false}
            handleChange={(value) => updateCall({ metadados: { ...metadados, cobravel: value } })}
          />
        </div>
      </div>
      {metadados.cobravel ? (
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <NumberInput
              label={'VALOR'}
              placeholder={'Preencha o valor do chamado'}
              value={metadados.valor ?? null}
              handleChange={(value) => updateCall({ metadados: { ...metadados, valor: value } })}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <DateInput
              label={'DATA DE PAGAMENTO'}
              value={formatDate(metadados.dataPagamento)}
              handleChange={(value) => updateCall({ metadados: { ...metadados, dataPagamento: formatDateInputChange(value, 'string') as string } })}
              width="100%"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Project() {
  const [vinculationModalIsOpen, setVinculationModalIsOpen] = useState(false)
  const project = usePosVendaCallStore((state) => state.projeto)
  const vinculateProject = usePosVendaCallStore((state) => state.vinculateProject)
  const unvinculateProject = usePosVendaCallStore((state) => state.unvinculateProject)
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-1">
          <MdDashboard className="min-w-4 min-h-4 h-4 w-4" />
          <h1 className="text-sm font-bold tracking-tight">PROJETO</h1>
        </div>
        <h3 className="w-full text-sm tracking-tight text-muted-foreground">Define aqui o projeto do chamado</h3>
      </div>

      {project ? (
        <div className="flex w-full flex-col gap-1 rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212]">
          <div className="flex items-center gap-2">
            <MdDashboard className="min-w-4 min-h-4 h-4 w-4" />
            <h1 className="rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80">
              {project.identificador}
            </h1>
            <h1 className="text-sm font-medium">{project.nome}</h1>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-medium">{project.tipo}</h1>
          </div>
        </div>
      ) : (
        <Button variant={'ghost'} onClick={() => setVinculationModalIsOpen(true)}>
          VINCULAR PROJETO
        </Button>
      )}
      {vinculationModalIsOpen ? (
        <ProjectVinculationMenu
          closeModal={() => setVinculationModalIsOpen(false)}
          handleSelect={(info) => {
            vinculateProject({ id: info._id, nome: info.nomeDoContrato, tipo: info.tipoDeServico, identificador: info.qtde.toString() })
            setVinculationModalIsOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}

function Updates({ session }: { session: TAuthSession }) {
  const [newUpdateIsOpen, setNewUpdateIsOpen] = useState(false)
  const updates = usePosVendaCallStore((state) => state.atualizacoes)
  const removeUpdate = usePosVendaCallStore((state) => state.removeUpdateItem)
  const updateUpdate = usePosVendaCallStore((state) => state.updateUpdateItem)

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-1">
          <List className="min-w-4 min-h-4 h-4 w-4" />
          <h1 className="text-sm font-bold tracking-tight">ATUALIZAÇÕES</h1>
        </div>
        <h3 className="w-full text-sm tracking-tight text-muted-foreground">Adicione aqui as atualizações do chamado</h3>
      </div>
      <MorphingPopover
        transition={{
          type: 'spring',
          bounce: 0.05,
          duration: 0.3,
        }}
        open={newUpdateIsOpen}
        onOpenChange={setNewUpdateIsOpen}
      >
        <MorphingPopoverTrigger className="flex w-full items-center justify-center">
          <Button className="flex items-center gap-2 text-sm" variant={'ghost'}>
            <Plus className="min-w-4 min-h-4 h-4 w-4" />
            ADICIONAR ATUALIZAÇÃO
          </Button>
        </MorphingPopoverTrigger>
        <MorphingPopoverContent className="w-full rounded-lg border border-primary/30 shadow">
          <NewUpdateMenu session={session} closeMenu={() => setNewUpdateIsOpen(false)} />
        </MorphingPopoverContent>
      </MorphingPopover>
      {updates.map((update, index) => (
        <div key={`${update.data}-${index}`} className="flex w-full flex-col gap-1 rounded-md border border-primary bg-[#fff] p-2 dark:bg-[#121212]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="min-w-4 min-h-4 h-4 w-4">
                  <AvatarImage src={update.autor.avatar_url ?? undefined} />
                  <AvatarFallback>{formatNameAsInitials(update.autor.nome)}</AvatarFallback>
                </Avatar>
                <h1 className="text-sm font-medium">{update.autor.nome}</h1>
              </div>
              <div className="flex items-center gap-2">
                <BsCalendarPlus className="min-w-4 min-h-4 h-4 w-4" />
                <h1 className="text-xs font-medium">{formatDateAsLocale(update.data, true)}</h1>
              </div>
            </div>
            <Button onClick={() => removeUpdate(index)} variant={'ghost'} size={'fit'} className="px-2 py-1 text-xs">
              REMOVER
            </Button>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="flex w-full items-center justify-center rounded bg-primary/10 p-2">
              <h1 className="whitespace-pre-wrap text-[0.6rem] font-medium">{update.descricao || 'OBSERVAÇÃO NÃO DEFINIDA'}</h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

type NewUpdateMenuProps = {
  session: TAuthSession
  closeMenu: () => void
}
function NewUpdateMenu({ session, closeMenu }: NewUpdateMenuProps) {
  const addUpdate = usePosVendaCallStore((state) => state.addUpdateItem)
  const [newUpdateInfo, setNewUpdateInfo] = useState<TPosVendaCall['atualizacoes'][number]>({
    descricao: '',
    data: new Date().toISOString(),
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  })

  return (
    <div className="min-h-[150px]w-full">
      <form
        className="flex h-full flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          addUpdate(newUpdateInfo)
          closeMenu()
        }}
      >
        <motion.span
          layoutId={'popover-label-new-update'}
          aria-hidden="true"
          style={{
            opacity: newUpdateInfo.descricao.length > 0 ? 0 : 1,
          }}
          className="absolute top-3 left-4 select-none text-sm text-zinc-500 dark:text-zinc-400"
        >
          Atualização do chamado...
        </motion.span>
        <textarea
          className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-hidden"
          value={newUpdateInfo.descricao}
          onChange={(e) => setNewUpdateInfo({ ...newUpdateInfo, descricao: e.target.value })}
        />
        <div key="close" className="flex justify-between py-3 pr-4 pl-2">
          <button
            type="button"
            className="text-zinc-950 flex items-center rounded-lg bg-white px-2 py-1 text-sm hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
            onClick={closeMenu}
            aria-label="Close popover"
          >
            <ArrowLeftIcon size={16} className="text-zinc-900 dark:text-zinc-100" />
          </button>
          <button
            className="border-zinc-950/10 relative ml-1 flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border bg-transparent px-2 text-sm text-zinc-500 transition-colors focus-visible:ring-2 hover:bg-zinc-100 hover:text-zinc-800 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
            type="submit"
            aria-label="Submit note"
            onClick={() => {
              closeMenu()
            }}
          >
            ADICIONAR
          </button>
        </div>
      </form>
    </div>
  )
}

type AttachmentsProps = {
  callId: string
  session: TAuthSession
}
function Attachments({ callId, session }: AttachmentsProps) {
  const queryClient = useQueryClient()
  const [newFileReferencesMenuIsOpen, setNewFileReferencesMenuIsOpen] = useState(false)
  const { data: attachments } = useFileReferencesByCallId({ callId })

  const handleOnMutate = async () => await queryClient.invalidateQueries({ queryKey: ['file-references-by-call', callId] })
  const handleOnSettled = async () => await queryClient.invalidateQueries({ queryKey: ['file-references-by-call', callId] })
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-1">
          <File className="min-w-4 min-h-4 h-4 w-4" />
          <h1 className="text-sm font-bold tracking-tight">ANEXOS</h1>
        </div>
        <h3 className="w-full text-sm tracking-tight text-muted-foreground">Anexe aqui os arquivos do chamado</h3>
      </div>
      <div className="flex w-full items-center justify-end">
        <Button
          size={'sm'}
          onClick={() => setNewFileReferencesMenuIsOpen((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
            'bg-gray-300  hover:bg-red-300': newFileReferencesMenuIsOpen,
            'bg-green-300  hover:bg-green-400': !newFileReferencesMenuIsOpen,
          })}
        >
          <MdAttachFile />
          <h1 className="text-xs font-medium tracking-tight">
            {!newFileReferencesMenuIsOpen ? 'ABRIR MENU DE NOVOS ANEXOS' : 'FECHAR MENU DE NOVOS ANEXOS'}
          </h1>
        </Button>
      </div>
      {newFileReferencesMenuIsOpen ? (
        <NewManyFileReferencesMenu
          vinculationId={callId}
          prefix={'chamado'}
          session={session}
          vinculations={{
            callId: { blocked: true, value: callId },
          }}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
          closeMenu={() => setNewFileReferencesMenuIsOpen(false)}
        />
      ) : null}
      {attachments && attachments.length > 0 ? (
        attachments.map((attachment) => <FileReferenceCard key={attachment._id} info={attachment} />)
      ) : (
        <h1 className="w-full text-center text-sm font-medium">Nenhum arquivo anexado</h1>
      )}
    </div>
  )
}
