import axios from 'axios'
import { useSession } from '../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import FetchDataButton from '../../components/utils/Buttons/FetchDataButton'
import { MdDateRange } from 'react-icons/md'
import { BsDownload } from 'react-icons/bs'
import dayjs from 'dayjs'
import LeadCard from '../../components/LeadCard'
import ListLeads from '../../components/ListLeads'
import { formatDate } from '../../utils/constants'
import LeadsLostBlock from '../../components/LeadsLostBlock'

var dateFilterParam = new Date()
dateFilterParam.setMonth(dateFilterParam.getMonth() - 6)
function SellerLeads() {
  const router = useRouter()
  const { session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const [leads, setLeads] = useState()
  const [fetchDateFilter, setFetchDateFilter] = useState({
    after: new Date(dateFilterParam).toISOString(),
    before: new Date(dayjs().hour(22).$d).toISOString(),
  })

  async function getSellerLeads() {
    try {
      const { data } = await axios.post('/api/insideSales', {
        match: {
          vendedor: session?.user.visualizacao.referencia,
          dataDeAquisicao: {
            $gte: new Date(fetchDateFilter.after).toISOString(),
            $lt: fetchDateFilter.before,
          },
        },
      })
      let obj = {
        inPresentation: data.filter((p) => (p.estagioFunil == 1 || !p.estagioFunil) && !p.perdido),
        inFollowUp: data.filter((p) => p.estagioFunil == 2 && !p.perdido),
        closed: data.filter((p) => p.estagioFunil == 3 && !p.perdido),
        lost: data.filter((p) => !!p.perdido),
      }
      setLeads(obj)
    } catch (error) {
      alert('Erro ao buscar leads.')
    }
  }
  async function getGeneralLeads() {
    try {
      const { data } = await axios.post('/api/insideSales', {
        match: {
          dataDeAquisicao: {
            $gte: new Date(fetchDateFilter.after).toISOString(),
            $lt: fetchDateFilter.before,
          },
        },
      })
      let obj = {
        inPresentation: data.filter((p) => (p.estagioFunil == 1 || !p.estagioFunil) && !p.perdido),
        inFollowUp: data.filter((p) => p.estagioFunil == 2 && !p.perdido),
        closed: data.filter((p) => p.estagioFunil == 3 && !p.perdido),
        lost: data.filter((p) => !!p.perdido),
      }
      setLeads(obj)
    } catch (error) {
      alert('Erro ao buscar leads.')
    }
  }
  useEffect(() => {
    if (session?.user) {
      if (!leads) {
        if (session?.user?.visualizacao.tipo == 'VENDAS') getSellerLeads()
      }
    } else {
      if (session?.user) {
        router.push('/')
      }
    }
  }, [session])
  return (
    <div className="flex grow flex-col bg-[#fff] p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-300 pb-2">
        <div className="flex w-full items-center justify-between">
          <p className="text-center text-2xl font-bold uppercase text-[#15599a]">MEUS LEADS</p>
          <div className="flex items-end gap-2">
            <div className="flex flex-col">
              <span className="font-['Roboto'] text-xs ">ADQUIRIDOS ENTRE:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <input
                  value={formatDate(fetchDateFilter.after)}
                  onChange={(e) =>
                    setFetchDateFilter({
                      ...fetchDateFilter,
                      after: dayjs(e.target.value).$d != 'Invalid Date' ? new Date(e.target.value).toISOString() : dateFilterParam,
                    })
                  }
                  type="date"
                  className="border border-gray-300 py-1 px-2 outline-none"
                />
                <p>&</p>
                <input
                  value={formatDate(fetchDateFilter.before)}
                  onChange={(e) =>
                    setFetchDateFilter({
                      ...fetchDateFilter,
                      before:
                        dayjs(e.target.value).$d != 'Invalid Date' ? dayjs(e.target.value).add('20', 'hour').toISOString() : new Date().toISOString(),
                    })
                  }
                  type="date"
                  className="border border-gray-300 py-1 px-2 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <FetchDataButton text={'BUSCAR'} icon={<MdDateRange />} handleClick={getSellerLeads} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full max-w-full  gap-4 overflow-x-auto py-2 shadow-lg scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        <ListLeads title={'Em atendimento'} listId={1} fetchLeads={getSellerLeads} leads={leads?.inPresentation ? leads.inPresentation : []} />
        <ListLeads title={'Em acompanhamento'} listId={2} fetchLeads={getSellerLeads} leads={leads?.inFollowUp ? leads.inFollowUp : []} />
        <ListLeads title={'Venda fechada'} listId={3} fetchLeads={getSellerLeads} leads={leads?.closed ? leads.closed : []} />
      </div>
      {leads?.lost ? <LeadsLostBlock lostLeads={leads.lost} /> : null}
    </div>
  )
}

export default SellerLeads
