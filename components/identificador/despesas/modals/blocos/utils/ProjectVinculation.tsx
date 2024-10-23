import ProjectVinculationMenu from '@/components/identificador/projects/ProjectVinculationMenu'
import { getErrorMessage } from '@/utils/methods/handlers'
import { updateExpense } from '@/utils/methods/mutation/expenses'

import { TExpense } from '@/utils/schemas/expenses'
import { TProjectDTODBSimplified } from '@/utils/schemas/projects'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaLink } from 'react-icons/fa'
import { QueryClient, useMutation } from '@tanstack/react-query'

type ProjectVinculationProps = {
  expenseId?: string
  queryClient: QueryClient
  affectedQueryKey: any[]
  infoHolder: TExpense
  setInfoHolder: React.Dispatch<React.SetStateAction<TExpense>>
}
function ExpenseProjectVinculation({ expenseId, queryClient, affectedQueryKey, infoHolder, setInfoHolder }: ProjectVinculationProps) {
  const [vinculationModalIsOpen, setVinculationModalIsOpen] = useState<boolean>(false)

  const { mutate, isPending } = useMutation({
    mutationKey: ['update-expense-project', expenseId],
    mutationFn: handleVinculate,
    onMutate: async () => {
      if (expenseId) await queryClient.cancelQueries({ queryKey: affectedQueryKey })
    },
    onSuccess: async (data) => {
      return toast.success(data)
    },
    onSettled: async () => {
      if (expenseId) await queryClient.invalidateQueries({ queryKey: affectedQueryKey })
    },
    onError: (error) => {
      const msg = getErrorMessage(error)
      return toast.error(msg)
    },
  })

  async function handleVinculate(projectSimplified: TProjectDTODBSimplified) {
    setInfoHolder((prev) => ({ ...prev, projeto: { id: projectSimplified._id, nome: projectSimplified.nomeDoContrato } }))
    if (!!expenseId) {
      const msg = await updateExpense({
        id: expenseId,
        changes: { ...infoHolder, projeto: { id: projectSimplified._id, nome: projectSimplified.nomeDoContrato } },
      })
      return msg
    }
    return 'Vinculação feita com sucesso !'
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DO PROJETO</h1>
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <h1 className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum projeto vinculado.</h1>
        <button
          onClick={() => setVinculationModalIsOpen(true)}
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white duration-300 ease-in-out hover:bg-blue-700"
        >
          <FaLink />
          <h1>VINCULAR</h1>
        </button>
        {vinculationModalIsOpen ? (
          <ProjectVinculationMenu
            handleSelect={(projectSimplified) => mutate(projectSimplified)}
            closeModal={() => setVinculationModalIsOpen(false)}
          />
        ) : null}
      </div>
    </div>
  )
}

export default ExpenseProjectVinculation
