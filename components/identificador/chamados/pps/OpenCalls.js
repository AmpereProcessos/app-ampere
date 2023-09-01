import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'

import TextInput from '../../../inputs/Text'
import SelectInput from '../../../inputs/Select'
import { formatLongString, respChamadosPPS } from '../../../../utils/constants'
import { fetchPPSCall, useOpenPPSCalls, usePPSCall } from '../../../../utils/methods/query/ppsCalls'
import LoadingPage from '../../../utils/LoadingPage'
import OpenCallCard from './OpenCallCard'
import { toast } from 'react-hot-toast'
import { getErrorMessage } from '../../../../utils/methods/handlers'
import { useSession } from 'next-auth/react'
import ModalCallPPS from '../../../ModalCallPPS'
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

function OpenCalls() {
  const { data: calls, isLoading, isFetched } = useOpenPPSCalls(true)

  const [modalCallIsOpen, setModalCallIsOpen] = useState(false)
  const [modalCallId, setModalCallId] = useState()
  const [filterMenuVisible, setFilterMenuVisible] = useState(false)
  const [filters, setFilters] = useState({
    seller: '',
    status: null,
    responsible: null,
  })
  async function handleOpenModal(id) {
    setModalCallId(id)
    setModalCallIsOpen(true)
  }
  return (
    <div className="flex flex-col w-full border h-[1200px] lg:h-[720px] border-gray-200 bg-[#fff] shadow-xl p-4">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 font-Raleway">
            <p className="text-center uppercase text-[#15599a] font-bold text-xl">Chamados abertos</p>
            <p className="font-bold text-[#fead61]">({isFetched ? calls.length : '...'})</p>
          </div>
          {filterMenuVisible ? (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuVisible(false)} />
            </div>
          ) : (
            <div className="text-gray-600 hover:text-blue-400 cursor-pointer">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuVisible(true)} />
            </div>
          )}
        </div>
        <AnimatePresence>
          {filterMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col w-full gap-y-2 mt-4">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-2 flex-wrap">
                <TextInput
                  showLabel={false}
                  placeholder={'Digite aqui o nome do vendedor...'}
                  value={filters.seller}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, seller: value }))}
                />
                <div className="w-full lg:w-[250px]">
                  <SelectInput
                    showLabel={false}
                    selectedItemLabel={'TODOS OS STATUS'}
                    options={[
                      [
                        {
                          id: 1,
                          value: 'PENDENTE',
                          label: 'PENDENTE',
                        },
                        {
                          id: 2,
                          value: 'EM ANDAMENTO',
                          label: 'EM ANDAMENTO',
                        },
                      ],
                    ]}
                    value={filters.status}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <SelectInput
                    showLabel={false}
                    selectedItemLabel={'TODOS OS RESPONSÁVEIS'}
                    options={respChamadosPPS.map((resp, index) => ({ id: index, label: resp.label, value: resp.value }))}
                    value={filters.responsible}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, responsible: value }))}
                    width={'100%'}
                  />
                </div>
                {/* <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterOpenCalls} /> */}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex grow px-2 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-2 flex-wrap gap-2 justify-around">
        {isLoading ? <LoadingPage /> : null}
        {isFetched ? (
          calls?.length > 0 ? (
            calls.map((call) => <OpenCallCard key={call._id} call={call} handleOpenModal={(call) => handleOpenModal(call._id)} />)
          ) : (
            <div className="w-full flex grow flex-col items-center justify-center">
              <p className="font-black text-[#fead41] text-lg">EBA !!!</p>
              <p className="font-medium italic text-gray-500 text-md">Não há chamados em aberto...</p>
            </div>
          )
        ) : null}
      </div>
      {modalCallIsOpen && <ModalCallPPS callId={modalCallId} modalIsOpen={modalCallIsOpen} closeModal={() => setModalCallIsOpen(false)} />}
    </div>
  )
}

export default OpenCalls
