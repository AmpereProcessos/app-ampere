import ContractPDFPage from '@/components/identificador/solicitacoesContrato/ContractPDFPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { useSession } from '@/components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React from 'react'

function ContractPage() {
  const { session, status } = useSession({ required: true })
  const { query } = useRouter()
  const { id } = query
  if (!id) return <ErrorComponent msg={'ID inválido ou não fornecido.'} />
  return <ContractPDFPage id={id as string} />
}

export default ContractPage
