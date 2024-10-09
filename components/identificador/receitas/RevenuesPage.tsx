import { Session } from 'next-auth'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ReceiptsBlock from './blocos/ReceiptsBlock'
import RevenuesBlock from './blocos/RevenuesBlock'
import { Button } from '@/components/ui/button'
import NewRevenue from './NewRevenue'

type RevenuesPageProps = {
  session: Session
  initialRevenuesTypesFilter: string[]
  initialReceiptsTypesFilter: string[]
}
function RevenuesPage({ session, initialRevenuesTypesFilter, initialReceiptsTypesFilter }: RevenuesPageProps) {
  const [newRevenueModalIsOpen, setNewRevenueModalIsOpen] = useState<boolean>(false)
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">RECEITAS</p>
          </div>
          <Button onClick={() => setNewRevenueModalIsOpen(true)}>NOVA RECEITA</Button>
        </div>
      </div>
      <div className="flex max-h-[600px] w-full flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-[40%]">
          <ReceiptsBlock session={session} initialReceiptsTypesFilter={initialReceiptsTypesFilter} />
        </div>
        <div className="w-full lg:w-[60%]">
          <RevenuesBlock session={session} />
        </div>
      </div>
      {newRevenueModalIsOpen ? <NewRevenue session={session} closeModal={() => setNewRevenueModalIsOpen(false)} /> : null}
    </div>
  )
}

export default RevenuesPage
