import Fireworks from '@fireworks-js/react'
import React, { useRef, useState } from 'react'
import AmpereTeam from '../utils/images/time-ampere.jpg'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import NewForm from '../components/identificador/almoxarifado/formulario/NewForm'
function Test() {
  const { data: session, status } = useSession()
  const ref = useRef()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  if (status != 'authenticated') return <></>
  return (
    <div className="flex grow flex-col p-6">
      <button onClick={() => setModalIsOpen(true)}>ABRIR MODAL</button>
      {modalIsOpen ? <NewForm session={session} closeModal={() => setModalIsOpen(false)} /> : null}
    </div>
  )
}

export default Test
