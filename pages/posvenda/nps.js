import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { FixedSizeList } from 'react-window'
import { ImSad } from 'react-icons/im'

import { useNPS } from '../../utils/methods/query/aftersales'
import { formatDecimalPlaces, validateAuthorization } from '../../utils/constants'

import NPSCard from '../../components/NPSCard'
import LoadingPage from '../../components/utils/LoadingPage'
import ErrorPage from '../../components/utils/ErrorPage'
import NPSFilterBlock from '../../components/identificador/posvenda/NPSFilterBlock'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { VscDiffAdded } from 'react-icons/vsc'
import { BiHappyAlt, BiSad } from 'react-icons/bi'
import { MdGrade } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'

function NPS() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data, isLoading, isSuccess, isError, filters, setFilters } = useNPS(validateAuthorization(session, 'Pós-Venda'))

  function getStats({ info }) {
    if (!info)
      return {
        projetos: 0,
        coletados: 0,
        promotores: 0,
        detratores: 0,
        nps: 0,
      }
    const projectsQty = info.length
    const { promoters, detrators, collected } = info.reduce(
      (acc, current) => {
        const currentNPSValue = current.nps
        if (currentNPSValue != null && currentNPSValue >= 9) acc.promoters = acc.promoters + 1
        if (currentNPSValue != null && currentNPSValue <= 6) acc.detrators = acc.detrators + 1
        if (currentNPSValue != null && currentNPSValue <= 10) acc.collected = acc.collected + 1
        return acc
      },
      { promoters: 0, detrators: 0, collected: 0 }
    )
    const nps = ((promoters - detrators) * 100) / collected

    return {
      projetos: projectsQty,
      coletados: collected,
      promotores: promoters,
      detratores: detrators,
      nps: formatDecimalPlaces(nps, 2),
    }
  }
  function getNPSValue(data) {
    if (!data) return 0
    const reduced = data.reduce(
      (acc, current) => {
        if (acc == {}) {
          acc = {
            promoter: 0,
            detrator: 0,
          }
        }
        const currentNPSValue = current.nps
        if (currentNPSValue && currentNPSValue >= 9) acc.promoter = acc.promoter + 1
        if (currentNPSValue && currentNPSValue <= 6) acc.detrator = acc.detrator + 1
        if (currentNPSValue && currentNPSValue >= 0 && currentNPSValue <= 10) acc.collected = acc.collected + 1
        return acc
      },
      { promoter: 0, detrator: 0, collected: 0 }
    )
    const nps = ((reduced.promoter - reduced.detrator) * 100) / reduced.collected
    return nps.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const renderCards = useMemo(() => data?.map((project, index) => <NPSCard key={project._id} project={project} />), [data])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow bg-[#fff] p-6">
        <div className="mb-6 flex flex-col items-center border-b border-gray-200 pb-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">COLETA DE NPS</p>
            </div>
            {dropdownMenuVisible ? (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
              </div>
            ) : (
              <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
              </div>
            )}
          </div>
          <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PROJETOS NO ESTÁGIO</h1>
                <VscDiffAdded />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).projetos}</div>
                <p className="text-xs text-gray-500">{getStats({ info: data }).coletados} coletados</p>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">PROMOTORES</h1>
                <BiHappyAlt />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).promotores}</div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">DETRATORES</h1>
                <BiSad />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).detratores}</div>
              </div>
            </div>
            <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium uppercase tracking-tight">NPS</h1>
                <MdGrade />
              </div>
              <div className="mt-2 flex w-full flex-col">
                <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: data }).nps}%</div>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {dropdownMenuVisible ? (
              <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
                <NPSFilterBlock filters={filters} setFilters={setFilters} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="mt-4 flex flex-wrap justify-around gap-3">
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={'Houve um erro na busca dos registros...'} /> : null}
          {isSuccess ? (
            data.length > 0 ? (
              renderCards
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <ImSad style={{ fontSize: '50px', color: '#fead61' }} />
                <p className="w-full text-center text-sm italic text-gray-600 lg:w-[50%]">
                  Oops, parece que não há projetos que se enquadrem nos filtros definidos.
                </p>
              </div>
            )
          ) : null}
        </div>
      </div>
    )
  }
}

export default NPS
