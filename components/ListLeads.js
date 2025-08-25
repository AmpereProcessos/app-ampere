import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { FaCity, FaUser } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi'
import { IoIosSend } from 'react-icons/io'
import { MdAttachMoney, MdOutlineCategory } from 'react-icons/md'
import ListLeadCard from './ListLeadCard'
import axios from 'axios'

function ListLeads({ leads, title, listId, fetchLeads }) {
  const [filteredLeads, setFilteredLeads] = useState(leads)
  const [searchPropostas, setSearch] = useState('')
  async function handleDrop(itemId, listId) {
    console.log(itemId, listId)

    try {
      await axios.put('/api/insideSales', {
        id: itemId,
        changes: {
          estagioFunil: listId,
        },
      })
      fetchLeads()
    } catch (error) {
      alert('Erro ao atualizar estágio do lead. Por favor, tente novamente mais tarde.')
    }
  }

  function handleSearchFilter(value) {
    setSearch(value)
    if (value != '' || value != ' ') {
      let newArr = leads.filter((lead) => lead.nome.toUpperCase().includes(value.toUpperCase()))
      console.log(newArr)
      setFilteredLeads(newArr)
    } else {
      setFilteredLeads(leads)
    }
  }
  async function moveStage() {}
  const [, dropRef] = useDrop({
    accept: 'CARD',

    hover(item, monitor) {},
    drop(item, monitor) {
      handleDrop(item.id, listId)
    },
  })
  useEffect(() => {
    setFilteredLeads(leads)
  }, [leads])
  return (
    <div
      ref={dropRef}
      id={listId}
      className="bg-background border-primary/20 flex h-full max-h-[750px] w-[400px] min-w-[400px] grow flex-col items-center rounded border px-1 py-2 pt-2 shadow-lg"
    >
      <div className="h-fit w-full border-b border-blue-300 pb-2 text-center text-xl font-bold">
        <h1>{title}</h1>
        <div className="flex justify-center gap-x-2">
          <p className="text-primary/60 text-xs">{filteredLeads.length} lead(s)</p>
          {/* <p className="text-xs text-primary/60">
            {getListCumulativePeakPot()} kWp
          </p> */}
        </div>
        <input
          value={searchPropostas}
          onChange={(e) => handleSearchFilter(e.target.value)}
          className={'text-primary/80 border-primary/20 mt-2 w-full border p-1 text-center text-sm font-semibold outline-hidden'}
          placeholder={'Digite aqui o nome da proposta...'}
        />
      </div>
      <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 flex min-h-[450px] w-full flex-col gap-2 overflow-y-auto px-2 py-2">
        {filteredLeads && filteredLeads?.map((lead, index) => <ListLeadCard key={lead._id} lead={lead} fetchLeads={fetchLeads} />)}
      </div>
    </div>
  )
}

export default ListLeads
