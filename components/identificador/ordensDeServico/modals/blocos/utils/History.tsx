import DateTimeInput from '@/components/inputs/DateTimeInput'
import TextareaInput from '@/components/inputs/TextareaInput'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateAsLocale, formatDateTimeForInput } from '@/utils/methods/formatting'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TServiceOrder } from '@/utils/schemas/service-order'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { BsCalendar } from 'react-icons/bs'
import { MdAddBox } from 'react-icons/md'

type HistoryBlockProps = {
  infoHolder: TServiceOrder
  updateInfoHolder: (changes: Partial<TServiceOrder>) => void
}
function ServiceOrderHistoryBlock({ infoHolder, updateInfoHolder }: HistoryBlockProps) {
  const [historyMenuIsOpen, setHistoryMenuIsOpen] = useState<boolean>(false)

  function addHistory(history: Exclude<TServiceOrder['periodo']['historico'], null | undefined>[number]) {
    updateInfoHolder({
      periodo: {
        historico: [...(infoHolder.periodo.historico || []), history].sort((a, b) => new Date(a.entrada).getTime() - new Date(b.entrada).getTime()),
      },
    })
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="w-full rounded-md bg-blue-500 p-1 text-center text-sm font-bold text-white">REGISTRO DE ATIVIDADES</h1>
      <p className="text-primary/80 my-1 w-full text-center text-sm font-light tracking-tighter">
        Preencha aqui, se aplicável, o histórico detalhado de atividades executadas no serviço.
      </p>
      <div className="flex w-full items-center justify-end gap-2">
        <button
          onClick={() => setHistoryMenuIsOpen((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
            'bg-primary/20 hover:bg-red-300': historyMenuIsOpen,
            'bg-green-300 hover:bg-green-400': !historyMenuIsOpen,
          })}
        >
          <MdAddBox />
          <h1 className="text-xs font-medium tracking-tight">
            {!historyMenuIsOpen ? 'ABRIR MENU DE REGISTRO DE ATIVIDADE' : 'FECHAR MENU DE REGISTRO DE ATIVIDADE'}
          </h1>
        </button>
      </div>
      <AnimatePresence>
        {historyMenuIsOpen ? <NewHistoryMenu addHistory={addHistory} closeMenu={() => setHistoryMenuIsOpen(false)} /> : null}
      </AnimatePresence>
      <h1 className="text-primary/60 text-[0.65rem] leading-none font-bold tracking-tight lg:text-xs">REGISTROS DE ATIVIDADES</h1>
      <div className="flex w-full flex-col gap-2">
        {infoHolder.periodo.historico ? (
          infoHolder.periodo.historico.length > 0 ? (
            infoHolder.periodo.historico.map((history, index) => <HistoryCard key={index} history={history} />)
          ) : (
            <p className="text-primary/60 w-full text-center text-sm font-medium tracking-tight">Nenhum registro de atividade adicionado.</p>
          )
        ) : (
          <p className="text-primary/60 w-full text-center text-sm font-medium tracking-tight">Nenhum registro de atividade adicionado.</p>
        )}
      </div>
    </div>
  )
}

export default ServiceOrderHistoryBlock

type NewHistoryMenuProps = {
  addHistory: (history: Exclude<TServiceOrder['periodo']['historico'], null | undefined>[number]) => void
  closeMenu: () => void
}
function NewHistoryMenu({ addHistory, closeMenu }: NewHistoryMenuProps) {
  const [historyHolder, setHistoryHolder] = useState<Exclude<TServiceOrder['periodo']['historico'], null | undefined>[number]>({
    anotacoes: '',
    entrada: new Date().toISOString(),
    saida: new Date().toISOString(),
  })
  return (
    <motion.div
      key={'menu-open'}
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-background flex w-full flex-col gap-2 rounded border border-green-600 shadow-xs dark:bg-[#121212]"
    >
      <h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVO REGISTRO DE ATIVIDADE</h1>
      <div className="flex w-full grow flex-col gap-2 p-3">
        <TextareaInput
          label="DESCRIÇÃO"
          value={historyHolder.anotacoes}
          placeholder="Preencha aqui o conteúdo da observação..."
          handleChange={(value) => setHistoryHolder((prev) => ({ ...prev, anotacoes: value }))}
        />

        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <DateTimeInput
              label="DATA DE INICIO"
              value={formatDateTimeForInput(historyHolder.entrada)}
              handleChange={(value) => setHistoryHolder((prev) => ({ ...prev, entrada: formatDateInputChange(value, 'string', false) as string }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <DateTimeInput
              label="DATA DE FIM"
              value={formatDateTimeForInput(historyHolder.saida)}
              handleChange={(value) => setHistoryHolder((prev) => ({ ...prev, saida: formatDateInputChange(value, 'string', false) as string }))}
              width="100%"
            />
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-end gap-2">
          <Button
            onClick={() => {
              addHistory(historyHolder)
              setHistoryHolder({ anotacoes: '', entrada: new Date().toISOString(), saida: new Date().toISOString() })
            }}
            type="button"
            size={'xs'}
          >
            ADICIONAR ATIVIDADE
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function HistoryCard({ history }: { history: Exclude<TServiceOrder['periodo']['historico'], null | undefined>[number] }) {
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex items-center gap-1">
          <h1 className="text-primary/80 py-0.5 text-center text-[0.6rem] font-medium italic">ATIVIDADES DESEMPENHADAS EM:</h1>
          <BsCalendar width={10} height={10} />
          <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
            {history.entrada
              ? `${formatDateAsLocale(history.entrada, true)} - ${history.saida ? formatDateAsLocale(history.saida, true) : 'N/A'}`
              : 'N/A'}
          </h1>
        </div>
      </div>
      <div className="bg-primary/10 flex w-full items-center justify-center rounded p-2">
        <h1 className="text-[0.6rem] font-medium">{history.anotacoes}</h1>
      </div>
    </div>
  )
}
