import { TProject, TProjectDTO } from '@/utils/schemas/projects'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import TextInput from '@/components/inputs/Text'
import DateInput from '@/components/inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import toast from 'react-hot-toast'

type NewMaintenanceMenuProps = {
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function NewMaintenanceMenu({ infoHolder, setInfo, changes, setChanges }: NewMaintenanceMenuProps) {
  const [maintenanceHolder, setMaintenanceHolder] = useState<TProject['manutencoes'][number]>({
    titulo: '',
  })

  function addNewMaintenance(info: TProject['manutencoes'][number]) {
    const maintenances = [...infoHolder.manutencoes]
    maintenances.push(info)
    setInfo((prev) => ({ ...prev, manutencoes: maintenances }))
    setChanges((prev) => ({ ...prev, manutencoes: maintenances }))
    return toast.success('Manutenção adicionada com sucesso !', { duration: 500 })
  }

  return (
    <motion.div
      key={'editor'}
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="border-primary/60 flex w-[90%] flex-col self-center rounded border p-3 lg:w-[80%]"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="font-bold tracking-tight">NOVA MANUTENÇÃO</h1>
      </div>
      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:w-[60%]">
          <TextInput
            label="TÍTULO"
            placeholder="Preencha aqui o título da manutenção..."
            value={maintenanceHolder.titulo}
            handleChange={(value) => setMaintenanceHolder((prev) => ({ ...prev, titulo: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[40%]">
          <DateInput
            label="DATA"
            value={maintenanceHolder.dataEfetivacao ? formatDate(maintenanceHolder.dataEfetivacao) : undefined}
            handleChange={(value) => setMaintenanceHolder((prev) => ({ ...prev, dataEfetivacao: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-end">
        <button
          onClick={() => addNewMaintenance(maintenanceHolder)}
          className="disabled:bg-primary/60 rounded bg-green-900 px-4 py-1 text-xs font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-green-800 enabled:hover:text-white disabled:text-white"
        >
          ADICIONAR
        </button>
      </div>
    </motion.div>
  )
}

export default NewMaintenanceMenu
