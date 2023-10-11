import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import ModalCallPPS from '../../components/ModalCallPPS'
import { AiOutlineSearch, AiOutlineReload } from 'react-icons/ai'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { MdDateRange } from 'react-icons/md'
import Link from 'next/link'
import Select from 'react-select'
import dayjs from 'dayjs'
import { AppContext } from '../../context/AppContext'
import { AnimatePresence, motion } from 'framer-motion'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import FilterButton from '../../components/utils/Buttons/FilterButton'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../components/utils/LoadingPage'
import { respChamadosPPS } from '../../utils/constants'
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

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
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
      <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full border border-gray-200 bg-[#fff] shadow-xl p-4">
          <p className="font-bold uppercase text-center text-2xl text-[#15599a] font-['Roboto']">CHAMADOS DE SUPORTE AO VENDEDOR</p>
          <FetchDataButton text={'ATUALIZAR'} icon={<AiOutlineReload />} handleClick={getCalls} />
        </div>
        {/* Abertos */}
        <OpenCalls />
        {/* Fechados */}
        <ClosedCalls />
        <Link href="/publico/chamadoExternoPPS">
          <div className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
            <p className="uppercase font-bold text-sm">Novo chamado</p>
          </div>
        </Link>
        {modalIsOpen && (
          <ModalCallPPS
            modalIsOpen={modalIsOpen}
            credentials={session?.user}
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
