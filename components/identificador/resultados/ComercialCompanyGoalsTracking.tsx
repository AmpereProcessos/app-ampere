import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { formatDecimalPlaces, sellerPhotos } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { TCompanyGoalsResults } from '@/utils/schemas/stats'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { BsCalendar } from 'react-icons/bs'
import { FaStar } from 'react-icons/fa'
import { FaRankingStar } from 'react-icons/fa6'
import { GoGoal } from 'react-icons/go'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const GoalsParams = {
  'SISTEMA FOTOVOLTAICO': {
    'META GERAL': 5_000_000,
    'OBJETIVO POR PERIODO': 833_333.33,
    'QTDE PREMIADOS': 3,
  },
  'OPERAÇÃO E MANUTENÇÃO': {
    'META GERAL': 120_000,
    'OBJETIVO POR PERIODO': 15_000,
    'QTDE PREMIADOS': 2,
  },
  'INSIDE SALES': {
    'META GERAL': 500_000,
    'OBJETIVO POR PERIODO': 83_333.33,
    'QTDE PREMIADOS': 3,
  },
  'SEGURO DE SISTEMA FOTOVOLTAICO': {
    'META GERAL': 12_000,
    'OBJETIVO POR PERIODO': 2_000,
    'QTDE PREMIADOS': 1,
  },
  'CONSÓRCIO DE ENERGIA': {
    'META GERAL': 150_000,
    'OBJETIVO POR PERIODO': 25_000,
    'QTDE PREMIADOS': 2,
  },
}
function renderRanking({ competitors, awardedQty }: { competitors: { RESPONSAVEL: string; TOTAL: number }[]; awardedQty: number }) {
  const podium = [
    {
      position: '4º',
      positionValue: 4,
      competitor: competitors[3]?.RESPONSAVEL || null,
      competitorResult: competitors[3]?.TOTAL || 0,
      podiumHeight: 2 / 5,
      awarded: awardedQty >= 4,
    },
    {
      position: '2º',
      positionValue: 2,
      competitor: competitors[1]?.RESPONSAVEL || null,
      competitorResult: competitors[1]?.TOTAL || 0,
      podiumHeight: 4 / 5,
      awarded: awardedQty >= 2,
    },
    {
      position: '1º',
      positionValue: 1,
      competitor: competitors[0]?.RESPONSAVEL || null,
      competitorResult: competitors[0]?.TOTAL || 0,
      podiumHeight: 5 / 5,
      awarded: awardedQty >= 1,
    },
    {
      position: '3º',
      positionValue: 3,
      competitor: competitors[2]?.RESPONSAVEL || null,
      competitorResult: competitors[2]?.TOTAL || 0,
      podiumHeight: 3 / 5,
      awarded: awardedQty >= 3,
    },
    {
      position: '5º',
      positionValue: 5,
      competitor: competitors[4]?.RESPONSAVEL || null,
      competitorResult: competitors[4]?.TOTAL || 0,
      podiumHeight: 1 / 5,
      awarded: awardedQty >= 5,
    },
  ]
  return podium.map((podiumPosition, index) => (
    <div key={index} className={cn('h-full w-1/3 flex-col justify-end gap-2 lg:w-1/5', podiumPosition.positionValue > 3 ? 'hidden lg:flex' : 'flex')}>
      {renderAvatarBySeller(podiumPosition.competitor || 'N/A')}
      <h1 className="text-center text-sm font-bold text-gray-500">{podiumPosition.competitor || 'N/A'}</h1>
      <div className="flex w-full flex-col justify-end">
        <div
          style={{ height: `${podiumPosition.podiumHeight * 280}px` }}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-1 bg-gray-500',
            podiumPosition.positionValue == 1 ? 'bg-[#fead41]' : '',
            podiumPosition.positionValue > 1 && podiumPosition.positionValue < 4 ? 'bg-[#15599a]' : ''
          )}
        >
          {podiumPosition.awarded ? <FaStar color="#fff" /> : null}
          <p className="text-3xl font-bold text-white">{podiumPosition.position}</p>
        </div>
      </div>
    </div>
  ))
}
function renderAvatarBySeller(sellerName: string) {
  if (!sellerName) {
    return (
      <div className="flex h-[30px] max-h-[50px] w-[30px] max-w-[50px] items-center justify-center self-center rounded-full bg-gray-700 lg:h-[50px] lg:w-[50px]">
        <p className="text-center text-xs font-bold text-white lg:text-lg">V</p>
      </div>
    )
  }
  const existingSellerWithPhoto = sellerPhotos.find((x) => x.nome == sellerName)
  if (!existingSellerWithPhoto) {
    const splittedName = sellerName.split(' ')
    const firstLetter = splittedName[0][0]
    var secondLetter
    if (['DE', 'DA', 'DO', 'DOS', 'DAS'].includes(splittedName[1])) secondLetter = splittedName[2] ? splittedName[2][0] : ''
    else secondLetter = splittedName[1] ? splittedName[1][0] : ''

    return (
      <div className="flex h-[30px] max-h-[50px] w-[30px] max-w-[50px] items-center justify-center self-center rounded-full bg-gray-700 lg:h-[50px] lg:w-[50px]">
        <p className="text-center text-xs font-bold uppercase text-white lg:text-lg">
          {firstLetter}
          {secondLetter}
        </p>
      </div>
    )
  }
  return (
    <div className="relative h-[30px] max-h-[50px] w-[30px] max-w-[50px] self-center lg:h-[50px] lg:w-[50px]">
      <Image fill={true} src={existingSellerWithPhoto.avatar_url} alt={existingSellerWithPhoto.nome} style={{ borderRadius: '100%' }} />
    </div>
  )
}

type ComercialCompanyGoalsTrackingProps = {
  results: TCompanyGoalsResults
}
function ComercialCompanyGoalsTracking({ results }: ComercialCompanyGoalsTrackingProps) {
  const [activeGoal, setActiveGoal] = useState<keyof TCompanyGoalsResults>('SISTEMA FOTOVOLTAICO')

  const activeGoalResults = results[activeGoal]
  const activeGoalParams = GoalsParams[activeGoal]

  useEffect(() => {
    const updateString = () => {
      const params = Object.keys(GoalsParams)
      const currentIndex = params.indexOf(activeGoal)
      const nextIndex = currentIndex + 1 >= params.length ? 0 : currentIndex + 1
      const newActiveGoal = params[nextIndex] as keyof TCompanyGoalsResults
      setActiveGoal(newActiveGoal)
    }

    const intervalId = setInterval(updateString, 10000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [activeGoal, GoalsParams, results])

  return (
    <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] shadow-sm">
      <div className="flex w-full flex-col items-center justify-between gap-2 rounded-tr-xl rounded-tl-xl bg-blue-800 p-2 px-4 lg:flex-row">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold uppercase tracking-tight text-white">VISUALIZAÇÃO DA META SEMESTRAL</h1>
          <div className="flex items-center gap-2 text-xs text-white">
            <BsCalendar color="#fff" />
            <p className="font-medium tracking-tight">01/07/2024 - 31/12/2024</p>
          </div>
        </div>
        <div className="flex grow flex-wrap items-center justify-center gap-2 lg:justify-end">
          {Object.keys(GoalsParams).map((key) => (
            <button
              key={key}
              className={cn(
                'rounded-xl border border-[#fff]/60 bg-transparent px-2 py-1 text-[0.6rem] font-bold text-[#fff]/60',
                activeGoal == key ? 'bg-[#fff] text-[#15599a]' : ''
              )}
              onClick={() => setActiveGoal(key as keyof TCompanyGoalsResults)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 py-6 px-6 lg:px-24">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-center gap-2">
            <GoGoal />
            <h1 className="text-base font-bold uppercase">META GERAL</h1>
          </div>
          <div className="flex h-[40px] w-full items-center justify-between self-center overflow-hidden rounded-sm border border-gray-500 bg-[#a8a9aa] p-0.5">
            <div
              style={{ width: `${(activeGoalResults.TOTAL / activeGoalParams['META GERAL']) * 100}%` }}
              className="flex h-full flex-col items-center justify-center rounded-sm bg-gradient-to-r from-yellow-300 to-[#fead41]"
            >
              <p className="bg-transparent text-xxs font-bold tracking-tight text-[#15599a] lg:text-sm">
                {formatDecimalPlaces((activeGoalResults.TOTAL * 100) / activeGoalParams['META GERAL'])}%
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-center gap-2">
            <FaRankingStar />
            <h1 className="text-base font-bold uppercase">RANKING</h1>
          </div>
          <div className="flex w-full justify-center gap-2">
            <div className="flex w-full items-center justify-center lg:w-[70%]">
              <div className="flex w-full items-center justify-center">
                <div className="mb-2 flex w-full flex-col items-center">
                  <div className="flex h-fit w-full items-end justify-center gap-4 p-0 lg:h-[425px] lg:w-[1200px] lg:gap-10 lg:p-6">
                    {renderRanking({ competitors: activeGoalResults.RANKING, awardedQty: activeGoalParams['QTDE PREMIADOS'] })}
                    {/* <div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
                      {renderAvatarBySeller(activeGoalResults.RANKING[3]?.RESPONSAVEL || 'N/A')}
                      <h1 className="text-center text-sm font-bold text-gray-500">{activeGoalResults.RANKING[3]?.RESPONSAVEL}</h1>
                      <div className="flex h-[30%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">4º</div>
                    </div>
                    <div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
                      {renderAvatarBySeller(activeGoalResults.RANKING[1]?.RESPONSAVEL || 'N/A')}
                      <h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{activeGoalResults.RANKING[1]?.RESPONSAVEL || 'N/A'}</h1>
                      <div className="flex h-[60%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">2º</div>
                    </div>
                    <div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
                      {renderAvatarBySeller(activeGoalResults.RANKING[0]?.RESPONSAVEL || 'N/A')}
                      <h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{activeGoalResults.RANKING[0]?.RESPONSAVEL || 'N/A'}</h1>
                      <div className="flex w-full grow items-center justify-center bg-[#fead41] text-3xl font-bold text-white">1º</div>
                    </div>
                    <div className="flex h-full w-1/3 flex-col justify-end lg:w-1/5">
                      {renderAvatarBySeller(activeGoalResults.RANKING[2]?.RESPONSAVEL || 'N/A')}
                      <h1 className="text-center text-xs font-bold text-gray-500 lg:text-sm">{activeGoalResults.RANKING[2]?.RESPONSAVEL || 'N/A'}</h1>
                      <div className="flex h-[40%] w-full items-center justify-center bg-[#15599a] text-3xl font-bold text-white">3º</div>
                    </div>
                    <div className="hidden h-full w-1/5 flex-col justify-end lg:flex">
                      {renderAvatarBySeller(activeGoalResults.RANKING[4]?.RESPONSAVEL || 'N/A')}
                      <h1 className="text-center text-sm font-bold text-gray-500">{activeGoalResults.RANKING[4]?.RESPONSAVEL || 'N/A'}</h1>
                      <div className="flex h-[15%] w-full items-center justify-center bg-gray-500 text-3xl font-bold text-white">5º</div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComercialCompanyGoalsTracking
