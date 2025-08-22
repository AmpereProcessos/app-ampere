import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import ModalCallPPS from '../../components/ModalCallPPS'
import { AiOutlineSearch, AiOutlineReload } from 'react-icons/ai'

import Link from 'next/link'

import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'

import { useSession } from '../../components/providers/SessionProvider'
import LoadingPage from '../../components/utils/LoadingPage'

import OpenCalls from '../../components/identificador/chamados/pps/OpenCalls'
import ClosedCalls from '../../components/identificador/chamados/pps/ClosedCalls'
var dateFilterParam = new Date()
dateFilterParam.setHours(0, 0, 0, 0)
dateFilterParam.setDate(dateFilterParam.getDate() - 2)
const statusStyles = {
  'EM ANDAMENTO': {
    textColor: 'text-[#15599a]',
    borderColor: 'border-[#15599a]',
  },
  'AGUARDANDO VENDEDOR': {
    textColor: 'text-orange-400',
    borderColor: 'border-orange-400',
  },
  REALIZADO: {
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
  },
  PENDENTE: {
    textColor: 'text-red-400',
    borderColor: 'border-red-400',
  },
}

function ChamadosPPS() {
  // Context and utils
  const router = useRouter()

  const { session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  // Modal handlers
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalCall, setModalCall] = useState({})

  // Functions
  function getCalls() {
    axios.get('/api/chamados/pps/mainData').then((res) => {
      setStats(res.data.stats)
      setInProgress(res.data.inProgress)
      setFilteredInProgress(res.data.inProgress)
      setClosedCalls(res.data.closedCalls)
      setRespFilter([])
      setStatusFilter([])
    })
  }

  function updateModalInfo(id) {
    axios.get(`/api/chamados/getPPS/${id}`).then((res) => {
      setModalCall(res.data)
      getCalls()
    })
  }

  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex w-full grow flex-col gap-y-2 bg-gray-100 p-6">
        <div className="flex w-full flex-col items-center justify-between border border-gray-300 bg-[#fff] p-4 shadow-xl lg:flex-row">
          <p className="text-center font-['Roboto'] text-2xl font-bold uppercase text-[#15599a]">CHAMADOS DE SUPORTE AO VENDEDOR</p>
          <FetchDataButton text={'ATUALIZAR'} icon={<AiOutlineReload />} handleClick={getCalls} />
        </div>
        {/* Abertos */}
        <OpenCalls />
        {/* Fechados */}
        <ClosedCalls />
        <Link href="/publico/chamadoExternoPPS">
          <div className="left-150 fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
            <p className="text-sm font-bold uppercase">Novo chamado</p>
          </div>
        </Link>
        {modalIsOpen && (
          <ModalCallPPS
            modalIsOpen={modalIsOpen}
            updateModalInfo={updateModalInfo}
            info={modalCall}
            setModalIsOpen={setModalIsOpen}
            open={modalIsOpen}
          />
        )}
      </div>
    )
  }
}

export default ChamadosPPS
