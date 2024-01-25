import Fireworks from '@fireworks-js/react'
import React, { useEffect, useRef, useState } from 'react'
import AmpereTeam from '../utils/images/time-ampere.jpg'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import NewForm from '../components/identificador/almoxarifado/formulario/NewForm'
import dayjs from 'dayjs'
import axios from 'axios'
import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import FormularyCard from '@/components/identificador/almoxarifado/formulario/FormularyCard'
import { useQueryClient } from 'react-query'
import EditForm from '@/components/identificador/almoxarifado/formulario/EditForm'

const currentDate = dayjs()
const beforeParam = currentDate.toISOString()
const afterParam = currentDate.subtract(3, 'month').toISOString()
function Test() {
  const queryClient = useQueryClient()
  const { data: session, status } = useSession()
  const ref = useRef()
  const [forms, setForms] = useState<(TNewWarehouseFormulary & { _id: string })[]>([])
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [modalForm, setModalForm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })
  async function getForms() {
    try {
      const { data } = await axios.get(`/api/almoxarifado/formularios/test/?after=${afterParam}&before=${beforeParam}`)
      setForms(data.data)
    } catch (error) {
      throw error
    }
  }
  useEffect(() => {
    const func = async () => await getForms()
    func()
  }, [])

  if (status != 'authenticated') return <></>
  return (
    <div className="flex grow flex-col p-6">
      <button onClick={() => setModalIsOpen(true)}>ABRIR MODAL</button>
      {modalIsOpen ? (
        <NewForm
          session={session}
          closeModal={() => setModalIsOpen(false)}
          invalidateQuery={async () => await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', afterParam, beforeParam] })}
        />
      ) : null}
      <div className="flex w-full flex-wrap gap-3">
        {forms.map((formulary) => (
          <FormularyCard formulary={formulary} openModal={(id) => setModalForm({ isOpen: true, id: id })} />
        ))}
      </div>
      {modalForm.id && modalForm.isOpen ? (
        <EditForm
          formularyId={modalForm.id}
          session={session}
          invalidateQuery={async () => await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', afterParam, beforeParam] })}
          closeModal={() => setModalForm({ isOpen: false, id: null })}
        />
      ) : null}
    </div>
  )
}

export default Test
