import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { FixedSizeList } from 'react-window'
import { ImSad } from 'react-icons/im'

import { useNPS } from '../../utils/methods/query/aftersales'
import { validateAuthorization } from '../../utils/constants'

import NPSCard from '../../components/NPSCard'
import LoadingPage from '../../components/utils/LoadingPage'
import NPSFilterBlock from '../../components/identificador/posvenda/NPSFilterBlock'

function NPS() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/authHome')
    },
  })
  const { data, isFetching, isSuccess, filters, setFilters } = useNPS(validateAuthorization(session, 'Pós-Venda'))

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
  const renderCards = useMemo(
    () => data?.map((project, index) => <NPSCard key={project._id} credentials={session?.user} project={project} />),
    [data]
  )
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="p-6 grow bg-[#fff]">
        <div className="flex flex-col border-b border-gray-200 mb-6 pb-2 items-center">
          <div className="flex items-center justify-between w-full ">
            <h1 className="text-xl font-bold tracking-tight">
              COLETA DE NPS <strong className={`${!data ? 'animate-pulse' : ''}`}>({data?.length || '...'})</strong>
            </h1>
            <p className="text-green-500 font-bold border border-green-500 text-lg p-1 rounded">{getNPSValue(data)} %</p>
          </div>

          <NPSFilterBlock filters={filters} setFilters={setFilters} />
        </div>
        <div className="flex flex-wrap mt-4 gap-3 justify-around">
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
          {/* {filteredProjects.map((project) => (
            <NPSCard
              credentials={session?.user}
              key={project._id}
              project={project}
            />
          ))} */}
        </div>
      </div>
    )
  }
}

export default NPS
